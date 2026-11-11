"use client";

import en from "./locales/en.json";

// The web app in the app's languages (Nejc 2026-11-11). The same 46 languages
// and, wherever the English is the app's, the same keys and translations as
// the app (app repo: src/i18n/locales, rules in src/i18n/STYLE.md); words only
// the web app has are under web.*. English (locales/en.json) is the source of
// truth; scripts/webapp-i18n.mjs copies the app's translations, merges the
// web's own and checks every language (npm run app:i18n-check).
//
// The language follows the browser (its first language Captio AI has), like
// the app follows the phone; ?lang=<code> picks one for that visit. Loaded
// once, before the app draws (DesktopApp), so t() is never called at a
// module's top level, only while drawing or acting. i18next's syntax:
// {{name}} placeholders, _one / _other (… _few, _many) plural keys with a
// `count` param.

export const LANGUAGE_CODES = [
  "en", "ar", "bn", "ca", "cs", "da", "de", "el", "es", "fa", "fi", "fr", "gu", "he", "hi", "hr", "hu", "id", "it", "ja",
  "kn", "ko", "ml", "mr", "ms", "nb", "nl", "or", "pa", "pl", "pt-BR", "pt-PT", "ro", "ru", "sk", "sl", "sv", "ta", "te",
  "th", "tr", "uk", "ur", "vi", "zh-Hans", "zh-Hant",
] as const;
export type LanguageCode = (typeof LANGUAGE_CODES)[number];

const RTL = new Set(["ar", "fa", "he", "ur"]);

type Dict = Record<string, string>;
export type Key = keyof typeof en;
type PluralBase<K> = K extends `${infer B}_one` ? B : K extends `${infer B}_other` ? B : never;
export type TKey = Key | PluralBase<Key>;

let dict: Dict = en as Dict;
let lang: LanguageCode = "en";
let plural = new Intl.PluralRules("en");

// A browser language tag as one Captio AI has: Chinese by script, Portuguese
// defaults to Brazilian, Norwegian to Bokmål, old Hebrew "iw" to "he".
export function matchLanguage(tag: string): LanguageCode | null {
  let loc: Intl.Locale;
  try {
    loc = new Intl.Locale(tag);
  } catch {
    return null;
  }
  const code = loc.language === "iw" ? "he" : loc.language === "no" || loc.language === "nn" ? "nb" : loc.language;
  if (code === "zh") return loc.script === "Hant" || /^(TW|HK|MO)$/.test(loc.region ?? "") ? "zh-Hant" : "zh-Hans";
  if (code === "pt") return loc.region === "PT" || loc.region === "AO" || loc.region === "MZ" ? "pt-PT" : "pt-BR";
  return (LANGUAGE_CODES as readonly string[]).includes(code) ? (code as LanguageCode) : null;
}

export function pickLanguage(): LanguageCode {
  if (typeof window === "undefined") return "en";
  const asked = new URLSearchParams(window.location.search).get("lang");
  const tags = [...(asked ? [asked] : []), ...(navigator.languages?.length ? navigator.languages : [navigator.language])];
  for (const t of tags) {
    const m = t && matchLanguage(t);
    if (m) return m;
  }
  return "en";
}

export async function loadLanguage(code: LanguageCode): Promise<void> {
  if (code !== "en") {
    try {
      const mod = (await import(`./locales/${code}.json`)) as { default: Dict };
      dict = { ...(en as Dict), ...mod.default };
    } catch {
      // A file that didn't load: English.
      code = "en";
      dict = en as Dict;
    }
  }
  lang = code;
  plural = new Intl.PluralRules(code);
  // The page itself (cards, the browser's own controls, screen readers).
  try {
    document.documentElement.lang = code;
    document.documentElement.dir = RTL.has(code) ? "rtl" : "ltr";
  } catch {
    // No document (never in the browser).
  }
}

export const currentLanguage = () => lang;
export const isRtl = () => RTL.has(lang);
// The language for dates and numbers (Intl), e.g. "de", "zh-Hant".
export const locale = () => lang;

// While strings are being moved over, any key (TKey once en.json is complete).
export function t(key: TKey | string, params?: Record<string, string | number>): string {
  let k: string = key;
  if (params && typeof params.count === "number" && !(k in dict)) {
    const form = `${k}_${plural.select(params.count)}`;
    k = form in dict ? form : `${k}_other`;
  }
  let s = dict[k] ?? (en as Dict)[k] ?? k;
  if (params) s = s.replace(/\{\{\s*(\w+)\s*\}\}/g, (m, name: string) => (name in params ? String(params[name]) : m));
  return s;
}
