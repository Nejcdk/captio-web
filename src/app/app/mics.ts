import { store } from "./client";
import { listMics, type Mic } from "./audio";

// Which microphone captions use, the app's rules (app repo: lib/microphones.ts):
// every microphone that isn't the computer's own is asked about once ("Which
// microphone should captions use?"); the answer is remembered per microphone
// ('use' it whenever it's connected, or keep the built-in one); closing the
// question or letting it go by is 'later' and it's asked again next session,
// never after the second time. Settings → Pick a microphone can switch the
// suggestions off and forget answers.

export type MicKind = "phone" | "bluetooth" | "wired" | "usb" | "other";
type Choice = { answer: "use" | "phone" | "later"; at: number; times?: number; name?: string; kind?: MicKind };
export type RememberedMic = { id: string; name: string; kind: MicKind; answer: "use" | "phone" };

const CHOICES_KEY = "captio_mic_choices";
const SUGGEST_KEY = "captio_mic_suggest";
const MAX_LATER = 2;

// The app's kinds (analytics uses the same ids); "phone" = the computer's own.
export function kindOf(m: Mic): MicKind {
  if (m.builtIn) return "phone";
  if (/airpods|bluetooth|\bbt\b|buds|bose|sony|jabra|wh-|wf-|beats|hands-free/i.test(m.label)) return "bluetooth";
  if (/usb|rode|blue yeti|shure|elgato|focusrite|scarlett|webcam|camera|logitech/i.test(m.label)) return "usb";
  if (/headset|headphone|external|line in|wired/i.test(m.label)) return "wired";
  return "other";
}

export function kindLabel(kind: MicKind): string {
  return { phone: "Built in", bluetooth: "Bluetooth", wired: "Wired", usb: "USB", other: "External" }[kind];
}

export const micEmoji = (kind: MicKind) => (kind === "phone" ? "💻" : kind === "bluetooth" || kind === "wired" ? "🎧" : "🎙️");

// "MacBook Pro Microphone (Built-in)" → "MacBook Pro Microphone".
export function micName(label: string): string {
  return label.replace(/\s*\([0-9a-f]{4}:[0-9a-f]{4}\)\s*$/i, "").replace(/^Default - /, "").replace(/\s*\(Built-in\)$/i, "") || "Microphone";
}

function readChoices(): Record<string, Choice> {
  const raw = store.get<Record<string, Choice | string>>(CHOICES_KEY, {});
  // Older shape (by label, a bare answer): dropped, asked again.
  const out: Record<string, Choice> = {};
  for (const [id, c] of Object.entries(raw)) if (c && typeof c === "object") out[id] = c;
  return out;
}

function writeChoice(mic: Mic, answer: Choice["answer"]) {
  const choices = readChoices();
  const prev = choices[mic.id];
  const times = answer === "later" ? (prev?.answer === "later" ? (prev.times ?? 1) + 1 : 1) : undefined;
  choices[mic.id] = { answer, at: Date.now(), name: micName(mic.label), kind: kindOf(mic), ...(times ? { times } : {}) };
  store.set(CHOICES_KEY, choices);
}

export const answerMic = (mic: Mic, useIt: boolean) => writeChoice(mic, useIt ? "use" : "phone");
export const dismissMic = (mic: Mic) => writeChoice(mic, "later");

export function suggestionsOn(): boolean {
  return store.get<string>(SUGGEST_KEY, "on") !== "off";
}

export function setSuggestionsOn(on: boolean) {
  store.set(SUGGEST_KEY, on ? "on" : "off");
}

export function rememberedMics(): RememberedMic[] {
  return Object.entries(readChoices())
    .filter(([, c]) => c.answer !== "later")
    .sort(([, a], [, b]) => b.at - a.at)
    .map(([id, c]) => ({ id, name: c.name ?? "", kind: c.kind ?? "other", answer: c.answer as "use" | "phone" }));
}

export function forgetMic(id: string) {
  const choices = readChoices();
  delete choices[id];
  store.set(CHOICES_KEY, choices);
}

// The first connected microphone (not the computer's) nobody answered for.
export function micToAskAbout(mics: Mic[]): Mic | null {
  if (!suggestionsOn()) return null;
  const choices = readChoices();
  return mics.find(m => {
    if (m.builtIn || !m.label) return false;
    const c = choices[m.id];
    return !c || (c.answer === "later" && (c.times ?? 1) < MAX_LATER);
  }) ?? null;
}

// Where captions should listen: the one picked in Settings when it's
// connected, else the most recently chosen external microphone, else the
// built-in one when it was preferred over one that's connected, else the
// computer's default ("").
export async function preferredMicId(settingsId: string): Promise<string> {
  const mics = await listMics();
  if (settingsId && mics.some(m => m.id === settingsId)) return settingsId;
  const choices = readChoices();
  const external = mics.filter(m => !m.builtIn);
  const use = external
    .filter(m => choices[m.id]?.answer === "use")
    .sort((a, b) => choices[b.id].at - choices[a.id].at)[0];
  if (use) return use.id;
  if (external.some(m => choices[m.id]?.answer === "phone")) return mics.find(m => m.builtIn)?.id ?? "";
  return "";
}
