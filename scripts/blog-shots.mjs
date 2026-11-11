#!/usr/bin/env node
// Real Captio AI screens for one blog article, made from that article's scene.
//
//   npm run blog:shots -- <slug>          renders content/blog/scenes/<slug>.json
//   npm run blog:shots -- --all           every scene
//
// A scene is sample content that fits the article (a check-up for a doctor's
// appointment guide, a lecture for a classroom guide): recordings, folders,
// transcripts with speaker names, summaries and other actions. The script
// starts the website in dev mode, opens the web app (/app?preview=1, the same
// app as on the phone, at phone size) with that scene instead of its made-up
// recordings, and saves each screen the scene asks for in a phone frame:
//
//   public/blog-images/<slug>/captio-ai-<shot name>.webp   (in the article)
//   public/blog-images/<slug>/share.png                    (the share card, 1200x630)
//
// Nothing is drawn by hand: every pixel of the screen is the real app. Rules for
// writing a scene: content/blog/PLAYBOOK.md section 12.
//
// Env: CHROME_PATH (else the usual places), BLOG_SHOTS_URL (use a dev server
// that is already running, e.g. http://localhost:3000; it must be `next dev`).
import { spawn } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import puppeteer from "puppeteer-core";

const ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const SCENES = path.join(ROOT, "content/blog/scenes");
const OUT = path.join(ROOT, "public/blog-images");
const POSTS = path.join(ROOT, "content/blog/posts");

// iPhone 17 Pro in CSS pixels; the status bar is part of the frame, the app
// gets the rest (as on the phone, where the app starts below it).
const W = 402;
const H = 874;
const STATUS = 54;
const SCALE = 2;

export const SCREENS = ["home", "folders", "folder", "captions", "summary", "action"];
export const ACTIONS = ["summary", "key_points", "notes", "todos", "qa", "follow_up"];
const TONES = ["blue", "green", "orange", "red", "purple"];
const BLOCKS = ["header", "subheader", "paragraph", "bullet", "numbered", "todo", "quote", "callout", "fact", "qa"];

const WELCOME_ID = /WELCOME_ID = "([^"]+)"/.exec(readFileSync(path.join(ROOT, "src/app/app/welcome.ts"), "utf8"))?.[1];

// ─── Scene ────────────────────────────────────────────────────────────────────

export function loadScene(slug) {
  const file = path.join(SCENES, `${slug}.json`);
  if (!existsSync(file)) throw new Error(`no scene: content/blog/scenes/${slug}.json`);
  const scene = JSON.parse(readFileSync(file, "utf8"));
  const problems = checkScene(scene, slug);
  if (problems.length) throw new Error(`scene ${slug}:\n  ${problems.join("\n  ")}`);
  return scene;
}

