import { capture, getSupabase, isPreview, recordError } from "./client";
import { loadRecordingBody, updateRecording, type TranscriptSegment, type TranscriptWord } from "./data";
import { getExtras, getLocal, patchLocal, setExtras } from "./local";
import { isPlusNow } from "./plus";
import { removeSessionAudio, sessionWav } from "./sessionAudio";
import { buildTimedSegments, buildTranslationSegments } from "./transcript";
import { transcribeBlob, type TranscribeOptions } from "./upload";
import { addUsage } from "./usage";
import type { LiveMode, Translate } from "./live";

// The parts of a live session the live captions never covered (app repo:
// HomeScreen sessionJobs / restJob, CLAUDE.md "Live captions or translation
// that run out of credits"): the session's audio is kept (sessionAudio.ts),
// and these ranges go through the async transcription with the session's
// settings (translation too), their lines merged in by time.
//   credits: captions stopped at the free credits. Saved on the free plan, the
//     recording says "Captions stopped at M:SS … N more minutes are
//     recorded." + Unlock with Plus (RecordingNotes); with Plus it's added.
//   connection: the connection was down longer than the live stream could
//     catch up; added on save for everyone.

export type Gap = { from: number; to: number; kind: "credits" | "connection" };

export type LiveRest = {
  audioId: string;
  // Where this recording starts in the session's audio (an hourly part > 0).
  audioOffset: number;
  gaps: Gap[];
  mode: LiveMode;
  diarize: boolean;
  languageHints: string[];
  context: string;
  translate: Translate | null;
  cutAt: number | null;
  seconds: number;
};

const EXTRAS_KEY = "liveRest";
// Under the server's 4 MB for one request: 120 s of 16 kHz mono WAV is 3.84 MB.
const PART_SECONDS = 120;

const running = new Set<string>();

export function getLiveRest(id: string): LiveRest | null {
  return getExtras<LiveRest | null>(id, EXTRAS_KEY, null);
}

export function setLiveRest(id: string, rest: LiveRest | null) {
  setExtras(id, EXTRAS_KEY, rest);
}

export function isAddingRest(id: string): boolean {
  return running.has(id);
}

function shiftWords(words: TranscriptWord[] | undefined, ms: number): TranscriptWord[] | undefined {
  return words?.map(w => ({ ...w, s: w.s + ms, e: w.e + ms }));
}

function firstMs(seg: TranscriptSegment): number {
  return (seg.original ?? seg).words?.[0]?.s ?? Number.NaN;
}

// The gap's lines put where they happened: before the first live line that
// starts after the gap began (lines without times stay in order).
export function mergeSegments(live: TranscriptSegment[], gapLines: TranscriptSegment[], gapFromMs: number): TranscriptSegment[] {
  const at = live.findIndex(seg => firstMs(seg) >= gapFromMs);
  return at < 0 ? [...live, ...gapLines] : [...live.slice(0, at), ...gapLines, ...live.slice(at)];
}

async function tokensFor(rest: LiveRest, gap: Gap) {
  const opts: TranscribeOptions = {
    diarize: rest.diarize,
    languageHints: rest.languageHints,
    context: rest.context || undefined,
    translation: rest.mode === "translation" && rest.translate
      ? rest.translate.source && rest.translate.source !== rest.translate.target
        ? { type: "two_way", language_a: rest.translate.source, language_b: rest.translate.target }
        : { type: "one_way", target_language: rest.translate.target }
      : undefined,
  };
  const from = rest.audioOffset + gap.from;
  const to = rest.audioOffset + gap.to;
  const whole = await sessionWav(rest.audioId, from, to);
  if (!whole) throw new Error("missing_file: the session's audio is no longer in this browser");
  try {
    // One piece when it fits (or Storage takes it): one set of speakers.
    return [{ offset: 0, tokens: await transcribeBlob(whole, opts, "session.wav") }];
  } catch (e) {
    if (whole.size <= 4 * 1024 * 1024) throw e;
    // No Storage for big files: 2-minute pieces put back on one timeline.
    const pieces = [];
    for (let s = from; s < to; s += PART_SECONDS) {
      const part = await sessionWav(rest.audioId, s, Math.min(to, s + PART_SECONDS));
      if (part) pieces.push({ offset: (s - from) * 1000, tokens: await transcribeBlob(part, opts, "session.wav") });
    }
    return pieces;
  }
}

// The lines for the given gaps, merged into `segments`.
export async function addGaps(rest: LiveRest, segments: TranscriptSegment[], gaps: Gap[]): Promise<TranscriptSegment[]> {
  let out = segments;
  for (const gap of gaps) {
    const pieces = await tokensFor(rest, gap);
    const gapMs = gap.from * 1000;
    const lines: TranscriptSegment[] = [];
    for (const { offset, tokens } of pieces) {
      const built = rest.mode === "translation" ? buildTranslationSegments(tokens, rest.diarize) : buildTimedSegments(tokens, rest.diarize);
      for (const seg of built) {
        lines.push({
          ...seg,
          words: shiftWords(seg.words, gapMs + offset),
          ...(seg.original ? { original: { ...seg.original, words: shiftWords(seg.original.words, gapMs + offset) } } : {}),
        });
      }
    }
    out = mergeSegments(out, lines, gapMs);
  }
  return out;
}

// A saved recording's missing parts: its lines from the account (or this
// browser), the gaps added, saved back. The credits part only with Plus (it
// stays, with its audio, for "Unlock with Plus"); connection gaps for
// everyone. Returns whether anything was added.
export async function addRestToRecording(id: string): Promise<boolean> {
  const rest = getLiveRest(id);
  if (!rest || running.has(id)) return false;
  const now = rest.gaps.filter(g => g.kind === "connection" || isPlusNow());
  const later = rest.gaps.filter(g => !now.includes(g));
  if (!now.length) return false;
  running.add(id);
  window.dispatchEvent(new CustomEvent("captio-recording-changed", { detail: { id } }));
  const seconds = Math.round(now.reduce((n, g) => n + (g.to - g.from), 0));
  try {
    const local = getLocal(id);
    const body = local?.body ?? (isPreview() ? null : await loadRecordingBody(getSupabase(), id));
    if (!body) throw new Error("recording_missing");
    const segments = await addGaps(rest, body.segments, now);
    if (local) patchLocal(id, { body: { ...body, segments } });
    else await updateRecording(getSupabase(), id, { segments });
    if (!isPlusNow()) addUsage(seconds);
    if (later.length) setLiveRest(id, { ...rest, gaps: later });
    else {
      setLiveRest(id, null);
      void removeSessionAudio(rest.audioId);
    }
    capture("transcribe_rest_done", { live: true, seconds, kinds: [...new Set(now.map(g => g.kind))].join(",") });
    return true;
  } catch (e) {
    recordError("live_rest", e, { gaps: now.length, seconds });
    throw e;
  } finally {
    running.delete(id);
    window.dispatchEvent(new CustomEvent("captio-recording-changed", { detail: { id } }));
  }
}

// A recording deleted or no longer needing its audio.
export function dropLiveRest(id: string) {
  const rest = getLiveRest(id);
  if (!rest) return;
  setLiveRest(id, null);
  void removeSessionAudio(rest.audioId);
}
