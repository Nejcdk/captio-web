#!/usr/bin/env node
// The web app's words in the app's languages (src/app/app/i18n.ts).
//
//   node scripts/webapp-i18n.mjs find "Some English text"   the app's key(s) for it
//   node scripts/webapp-i18n.mjs merge                     locales/parts/*.json → locales/en.json
//   node scripts/webapp-i18n.mjs build [--app <app repo>]  every locales/<lang>.json: the app's
//        translation where the key and English are the app's, else locales/web/<lang>.json
//   node scripts/webapp-i18n.mjs check                     every language has every key and placeholder
//
// The app repo defaults to ../Captio (its src/i18n/locales).

import { existsSync, readdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const LOCALES = join(ROOT, "src/app/app/locales");
const args = process.argv.slice(2);
const cmd = args[0];
const appArg = args.indexOf("--app");
const APP = resolve(appArg > 0 ? args[appArg + 1] : join(ROOT, "../Captio"));
const APP_LOCALES = join(APP, "src/i18n/locales");
const PLURALS = ["zero", "one", "two", "few", "many", "other"];

const read = p => JSON.parse(readFileSync(p, "utf8"));
const write = (p, o) => writeFileSync(p, JSON.stringify(Object.fromEntries(Object.entries(o).sort(([a], [b]) => a.localeCompare(b))), null, 2) + "\n");
function flat(o, prefix = "", out = {}) {
  for (const [k, v] of Object.entries(o)) {
    if (v && typeof v === "object") flat(v, `${prefix}${k}.`, out);
    else out[prefix + k] = v;
  }
  return out;
}
const appLocale = code => flat(read(join(APP_LOCALES, `${code}.json`)));
const LANGS = () => readdirSync(APP_LOCALES).filter(f => f.endsWith(".json")).map(f => f.slice(0, -5)).filter(c => c !== "en");
const placeholders = s => [...String(s).matchAll(/\{\{\s*(\w+)\s*\}\}/g)].map(m => m[1]).sort().join(",");
const pluralBase = k => { const m = k.match(/^(.*)_(zero|one|two|few|many|other)$/); return m ? m[1] : null; };

if (cmd === "find") {
  const text = args.slice(1).join(" ").trim();
  const en = appLocale("en");
  const norm = s => String(s).replace(/\{\{\s*\w+\s*\}\}/g, "{}").replace(/\$\{[^}]*\}/g, "{}").replace(/\s+/g, " ").trim().toLowerCase();
  const exact = Object.entries(en).filter(([, v]) => v === text);
  const loose = exact.length ? [] : Object.entries(en).filter(([, v]) => norm(v) === norm(text));
  const near = exact.length || loose.length ? [] : Object.entries(en).filter(([, v]) => norm(v).includes(norm(text)) && norm(text).length > 5).slice(0, 5);
  for (const [k, v] of exact) console.log(`EXACT  ${k}  ${JSON.stringify(v)}`);
  for (const [k, v] of loose) console.log(`SAME WITH PLACEHOLDERS  ${k}  ${JSON.stringify(v)}`);
  for (const [k, v] of near) console.log(`CONTAINS (not the same, don't use as is)  ${k}  ${JSON.stringify(v)}`);
  if (!exact.length && !loose.length && !near.length) console.log("NONE: make a web.* key");
} else if (cmd === "merge") {
  const enPath = join(LOCALES, "en.json");
  const en = existsSync(enPath) ? read(enPath) : {};
  let problems = 0;
  for (const f of readdirSync(join(LOCALES, "parts")).filter(f => f.endsWith(".json"))) {
    for (const [k, v] of Object.entries(read(join(LOCALES, "parts", f)))) {
      if (k in en && en[k] !== v) { console.error(`conflict ${k}: ${JSON.stringify(en[k])} vs ${JSON.stringify(v)} (${f})`); problems++; }
      else en[k] = v;
    }
  }
  if (problems) process.exit(1);
  write(enPath, en);
  if (args.includes("--clean")) rmSync(join(LOCALES, "parts"), { recursive: true });
  console.log(`en.json: ${Object.keys(en).length} keys`);
} else if (cmd === "build") {
  const en = read(join(LOCALES, "en.json"));
  const appEn = appLocale("en");
  const fromApp = Object.keys(en).filter(k => appEn[k] === en[k]);
  const missing = {};
  for (const code of LANGS()) {
    const app = appLocale(code);
    const webPath = join(LOCALES, "web", `${code}.json`);
    const web = existsSync(webPath) ? read(webPath) : {};
    const out = {};
    for (const k of Object.keys(en)) {
      const base = pluralBase(k);
      const own = fromApp.includes(k) ? app : web;
      if (base) {
        // Every plural form the language has, from the same source.
        for (const p of PLURALS) if (`${base}_${p}` in own) out[`${base}_${p}`] = own[`${base}_${p}`];
        if (!(`${base}_other` in out)) (missing[code] ??= []).push(k);
      } else if (k in own) out[k] = own[k];
      else (missing[code] ??= []).push(k);
    }
    write(join(LOCALES, `${code}.json`), out);
  }
  console.log(`${Object.keys(en).length} keys, ${fromApp.length} from the app`);
  const m = Object.entries(missing);
  if (m.length) { for (const [c, ks] of m) console.log(`${c}: ${ks.length} missing (${ks.slice(0, 4).join(", ")}…)`); process.exit(1); }
} else if (cmd === "check") {
  const en = read(join(LOCALES, "en.json"));
  let problems = 0;
  // Every key the code names exists in English (keys built from a variable,
  // like `mic.kind.${kind}`, are checked by their prefix).
  const SRC = join(ROOT, "src/app/app");
  for (const f of readdirSync(SRC).filter(f => /\.tsx?$/.test(f))) {
    const code = readFileSync(join(SRC, f), "utf8");
    for (const m of code.matchAll(/\bt\(\s*"([^"]+)"/g)) {
      const k = m[1];
      if (!(k in en) && !(`${k}_one` in en) && !(`${k}_other` in en)) { console.log(`${f}: t("${k}") isn't in en.json`); problems++; }
    }
    for (const m of code.matchAll(/\bt\(\s*`([^`$]+)\$\{/g)) {
      if (!Object.keys(en).some(k => k.startsWith(m[1]))) { console.log(`${f}: no keys start with ${m[1]}`); problems++; }
    }
  }
  for (const f of readdirSync(LOCALES).filter(f => f.endsWith(".json") && f !== "en.json")) {
    const loc = read(join(LOCALES, f));
    for (const [k, v] of Object.entries(en)) {
      const base = pluralBase(k);
      const forms = base ? PLURALS.map(p => `${base}_${p}`).filter(x => x in loc) : [k];
      if (!forms.length || !forms.every(x => x in loc)) { console.log(`${f}: missing ${k}`); problems++; continue; }
      for (const x of forms) {
        // A plural form may leave {{count}} out (Japanese "1件" style is fine).
        const want = placeholders(v).split(",").filter(p => p && !(base && p === "count")).join(",");
        const got = placeholders(loc[x]).split(",").filter(p => p && !(base && p === "count")).join(",");
        if (want !== got) { console.log(`${f}: ${x} placeholders ${got || "-"} ≠ ${want || "-"}`); problems++; }
      }
    }
    for (const k of Object.keys(loc)) {
      const base = pluralBase(k);
      if (!(k in en) && !(base && (`${base}_other` in en || `${base}_one` in en))) { console.log(`${f}: extra ${k}`); problems++; }
    }
  }
  console.log(problems ? `${problems} problems` : "all languages complete");
  process.exit(problems ? 1 : 0);
} else if (cmd === "verify-web") {
  // One language's own words (locales/web/<code>.json) against English.
  const code = args[1];
  const en = read(join(LOCALES, "en.json"));
  const web = read(join(LOCALES, "web", `${code}.json`));
  const plural = new Intl.PluralRules(code);
  const need = plural.resolvedOptions().pluralCategories;
  let problems = 0;
  const bases = new Set();
  for (const [k, v] of Object.entries(en).filter(([k]) => k.startsWith("web."))) {
    const base = pluralBase(k);
    if (base) {
      if (bases.has(base)) continue;
      bases.add(base);
      for (const c of need) if (!(`${base}_${c}` in web)) { console.log(`missing ${base}_${c} (${code} needs ${need.join(", ")})`); problems++; }
      continue;
    }
    if (!(k in web)) { console.log(`missing ${k}`); problems++; continue; }
    if (placeholders(v) !== placeholders(web[k])) { console.log(`${k}: placeholders ${placeholders(web[k]) || "-"} ≠ ${placeholders(v) || "-"}`); problems++; }
  }
  for (const k of Object.keys(web)) {
    const base = pluralBase(k);
    if (!(k in en) && !(base && (`${base}_other` in en))) { console.log(`extra ${k}`); problems++; }
  }
  console.log(problems ? `${code}: ${problems} problems` : `${code}: ok`);
  process.exit(problems ? 1 : 0);
} else {
  console.log("usage: find <text> | merge [--clean] | build [--app <path>] | check | verify-web <code>");
}
