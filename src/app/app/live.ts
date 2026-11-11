import { api, capture, recordError, recordErrorOnce, store } from "./client";
import { labelIsBuiltIn, startCapture, type Capture } from "./audio";
import { SessionAudio } from "./sessionAudio";
import { addUsage, freeSecondsLeft, getTodayUsage, FREE_DAILY_CREDITS, SECONDS_PER_CREDIT } from "./usage";
import type { TranscriptSegment, TranscriptWord } from "./data";
import type { Gap } from "./liveRest";
import {
  SONIOX_RT_MODEL, buildTimedSegments, buildTranslationSegments, startsParagraph, type SonioxToken,
} from "./transcript";

// One live captions or translation session, the app's rules (app repo:
// HomeScreen connectLive, markLiveLost, pauseCaptionsForCredits, rollover,
// renewLiveStream, liveDraft.ts, captureHealth.ts): the microphone streams to
// the speech service with a short-lived key; words come back grey, then final;
// speakers and languages start new lines; pause closes the stream (nothing
// billed while paused), resume opens a new one; a dropped connection holds
// the audio and sends it at twice real time once back, and what's too long to
// catch up is transcribed from the kept audio on save; the free credits are
// counted while captions run and, when they're gone, captions stop but the
// recording goes on (its audio kept for later); every step is timed and a
// stall reported, and a draft is kept so a closed tab still saves the session.

export type LiveMode = "captions" | "translation";
export type Line = { speaker: string; text: string; language?: string; grey?: boolean };
export type Translate = { target: string; source: string | null }; // language codes; source = two-way

export type LiveSnapshot = {
  mode: LiveMode;
  phase: "starting" | "live" | "paused" | "lost" | "saving";
  seconds: number;
  lines: Line[];          // captions
  top: Line[];            // translation: what was said (one-way) or language A (two-way)
  bottom: Line[];         // translation: the translation, or language B
  detected: string | null; // the spoken language when auto-detecting
  creditsOut: "out" | "unlocked" | null;
  lastMinute: boolean;
  reconnectFailed: boolean;
  hasText: boolean;
  micLabel: string;
  micId: string;
  silent: boolean;        // the microphone hears nothing at all
};

export type LiveOptions = {
  mode: LiveMode;
  diarize: boolean;
  languageHints: string[];
  context: string;
  translate: Translate | null;
  deviceId: string;
  isPlus: () => boolean;
  folderId: string | null;
};

// A part to save: the lines, how long, where captions stopped for credits,
// and what the live captions never covered (on this part's timeline).
export type LiveResult = {
  segments: TranscriptSegment[];
  seconds: number;
  text: string;
  creditsCutAt: number | null;
  unlocked: boolean;
  gaps: Gap[];
  audioId: string | null;
  audioOffset: number;
};

const WS_URL = "wss://stt-rt.soniox.com/transcribe-websocket";
const DRAFT_KEY = "captio_live_draft";
// Held in memory while the connection is down; older audio is in the kept
// audio and transcribed on save.
const MAX_BUFFER_CHUNKS = 3000;
// After a reconnect, up to a minute is caught up live; more becomes a gap.
const CATCHUP_MAX_CHUNKS = 600;
const RESEND_CHUNKS = 30;
const BACKOFF = [1000, 2000, 4000, 8000, 15000];
// The speech service closes every stream at 300 minutes: a fresh one first.
const RENEW_AFTER_MS = 270 * 60_000;
// captureHealth thresholds (app): words should come within 25 s of loud audio.
const NO_TEXT_CHUNKS = 250;
const SPEECH_PEAK = 1500;
const TRANSLATION_SPOKEN_TOKENS = 40;

type Pane = { segs: Line[]; tail: Line[] };
type Queued = { pcm: ArrayBuffer; at: number };

function appendLine(segs: Line[], speaker: string, text: string, language?: string) {
  const last = segs[segs.length - 1];
  const newLanguage = !!language && !!last?.language && language !== last.language && text.startsWith(" ");
  if (!last || last.speaker !== speaker || newLanguage || startsParagraph(last.text, text)) {
    segs.push({ speaker, text: text.trimStart(), ...(language ? { language } : {}) });
  } else {
    last.text += text;
    if (!last.language && language) last.language = language;
  }
}

// Grey words keep their leading space: they run on after the final words.
function tailLines(tokens: { speaker: string; text: string; language?: string }[]): Line[] {
  const out: Line[] = [];
  for (const t of tokens) {
    const before = out.length;
    appendLine(out, t.speaker, t.text, t.language);
    if (out.length > before && /^\s/.test(t.text)) out[out.length - 1].text = t.text.match(/^\s+/)![0] + out[out.length - 1].text;
  }
  return out.map(l => ({ ...l, grey: true }));
}

