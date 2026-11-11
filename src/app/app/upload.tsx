"use client";

import { useRef, useState, type ReactNode } from "react";
import "./upload.css";
import { api, apiRaw, ApiError, capture, generateId, getSupabase, isGuest, isLocalOnly, isPreview, needsAccount, recordErrorOnce, store } from "./client";
import { insertRecording, updateRecording, type TranscriptSegment } from "./data";
import { notifyLibraryChanged } from "./events";
import { MicrophoneIcon } from "./Icons";
import { getLocal, patchLocal, putLocal, removeLocal, setExtras } from "./local";
import { showDailyLimit } from "./limitCard";
import { openPaywall } from "./paywallStore";
import { isPlusNow } from "./plus";
import { buildTimedSegments, confidenceStats, cutSegmentsAt, recordingShapeStats, type SonioxToken } from "./transcript";
import { Button, CloseButton, ModalCard, QuietButton, ensureAiConsent, isCardOpen, showCard, showErrorAlert } from "./ui";
import { afterSave } from "./postSave";
import { DIRECT_MAX_BYTES, STORAGE_MAX_BYTES, STORAGE_TARGET_BYTES, TooLongError, prepareUpload, shrinkAudio } from "./fileAudio";
import { addUsage, freeSecondsLeft } from "./usage";
import { t } from "./i18n";

// Uploading a file, the app's way (app repo: screens/UploadSheetScreen.tsx,
// HomeScreen openUploadModal / processUploadedFile / onPendingJobDone,
// lib/pendingTranscriptions.ts):
//   gates first (connection, free credits, AI consent) → the upload sheet →
//   a "Transcribing..." row at once → the file through the speech service's
//   async transcription (via /api/app/transcribe) → lines, title and emoji →
//   saved to the account, where the phone picks it up on its next sync.
// Files are made small first (fileAudio.ts: a video's AAC track, then a 16 kHz
// mono MP3): the speech service refuses QuickTime and files with two audio
// streams, and Storage takes files of up to 50 MB. The job and the
// file are kept in this browser until it's done (localStorage + IndexedDB),
// so a reload or a lost connection picks it up again (resumeUploads) instead
// of losing it. On the free plan the whole file is sent but only the part
// today's credits cover is kept and charged (transcribedUntil), followed by
// the paywall; the recording then says "Only the start of this file is
// transcribed." with Transcribe all (RecordingNotes).

// The row's title while it transcribes (a function: t() never runs at import time).
const transcribingTitle = () => t("recording.transcribing");
// The website's server takes request bodies up to ~4.5 MB (DIRECT_MAX_BYTES);
// bigger files wait in Storage (app repo: supabase/web_uploads.sql) for the
// speech service, up to STORAGE_MAX_BYTES.
const VIDEO_EXTENSIONS = new Set(["mp4", "mov", "m4v", "avi", "mkv", "webm", "3gp", "mts", "wmv"]);
const MAX_ATTEMPTS = 5;
const POLL_MS = 30 * 60_000;
const REMOTE_MAX_AGE_MS = 24 * 3600_000;

type Remote = { fileId?: string; storagePath?: string; transcriptionId?: string; createdAt: number };

type UploadJob = {
  id: string;
  createdAt: number;
  folderId: string | null;
  name: string;
  type: string;
  diarize: boolean;
  // Free plan: seconds of credits left when the file was picked.
  freeSeconds?: number;
  // The speech service's job already running for it.
  remote?: Remote;
  attempts: number;
  // Transcribe all: the whole file again for a recording that was cut.
  rest?: boolean;
};

// ─── Jobs (localStorage) and their files (IndexedDB) ──────────────────────────

const JOBS_KEY = "captio_upload_jobs";
const jobs = (): UploadJob[] => store.get<UploadJob[]>(JOBS_KEY, []);
function saveJob(job: UploadJob) {
  store.set(JOBS_KEY, [...jobs().filter(j => j.id !== job.id), job]);
}
function dropJob(id: string) {
  store.set(JOBS_KEY, jobs().filter(j => j.id !== id));
}

const memFiles = new Map<string, Blob>();

function idb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open("captio-uploads", 1);
    req.onupgradeneeded = () => req.result.createObjectStore("files");
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

