import type { TranscriptSegment, TranscriptWord } from "./data";

// Turning the speech service's tokens into a recording's lines, the app's own
// rules (app repo: src/lib/shared.ts): paragraphs, speakers, languages,
// translation pairs, and where the free credits cut a file.

export const SONIOX_RT_MODEL = "stt-rt-v6";
export const SONIOX_ASYNC_MODEL = "stt-async-v6";

export type SonioxToken = {
  text: string;
  is_final?: boolean;
  speaker?: string;
  language?: string;
  translation_status?: "none" | "original" | "translation";
  start_ms?: number;
  end_ms?: number;
  confidence?: number;
};

// Long turns become paragraphs: the first sentence end past 600 characters,
// any new word past 2,400. Same speaker and language, so no new tag shows.
const PARAGRAPH_CHARS = 600;
const PARAGRAPH_MAX_CHARS = 2400;
export const SENTENCE_END = /[.!?…。！？؟]["'”’»)\]]*\s*$/;
const FULL_WIDTH_END = /[。！？]["'”’»)\]]*$/;

export function startsParagraph(turnText: string, tokenText: string): boolean {
  if (turnText.length < PARAGRAPH_CHARS) return false;
  const newWord = /^\s/.test(tokenText) || FULL_WIDTH_END.test(turnText);
  if (!newWord) return false;
  return SENTENCE_END.test(turnText) || turnText.length >= PARAGRAPH_MAX_CHARS;
}

function minConfidence(a?: number, b?: number): number | undefined {
  if (a === undefined) return b;
  if (b === undefined) return a;
  return Math.min(a, b);
}

// Speaker lines with each word's timing; a new line where the speaker or the
// spoken language changes, or a paragraph ends.
export function buildTimedSegments(tokens: SonioxToken[], separateSpeakers: boolean): TranscriptSegment[] {
  const segs: TranscriptSegment[] = [];
  for (const token of tokens) {
    if (!token.text || token.text === "<end>") continue;
    const spk = separateSpeakers ? (token.speaker ?? "") : "";
    const word: TranscriptWord = { t: token.text, s: token.start_ms ?? 0, e: token.end_ms ?? 0, c: token.confidence };
    const last = segs[segs.length - 1];
    const newLanguage = !!token.language && !!last?.language && token.language !== last.language && token.text.startsWith(" ");
    if (!last || last.speaker !== spk || newLanguage || startsParagraph(last.text, token.text)) {
      const language = token.language ?? (last?.speaker === spk ? last.language : undefined);
      segs.push({ speaker: spk, text: token.text.trimStart(), words: [word], ...(language ? { language } : {}) });
    } else {
      if (!last.language && token.language) last.language = token.language;
      last.text += token.text;
      if (last.words) {
        if (token.text.startsWith(" ") || last.words.length === 0) last.words.push(word);
        else {
          const lw = last.words[last.words.length - 1];
          lw.t += token.text;
          lw.e = word.e;
          lw.c = minConfidence(lw.c, word.c);
        }
      }
    }
  }
  return segs;
}

// Translation recordings: pairs of what was said and its translation, to the
// end of a sentence or a speaker change.
export function buildTranslationSegments(tokens: SonioxToken[], diarize: boolean): TranscriptSegment[] {
  type Pair = { speaker: string; translated: boolean; spoken: { text: string; language?: string; words: TranscriptWord[] }; translation: string; translationLanguage?: string };
  const pairs: Pair[] = [];
  let cur: Pair | null = null;
  let lastTranslated: Pair | null = null;
  for (const token of tokens) {
    if (!token.text || token.text === "<end>") continue;
    if (token.translation_status === "translation") {
      if (!lastTranslated) continue;
      lastTranslated.translation += token.text;
      if (token.language) lastTranslated.translationLanguage = token.language;
      continue;
    }
    const translated = token.translation_status === "original";
    const speaker: string = diarize ? (token.speaker ?? cur?.speaker ?? "") : "";
    if (!cur || cur.translated !== translated || cur.speaker !== speaker
        || (cur.translation.length > 0 && SENTENCE_END.test(cur.spoken.text))
        || (!cur.translated && startsParagraph(cur.spoken.text, token.text))) {
      cur = { speaker, translated, spoken: { text: "", language: token.language, words: [] }, translation: "" };
      pairs.push(cur);
    }
    if (translated) lastTranslated = cur;
    const sp = cur.spoken;
    const text = sp.text.length === 0 ? token.text.trimStart() : token.text;
    const word: TranscriptWord = { t: text, s: token.start_ms ?? 0, e: token.end_ms ?? 0, c: token.confidence };
    const lw = sp.words[sp.words.length - 1];
    if (!lw || text.startsWith(" ")) sp.words.push(word);
    else {
      lw.t += text;
      lw.e = word.e;
      lw.c = minConfidence(lw.c, word.c);
    }
    sp.text += text;
    if (!sp.language && token.language) sp.language = token.language;
  }
  return pairs.filter(p => p.spoken.text.trim()).map(p => {
    const translation = p.translation.trim();
    return p.translated && translation
      ? { speaker: p.speaker, text: translation, language: p.translationLanguage, original: p.spoken }
      : { speaker: p.speaker, text: p.spoken.text, language: p.spoken.language, words: p.spoken.words };
  });
}

// What a translation recording says in the target language (title, search).
export function translationTranscript(segments: TranscriptSegment[], targetLanguage?: string): string {
  return segments
    .map(s => (s.original && targetLanguage && s.original.language === targetLanguage ? s.original.text : s.text).trim())
    .filter(Boolean)
    .join(" ");
}

// Free credits ran out partway through a file: keep what was said in its
// first `seconds`, in whole words; a translation pair is kept whole.
export function cutSegmentsAt(segments: TranscriptSegment[], seconds: number): TranscriptSegment[] {
  const endMs = seconds * 1000;
  const kept: TranscriptSegment[] = [];
  for (const seg of segments) {
    const words = (seg.original ?? seg).words;
    if (!words?.length || words[0].s >= endMs) break;
    if (seg.original || words[words.length - 1].s < endMs) { kept.push(seg); continue; }
    const inTime = words.filter(w => w.s < endMs);
    kept.push({ ...seg, text: inTime.map(w => w.t).join("").trimStart(), words: inTime });
    break;
  }
  return kept;
}

// The context sent with every session, as the app builds it
// (HomeScreen sessionContextText).
export function contextText(words: string[], background: string): string {
  return [words.length > 0 ? `Vocabulary: ${words.join(", ")}` : "", background.trim()].filter(Boolean).join("\n");
}

// ─── For analytics (app: shared.ts confidenceStats, recordingShapeStats) ──────
// Never a recording's words: only how sure the service was and its shape.

export const SHAKY_CONFIDENCE = 0.5;

export function confidenceStats(segments: TranscriptSegment[]): { confidence_avg: number | undefined; shaky_words: number; words: number } {
  let sum = 0, scored = 0, shaky = 0, words = 0;
  for (const seg of segments) {
    for (const w of (seg.original ?? seg).words ?? []) {
      words++;
      if (w.c == null) continue;
      scored++;
      sum += w.c;
      if (w.c < SHAKY_CONFIDENCE) shaky++;
    }
  }
  return { confidence_avg: scored ? Math.round((sum / scored) * 100) / 100 : undefined, shaky_words: shaky, words };
}

export function recordingShapeStats(segments: TranscriptSegment[], durationSeconds: number) {
  const talkMs = new Map<string, number>();
  const languageWords = new Map<string, number>();
  const words: TranscriptWord[] = [];
  let turns = 0, lastSpeaker = "";
  for (const seg of segments) {
    const spoken = seg.original ?? seg;
    const ws = spoken.words ?? [];
    const language = spoken.language ?? seg.language;
    if (language) languageWords.set(language, (languageWords.get(language) ?? 0) + Math.max(1, ws.length));
    if (seg.speaker) {
      if (seg.speaker !== lastSpeaker) { turns++; lastSpeaker = seg.speaker; }
      const ms = ws.reduce((sum, w) => sum + Math.max(0, w.e - w.s), 0);
      talkMs.set(seg.speaker, (talkMs.get(seg.speaker) ?? 0) + ms);
    }
    words.push(...ws);
  }
  words.sort((a, b) => a.s - b.s);
  let speechMs = 0, pauses5 = 0, pauses30 = 0, longestMs = 0;
  for (let i = 0; i < words.length; i++) {
    speechMs += Math.max(0, words[i].e - words[i].s);
    if (i === 0) continue;
    const gap = words[i].s - words[i - 1].e;
    if (gap >= 5000) pauses5++;
    if (gap >= 30000) pauses30++;
    longestMs = Math.max(longestMs, gap);
  }
  const timed = words.length > 0 && durationSeconds > 0;
  const totalTalk = [...talkMs.values()].reduce((a, b) => a + b, 0);
  const languages = [...languageWords.entries()].sort((a, b) => b[1] - a[1]).map(([code]) => code);
  const round2 = (x: number) => Math.round(x * 100) / 100;
  return {
    speakers: talkMs.size || undefined,
    speaker_changes: talkMs.size ? Math.max(0, turns - 1) : undefined,
    main_speaker_share: talkMs.size && totalTalk ? round2(Math.max(...talkMs.values()) / totalTalk) : undefined,
    speech_ratio: timed ? round2(Math.min(1, speechMs / 1000 / durationSeconds)) : undefined,
    words_per_minute: timed ? Math.round(words.length / (durationSeconds / 60)) : undefined,
    pauses_5s: timed ? pauses5 : undefined,
    pauses_30s: timed ? pauses30 : undefined,
    longest_pause_seconds: timed ? Math.round(longestMs / 1000) : undefined,
    language: languages[0],
    languages: languages.length ? [...languages].sort().join(",") : undefined,
    languages_count: languages.length,
  };
}