function shiftWords(words: TranscriptWord[] | undefined, ms: number): TranscriptWord[] | undefined {
  return ms ? words?.map(w => ({ ...w, s: w.s - ms, e: w.e - ms })) : words;
}

// Every step of a session, timed (app: captureHealth.ts).
type Health = {
  openedAt: number;
  recorderAt?: number;
  keyAt?: number;
  socketAt?: number;
  firstTextAt?: number;
  firstOutputAt?: number;
  chunks: number;
  chunksSinceSocket: number;
  peak: number;
  spokenTokens: number;
  outputTokens: number;
  reconnects: number;
  levelChecks: number;
  loudChecks: number;
  input?: string;
  inputChanges: number;
  stalls: Set<string>;
};

export class LiveSession {
  private opts: LiveOptions;
  private listeners = new Set<() => void>();
  private capture: Capture | null = null;
  private ws: WebSocket | null = null;
  private wsReady = false;
  private wsOpenedAt = 0;
  private queue: Queued[] = [];
  private pacer: ReturnType<typeof setInterval> | null = null;
  private streamOffset = 0;
  private atSeam = true;
  private finalTokens: SonioxToken[] = [];
  // The latest message's grey tokens (timeline-adjusted), kept if the stream ends.
  private greyTokens: SonioxToken[] = [];
  private captions: Pane = { segs: [], tail: [] };
  private top: Pane = { segs: [], tail: [] };
  private bottom: Pane = { segs: [], tail: [] };
  private lastSpokenSpeaker = "";
  private usageAcc = 0;
  private recordedMs = 0;
  // Where the current part began (an hourly save starts a new one).
  private partStartMs = 0;
  private quietMs = 0;
  private attempts = 0;
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null;
  private draftTimer: ReturnType<typeof setInterval> | null = null;
  private watchdog: ReturnType<typeof setInterval> | null = null;
  private finishedResolve: (() => void) | null = null;
  private ended = false;
  private connecting = false;
  // Session timeline (ms): where captions stopped for credits, and unlocked.
  private creditsCutMs: number | null = null;
  private unlockedMs: number | null = null;
  private gaps: { from: number; to: number; kind: Gap["kind"] }[] = [];
  private audio: SessionAudio;
  private health: Health;
  readonly startedAt = Date.now();
  snap: LiveSnapshot;

  constructor(opts: LiveOptions) {
    this.opts = opts;
    this.audio = new SessionAudio(`live-${this.startedAt}-${Math.random().toString(36).slice(2, 7)}`);
    this.health = {
      openedAt: Date.now(), chunks: 0, chunksSinceSocket: 0, peak: 0, spokenTokens: 0, outputTokens: 0,
      reconnects: 0, levelChecks: 0, loudChecks: 0, inputChanges: 0, stalls: new Set(),
    };
    this.snap = {
      mode: opts.mode, phase: "starting", seconds: 0, lines: [], top: [], bottom: [], detected: null,
      creditsOut: null, lastMinute: false, reconnectFailed: false, hasText: false, micLabel: "", micId: opts.deviceId, silent: false,
    };
    this.onOnline = this.onOnline.bind(this);
    this.onOffline = this.onOffline.bind(this);
    this.watchdog = setInterval(() => this.check(), 1000);
  }

  get mode() { return this.opts.mode; }
  get folderId() { return this.opts.folderId; }
  get options(): LiveOptions { return this.opts; }

  subscribe = (l: () => void) => {
    this.listeners.add(l);
    return () => { this.listeners.delete(l); };
  };

  private emit(patch: Partial<LiveSnapshot> = {}) {
    const hasText = this.captions.segs.length > 0 || this.top.segs.length > 0 || this.bottom.segs.length > 0;
    this.snap = {
      ...this.snap,
      ...patch,
      seconds: Math.floor(this.recordedMs / 1000),
      lines: [...this.captions.segs, ...this.captions.tail],
      top: [...this.top.segs, ...this.top.tail],
      bottom: [...this.bottom.segs, ...this.bottom.tail],
      hasText,
    };
    this.listeners.forEach(l => l());
  }

  // ─── Start, pause, stop ───────────────────────────────────────────────────

