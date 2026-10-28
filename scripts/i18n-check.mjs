// Checks the translations of the home page and the feature pages
// (src/i18n/messages/<code>.json) against the English source (en.json).
//
//   node scripts/i18n-check.mjs          every language
//   node scripts/i18n-check.mjs de fr    only these
//
// Errors (exit 1): invalid JSON, a key or list item missing or extra, an empty
// text where English has one, "Captio AI" dropped or changed, the hero title
// without its two [underlined] phrases, a middle dot. Warnings: text left in
// English.
import { readFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const dir = path.join(root, "src/i18n/messages");
const localesSrc = readFileSync(path.join(root, "src/i18n/locales.ts"), "utf8");
const allCodes = [...localesSrc.matchAll(/\{ code: "([a-z]{2})"/g)].map((m) => m[1]).filter((c) => c !== "en");

// Words that are the same in every language (brands, formats, the FAQ label).
const SAME_OK = /^(FAQ|Blog|Captio AI|App Store|Google Play|iPhone|Android|\d+\+?.*)$/;

const en = JSON.parse(readFileSync(path.join(dir, "en.json"), "utf8"));
const codes = process.argv.slice(2).length ? process.argv.slice(2) : allCodes;

let errors = 0;
let warnings = 0;

function walk(src, tr, at, report) {
  if (typeof src === "string") {
    if (typeof tr !== "string") return report.error(`${at}: expected text`);
    if (src !== "" && tr.trim() === "") return report.error(`${at}: empty`);
    if (src === "" && tr !== "") return report.error(`${at}: must stay empty`);
    // Catalan's "l·l" (il·limitat) is spelling, not a separator.
    if (/·/.test(tr.replace(/l·l/gi, ""))) report.error(`${at}: middle dot`);
    const brand = (s) => (s.match(/Captio AI/g) ?? []).length;
    if (brand(src) > 0 && brand(tr) === 0) report.error(`${at}: "Captio AI" missing`);
    if (/\bCaptio\b(?! AI)/.test(tr)) report.error(`${at}: "Captio" without "AI"`);
    if (src !== "" && tr === src && !SAME_OK.test(src)) report.warn(`${at}: same as English`);
    return;
  }
  if (Array.isArray(src)) {
    if (!Array.isArray(tr)) return report.error(`${at}: expected a list`);
    if (tr.length !== src.length) return report.error(`${at}: ${tr.length} items, English has ${src.length}`);
    src.forEach((v, i) => walk(v, tr[i], `${at}[${i}]`, report));
    return;
  }
  if (typeof tr !== "object" || tr === null || Array.isArray(tr)) return report.error(`${at}: expected an object`);
  for (const k of Object.keys(src)) {
    if (!(k in tr)) report.error(`${at}.${k}: missing`);
    else walk(src[k], tr[k], `${at}.${k}`, report);
  }
  for (const k of Object.keys(tr)) if (!(k in src)) report.error(`${at}.${k}: not in English`);
}

for (const code of codes) {
  const file = path.join(dir, `${code}.json`);
  const lines = [];
  const report = {
    error: (m) => { errors++; lines.push(`  ✗ ${m}`); },
    warn: (m) => { warnings++; lines.push(`  ! ${m}`); },
  };
  if (!existsSync(file)) {
    report.error("file missing");
  } else {
    let tr;
    try {
      tr = JSON.parse(readFileSync(file, "utf8"));
    } catch (e) {
      report.error(`invalid JSON: ${e.message}`);
    }
    if (tr) {
      walk(en, tr, code, report);
      const hero = tr.home?.heroTitle ?? "";
      if ((hero.match(/\[[^\[\]]+\]/g) ?? []).length !== 2) report.error(`${code}.home.heroTitle: needs exactly two [phrases]`);
    }
  }
  console.log(`${lines.some((l) => l.includes("✗")) ? "✗" : "✓"} ${code}`);
  for (const l of lines) console.log(l);
}

console.log(`\n${codes.length} languages, ${errors} errors, ${warnings} warnings`);
process.exit(errors ? 1 : 0);
