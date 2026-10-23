// The connector's tools: what Claude / ChatGPT can do with a Captio AI account.
// Read-only. Answers are plain text, compact, with who said what and when, so a
// month of all-day recordings can be searched without reading it whole.

import { z } from "zod";
import { rpc, type ChunkHit, type FolderRow, type Line, type Me, type RecordingDetail, type RecordingRow, type SearchRow } from "./data";
import { embedQuery } from "./embed";
import {
  clockToOffset, formatClock, formatDay, formatLength, formatSpan, parseUntil, parseWhen, startedAt, validZone,
} from "./time";

// meta: what the tool call's analytics event carries (counts, never content).
export type ToolContext = { token: string; meta?: Record<string, unknown> };

export type Tool = {
  name: string;
  title: string;
  description: string;
  inputSchema: z.ZodObject;
  run: (args: Record<string, unknown>, ctx: ToolContext) => Promise<string>;
};

// Shown to the chat app when it connects.
export const INSTRUCTIONS = `Captio AI records conversations (meetings, lectures, a whole office day, often hours long and in several languages) and transcribes them, with who said what and when. People share recordings with their team in shared folders.
- To find where something was talked about, even without knowing which recording, who said it or the exact words: search_transcripts with the question in plain words (it searches by meaning across languages, so an English question finds a Slovenian discussion) plus the distinctive words people would have said (names, product terms, in the language spoken) as keywords, and from/to when the user mentions a day. It returns the best passages (about a minute each) with who said what and when.
- Then read around the best passage with get_transcript (recording_id, from_line a few lines before the passage, max_lines 40-80) and answer from what was actually said. Run several searches with different wording when the first doesn't settle it.
- For an exact name, number or quote, every time it was said: find_words.
- To see what happened on a day or in a folder: list_recordings with from/to; a recording's summary comes first in get_transcript.
- Speaker names come from the phone recognising voices or from names typed in the app. "Speaker 2" means nobody was named. Names can occasionally be wrong.
- Times are in the user's time zone and approximate to the minute.
- Always say which recording (title and date) and who said it, when you know.`;

const TRANSCRIPT_CHAR_BUDGET = 60_000;
const CONTEXT_CHARS = 220;

async function me(ctx: ToolContext): Promise<{ me: Me; tz: string }> {
  const m = await rpc<Me>(ctx.token, "connector_me");
  return { me: m, tz: validZone(m?.time_zone) };
}

const str = (v: unknown) => (typeof v === "string" && v.trim() ? v.trim() : null);
const int = (v: unknown, fallback: number, min: number, max: number) => {
  const n = typeof v === "number" ? v : typeof v === "string" ? Number(v) : NaN;
  return Number.isFinite(n) ? Math.min(max, Math.max(min, Math.floor(n))) : fallback;
};
const plural = (n: number, one: string, many: string) => `${n} ${n === 1 ? one : many}`;
const clip = (s: string, n: number) => (s.length > n ? `${s.slice(0, n - 1)}…` : s);
const who = (speaker: string | null | undefined) => (speaker ? `${speaker}: ` : "");

function lineTime(createdAt: number, duration: number, startMs: number | null, tz: string): string {
  if (startMs == null) return "";
  return `[${formatClock(startedAt(createdAt, duration) + startMs, tz, true)}] `;
}

