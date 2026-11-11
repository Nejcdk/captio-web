// A file through the speech service's async transcription, the app's way
// (app repo: lib/pendingTranscriptions.ts sonioxTokens): start, poll, fetch
// the tokens, forget the job. The browser drives it, one call per step:
//   { action: "start", fileId | storagePath, diarize, languageHints?, context?, translation? }
//   { action: "status", transcriptionId }
//   { action: "finish", transcriptionId, fileId? }  → tokens; job and file deleted
//   { action: "cancel", transcriptionId?, fileId? }
// A file over 4 MB waits in Storage (web-uploads/<uid>/…, app repo
// supabase/web_uploads.sql); the speech service fetches it through a signed
// URL made with the caller's own session. Every job carries the caller's id
// (client_reference_id) and only that caller can read it.

import { env, errorResponse, HttpError, requireCaller } from "@/lib/webapp/server";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

const SONIOX = "https://api.soniox.com/v1";
const SONIOX_ASYNC_MODEL = "stt-async-v6";

type Body = {
  action?: "start" | "status" | "finish" | "cancel";
  fileId?: string;
  storagePath?: string;
  transcriptionId?: string;
  diarize?: boolean;
  languageHints?: string[];
  context?: string;
  translation?: { type: "one_way"; target_language: string } | { type: "two_way"; language_a: string; language_b: string };
};

const auth = () => ({ Authorization: `Bearer ${env("SONIOX_API_KEY")}` });
const isId = (v: unknown): v is string => typeof v === "string" && /^[A-Za-z0-9_-]{8,80}$/.test(v);

async function soniox(path: string, init: RequestInit = {}) {
  const res = await fetch(`${SONIOX}${path}`, { ...init, headers: { ...auth(), ...(init.headers ?? {}) }, cache: "no-store" });
  const data = (await res.json().catch(() => ({}))) as Record<string, unknown>;
  return { res, data };
}

// The job must be this caller's.
async function ownJob(transcriptionId: string, ref: string) {
  const { res, data } = await soniox(`/transcriptions/${transcriptionId}`);
  if (res.status === 404) throw new HttpError(404, "transcription_not_found");
  if (!res.ok) throw new HttpError(502, String(data.error_type ?? `transcription_poll_failed_${res.status}`));
  if (data.client_reference_id !== ref) throw new HttpError(404, "transcription_not_found");
  return data;
}

function forget(transcriptionId?: string, fileId?: string) {
  const jobs: Promise<unknown>[] = [];
  if (isId(transcriptionId)) jobs.push(fetch(`${SONIOX}/transcriptions/${transcriptionId}`, { method: "DELETE", headers: auth() }).catch(() => {}));
  if (isId(fileId)) jobs.push(fetch(`${SONIOX}/files/${fileId}`, { method: "DELETE", headers: auth() }).catch(() => {}));
  return Promise.all(jobs);
}

// A short-lived link to the caller's own file in Storage.
async function signedUrl(req: Request, uid: string, path: string): Promise<string> {
  if (!path.startsWith(`${uid}/`) || path.includes("..")) throw new HttpError(403, "not your file");
  const token = req.headers.get("authorization")?.replace(/^Bearer\s+/i, "") ?? "";
  const { SUPABASE_URL, SUPABASE_ANON_KEY } = process.env;
  const res = await fetch(`${SUPABASE_URL}/storage/v1/object/sign/web-uploads/${path.split("/").map(encodeURIComponent).join("/")}`, {
    method: "POST",
    headers: { apikey: SUPABASE_ANON_KEY ?? "", Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify({ expiresIn: 6 * 3600 }),
    cache: "no-store",
  });
  const data = (await res.json().catch(() => ({}))) as { signedURL?: string; message?: string };
  if (!res.ok || !data.signedURL) throw new HttpError(502, `storage_sign_failed_${res.status}`);
  return `${SUPABASE_URL}/storage/v1${data.signedURL}`;
}

export async function POST(req: Request) {
  try {
    const b = (await req.json()) as Body;
    const user = await requireCaller(req, b.action === "start" ? "transcribe_start" : "transcribe_poll");
    const ref = `web_${user.id}`.slice(0, 120);

    if (b.action === "start") {
      const body: Record<string, unknown> = { model: SONIOX_ASYNC_MODEL, enable_language_identification: true, client_reference_id: ref };
      if (isId(b.fileId)) body.file_id = b.fileId;
      // Storage is per account: a guest's files go directly (up to 4 MB).
      else if (typeof b.storagePath === "string" && !user.guest) body.audio_url = await signedUrl(req, user.id, b.storagePath);
      else throw new HttpError(400, "no file");
      if (b.diarize) body.enable_speaker_diarization = true;
      if (Array.isArray(b.languageHints) && b.languageHints.length) body.language_hints = b.languageHints.filter(h => typeof h === "string").slice(0, 20);
      if (typeof b.context === "string" && b.context.trim()) body.context = { text: b.context.slice(0, 10_000) };
      if (b.translation) body.translation = b.translation;
      const { res, data } = await soniox("/transcriptions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok || !data.id) {
        if (isId(b.fileId)) await forget(undefined, b.fileId);
        return Response.json({ error: String(data.error_type ?? "transcription_create_failed"), message: data.error_message }, { status: 502 });
      }
      return Response.json({ transcriptionId: data.id, status: data.status });
    }

    if (!isId(b.transcriptionId)) {
      if (b.action === "cancel") {
        // Only a file was uploaded; it carries the caller's id too.
        if (isId(b.fileId)) {
          const { res, data } = await soniox(`/files/${b.fileId}`);
          if (res.ok && data.client_reference_id === ref) await forget(undefined, b.fileId);
        }
        return Response.json({ ok: true });
      }
      throw new HttpError(400, "no transcription");
    }

    const job = await ownJob(b.transcriptionId, ref);

    if (b.action === "status") {
      return Response.json({ status: job.status, error_type: job.error_type ?? null, error_message: job.error_message ?? null });
    }

    if (b.action === "finish") {
      if (job.status !== "completed") throw new HttpError(409, `not_completed_${job.status}`);
      const { res, data } = await soniox(`/transcriptions/${b.transcriptionId}/transcript`);
      if (!res.ok) throw new HttpError(502, String(data.error_type ?? "transcript_fetch_failed"));
      await forget(b.transcriptionId, typeof job.file_id === "string" ? job.file_id : b.fileId);
      return Response.json({ tokens: data.tokens ?? [] });
    }

    if (b.action === "cancel") {
      await forget(b.transcriptionId, typeof job.file_id === "string" ? job.file_id : b.fileId);
      return Response.json({ ok: true });
    }

    throw new HttpError(400, "unknown action");
  } catch (e) {
    return errorResponse(e);
  }
}