  async start() {
    this.capture = await startCapture(this.opts.deviceId, (pcm, peak) => this.onChunk(pcm, peak));
    this.health.recorderAt = Date.now();
    this.health.input = labelIsBuiltIn(this.capture.label) ? "builtin" : "external";
    window.addEventListener("online", this.onOnline);
    window.addEventListener("offline", this.onOffline);
    this.draftTimer = setInterval(() => this.saveDraft(), 10_000);
    this.emit({ micLabel: this.capture.label, micId: this.capture.deviceId });
    this.connect();
  }

  // Throws when the microphone can't be opened (the old one keeps going).
  async switchMic(deviceId: string) {
    const prev = this.capture;
    this.capture = await startCapture(deviceId, (pcm, peak) => this.onChunk(pcm, peak));
    prev?.stop();
    this.health.inputChanges++;
    this.emit({ micLabel: this.capture.label, micId: this.capture.deviceId });
  }

  pause() {
    if (this.snap.phase === "paused") return;
    this.foldTails();
    this.dropSocket(true);
    this.emit({ phase: "paused" });
    capture("captions_stopped", { mode: this.opts.mode });
  }

  resume() {
    if (this.snap.phase !== "paused") return;
    this.emit({ phase: this.snap.creditsOut === "out" ? "live" : "starting" });
    capture("captions_resumed", { mode: this.opts.mode, native_restart: false });
    this.connect();
  }

  // Separate Speakers, language hints, words, a new language: the service
  // reads them when a stream starts, so the stream starts again.
  restart(patch: Partial<LiveOptions>) {
    this.opts = { ...this.opts, ...patch };
    if (patch.translate) this.emit({ detected: null });
    if (this.snap.phase === "paused" || this.snap.creditsOut === "out") return;
    this.foldTails();
    this.dropSocket(true);
    this.connect();
  }

  // Waits for the last words, then gives back the part to save.
  async stop(): Promise<LiveResult> {
    this.emit({ phase: "saving" });
    const ws = this.ws;
    if (ws && this.wsReady && ws.readyState === WebSocket.OPEN) {
      // Whatever is still queued goes first, then the end of the audio.
      if (this.queue.length > CATCHUP_MAX_CHUNKS) this.skipToRecent();
      this.flushQueueNow();
      const done = new Promise<void>(r => { this.finishedResolve = r; });
      try { ws.send(""); } catch { /* closing anyway */ }
      const timedOut = await Promise.race([done.then(() => false), new Promise<boolean>(r => setTimeout(() => r(true), 6000))]);
      if (timedOut) capture("live_flush_timeout", { mode: this.opts.mode });
    } else if (this.queue.length) {
      // Never sent (no connection at the end): the kept audio has it.
      this.addGap(this.queue[0].at, this.recordedMs, "connection");
      this.queue = [];
    }
    this.foldTails();
    const result = this.takePart(this.recordedMs);
    this.end();
    await this.audio.flush();
    this.audio.release();
    return result;
  }

  // The hourly save of a session recorded into a shared folder: this part's
  // lines (final words only; grey ones go to the next part), then the
  // session carries on as a new recording (app: rollover).
  async rollover(): Promise<LiveResult> {
    const result = this.takePart(this.recordedMs);
    await this.audio.flush();
    this.partStartMs = this.recordedMs;
    this.captions.segs = [];
    this.top.segs = [];
    this.bottom.segs = [];
    this.saveDraft();
    this.emit();
    return result;
  }

  private takePart(endMs: number): LiveResult {
    const start = this.partStartMs;
    const all = this.opts.mode === "translation"
      ? buildTranslationSegments(this.finalTokens, this.opts.diarize)
      : buildTimedSegments(this.finalTokens, this.opts.diarize);
    const segments = all.map(seg => ({
      ...seg,
      words: shiftWords(seg.words, start),
      ...(seg.original ? { original: { ...seg.original, words: shiftWords(seg.original.words, start) } } : {}),
    }));
    this.finalTokens = [];
    // Credits: from where they ran out to the unlock or the end.
    const ranges = [...this.gaps];
    if (this.creditsCutMs !== null) ranges.push({ from: this.creditsCutMs, to: this.unlockedMs ?? endMs, kind: "credits" });
    const gaps: Gap[] = ranges
      .map(g => ({ from: Math.max(g.from, start), to: Math.min(g.to, endMs), kind: g.kind }))
      .filter(g => g.to - g.from >= 1000)
      .map(g => ({ from: (g.from - start) / 1000, to: (g.to - start) / 1000, kind: g.kind }));
    this.gaps = this.gaps.filter(g => g.to > endMs).map(g => ({ ...g, from: Math.max(g.from, endMs) }));
    const cut = this.creditsCutMs !== null && this.creditsCutMs >= start ? (this.creditsCutMs - start) / 1000 : null;
    if (this.creditsCutMs !== null && this.unlockedMs !== null && this.unlockedMs <= endMs) {
      this.creditsCutMs = null;
      this.unlockedMs = null;
    } else if (this.creditsCutMs !== null) {
      this.creditsCutMs = endMs;
    }
    return {
      segments,
      seconds: Math.max(1, Math.round((endMs - start) / 1000)),
      text: segments.map(s => s.text).join(" ").trim(),
      creditsCutAt: cut === null ? null : Math.round(cut),
      unlocked: this.unlockedMs !== null || (cut !== null && this.opts.isPlus()),
      gaps,
      audioId: this.audio.ok ? this.audio.id : null,
      audioOffset: start / 1000,
    };
  }