// The app stores a summary as JSON blocks (src/lib/shared.ts SummaryBlock in the
// app repo); older ones are plain text.
type Block = Record<string, unknown> & { type?: string };
export function summaryText(raw: string): string {
  const s = raw?.trim();
  if (!s) return "";
  let blocks: Block[];
  try {
    const parsed = JSON.parse(s);
    blocks = Array.isArray(parsed) ? parsed : Array.isArray(parsed?.blocks) ? parsed.blocks : [];
    if (blocks.length === 0) return typeof parsed === "string" ? parsed : "";
  } catch {
    return s;
  }
  const out: string[] = [];
  for (const b of blocks) {
    const text = typeof b.text === "string" ? b.text : "";
    switch (b.type) {
      case "header": out.push(`### ${text}`); break;
      case "subheader": out.push(`**${text}**`); break;
      case "bullet": out.push(`- ${b.label ? `${b.label}: ` : ""}${text}`); break;
      case "numbered": out.push(`${b.n ?? "-"}. ${text}`); break;
      case "todo": {
        const extra = [b.owner, b.due].filter(Boolean).join(", ");
        out.push(`- [${b.done ? "x" : " "}] ${text}${extra ? ` (${extra})` : ""}`);
        break;
      }
      case "quote": out.push(`> ${text}${b.speaker ? ` — ${b.speaker}` : ""}`); break;
      case "callout": out.push(`${b.title ? `${b.title}: ` : ""}${text}`); break;
      case "fact": out.push(`${b.label}: ${text}`); break;
      case "qa": out.push(`Q: ${b.question}\nA: ${text}`); break;
      case "insufficient_context": break;
      default: if (text) out.push(text);
    }
  }
  return out.join("\n");
}

function recordingHeading(r: { title: string; emoji?: string; id: string }): string {
  return `${r.emoji ? `${r.emoji} ` : ""}${r.title || "Untitled recording"} (id: ${r.id})`;
}

// ── list_folders ──────────────────────────────────────────────────────────────

const listFolders: Tool = {
  name: "list_folders",
  title: "List folders",
  description:
    "List the user's Captio AI folders: their own and the shared folders they are a member of (teams share recordings this way), with who is in each and how many recordings it holds. Use a folder's id to narrow list_recordings or search_transcripts.",
  inputSchema: z.object({}),
  async run(_args, ctx) {
    const [{ me: m, tz }, folders] = await Promise.all([me(ctx), rpc<FolderRow[]>(ctx.token, "connector_folders")]);
    const head = `Signed in as ${m.name ?? "a Captio AI user"}. ${plural(m.recordings, "recording", "recordings")} of their own. Time zone: ${tz}.`;
    if (!folders.length) return `${head}\nNo folders yet. Recordings not in a folder can still be listed and searched.`;
    const lines = folders.map((f) => {
      const shared = f.members.length > 1 ? `shared with ${f.members.length} people: ${f.members.join(", ")}` : "not shared";
      const last = f.last_recording_at ? `, latest ${formatDay(f.last_recording_at, tz)}` : "";
      return `- ${f.name} (id: ${f.id}), owner ${f.owner}, ${shared}; ${plural(f.recordings, "recording", "recordings")}${last}`;
    });
    return `${head}\n\nFolders:\n${lines.join("\n")}`;
  },
};

// ── list_recordings ───────────────────────────────────────────────────────────

const listRecordings: Tool = {
  name: "list_recordings",
  title: "List recordings",
  description:
    "List recordings the user can see (their own and those in shared folders), newest first, with date, time, length, folder, who recorded it and who speaks in it. Filter by folder and by date range to see what happened on a day or in a week.",
  inputSchema: z.object({
    folder_id: z.string().optional().describe("Only this folder (id from list_folders). \"none\" = recordings not in any folder."),
    from: z.string().optional().describe("Start date or time, e.g. \"2026-10-20\" or \"2026-10-20 14:00\" (user's time zone)."),
    to: z.string().optional().describe("End date or time; a plain date includes that whole day."),
    limit: z.number().int().min(1).max(200).optional().describe("How many (default 30)."),
    offset: z.number().int().min(0).optional().describe("Skip this many (for the next page)."),
  }),
  async run(args, ctx) {
    const { tz } = await me(ctx);
    const limit = int(args.limit, 30, 1, 200);
    const offset = int(args.offset, 0, 0, 100_000);
    const rows = await rpc<RecordingRow[]>(ctx.token, "connector_recordings", {
      p_folder: str(args.folder_id),
      p_from: parseWhen(args.from, tz),
      p_to: parseUntil(args.to, tz),
      p_limit: limit,
      p_offset: offset,
    });
    if (!rows.length) return offset ? "No more recordings." : "No recordings match.";
    const out = rows.map((r) => {
      const bits = [
        formatSpan(r.created_at, r.duration_seconds, tz),
        formatLength(r.duration_seconds),
        r.folder_name ? `folder ${r.folder_name}` : null,
        `recorded by ${r.recorded_by}`,
        r.speakers.length ? `speakers: ${r.speakers.slice(0, 12).join(", ")}` : null,
        plural(r.lines, "line", "lines"),
        r.has_summary ? "has a summary" : null,
      ].filter(Boolean);
      return `- ${recordingHeading(r)}\n  ${bits.join("; ")}`;
    });
    const more = rows.length === limit ? `\n\nMore may exist: call again with offset=${offset + limit}.` : "";
    return `Recordings (times in ${tz}):\n${out.join("\n")}${more}`;
  },
};

