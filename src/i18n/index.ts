// Translations of the home page and the four feature pages. The rest of the
// site is English only. How to translate: src/i18n/TRANSLATING.md.
import en from "./messages/en.json";
import { ALL_LOCALES, DEFAULT_LOCALE, getLocale } from "./locales";

export type Messages = typeof en;

export const FEATURE_SLUGS = ["live-captions", "live-translator", "audio-transcription", "ai-summary"] as const;
export type FeatureSlug = (typeof FEATURE_SLUGS)[number];

/** A page that exists in every language. */
export type TranslatedPage = "home" | FeatureSlug | "organizations";

export function isFeatureSlug(slug: string): slug is FeatureSlug {
  return (FEATURE_SLUGS as readonly string[]).includes(slug);
}

export async function getMessages(code: string): Promise<Messages> {
  if (code === DEFAULT_LOCALE) return en;
  return (await import(`./messages/${code}.json`)).default as Messages;
}

/** "/" and "/live-captions" in English, "/de" and "/de/live-captions" in German (also "/de/organizations"). */
export function pagePath(code: string, page: TranslatedPage): string {
  const tail = page === "home" ? "" : `/${page}`;
  if (code === DEFAULT_LOCALE) return tail || "/";
  return `/${code}${tail}`;
}

/** hreflang links for a page: every language, English as x-default. */
export function languageAlternates(page: TranslatedPage): Record<string, string> {
  const links: Record<string, string> = {};
  for (const l of ALL_LOCALES) links[l.code] = pagePath(l.code, page);
  links["x-default"] = pagePath(DEFAULT_LOCALE, page);
  return links;
}

function capitalize(text: string, code: string) {
  return text.charAt(0).toLocaleUpperCase(code) + text.slice(1);
}

/** A language's name written in another language: "German" in English, "Deutsch" in German. */
export function languageName(of: string, inCode: string): string {
  // English uses the site's own names (Intl says "Filipino" for Tagalog).
  if (inCode === DEFAULT_LOCALE) return getLocale(of).name;
  const name = new Intl.DisplayNames([inCode], { type: "language" }).of(of);
  return name && name !== of ? capitalize(name, inCode) : getLocale(of).name;
}

export type LanguageOption = {
  code: string;
  /** The language's own name ("Deutsch"). */
  native: string;
  /** Its name in the language of the page the reader is on ("German"). */
  local: string;
  href: string;
};

/** The header's language menu for a page, sorted by name in the reader's language. */
export function languageOptions(current: string, page: TranslatedPage): LanguageOption[] {
  const collator = new Intl.Collator(current);
  return ALL_LOCALES.map((l) => ({
    code: l.code,
    native: l.native,
    local: languageName(l.code, current),
    href: pagePath(l.code, page),
  })).sort((a, b) => collator.compare(a.local, b.local));
}