/** Everything that would make a broken or misleading picture. Used by blog-check too. */
export function checkScene(scene, slug) {
  const p = [];
  const recs = scene.recordings ?? [];
  const folders = scene.folders ?? [];
  const shots = scene.shots ?? [];
  const recIds = new Set(recs.map((r) => r.id));
  const folderIds = new Set(folders.map((f) => f.id));
  if (!recs.length) p.push("needs at least one recording");
  if (!shots.length) p.push("needs at least one shot");
  for (const f of folders) {
    if (!f.id || !f.name) p.push(`folder needs id and name: ${JSON.stringify(f)}`);
    if (f.color && !/^#[0-9A-Fa-f]{6}$/.test(f.color)) p.push(`folder ${f.id}: color must be #RRGGBB`);
  }
  for (const r of recs) {
    const where = `recording ${r.id ?? "?"}`;
    if (!r.id || !r.title || !r.emoji) p.push(`${where}: needs id, title and emoji`);
    if (/\bCaptio\b(?! AI)/.test(JSON.stringify(r))) p.push(`${where}: write "Captio AI", never "Captio" alone`);
    if (r.folder && !folderIds.has(r.folder)) p.push(`${where}: unknown folder ${r.folder}`);
    if (r.ago && !/^\d+(m|h|d)$/.test(r.ago)) p.push(`${where}: ago is like 20m, 3h or 2d`);
    if (!Array.isArray(r.segments) || !r.segments.length) p.push(`${where}: needs segments`);
    for (const s of r.segments ?? []) {
      if (typeof s.text !== "string" || !s.text.trim()) p.push(`${where}: a segment without text`);
    }
    for (const b of [...(r.summary ?? []), ...Object.values(r.actions ?? {}).flat()]) {
      if (!BLOCKS.includes(b.type)) p.push(`${where}: unknown block type ${b.type}`);
      if (b.type === "callout" && !TONES.includes(b.tone)) p.push(`${where}: callout tone is one of ${TONES.join(", ")}`);
    }
    for (const k of Object.keys(r.actions ?? {})) {
      if (!ACTIONS.includes(k) || k === "summary") p.push(`${where}: actions keys are ${ACTIONS.slice(1).join(", ")} (the summary goes in "summary")`);
    }
  }
  const names = new Set();
  for (const s of shots) {
    const where = `shot ${s.name ?? "?"}`;
    if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(s.name ?? "")) p.push(`${where}: name is lowercase words with dashes`);
    if (/^captio/.test(s.name ?? "")) p.push(`${where}: leave out "captio-ai-", it is added`);
    if (names.has(s.name)) p.push(`${where}: two shots with one name`);
    names.add(s.name);
    if (!SCREENS.includes(s.screen)) p.push(`${where}: screen is one of ${SCREENS.join(", ")}`);
    if (["captions", "summary", "action"].includes(s.screen) && !recIds.has(s.recording)) p.push(`${where}: needs a recording from this scene`);
    if (s.screen === "folder" && !folderIds.has(s.folder)) p.push(`${where}: needs a folder from this scene`);
    if (s.screen === "action" && !ACTIONS.includes(s.action)) p.push(`${where}: action is one of ${ACTIONS.join(", ")}`);
    const rec = recs.find((r) => r.id === s.recording);
    if (s.screen === "summary" && rec && !rec.summary?.length) p.push(`${where}: recording ${rec.id} has no summary`);
    if (s.screen === "action" && rec && s.action !== "summary" && !rec.actions?.[s.action]?.length) p.push(`${where}: recording ${rec.id} has no ${s.action}`);
  }
  if (slug && scene.slug && scene.slug !== slug) p.push(`slug "${scene.slug}" doesn't match the file name`);
  if (slug && !existsSync(path.join(POSTS, `${slug}.md`))) p.push(`no article content/blog/posts/${slug}.md yet (write it first, or the scene is for nothing)`);
  return p;
}

const AGO = { m: 60_000, h: 3_600_000, d: 86_400_000 };

/** The scene as the web app's preview reads it (window.__CAPTIO_SCENE__). */
function toPreview(scene) {
  const me = "preview-me";
  const now = Date.now();
  const userOf = (by) => (by ? `scene-${by.toLowerCase().replace(/[^a-z0-9]+/g, "-")}` : me);
  const recordings = scene.recordings.map((r, i) => {
    const m = /^(\d+)(m|h|d)$/.exec(r.ago ?? "");
    return {
      id: r.id,
      userId: userOf(r.by),
      title: r.title,
      emoji: r.emoji,
      durationSeconds: Math.round((r.minutes ?? 5) * 60),
      createdAt: now - (m ? Number(m[1]) * AGO[m[2]] : (i + 1) * 3 * AGO.h),
      folderId: r.folder ?? null,
    };
  });
  const folders = (scene.folders ?? []).map((f, i) => ({
    id: f.id, ownerId: me, name: f.name, icon: f.icon ?? "", color: f.color ?? "#4DA8F7", position: i,
  }));
  const people = [];
  for (const f of scene.folders ?? []) {
    const by = new Set(scene.recordings.filter((r) => r.folder === f.id && r.by).map((r) => r.by));
    for (const name of [...by, ...(f.people ?? [])]) people.push({ folderId: f.id, userId: userOf(name), name });
    if (by.size || f.people?.length) people.push({ folderId: f.id, userId: me, name: scene.me ?? "Me" });
  }
  const bodies = Object.fromEntries(scene.recordings.map((r) => [r.id, {
    segments: r.segments.map((s) => ({
      speaker: s.speaker ?? "", language: s.language ?? "en", text: s.text,
      ...(s.original ? { original: s.original } : {}),
    })),
    speakerNames: r.speakerNames ?? {},
    labels: r.labels ?? null,
    people: r.people ?? {},
    summary: r.summary ?? [],
  }]));
  // Other actions live in this browser (app: on the phone), keyed per recording.
  const extras = Object.fromEntries(scene.recordings.filter((r) => r.actions).map((r) => [`captio_rec_${r.id}`, { actions: r.actions }]));
  return { library: { recordings, folders, people }, bodies, extras };
}

// ─── Browser ──────────────────────────────────────────────────────────────────

