import type { Library, RecordingBody } from "./data";

// Dev only (`npm run dev`, then /app?preview=1): made-up recordings, so the
// layout can be checked without signing in. Never in a production build.

const HOUR = 3600_000;
const now = Date.now();

export const PREVIEW_USER = "preview-me";

export const PREVIEW_LIBRARY: Library = {
  recordings: [
    { id: "p1", userId: PREVIEW_USER, title: "Weekly product sync", emoji: "📊", durationSeconds: 2460, createdAt: now - 2 * HOUR, folderId: "f-work" },
    { id: "p2", userId: "preview-ana", title: "Dinner plans for Saturday", emoji: "🍝", durationSeconds: 380, createdAt: now - 26 * HOUR, folderId: "f-family" },
    { id: "p3", userId: PREVIEW_USER, title: "Check-up with Dr. Novak", emoji: "🩺", durationSeconds: 1140, createdAt: now - 50 * HOUR, folderId: null },
    { id: "p4", userId: PREVIEW_USER, title: "History of Rome, lecture 4", emoji: "🏛️", durationSeconds: 4980, createdAt: now - 5 * 24 * HOUR, folderId: null },
    { id: "p5", userId: PREVIEW_USER, title: "Client call with Lumen Studio", emoji: "🤝", durationSeconds: 1720, createdAt: now - 8 * 24 * HOUR, folderId: "f-work" },
    { id: "p6", userId: PREVIEW_USER, title: "Ordering coffee in Lisbon", emoji: "☕", durationSeconds: 95, createdAt: now - 21 * 24 * HOUR, folderId: null },
  ],
  folders: [
    { id: "f-work", ownerId: PREVIEW_USER, name: "Work", icon: "briefcase", color: "#1C49F5", position: 0 },
    { id: "f-family", ownerId: PREVIEW_USER, name: "Family", icon: "heart", color: "#FF6FAE", position: 1 },
  ],
  people: [
    { folderId: "f-family", userId: PREVIEW_USER, name: "Nejc" },
    { folderId: "f-family", userId: "preview-ana", name: "Ana" },
    { folderId: "f-family", userId: "preview-ben", name: "Ben" },
  ],
};

const sync: RecordingBody = {
  segments: [
    { speaker: "1", language: "en", text: "Okay, let's get started. Three things today: the iPad release, the onboarding numbers, and what we ship next week." },
    { speaker: "2", language: "en", text: "The iPad build passed review this morning, so it can go out whenever we want. I'd push the button tomorrow at nine, when support is online." },
    { speaker: "1", language: "en", text: "Tomorrow at nine works. Onboarding?" },
    { speaker: "3", language: "en", text: "People who see their own words in the demo pay almost three times as often as people who skip it. So the demo has to work every single time, even on a slow connection." },
    { speaker: "2", language: "en", text: "Then let's make the demo reconnect by itself, and show Listening while it waits for the first word." },
    { speaker: "1", language: "en", text: "Agreed. Ana takes the demo, Ben the release notes. Same time next week." },
  ],
  speakerNames: { "1": "Nejc", "2": "Ana" },
  labels: null,
  people: {},
  summary: [
    { type: "header", emoji: "📊", text: "Weekly product sync" },
    { type: "callout", tone: "blue", title: "In short", text: "The iPad build is approved and goes out tomorrow at 9:00. The onboarding demo becomes the top priority because people who see their words in it pay far more often." },
    { type: "subheader", text: "Decisions" },
    { type: "bullet", label: "Release", text: "iPad version goes live tomorrow at 9:00, when support is online." },
    { type: "bullet", label: "Demo", text: "Reconnects by itself and shows Listening until the first word." },
    { type: "subheader", text: "To-dos" },
    { type: "todo", text: "Make the onboarding demo reconnect on a slow connection", done: false, owner: "Ana" },
    { type: "todo", text: "Write the release notes for the iPad version", done: true, owner: "Ben", due: "Tomorrow" },
    { type: "fact", label: "Next meeting", text: "Same time next week" },
    { type: "fact", label: "People", text: "Nejc, Ana, Ben" },
  ],
};

const dinner: RecordingBody = {
  segments: [
    { speaker: "1", language: "en", text: "So who's bringing what on Saturday?" },
    { speaker: "2", language: "en", text: "I'll do the pasta, and Ben said he'd bring dessert. Can you get the wine?" },
    { speaker: "1", language: "en", text: "Sure. Red or white?" },
    { speaker: "2", language: "en", text: "Both, there'll be eight of us." },
  ],
  speakerNames: {},
  labels: ["Nejc", "Ana", "Nejc", "Ana"],
  people: { Nejc: { e: "🧔", c: "#1C49F5" }, Ana: { e: "🙋‍♀️", c: "#FF6FAE", me: true } },
  summary: [],
};

const doctor: RecordingBody = {
  segments: [
    { speaker: "1", language: "en", text: "Your blood pressure looks much better than last time. Are you still taking the tablets every morning?" },
    { speaker: "2", language: "en", text: "Every morning, with breakfast. I sometimes feel a bit dizzy when I stand up quickly." },
    { speaker: "1", language: "en", text: "That can happen. Stand up slowly, drink enough water, and if it gets worse, call me. Let's check again in three months." },
  ],
  speakerNames: { "1": "Dr. Novak" },
  labels: null,
  people: {},
  summary: [],
};

const lisbon: RecordingBody = {
  segments: [
    { speaker: "1", language: "en", text: "Good morning! What can I get you?", original: { language: "pt", text: "Bom dia! O que vai ser?" } },
    { speaker: "2", language: "en", text: "A coffee and a custard tart, please." },
    { speaker: "1", language: "en", text: "Here or to take away?", original: { language: "pt", text: "É para comer aqui ou para levar?" } },
  ],
  speakerNames: {},
  labels: null,
  people: {},
  summary: [],
};

export const PREVIEW_BODIES: Record<string, RecordingBody> = {
  p1: sync, p2: dinner, p3: doctor, p5: sync, p6: lisbon,
  p4: {
    segments: [{ speaker: "", language: "en", text: "Last week we left Rome as a small city of farmers on seven hills. Today we follow how it became a republic, and why the Romans hated the word king so much that they kept that fear for five hundred years." }],
    speakerNames: {}, labels: null, people: {}, summary: [],
  },
};