  discard() {
    this.end();
    this.audio.release();
    store.remove(DRAFT_KEY);
  }

  clearDraft() {
    store.remove(DRAFT_KEY);
  }

  // The save failed: everything said so far is the next visit's to save.
  keepDraft(result: LiveResult) {
    store.set(DRAFT_KEY, {
      mode: this.opts.mode, diarize: this.opts.diarize, translate: this.opts.translate, folderId: this.opts.folderId,
      segments: result.segments, tokens: [], seconds: result.seconds, startedAt: this.startedAt + this.partStartMs,
    } satisfies LiveDraft);
  }

  get audioId() { return this.audio.id; }

  private end() {
    this.ended = true;
    this.dropSocket(true);
    this.capture?.stop();
    this.capture = null;
    if (this.reconnectTimer) clearTimeout(this.reconnectTimer);
    if (this.draftTimer) clearInterval(this.draftTimer);
    if (this.pacer) clearInterval(this.pacer);
    if (this.watchdog) clearInterval(this.watchdog);
    window.removeEventListener("online", this.onOnline);
    window.removeEventListener("offline", this.onOffline);
  }

  // ─── Analytics (app: caption_session_ended, captureHealth.summary) ────────

  stats(ended: "saved" | "deleted"): Record<string, unknown> {
    const h = this.health;
    const since = (t?: number) => (t ? t - h.openedAt : undefined);
    const seconds = Math.round(this.recordedMs / 1000);
    const cut = this.creditsCutMs !== null || this.unlockedMs !== null;
    const counted = this.creditsCutMs !== null && this.unlockedMs === null ? Math.round(this.creditsCutMs / 1000) : seconds;
    return {
      mode: this.opts.mode,
      ended,
      session_seconds: seconds,
      ...(cut ? { captions_paused_seconds: seconds - counted, captions_unlocked: this.unlockedMs !== null } : {}),
      session_credits: Math.ceil(counted / SECONDS_PER_CREDIT),
      day_credits_used: Math.min(FREE_DAILY_CREDITS, Math.ceil(getTodayUsage() / SECONDS_PER_CREDIT)),
      is_plus: this.opts.isPlus(),
      ms_to_sheet: 0,
      ms_to_recorder: since(h.recorderAt),
      ms_to_socket: since(h.socketAt),
      ms_to_first_text: since(h.firstTextAt),
      ms_to_first_output: since(h.firstOutputAt),
      audio_chunks: h.chunks,
      mic_peak: h.peak,
      spoken_tokens: h.spokenTokens,
      output_tokens: h.outputTokens,
      reconnects: h.reconnects,
      stalls: h.stalls.size ? [...h.stalls].join(",") : undefined,
      loud_pct: h.levelChecks ? Math.round((h.loudChecks / h.levelChecks) * 100) : undefined,
      input: h.input,
      input_changes: h.inputChanges,
      gaps: this.gaps.length || undefined,
      audio_kept: this.audio.ok,
    };
  }

  private report(kind: string, extra: Record<string, unknown> = {}) {
    if (this.health.stalls.has(kind)) return;
    this.health.stalls.add(kind);
    const h = this.health;
    const since = (t?: number) => (t ? t - h.openedAt : undefined);
    recordError(kind, kind.replace(/_/g, " "), {
      mode: this.opts.mode, stage: this.snap.phase, online: navigator.onLine,
      ms_to_recorder: since(h.recorderAt), ms_to_socket: since(h.socketAt), ms_to_first_text: since(h.firstTextAt), ...extra,
    });
  }

