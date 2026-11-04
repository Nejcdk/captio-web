import type { SupabaseClient } from "@supabase/supabase-js";
import { recordErrorOnce } from "./client";

// What the desktop web app reads: the recordings, folders and people that the
// phone already synced to Supabase (app repo: src/lib/sync.ts, supabase/
// recordings.sql, folders.sql, folder_sharing.sql). Row-level security decides
// what this account can see: its own recordings, and the recordings in shared
// folders it's in. Read-only for now.

export type Recording = {
  id: string;
  userId: string;
  title: string;
  emoji: string;
  durationSeconds: number;
  createdAt: number;
  folderId: string | null;
  // Only in this browser (local.ts): the Welcome demo, a file still being
  // transcribed, anything saved in the dev preview.
  local?: boolean;
  // A file upload on its way: "Transcribing…" in the list; failed = Try again.
  status?: "transcribing" | "failed";
  failure?: string;
};

export type Folder = {
  id: string;
  ownerId: string;
  name: string;
  icon: string;
  color: string;
  position: number;
};

export type FolderPerson = { folderId: string; userId: string; name: string };

export type Library = { recordings: Recording[]; folders: Folder[]; people: FolderPerson[] };

export type TranscriptWord = { t: string; s: number; e: number; c?: number };

export type TranscriptSegment = {
  speaker: string;
  text: string;
  language?: string;
  words?: TranscriptWord[];
  // Translation recordings: what was actually said, `text` being its translation.
  original?: { text: string; language?: string; words?: TranscriptWord[] };
};

export type CalloutTone = "blue" | "green" | "orange" | "red" | "purple";
export type SummaryBlock =
  | { type: "header"; text: string; emoji?: string }
  | { type: "subheader"; text: string }
  | { type: "paragraph"; text: string }
  | { type: "bullet"; text: string; label?: string }
  | { type: "numbered"; text: string; n: number }
  | { type: "todo"; text: string; done: boolean; owner?: string; due?: string }
  | { type: "quote"; text: string; speaker?: string }
  | { type: "callout"; text: string; tone: CalloutTone; title?: string }
  | { type: "fact"; label: string; text: string }
  | { type: "qa"; question: string; text: string; answered: boolean }
  | { type: "insufficient_context" };

// A name the recording phone recognised by voice: its emoji, colour, and
// whether it's the recorder's own voice (app: voiceNaming.ts syncedVoices).
export type SyncedPerson = { e?: string; c?: string; me?: boolean };

export type RecordingBody = {
  segments: TranscriptSegment[];
  speakerNames: Record<string, string>;
  // One name per segment, or null when none were sent (or they were sent for
  // other segments than these).
  labels: (string | null)[] | null;
  people: Record<string, SyncedPerson>;
  summary: SummaryBlock[];
};

const PAGE = 1000;

function parseJson<T>(text: string | null | undefined, fallback: T): T {
  if (!text) return fallback;
  try {
    return (JSON.parse(text) as T) ?? fallback;
  } catch {
    return fallback;
  }
}

export async function loadLibrary(sb: SupabaseClient): Promise<Library> {
  const rows: Record<string, unknown>[] = [];
  for (let from = 0; ; from += PAGE) {
    const { data, error } = await sb
      .from("recordings")
      .select("id, user_id, title, emoji, duration_seconds, created_at, folder_id")
      .is("deleted_at", null)
      .order("created_at", { ascending: false })
      .range(from, from + PAGE - 1);
    if (error) throw error;
    rows.push(...data);
    if (data.length < PAGE) break;
  }
  const [folders, people] = await Promise.all([
    sb.from("folders").select("id, owner_id, name, icon, color, position").is("deleted_at", null).order("position"),
    sb.rpc("my_folder_people"),
  ]);
  if (folders.error) throw folders.error;
  // "by Ana" needs these; the list works without them.
  if (people.error) recordErrorOnce("folder_people", people.error);
  return {
    recordings: rows.map(r => ({
      id: String(r.id),
      userId: String(r.user_id),
      title: String(r.title ?? ""),
      emoji: String(r.emoji ?? "") || "📝",
      durationSeconds: Number(r.duration_seconds ?? 0),
      createdAt: Number(r.created_at ?? 0),
      folderId: (r.folder_id as string | null) ?? null,
    })),
    folders: (folders.data ?? []).map(f => ({
      id: f.id, ownerId: f.owner_id, name: f.name, icon: f.icon ?? "", color: f.color || "#4DA8F7", position: f.position ?? 0,
    })),
    // Names of the people in shared folders ("by Ana"); not worth failing over.
    people: ((people.data ?? []) as { folder_id: string; user_id: string; name: string }[])
      .map(p => ({ folderId: p.folder_id, userId: p.user_id, name: p.name })),
  };
}

