#!/usr/bin/env node
// Automatic checks for blog articles (content/blog/posts/*.md), run before the
// independent review in content/blog/REVIEW.md. Errors block publishing;
// warnings are for the writer and reviewer to look at.
//
//   npm run blog:check                 # articles changed vs origin/main
//   npm run blog:check -- <slug> ...   # specific articles
//   npm run blog:check -- --all        # every article
//   add --offline to skip fetching external links

import fs from "node:fs";
import path from "node:path";
import { execSync } from "node:child_process";
import matter from "gray-matter";

const ROOT = process.cwd();
const POSTS_DIR = path.join(ROOT, "content/blog/posts");
const read = (p) => fs.readFileSync(path.join(ROOT, p), "utf8");

const args = process.argv.slice(2);
const offline = args.includes("--offline");
const allPostFiles = fs.readdirSync(POSTS_DIR).filter((f) => f.endsWith(".md"));
const allSlugs = allPostFiles.map((f) => f.replace(/\.md$/, ""));

let slugs = args.filter((a) => !a.startsWith("--")).map((s) => s.replace(/^.*\//, "").replace(/\.md$/, ""));
if (args.includes("--all")) slugs = allSlugs;
if (slugs.length === 0) {
  const sh = (cmd) => execSync(cmd, { cwd: ROOT, encoding: "utf8" }).split("\n").filter(Boolean);
  let changed = [];
  try {
    changed = [
      ...sh("git diff --name-only origin/main -- content/blog/posts"),
      ...sh("git ls-files --others --exclude-standard content/blog/posts"),
    ];
  } catch {
    changed = allPostFiles.map((f) => `content/blog/posts/${f}`);
  }
  slugs = [...new Set(changed)]
    .filter((f) => f.endsWith(".md") && fs.existsSync(path.join(ROOT, f)))
    .map((f) => path.basename(f, ".md"));
  if (slugs.length === 0) {
    console.log("No changed articles. Pass a slug or --all.");
    process.exit(0);
  }
}

// ── What the site actually has (for internal links) ─────────────────────────

const blogTs = read("src/lib/blog.ts");
const block = (name) => blogTs.slice(blogTs.indexOf(`export const ${name} = {`), blogTs.indexOf("} as const;", blogTs.indexOf(`export const ${name} = {`)));
const CATEGORIES = [...block("CATEGORIES").matchAll(/^  ([a-z-]+): \{$/gm)].map((m) => m[1]);
const AUTHORS = [...block("AUTHORS").matchAll(/^  ([a-z-]+): \{$/gm)].map((m) => m[1]);
const LANGS = [...read("src/lib/languages.ts").matchAll(/languageSlug: "([a-z-]+)"/g)].map((m) => m[1]);
const USE_CASES = [...read("src/lib/useCases.ts").matchAll(/^    slug: "([a-z-]+)",$/gm)].map((m) => m[1]);

const ROUTES = new Set([
  "/", "/live-captions", "/live-translator", "/audio-transcription", "/ai-summary", "/privacy", "/terms",
  "/blog", "/blog/rss.xml", "/llms.txt",
  ...CATEGORIES.map((c) => `/blog/category/${c}`),
  ...AUTHORS.map((a) => `/blog/author/${a}`),
  ...LANGS.map((l) => `/${l}`),
  ...USE_CASES.map((u) => `/use-cases/${u}`),
  ...USE_CASES.flatMap((u) => LANGS.map((l) => `/use-cases/${u}/${l}`)),
  ...allSlugs.map((s) => `/blog/${s}`),
]);

// ── Rules ───────────────────────────────────────────────────────────────────

const MIN_SOURCES = { comparisons: 5, data: 5, guides: 4, explainers: 3 };
const MIN_WORDS = { comparisons: 1000, data: 900, guides: 900, explainers: 800 };
const NEEDS_TABLE = new Set(["comparisons", "data"]);

const HYPE = [
  "powerful", "seamless", "seamlessly", "revolutionary", "revolutionize", "game-changing", "game changer", "game-changer",
  "cutting-edge", "cutting edge", "best-in-class", "world-class", "groundbreaking", "unparalleled", "supercharge",
  "unlock", "unleash", "elevate", "delve", "next-generation", "state-of-the-art", "effortless", "effortlessly",
];
const FILLER = [
  "it's important to note", "it is important to note", "in today's", "whether you're", "let's dive", "dive into",
  "in conclusion", "navigating the", "landscape", "journey", "at the end of the day", "look no further", "tapestry",
];
const FAKE_PROOF = [
  /★|⭐/, /testimonial/i, /\*{3}@/, /@gmail\.com/i, /\brated \d(\.\d)? (out of|stars)/i,
  /\b(our|happy) (users|customers) (say|love|tell)/i, /\buser review/i,
];
const STAT = /(\b\d[\d,.]*\s?(%|percent|per cent|million|billion|thousand|people|adults|children|languages|dialects|dB|decibels|times|hours|minutes|per \d|out of \d))|((US\$|\$|€|£)\s?\d)/i;

const STOP = new Set("a an the and or of for to in on with is are how what why do does your you vs it its at by from as be can who which best".split(" "));
const titleWords = (t) => new Set(t.toLowerCase().replace(/[^a-z0-9\s]/g, " ").split(/\s+/).filter((w) => w && !STOP.has(w)));
const jaccard = (a, b) => {
  const inter = [...a].filter((w) => b.has(w)).length;
  return inter / (a.size + b.size - inter || 1);
};
const words = (s) => (s ?? "").split(/\s+/).filter(Boolean).length;
const day = (v) => (v instanceof Date ? v.toISOString().slice(0, 10) : String(v ?? ""));
const today = new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Ljubljana" }).format(new Date());

const allTitles = Object.fromEntries(
  allPostFiles.map((f) => [f.replace(/\.md$/, ""), String(matter(fs.readFileSync(path.join(POSTS_DIR, f), "utf8")).data.title ?? "")]),
);

// ── External links ──────────────────────────────────────────────────────────

async function checkUrl(url) {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 20000);
  try {
    const res = await fetch(url, {
      redirect: "follow",
      signal: ctrl.signal,
      headers: {
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126 Safari/537.36",
        Accept: "text/html,application/pdf,*/*",
      },
    });
    return res.status;
  } catch (e) {
    return e.name === "AbortError" ? "timeout" : "network error";
  } finally {
    clearTimeout(timer);
  }
}

async function pool(items, size, fn) {
  const out = [];
  let i = 0;
  await Promise.all(Array.from({ length: size }, async () => {
    while (i < items.length) {
      const idx = i++;
      out[idx] = await fn(items[idx]);
    }
  }));
  return out;
}

// ── Check one article ───────────────────────────────────────────────────────

async function checkPost(slug) {
  const errors = [];
  const warnings = [];
  const file = path.join(POSTS_DIR, `${slug}.md`);
  if (!fs.existsSync(file)) return { errors: [`no file content/blog/posts/${slug}.md`], warnings };

  const { data, content } = matter(fs.readFileSync(file, "utf8"));
  const cat = data.category;
  const title = String(data.title ?? "");
  const answer = String(data.answer ?? "");
  const sources = Array.isArray(data.sources) ? data.sources : [];
  const faqs = Array.isArray(data.faqs) ? data.faqs : [];
  const keyFacts = Array.isArray(data.keyFacts) ? data.keyFacts : [];

  // Shape
  if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(slug)) errors.push("slug must be lowercase-hyphenated");
  if (/20\d\d/.test(slug)) errors.push("no year in the slug (the slug must survive updates)");
  if (slug.length > 60) warnings.push(`slug is ${slug.length} characters; shorter is better`);
  if (!CATEGORIES.includes(cat)) errors.push(`category "${cat}" is not one of ${CATEGORIES.join(", ")}`);
  if (!AUTHORS.includes(data.author ?? "nate")) errors.push(`author "${data.author}" is not one of ${AUTHORS.join(", ")}`);

  if (title.length < 25 || title.length > 75) errors.push(`title is ${title.length} characters (25–75)`);
  else if (title.length < 30 || title.length > 70) warnings.push(`title is ${title.length} characters (aim for 30–70)`);
  const titleYear = title.match(/\b(20\d\d)\b/);
  if (titleYear && titleYear[1] !== today.slice(0, 4)) errors.push(`title says ${titleYear[1]}, but it is ${today.slice(0, 4)}`);
  if (titleYear && !["data", "comparisons"].includes(cat)) warnings.push("a year in the title is only for data and comparison articles");

  const desc = String(data.description ?? "");
  if (desc.length < 90 || desc.length > 170) errors.push(`description is ${desc.length} characters (90–170)`);
  else if (desc.length < 110 || desc.length > 160) warnings.push(`description is ${desc.length} characters (aim for 110–160)`);

  const aw = words(answer);
  if (aw < 35 || aw > 90) errors.push(`answer is ${aw} words (35–90)`);
  else if (aw < 40 || aw > 80) warnings.push(`answer is ${aw} words (aim for 40–80)`);

  const published = day(data.published);
  const updated = day(data.updated ?? data.published);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(published)) errors.push("published must be a date like 2026-10-21");
  if (published > today) errors.push(`published ${published} is in the future (today is ${today})`);
  if (updated < published) errors.push("updated is earlier than published");
  if (updated > today) errors.push(`updated ${updated} is in the future`);

  // Sources
  if (sources.length < (MIN_SOURCES[cat] ?? 3)) errors.push(`${sources.length} sources; ${cat} articles need at least ${MIN_SOURCES[cat] ?? 3}`);
  const seenUrls = new Set();
  sources.forEach((s, i) => {
    if (!s?.title || !s?.publisher || !/^https?:\/\//.test(s?.url ?? "")) errors.push(`source ${i + 1} needs title, publisher and url`);
    if (/wikipedia\.org/i.test(s?.url ?? "")) errors.push(`source ${i + 1} is Wikipedia; cite the primary source`);
    if (seenUrls.has(s?.url)) errors.push(`source ${i + 1} repeats ${s.url}`);
    seenUrls.add(s?.url);
  });

  // FAQ and key facts
  if (faqs.length < 3 || faqs.length > 10) errors.push(`${faqs.length} FAQs (3–10)`);
  else if (faqs.length < 4 || faqs.length > 8) warnings.push(`${faqs.length} FAQs (aim for 4–8)`);
  faqs.forEach((f, i) => {
    if (!String(f?.q ?? "").trim().endsWith("?")) errors.push(`FAQ ${i + 1} question must end with "?"`);
    const n = words(f?.a);
    if (n < 15 || n > 120) errors.push(`FAQ ${i + 1} answer is ${n} words (15–120)`);
    else if (n < 25 || n > 90) warnings.push(`FAQ ${i + 1} answer is ${n} words (aim for 25–90)`);
  });
  if (keyFacts.length > 4) errors.push(`${keyFacts.length} key facts (at most 4)`);
  keyFacts.forEach((k, i) => {
    if (!k?.source) errors.push(`key fact ${i + 1} needs a source number`);
  });

  // Body
  const body = content.replace(/```[\s\S]*?```/g, "");
  const bw = words(body);
  if (bw < (MIN_WORDS[cat] ?? 800)) errors.push(`body is ${bw} words; ${cat} articles need at least ${MIN_WORDS[cat] ?? 800}`);
  if (bw > 2600) warnings.push(`body is ${bw} words; check every section earns its place`);
  if (/^# /m.test(body)) errors.push("no H1 in the body (the title is the H1)");
  const h2s = [...body.matchAll(/^## (.+)$/gm)].map((m) => m[1].trim());
  if (h2s.length < 4) errors.push(`${h2s.length} ## sections (at least 4)`);
  const questions = h2s.filter((h) => h.endsWith("?")).length;
  if (h2s.length && questions / h2s.length < 0.4) warnings.push(`only ${questions} of ${h2s.length} ## headings are questions`);
  const hasTable = /^\|.*\|\s*$\n^\|[\s:|-]+\|\s*$/m.test(body);
  if (NEEDS_TABLE.has(cat) && !hasTable) errors.push(`${cat} articles need at least one table`);

  // Citations
  const cited = new Set([...body.matchAll(/\[(\d{1,2})\](?![(:[])/g)].map((m) => Number(m[1])));
  keyFacts.forEach((k) => k?.source && cited.add(Number(k.source)));
  for (const n of cited) if (n < 1 || n > sources.length) errors.push(`[${n}] cited but there are ${sources.length} sources`);
  sources.forEach((_, i) => {
    if (!cited.has(i + 1)) errors.push(`source ${i + 1} is never cited`);
  });

  const blocks = body.split(/\n\s*\n/);
  for (const b of blocks) {
    const t = b
      .split("\n")
      .filter((line) => !/^#{1,6} /.test(line.trim()))
      .join("\n")
      .trim();
    if (!t) continue;
    if (t.startsWith("|")) {
      const rows = t.split("\n").filter((r) => !/^\|[\s:|-]+\|\s*$/.test(r));
      if (!/\[\d{1,2}\]/.test(t)) errors.push(`table "${rows[0].slice(0, 50)}…" has no citations`);
      rows.slice(1).forEach((r) => {
        if (STAT.test(r) && !/\[\d{1,2}\]/.test(r) && !/Captio AI/.test(r)) warnings.push(`table row without a citation: ${r.slice(0, 80)}`);
      });
      continue;
    }
    const units = /^\s*([-*]|\d+\.)\s/m.test(t) ? t.split("\n") : [t];
    for (const u of units) {
      if (STAT.test(u) && !/\[\d{1,2}\]/.test(u) && !/Captio AI/.test(u)) {
        errors.push(`number without a citation: "${u.trim().slice(0, 90)}…"`);
      }
    }
  }

  // Words and brand
  const text = [title, desc, answer, content, ...faqs.flatMap((f) => [f?.q, f?.a]), ...keyFacts.map((k) => k?.label)].join("\n");
  const lower = text.toLowerCase();
  if (text.includes("·")) errors.push('contains "·"');
  if (/\bsoniox\b/i.test(text)) errors.push("names the speech-recognition provider");
  const bare = text.replace(/captioai\.app/gi, "").match(/\bCaptio\b(?! AI)/g);
  if (bare) errors.push(`"Captio" without "AI" (${bare.length}x)`);
  if (/!(?!\[)/.test(text.replace(/<!--[\s\S]*?-->/g, ""))) errors.push("contains an exclamation mark");
  for (const w of HYPE) if (new RegExp(`\\b${w}\\b`, "i").test(text)) errors.push(`hype word "${w}"`);
  for (const w of FILLER) if (lower.includes(w)) warnings.push(`filler phrase "${w}"`);
  for (const re of FAKE_PROOF) if (re.test(text)) errors.push(`looks like fake social proof (${re})`);
  if (/\bgemini\b/i.test(text)) warnings.push('mentions "Gemini": make sure it is about the product people use, never about how Captio AI works');
  if (/Captio AI[^.\n]{0,80}\b(phone calls?|video calls?|zoom|facetime|teams calls?)/i.test(text)) {
    warnings.push("Captio AI near phone/video calls: Captio AI is for in-person speech, never present it as a call captioning tool");
  }
  if (/\b(you should (take|stop|start)|we recommend (taking|medication)|diagnos(e|is) (you|your))\b/i.test(text)) {
    warnings.push("reads like medical advice; give information and point to professionals");
  }

  // Internal links
  const internal = [...content.matchAll(/\]\((\/[^)\s#]*)(#[^)\s]*)?\)/g)].map((m) => m[1] || "/");
  if (internal.length < 3) errors.push(`${internal.length} internal links (at least 3)`);
  if (internal.length > 10) warnings.push(`${internal.length} internal links (aim for 3–8)`);
  for (const href of internal) {
    const p = href.replace(/\/$/, "") || "/";
    if (!ROUTES.has(p)) errors.push(`internal link ${href} doesn't exist on the site`);
    if (p.startsWith("/use-cases/phone-video-calls")) errors.push("don't link phone-video-calls from the blog");
    if (p === `/blog/${slug}`) errors.push("links to itself");
  }

  // Duplicates of other articles
  const mine = titleWords(title);
  for (const [other, otherTitle] of Object.entries(allTitles)) {
    if (other === slug) continue;
    const sim = jaccard(mine, titleWords(otherTitle));
    if (sim >= 0.6) errors.push(`title is very close to /blog/${other} ("${otherTitle}"): update that article instead`);
    else if (sim >= 0.45) warnings.push(`title overlaps with /blog/${other} ("${otherTitle}"): make sure they answer different questions`);
  }

  // External links
  if (!offline) {
    const external = [...new Set([
      ...sources.map((s) => s?.url).filter(Boolean),
      ...[...content.matchAll(/\]\((https?:\/\/[^)\s]+)\)/g)].map((m) => m[1]),
    ])];
    const statuses = await pool(external, 6, checkUrl);
    external.forEach((url, i) => {
      const s = statuses[i];
      if (typeof s === "number" && s < 400) return;
      if (s === 401 || s === 403 || s === 429 || s === 999 || typeof s === "string") {
        warnings.push(`${url} answered ${s}: the site may block bots; the reviewer must open it by hand`);
      } else {
        errors.push(`${url} is broken (HTTP ${s})`);
      }
    });
  }

  return { errors, warnings, stats: { words: bw, sources: sources.length, faqs: faqs.length, internal: internal.length, h2: h2s.length } };
}

// ── topics.json must stay valid ─────────────────────────────────────────────

const globalErrors = [];
try {
  const topics = JSON.parse(read("content/blog/topics.json")).topics;
  const ok = new Set(["queued", "published", "blocked", "skipped"]);
  const ids = new Set();
  for (const t of topics) {
    if (!t.id || !t.title || !CATEGORIES.includes(t.category) || !ok.has(t.status)) globalErrors.push(`topics.json: bad entry ${JSON.stringify(t).slice(0, 80)}`);
    if (ids.has(t.id)) globalErrors.push(`topics.json: duplicate id ${t.id}`);
    ids.add(t.id);
    if (t.status === "published" && (!t.slug || !allSlugs.includes(t.slug))) globalErrors.push(`topics.json: ${t.id} is published but its slug has no article`);
  }
} catch (e) {
  globalErrors.push(`topics.json does not parse: ${e.message}`);
}

// ── Run ─────────────────────────────────────────────────────────────────────

let failed = globalErrors.length > 0;
for (const e of globalErrors) console.log(`✗ ${e}`);
for (const slug of slugs) {
  const { errors, warnings, stats } = await checkPost(slug);
  const head = stats ? ` (${stats.words} words, ${stats.h2} sections, ${stats.sources} sources, ${stats.faqs} FAQs, ${stats.internal} internal links)` : "";
  console.log(`\n${errors.length ? "✗" : "✓"} ${slug}${head}`);
  for (const e of errors) console.log(`  error    ${e}`);
  for (const w of warnings) console.log(`  warning  ${w}`);
  if (errors.length) failed = true;
}
console.log(failed ? "\nBlocked: fix the errors above." : "\nPassed. Next: npm run build, then the review in content/blog/REVIEW.md.");
process.exit(failed ? 1 : 0);