async function idbDo<T>(mode: IDBTransactionMode, fn: (s: IDBObjectStore) => IDBRequest): Promise<T | undefined> {
  try {
    const db = await idb();
    return await new Promise<T | undefined>((resolve, reject) => {
      const req = fn(db.transaction("files", mode).objectStore("files"));
      req.onsuccess = () => resolve(req.result as T);
      req.onerror = () => reject(req.error);
    });
  } catch (e) {
    // Private window or blocked storage: the file lives in memory only (a
    // reload loses a queued upload).
    recordErrorOnce("upload_store", e);
    return undefined;
  }
}

async function keepFile(id: string, blob: Blob) {
  memFiles.set(id, blob);
  await idbDo("readwrite", s => s.put(blob, id));
}

async function fileFor(id: string): Promise<Blob | undefined> {
  return memFiles.get(id) ?? (await idbDo<Blob>("readonly", s => s.get(id)));
}

function forgetFile(id: string) {
  memFiles.delete(id);
  void idbDo("readwrite", s => s.delete(id));
}

// ─── Gates and the sheet ──────────────────────────────────────────────────────

function showNoConnection() {
  capture("action_blocked", { action: "upload", reason: "offline" });
  showCard(close => (
    <ModalCard
      title={t("home.noConnection")}
      body={t("home.noConnectionBody")}
      onClose={close}
    >
      <Button label={t("common.close")} size="compact" onPress={close} />
    </ModalCard>
  ));
}

// The dock's upload button (and a folder's): connection, free credits and AI
// consent first, like the app; then the sheet.
export async function openUpload({ folderId }: { folderId: string | null }) {
  if (typeof navigator !== "undefined" && !navigator.onLine) { showNoConnection(); return; }
  if (!isPlusNow() && freeSecondsLeft() <= 0) {
    capture("action_blocked", { action: "upload", reason: "daily_limit" });
    showDailyLimit("start", "upload");
    return;
  }
  if (!(await ensureAiConsent("upload"))) { capture("action_blocked", { action: "upload", reason: "consent_declined" }); return; }
  capture("upload_sheet_opened");
  showCard(close => (
    <UploadSheet
      onClose={close}
      onPick={(file, kind) => {
        close();
        void startUpload(file, kind, folderId);
      }}
    />
  ));
}

function VideoIcon({ color, size = 22 }: { color: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M15 10l4.553 -2.648A1 1 0 0 1 21 8.235v7.53a1 1 0 0 1 -1.447 .882L15 14" />
      <path d="M3 8a2 2 0 0 1 2 -2h8a2 2 0 0 1 2 2v8a2 2 0 0 1 -2 2H5a2 2 0 0 1 -2 -2z" />
    </svg>
  );
}

function OptionTile({ icon, label, onPress }: { icon: ReactNode; label: string; onPress: () => void }) {
  return (
    <button type="button" className="upload-tile" onClick={onPress}>
      <span className="upload-tile-icon">{icon}</span>
      <span>{label}</span>
    </button>
  );
}