function findChrome() {
  const pw = "/opt/pw-browsers";
  const fromPw = existsSync(pw)
    ? readdirSync(pw).filter((d) => /^chromium-\d+$/.test(d)).map((d) => path.join(pw, d, "chrome-linux/chrome"))
    : [];
  const found = [
    process.env.CHROME_PATH,
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    "/usr/bin/google-chrome",
    "/usr/bin/google-chrome-stable",
    "/usr/bin/chromium",
    ...fromPw,
  ].find((p) => p && existsSync(p));
  if (!found) throw new Error("Chrome not found: set CHROME_PATH");
  return found;
}

async function startServer() {
  if (process.env.BLOG_SHOTS_URL) return { url: process.env.BLOG_SHOTS_URL.replace(/\/$/, ""), stop() {} };
  const port = 3300 + Math.floor(Math.random() * 500);
  // The preview needs a Supabase address to start, never a real one: nothing
  // is read from or sent to an account.
  const child = spawn("npx", ["next", "dev", "--port", String(port)], {
    cwd: ROOT,
    env: { ...process.env, SUPABASE_URL: "http://127.0.0.1:9", SUPABASE_ANON_KEY: "blog-shots", NEXT_TELEMETRY_DISABLED: "1" },
    stdio: ["ignore", "pipe", "pipe"],
    detached: process.platform !== "win32",
  });
  let log = "";
  child.stdout.on("data", (d) => { log += d; });
  child.stderr.on("data", (d) => { log += d; });
  const url = `http://localhost:${port}`;
  const stop = () => { try { process.kill(-child.pid, "SIGTERM"); } catch { child.kill("SIGTERM"); } };
  const deadline = Date.now() + 240_000;
  while (Date.now() < deadline) {
    try {
      const res = await fetch(`${url}/app?preview=1`, { signal: AbortSignal.timeout(180_000) });
      if (res.ok) return { url, stop };
    } catch { /* still starting */ }
    if (child.exitCode !== null) break;
    await new Promise((r) => setTimeout(r, 1500));
  }
  stop();
  throw new Error(`the dev server didn't start:\n${log.slice(-2000)}`);
}

// Hidden on every shot: Next's dev badge, and the referral chip on the blue
// band (a new person doesn't see it in their first week either).
const SHOT_CSS = `
  nextjs-portal, [data-nextjs-toast], #__next-build-watcher { display: none !important; }
  .invite-chip-wrap { display: none !important; }
  *, *::before, *::after { caret-color: transparent !important; transition: none !important; }
`;

async function captureScreen(browser, base, preview, shot) {
  const page = await browser.newPage();
  await page.setViewport({ width: W, height: H - STATUS, deviceScaleFactor: SCALE, isMobile: true, hasTouch: true });
  await page.evaluateOnNewDocument((data, welcomeFlag) => {
    window.__CAPTIO_SCENE__ = { library: data.library, bodies: data.bodies };
    try {
      localStorage.clear();
      if (welcomeFlag) localStorage.setItem(welcomeFlag, "true");
      // Someone who has recorded before: no "start here" pulse on the button.
      localStorage.setItem("captio_started_from_home", "true");
      for (const [k, v] of Object.entries(data.extras)) localStorage.setItem(k, JSON.stringify(v));
    } catch { /* storage blocked: the shot shows without extras */ }
  }, preview, WELCOME_ID ? `captio_welcome_seeded_${WELCOME_ID}` : null);

  const query = shot.screen === "folders" ? "&tab=folders" : shot.screen === "folder" ? `&f=${encodeURIComponent(shot.folder)}` : "";
  await page.goto(`${base}/app?preview=1&plus=1${query}`, { waitUntil: "networkidle0", timeout: 180_000 });
  await page.addStyleTag({ content: SHOT_CSS });

  if (["captions", "summary", "action"].includes(shot.screen)) {
    const row = `[data-row="${shot.recording}"]`;
    await page.waitForSelector(row, { timeout: 30_000 });
    await page.click(row);
    await page.waitForSelector('[role="tab"]', { timeout: 30_000 });
    if (shot.screen !== "captions") {
      await clickText(page, '[role="tab"]', "Actions");
      const label = shot.screen === "summary" ? "summary" : shot.action;
      await page.waitForSelector(".act-tile", { timeout: 15_000 });
      await page.evaluate((kind) => {
        const tiles = [...document.querySelectorAll(".act-tile")];
        const order = ["summary", "key_points", "notes", "todos", "qa", "follow_up"];
        tiles[order.indexOf(kind)]?.click();
      }, label);
    }
  }
  await page.evaluate(() => document.fonts.ready);
  await new Promise((r) => setTimeout(r, 900));
  // Everything at rest: entrances finished, looping hints (the record button's
  // pulse and sheen, a wiggle) back to how they look between two loops.
  await page.evaluate(() => {
    for (const a of document.getAnimations()) {
      try { if (a.effect?.getComputedTiming().iterations === Infinity) a.cancel(); else a.finish(); } catch { a.cancel(); }
    }
  });
  await new Promise((r) => setTimeout(r, 150));
  const top = await page.evaluate(() => {
    const el = document.elementFromPoint(20, 2);
    let node = el;
    while (node) {
      const bg = getComputedStyle(node).backgroundColor;
      if (bg && bg !== "rgba(0, 0, 0, 0)" && bg !== "transparent") return bg;
      node = node.parentElement;
    }
    return "rgb(255, 255, 255)";
  });
  const png = await page.screenshot({ type: "png" });
  const errors = await page.evaluate(() => document.body.innerText.includes("Something went wrong"));
  await page.close();
  if (errors) throw new Error(`shot ${shot.name}: the app showed an error`);
  return { png: Buffer.from(png).toString("base64"), top };
}