// ── search_transcripts (by meaning and words) ─────────────────────────────────

function lineOut(createdAt: number, duration: number, l: Line, tz: string): string {
  return `${lineTime(createdAt, duration, l.start_ms, tz)}${who(l.speaker)}${l.text.trim()}${l.translation ? `\n  (translation) ${l.translation.trim()}` : ""}  [line ${l.idx}]`;
}

const searchTranscripts: Tool = {
  name: "search_transcripts",
  title: "Search recordings",
  description:
    "Find where something was talked about in any recording the user can see (their own and those in shared folders), even in a recording hours long, without knowing which recording, who said it or the exact words. Searches by meaning across languages (an English question finds a Slovenian discussion) and by keywords at once. Returns the best passages, about a minute each, with who said what, when and in which recording, plus their line numbers for get_transcript. Narrow with from/to (dates), speaker, folder_id or recording_id.",
  inputSchema: z.object({
    query: z.string().describe("What you're looking for, in plain words, e.g. \"the discussion about recording without internet\"."),
    keywords: z.string().optional().describe("Distinctive words people would have said (names, product terms, numbers), in the language spoken, space-separated. Not common words."),
    speaker: z.string().optional().describe("Only passages where this person speaks (part of the name is enough)."),
    folder_id: z.string().optional().describe("Only this folder (id from list_folders). \"none\" = not in a folder."),
    recording_id: z.string().optional().describe("Only inside this recording (e.g. to find a part of a long one)."),
    from: z.string().optional().describe("Start date or time, e.g. \"2026-10-22\" (user's time zone)."),
    to: z.string().optional().describe("End date or time; a plain date includes that whole day."),
    limit: z.number().int().min(1).max(20).optional().describe("How many passages (default 8)."),
  }),
  async run(args, ctx) {
    const query = str(args.query);
    if (!query) return "Say what to look for.";
    const [{ tz }, embedding] = await Promise.all([me(ctx), embedQuery(query)]);
    // Without a meaning vector the question's own words have to do.
    const keywords = str(args.keywords) ?? (embedding ? null : query);
    if (ctx.meta) Object.assign(ctx.meta, { meaning: !!embedding, keywords: !!str(args.keywords), dated: !!(args.from || args.to), in_recording: !!args.recording_id });
    const hits = await rpc<ChunkHit[]>(ctx.token, "connector_search_chunks", {
      p_keywords: keywords,
      p_embedding: embedding,
      p_folder: str(args.folder_id),
      p_speaker: str(args.speaker),
      p_recording: str(args.recording_id),
      p_from: parseWhen(args.from, tz),
      p_to: parseUntil(args.to, tz),
      p_limit: int(args.limit, 8, 1, 20),
    });
    if (ctx.meta) Object.assign(ctx.meta, { results: hits.length, by_meaning: hits.filter(h => h.found_by.includes("meaning")).length });
    if (!hits.length) return `Nothing found for "${query}". Try other wording, other keywords, a wider date range, or find_words for an exact word.`;
    const out: string[] = [`${plural(hits.length, "passage", "passages")}, best first (times in ${tz}${embedding ? "" : "; searched by words only"}):`];
    hits.forEach((h, i) => {
      const where = `${recordingHeading({ title: h.title, emoji: h.emoji, id: h.recording_id })}, ${formatSpan(h.created_at, h.duration_seconds, tz)}${h.folder_name ? `, folder ${h.folder_name}` : ""}, recorded by ${h.recorded_by}`;
      out.push(`\n### ${i + 1}. ${where}\nLines ${h.from_idx}-${h.to_idx}${h.speakers.length ? `, speaking: ${h.speakers.join(", ")}` : ""} (found by ${h.found_by})`);
      for (const l of h.lines) {
        const inside = l.idx >= h.from_idx && l.idx <= h.to_idx;
        out.push(inside ? lineOut(h.created_at, h.duration_seconds, l, tz) : `  (${l.idx < h.from_idx ? "before" : "after"}) ${who(l.speaker)}${clip(l.text.trim(), CONTEXT_CHARS)}`);
      }
    });
    out.push("\nRead more around a passage with get_transcript (recording_id, from_line, max_lines).");
    return out.join("\n");
  },
};