  // Once a second: a step that should have happened and didn't.
  private check() {
    const h = this.health;
    const now = Date.now();
    if (this.ended || this.snap.phase === "paused") return;
    // Waiting on the browser's microphone prompt is normal for a while.
    if (!h.recorderAt && now - h.openedAt > 30_000) this.report("captions_start_stuck");
    if (h.keyAt && !this.wsReady && !h.socketAt && navigator.onLine && now - h.keyAt > 10_000 && this.snap.creditsOut !== "out") {
      this.report("captions_connect_timeout");
    }
    if (h.socketAt && !h.firstTextAt && h.chunksSinceSocket >= NO_TEXT_CHUNKS && h.peak >= SPEECH_PEAK) {
      this.report("captions_no_text", { peak: h.peak, chunks: h.chunks });
    }
    if (this.opts.mode === "translation" && h.outputTokens === 0 && h.spokenTokens >= TRANSLATION_SPOKEN_TOKENS) {
      this.report("translation_no_output", { spoken_tokens: h.spokenTokens });
    }
    // Near the speech service's 300 minutes: a fresh stream (app: renewLiveStream).
    if (this.wsReady && this.wsOpenedAt && now - this.wsOpenedAt > RENEW_AFTER_MS) {
      capture("captions_stream_renewed", { minutes: Math.round((now - this.wsOpenedAt) / 60000), forced: false });
      this.foldTails();
      this.dropSocket(true);
      this.connect();
    }
  }

  // ─── Credits ──────────────────────────────────────────────────────────────

  // Bought Plus during the session: captions come back at once, and the part
  // they missed is added on save (from the kept audio).
  plusChanged() {
    if (this.snap.creditsOut !== "out" || !this.opts.isPlus()) return;
    this.unlockedMs = this.recordedMs;
    capture("captions_unlocked", { mode: this.opts.mode, paused_seconds: Math.round((this.recordedMs - (this.creditsCutMs ?? 0)) / 1000) });
    this.emit({ creditsOut: "unlocked", lastMinute: false });
    this.connect();
    setTimeout(() => { if (this.snap.creditsOut === "unlocked") this.emit({ creditsOut: null }); }, 8000);
  }

  private countUsage() {
    if (this.opts.isPlus()) {
      if (this.snap.lastMinute) this.emit({ lastMinute: false });
      return;
    }
    this.usageAcc += 100;
    if (this.usageAcc < 1000) return;
    this.usageAcc -= 1000;
    addUsage(1);
    const left = freeSecondsLeft();
    if (left <= 0) this.pauseForCredits();
    else if (left <= 60 && !this.snap.lastMinute) {
      capture("daily_limit_warning", { mode: this.opts.mode });
      this.emit({ lastMinute: true });
    }
  }

  // The session goes on: the stream closes (nothing more billed), the timer
  // runs on, the audio is kept, and the sheet shows "Captions paused, still
  // recording".
  private pauseForCredits() {
    this.foldTails();
    this.dropSocket(true);
    this.queue = [];
    this.creditsCutMs = this.recordedMs;
    capture("captions_out_of_credits", { mode: this.opts.mode, seconds: Math.round(this.recordedMs / 1000) });
    capture("plus_button_shown", { where: "captions_paused", style: "gold" });
    this.emit({ creditsOut: "out", lastMinute: false, phase: "live" });
  }

  // ─── Audio ────────────────────────────────────────────────────────────────

  private onChunk(pcm: ArrayBuffer, peak: number) {
    if (this.ended || this.snap.phase === "paused" || this.snap.phase === "saving") return;
    const at = this.recordedMs;
    this.recordedMs += 100;
    this.audio.append(pcm);
    const h = this.health;
    h.chunks++;
    const level = Math.round(peak * 32767);
    if (level > h.peak) h.peak = level;
    if (h.chunks % 5 === 0) {
      h.levelChecks++;
      if (level >= SPEECH_PEAK) h.loudChecks++;
    }
    // Twenty seconds without a sound: the microphone may be off or muted.
    this.quietMs = peak < 0.002 ? this.quietMs + 100 : 0;
    const silent = this.quietMs >= 20_000;
    if (silent !== this.snap.silent) this.emit({ silent });
    if (this.snap.creditsOut === "out") {
      if (this.recordedMs % 1000 === 0) this.emit();
      return;
    }
    this.queue.push({ pcm, at });
    if (!this.wsReady && this.queue.length > MAX_BUFFER_CHUNKS) {
      // Older than the buffer: transcribed from the kept audio on save.
      const dropped = this.queue.shift()!;
      this.addGap(dropped.at, dropped.at + 100, "connection");
    }
    if (this.wsReady) {
      this.pump();
      this.countUsage();
    }
    if (this.recordedMs % 1000 === 0) this.emit();
  }

