#!/usr/bin/env node
// Sends rendered social posts to Zernio, which publishes them to Instagram and
// the Facebook Page. Run scripts/social-render.mjs first.
//
//   node scripts/social-zernio.mjs accounts              what is connected
//   node scripts/social-zernio.mjs validate [post ...]   checks against each platform's rules, publishes nothing
//   node scripts/social-zernio.mjs draft <post>          saved in Zernio, publishes nothing
//   node scripts/social-zernio.mjs schedule <post> <iso> published by Zernio at that time
//   node scripts/social-zernio.mjs plan [--at <iso>]     the posts for today's open slots (reads files only)
//   node scripts/social-zernio.mjs next [--dry [--at <iso>]]  schedules those posts in today's slots
//   node scripts/social-zernio.mjs sync                  records what published posts did
//   node scripts/social-zernio.mjs status <zernio id>    where a post stands, per account
//   node scripts/social-zernio.mjs delete <zernio id>    removes a draft or a scheduled post
//
// There is deliberately no "publish now": everything goes through a draft or a
// time at least 10 minutes ahead, so a mistake can still be stopped. The key
// comes from ZERNIO_API_KEY, or .env.local on this Mac. Never put it in a file git tracks.
import { existsSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import Zernio, { RateLimitError } from "@zernio/node";
import { loadPosts } from "./social-render.mjs";

const ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const SOCIAL = path.join(ROOT, "content/social");
const OUT = path.join(SOCIAL, "out");
const STATE = path.join(SOCIAL, "scheduled.json");
const PACE = path.join(SOCIAL, "pace.json");
const PAGES = path.join(SOCIAL, "pages.json");
const BLOCKED = path.join(SOCIAL, "blocked.json");
const PLATFORMS = ["instagram", "facebook"];
const MIN_LEAD_MS = 10 * 60 * 1000;
const SLOT_LEAD_MS = 15 * 60 * 1000;
const DAY_MS = 24 * 60 * 60 * 1000;

function apiKey() {
  if (process.env.ZERNIO_API_KEY) return process.env.ZERNIO_API_KEY;
  const file = path.join(ROOT, ".env.local");
  const line = existsSync(file) && readFileSync(file, "utf8").match(/^ZERNIO_API_KEY=(.+)$/m);
  if (!line) throw new Error("ZERNIO_API_KEY is not set");
  return line[1].trim();
}

// Created on first use, so the commands that only read files need no key.
let client;
const zernio = () => (client ??= new Zernio({ apiKey: apiKey() }));

// Zernio allows 60 requests a minute and every image is one, so a batch can hit
// the limit. Waiting out the time it asks for is always safe here.
async function patient(call, tries = 5) {
  for (let i = 1; ; i++) {
    try {
      return await call();
    } catch (error) {
      if (!(error instanceof RateLimitError) || i === tries) throw error;
      const asked = Number(error.message.match(/after (\d+) seconds/)?.[1]) || 30;
      await new Promise((done) => setTimeout(done, (asked + 1) * 1000));
    }
  }
}

const readJson = (file, empty) => (existsSync(file) ? JSON.parse(readFileSync(file, "utf8")) : empty);
const readState = () => readJson(STATE, {});
const writeState = (state) => writeFileSync(STATE, `${JSON.stringify(state, null, 2)}\n`);

async function connected() {
  const { data } = await patient(() => zernio().accounts.listAccounts());
  return data.accounts.filter((a) => PLATFORMS.includes(a.platform));
}

// Both accounts connected and working, or a clear reason to stop.
async function targets() {
  const accounts = await connected();
  const missing = PLATFORMS.filter((p) => !accounts.some((a) => a.platform === p));
  const inactive = accounts.filter((a) => a.isActive === false).map((a) => a.platform);
  return { accounts, missing: [...missing, ...inactive.map((p) => `${p} (reconnect it in Zernio)`)] };
}

function rendered(id) {
  const file = path.join(OUT, id, "post.json");
  if (!existsSync(file)) throw new Error(`${id} is not rendered: run scripts/social-render.mjs`);
  return JSON.parse(readFileSync(file, "utf8"));
}

async function upload(id, file) {
  const bytes = readFileSync(path.join(OUT, id, file));
  const { data } = await patient(() =>
    zernio().media.getMediaPresignedUrl({
      body: { filename: `${id}-${file}`, contentType: "image/jpeg" },
    }),
  );
  const res = await fetch(data.uploadUrl, {
    method: "PUT",
    body: bytes,
    headers: { "Content-Type": "image/jpeg" },
  });
  if (!res.ok) throw new Error(`Upload of ${file} failed: ${res.status}`);
  return data.publicUrl;
}

async function prepare(id, accounts) {
  const post = rendered(id);
  const mediaItems = [];
  for (const m of post.media) {
    mediaItems.push({ type: "image", url: await upload(id, m.file), altText: m.altText });
  }
  return {
    content: post.caption,
    mediaItems,
    platforms: accounts.map((a) => ({ platform: a.platform, accountId: a._id })),
  };
}

// Zernio's check of a post against each platform's rules. Publishes nothing.
async function check(id, body) {
  const { data } = await patient(() => zernio().validate.validatePost({ body }));
  for (const w of data.warnings ?? []) console.log(`${id}: ${w.platform} warning: ${w.warning}`);
  if (data.valid === false) {
    const why = (data.errors ?? []).map((e) => `${e.platform}: ${e.error}`).join("; ");
    throw new Error(`${id} is not valid: ${why}`);
  }
}

async function send(id, accounts, scheduledFor) {
  const body = await prepare(id, accounts);
  await check(id, body);
  const { data } = await patient(() =>
    zernio().posts.createPost({
      // The same key within 24 hours returns the first post, so a retry never posts twice.
      ...(scheduledFor ? { headers: { "Idempotency-Key": `${id}-${scheduledFor}` } } : {}),
      body: { ...body, ...(scheduledFor ? { scheduledFor, timezone: "UTC" } : {}) },
    }),
  );
  return data.post;
}

// Every caption Zernio already holds, so a post whose record was lost is never
// scheduled a second time.
async function captionsInZernio() {
  const seen = new Set();
  let cursor;
  for (let i = 0; i < 50; i++) {
    const query = { limit: 100, includeHidden: true, ...(cursor ? { cursor } : {}) };
    const { data } = await patient(() => zernio().posts.listPosts({ query }));
    for (const p of data.posts ?? []) if (p.content) seen.add(p.content.trim());
    cursor = data.pagination?.nextCursor;
    if (!cursor) break;
  }
  return seen;
}

// Today's slot times (UTC) from pace.json: one a day.
function slotsFor(day) {
  const pace = readJson(PACE, null);
  if (!pace || pace.paused) return [];
  const start = Date.parse(`${pace.start}T00:00:00Z`);
  let offset = Math.floor((day - start) / DAY_MS);
  if (offset < 0) return [];
  for (const step of pace.steps) {
    if (!step.days || offset < step.days) return step.slots;
    offset -= step.days;
  }
  return [];
}

// The open slots of the day `at` falls on, and the posts to fill them: written,
// not scheduled or blocked, in page-list order. Reads files only.
function planFor(at) {
  const day = Date.UTC(at.getUTCFullYear(), at.getUTCMonth(), at.getUTCDate());
  const state = readState();
  const taken = new Set(Object.values(state).map((s) => s.scheduledFor));
  const usedToday = Object.values(state).filter((s) => Date.parse(s.scheduledFor) >= day && Date.parse(s.scheduledFor) < day + DAY_MS).length;
  const unused = slotsFor(day)
    .slice(usedToday)
    .map((hm) => new Date(`${new Date(day).toISOString().slice(0, 10)}T${hm}:00Z`))
    .filter((t) => !taken.has(t.toISOString()));
  let slots = unused.filter((t) => t.getTime() - at.getTime() >= SLOT_LEAD_MS);
  // GitHub can start a scheduled run hours late (3 Nov 2026: 06:15 ran at 14:24).
  // A day whose slots have all passed with nothing sent still gets its post,
  // as soon as Zernio allows, rounded to 5 minutes.
  if (!slots.length && unused.length) {
    const soon = new Date(Math.ceil((at.getTime() + SLOT_LEAD_MS) / 300000) * 300000);
    if (soon.getTime() < day + DAY_MS) slots = [soon];
  }
  const blocked = readJson(BLOCKED, {});
  const byPage = new Map(loadPosts().map((p) => [p.page, p.id]));
  const order = readJson(PAGES, []).map((p) => p.page);
  const ids = order
    .filter((page) => byPage.has(page) && !blocked[page])
    .map((page) => byPage.get(page))
    .filter((id) => !state[id]);
  const items = slots.slice(0, ids.length).map((time, i) => ({ id: ids[i], time: time.toISOString() }));
  return { items, open: slots.length };
}

function plan(...args) {
  const i = args.indexOf("--at");
  const at = i > -1 ? new Date(args[i + 1]) : new Date();
  for (const p of planFor(at).items) console.log(p.id);
}

async function next(...args) {
  const dry = args.includes("--dry");
  const i = args.indexOf("--at");
  if (i > -1 && !dry) throw new Error("--at only works with --dry");
  const { items, open } = planFor(i > -1 ? new Date(args[i + 1]) : new Date());
  if (!items.length) {
    if (readJson(PACE, {}).paused) return console.log("Paused in pace.json: nothing scheduled.");
    if (!open) return console.log("No open slots today.");
    // Slots to fill and nothing written: the writer routine has stopped.
    throw new Error(`${open} slot(s) today but no written posts waiting: check the writer routine and content/social/LOG.md`);
  }
  if (items.length < open) console.log(`Only ${items.length} written post(s) for ${open} slot(s) today.`);
  const { accounts, missing } = await targets();
  if (missing.length) throw new Error(`Not connected: ${missing.join(", ")}`);
  const already = await captionsInZernio();
  const state = readState();
  for (const { id, time } of items) {
    const caption = rendered(id).caption.trim();
    if (already.has(caption)) {
      console.log(`SKIP ${id}: Zernio already has this post`);
      state[id] = { zernioId: null, scheduledFor: time, note: "already in Zernio, not sent again" };
      continue;
    }
    if (dry) {
      console.log(`DRY ${id} at ${time}`);
      continue;
    }
    const post = await send(id, accounts, time);
    state[id] = { zernioId: post._id, scheduledFor: time };
    writeState(state); // after every post, so a failure later loses nothing
    console.log(`Scheduled ${id} for ${time}: ${post._id}`);
  }
  if (!dry) writeState(state);
}

// Records what each post did once its time has passed: published with links,
// or failed. Never resends anything: a failed Instagram post often appears
// anyway, so a person decides. Exits with an error when something failed.
async function sync() {
  const state = readState();
  const problems = [];
  for (const [id, s] of Object.entries(state)) {
    // A failed post is reported once: the job runs several times a day.
    if (!s.zernioId || ["published", "failed", "partial"].includes(s.status)) continue;
    if (Date.parse(s.scheduledFor) > Date.now()) continue;
    const { data } = await patient(() => zernio().posts.getPost({ path: { postId: s.zernioId } }));
    const post = data.post ?? data;
    s.status = post.status;
    s.links = Object.fromEntries((post.platforms ?? []).filter((p) => p.platformPostUrl).map((p) => [p.platform, p.platformPostUrl]));
    s.checkedAt = new Date().toISOString();
    if (["failed", "partial"].includes(post.status)) {
      const why = (post.platforms ?? []).filter((p) => p.status !== "published").map((p) => `${p.platform}: ${p.errorMessage ?? p.status}`);
      problems.push(`${id} ${post.status}: ${why.join("; ")}`);
    }
    console.log(`${id}: ${post.status} ${Object.values(s.links).join(" ")}`.trimEnd());
  }
  writeState(state);
  const { missing } = await targets();
  if (missing.length) problems.push(`Not connected: ${missing.join(", ")}`);
  if (problems.length) throw new Error(problems.join("\n"));
}

async function validate(...ids) {
  const { accounts, missing } = await targets();
  if (missing.length) throw new Error(`Not connected: ${missing.join(", ")}`);
  const list = ids.length ? ids : readdirSync(OUT).filter((f) => existsSync(path.join(OUT, f, "post.json")));
  let failed = 0;
  for (const id of list) {
    try {
      await check(id, await prepare(id, accounts));
      console.log(`PASS ${id}`);
    } catch (error) {
      failed++;
      console.log(`FAIL ${error.message}`);
    }
  }
  console.log(`\n${list.length - failed} of ${list.length} valid on Instagram and Facebook`);
  if (failed) process.exit(1);
}

async function draft(id) {
  const { accounts, missing } = await targets();
  if (missing.length) console.log(`Not connected: ${missing.join(", ")}. The draft will skip them.`);
  const post = await send(id, accounts);
  console.log(`Draft ${post._id}: ${post.status}, ${accounts.length} account(s). Nothing was published.`);
}

async function schedule(id, at) {
  const time = new Date(at);
  if (Number.isNaN(time.getTime())) throw new Error(`Not a time: ${at}`);
  if (time.getTime() - Date.now() < MIN_LEAD_MS) throw new Error("Schedule at least 10 minutes ahead");
  const state = readState();
  if (state[id]) throw new Error(`${id} was already scheduled for ${state[id].scheduledFor}`);
  const { accounts, missing } = await targets();
  if (missing.length) throw new Error(`Not connected: ${missing.join(", ")}`);
  const scheduledFor = time.toISOString();
  const post = await send(id, accounts, scheduledFor);
  state[id] = { zernioId: post._id, scheduledFor };
  writeState(state);
  console.log(`Scheduled ${id} for ${scheduledFor}: ${post._id}`);
}

async function status(zernioId) {
  const { data } = await zernio().posts.getPost({ path: { postId: zernioId } });
  const post = data.post ?? data;
  console.log(`${post._id}: ${post.status}, ${post.mediaItems?.length ?? 0} image(s)`);
  for (const p of post.platforms ?? []) {
    console.log(`  ${p.platform}: ${p.status ?? "waiting"} ${p.platformPostUrl ?? ""} ${p.errorMessage ?? ""}`.trimEnd());
  }
}

async function remove(zernioId) {
  await zernio().posts.deletePost({ path: { postId: zernioId } });
  console.log(`Deleted ${zernioId}`);
}

async function accounts() {
  const list = await connected();
  if (!list.length) console.log("No Instagram or Facebook account is connected.");
  for (const a of list) console.log(`${a.platform}: ${a.username ?? a.displayName ?? "?"} ${a._id}${a.isActive === false ? " (not active)" : ""}`);
}

const COMMANDS = { accounts, validate, draft, schedule, plan, next, sync, status, delete: remove };
const [command, ...args] = process.argv.slice(2);
if (!COMMANDS[command]) {
  console.error(`Commands: ${Object.keys(COMMANDS).join(", ")}`);
  process.exit(1);
}
try {
  await COMMANDS[command](...args);
} catch (error) {
  console.error(error.message);
  process.exit(1);
}
