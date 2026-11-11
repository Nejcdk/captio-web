import { getSupabase, isPreview } from "./client";
import type { Recording, RecordingBody, SummaryBlock } from "./data";
import { formatDateTime, type SpeakerTag } from "./format";
import { LANGUAGES } from "./settings";
import type { ActionKind } from "./actionPrompts";
import { isRtl, locale, t, type TKey } from "./i18n";

// Sends a recording out (app repo: src/lib/exportRecording.ts): its captions
// or one of its actions, as plain text (just the content), a share link
// (captioai.app/r/<id>), the designed PDF, an email or a ready-made AI prompt.
// The same texts, words and facts as the app; only the last step is the
// browser's own (share sheet or clipboard, Save as PDF, the mail app, the chat
// app). Everything but Text ends with the "get Captio AI" line. The frame
// (labels, headings, the "made with Captio AI" lines) is in the web app's
// language, with the app's export.* words; the recording's own words never
// change (the app writes the frame in the recording's language).

export type ExportWhat = "captions" | ActionKind;
export type ExportTarget = "pdf" | "text" | "email" | "chat" | "link";

// What an export reads: the recording, its lines and speaker tags, and an
// action's result (the Actions tab keeps those).
export type ExportSource = {
  rec: Recording;
  body: RecordingBody;
  tags: SpeakerTag[];
  content: (kind: ActionKind) => SummaryBlock[];
};

// Shown in text and email: the plain store link reads well.
const STORE_URL = "https://apps.apple.com/app/id6796617180";
// Behind the PDF's QR code and link, and the email's button: tagged, so App
// Store Connect counts the installs that came from exports.
export const storeLink = (campaign: string) => `https://apps.apple.com/app/apple-store/id6796617180?pt=129242349&ct=${campaign}&mt=8`;
const SHARE_BASE = "https://captioai.app/r/";

const TONE_EMOJI = { blue: "💡", green: "✅", orange: "⚠️", red: "🚨", purple: "📌" } as const;
const TONE_HEX = { blue: "#1C49F5", green: "#1E8E3E", orange: "#E37400", red: "#D93025", purple: "#8430CE" } as const;
const THEME = "#1C49F5";

const quoted = (text: string) => t("common.quoted", { text });

// The six actions' names (the app's ACTION_LABEL_KEY), also the Actions tab's.
const ACTION_LABEL_KEY = {
  summary: "actions.summary",
  key_points: "actions.key_points",
  notes: "actions.notes",
  todos: "actions.todos",
  qa: "actions.qa",
  follow_up: "actions.follow_up",
} as const satisfies Record<ActionKind, string>;

export const actionLabel = (kind: ActionKind) => t(ACTION_LABEL_KEY[kind]);

export const kindName = (what: ExportWhat) => (what === "captions" ? t("detail.tabCaptions") : actionLabel(what));

// A language's name in the web app's language (the app's languages.* words).
function languageName(code: string, name: string): string {
  const key = `languages.${code}`;
  const s = t(key as TKey);
  return s === key ? name : s;
}

type Block = { speaker: string; color: string | null; text: string; original?: string };

// The transcript as speaker blocks (consecutive lines of one speaker merged),
// with each translation's original alongside.
function blocks({ body, tags }: ExportSource): Block[] {
  const segs = body.segments;
  if (!segs.some(s => s.text.trim())) return [];
  const hasSpeakers = segs.some(s => !!s.speaker) || tags.some(t => !!t.label);
  const out: (Block & { key: string })[] = [];
  segs.forEach((seg, i) => {
    const text = seg.text.trim();
    if (!text) return;
    const original = seg.original?.text.trim() || undefined;
    const tag = tags[i] ?? { key: "", label: "", color: null };
    const prev = out[out.length - 1];
    // Pairs stay one per line so each original sits under its translation.
    if (prev && prev.key === tag.key && !original && !prev.original) {
      prev.text += ` ${text}`;
      return;
    }
    out.push({ key: tag.key, speaker: hasSpeakers ? tag.label : "", color: hasSpeakers ? tag.color : null, text, original });
  });
  return out.map(b => ({ speaker: b.speaker, color: b.color, text: b.text, ...(b.original ? { original: b.original } : {}) }));
}

export function hasExportable(src: ExportSource, what: ExportWhat): boolean {
  return what === "captions" ? blocks(src).length > 0 : src.content(what).length > 0;
}

