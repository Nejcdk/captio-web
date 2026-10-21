#!/usr/bin/env node
// New-version check for the daily blog run. Asks Apple's public lookup API for
// the live App Store version of Captio AI and compares it with
// content/blog/state.json.
//
//   node scripts/blog-release-watch.mjs                       # SAME, NEW (+ release notes) or UNKNOWN
//   node scripts/blog-release-watch.mjs --save                # after handling a NEW version: remember it
//   node scripts/blog-release-watch.mjs --set 1.1.3 2026-10-28  # remember a version read another way
//
// The cloud sandbox can't reach Apple from the shell. On UNKNOWN, read
// https://itunes.apple.com/lookup?id=6796617180&country=us with WebFetch
// (version, currentVersionReleaseDate, releaseNotes), compare the version with
// state.json yourself, and use --set after handling it.
//
// On NEW, the run updates CAPTIO_FACTS.md from the release notes and the app
// repo (Nejcdk/captio: CLAUDE.md and the commits since the last version), then
// queues articles for what's new (DAILY.md, step 1).

import fs from "node:fs";

const STATE = "content/blog/state.json";
const LOOKUP = "https://itunes.apple.com/lookup?id=6796617180&country=us";
const state = JSON.parse(fs.readFileSync(STATE, "utf8"));
const today = new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Ljubljana" }).format(new Date());

function save(version, released) {
  state.appStore = { version, released, handled: today };
  fs.writeFileSync(STATE, JSON.stringify(state, null, 2) + "\n");
  console.log(`Saved ${version} to ${STATE}.`);
}

const setAt = process.argv.indexOf("--set");
if (setAt !== -1) {
  const [version, released] = process.argv.slice(setAt + 1);
  if (!/^\d+\.\d+(\.\d+)?$/.test(version ?? "")) {
    console.error("Usage: --set <version> <YYYY-MM-DD>");
    process.exit(1);
  }
  save(version, released ?? today);
  process.exit(0);
}

let app;
try {
  const res = await fetch(LOOKUP, { signal: AbortSignal.timeout(15000) });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  app = (await res.json()).results?.[0];
  if (!app) throw new Error("no app in the response");
} catch (e) {
  console.log(`UNKNOWN: couldn't read the App Store from here (${e.cause?.code ?? e.message}).`);
  console.log(`Read ${LOOKUP} with WebFetch instead and compare its "version" with ${state.appStore.version} (last handled).`);
  process.exit(0);
}

const live = { version: app.version, released: app.currentVersionReleaseDate?.slice(0, 10), notes: app.releaseNotes ?? "" };
if (live.version === state.appStore.version) {
  console.log(`SAME: App Store version ${live.version} (released ${live.released}). Nothing new to write about.`);
  process.exit(0);
}

console.log(`NEW: App Store version ${live.version} (released ${live.released}); last handled ${state.appStore.version}.`);
console.log(`\nRelease notes:\n${live.notes}\n`);
console.log("Next: read the app repo's CLAUDE.md and its commits since the last version, update CAPTIO_FACTS.md, queue priority topics, then run this again with --save.");
if (process.argv.includes("--save")) save(live.version, live.released);