  private addGap(from: number, to: number, kind: Gap["kind"]) {
    const last = this.gaps[this.gaps.length - 1];
    if (last && last.kind === kind && from - last.to <= 100) last.to = Math.max(last.to, to);
    else this.gaps.push({ from, to, kind });
  }

  // Too much held to catch up live: everything but the last 3 s becomes a
  // gap, transcribed from the kept audio on save.
  private skipToRecent() {
    const keep = this.queue.slice(-RESEND_CHUNKS);
    const skipped = this.queue.slice(0, -RESEND_CHUNKS);
    if (skipped.length) this.addGap(skipped[0].at, skipped[skipped.length - 1].at + 100, "connection");
    this.queue = keep;
  }

  // Live: each chunk goes straight out. After a gap: what was held goes out
  // at twice real time, so captions catch up without flooding the stream.
  private pump() {
    if (this.pacer) return;
    if (this.queue.length <= 10) {
      this.flushQueueNow();
      return;
    }
    this.pacer = setInterval(() => {
      if (!this.wsReady || !this.ws) return;
      const next = this.queue.shift();
      if (next) this.sendChunk(next);
      if (this.queue.length <= 1) {
        if (this.pacer) clearInterval(this.pacer);
        this.pacer = null;
        this.flushQueueNow();
      }
    }, 50);
  }

  private flushQueueNow() {
    if (!this.ws || !this.wsReady) return;
    while (this.queue.length) this.sendChunk(this.queue.shift()!);
  }

  private sendChunk(item: Queued) {
    try {
      this.ws!.send(item.pcm);
      this.health.chunksSinceSocket++;
    } catch {
      this.queue.unshift(item);
    }
  }

  // ─── The stream ───────────────────────────────────────────────────────────

  private isPaused() {
    return this.snap.phase === "paused";
  }

  private secondsOpen() {
    return this.wsOpenedAt ? Math.round((Date.now() - this.wsOpenedAt) / 1000) : -1;
  }

  private async connect() {
    if (this.ended || this.ws || this.connecting || this.isPaused() || this.snap.creditsOut === "out") return;
    if (this.reconnectTimer) { clearTimeout(this.reconnectTimer); this.reconnectTimer = null; }
    if (!navigator.onLine) { this.markLost(); return; }
    const opts = this.opts;
    let key: string;
    this.connecting = true;
    this.health.keyAt ??= Date.now();
    try {
      key = (await api<{ api_key: string }>("/api/app/soniox-key", {})).api_key;
    } catch (e) {
      recordError("live_key", e, { mode: opts.mode, online: navigator.onLine });
      this.connecting = false;
      this.markLost();
      return;
    }
    this.connecting = false;
    if (this.ended || this.ws || this.isPaused()) return;
    const ws = new WebSocket(WS_URL, ["soniox-api-key", key]);
    ws.binaryType = "arraybuffer";
    this.ws = ws;
    this.wsReady = false;
    this.atSeam = true;
    ws.onopen = () => {
      if (this.ws !== ws) return;
      const config: Record<string, unknown> = { model: SONIOX_RT_MODEL, audio_format: "pcm_s16le", sample_rate: 16000, num_channels: 1 };
      // Endpointing finalizes words early and costs speaker separation, so
      // it's only on when speakers aren't separated.
      if (opts.diarize) config.enable_speaker_diarization = true;
      else config.enable_endpoint_detection = true;
      config.enable_language_identification = true;
      const t = opts.translate;
      if (opts.mode === "translation" && t) {
        // Both sides the same language (an older saved choice): one way.
        config.translation = t.source && t.source !== t.target
          ? { type: "two_way", language_a: t.source, language_b: t.target }
          : { type: "one_way", target_language: t.target };
      }
      const hints = [...opts.languageHints];
      if (t?.source) for (const c of [t.source, t.target]) if (!hints.includes(c)) hints.push(c);
      if (hints.length) config.language_hints = hints;
      if (opts.context) config.context = { text: opts.context };
      ws.send(JSON.stringify(config));
      // Too much held to catch up: the old part goes to the save instead.
      if (this.queue.length > CATCHUP_MAX_CHUNKS) this.skipToRecent();
      // This stream's audio starts at the first chunk it gets.
      this.streamOffset = this.queue[0]?.at ?? this.recordedMs;
      this.wsReady = true;
      this.wsOpenedAt = Date.now();
      this.health.socketAt ??= Date.now();
      this.health.chunksSinceSocket = 0;
      this.attempts = 0;
      this.emit({ phase: "live", reconnectFailed: false });
      this.pump();
    };
    ws.onmessage = ({ data }) => {
      // A stream already dropped (pause, reconnect, credits) can still send a
      // message or two; its grey words were folded in, so they'd show twice.
      if (this.ws !== ws) return;
      let res: { tokens?: SonioxToken[]; error_type?: string; error_message?: string; finished?: boolean; request_id?: string };
      try {
        res = JSON.parse(String(data));
      } catch (e) {
        recordErrorOnce("captions_ws_message", e);
        return;
      }
      if (res.error_type) {
        recordError("soniox_api", res.error_message ?? res.error_type, {
          error_type: res.error_type, request_id: res.request_id, seconds_open: this.secondsOpen(), mode: this.opts.mode,
        });
        this.foldTails();
        this.dropSocket(false);
        if (res.error_type === "max_duration_reached") {
          capture("captions_stream_renewed", { minutes: Math.round(this.secondsOpen() / 60), forced: true });
          this.connect();
        } else {
          this.markLost();
        }
        return;
      }
      if (res.tokens?.length) this.onTokens(res.tokens);
      if (res.finished) {
        // Everything is final now: nothing grey left to keep.
        this.greyTokens = [];
        this.captions.tail = [];
        this.top.tail = [];
        this.bottom.tail = [];
        this.finishedResolve?.();
        this.finishedResolve = null;
      }
    };
    ws.onclose = ev => {
      if (this.ws !== ws) return;
      // Closed without an error frame (network, sleep): reconnect.
      recordError("captions_ws_closed", ev.reason || `closed ${ev.code}`, { code: ev.code, seconds_open: this.secondsOpen(), mode: this.opts.mode });
      this.foldTails();
      this.dropSocket(false);
      this.markLost();
    };
  }

