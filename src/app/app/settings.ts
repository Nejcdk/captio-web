import { useSyncExternalStore } from "react";
import { t } from "./i18n";

// The app's caption settings (app repo: src/contexts/SettingsContext.tsx), kept
// in this browser like the phone keeps them on the phone: language hints,
// words and names, background text, Separate Speakers and the microphone.
// Live captions on the computer will read them.

export type Settings = {
  settingsLangHints: string[];
  contextWords: string[];
  contextWindowText: string;
  separateSpeakers: boolean;
  // A browser microphone's deviceId; "" = the computer's default.
  microphoneId: string;
};

const KEY = "captio_app_settings";

// A language's name in the app's language (the app's languages.<code>, which
// covers every language below). The stored value stays the English name.
export function languageLabel(name: string | null | undefined): string {
  if (!name) return "";
  const code = LANGUAGES.find(l => l.name === name)?.code;
  const key = `languages.${code}`;
  const label = code ? t(key) : key;
  return label === key ? name : label;
}

// A search in a language list finds the English name and the shown one.
export function languageMatches(name: string, query: string): boolean {
  const q = query.trim().toLocaleLowerCase();
  return !q || name.toLowerCase().includes(q) || languageLabel(name).toLocaleLowerCase().includes(q);
}

export const LANGUAGES = [
  { name: "Afrikaans", code: "af", flag: "🇿🇦" }, { name: "Albanian", code: "sq", flag: "🇦🇱" },
  { name: "Arabic", code: "ar", flag: "🇸🇦" }, { name: "Azerbaijani", code: "az", flag: "🇦🇿" },
  { name: "Basque", code: "eu", flag: "🇪🇸" }, { name: "Belarusian", code: "be", flag: "🇧🇾" },
  { name: "Bengali", code: "bn", flag: "🇧🇩" }, { name: "Bosnian", code: "bs", flag: "🇧🇦" },
  { name: "Bulgarian", code: "bg", flag: "🇧🇬" }, { name: "Catalan", code: "ca", flag: "🇪🇸" },
  { name: "Chinese", code: "zh", flag: "🇨🇳" }, { name: "Croatian", code: "hr", flag: "🇭🇷" },
  { name: "Czech", code: "cs", flag: "🇨🇿" }, { name: "Danish", code: "da", flag: "🇩🇰" },
  { name: "Dutch", code: "nl", flag: "🇳🇱" }, { name: "English", code: "en", flag: "🇬🇧" },
  { name: "Estonian", code: "et", flag: "🇪🇪" }, { name: "Finnish", code: "fi", flag: "🇫🇮" },
  { name: "French", code: "fr", flag: "🇫🇷" }, { name: "Galician", code: "gl", flag: "🇪🇸" },
  { name: "German", code: "de", flag: "🇩🇪" }, { name: "Greek", code: "el", flag: "🇬🇷" },
  { name: "Gujarati", code: "gu", flag: "🇮🇳" }, { name: "Hebrew", code: "he", flag: "🇮🇱" },
  { name: "Hindi", code: "hi", flag: "🇮🇳" }, { name: "Hungarian", code: "hu", flag: "🇭🇺" },
  { name: "Indonesian", code: "id", flag: "🇮🇩" }, { name: "Italian", code: "it", flag: "🇮🇹" },
  { name: "Japanese", code: "ja", flag: "🇯🇵" }, { name: "Kannada", code: "kn", flag: "🇮🇳" },
  { name: "Kazakh", code: "kk", flag: "🇰🇿" }, { name: "Korean", code: "ko", flag: "🇰🇷" },
  { name: "Latvian", code: "lv", flag: "🇱🇻" }, { name: "Lithuanian", code: "lt", flag: "🇱🇹" },
  { name: "Macedonian", code: "mk", flag: "🇲🇰" }, { name: "Malay", code: "ms", flag: "🇲🇾" },
  { name: "Malayalam", code: "ml", flag: "🇮🇳" }, { name: "Marathi", code: "mr", flag: "🇮🇳" },
  { name: "Norwegian", code: "no", flag: "🇳🇴" }, { name: "Persian", code: "fa", flag: "🇮🇷" },
  { name: "Polish", code: "pl", flag: "🇵🇱" }, { name: "Portuguese", code: "pt", flag: "🇵🇹" },
  { name: "Punjabi", code: "pa", flag: "🇮🇳" }, { name: "Romanian", code: "ro", flag: "🇷🇴" },
  { name: "Russian", code: "ru", flag: "🇷🇺" }, { name: "Serbian", code: "sr", flag: "🇷🇸" },
  { name: "Slovak", code: "sk", flag: "🇸🇰" }, { name: "Slovenian", code: "sl", flag: "🇸🇮" },
  { name: "Spanish", code: "es", flag: "🇪🇸" }, { name: "Swahili", code: "sw", flag: "🇰🇪" },
  { name: "Swedish", code: "sv", flag: "🇸🇪" }, { name: "Tagalog", code: "tl", flag: "🇵🇭" },
  { name: "Tamil", code: "ta", flag: "🇮🇳" }, { name: "Telugu", code: "te", flag: "🇮🇳" },
  { name: "Thai", code: "th", flag: "🇹🇭" }, { name: "Turkish", code: "tr", flag: "🇹🇷" },
  { name: "Ukrainian", code: "uk", flag: "🇺🇦" }, { name: "Urdu", code: "ur", flag: "🇵🇰" },
  { name: "Vietnamese", code: "vi", flag: "🇻🇳" }, { name: "Welsh", code: "cy", flag: "🏴󠁧󠁢󠁷󠁬󠁳󠁿" },
];

// The browser's language is ticked already, like the phone's in onboarding.
function defaults(): Settings {
  const code = typeof navigator !== "undefined" ? navigator.language.toLowerCase().split("-")[0] : "en";
  const lang = LANGUAGES.find(l => l.code === code) ?? LANGUAGES.find(l => l.code === "en")!;
  return { settingsLangHints: [lang.name], contextWords: [], contextWindowText: "", separateSpeakers: true, microphoneId: "" };
}

let cache: Settings | null = null;
const listeners = new Set<() => void>();

function read(): Settings {
  if (cache) return cache;
  let stored: Partial<Settings> = {};
  try {
    stored = JSON.parse(localStorage.getItem(KEY) ?? "{}") ?? {};
  } catch {
    // Private window or blocked storage: the defaults for this visit.
  }
  cache = { ...defaults(), ...stored };
  return cache;
}

export function updateSettings(patch: Partial<Settings>) {
  cache = { ...read(), ...patch };
  try {
    localStorage.setItem(KEY, JSON.stringify(cache));
  } catch {
    // Kept for this visit only.
  }
  listeners.forEach(l => l());
}

const subscribe = (l: () => void) => {
  listeners.add(l);
  return () => listeners.delete(l);
};

const SERVER: Settings = { settingsLangHints: [], contextWords: [], contextWindowText: "", separateSpeakers: true, microphoneId: "" };

export function useSettings(): Settings {
  return useSyncExternalStore(subscribe, read, () => SERVER);
}