// "(Ana, Fri 16 Oct)" after a to-do that has an owner or a due date.
const todoMeta = (b: Extract<SummaryBlock, { type: "todo" }>) => {
  const meta = [b.owner, b.due].filter(Boolean).join(", ");
  return meta ? ` (${meta})` : "";
};

// The share page knows the first seven block types only: the newer ones go
// there as their nearest plain equivalent.
function plainBlocks(items: SummaryBlock[]): SummaryBlock[] {
  return items.flatMap((b): SummaryBlock[] => {
    if (b.type === "header") return [{ type: "header", text: b.emoji ? `${b.emoji} ${b.text}` : b.text }];
    if (b.type === "bullet") return [{ type: "bullet", text: b.label ? `${b.label}: ${b.text}` : b.text }];
    if (b.type === "todo") return [{ type: "todo", text: b.text + todoMeta(b), done: b.done }];
    if (b.type === "callout") return [
      ...(b.title ? [{ type: "subheader" as const, text: [TONE_EMOJI[b.tone], b.title].filter(Boolean).join(" ") }] : []),
      { type: "paragraph", text: b.text },
    ];
    if (b.type === "fact") return [{ type: "bullet", text: `${b.label}: ${b.text}` }];
    if (b.type === "qa") return [{ type: "subheader", text: b.question }, { type: "paragraph", text: `${b.answered ? "" : "⏳ "}${b.text}` }];
    if (b.type === "quote") return [{ ...b, text: quoted(b.text) }];
    if (b.type === "insufficient_context") return [];
    return [b];
  });
}

// An action as plain text (also what Copy puts on the clipboard).
export function summaryText(items: SummaryBlock[]): string {
  return items
    .map(b => {
      if (b.type === "header") return `\n${b.emoji ? `${b.emoji} ` : ""}${b.text}\n`;
      if (b.type === "subheader") return `\n${b.text}`;
      if (b.type === "paragraph") return b.text;
      if (b.type === "bullet") return `• ${b.label ? `${b.label}: ` : ""}${b.text}`;
      if (b.type === "numbered") return `${b.n}. ${b.text}`;
      if (b.type === "todo") return `${b.done ? "☑" : "☐"} ${b.text}${todoMeta(b)}`;
      if (b.type === "quote") return `${quoted(b.text)}${b.speaker ? ` — ${b.speaker}` : ""}`;
      if (b.type === "callout") return `\n${[TONE_EMOJI[b.tone], b.title].filter(Boolean).join(" ")}${b.title ? "\n" : ""}${b.text}\n`;
      if (b.type === "fact") return `${b.label}: ${b.text}`;
      if (b.type === "qa") return `\n❓ ${b.question}\n${b.answered ? "" : "⏳ "}${b.text}`;
      return "";
    })
    .filter(Boolean)
    .join("\n")
    .trim();
}

// ─── What we know about the recording ────────────────────────────────────────

type Facts = { date: string; length?: string; languages?: string; speakers?: string; speakerCount: number; words?: number };

// The app's clock-style length ("41:05").
function clock(seconds: number): string {
  const m = Math.floor(seconds / 60);
  return `${String(m).padStart(2, "0")}:${String(Math.round(seconds % 60)).padStart(2, "0")}`;
}

function facts(src: ExportSource): Facts {
  const { rec, body, tags } = src;
  // Who spoke, in order of first words.
  const people = new Map<string, string>();
  body.segments.forEach((_, i) => {
    const tag = tags[i];
    if (tag?.key && !people.has(tag.key)) people.set(tag.key, tag.label);
  });
  const codes = [...new Set(body.segments.flatMap(s => [s.language, s.original?.language]).filter((c): c is string => !!c))];
  const languages = codes.map(c => {
    const l = LANGUAGES.find(l => l.code === c.split("-")[0]);
    return l ? languageName(l.code, l.name) : undefined;
  }).filter(Boolean);
  const transcript = body.segments.map(s => s.text).join(" ");
  // Word counts mean little in scripts without spaces.
  const spaced = !/[぀-ヿ㐀-鿿가-힯฀-๿]/.test(transcript);
  const words = spaced ? transcript.split(/\s+/).filter(Boolean).length : 0;
  return {
    date: formatDateTime(rec.createdAt),
    length: rec.durationSeconds > 0 ? clock(rec.durationSeconds) : undefined,
    languages: languages.length ? languages.join(", ") : undefined,
    speakers: people.size > 1 ? `${people.size} (${[...people.values()].join(", ")})` : undefined,
    speakerCount: people.size,
    words: words || undefined,
  };
}

