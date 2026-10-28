// Checks the translations of the home page and the feature pages
// (src/i18n/messages/<code>.json) and of /organizations + /o/<code>
// (src/i18n/organizations/<code>.json) against their English sources (en.json).
//
//   node scripts/i18n-check.mjs          every language
//   node scripts/i18n-check.mjs de fr    only these
//
// Errors (exit 1): invalid JSON, a key or list item missing or extra, an empty
// text where English has one, "Captio AI" dropped or changed, the hero title
// without its two [underlined] phrases (organizations: one), a {placeholder}
// missing or added, a middle dot. Warnings: text left in English.
import { readFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const SETS = [
  { name: "messages", dir: path.join(root, "src/i18n/messages"), hero: (tr) => tr.home?.heroTitle, phrases: 2, heroKey: "home.heroTitle" },
  { name: "organizations", dir: path.join(root, "src/i18n/organizations"), hero: (tr) => tr.hero?.title, phrases: 1, heroKey: "hero.title" },
];
const localesSrc = readFileSync(path.join(root, "src/i18n/locales.ts"), "utf8");
const allCodes = [...localesSrc.matchAll(/\{ code: "([a-z]{2})"/g)].map((m) => m[1]).filter((c) => c !== "en");

// Words that are the same in every language (brands, formats, the FAQ label).
const SAME_OK = /^(FAQ|Blog|Captio AI|App Store|Google Play|iPhone|Android|Ana|\d+\+?.*)$/;

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
    const names = (s) => [...s.matchAll(/\{(\w+)\}/g)].map((m) => m[1]).sort().join(",");
    if (names(src) !== names(tr)) report.error(`${at}: placeholders {${names(src)}} expected, found {${names(tr)}}`);
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

for (const set of SETS) {
  const en = JSON.parse(readFileSync(path.join(set.dir, "en.json"), "utf8"));
  console.log(`── ${set.name}`);
  for (const code of codes) {
    const file = path.join(set.dir, `${code}.json`);
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
        const hero = set.hero(tr) ?? "";
        if ((hero.match(/\[[^\[\]]+\]/g) ?? []).length !== set.phrases) report.error(`${code}.${set.heroKey}: needs exactly ${set.phrases} [phrase${set.phrases > 1 ? "s" : ""}]`);
      }
    }
    console.log(`${lines.some((l) => l.includes("✗")) ? "✗" : "✓"} ${code}`);
    for (const l of lines) console.log(l);
  }
}

console.log(`\n${codes.length} languages, ${errors} errors, ${warnings} warnings`);
process.exit(errors ? 1 : 0);