async function clickText(page, selector, text) {
  const ok = await page.evaluate((sel, t) => {
    const el = [...document.querySelectorAll(sel)].find((e) => e.textContent.includes(t));
    el?.click();
    return !!el;
  }, selector, text);
  if (!ok) throw new Error(`nothing to click: ${selector} "${text}"`);
}

// ─── Frame and share card ─────────────────────────────────────────────────────

const isDark = (rgb) => {
  const [r, g, b] = (rgb.match(/\d+/g) ?? [255, 255, 255]).map(Number);
  return 0.299 * r + 0.587 * g + 0.114 * b < 150;
};

const STATUS_ICONS = (ink) => `
  <svg width="19" height="12" viewBox="0 0 19 12"><g fill="${ink}"><rect x="0" y="8" width="3" height="4" rx="1"/><rect x="5" y="5.5" width="3" height="6.5" rx="1"/><rect x="10" y="3" width="3" height="9" rx="1"/><rect x="15" y="0" width="3" height="12" rx="1"/></g></svg>
  <svg width="17" height="12" viewBox="0 0 17 12"><path fill="${ink}" d="M8.5 2.3c2.3 0 4.4.9 6 2.4l1.2-1.2A10.2 10.2 0 0 0 8.5.6 10.2 10.2 0 0 0 1.3 3.5l1.2 1.2a8.5 8.5 0 0 1 6-2.4Zm0 3.4c1.4 0 2.6.5 3.6 1.4l1.2-1.2a6.8 6.8 0 0 0-9.6 0l1.2 1.2c1-.9 2.2-1.4 3.6-1.4Zm0 3.4c.5 0 1 .2 1.3.5L8.5 11 7.2 9.6c.3-.3.8-.5 1.3-.5Z"/></svg>
  <svg width="27" height="13" viewBox="0 0 27 13"><rect x=".5" y=".5" width="23" height="12" rx="3.8" fill="none" stroke="${ink}" stroke-opacity=".4"/><rect x="2" y="2" width="20" height="9" rx="2.5" fill="${ink}"/><path d="M25 4.5v4c.8-.3 1.3-1.1 1.3-2s-.5-1.7-1.3-2Z" fill="${ink}" fill-opacity=".45"/></svg>`;

const FONT = `@font-face{font-family:GS;font-weight:600;src:url(data:font/woff2;base64,${readFileSync(path.join(ROOT, "src/app/app/fonts/GoogleSans-600SemiBold.woff2")).toString("base64")})}
@font-face{font-family:GS;font-weight:700;src:url(data:font/woff2;base64,${readFileSync(path.join(ROOT, "src/app/app/fonts/GoogleSans-700Bold.woff2")).toString("base64")})}`;

const BEZEL = 13;
const phoneHtml = ({ png, top }) => {
  const ink = isDark(top) ? "#fff" : "#000";
  return `<div class="phone"><div class="screen">
    <div class="status" style="background:${top};color:${ink}"><span class="time">9:41</span><span class="island"></span><span class="icons">${STATUS_ICONS(ink)}</span></div>
    <img src="data:image/png;base64,${png}" width="${W}" height="${H - STATUS}" alt="">
  </div></div>`;
};
const PHONE_CSS = `
  .phone{width:${W + 2 * BEZEL}px;height:${H + 2 * BEZEL}px;padding:${BEZEL}px;border-radius:${68 + BEZEL}px;background:#0b0b0d;box-shadow:inset 0 0 0 2px #2c2c30,inset 0 0 0 4px #0b0b0d}
  .screen{position:relative;width:${W}px;height:${H}px;border-radius:68px;overflow:hidden;background:#fff}
  .screen img{display:block}
  .status{position:relative;height:${STATUS}px;display:flex;align-items:center;justify-content:space-between;padding:6px 30px 0 46px;font:600 17px GS,sans-serif;letter-spacing:-.2px}
  .island{position:absolute;left:50%;top:11px;width:124px;height:36px;margin-left:-62px;border-radius:20px;background:#000}
  .icons{display:flex;gap:6px;align-items:center}
`;

