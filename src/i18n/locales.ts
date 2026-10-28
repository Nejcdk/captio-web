// The languages the home page and the four feature pages are translated into:
// every language the site has a language page for (src/lib/languages.ts), in
// the same order. English lives at the unprefixed URLs (/, /live-captions);
// every other language under its code (/de, /de/live-captions).
//
// Kept free of "@/..." imports: next.config.ts reads it too.

export type Locale = {
  /** URL prefix and hreflang value (ISO 639-1). */
  code: string;
  /** English name, as on the site's language list. */
  name: string;
  /** The language's own name, shown in the language menu. */
  native: string;
  /** Open Graph locale (language_TERRITORY). */
  og: string;
  /** The language page this language has, /[slug]. */
  slug: string;
  rtl?: boolean;
};

export const DEFAULT_LOCALE = "en";

export const ENGLISH: Locale = { code: "en", name: "English", native: "English", og: "en_US", slug: "english" };

/** Every translated language (English not included). */
export const LOCALES: Locale[] = [
  { code: "zh", name: "Chinese", native: "简体中文", og: "zh_CN", slug: "chinese" },
  { code: "hi", name: "Hindi", native: "हिन्दी", og: "hi_IN", slug: "hindi" },
  { code: "es", name: "Spanish", native: "Español", og: "es_ES", slug: "spanish" },
  { code: "ar", name: "Arabic", native: "العربية", og: "ar_SA", slug: "arabic", rtl: true },
  { code: "bn", name: "Bengali", native: "বাংলা", og: "bn_BD", slug: "bengali" },
  { code: "pt", name: "Portuguese", native: "Português", og: "pt_BR", slug: "portuguese" },
  { code: "ru", name: "Russian", native: "Русский", og: "ru_RU", slug: "russian" },
  { code: "ur", name: "Urdu", native: "اردو", og: "ur_PK", slug: "urdu", rtl: true },
  { code: "id", name: "Indonesian", native: "Bahasa Indonesia", og: "id_ID", slug: "indonesian" },
  { code: "de", name: "German", native: "Deutsch", og: "de_DE", slug: "german" },
  { code: "ja", name: "Japanese", native: "日本語", og: "ja_JP", slug: "japanese" },
  { code: "sw", name: "Swahili", native: "Kiswahili", og: "sw_KE", slug: "swahili" },
  { code: "mr", name: "Marathi", native: "मराठी", og: "mr_IN", slug: "marathi" },
  { code: "te", name: "Telugu", native: "తెలుగు", og: "te_IN", slug: "telugu" },
  { code: "tr", name: "Turkish", native: "Türkçe", og: "tr_TR", slug: "turkish" },
  { code: "vi", name: "Vietnamese", native: "Tiếng Việt", og: "vi_VN", slug: "vietnamese" },
  { code: "ko", name: "Korean", native: "한국어", og: "ko_KR", slug: "korean" },
  { code: "fr", name: "French", native: "Français", og: "fr_FR", slug: "french" },
  { code: "it", name: "Italian", native: "Italiano", og: "it_IT", slug: "italian" },
  { code: "ta", name: "Tamil", native: "தமிழ்", og: "ta_IN", slug: "tamil" },
  { code: "fa", name: "Persian", native: "فارسی", og: "fa_IR", slug: "persian", rtl: true },
  { code: "pa", name: "Punjabi", native: "ਪੰਜਾਬੀ", og: "pa_IN", slug: "punjabi" },
  { code: "gu", name: "Gujarati", native: "ગુજરાતી", og: "gu_IN", slug: "gujarati" },
  { code: "th", name: "Thai", native: "ไทย", og: "th_TH", slug: "thai" },
  { code: "pl", name: "Polish", native: "Polski", og: "pl_PL", slug: "polish" },
  { code: "uk", name: "Ukrainian", native: "Українська", og: "uk_UA", slug: "ukrainian" },
  { code: "ms", name: "Malay", native: "Bahasa Melayu", og: "ms_MY", slug: "malay" },
  { code: "ml", name: "Malayalam", native: "മലയാളം", og: "ml_IN", slug: "malayalam" },
  { code: "kn", name: "Kannada", native: "ಕನ್ನಡ", og: "kn_IN", slug: "kannada" },
  { code: "tl", name: "Tagalog", native: "Tagalog", og: "tl_PH", slug: "tagalog" },
  { code: "az", name: "Azerbaijani", native: "Azərbaycanca", og: "az_AZ", slug: "azerbaijani" },
  { code: "nl", name: "Dutch", native: "Nederlands", og: "nl_NL", slug: "dutch" },
  { code: "ro", name: "Romanian", native: "Română", og: "ro_RO", slug: "romanian" },
  { code: "kk", name: "Kazakh", native: "Қазақ тілі", og: "kk_KZ", slug: "kazakh" },
  { code: "cs", name: "Czech", native: "Čeština", og: "cs_CZ", slug: "czech" },
  { code: "hu", name: "Hungarian", native: "Magyar", og: "hu_HU", slug: "hungarian" },
  { code: "el", name: "Greek", native: "Ελληνικά", og: "el_GR", slug: "greek" },
  { code: "sv", name: "Swedish", native: "Svenska", og: "sv_SE", slug: "swedish" },
  { code: "he", name: "Hebrew", native: "עברית", og: "he_IL", slug: "hebrew", rtl: true },
  { code: "bg", name: "Bulgarian", native: "Български", og: "bg_BG", slug: "bulgarian" },
  { code: "sr", name: "Serbian", native: "Srpski", og: "sr_RS", slug: "serbian" },
  { code: "da", name: "Danish", native: "Dansk", og: "da_DK", slug: "danish" },
  { code: "sq", name: "Albanian", native: "Shqip", og: "sq_AL", slug: "albanian" },
  { code: "af", name: "Afrikaans", native: "Afrikaans", og: "af_ZA", slug: "afrikaans" },
  { code: "be", name: "Belarusian", native: "Беларуская", og: "be_BY", slug: "belarusian" },
  { code: "fi", name: "Finnish", native: "Suomi", og: "fi_FI", slug: "finnish" },
  { code: "sk", name: "Slovak", native: "Slovenčina", og: "sk_SK", slug: "slovak" },
  { code: "hr", name: "Croatian", native: "Hrvatski", og: "hr_HR", slug: "croatian" },
  { code: "no", name: "Norwegian", native: "Norsk", og: "nb_NO", slug: "norwegian" },
  { code: "ca", name: "Catalan", native: "Català", og: "ca_ES", slug: "catalan" },
  { code: "lt", name: "Lithuanian", native: "Lietuvių", og: "lt_LT", slug: "lithuanian" },
  { code: "bs", name: "Bosnian", native: "Bosanski", og: "bs_BA", slug: "bosnian" },
  { code: "gl", name: "Galician", native: "Galego", og: "gl_ES", slug: "galician" },
  { code: "mk", name: "Macedonian", native: "Македонски", og: "mk_MK", slug: "macedonian" },
  { code: "sl", name: "Slovenian", native: "Slovenščina", og: "sl_SI", slug: "slovenian" },
  { code: "lv", name: "Latvian", native: "Latviešu", og: "lv_LV", slug: "latvian" },
  { code: "et", name: "Estonian", native: "Eesti", og: "et_EE", slug: "estonian" },
  { code: "cy", name: "Welsh", native: "Cymraeg", og: "cy_GB", slug: "welsh" },
  { code: "eu", name: "Basque", native: "Euskara", og: "eu_ES", slug: "basque" },
];

export const LOCALE_CODES = LOCALES.map((l) => l.code);

/** English first, then every translation. */
export const ALL_LOCALES: Locale[] = [ENGLISH, ...LOCALES];

export function isLocale(code: string): boolean {
  return LOCALE_CODES.includes(code);
}

export function getLocale(code: string): Locale {
  return ALL_LOCALES.find((l) => l.code === code) ?? ENGLISH;
}
