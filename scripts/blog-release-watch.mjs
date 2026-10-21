#!/usr/bin/env node
// New-version check for the daily blog run. Asks Apple's public lookup API for
// the live App Store version of Captio AI and compares it with
// content/blog/state.json.
//
//   node scripts/blog-release-watch.mjs          # prints SAME or NEW + release notes
//   node scripts/blog-release-watch.mjs --save   # after handling a NEW version: remember it
//
// On NEW, the run updates CAPTIO_FACTS.md from the release notes and the app
// repo (Nejcdk/captio: CLAUDE.md and the commits since the last version), then
// queues articles for what's new (DAILY.md, step 1).

import fs from "node:fs";

const STATE = "content/blog/state.json";
const state = JSON.parse(fs.readFileSync(STATE, "utf8"));

const res = await fetch("https://itunes.apple.com/lookup?id=6796617180&country=us");
if (!res.ok) {
  console.log(`UNKNOWN: App Store lookup answered HTTP ${res.status}; carry on and try again tomorrow.`);
  process.exit(0);
}
const app = (await res.json()).results?.[0];
if (!app) {
  console.log("UNKNOWN: App Store lookup returned no app; carry on and try again tomorrow.");
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

if (process.argv.includes("--save")) {
  state.appStore = { version: live.version, released: live.released, handled: new Date().toISOString().slice(0, 10) };
  fs.writeFileSync(STATE, JSON.stringify(state, null, 2) + "\n");
  console.log(`Saved ${live.version} to ${STATE}.`);
}