  private dropSocket(graceful: boolean) {
    const ws = this.ws;
    this.ws = null;
    this.wsReady = false;
    this.wsOpenedAt = 0;
    if (this.pacer) { clearInterval(this.pacer); this.pacer = null; }
    if (!ws) return;
    try {
      if (graceful && ws.readyState === WebSocket.OPEN) ws.send("");
      setTimeout(() => { try { ws.close(); } catch { /* gone */ } }, graceful ? 1500 : 0);
    } catch {
      // Already closed.
    }
  }

  private markLost() {
    if (this.ended || this.snap.phase === "paused" || this.snap.creditsOut === "out") return;
    this.health.reconnects++;
    this.emit({ phase: "lost" });
    if (!navigator.onLine) return; // the 'online' event reconnects
    const delay = BACKOFF[Math.min(this.attempts, BACKOFF.length - 1)];
    this.attempts++;
    if (this.attempts === 6) {
      recordError("captions_reconnect_failed", "no connection after 6 tries", { mode: this.opts.mode });
      this.emit({ reconnectFailed: true });
    }
    this.reconnectTimer = setTimeout(() => this.connect(), delay);
  }

  private onOnline() {
    if (this.snap.phase === "lost") {
      this.attempts = 0;
      this.connect();
    }
  }

  private onOffline() {
    if (this.ws) {
      this.foldTails();
      this.dropSocket(false);
    }
    this.markLost();
  }

  // ─── Words ────────────────────────────────────────────────────────────────

