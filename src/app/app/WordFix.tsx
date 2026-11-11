"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { capture, store } from "./client";
import type { TranscriptSegment, TranscriptWord } from "./data";
import { SHAKY_CONFIDENCE } from "./transcript";
import { Button, ModalCard, showCard } from "./ui";
import { t } from "./i18n";

// Shaky words and the word fix (app repo: DetailScreen SegmentLine,
// components/WordFixPrompt.tsx, lib/wordFixHint.ts): a word the speech service
// wasn't sure of gets a thin light-red wave; a long-press (or a double-click
// on a computer) on any word asks for the right one, which replaces every
// whole-word match in the recording and can be added to Words & names. New
// users get a small red bubble under a recording's first shaky word, on 3
// recordings at most, never again once they've fixed a word.

const LONG_PRESS_MS = 450;

// ─── The hint ─────────────────────────────────────────────────────────────────

const HINT_KEY = "captio_word_fix_hint";
const MAX_SHOWS = 3;
type HintState = { shown: string[]; learned: boolean };
const readHint = () => store.get<HintState>(HINT_KEY, { shown: [], learned: false });

export function useWordFixHint(recordingId: string, enabled: boolean) {
  const [visible, setVisible] = useState(() => {
    const s = readHint();
    return enabled && !s.learned && !s.shown.includes(recordingId) && s.shown.length < MAX_SHOWS;
  });
  // The bubble's word came on screen: this recording has had its hint.
  const seen = useCallback(() => {
    const s = readHint();
    if (s.learned || s.shown.includes(recordingId)) return;
    store.set(HINT_KEY, { ...s, shown: [...s.shown, recordingId] });
    capture("word_fix_hint_shown", { nth: s.shown.length });
  }, [recordingId]);
  // A word was fixed: the hint has done its job, everywhere.
  const learned = useCallback(() => {
    setVisible(false);
    const s = readHint();
    if (!s.learned) store.set(HINT_KEY, { ...s, learned: true });
  }, []);
  const dismiss = useCallback(() => setVisible(false), []);
  return { visible, seen, learned, dismiss };
}

function HintBubble({ onSeen, onDismiss }: { onSeen: () => void; onDismiss: () => void }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [shown, setShown] = useState(false);
  const touch = typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches;
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let timer: ReturnType<typeof setTimeout> | null = null;
    const io = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting || timer) return;
      onSeen();
      setTimeout(() => setShown(true), 400);
      // Stays 5 s, then fades out.
      timer = setTimeout(() => { setShown(false); setTimeout(onDismiss, 250); }, 5400);
      io.disconnect();
    }, { threshold: 1 });
    io.observe(el);
    return () => { io.disconnect(); if (timer) clearTimeout(timer); };
  }, [onSeen, onDismiss]);
  return (
    <span
      ref={ref}
      className={`rv-hint${shown ? " shown" : ""}`}
      role="button"
      tabIndex={-1}
      onClick={e => { e.stopPropagation(); onDismiss(); }}
    >
      {touch ? t("wordFix.hint") : t("web.wordFix.hintDoubleClick")}
    </span>
  );
}

// ─── A line's words ───────────────────────────────────────────────────────────

export type WordTarget = { text: string; c?: number };

// The text as its words when they add up to it (old rows, fixed text and
// translations show as plain text), so each can be pressed and the shaky
// ones get their wave.
export function WordText({ text, words, onWord, hint }: {
  text: string;
  words?: TranscriptWord[];
  onWord?: (w: WordTarget) => void;
  hint?: { wordIndex: number; onSeen: () => void; onDismiss: () => void } | null;
}) {
  const press = useRef<{ timer: ReturnType<typeof setTimeout>; x: number; y: number } | null>(null);
  if (!words?.length || words.map(w => w.t).join("").trim() !== text.trim()) return <>{text}</>;
  const open = (w: TranscriptWord) => {
    const clean = w.t.trim().replace(/^[\p{P}]+|[\p{P}]+$/gu, "");
    if (clean && onWord) onWord({ text: clean, c: w.c });
  };
  const cancel = () => {
    if (press.current) clearTimeout(press.current.timer);
    press.current = null;
  };
  return (
    <>
      {words.map((w, i) => {
        const lead = i === 0 ? w.t.trimStart() : w.t;
        const space = lead.match(/^\s+/)?.[0] ?? "";
        const word = lead.slice(space.length);
        const shaky = w.c != null && w.c < SHAKY_CONFIDENCE;
        return (
          <span key={i}>
            {space}
            <span
              className={`rv-word${shaky ? " shaky" : ""}${onWord ? " fixable" : ""}`}
              onDoubleClick={onWord ? e => { e.preventDefault(); window.getSelection()?.removeAllRanges(); open(w); } : undefined}
              onPointerDown={onWord ? e => {
                if (e.pointerType === "mouse") return;
                cancel();
                press.current = { x: e.clientX, y: e.clientY, timer: setTimeout(() => { press.current = null; open(w); }, LONG_PRESS_MS) };
              } : undefined}
              onPointerMove={e => { if (press.current && Math.hypot(e.clientX - press.current.x, e.clientY - press.current.y) > 8) cancel(); }}
              onPointerUp={cancel}
              onPointerCancel={cancel}
              onContextMenu={onWord ? e => { if (window.matchMedia("(pointer: coarse)").matches) e.preventDefault(); } : undefined}
            >
              {word}
              {hint && hint.wordIndex === i && <HintBubble onSeen={hint.onSeen} onDismiss={hint.onDismiss} />}
            </span>
          </span>
        );
      })}
    </>
  );
}

