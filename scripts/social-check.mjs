#!/usr/bin/env node
// The automatic gate for social posts. A post that fails here is never sent to
// Zernio. Rules and why they exist: content/social/README.md.
//
//   node scripts/social-check.mjs                 every post
//   node scripts/social-check.mjs <id> [<id>]     only these (still compared with every post)
//   node scripts/social-check.mjs --online [...]  also opens each checked post's page
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { captionFor, loadPosts } from "./social-render.mjs";

const ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const OUT = path.join(ROOT, "content/social/out");

const PAGE_TYPES = ["home", "feature", "use-case", "language", "use-case-language", "blog", "compare", "organizations"];
const MAX_SHARED = 0.1; // of a post's five-word phrases, shared with any other post
const CAPTION_MIN = 700;
const CAPTION_MAX = 2200;
const ALT_MAX = 1000;
const MIN_WORDS = 8;
const MAX_WORDS = 30;
const QUESTION_WORDS = 10;
const SLIDE_WORDS = 8;

const BAD_OPENERS = /^(So|And|But|Then|Here's|It|This|They|These|That)\b/;
const BANNED = [
  [/·/, "middle dot"],
  [/!/, "exclamation mark"],
  [/\bCaptio\b(?! AI)/, 'bare "Captio"'],
  [/\btrial\b/i, "free trial"],
  [/\bminutes?\b/i, 'minutes: the free plan is "100 free credits a day"'],
  [/soniox|gemini|openai|deepgram/i, "vendor name"],
  [/(video|phone)[ -]calls?|zoom|online meetings?/i, "calls or online meetings: Captio AI is for in-person speech"],
  [/(?<!works )\bbest\b|most accurate|number one|#1\b/i, "unprovable claim"],
  [/word for word|every word|never miss|nothing (is )?(missed|misheard)|100%|full accuracy|trust the transcript/i, "promise captions can't keep"],
  [/\bcure|\btreats?\b|\bdiagnos(e|es|ing)\b/i, "medical claim"],
];
// Features that exist on iPhone only: a post about them has to say so.
const IPHONE_ONLY = [
  /screen locked/i,
  /recognize voices/i,
  /recognize sounds|sounds? around you/i,
  /speaker direction/i,
  /flag on each speaker tag/i,
];

const strip = (text) => text.replace(/\*/g, "");
const words = (text) => text.split(/\s+/).filter(Boolean);

function phrases(post) {
  const text = post.description.join(" ").toLowerCase().replace(/captio ai/g, "ca").replace(/[^\p{L}\p{N}\s]/gu, "");
  const list = words(text);
  const set = new Set();
  for (let i = 0; i + 5 <= list.length; i++) set.add(list.slice(i, i + 5).join(" "));
  return set;
}

function checkPost(post) {
  const errors = [];
  const add = (message) => errors.push(message);

  for (const field of ["id", "pageType", "page", "question", "slides", "description", "hashtags"]) {
    if (!post[field]) add(`missing ${field}`);
  }
  if (errors.length) return errors;

  if (!PAGE_TYPES.includes(post.pageType)) add(`unknown page type ${post.pageType}`);
  if (!post.page.startsWith("/")) add("page must be a path on captioai.app");
  if (!post.question.endsWith("?")) add("question must end with ?");
  if (words(post.question).length > QUESTION_WORDS) add(`question over ${QUESTION_WORDS} words`);
  if (post.slides.length < 1 || post.slides.length > 3) add("1 to 3 slides between the question and the end card");
  for (const slide of post.slides) {
    if (words(strip(slide)).length > SLIDE_WORDS) add(`one idea per slide, ${SLIDE_WORDS} words at most: ${strip(slide)}`);
  }
  if (post.hashtags.length !== 3 || !post.hashtags.every((h) => /^#\w+$/.test(h))) add("3 hashtags");

  for (const sentence of post.description) {
    const count = words(sentence).length;
    if (count < MIN_WORDS || count > MAX_WORDS) add(`${count} words, keep to ${MIN_WORDS}-${MAX_WORDS}: ${sentence}`);
    if (BAD_OPENERS.test(sentence)) add(`does not stand alone: ${sentence}`);
  }

  const caption = captionFor(post);
  if (caption.length < CAPTION_MIN || caption.length > CAPTION_MAX) add(`caption ${caption.length} characters`);
  if (!/made for deaf and hard of hearing/.test(caption)) add('must say "made for deaf and hard of hearing"');

  const text = post.description.join(" ");
  const all = [post.question, ...post.slides.map(strip), ...post.description].join("\n");
  for (const [pattern, why] of BANNED) {
    const hit = all.match(pattern);
    if (hit) add(`${why}: "${hit[0]}"`);
  }
  if (IPHONE_ONLY.some((p) => p.test(text)) && !/iPhone/.test(text)) add("iPhone-only feature: say iPhone");
  if (/\brecord (a|an|the|your)\b|\brecords\b|\brecordings?\b/i.test(text) && !/\bask\b|\bOK\b/i.test(text)) add("mentions recording: say to ask first");

  const built = path.join(OUT, post.id, "post.json");
  if (existsSync(built)) {
    const { media } = JSON.parse(readFileSync(built, "utf8"));
    if (media.length > 10) add(`${media.length} images, Instagram allows 10`);
    for (const m of media) if (m.altText.length > ALT_MAX) add(`alt text ${m.altText.length} characters on ${m.file}`);
  }
  return errors;
}

async function checkPages(posts) {
  const errors = [];
  for (const page of new Set(posts.map((p) => p.page))) {
    const res = await fetch(`https://captioai.app${page}`, { redirect: "follow" }).catch(() => null);
    if (!res?.ok) errors.push(`${page}: ${res?.status ?? "no answer"}`);
  }
  return errors;
}

const all = loadPosts();
const ids = process.argv.slice(2).filter((a) => !a.startsWith("--"));
const posts = ids.length ? all.filter((p) => ids.includes(p.id)) : all;
const missing = ids.filter((id) => !all.some((p) => p.id === id));
if (missing.length) {
  console.log(`No post file for: ${missing.join(", ")}`);
  process.exit(1);
}
let failed = 0;
const sets = all.map((p) => [p.id, phrases(p)]);
for (const post of posts) {
  const errors = checkPost(post);
  const mine = sets.find(([id]) => id === post.id)[1];
  for (const [id, other] of sets) {
    if (id === post.id || !mine.size) continue;
    const shared = [...mine].filter((x) => other.has(x)).length / mine.size;
    if (shared > MAX_SHARED) errors.push(`${Math.round(shared * 100)}% of its phrases also in ${id}`);
  }
  if (errors.length) {
    failed++;
    console.log(`FAIL ${post.id}`);
    for (const e of errors) console.log(`  ${e}`);
  } else {
    console.log(`PASS ${post.id}`);
  }
}
if (process.argv.includes("--online")) {
  const errors = await checkPages(posts);
  for (const e of errors) console.log(`FAIL page ${e}`);
  failed += errors.length;
}
console.log(`\n${posts.length - failed} of ${posts.length} passed`);
process.exit(failed ? 1 : 0);