// The app's upload sheet: "Upload file", the option tiles (the gallery one is
// a phone's), ✕. A file dropped on it works too.
function UploadSheet({ onClose, onPick }: { onClose: () => void; onPick: (file: File, kind: "audio" | "video") => void }) {
  const audioRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const pickerOpenedAt = useRef(0);
  const picked = (kind: "audio" | "video") => (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    capture("upload_pick_result", { kind, result: file ? "picked" : "cancelled", seconds: pickerOpenedAt.current ? Math.round((Date.now() - pickerOpenedAt.current) / 1000) : undefined });
    if (file) onPick(file, kind);
  };
  return (
    <ModalCard onClose={onClose}>
      <div
        className={`upload-sheet${dragging ? " dragging" : ""}`}
        onDragOver={e => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={e => {
          e.preventDefault();
          setDragging(false);
          const file = e.dataTransfer.files?.[0];
          if (file) onPick(file, isVideo(file) ? "video" : "audio");
        }}
      >
        <div className="upload-title-row">
          <h2>{t("upload.title")}</h2>
          <CloseButton onPress={onClose} />
        </div>
        <div className="upload-options">
          <OptionTile icon={<MicrophoneIcon color="#1C49F5" size={22} />} label={t("upload.audioFile")} onPress={() => { capture("upload_picked", { kind: "audio" }); pickerOpenedAt.current = Date.now(); audioRef.current?.click(); }} />
          <OptionTile icon={<VideoIcon color="#E37400" />} label={t("upload.videoFromFiles")} onPress={() => { capture("upload_picked", { kind: "video" }); pickerOpenedAt.current = Date.now(); videoRef.current?.click(); }} />
        </div>
        <input ref={audioRef} type="file" accept="audio/*,.m4a,.mp3,.wav,.aac,.flac,.ogg,.opus" hidden onChange={picked("audio")} />
        <input ref={videoRef} type="file" accept="video/*,.mov,.mp4,.m4v,.mkv,.avi" hidden onChange={picked("video")} />
      </div>
    </ModalCard>
  );
}

function extOf(name: string): string {
  return name.includes(".") ? name.split(".").pop()!.toLowerCase() : "";
}

function isVideo(file: File): boolean {
  return file.type.startsWith("video/") || VIDEO_EXTENSIONS.has(extOf(file.name));
}

// ─── Preparing the file ───────────────────────────────────────────────────────

async function currentUserId(): Promise<string> {
  if (isPreview()) return "preview-me";
  if (isGuest()) return "guest";
  const { data } = await getSupabase().auth.getSession();
  if (!data.session) throw new ApiError(401, "not signed in");
  return data.session.user.id;
}

// Separate Speakers, as set in Settings (settings.ts keeps it here).
function separateSpeakers(): boolean {
  return store.get<{ separateSpeakers?: boolean }>("captio_app_settings", {}).separateSpeakers ?? true;
}

// Whether this browser has an account to keep big files in Storage with.
async function canUseStorage(): Promise<boolean> {
  if (isLocalOnly()) return false;
  const { data } = await getSupabase().auth.getSession();
  return !!data.session;
}

function showTooLong(seconds: number) {
  showCard(close => (
    <ModalCard
      owl="owl-confused"
      title={t("web.upload.tooLongTitle")}
      body={t("web.upload.tooLongBody", { count: Math.round(seconds / 60) })}
      onClose={close}
    >
      <Button label={t("common.close")} size="compact" onPress={close} />
    </ModalCard>
  ));
}

function showTooBig() {
  showCard(close => (
    <ModalCard
      owl="owl-confused"
      title={t("web.upload.tooBigTitle")}
      body={t("web.upload.tooBigBody")}
      onClose={close}
    >
      <Button label={t("common.close")} size="compact" onPress={close} />
    </ModalCard>
  ));
}

async function startUpload(file: File, kind: "audio" | "video", folderId: string | null) {
  const id = generateId();
  const createdAt = Date.now();
  let userId = "preview-me";
  try { userId = await currentUserId(); } catch { /* the save says so later */ }
  const storage = await canUseStorage().catch(() => false);
  // The row shows at once ("Transcribing..."), and its page opens.
  putLocal({ id, userId, title: transcribingTitle(), emoji: "🎙️", durationSeconds: 0, createdAt, folderId, status: "transcribing" });
  window.dispatchEvent(new CustomEvent("captio-open-recording", { detail: { id } }));
  const video = kind === "video" || isVideo(file);
  try {
    const prepared = await prepareUpload(file, {
      video,
      targetBytes: storage ? STORAGE_TARGET_BYTES : DIRECT_MAX_BYTES,
      onFail: (step, e) => capture("app_error", {
        where: step === "aac" ? "upload_aac_track" : "upload_extract_audio",
        message: String((e as Error)?.message ?? e).slice(0, 200), bytes: file.size, kind,
      }),
    });
    const limit = storage ? STORAGE_MAX_BYTES : DIRECT_MAX_BYTES;
    if (prepared.blob.size > limit) {
      // Stopped here, never retried: the same file is too big every time.
      removeLocal(id);
      capture("upload_too_big", { kind, bytes: prepared.blob.size, original_bytes: file.size, prepared: prepared.how, seconds: prepared.seconds, signed_in: storage });
      if (storage) showTooBig();
      else needsAccount("big_upload");
      return;
    }
    const job: UploadJob = {
      id, createdAt, folderId, name: prepared.name, type: prepared.type,
      diarize: separateSpeakers(),
      // The app sends uploads without language hints or context: a file can
      // be in any language.
      ...(isPlusNow() ? {} : { freeSeconds: Math.max(1, Math.floor(freeSecondsLeft())) }),
      attempts: 0,
    };
    await keepFile(id, prepared.blob);
    saveJob(job);
    capture("upload_started", {
      kind, bytes: prepared.blob.size, original_bytes: file.size, converted: prepared.how !== "original",
      prepared: prepared.how, kbps: prepared.kbps, seconds: prepared.seconds ? Math.round(prepared.seconds) : undefined, prep_ms: prepared.ms,
    });
    void run(job);
  } catch (e) {
    removeLocal(id);
    if (e instanceof TooLongError) {
      capture("upload_too_long", { kind, seconds: Math.round(e.seconds), bytes: file.size });
      showTooLong(e.seconds);
      return;
    }
    showErrorAlert({ where: "upload_prepare", error: e, title: t("home.uploadFailed"), body: t("home.uploadFailedBody") });
  }
}

// ─── Running a job ────────────────────────────────────────────────────────────

const running = new Set<string>();
const retryTimers = new Map<string, ReturnType<typeof setTimeout>>();

class JobKept extends Error {}

async function upload(job: UploadJob, blob: Blob): Promise<Remote> {
  const remote: Remote = { createdAt: Date.now() };
  if (blob.size <= DIRECT_MAX_BYTES) {
    const { fileId } = await apiRaw<{ fileId: string }>("/api/app/transcribe/file", blob, {
      "x-file-name": encodeURIComponent(job.name),
      "Content-Type": job.type,
    });
    remote.fileId = fileId;
  } else {
    if (isPreview()) throw new ApiError(400, "Files over 4 MB need a signed-in account (they go through Storage).");
    const uid = await currentUserId();
    const ext = extOf(job.name) || "audio";
    const path = `${uid}/${job.id}.${ext}`;
    const { error } = await getSupabase().storage.from("web-uploads").upload(path, blob, { contentType: job.type, upsert: true });
    if (error) throw new Error(`storage_upload_failed: ${error.message}`);
    remote.storagePath = path;
  }
  return remote;
}

async function tokensFor(job: UploadJob): Promise<SonioxToken[]> {
  let remote = job.remote && Date.now() - job.remote.createdAt < REMOTE_MAX_AGE_MS ? job.remote : undefined;
  if (remote?.transcriptionId) {
    // Picked up from an earlier run, if the speech service still has it.
    try {
      await api("/api/app/transcribe", { action: "status", transcriptionId: remote.transcriptionId });
      capture("transcription_job_resumed");
    } catch (e) {
      if (e instanceof ApiError && e.status === 404) remote = undefined;
      else throw e;
    }
  }
  if (!remote?.transcriptionId) {
    const blob = await fileFor(job.id);
    if (!blob) throw new Error("missing_file: the file is no longer in this browser");
    remote = await upload(job, blob);
    job.remote = remote;
    saveJob(job);
    const { transcriptionId } = await api<{ transcriptionId: string }>("/api/app/transcribe", {
      action: "start",
      ...(remote.fileId ? { fileId: remote.fileId } : { storagePath: remote.storagePath }),
      diarize: job.diarize,
    });
    remote.transcriptionId = transcriptionId;
    job.remote = remote;
    saveJob(job);
  }

  // Every 3 s for the first 3 minutes, then every 10 s; one failed poll
  // (a flaky connection) doesn't stop it.
  const started = Date.now();
  let status = "";
  let failure = { error_type: null as string | null, error_message: null as string | null };
  while (status !== "completed" && status !== "error" && status !== "failed") {
    if (Date.now() - started > POLL_MS) throw new JobKept("transcription_timeout");
    await new Promise(r => setTimeout(r, Date.now() - started < 180_000 ? 3000 : 10_000));
    try {
      const poll = await api<{ status: string; error_type: string | null; error_message: string | null }>(
        "/api/app/transcribe", { action: "status", transcriptionId: remote.transcriptionId },
      );
      status = poll.status;
      failure = { error_type: poll.error_type, error_message: poll.error_message };
    } catch (e) {
      if (e instanceof ApiError && e.status === 404) throw new Error("transcription_not_found");
      // Transient: keep polling.
    }
  }
  if (status !== "completed") {
    await api("/api/app/transcribe", { action: "cancel", transcriptionId: remote.transcriptionId }).catch(() => {});
    throw new Error(`${failure.error_type ?? "transcription_failed"}: ${failure.error_message ?? status}`);
  }
  const { tokens } = await api<{ tokens: SonioxToken[] }>("/api/app/transcribe", {
    action: "finish", transcriptionId: remote.transcriptionId, fileId: remote.fileId,
  });
  if (remote.storagePath) void getSupabase().storage.from("web-uploads").remove([remote.storagePath]).then(() => {}, () => {});
  return tokens;
}

async function titleFor(transcript: string): Promise<{ title: string; emoji: string }> {
  const words = transcript.trim().split(/\s+/).slice(0, 6).join(" ");
  if (!transcript.trim()) return { title: t("recording.untitled"), emoji: "🎙️" };
  try {
    const r = await api<{ title: string; emoji: string }>("/api/app/title", { transcript });
    return { title: r.title || words || t("recording.untitled"), emoji: r.emoji || "🎙️" };
  } catch (e) {
    recordErrorOnce("title_generate", e);
    return { title: words || t("recording.untitled"), emoji: "🎙️" };
  }
}

function errorCode(): string {
  const a = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  return Array.from({ length: 6 }, () => a[Math.floor(Math.random() * a.length)]).join("");
}

async function run(job: UploadJob): Promise<void> {
  if (running.has(job.id)) return;
  running.add(job.id);
  const timer = retryTimers.get(job.id);
  if (timer) { clearTimeout(timer); retryTimers.delete(job.id); }
  try {
    const tokens = await tokensFor(job);
    const built: TranscriptSegment[] = buildTimedSegments(tokens, job.diarize);
    const durationSeconds = Math.round((tokens[tokens.length - 1]?.end_ms ?? 0) / 1000);
    // Bought Plus while it was transcribing: nothing is cut.
    const cutAt = job.freeSeconds != null && !isPlusNow() ? job.freeSeconds : undefined;
    const cut = cutAt != null && durationSeconds > cutAt;
    const segments = cut ? cutSegmentsAt(built, cutAt) : built;
    const transcript = segments.map(s => s.text).join("").trim();

    if (job.rest) await finishRest(job, segments);
    else await finishUpload(job, segments, transcript, durationSeconds, cut ? cutAt : undefined);

    capture("transcription_job_done", { kind: "upload", empty: !transcript, attempts: job.attempts + 1, rest: !!job.rest });
    dropJob(job.id);
    // Kept only while there's more of the file to transcribe (Transcribe all).
    if (!cut) forgetFile(job.id);
  } catch (e) {
    if (e instanceof JobKept) return; // still the speech service's; the next run picks it up
    const msg = String((e as Error)?.message ?? e);
    const code = errorCode();
    capture("app_error", { where: "upload_transcription", error_code: code, message: msg.slice(0, 200), attempt: job.attempts + 1 });
    const networkError = e instanceof TypeError || !navigator.onLine || /network|failed to fetch|load failed/i.test(msg);
    // The file itself was refused: the same bytes fail every time.
    const terminal = /^invalid_audio_file|^transcription_output_too_long|^model_not_available|^missing_file|maximum allowed size|^file_too_long/.test(msg);
    const attempts = terminal ? MAX_ATTEMPTS : job.attempts + (networkError ? 0 : 1);
    const giveUp = attempts >= MAX_ATTEMPTS;
    job.attempts = attempts;
    // A job that never got going starts over next time.
    if (!networkError && job.remote && !job.remote.transcriptionId) delete job.remote;
    saveJob(job);
    if (job.rest) {
      if (giveUp) showErrorAlert({ where: "upload_transcribe_rest", error: e, retry: () => { job.attempts = 0; void run(job); } });
      else scheduleRetry(job);
      return;
    }
    if (networkError) {
      // Waits for the connection (resumeUploads listens for it).
      patchLocal(job.id, { status: "transcribing", failure: undefined });
    } else if (giveUp) {
      capture("pending_transcription_gave_up", { attempts, error_code: code });
      const unsupported = terminal && !/^missing_file/.test(msg);
      patchLocal(job.id, { status: "failed", failure: `${unsupported ? "unsupported" : "failed"}:${code}` });
      showErrorAlert({
        where: "upload_transcription",
        error: e,
        title: unsupported ? t("recording.unsupportedTitle") : t("recording.failedTitle"),
        body: unsupported
          ? t("recording.unsupportedBody")
          : t("recording.failedBody"),
        retry: unsupported ? undefined : () => retryUpload(job.id),
      });
    } else {
      patchLocal(job.id, { status: "transcribing", failure: `retrying:${code}` });
      scheduleRetry(job);
    }
  } finally {
    running.delete(job.id);
  }
}

// A failed try that isn't a lost connection: again after 1, 2, 4 … minutes.
function scheduleRetry(job: UploadJob) {
  const t = setTimeout(() => { retryTimers.delete(job.id); void run(job); }, Math.min(15, 2 ** Math.max(0, job.attempts - 1)) * 60_000);
  retryTimers.set(job.id, t);
}

async function finishUpload(job: UploadJob, segments: TranscriptSegment[], transcript: string, durationSeconds: number, transcribedSeconds: number | undefined) {
  const row = getLocal(job.id);
  if (!row) {
    // Deleted while it was transcribing.
    forgetFile(job.id);
    return;
  }
  const { title, emoji } = await titleFor(transcript);
  const body = { segments, speakerNames: {}, labels: null, people: {}, summary: [] };
  setExtras(job.id, "transcribedUntil", transcribedSeconds ?? null);
  // Its page fills in right away.
  patchLocal(job.id, { title, emoji, durationSeconds, status: undefined, failure: undefined, body });
  if (!isLocalOnly()) {
    // Picked as a guest and finished after signing in: the account's now.
    const owner = row.userId === "guest" ? await currentUserId() : row.userId;
    await insertRecording(getSupabase(), owner, {
      id: job.id, title, emoji, durationSeconds, createdAt: job.createdAt, folderId: job.folderId, segments,
    });
    notifyLibraryChanged();
    // The account's copy takes over once the list has read it again.
    setTimeout(() => removeLocal(job.id), 4000);
  }
  const cut = transcribedSeconds != null;
  if (!isPlusNow()) addUsage(cut ? transcribedSeconds : durationSeconds);
  capture("recording_saved", {
    kind: "upload", duration_seconds: durationSeconds,
    ...(cut ? { cut: true, transcribed_seconds: transcribedSeconds } : {}),
    ...confidenceStats(segments), ...recordingShapeStats(segments, durationSeconds),
  });
  if (cut) {
    // Straight to the plans (no card in between), unless something else is up.
    setTimeout(() => { if (!isCardOpen()) openPaywall("upload_cut"); }, 750);
  } else {
    // The app's follow-ups (folder question, rating); not after a cut file.
    afterSave({ id: job.id, transcript, folderId: job.folderId, where: "upload" });
  }
}

// Transcribe all, done: the whole file's lines replace the cut ones.
async function finishRest(job: UploadJob, segments: TranscriptSegment[]) {
  const local = getLocal(job.id);
  if (local) patchLocal(job.id, { body: { ...(local.body ?? { speakerNames: {}, labels: null, people: {}, summary: [] }), segments } });
  else if (!isLocalOnly()) await updateRecording(getSupabase(), job.id, { segments });
  setExtras(job.id, "transcribedUntil", null);
  notifyLibraryChanged();
  window.dispatchEvent(new CustomEvent("captio-recording-changed", { detail: { id: job.id } }));
  capture("transcribe_rest_done", { live: false });
}

// ─── Any audio (the missed parts of a live session) ──────────────────────────

export type TranscribeOptions = {
  diarize: boolean;
  languageHints?: string[];
  context?: string;
  translation?: { type: "one_way"; target_language: string } | { type: "two_way"; language_a: string; language_b: string };
};

// A WAV (or any audio) through the same async transcription as an upload:
// small ones straight through the server, bigger ones through Storage; the
// tokens, timed from the start of the blob. Throws on failure.
export async function transcribeBlob(blob: Blob, opts: TranscribeOptions, name = "audio.wav"): Promise<SonioxToken[]> {
  // A session's kept audio is plain WAV (2 MB a minute): an MP3 is a tenth of that.
  if (blob.size > DIRECT_MAX_BYTES) {
    const small = await shrinkAudio(blob, (await canUseStorage().catch(() => false)) ? STORAGE_TARGET_BYTES : DIRECT_MAX_BYTES);
    if (small) {
      blob = small;
      name = name.replace(/\.wav$/i, "") + ".mp3";
    }
  }
  let remote: Remote = { createdAt: Date.now() };
  const job: UploadJob = { id: generateId(), createdAt: Date.now(), folderId: null, name, type: blob.type || "audio/wav", diarize: opts.diarize, attempts: 0 };
  remote = await upload(job, blob);
  const { transcriptionId } = await api<{ transcriptionId: string }>("/api/app/transcribe", {
    action: "start",
    ...(remote.fileId ? { fileId: remote.fileId } : { storagePath: remote.storagePath }),
    diarize: opts.diarize,
    ...(opts.languageHints?.length ? { languageHints: opts.languageHints } : {}),
    ...(opts.context ? { context: opts.context } : {}),
    ...(opts.translation ? { translation: opts.translation } : {}),
  });
  const started = Date.now();
  let status = "";
  let failure = "";
  while (status !== "completed" && status !== "error" && status !== "failed") {
    if (Date.now() - started > POLL_MS) throw new Error("transcription_timeout");
    await new Promise(r => setTimeout(r, Date.now() - started < 180_000 ? 3000 : 10_000));
    try {
      const poll = await api<{ status: string; error_type: string | null; error_message: string | null }>("/api/app/transcribe", { action: "status", transcriptionId });
      status = poll.status;
      failure = `${poll.error_type ?? ""}: ${poll.error_message ?? ""}`;
    } catch (e) {
      if (e instanceof ApiError && e.status === 404) throw new Error("transcription_not_found");
    }
  }
  if (status !== "completed") {
    await api("/api/app/transcribe", { action: "cancel", transcriptionId }).catch(() => {});
    throw new Error(failure || `transcription_${status}`);
  }
  const { tokens } = await api<{ tokens: SonioxToken[] }>("/api/app/transcribe", { action: "finish", transcriptionId, fileId: remote.fileId });
  if (remote.storagePath) void getSupabase().storage.from("web-uploads").remove([remote.storagePath]).then(() => {}, () => {});
  return tokens;
}

// ─── From outside ─────────────────────────────────────────────────────────────

let resumed = false;

// On opening the app (Shell): every upload that didn't finish goes on, and
// waiting ones go on when the connection comes back.
export function resumeUploads() {
  const go = () => {
    for (const job of jobs()) {
      if (!job.rest && !getLocal(job.id)) {
        putLocal({ id: job.id, userId: "", title: transcribingTitle(), emoji: "🎙️", durationSeconds: 0, createdAt: job.createdAt, folderId: job.folderId, status: "transcribing" });
        void currentUserId().then(uid => patchLocal(job.id, { userId: uid }), () => {});
      }
      if (getLocal(job.id)?.status === "failed") continue;
      void run(job);
    }
  };
  go();
  if (!resumed) {
    resumed = true;
    window.addEventListener("online", go);
  }
}

// "Try again" on a failed upload.
export function retryUpload(id: string) {
  const job = jobs().find(j => j.id === id);
  if (!job) return;
  capture("upload_retry_tapped");
  job.attempts = 0;
  saveJob(job);
  patchLocal(id, { status: "transcribing", failure: undefined });
  void run(job);
}

export function deleteUpload(id: string) {
  const job = jobs().find(j => j.id === id);
  if (job?.remote?.transcriptionId || job?.remote?.fileId) {
    void api("/api/app/transcribe", { action: "cancel", transcriptionId: job.remote.transcriptionId, fileId: job.remote.fileId }).catch(() => {});
  }
  if (job?.remote?.storagePath) void getSupabase().storage.from("web-uploads").remove([job.remote.storagePath]).then(() => {}, () => {});
  dropJob(id);
  forgetFile(id);
  removeLocal(id);
}

// Tapping a failed upload's row: Try again, Delete, or Report problem.
export function openFailedUpload(id: string) {
  const row = getLocal(id);
  const unsupported = row?.failure?.startsWith("unsupported");
  capture("failed_upload_opened", { unsupported: !!unsupported });
  showCard(close => (
    <FailedUploadCard id={id} unsupported={!!unsupported} code={row?.failure?.split(":")[1] ?? ""} close={close} />
  ));
}

function FailedUploadCard({ id, unsupported, code, close }: { id: string; unsupported: boolean; code: string; close: () => void }) {
  const [reporting, setReporting] = useState(false);
  const [text, setText] = useState("");
  if (reporting) {
    return (
      <ModalCard title={t("errorReport.promptTitle")} body={t("errorReport.promptBody")} onClose={close}>
        <textarea className="input" rows={4} autoFocus value={text} onChange={e => setText(e.target.value)} aria-label={t("errorReport.promptTitle")} />
        <Button
          label={t("common.send")}
          size="compact"
          disabled={!text.trim()}
          style={{ marginTop: 12 }}
          onPress={() => { capture("error_report", { where: "upload_transcription", error_code: code, error_message: "", report: text.trim().slice(0, 1000) }); close(); }}
        />
        <QuietButton label={t("common.cancel")} onPress={close} />
      </ModalCard>
    );
  }
  return (
    <ModalCard
      title={unsupported ? t("recording.unsupportedTitle") : t("recording.failedTitle")}
      body={<>
        {unsupported
          ? t("recording.unsupportedBody")
          : t("recording.failedBody")}
        {code && <span className="ui-code">{t("common.errorCode", { code })}</span>}
      </>}
      onClose={close}
    >
      {!unsupported && <Button label={t("common.tryAgain")} size="compact" onPress={() => { close(); retryUpload(id); }} />}
      <Button label={t("common.delete")} variant="secondary" size="compact" style={{ color: "var(--destructive)" }} onPress={() => { close(); deleteUpload(id); }} />
      <QuietButton label={t("errorReport.reportButton")} onPress={() => { capture("error_report_opened", { where: "upload_transcription", error_code: code }); setReporting(true); }} />
    </ModalCard>
  );
}

// Transcribe all (a file the free credits covered only partly). Plus: the
// whole file again, from this browser's copy, or picked again when this
// browser doesn't have it. Free: the plans.
export async function transcribeRest(id: string, folderId: string | null) {
  capture("transcribe_rest_tapped", { live: false, is_plus: isPlusNow() });
  if (!isPlusNow()) { openPaywall("upload_cut"); return; }
  if (!navigator.onLine) { showNoConnection(); return; }
  if (!(await ensureAiConsent("transcribe_rest"))) return;
  const job: UploadJob = { id, createdAt: Date.now(), folderId, name: "audio", type: "", diarize: separateSpeakers(), attempts: 0, rest: true };
  const blob = await fileFor(id);
  const go = async (file: Blob, name: string) => {
    // A file picked again is made small as on the first upload (this
    // browser's own copy already was).
    let use: Blob = file;
    let useName = name;
    if (file instanceof File) {
      try {
        const p = await prepareUpload(file, { video: isVideo(file), targetBytes: (await canUseStorage()) ? STORAGE_TARGET_BYTES : DIRECT_MAX_BYTES });
        use = p.blob;
        useName = p.name;
      } catch (e) {
        if (e instanceof TooLongError) { showTooLong(e.seconds); return; }
      }
    }
    if (use.size > STORAGE_MAX_BYTES) { showTooBig(); return; }
    job.name = useName;
    job.type = use.type || "application/octet-stream";
    await keepFile(id, use);
    saveJob(job);
    await run(job);
  };
  if (blob) { await go(blob, "audio"); return; }
  // Uploaded in another browser or on the phone: choose the same file again.
  showCard(close => (
    <ModalCard
      title={t("web.upload.chooseAgainTitle")}
      body={t("web.upload.chooseAgainBody")}
      onClose={close}
    >
      <label className="ui-btn primary compact upload-pick-again">
        <span>{t("web.upload.chooseFile")}</span>
        <input
          type="file"
          accept="audio/*,video/*"
          hidden
          onChange={e => {
            const file = e.target.files?.[0];
            close();
            if (file) void go(file, file.name);
          }}
        />
      </label>
      <QuietButton label={t("common.notNow")} onPress={close} />
    </ModalCard>
  ));
}

// Whether Transcribe all is running for a recording (the note's button shows it).
export function isTranscribingRest(id: string): boolean {
  return running.has(id) && !!jobs().find(j => j.id === id)?.rest;
}
