#!/usr/bin/env node
// Coverage report: for every feature (Feature map in CAPTIO_FACTS.md), every
// blog use case and every priority language (plan.json), how many articles are
// published and how many are queued, against the targets in plan.json.
// The daily run reads the gaps when it adds topics; nothing here blocks a run.
//
//   npm run blog:coverage            # tables + gaps
//   npm run blog:coverage -- --json  # machine-readable

import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

const read = (p) => fs.readFileSync(p, "utf8");
const plan = JSON.parse(read("content/blog/plan.json"));
const { topics } = JSON.parse(read("content/blog/topics.json"));

const facts = read("content/blog/CAPTIO_FACTS.md");
const mapSection = facts.slice(facts.indexOf("## Feature map"), facts.indexOf("\n## ", facts.indexOf("## Feature map") + 5));
const FEATURES = [...mapSection.matchAll(/^\| ([a-z0-9-]+) \| ([^|]+) \|/gm)].filter((m) => m[1] !== "id").map((m) => ({ id: m[1], name: m[2].trim() }));
const USE_CASES = plan.blogUseCases;
const ALL_LANGS = [...read("src/lib/languages.ts").matchAll(/languageSlug: "([a-z-]+)"/g)].map((m) => m[1]);
const TOP = plan.topLanguages;
const FEATURE_PAGES = { "/live-captions": "live-captions", "/live-translator": "live-translator", "/audio-transcription": "audio-transcription", "/ai-summary": "ai-summary" };

// What each published article covers: its topic's tags plus what its links point to.
const dir = "content/blog/posts";
const posts = fs.readdirSync(dir).filter((f) => f.endsWith(".md")).map((f) => {
  const slug = f.replace(/\.md$/, "");
  const { content } = matter(read(path.join(dir, f)));
  const topic = topics.find((t) => t.slug === slug);
  const cover = { features: new Set(topic?.covers?.features ?? []), useCases: new Set(topic?.covers?.useCases ?? []), languages: new Set(topic?.covers?.languages ?? []) };
  for (const [, href] of content.matchAll(/\]\((\/[^)\s#]*)/g)) {
    if (FEATURE_PAGES[href]) cover.features.add(FEATURE_PAGES[href]);
    const uc = href.match(/^\/use-cases\/([a-z-]+)(?:\/([a-z-]+))?$/);
    if (uc) {
      if (USE_CASES.includes(uc[1])) cover.useCases.add(uc[1]);
      if (uc[2]) cover.languages.add(uc[2]);
    }
    const lang = href.match(/^\/([a-z-]+)$/);
    if (lang && ALL_LANGS.includes(lang[1])) cover.languages.add(lang[1]);
  }
  return { slug, cover };
});
const queued = topics.filter((t) => t.status === "queued");

function count(kind, id) {
  return {
    published: posts.filter((p) => p.cover[kind].has(id)).length,
    queued: queued.filter((t) => (t.covers?.[kind] ?? []).includes(id)).length,
  };
}

const rows = {
  features: FEATURES.map((f) => ({ id: f.id, name: f.name, ...count("features", f.id), target: plan.targets.perFeature })),
  useCases: USE_CASES.map((u) => ({ id: u, ...count("useCases", u), target: plan.targets.perUseCase })),
  languages: TOP.map((l) => ({ id: l, ...count("languages", l), target: plan.targets.perTopLanguage })),
};
const otherLangs = ALL_LANGS.filter((l) => !TOP.includes(l) && posts.some((p) => p.cover.languages.has(l)));

// A gap: published + queued doesn't reach the target (the queue won't fix it).
const gaps = Object.entries(rows).flatMap(([kind, list]) =>
  list.filter((r) => r.published + r.queued < r.target).map((r) => `${kind}: ${r.id} (${r.published} published, ${r.queued} queued, target ${r.target})`),
);

if (process.argv.includes("--json")) {
  console.log(JSON.stringify({ rows, otherLanguagesCovered: otherLangs, gaps }, null, 2));
  process.exit(0);
}

const table = (title, list) => {
  console.log(`\n${title}`);
  for (const r of list) {
    const mark = r.published >= r.target ? "done " : r.published + r.queued >= r.target ? "queued" : "GAP  ";
    console.log(`  ${mark}  ${r.id.padEnd(24)} ${String(r.published).padStart(2)} published  ${String(r.queued).padStart(2)} queued  (target ${r.target})`);
  }
};
console.log(`Blog coverage: ${posts.length} articles published, ${queued.length} topics queued.`);
table("Features (Feature map in CAPTIO_FACTS.md)", rows.features);
table("Use cases (plan.json blogUseCases)", rows.useCases);
table("Priority languages (plan.json topLanguages)", rows.languages);
console.log(`\nOther languages with an article: ${otherLangs.join(", ") || "none yet"}`);
console.log(gaps.length ? `\nGaps the queue doesn't fill (add topics for these first):\n  ${gaps.join("\n  ")}` : "\nNo gaps: every target is published or queued.");
