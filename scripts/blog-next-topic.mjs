#!/usr/bin/env node
// Prints the topic the daily run should write today, as JSON.
// Order: a "priority" topic (queued by the new-version check) first; then the
// first queued topic matching today's weekday slot in plan.json (category and
// pillar); then the first queued topic of that category; then the first queued.
//
//   node scripts/blog-next-topic.mjs            # today (Europe/Ljubljana)
//   node scripts/blog-next-topic.mjs friday     # as if it were Friday

import fs from "node:fs";

const plan = JSON.parse(fs.readFileSync("content/blog/plan.json", "utf8"));
const { topics } = JSON.parse(fs.readFileSync("content/blog/topics.json", "utf8"));

const weekday = (process.argv[2] ??
  new Intl.DateTimeFormat("en-GB", { weekday: "long", timeZone: "Europe/Ljubljana" }).format(new Date())).toLowerCase();
const slot = plan.weeklyRhythm[weekday];
if (!slot) {
  console.error(`Unknown weekday "${weekday}"`);
  process.exit(1);
}

const queued = topics.filter((t) => t.status === "queued");
const pick =
  queued.find((t) => t.priority) ??
  queued.find((t) => t.category === slot.category && (!slot.pillar || t.pillar === slot.pillar)) ??
  queued.find((t) => t.category === slot.category) ??
  queued[0];

if (!pick) {
  console.error("The queue is empty: add topics first (PLAYBOOK section 10).");
  process.exit(1);
}
const why = pick.priority ? "priority (new feature or update)" : pick.category === slot.category && (!slot.pillar || pick.pillar === slot.pillar) ? "matches today's slot" : "fallback";
console.log(JSON.stringify({ weekday, slot, why, queuedLeft: queued.length, topic: pick }, null, 2));