const factChips = (f: Facts) =>
  [`📅 ${f.date}`, f.length && `⏱️ ${f.length}`, f.speakerCount > 1 && `👥 ${f.speakerCount}`].filter((c): c is string => !!c);

// ─── Plain-text forms ────────────────────────────────────────────────────────

// Captions as readable text: the speaker's name above their lines.
function captionsText(src: ExportSource): string {
  const lines: string[] = [];
  let lastSpeaker = "";
  for (const b of blocks(src)) {
    if (!b.speaker || b.speaker !== lastSpeaker) {
      lines.push("");
      if (b.speaker) lines.push(b.speaker);
    }
    lastSpeaker = b.speaker;
    lines.push(b.text);
  }
  return lines.join("\n").trim();
}

// Text: just the content, nothing added — what the user expects to paste.
export const exportBody = (src: ExportSource, what: ExportWhat) =>
  (what === "captions" ? captionsText(src) : summaryText(src.content(what)));

function emailIntro(rec: Recording, what: ExportWhat): string {
  if (what === "captions") return t("export.emailIntroCaptions", { title: rec.title });
  if (what === "summary") return t("export.emailIntroSummary", { title: rec.title });
  return t("export.emailIntroAction", { kind: kindName(what), title: rec.title });
}

export function emailSubject(rec: Recording, what: ExportWhat): string {
  if (what === "captions") return t("export.emailSubjectCaptions", { title: rec.title });
  if (what === "summary") return t("export.emailSubjectSummary", { title: rec.title });
  return t("export.emailSubjectAction", { kind: kindName(what), title: rec.title });
}

// Professional, for email: greeting, the facts, the content, regards.
export function emailText(src: ExportSource, what: ExportWhat, userName: string): string {
  const f = facts(src);
  const factLines = [
    t("export.factDate", { value: f.date }),
    f.length && t("export.factLength", { value: f.length }),
    f.speakers && t("export.factSpeakers", { value: f.speakers }),
  ].filter(Boolean).join("\n");
  const rule = "────────────────────";
  const regards = `${t("export.emailRegards")}${userName.trim() ? `\n${userName.trim()}` : ""}`;
  return `${t("export.emailHello")}\n\n${emailIntro(src.rec, what)}\n\n${factLines}\n\n${rule}\n\n${exportBody(src, what)}\n\n${rule}\n\n${regards}\n\n${t("export.emailFooter", { url: STORE_URL })}`;
}

// For an AI chat: what to do, everything known about the recording, then the
// content between clear markers.
export function chatPrompt(src: ExportSource, what: ExportWhat): string {
  const { rec } = src;
  const f = facts(src);
  const about = [
    t("export.factTitle", { value: `${rec.emoji} ${rec.title}` }),
    t("export.factDate", { value: f.date }),
    f.length && t("export.factLength", { value: f.length }),
    f.languages && t("export.factLanguages", { value: f.languages }),
    f.speakers && t("export.factSpeakers", { value: f.speakers }),
    f.words && t("export.factWords", { value: f.words.toLocaleString(locale()) }),
  ].filter(Boolean).map(l => `- ${l}`).join("\n");
  const content = what !== "captions"
    ? summaryText(src.content(what))
    // One line per turn, "Speaker: words" (the AI reads that best), and a
    // translation's original in brackets under it.
    : blocks(src).map(b => `${b.speaker ? `${b.speaker}: ` : ""}${b.text}${b.original ? `\n(${b.original})` : ""}`).join("\n\n");
  const heading = what === "captions" ? t("export.chatTranscript") : what === "summary" ? t("export.chatSummary") : `${kindName(what)}:`;
  const ask = what === "captions"
    ? t("export.chatPromptCaptions")
    : what === "summary"
      ? t("export.chatPromptSummary")
      : t("export.chatPromptAction");
  return `${ask}\n\n${t("export.chatAbout")}\n${about}\n\n${heading}\n"""\n${content}\n"""`;
}

// ─── Where an email or a prompt goes ──────────────────────────────────────────

// mailto: squashes nothing in desktop mail apps, but some cut long bodies
// short; the sheet copies the full text too.
export const mailtoUrl = (subject: string, body: string) =>
  `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
export const gmailUrl = (subject: string, body: string) =>
  `https://mail.google.com/mail/?view=cm&fs=1&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
