#!/usr/bin/env node
// App icons for the Compare section, from each app's own store listing:
// the App Store (Apple's lookup API, US store) or, for Android-only apps,
// Google Play. Saved as 192px PNGs in public/compare/icons/<slug>.png and
// named in the app file as "icon". Apps without a store listing (features
// built into the phone) keep the letter tile.
//
//   node scripts/compare-icons.mjs            # apps that have no icon yet
//   node scripts/compare-icons.mjs --all      # fetch every icon again
//   node scripts/compare-icons.mjs <slug> ... # these apps only

import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const ROOT = process.cwd();
const APPS_DIR = path.join(ROOT, "content/compare/apps");
const OUT_DIR = path.join(ROOT, "public/compare/icons");
const SIZE = 192;

const args = process.argv.slice(2);
const all = args.includes("--all");
const only = new Set(args.filter((a) => !a.startsWith("--")));

async function appStoreIcon(url) {
  const id = url.match(/id(\d+)/)?.[1];
  if (!id) return null;
  for (const country of ["us", ""]) {
    const res = await fetch(`https://itunes.apple.com/lookup?id=${id}${country ? `&country=${country}` : ""}`);
    const art = (await res.json()).results?.[0]?.artworkUrl512;
    if (art) return art.replace(/\/\d+x\d+bb\.\w+$/, "/512x512bb.png");
  }
  return null;
}

async function googlePlayIcon(url) {
  const res = await fetch(url, { headers: { "Accept-Language": "en-US" } });
  const html = await res.text();
  const og = html.match(/<meta property="og:image" content="([^"]+)"/)?.[1];
  return og ? og.replace(/=[^=/]*$/, "") + "=s512" : null;
}

fs.mkdirSync(OUT_DIR, { recursive: true });
for (const file of fs.readdirSync(APPS_DIR).filter((f) => f.endsWith(".json"))) {
  const full = path.join(APPS_DIR, file);
  const app = JSON.parse(fs.readFileSync(full, "utf8"));
  if (app.slug === "captio-ai") continue; // uses the site's own logo
  if (only.size > 0 && !only.has(app.slug)) continue;
  if (only.size === 0 && !all && app.icon) continue;

  const art = (app.appStoreUrl && (await appStoreIcon(app.appStoreUrl))) || (app.googlePlayUrl && (await googlePlayIcon(app.googlePlayUrl)));
  if (!art) {
    console.log(`${app.slug}: no store listing, keeps the letter tile`);
    continue;
  }
  const res = await fetch(art);
  if (!res.ok) {
    console.log(`${app.slug}: HTTP ${res.status} for ${art}`);
    continue;
  }
  const out = path.join(OUT_DIR, `${app.slug}.png`);
  await sharp(Buffer.from(await res.arrayBuffer())).resize(SIZE, SIZE, { fit: "cover" }).png({ compressionLevel: 9 }).toFile(out);

  app.icon = `/compare/icons/${app.slug}.png`;
  fs.writeFileSync(full, JSON.stringify(app, null, 2) + "\n");
  console.log(`${app.slug}: ${art.includes("mzstatic") ? "App Store" : "Google Play"} → ${path.relative(ROOT, out)}`);
}
