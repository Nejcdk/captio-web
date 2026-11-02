#!/usr/bin/env node
// Turns content/social/posts/*.json into Instagram and Facebook carousels.
//
//   node scripts/social-render.mjs              every post
//   node scripts/social-render.mjs <id> [<id>]  only these
//
// Writes content/social/out/<id>/NN.jpg (1080x1350, JPEG, what Instagram needs)
// and post.json next to them: the caption and one alt text per image, ready for
// Zernio. Design: white, one idea per slide, one blue highlight, a small
// wordmark, nothing else. A slide whose text can't fit stops the run.
import { existsSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import puppeteer from "puppeteer-core";

const ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const SOCIAL = path.join(ROOT, "content/social");
const ASSETS = path.join(SOCIAL, "assets");
const OUT = path.join(SOCIAL, "out");
const W = 1080;
const H = 1350;

export const END_LINE = "Live captions for deaf and hard of hearing people, in any situation.";

const asset = (...p) => pathToFileURL(path.join(ASSETS, ...p)).href;

function escapeHtml(text) {
  return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/'/g, "’");
}
// *words* are shown in blue on the slide; alt text drops the marks.
const plain = (text) => text.replace(/\*/g, "");
const marked = (text) => escapeHtml(text).replace(/\*([^*]+)\*/g, "<em>$1</em>");

const CSS = `
@font-face{font-family:GS;font-weight:600;src:url(${asset("fonts/GoogleSans_600SemiBold.ttf")})}
@font-face{font-family:GS;font-weight:700;src:url(${asset("fonts/GoogleSans_700Bold.ttf")})}
*{box-sizing:border-box;margin:0;padding:0}
html,body{width:${W}px;height:${H}px;overflow:hidden;background:#fff;color:#1C1C1E;font-family:GS,sans-serif;-webkit-font-smoothing:antialiased}
.box{position:absolute;left:96px;right:96px;top:96px;bottom:190px;display:flex;flex-direction:column;justify-content:center;overflow:hidden}
.big{font-size:136px;font-weight:700;letter-spacing:-4px;line-height:1.06}
.big em{font-style:normal;color:#1C49F5}
.mark{position:absolute;left:50%;bottom:84px;width:230px;height:30px;transform:translateX(-50%);background:#1C49F5;-webkit-mask:url(${asset("wordmark.png")}) center/contain no-repeat;mask:url(${asset("wordmark.png")}) center/contain no-repeat}
.end .box{bottom:96px}
.end .logo{width:560px;height:72px;flex:none;margin-bottom:48px;background:#1C49F5;-webkit-mask:url(${asset("wordmark.png")}) left center/contain no-repeat;mask:url(${asset("wordmark.png")}) left center/contain no-repeat}
.end p{font-size:68px;font-weight:600;letter-spacing:-1.6px;line-height:1.16}
`;

const FIT = `
async function fit(){
  await document.fonts.ready;
  for(const el of document.querySelectorAll('[data-fit]')){
    const box=el.closest('.box');
    const min=Number(el.dataset.fit);
    let size=parseFloat(getComputedStyle(el).fontSize);
    while(size>min&&(box.scrollHeight>box.clientHeight+1||el.scrollWidth>box.clientWidth+1)){size-=2;el.style.fontSize=size+'px';el.style.letterSpacing=-size*.03+'px'}
  }
  return [...document.querySelectorAll('.box')].some(b=>b.scrollHeight>b.clientHeight+1||b.scrollWidth>b.clientWidth+1);
}`;

const page = (kind, body) =>
  `<!doctype html><meta charset="utf-8"><style>${CSS}</style><body class="${kind}">${body}<script>${FIT}</script>`;

const textSlide = (text) =>
  page("text", `<div class="box"><div class="big" data-fit="84">${marked(text)}</div></div><div class="mark"></div>`);

const endSlide = () =>
  page("end", `<div class="box"><div class="logo"></div><p>${END_LINE}</p></div>`);

function slidesFor(post) {
  const cards = [post.question, ...post.slides];
  const total = cards.length + 1;
  return [
    ...cards.map((text, i) => ({
      html: textSlide(text),
      alt: `Slide ${i + 1} of ${total}. Captio AI card, black text on white: ${plain(text)}`,
    })),
    { html: endSlide(), alt: `Slide ${total} of ${total}. Captio AI logo and the words: ${END_LINE}` },
  ];
}

export function captionFor(post) {
  const more = `More: captioai.app${post.page === "/" ? "" : post.page}`;
  return [post.question, ...post.description, more, post.hashtags.join(" ")].join("\n\n");
}

export function loadPosts(ids = []) {
  const dir = path.join(SOCIAL, "posts");
  const files = readdirSync(dir).filter((f) => f.endsWith(".json"));
  const posts = files.map((f) => JSON.parse(readFileSync(path.join(dir, f), "utf8")));
  return ids.length ? posts.filter((p) => ids.includes(p.id)) : posts;
}

function findChrome() {
  const places = [
    process.env.CHROME_PATH,
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    "/usr/bin/google-chrome",
    "/usr/bin/chromium-browser",
  ];
  const found = places.find((p) => p && existsSync(p));
  if (!found) throw new Error("Chrome not found: set CHROME_PATH");
  return found;
}

// One page to read every sample at once: its slides and its full description.
function sheet(posts) {
  const rows = posts
    .map((post) => {
      const files = readdirSync(path.join(OUT, post.id)).filter((f) => f.endsWith(".jpg"));
      const imgs = files
        .map((f) => `<img src="${pathToFileURL(path.join(OUT, post.id, f)).href}">`)
        .join("");
      const text = escapeHtml(captionFor(post)).replace(/\n\n/g, "<br><br>");
      return `<section><h2>${escapeHtml(post.pageType)}: ${escapeHtml(post.page)}</h2><div class="row"><div class="imgs">${imgs}</div><div class="cap">${text}</div></div></section>`;
    })
    .join("");
  return `<!doctype html><meta charset="utf-8"><style>
@font-face{font-family:GS;font-weight:600;src:url(${asset("fonts/GoogleSans_600SemiBold.ttf")})}
body{margin:0;padding:28px;background:#EEF0F5;font-family:GS,sans-serif;color:#1C1C1E}
section{margin-bottom:34px}h2{font-size:22px;margin:0 0 10px}
.row{display:flex;gap:18px;align-items:flex-start}.imgs{display:flex;gap:8px;flex:none}
img{width:200px;height:auto;border-radius:6px;display:block}
.cap{background:#fff;border-radius:10px;padding:16px 20px;font-size:17px;line-height:1.36;width:900px}</style><body>${rows}`;
}

async function main() {
  const ids = process.argv.slice(2);
  const posts = loadPosts(ids);
  if (!posts.length) throw new Error("No posts found");
  const browser = await puppeteer.launch({
    executablePath: findChrome(),
    headless: true,
    args: ["--no-sandbox", "--allow-file-access-from-files", "--font-render-hinting=none"],
  });
  const tmp = path.join(tmpdir(), `social-render-${process.pid}`);
  mkdirSync(tmp, { recursive: true });
  const failed = [];
  try {
    const tab = await browser.newPage();
    await tab.setViewport({ width: W, height: H, deviceScaleFactor: 1 });
    for (const post of posts) {
      const dir = path.join(OUT, post.id);
      rmSync(dir, { recursive: true, force: true });
      mkdirSync(dir, { recursive: true });
      const media = [];
      for (const [i, slide] of slidesFor(post).entries()) {
        const file = `${String(i + 1).padStart(2, "0")}.jpg`;
        const htmlFile = path.join(tmp, "slide.html");
        writeFileSync(htmlFile, slide.html);
        await tab.goto(pathToFileURL(htmlFile).href, { waitUntil: "load" });
        if (await tab.evaluate("fit()")) failed.push(`${post.id} slide ${i + 1}`);
        await tab.screenshot({ path: path.join(dir, file), type: "jpeg", quality: 92 });
        media.push({ file, altText: slide.alt });
      }
      writeFileSync(
        path.join(dir, "post.json"),
        `${JSON.stringify({ id: post.id, caption: captionFor(post), media }, null, 2)}\n`,
      );
      console.log(`${post.id}: ${media.length} slides, ${captionFor(post).length} characters`);
    }
    if (posts.length > 1) {
      const sheetFile = path.join(tmp, "sheet.html");
      writeFileSync(sheetFile, sheet(posts));
      await tab.setViewport({ width: 1830, height: 1200, deviceScaleFactor: 1 });
      await tab.goto(pathToFileURL(sheetFile).href, { waitUntil: "networkidle0" });
      await tab.screenshot({ path: path.join(OUT, "sheet.jpg"), type: "jpeg", quality: 84, fullPage: true });
    }
  } finally {
    await browser.close();
    rmSync(tmp, { recursive: true, force: true });
  }
  if (failed.length) {
    console.error(`Text does not fit: ${failed.join(", ")}`);
    process.exit(1);
  }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) await main();
