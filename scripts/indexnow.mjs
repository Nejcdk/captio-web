#!/usr/bin/env node
// Tell Bing (and every other IndexNow engine: Yandex, Seznam, Naver...) that
// pages changed, so they recrawl within minutes instead of days. ChatGPT search
// and Copilot answer from Bing's index, so this is how a new article reaches them.
//
//   node scripts/indexnow.mjs https://captioai.app/blog/<slug> https://captioai.app/blog
//
// The key file public/<KEY>.txt must stay deployed; it proves we own the host.

const KEY = "909b1b15cc9541d4d0eb0f8f5c305192";
const HOST = "captioai.app";

const urls = process.argv.slice(2).filter((u) => u.startsWith(`https://${HOST}/`));
if (urls.length === 0) {
  console.error("Usage: node scripts/indexnow.mjs https://captioai.app/<path> [...]");
  process.exit(1);
}

const res = await fetch("https://api.indexnow.org/indexnow", {
  method: "POST",
  headers: { "Content-Type": "application/json; charset=utf-8" },
  body: JSON.stringify({
    host: HOST,
    key: KEY,
    keyLocation: `https://${HOST}/${KEY}.txt`,
    urlList: urls,
  }),
});

// 200 = accepted, 202 = accepted (key check pending). Anything else is a failure.
console.log(`IndexNow: HTTP ${res.status} for ${urls.length} URL(s)`);
if (res.status !== 200 && res.status !== 202) {
  console.error(await res.text());
  process.exit(1);
}