// The first shaky word of a recording: [segment, word] for the hint.
export function firstShaky(segments: TranscriptSegment[]): { seg: number; word: number } | null {
  for (let s = 0; s < segments.length; s++) {
    const seg = segments[s];
    const words = seg.original ? undefined : seg.words;
    if (!words?.length || words.map(w => w.t).join("").trim() !== seg.text.trim()) continue;
    const word = words.findIndex(w => w.c != null && w.c < SHAKY_CONFIDENCE);
    if (word >= 0) return { seg: s, word };
  }
  return null;
}

// ─── The fix ──────────────────────────────────────────────────────────────────

// Every whole-word match of `from` (any case) in what was said and its timed
// words, the shaky mark cleared. Returns the new lines and how many matches
// were replaced in the text (the count the app reports).
export function applyWordFix(segments: TranscriptSegment[], from: string, corrected: string): { segments: TranscriptSegment[]; occurrences: number } {
  const escaped = from.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const whole = new RegExp(`(^|[^\\p{L}\\p{N}])(${escaped})(?![\\p{L}\\p{N}])`, "giu");
  let occurrences = 0;
  const swap = (s: string, count = false) => s.replace(whole, (_m, before: string) => { if (count) occurrences++; return `${before}${corrected}`; });
  const fixWords = (words?: TranscriptWord[]) => words?.map(w => {
    whole.lastIndex = 0;
    if (!whole.test(w.t)) { whole.lastIndex = 0; return w; }
    whole.lastIndex = 0;
    return { t: swap(w.t), s: w.s, e: w.e };
  });
  // What was said: the line itself, or a translation's original.
  const next = segments.map(seg => {
    const spoken = seg.original ?? seg;
    const text = swap(spoken.text, true);
    const words = fixWords(spoken.words);
    return seg.original
      ? { ...seg, original: { ...seg.original, text, ...(words ? { words } : {}) } }
      : { ...seg, text, ...(words ? { words } : {}) };
  });
  return { segments: next, occurrences };
}

// "✏️ Fix this word": the word selected in a field, "Add to context" ticked,
// Cancel / Save. Resolves to the answer, or null.
let asking = false;
export function askWordFix(word: string): Promise<{ corrected: string; addToVocabulary: boolean } | null> {
  // One at a time (a double-click and a long-press can both land).
  if (asking) return Promise.resolve(null);
  asking = true;
  return new Promise(resolve => {
    showCard(close => <WordFixCard word={word} done={answer => { asking = false; close(); resolve(answer); }} />);
  });
}

function WordFixCard({ word, done }: { word: string; done: (a: { corrected: string; addToVocabulary: boolean } | null) => void }) {
  const [value, setValue] = useState(word);
  const [add, setAdd] = useState(true);
  const corrected = value.trim();
  const canSave = corrected.length > 0 && corrected !== word;
  const save = () => { if (canSave) done({ corrected, addToVocabulary: add }); };
  return (
    <ModalCard title={`✏️ ${t("wordFix.title")}`} onClose={() => done(null)}>
      <input
        className="input rv-fix-input"
        value={value}
        autoFocus
        onFocus={e => e.currentTarget.select()}
        onChange={e => setValue(e.target.value)}
        onKeyDown={e => { if (e.key === "Enter") save(); }}
        placeholder={t("wordFix.placeholder")}
        maxLength={80}
        aria-label={t("wordFix.placeholder")}
        autoCapitalize="none"
        autoCorrect="off"
        spellCheck={false}
      />
      <button type="button" className="rv-option" role="checkbox" aria-checked={add} onClick={() => setAdd(a => !a)}>
        <span className={`rv-check${add ? " on" : ""}`} aria-hidden>
          {add && <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round"><path d="M5 12l5 5l10 -10" /></svg>}
        </span>
        <span>{t("wordFix.addToWords")}</span>
      </button>
      <div className="ui-card-actions" style={{ marginTop: 12 }}>
        <Button label={t("common.cancel")} variant="secondary" size="compact" onPress={() => done(null)} />
        <Button label={t("common.save")} size="compact" disabled={!canSave} onPress={save} />
      </div>
    </ModalCard>
  );
}