// ── find_words (exact words, every time they were said) ───────────────────────

const findWords: Tool = {
  name: "find_words",
  title: "Find exact words",
  description:
    "Find every line where certain words were said (a name, a number, a product term, a quote), in every transcript the user can see, with who said it, when and where. Each word matches the start of words (\"price\" finds \"prices\"); by default a line must contain all words, match_any for any. Use the language that was spoken. For questions about a topic, use search_transcripts instead.",
  inputSchema: z.object({
    words: z.string().describe("The words, in the language that was spoken."),
    match_any: z.boolean().optional().describe("Lines with any of the words instead of all of them."),
    speaker: z.string().optional().describe("Only lines said by this person (part of the name is enough)."),
    folder_id: z.string().optional().describe("Only this folder (id from list_folders). \"none\" = not in a folder."),
    from: z.string().optional().describe("Start date or time, e.g. \"2026-10-20\" (user's time zone)."),
    to: z.string().optional().describe("End date or time; a plain date includes that whole day."),
    limit: z.number().int().min(1).max(100).optional().describe("How many lines (default 30)."),
  }),
  async run(args, ctx) {
    const query = str(args.words);
    if (!query) return "Give the words to find.";
    const { tz } = await me(ctx);
    const rows = await rpc<SearchRow[]>(ctx.token, "connector_search", {
      p_query: query,
      p_any: args.match_any === true,
      p_folder: str(args.folder_id),
      p_speaker: str(args.speaker),
      p_from: parseWhen(args.from, tz),
      p_to: parseUntil(args.to, tz),
      p_limit: int(args.limit, 30, 1, 100),
    });
    if (ctx.meta) ctx.meta.results = rows.length;
    if (!rows.length) return `"${query}" wasn't said anywhere you can see. Try other word forms, match_any, or search_transcripts.`;
    // Grouped by recording, in the order of their best match.
    const groups = new Map<string, SearchRow[]>();
    for (const r of rows) groups.set(r.recording_id, [...(groups.get(r.recording_id) ?? []), r]);
    const out: string[] = [`${plural(rows.length, "matching line", "matching lines")} in ${plural(groups.size, "recording", "recordings")} (best first, times in ${tz}):`];
    for (const hits of groups.values()) {
      const r = hits[0];
      out.push(
        `\n## ${recordingHeading({ title: r.title, id: r.recording_id })}\n${formatSpan(r.created_at, r.duration_seconds, tz)}${r.folder_name ? `, folder ${r.folder_name}` : ""}, recorded by ${r.recorded_by}`,
      );
      for (const h of hits.sort((a, b) => a.idx - b.idx)) {
        if (h.before_text) out.push(`  (before) ${who(h.before_speaker)}${clip(h.before_text.trim(), CONTEXT_CHARS)}`);
        out.push(lineOut(h.created_at, h.duration_seconds, { idx: h.idx, speaker: h.speaker, start_ms: h.start_ms, text: h.text, translation: h.translation }, tz));
        if (h.after_text) out.push(`  (after) ${who(h.after_speaker)}${clip(h.after_text.trim(), CONTEXT_CHARS)}`);
      }
    }
    out.push("\nRead more around a line with get_transcript (recording_id, from_line, max_lines).");
    return out.join("\n");
  },
};

