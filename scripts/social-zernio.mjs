#!/usr/bin/env node
// Sends rendered social posts to Zernio, which publishes them to Instagram and
// the Facebook Page. Run scripts/social-render.mjs first.
//
//   node scripts/social-zernio.mjs accounts              what is connected
//   node scripts/social-zernio.mjs validate [post ...]   checks against each platform's rules, publishes nothing
//   node scripts/social-zernio.mjs draft <post>          saved in Zernio, publishes nothing
//   node scripts/social-zernio.mjs schedule <post> <iso> published by Zernio at that time
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

const ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const OUT = path.join(ROOT, "content/social/out");
const STATE = path.join(ROOT, "content/social/scheduled.json");
const PLATFORMS = ["instagram", "facebook"];
const MIN_LEAD_MS = 10 * 60 * 1000;

function apiKey() {
  if (process.env.ZERNIO_API_KEY) return process.env.ZERNIO_API_KEY;
  const file = path.join(ROOT, ".env.local");
  const line = existsSync(file) && readFileSync(file, "utf8").match(/^ZERNIO_API_KEY=(.+)$/m);
  if (!line) throw new Error("ZERNIO_API_KEY is not set");
  return line[1].trim();
}

const zernio = new Zernio({ apiKey: apiKey() });

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

async function connected() {
  const { data } = await zernio.accounts.listAccounts();
  return data.accounts.filter((a) => PLATFORMS.includes(a.platform));
}

async function targets() {
  const accounts = await connected();
  return { accounts, missing: PLATFORMS.filter((p) => !accounts.some((a) => a.platform === p)) };
}

function rendered(id) {
  const file = path.join(OUT, id, "post.json");
  if (!existsSync(file)) throw new Error(`${id} is not rendered: run scripts/social-render.mjs`);
  return JSON.parse(readFileSync(file, "utf8"));
}

async function upload(id, file) {
  const bytes = readFileSync(path.join(OUT, id, file));
  const { data } = await patient(() =>
    zernio.media.getMediaPresignedUrl({
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
  const { data } = await patient(() => zernio.validate.validatePost({ body }));
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
    zernio.posts.createPost({
      // The same key within 24 hours returns the first post, so a retry never posts twice.
      ...(scheduledFor ? { headers: { "Idempotency-Key": `${id}-${scheduledFor}` } } : {}),
      body: { ...body, ...(scheduledFor ? { scheduledFor, timezone: "UTC" } : {}) },
    }),
  );
  return data.post;
}

function readState() {
  return existsSync(STATE) ? JSON.parse(readFileSync(STATE, "utf8")) : {};
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
  writeFileSync(STATE, `${JSON.stringify(state, null, 2)}\n`);
  console.log(`Scheduled ${id} for ${scheduledFor}: ${post._id}`);
}

async function status(zernioId) {
  const { data } = await zernio.posts.getPost({ path: { postId: zernioId } });
  const post = data.post ?? data;
  console.log(`${post._id}: ${post.status}, ${post.mediaItems?.length ?? 0} image(s)`);
  for (const p of post.platforms ?? []) {
    console.log(`  ${p.platform}: ${p.status ?? "waiting"} ${p.platformPostUrl ?? ""} ${p.errorMessage ?? ""}`.trimEnd());
  }
}

async function remove(zernioId) {
  await zernio.posts.deletePost({ path: { postId: zernioId } });
  console.log(`Deleted ${zernioId}`);
}

async function accounts() {
  const list = await connected();
  if (!list.length) console.log("No Instagram or Facebook account is connected.");
  for (const a of list) console.log(`${a.platform}: ${a.username ?? a.displayName ?? "?"} ${a._id}`);
}

const COMMANDS = { accounts, validate, draft, schedule, status, delete: remove };
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