export const outlookUrl = (subject: string, body: string) =>
  `https://outlook.live.com/mail/0/deeplink/compose?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

// A prompt in the address works up to a few thousand characters; past that
// the chat app opens empty and the copied prompt is pasted in.
const MAX_PROMPT_IN_URL = 6000;
export function chatUrl(app: "chatgpt" | "claude", prompt: string): { url: string; prefilled: boolean } {
  const prefilled = prompt.length <= MAX_PROMPT_IN_URL;
  const q = prefilled ? encodeURIComponent(prompt) : "";
  if (app === "chatgpt") return { url: prefilled ? `https://chatgpt.com/?q=${q}` : "https://chatgpt.com/", prefilled };
  return { url: prefilled ? `https://claude.ai/new?q=${q}` : "https://claude.ai/new", prefilled };
}

// ─── PDF ─────────────────────────────────────────────────────────────────────

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

function captionsHtml(src: ExportSource): string {
  let lastSpeaker = "";
  return blocks(src).map(b => {
    const label = b.speaker && b.speaker !== lastSpeaker
      ? `<div class="spk" style="color:${b.color ?? "#6F7280"};background:${b.color ?? "#6F7280"}14">${esc(b.speaker)}</div>`
      : "";
    lastSpeaker = b.speaker;
    const original = b.original ? `<p class="orig" dir="auto">${esc(b.original)}</p>` : "";
    return `${label}<div class="line"><p dir="auto">${esc(b.text)}</p>${original}</div>`;
  }).join("\n");
}

function summaryHtml(items: SummaryBlock[]): string {
  const out: string[] = [];
  let inFacts = false;
  let list: "ul" | "ol" | null = null;
  const closeList = () => { if (list) { out.push(`</${list}>`); list = null; } };
  for (const b of items) {
    const want = b.type === "bullet" ? "ul" : b.type === "numbered" ? "ol" : null;
    if (want !== list) { closeList(); if (want) { out.push(`<${want} dir="auto">`); list = want; } }
    if (b.type !== "fact" && inFacts) { out.push("</table>"); inFacts = false; }
    if (b.type === "header") out.push(`<h2 dir="auto">${b.emoji ? `${esc(b.emoji)} ` : ""}${esc(b.text)}</h2>`);
    else if (b.type === "subheader") out.push(`<h3 dir="auto">${esc(b.text)}</h3>`);
    else if (b.type === "paragraph") out.push(`<p dir="auto">${esc(b.text)}</p>`);
    else if (b.type === "bullet") out.push(`<li>${b.label ? `<b>${esc(b.label)}:</b> ` : ""}${esc(b.text)}</li>`);
    else if (b.type === "numbered") out.push(`<li>${esc(b.text)}</li>`);
    else if (b.type === "todo") out.push(`<p class="todo" dir="auto"><span class="box${b.done ? " done" : ""}">${b.done ? "✓" : ""}</span>${esc(b.text)}${todoMeta(b) ? `<span class="meta">${esc(todoMeta(b))}</span>` : ""}</p>`);
    else if (b.type === "callout") {
      const c = TONE_HEX[b.tone] ?? THEME;
      out.push(`<div class="callout" dir="auto" style="background:${c}12;border-color:${c}38;">${b.title ? `<div class="ct" style="color:${c};">${esc([TONE_EMOJI[b.tone], b.title].filter(Boolean).join(" "))}</div>` : ""}${esc(b.text)}</div>`);
    } else if (b.type === "fact") {
      if (!inFacts) { out.push('<table class="facts" dir="auto">'); inFacts = true; }
      out.push(`<tr><td class="fl">${esc(b.label)}</td><td class="fv">${esc(b.text)}</td></tr>`);
    } else if (b.type === "qa") out.push(`<div class="qa" dir="auto"><div class="q">${esc(b.question)}</div><div class="a${b.answered ? "" : " open"}">${b.answered ? "" : "⏳ "}${esc(b.text)}</div></div>`);
    else if (b.type === "quote") out.push(`<blockquote dir="auto">${esc(quoted(b.text))}${b.speaker ? `<span class="who">— ${esc(b.speaker)}</span>` : ""}</blockquote>`);
  }
  closeList();
  if (inFacts) out.push("</table>");
  return out.join("\n");
}

