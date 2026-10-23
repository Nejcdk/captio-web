// Reads for the Claude / ChatGPT connector (/mcp). Every call goes to Supabase
// with the person's own access token, so the functions in the app repo's
// supabase/chat_connector.sql see them as auth.uid() and return only what they
// may read: their recordings and the recordings in folders they're in.

export class ConnectorError extends Error {
  constructor(message: string, readonly status: number) {
    super(message);
  }
}

function env() {
  const { SUPABASE_URL, SUPABASE_ANON_KEY } = process.env;
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) throw new ConnectorError("Supabase is not configured", 500);
  return { url: SUPABASE_URL, anonKey: SUPABASE_ANON_KEY };
}

export async function rpc<T>(token: string, fn: string, args: Record<string, unknown> = {}): Promise<T> {
  const { url, anonKey } = env();
  const res = await fetch(`${url}/rest/v1/rpc/${fn}`, {
    method: "POST",
    headers: {
      apikey: anonKey,
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(args),
    cache: "no-store",
  });
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new ConnectorError(`${fn}: ${res.status} ${body.slice(0, 200)}`, res.status);
  }
  return res.json() as Promise<T>;
}

// The signed-in person behind a token, or null when the token isn't valid
// (expired, revoked, not ours).
export async function userForToken(token: string): Promise<{ id: string } | null> {
  const { url, anonKey } = env();
  try {
    const res = await fetch(`${url}/auth/v1/user`, {
      headers: { apikey: anonKey, Authorization: `Bearer ${token}` },
      cache: "no-store",
    });
    if (!res.ok) return null;
    const user = (await res.json()) as { id?: string };
    return user.id ? { id: user.id } : null;
  } catch {
    return null;
  }
}

export type Me = { name: string | null; time_zone: string | null; recordings: number };

export type FolderRow = {
  id: string;
  name: string;
  owner: string;
  is_mine: boolean;
  members: string[];
  recordings: number;
  last_recording_at: number | null;
};

export type RecordingRow = {
  id: string;
  title: string;
  emoji: string;
  created_at: number;
  duration_seconds: number;
  folder_id: string | null;
  folder_name: string | null;
  recorded_by: string;
  has_summary: boolean;
  lines: number;
  speakers: string[];
};

export type SearchRow = {
  recording_id: string;
  title: string;
  created_at: number;
  duration_seconds: number;
  folder_name: string | null;
  recorded_by: string;
  idx: number;
  speaker: string;
  start_ms: number | null;
  text: string;
  translation: string | null;
  before_speaker: string | null;
  before_text: string | null;
  after_speaker: string | null;
  after_text: string | null;
  rank: number;
};

export type Line = { idx: number; speaker: string; start_ms: number | null; text: string; translation: string | null };

// A passage (about a minute) found by connector_search_chunks, with its lines
// plus one before and one after.
export type ChunkHit = {
  recording_id: string;
  title: string;
  emoji: string;
  created_at: number;
  duration_seconds: number;
  folder_name: string | null;
  recorded_by: string;
  chunk_idx: number;
  from_idx: number;
  to_idx: number;
  speakers: string[];
  found_by: string;
  score: number;
  lines: Line[];
};

export type RecordingDetail =
  | { ok: false; error: string }
  | {
      ok: true;
      id: string;
      title: string;
      emoji: string;
      created_at: number;
      duration_seconds: number;
      folder_id: string | null;
      folder_name: string | null;
      recorded_by: string;
      summary: string;
      total_lines: number;
      last_idx: number;
      lines: Line[];
    };
