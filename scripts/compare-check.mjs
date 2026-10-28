#!/usr/bin/env node
// Checks for the Compare section (content/compare). The build already fails on
// a broken shape or a citation that points nowhere; this script looks for the
// things a build can't: facts nobody opened, sources gone stale, links that
// stopped working, and wording the rules forbid.
//
//   npm run compare:check                # every app and page
//   npm run compare:check -- <slug> ...  # these apps / pages only
//   add --links to fetch every source URL (slow)

import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

const ROOT = process.cwd();
const APPS_DIR = path.join(ROOT, "content/compare/apps");
const PAGES_DIR = path.join(ROOT, "content/compare/pages");
const STALE_DAYS = 90;

const args = process.argv.slice(2);
const checkLinks = args.includes("--links");
const only = new Set(args.filter((a) => !a.startsWith("--")));
const pick = (slug) => only.size === 0 || only.has(slug);

const errors = [];
const warnings = [];
const today = new Date();
const ageDays = (day) => Math.floor((today - new Date(`${day}T12:00:00Z`)) / 86400000);

// Words the rules forbid about Captio AI, and wording that reads as a review.
const BANNED = [
  [/Captio AI (is|has) (the )?(best|fastest|leading|only|most)\b/i, 'a "best/only/most" claim about Captio AI'],
  [/\bmost accurate\b/i, 'a "most accurate" claim'],
  [/\bwe tested\b/i, '"we tested" (only with a named device and date)'],
  [/\b(fails to|sucks|terrible|useless)\b/i, "mocking wording"],
  [/\b\d(\.\d)? ?(stars?|★)/i, "a star rating"],
  [/\bSoniox|Gemini\b/, "a Captio AI provider name"],
  [/\bCaptio(?! AI)\b/, '"Captio" without "AI"'],
];

// ── Apps ───────────────────────────────────────────────────────────────────

const apps = new Map();
for (const file of fs.readdirSync(APPS_DIR).filter((f) => f.endsWith(".json"))) {
  const app = JSON.parse(fs.readFileSync(path.join(APPS_DIR, file), "utf8"));
  apps.set(app.slug, app);
}

const urls = new Map(); // url -> where
for (const [slug, app] of apps) {
  if (!pick(slug)) continue;
  const byId = new Map(app.sources.map((s) => [s.id, s]));
  for (const s of app.sources) {
    urls.set(s.url, `${slug} ${s.id}`);
    if (ageDays(s.checked) > STALE_DAYS) warnings.push(`${slug}: ${s.id} last checked ${s.checked} (over ${STALE_DAYS} days): re-check ${s.url}`);
    if (s.opened === false) warnings.push(`${slug}: ${s.id} was never opened (search snippet only): ${s.url}`);
    if (s.opened !== false && (!s.quotes || s.quotes.length === 0)) warnings.push(`${slug}: ${s.id} has no supporting quote`);
  }
  for (const [key, fact] of Object.entries(app.facts)) {
    if (fact.text.length > 70) warnings.push(`${slug}.${key}: cell text is ${fact.text.length} characters (keep it under ~60)`);
    const used = fact.sources.map((id) => byId.get(id)).filter(Boolean);
    if (fact.status !== "not_stated" && used.length > 0 && used.every((s) => s.opened === false)) {
      errors.push(`${slug}.${key}: only backed by sources nobody opened`);
    }
    if (slug === "captio-ai") {
      for (const [re, what] of BANNED) if (re.test(`${fact.text} ${fact.detail ?? ""}`)) errors.push(`${slug}.${key}: ${what}`);
    }
  }
  for (const list of ["strengths", "limits"]) {
    if ((app[list] ?? []).length < 2) warnings.push(`${slug}: fewer than 2 ${list}`);
  }
}

// ── Pages ──────────────────────────────────────────────────────────────────

const pageFiles = fs.existsSync(PAGES_DIR) ? fs.readdirSync(PAGES_DIR).filter((f) => f.endsWith(".md")) : [];
for (const file of [...pageFiles.map((f) => path.join(PAGES_DIR, f)), path.join(ROOT, "content/compare/index.md")]) {
  const slug = path.basename(file, ".md");
  if (!pick(slug)) continue;
  const { data, content } = matter(fs.readFileSync(file, "utf8"));
  const text = [
    data.title,
    data.description,
    data.answer,
    content,
    ...(data.faqs ?? []).flatMap((f) => [f.q, f.a]),
    ...(data.picks ?? []).map((p) => p.text),
    ...(data.differences ?? []).flatMap((d) => [d.title, d.text]),
    ...Object.values(data.better ?? {}).flat().map((b) => b.text),
    ...(data.situations ?? []).flatMap((x) => [x.title, x.text]),
  ].join("\n");

  for (const [re, what] of BANNED) {
    const m = text.match(re);
    if (m) errors.push(`${slug}: ${what}: "${m[0]}"`);
  }
  if (data.description && (data.description.length < 110 || data.description.length > 165)) {
    warnings.push(`${slug}: description is ${data.description.length} characters (aim for 140–160)`);
  }
  if (data.title && `${data.title} | Captio AI`.length > 65) warnings.push(`${slug}: title + " | Captio AI" is over 65 characters`);
  if (slug !== "index" && data.kind) {
    if (data.kind === "versus") {
      for (const a of data.apps ?? []) {
        if (a !== "captio-ai" && !(data.better?.[a]?.length >= 2)) errors.push(`${slug}: needs at least 2 "better" points for ${a} (where it is the better choice)`);
      }
      if ((data.differences ?? []).length < 3) warnings.push(`${slug}: ${(data.differences ?? []).length} differences (aim for 4–6)`);
      if ((data.situations ?? []).length < 3) warnings.push(`${slug}: ${(data.situations ?? []).length} situations (aim for 4–6)`);
    }
    if ((data.faqs ?? []).length < 5) warnings.push(`${slug}: ${(data.faqs ?? []).length} FAQs (aim for 6–8)`);
    for (const a of data.apps ?? []) {
      const app = apps.get(a);
      if (!app) continue;
      const oldest = app.sources.map((s) => s.checked).sort()[0];
      if (ageDays(oldest) > STALE_DAYS) errors.push(`${slug}: ${a} has facts older than ${STALE_DAYS} days; re-check before publishing`);
    }
  }
  for (const s of data.sources ?? []) urls.set(s.url, `${slug} page source`);
}

// ── Links ──────────────────────────────────────────────────────────────────

if (checkLinks) {
  const UA = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130 Safari/537.36";
  await Promise.all(
    [...urls].map(async ([url, where]) => {
      try {
        const res = await fetch(url, { redirect: "follow", headers: { "user-agent": UA }, signal: AbortSignal.timeout(20000) });
        if (res.status === 404 || res.status === 410) errors.push(`${where}: ${res.status} ${url}`);
        else if (!res.ok) warnings.push(`${where}: HTTP ${res.status} (may block bots, open it by hand) ${url}`);
      } catch (e) {
        warnings.push(`${where}: could not fetch (${e.cause?.code ?? e.name}) ${url}`);
      }
    }),
  );
}

// ── Report ─────────────────────────────────────────────────────────────────

for (const w of warnings) console.log(`warn  ${w}`);
for (const e of errors) console.log(`ERROR ${e}`);
console.log(`\n${apps.size} apps, ${pageFiles.length} pages${checkLinks ? `, ${urls.size} links` : ""}: ${errors.length} errors, ${warnings.length} warnings`);
process.exit(errors.length > 0 ? 1 : 0);