// File names follow the recording's title (the browser's Save as PDF uses it).
export function fileName(rec: Recording): string {
  return rec.title.replace(/[\\/:*?"<>|\n\r]+/g, " ").trim().slice(0, 80) || "Captio AI";
}

// The app's PDF: brand line, title, a row of facts, the content, and a small
// "get the app" card with a QR code at the end.
export function pdfHtml(src: ExportSource, what: ExportWhat, origin: string): string {
  const { rec } = src;
  const chips = factChips(facts(src)).map(c => `<span class="chip">${esc(c)}</span>`).join("");
  const link = storeLink("export_pdf");
  return `<!doctype html><html lang="${locale()}" dir="${isRtl() ? "rtl" : "ltr"}"><head><meta charset="utf-8"><title>${esc(fileName(rec))}</title><style>
    @page { margin: 54pt; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Helvetica Neue', Arial, sans-serif; color: #1C1C1E; margin: 0; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    .brand { display: flex; align-items: center; justify-content: space-between; margin-bottom: 26pt; }
    .brand .name { display: flex; align-items: center; gap: 7pt; font-size: 10.5pt; font-weight: 700; color: ${THEME}; }
    .brand img { width: 20pt; height: 20pt; border-radius: 5pt; }
    .brand .kind { font-size: 8.5pt; font-weight: 600; letter-spacing: 1pt; color: #A0A0A8; }
    h1 { font-size: 24pt; line-height: 1.2; margin: 0 0 10pt; }
    .chips { display: flex; flex-wrap: wrap; gap: 6pt; }
    .chip { font-size: 9.5pt; color: #4A4A55; background: #F2F2F7; border-radius: 6pt; padding: 3pt 8pt; }
    .rule { height: 3pt; width: 36pt; border-radius: 2pt; background: ${THEME}; margin: 18pt 0 16pt; }
    .spk { display: inline-block; font-size: 9pt; font-weight: 700; letter-spacing: 0.3pt; border-radius: 5pt; padding: 2pt 7pt; margin: 14pt 0 2pt; }
    .line, li, blockquote, .todo, .cta { page-break-inside: avoid; }
    p, li { font-size: 12pt; line-height: 1.6; margin: 5pt 0; }
    p.orig { color: #A0A0A8; font-style: italic; margin-top: -3pt; }
    h2 { font-size: 15pt; color: ${THEME}; margin: 20pt 0 6pt; }
    h3 { font-size: 12.5pt; margin: 14pt 0 4pt; }
    ul, ol { padding-left: 18pt; margin: 4pt 0; }
    .todo .box { display: inline-block; width: 11pt; height: 11pt; border: 1.5pt solid #C7C7CC; border-radius: 3pt; margin-right: 8pt; vertical-align: -2pt; text-align: center; font-size: 9pt; line-height: 11pt; color: #fff; }
    .todo .box.done { background: ${THEME}; border-color: ${THEME}; }
    blockquote { margin: 10pt 0; padding: 4pt 0 4pt 12pt; border-left: 3pt solid ${THEME}33; font-style: italic; font-size: 12pt; line-height: 1.6; }
    blockquote .who { display: block; font-style: normal; font-size: 10pt; color: #8E8E93; margin-top: 2pt; }
    .todo .meta { color: #8E8E93; font-size: 10.5pt; margin-left: 4pt; }
    .callout { margin: 10pt 0; padding: 9pt 12pt; border: 1px solid; border-radius: 10pt; font-size: 12pt; line-height: 1.55; page-break-inside: avoid; }
    .callout .ct { font-weight: 700; font-size: 11.5pt; margin-bottom: 3pt; }
    table.facts { width: 100%; border-collapse: collapse; margin: 10pt 0; background: #F7F7F9; border-radius: 10pt; page-break-inside: avoid; }
    table.facts td { padding: 6pt 12pt; font-size: 11.5pt; border-top: 1px solid #EBEBEF; vertical-align: top; }
    table.facts tr:first-child td { border-top: none; }
    table.facts .fl { color: #8E8E93; width: 34%; }
    table.facts .fv { font-weight: 600; }
    .qa { margin: 8pt 0; padding: 9pt 12pt; border: 1px solid #E5E5EA; border-radius: 10pt; page-break-inside: avoid; }
    .qa .q { font-weight: 700; font-size: 12pt; }
    .qa .a { font-size: 12pt; line-height: 1.55; margin-top: 3pt; }
    .qa .a.open { color: #8E8E93; font-style: italic; }
    .cta { margin-top: 32pt; display: flex; align-items: center; gap: 12pt; padding: 10pt 12pt; border: 1px solid #EBEBEB; border-radius: 10pt; }
    .cta .qr { width: 54pt; height: 54pt; flex: none; }
    .cta .title { font-size: 10.5pt; font-weight: 700; }
    .cta a { font-size: 9pt; color: ${THEME}; text-decoration: none; font-weight: 600; }
  </style></head><body>
    <div class="brand">
      <span class="name"><img src="${origin}/icon.png" alt="">Captio AI</span>
      <span class="kind">${esc(kindName(what).toLocaleUpperCase(locale()))}</span>
    </div>
    <h1 dir="auto">${esc(`${rec.emoji} ${rec.title}`)}</h1>
    <div class="chips">${chips}</div>
    <div class="rule"></div>
    ${what === "captions" ? captionsHtml(src) : summaryHtml(src.content(what))}
    <div class="cta">
      <img class="qr" src="${origin}/qr-appstore.png" alt="">
      <div>
        <div class="title">${esc(t("export.pdfScan"))}</div>
        <a href="${link}">${esc(t("export.madeWith"))}</a>
      </div>
    </div>
  </body></html>`;
}

// Prints the PDF's page from a hidden frame: the browser's print dialog opens
// straight away with Save as PDF, named after the recording. Resolves once the
// dialog has closed (the browser can't say whether it was saved).
export function printPdf(html: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const frame = document.createElement("iframe");
    frame.setAttribute("aria-hidden", "true");
    frame.style.cssText = "position:fixed;right:0;bottom:0;width:0;height:0;border:0;visibility:hidden;";
    let done = false;
    const cleanup = () => {
      if (done) return;
      done = true;
      setTimeout(() => frame.remove(), 500);
      resolve();
    };
    frame.onload = async () => {
      try {
        const win = frame.contentWindow!;
        const doc = frame.contentDocument!;
        // The logo and the QR code must be in before the page is printed.
        await Promise.all([...doc.images].map(img => (img.complete ? null : new Promise(r => { img.onload = img.onerror = r; }))));
        win.addEventListener("afterprint", cleanup, { once: true });
        win.focus();
        win.print();
        // Browsers whose print() blocks until the dialog closes never fire
        // afterprint late; this settles them.
        setTimeout(cleanup, 1000);
      } catch (e) {
        frame.remove();
        reject(e);
      }
    };
    frame.srcdoc = html;
    document.body.appendChild(frame);
  });
}