async function framePhone(browser, screen) {
  const page = await browser.newPage();
  await page.setViewport({ width: W + 2 * BEZEL, height: H + 2 * BEZEL, deviceScaleFactor: SCALE });
  await page.setContent(`<!doctype html><meta charset="utf-8"><style>${FONT}*{margin:0;box-sizing:border-box}html,body{background:transparent}${PHONE_CSS}</style>${phoneHtml(screen)}`);
  await page.evaluate(() => document.fonts.ready);
  const el = await page.$(".phone");
  const webp = await el.screenshot({ type: "webp", quality: 86, omitBackground: true });
  await page.close();
  return Buffer.from(webp);
}

function escapeHtml(t) {
  return String(t).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

async function shareCard(browser, screen, title) {
  const page = await browser.newPage();
  await page.setViewport({ width: 1200, height: 630, deviceScaleFactor: 1 });
  const size = title.length > 80 ? 50 : title.length > 55 ? 58 : 66;
  await page.setContent(`<!doctype html><meta charset="utf-8"><style>${FONT}
    *{margin:0;box-sizing:border-box}
    body{width:1200px;height:630px;overflow:hidden;background:#1C49F5;color:#fff;font-family:GS,sans-serif;position:relative}
    .text{position:absolute;left:80px;top:72px;bottom:72px;width:640px;display:flex;flex-direction:column;justify-content:space-between}
    .brand{font-weight:700;font-size:30px}
    h1{font-weight:700;font-size:${size}px;line-height:1.08;letter-spacing:-1px}
    .site{font-weight:600;font-size:26px;opacity:.8}
    .shot{position:absolute;left:790px;top:60px;transform-origin:top left;transform:scale(.62)}
    ${PHONE_CSS}
  </style>
  <div class="text"><div class="brand">Captio AI Blog</div><h1>${escapeHtml(title)}</h1><div class="site">captioai.app/blog</div></div>
  <div class="shot">${phoneHtml(screen)}</div>`);
  await page.evaluate(() => document.fonts.ready);
  const png = await page.screenshot({ type: "png" });
  await page.close();
  return Buffer.from(png);
}

function postTitle(slug) {
  const md = readFileSync(path.join(POSTS, `${slug}.md`), "utf8");
  const m = /^title:\s*"?(.+?)"?\s*$/m.exec(md);
  return m ? m[1].replace(/\\"/g, '"') : slug;
}

// ─── Run ──────────────────────────────────────────────────────────────────────

async function main() {
  const args = process.argv.slice(2).filter((a) => a !== "--");
  const slugs = args.includes("--all")
    ? readdirSync(SCENES).filter((f) => f.endsWith(".json")).map((f) => f.replace(/\.json$/, ""))
    : args;
  if (!slugs.length) {
    console.error("usage: npm run blog:shots -- <slug> [<slug>…] | --all");
    process.exit(1);
  }
  const scenes = slugs.map((slug) => [slug, loadScene(slug)]);
  const server = await startServer();
  const browser = await puppeteer.launch({ executablePath: findChrome(), headless: true, args: ["--no-sandbox", "--hide-scrollbars", "--lang=en-GB"] });
  try {
    for (const [slug, scene] of scenes) {
      const preview = toPreview(scene);
      const dir = path.join(OUT, slug);
      mkdirSync(dir, { recursive: true });
      let first = null;
      for (const shot of scene.shots) {
        const screen = await captureScreen(browser, server.url, preview, shot);
        first ??= screen;
        const file = path.join(dir, `captio-ai-${shot.name}.webp`);
        writeFileSync(file, await framePhone(browser, screen));
        console.log(`  /blog-images/${slug}/captio-ai-${shot.name}.webp`);
      }
      writeFileSync(path.join(dir, "share.png"), await shareCard(browser, first, postTitle(slug)));
      console.log(`  /blog-images/${slug}/share.png`);
    }
  } finally {
    await browser.close();
    server.stop();
  }
  console.log("\nOpen each picture (Read it) before using it: it must show what the alt text says.");
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main().catch((e) => {
    console.error(e.message ?? e);
    process.exit(1);
  });
}
