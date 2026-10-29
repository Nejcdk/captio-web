import en from "./organizations/en.json";
import { DEFAULT_LOCALE } from "./locales";

// The words of /organizations (and its form) and of /o/<code>, the page people
// join an organization's pilot through. One file per language in
// organizations/<code>.json, every language the site has (locales.ts), checked
// by scripts/i18n-check.mjs like the home page. {name} marks a value filled in
// by the page; [phrase] in hero.title is underlined.

export type OrgMessages = typeof en;

export async function getOrgMessages(code: string): Promise<OrgMessages> {
  if (code === DEFAULT_LOCALE) return en;
  try {
    return (await import(`./organizations/${code}.json`)).default as OrgMessages;
  } catch {
    return en;
  }
}

export { fill } from "./fill";

export type Currency = "gbp" | "eur" | "usd";

// The price shown big on each language's page: pounds for English (the first
// organizations are in the UK) and Welsh, euros for languages spoken mostly in
// Europe, dollars for the rest. The other two are always shown under it.
const EURO_LANGUAGES = new Set([
  "de", "fr", "es", "it", "nl", "pt", "fi", "el", "sk", "sl", "lv", "lt", "et", "hr", "ca", "gl", "eu",
  "pl", "cs", "hu", "ro", "bg", "sv", "da", "no", "sq", "bs", "mk", "sr", "tr",
]);
export function orgCurrency(code: string): Currency {
  if (code === "en" || code === "cy") return "gbp";
  return EURO_LANGUAGES.has(code) ? "eur" : "usd";
}