// ── get_transcript ────────────────────────────────────────────────────────────

const getTranscript: Tool = {
  name: "get_transcript",
  title: "Read a recording",
  description:
    "Read one recording: when it was, its folder, who recorded it, its summary, and its transcript line by line with who said what and when. Long recordings come in pages: start at from_line (a line number from search_transcripts or find_words) or at a clock time (from_time \"14:30\"), and read just a stretch with max_lines.",
  inputSchema: z.object({
    recording_id: z.string().describe("The recording's id (from list_recordings or search_transcripts)."),
    from_line: z.number().int().min(0).optional().describe("Start at this line number."),
    from_time: z.string().optional().describe("Start at this clock time on the recording's day, e.g. \"14:30\"."),
    context_before: z.number().int().min(0).max(200).optional().describe("Also include this many lines before from_line."),
    max_lines: z.number().int().min(1).max(600).optional().describe("Read at most this many lines (default: as many as fit, up to 600)."),
  }),
  async run(args, ctx) {
    const id = str(args.recording_id);
    if (!id) return "Give a recording_id.";
    const { tz } = await me(ctx);
    let fromLine = Math.max(0, int(args.from_line, 0, 0, 1_000_000) - int(args.context_before, 0, 0, 200));
    let fromMs: number | null = null;
    const fromTime = str(args.from_time);
    if (fromTime) {
      // Needs the recording's start: read the header first.
      const head = await rpc<RecordingDetail>(ctx.token, "connector_recording", { p_id: id, p_from_idx: 0, p_limit: 1 });
      if (!head.ok) return "No recording with that id that you can see.";
      fromMs = clockToOffset(fromTime, head.created_at, head.duration_seconds, tz);
      if (fromMs == null) return "from_time must look like \"14:30\".";
      fromLine = 0;
    }
    const rec = await rpc<RecordingDetail>(ctx.token, "connector_recording", {
      p_id: id, p_from_idx: fromLine, p_from_ms: fromMs, p_limit: int(args.max_lines, 600, 1, 600),
    });
    if (!rec.ok) return "No recording with that id that you can see.";

    const out: string[] = [
      `# ${recordingHeading(rec)}`,
      `When: ${formatSpan(rec.created_at, rec.duration_seconds, tz)} (${tz}), ${formatLength(rec.duration_seconds)}`,
      `Folder: ${rec.folder_name ?? "none"}. Recorded by ${rec.recorded_by}.`,
    ];
    const first = rec.lines[0]?.idx ?? 0;
    const summary = summaryText(rec.summary);
    if (summary && first === 0) out.push(`\n## Summary\n${summary}`);

    let used = out.join("\n").length;
    const shown: Line[] = [];
    for (const l of rec.lines) {
      const text = `${lineTime(rec.created_at, rec.duration_seconds, l.start_ms, tz)}${who(l.speaker)}${l.text.trim()}${l.translation ? `\n  (translation) ${l.translation.trim()}` : ""}`;
      if (used + text.length > TRANSCRIPT_CHAR_BUDGET && shown.length > 0) break;
      used += text.length + 1;
      shown.push(l);
      out.push(shown.length === 1 ? `\n## Transcript\n${text}` : text);
    }
    if (!shown.length) out.push(rec.total_lines ? "\nNo lines from there on." : "\nThis recording has no transcript.");
    const last = shown[shown.length - 1]?.idx;
    if (last != null && last < rec.last_idx) {
      out.push(`\n(${rec.total_lines} lines in all. Continue with from_line=${last + 1}.)`);
    }
    return out.join("\n");
  },
};

export const TOOLS: Tool[] = [searchTranscripts, findWords, getTranscript, listRecordings, listFolders];
