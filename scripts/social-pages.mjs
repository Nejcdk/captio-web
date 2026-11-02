#!/usr/bin/env node
// Keeps content/social/pages.json: every English page on captioai.app that gets
// a post, in the order they are posted, and which post covers each one. Reads
// the live sitemap, so a new blog article joins the list once it is live and
// goes to the front.
//
//   node scripts/social-pages.mjs           refresh the list, print coverage
//   node scripts/social-pages.mjs --next 5  the next 5 pages without a post
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { loadPosts } from "./social-render.mjs";

const ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const LIST = path.join(ROOT, "content/social/pages.json");
const SITEMAP = "https://captioai.app/sitemap.xml";

// Captio AI is for in-person speech, so the calls use case gets no posts.
const SKIP_USE_CASES = ["phone-video-calls"];
const SKIP_PAGES = ["/privacy", "/terms", "/delete-account", "/blog", "/compare", "/use-cases"];
// The YouTube series' 10 languages go first among the use case x language pages.
const FIRST_LANGUAGES = ["english", "german", "polish", "spanish", "french", "dutch", "italian", "portuguese", "japanese", "korean"];

async function sitemapPaths() {
  const res = await fetch(SITEMAP);
  if (!res.ok) throw new Error(`${SITEMAP}: ${res.status}`);
  const xml = await res.text();
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => new URL(m[1]).pathname.replace(/\/$/, "") || "/");
}

async function languageSlugs() {
  const { languages } = await import(path.join(ROOT, "src/lib/languages.ts"));
  return languages.map((l) => l.languageSlug);
}

function classify(page, languages) {
  const parts = page.split("/").filter(Boolean);
  if (page === "/") return "home";
  if (SKIP_PAGES.includes(page)) return null;
  if (parts[0] === "use-cases") {
    if (SKIP_USE_CASES.includes(parts[1])) return null;
    return parts.length === 2 ? "use-case" : "use-case-language";
  }
  if (parts[0] === "blog") return parts.length === 2 && !["category", "author"].includes(parts[1]) ? "blog" : null;
  if (parts[0] === "compare") return parts.length === 2 ? "compare" : null;
  if (parts[0] === "organizations" && parts.length === 1) return "organizations";
  if (parts.length === 1 && languages.includes(parts[0])) return "language";
  if (parts.length === 1 && !/^[a-z]{2,3}(-[a-z]{2,4})?$/i.test(parts[0])) return "feature";
  return null; // translated pages (/de, /de/live-captions): posts are English only
}

// Use case x language pages: never two in a row with the same use case or the
// same language. Each round shifts which use case a language gets.
function interleave(pages, languageOrder) {
  const byLanguage = new Map(languageOrder.map((l) => [l, []]));
  for (const p of pages) byLanguage.get(p.split("/")[3])?.push(p);
  const groups = [...byLanguage.values()].filter((g) => g.length);
  const order = [];
  const rounds = Math.max(...groups.map((g) => g.length));
  for (let round = 0; round < rounds; round++) {
    groups.forEach((group, i) => {
      const page = group[(i + round) % group.length];
      if (!order.includes(page)) order.push(page);
    });
  }
  for (const g of groups) for (const p of g) if (!order.includes(p)) order.push(p);
  return order;
}

async function build() {
  const languages = await languageSlugs();
  const live = await sitemapPaths();
  const typed = live.map((page) => ({ page, type: classify(page, languages) })).filter((p) => p.type);
  const of = (type) => typed.filter((p) => p.type === type).map((p) => p.page);

  const useCaseLanguage = of("use-case-language");
  const first = FIRST_LANGUAGES.filter((l) => languages.includes(l));
  const rest = languages.filter((l) => !first.includes(l));
  const inLanguages = (list) => useCaseLanguage.filter((p) => list.includes(p.split("/")[3]));

  const ordered = [
    ...of("home"),
    ...of("feature"),
    ...of("use-case"),
    ...of("organizations"),
    ...of("blog").reverse(),
    ...languages.map((l) => `/${l}`).filter((p) => of("language").includes(p)),
    ...interleave(inLanguages(first), first),
    ...interleave(inLanguages(rest), rest),
    ...of("compare"),
  ];

  const old = existsSync(LIST) ? JSON.parse(readFileSync(LIST, "utf8")) : [];
  const known = new Set(old.map((p) => p.page));
  const typeOf = new Map(typed.map((p) => [p.page, p.type]));
  const postFor = new Map(loadPosts().map((p) => [p.page, p.id]));
  // Pages already in the list keep their place; new ones (a new blog article)
  // go to the front, ahead of everything not yet posted.
  const fresh = ordered.filter((p) => !known.has(p));
  const kept = old.filter((p) => typeOf.has(p.page)).map((p) => p.page);
  const pages = [...fresh, ...kept].map((page) => ({
    page,
    type: typeOf.get(page),
    post: postFor.get(page) ?? null,
  }));
  writeFileSync(LIST, `${JSON.stringify(pages, null, 1)}\n`);
  return pages;
}

const pages = await build();
const n = process.argv.indexOf("--next");
if (n > -1) {
  const count = Number(process.argv[n + 1]) || 1;
  for (const p of pages.filter((x) => !x.post).slice(0, count)) console.log(`${p.type} ${p.page}`);
} else {
  const done = pages.filter((p) => p.post).length;
  const types = {};
  for (const p of pages) types[p.type] = (types[p.type] ?? 0) + 1;
  console.log(`${pages.length} pages, ${done} with a post, ${pages.length - done} to go`);
  console.log(Object.entries(types).map(([t, c]) => `${t} ${c}`).join(", "));
}