// ─── Share link ──────────────────────────────────────────────────────────────

// Saves (or refreshes) this recording's shared copy and returns its link, the
// row the app writes (app repo: supabase/shared_exports.sql): one per
// recording and half, the page's words in the sharer's language.
export async function shareLink(src: ExportSource, what: ExportWhat): Promise<string> {
  const { rec } = src;
  const f = facts(src);
  // The page's own Export button offers readers the same Text, Email and Chat,
  // ready-made (the email unsigned: a reader sends it, not the sharer).
  const exports = {
    text: exportBody(src, what),
    emailSubject: emailSubject(rec, what),
    emailBody: emailText(src, what, ""),
    chat: chatPrompt(src, what),
  };
  const content = what !== "captions"
    ? { blocks: plainBlocks(src.content(what)), exports }
    : { blocks: blocks(src), exports };
  const labels = {
    kind: kindName(what).toLocaleUpperCase(locale()),
    chips: factChips(f),
    getApp: t("export.getApp"),
    madeWith: t("export.madeWith"),
    scan: t("export.pdfScan"),
    exportButton: t("export.button"),
    text: t("export.text"),
    pdf: t("export.pdf"),
    email: t("export.email"),
    chat: t("export.chat"),
    copied: t("export.copied"),
    dir: isRtl() ? "rtl" : "ltr",
  };
  const sb = getSupabase();
  const { data: session } = await sb.auth.getSession();
  if (isPreview() || !session.session) throw new Error("not signed in");
  const { data, error } = await sb
    .from("shared_exports")
    .upsert(
      // The table and the page know captions and summary only: every action
      // shares the summary's link, labelled with its own name.
      { recording_id: rec.id, what: what === "captions" ? "captions" : "summary", lang: locale(), title: rec.title, emoji: rec.emoji, content, labels, updated_at: new Date().toISOString() },
      { onConflict: "user_id,recording_id,what" },
    )
    .select("id")
    .single();
  if (error || !data) throw error ?? new Error("share link: no id");
  return SHARE_BASE + (data as { id: string }).id;
}