export async function loadRecordingBody(sb: SupabaseClient, id: string): Promise<RecordingBody> {
  const full = "transcript, segments, speaker_names, summary, speaker_labels, speaker_people";
  let res = await sb.from("recordings").select(full).eq("id", id).maybeSingle();
  // speaker_labels / speaker_people come with the chat connector's SQL.
  if (res.error && /speaker_labels|speaker_people/.test(res.error.message)) {
    res = await sb.from("recordings").select("transcript, segments, speaker_names, summary").eq("id", id).maybeSingle();
  }
  if (res.error) throw res.error;
  return bodyFromRow((res.data ?? {}) as Record<string, string | null>);
}

export function bodyFromRow(row: Record<string, string | null>): RecordingBody {
  let segments = parseJson<TranscriptSegment[]>(row.segments, []);
  if (!Array.isArray(segments)) segments = [];
  if (!segments.length && row.transcript?.trim()) segments = [{ speaker: "", text: row.transcript.trim() }];
  const labels = parseJson<unknown>(row.speaker_labels, null);
  const summary = parseJson<SummaryBlock[]>(row.summary, []);
  return {
    segments,
    speakerNames: parseJson<Record<string, string>>(row.speaker_names, {}),
    labels: Array.isArray(labels) && labels.length === segments.length
      ? labels.map(n => (typeof n === "string" && n.trim() ? n : null))
      : null,
    people: parseJson<Record<string, SyncedPerson>>(row.speaker_people, {}),
    summary: Array.isArray(summary) ? summary : [],
  };
}

// ─── Writing (the phone picks these up on its next sync) ──────────────────────

export type NewRecording = {
  id: string;
  title: string;
  emoji: string;
  durationSeconds: number;
  createdAt: number;
  folderId: string | null;
  segments: TranscriptSegment[];
  speakerNames?: Record<string, string>;
  summary?: SummaryBlock[];
};

// The row the app's sync expects (app repo: sync.ts toRemote): JSON strings,
// the plain text, the creation time in ms.
export async function insertRecording(sb: SupabaseClient, userId: string, r: NewRecording): Promise<void> {
  const { error } = await sb.from("recordings").insert({
    id: r.id,
    user_id: userId,
    transcript: r.segments.map(s => s.text).join(" ").trim(),
    segments: JSON.stringify(r.segments),
    speaker_names: r.speakerNames ? JSON.stringify(r.speakerNames) : "",
    summary: r.summary?.length ? JSON.stringify(r.summary) : "",
    title: r.title,
    emoji: r.emoji,
    duration_seconds: Math.round(r.durationSeconds),
    created_at: r.createdAt,
    folder_id: r.folderId,
  });
  if (error) throw error;
}

export async function updateRecording(
  sb: SupabaseClient, id: string,
  patch: { title?: string; emoji?: string; summary?: SummaryBlock[]; folderId?: string | null; segments?: TranscriptSegment[] },
): Promise<void> {
  const row: Record<string, unknown> = {};
  if (patch.title !== undefined) row.title = patch.title;
  if (patch.emoji !== undefined) row.emoji = patch.emoji;
  if (patch.summary !== undefined) row.summary = patch.summary.length ? JSON.stringify(patch.summary) : "";
  if (patch.folderId !== undefined) row.folder_id = patch.folderId;
  if (patch.segments !== undefined) {
    row.segments = JSON.stringify(patch.segments);
    row.transcript = patch.segments.map(s => s.text).join(" ").trim();
  }
  const { error } = await sb.from("recordings").update(row).eq("id", id);
  if (error) throw error;
}