  private onTokens(tokens: SonioxToken[]) {
    const offset = this.streamOffset;
    const t = this.opts.translate;
    const translating = this.opts.mode === "translation" && !!t;
    // A stream's first word after a pause or a reconnect gets its space.
    if (this.atSeam) {
      const first = tokens.find(tk => tk.text && tk.text !== "<end>");
      if (first && !/^\s/.test(first.text)) {
        const before = translating ? (this.top.segs[this.top.segs.length - 1]?.text ?? "") : (this.captions.segs[this.captions.segs.length - 1]?.text ?? "");
        if (before && !/\s$/.test(before)) first.text = ` ${first.text}`;
      }
      if (tokens.some(tk => tk.is_final)) this.atSeam = false;
    }
    this.greyTokens = [];
    const nfCaptions: Line[] = [];
    const nfTop: Line[] = [];
    const nfBottom: Line[] = [];
    let detected: string | null = this.snap.detected;
    let spokenFinal = 0;
    let outputFinal = 0;
    let anyText = false;
    for (const tk of tokens) {
      if (!tk.text || tk.text === "<end>") continue;
      if (tk.text.trim()) anyText = true;
      const token: SonioxToken = {
        ...tk,
        start_ms: tk.start_ms != null ? tk.start_ms + offset : undefined,
        end_ms: tk.end_ms != null ? tk.end_ms + offset : undefined,
      };
      const spoken = token.translation_status !== "translation";
      if (spoken && token.speaker) this.lastSpokenSpeaker = token.speaker;
      const speaker = this.opts.diarize ? (spoken ? (token.speaker ?? "") : this.lastSpokenSpeaker) : "";
      if (token.is_final) {
        this.finalTokens.push(token);
        if (spoken) spokenFinal++;
      } else this.greyTokens.push(token);
      if (!translating) {
        if (token.is_final) { appendLine(this.captions.segs, speaker, token.text, token.language); outputFinal++; }
        else nfCaptions.push({ speaker, text: token.text, language: token.language });
        continue;
      }
      if (spoken && token.language && !t!.source) detected = token.language;
      // Which pane: one-way = what was said on top, the translation below
      // (speech already in the target language goes below too, or English
      // speakers translating into English would see nothing); two-way = each
      // language in its own pane.
      const toTop = t!.source
        ? token.language !== t!.target
        : spoken && token.translation_status !== "none";
      const toBottom = t!.source ? token.language === t!.target : !spoken || token.translation_status === "none";
      if (toTop) {
        if (token.is_final) appendLine(this.top.segs, speaker, token.text, token.language);
        else nfTop.push({ speaker, text: token.text, language: token.language });
      }
      if (toBottom) {
        if (token.is_final) { appendLine(this.bottom.segs, speaker, token.text, token.language); outputFinal++; }
        else nfBottom.push({ speaker, text: token.text, language: token.language });
      }
    }
    const h = this.health;
    if (anyText) h.firstTextAt ??= Date.now();
    if (outputFinal > 0) h.firstOutputAt ??= Date.now();
    h.spokenTokens += spokenFinal;
    h.outputTokens += outputFinal;
    this.captions.tail = tailLines(nfCaptions);
    this.top.tail = tailLines(nfTop);
    this.bottom.tail = tailLines(nfBottom);
    this.emit({ detected });
  }

  // Grey words when a stream ends (pause, reconnect, stop) count as said.
  private foldTails() {
    this.finalTokens.push(...this.greyTokens);
    this.greyTokens = [];
    for (const [pane] of [[this.captions], [this.top], [this.bottom]] as const) {
      for (const l of pane.tail) appendLine(pane.segs, l.speaker, l.text, l.language);
      pane.tail = [];
    }
  }

  // ─── Draft (a closed tab still saves the session next time) ─────────────────

  private saveDraft() {
    if (!this.finalTokens.length) return;
    store.set(DRAFT_KEY, {
      mode: this.opts.mode, diarize: this.opts.diarize, translate: this.opts.translate, folderId: this.opts.folderId,
      tokens: this.finalTokens.map(tk => ({
        ...tk,
        start_ms: tk.start_ms != null ? tk.start_ms - this.partStartMs : undefined,
        end_ms: tk.end_ms != null ? tk.end_ms - this.partStartMs : undefined,
      })),
      seconds: Math.round((this.recordedMs - this.partStartMs) / 1000), startedAt: this.startedAt + this.partStartMs,
    } satisfies LiveDraft);
  }
}

export type LiveDraft = {
  mode: LiveMode; diarize: boolean; translate: Translate | null; folderId?: string | null;
  tokens: SonioxToken[]; segments?: TranscriptSegment[]; seconds: number; startedAt: number;
};

// A session the tab closed on: its lines, if it's worth keeping (a minute or
// more with words, as a swipe-down would have saved it). A short or empty one
// is dropped and reported (app: capture_recovered result 'empty').
export function takeLiveDraft(): { draft: LiveDraft; segments: TranscriptSegment[] } | null {
  const draft = store.get<LiveDraft | null>(DRAFT_KEY, null);
  store.remove(DRAFT_KEY);
  if (!draft) return null;
  const segments = draft.segments?.length
    ? draft.segments
    : !draft.tokens?.length
      ? []
      : draft.mode === "translation"
        ? buildTranslationSegments(draft.tokens, draft.diarize)
        : buildTimedSegments(draft.tokens, draft.diarize);
  if (!segments.length || draft.seconds < 60) {
    capture("capture_recovered", {
      result: "empty", mode: draft.mode, seconds: draft.seconds, audio_parts: 0, had_text: segments.length > 0,
      minutes_since: Math.round((Date.now() - draft.startedAt - draft.seconds * 1000) / 60000),
    });
    return null;
  }
  return { draft, segments };
}
