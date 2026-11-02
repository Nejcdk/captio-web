// Makes the site's app pictures in public/app/ from the mockups in public/:
// a WebP per entry of src/lib/app-images.json, named after what it shows
// ("captio-ai-live-captions-iphone.webp"), and writes each picture's size back
// into that file. Pages, the sitemap and the JSON-LD all read that list.
//
// Why: image search (and ChatGPT's answer pictures with it) had no picture of
// Captio AI at all. Named files at fixed addresses, alt text with the name and
// the image sitemap let it find them.
//
// Run after adding or changing a mockup: node scripts/app-images.mjs
// Needs ImageMagick (magick) and cwebp (brew install imagemagick webp).
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const listFile = path.join(root, "src/lib/app-images.json");
const outDir = path.join(root, "public/app");
const list = JSON.parse(fs.readFileSync(listFile, "utf8"));

fs.mkdirSync(outDir, { recursive: true });
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "app-images-"));

for (const img of list) {
  const src = path.join(root, "public", img.from);
  const resized = path.join(tmp, `${img.name}.png`);
  const out = path.join(outDir, `${img.name}.webp`);
  // Twice the largest size a page shows them at.
  execFileSync("magick", [src, "-resize", "900x1400>", resized]);
  execFileSync("cwebp", ["-quiet", "-q", "84", "-alpha_q", "100", resized, "-o", out]);
  const [w, h] = execFileSync("magick", ["identify", "-format", "%w %h", out]).toString().split(" ").map(Number);
  img.w = w;
  img.h = h;
  console.log(`${img.name}.webp ${w}x${h} ${Math.round(fs.statSync(out).size / 1024)} KB`);
}

fs.rmSync(tmp, { recursive: true, force: true });
fs.writeFileSync(listFile, `[\n${list.map((img) => `  ${JSON.stringify(img)}`).join(",\n")}\n]\n`);
