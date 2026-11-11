import type { FolderPerson, Recording, RecordingBody, TranscriptSegment } from "./data";
import { locale, t } from "./i18n";

// The app's own rules for dates, colours and speaker tags (app repo:
// src/lib/shared.ts, color.ts, voiceprint.ts, voiceNaming.ts), so a recording
// reads the same here as on the phone.

export const SPEAKER_COLORS = ["#1060D0", "#D93025", "#1E8E3E", "#E37400", "#8430CE", "#007B83", "#C2185B", "#0288D1"];

// "25 September, 14:05" (the year only when it isn't this year): day and
// month in the UI language, 24-hour time (app: formatDateTime).
export function formatDateTime(ms: number): string {
  const d = new Date(ms);
  const opts: Intl.DateTimeFormatOptions = { day: "numeric", month: "long" };
  if (d.getFullYear() !== new Date().getFullYear()) opts.year = "numeric";
  const time = `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
  const lang = locale();
  let date: string;
  try {
    date = d.toLocaleDateString(lang === "en" ? "en-GB" : lang, opts);
  } catch {
    date = d.toLocaleDateString("en-GB", opts);
  }
  return t("datetime.dateTime", { date, time });
}

export function formatDuration(seconds: number): string {
  if (seconds < 60) return t("web.format.seconds", { s: Math.max(1, Math.round(seconds)) });
  const h = Math.floor(seconds / 3600);
  const m = Math.round((seconds % 3600) / 60);
  return h ? t("widgets.hoursMinutes", { h, m }) : t("widgets.minutes", { m });
}

// ─── Colour maths (app: src/lib/color.ts) ─────────────────────────────────────

function parse(hex: string): [number, number, number] {
  const n = parseInt(hex.replace("#", "").slice(0, 6), 16) || 0;
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

function toHex(r: number, g: number, b: number): string {
  const c = (v: number) => Math.max(0, Math.min(255, Math.round(v)));
  return `#${((1 << 24) | (c(r) << 16) | (c(g) << 8) | c(b)).toString(16).slice(1)}`;
}

// Towards white (amount > 0) or black (amount < 0), 0…1.
export function shade(hex: string, amount: number): string {
  const [r, g, b] = parse(hex);
  const target = amount > 0 ? 255 : 0;
  const a = Math.abs(amount);
  return toHex(r + (target - r) * a, g + (target - g) * a, b + (target - b) * a);
}

export function luminance(hex: string): number {
  const [r, g, b] = parse(hex).map(v => {
    const s = v / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export function tint(hex: string, alpha: number): string {
  const [r, g, b] = parse(hex);
  return `rgba(${r},${g},${b},${alpha})`;
}

// A tag's text colour: darkened until it reads on white, so pastel picks work.
export function tagInk(hex: string): string {
  let ink = hex;
  for (let i = 0; i < 8 && luminance(ink) > 0.3; i++) ink = shade(ink, -0.15);
  return ink;
}

// ─── Language flags (app: LANGUAGES + LANGUAGE_CODES) ─────────────────────────

const FLAGS: Record<string, string> = {
  af: "🇿🇦", sq: "🇦🇱", ar: "🇸🇦", az: "🇦🇿", eu: "🇪🇸", be: "🇧🇾", bn: "🇧🇩", bs: "🇧🇦", bg: "🇧🇬", ca: "🇪🇸",
  zh: "🇨🇳", hr: "🇭🇷", cs: "🇨🇿", da: "🇩🇰", nl: "🇳🇱", en: "🇬🇧", et: "🇪🇪", fi: "🇫🇮", fr: "🇫🇷", gl: "🇪🇸",
  de: "🇩🇪", el: "🇬🇷", gu: "🇮🇳", he: "🇮🇱", hi: "🇮🇳", hu: "🇭🇺", id: "🇮🇩", it: "🇮🇹", ja: "🇯🇵", kn: "🇮🇳",
  kk: "🇰🇿", ko: "🇰🇷", lv: "🇱🇻", lt: "🇱🇹", mk: "🇲🇰", ms: "🇲🇾", ml: "🇮🇳", mr: "🇮🇳", no: "🇳🇴", fa: "🇮🇷",
  pl: "🇵🇱", pt: "🇵🇹", pa: "🇮🇳", ro: "🇷🇴", ru: "🇷🇺", sr: "🇷🇸", sk: "🇸🇰", sl: "🇸🇮", es: "🇪🇸", sw: "🇰🇪",
  sv: "🇸🇪", tl: "🇵🇭", ta: "🇮🇳", te: "🇮🇳", th: "🇹🇭", tr: "🇹🇷", uk: "🇺🇦", ur: "🇵🇰", vi: "🇻🇳", cy: "🏴󠁧󠁢󠁷󠁬󠁳󠁿",
};

export function languageFlag(code?: string | null): string | null {
  return code ? FLAGS[code.toLowerCase().split("-")[0]] ?? null : null;
}

// ─── Speaker tags ─────────────────────────────────────────────────────────────

export type SpeakerTag = { key: string; label: string; color: string | null; emoji?: string };

// Who a folder knows someone as ("by Ana").
export function personName(people: FolderPerson[], folderId: string | null, userId: string): string | null {
  return people.find(p => p.userId === userId && (!folderId || p.folderId === folderId))?.name
    ?? people.find(p => p.userId === userId)?.name
    ?? null;
}

// The recognised person the recording phone sent, else the name typed for
// that speaker, else "Speaker N".
export function speakerTag(
  seg: TranscriptSegment, i: number, body: RecordingBody, rec: Recording, me: string, people: FolderPerson[],
): SpeakerTag {
  const name = body.labels?.[i];
  if (name) {
    const p = body.people[name] ?? {};
    const owner = p.me && rec.userId !== me ? personName(people, rec.folderId, rec.userId) : null;
    let h = 0;
    for (let k = 0; k < name.length; k++) h = (h * 31 + name.charCodeAt(k)) | 0;
    return {
      key: `v:${name}`,
      label: owner ?? name,
      color: p.c ?? SPEAKER_COLORS[Math.abs(h) % SPEAKER_COLORS.length],
      emoji: p.e ?? "👤",
    };
  }
  if (!seg.speaker) return { key: "", label: "", color: null };
  const n = parseInt(seg.speaker, 10);
  return {
    key: `s:${seg.speaker}`,
    label: body.speakerNames[seg.speaker]?.trim() || t("common.speaker", { n: seg.speaker }),
    color: n > 0 ? SPEAKER_COLORS[(n - 1) % SPEAKER_COLORS.length] : null,
  };
}

// Plain text of the captions, for Copy.
export function captionsText(body: RecordingBody, tags: SpeakerTag[]): string {
  const out: string[] = [];
  body.segments.forEach((seg, i) => {
    const tag = tags[i];
    const label = tag.label && tag.key !== tags[i - 1]?.key ? `${tag.label}: ` : "";
    out.push(`${label}${seg.text}`.trim());
  });
  return out.join("\n\n");
}
