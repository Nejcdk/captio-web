"use client";

import { useState } from "react";
import { capture, store } from "./client";
import { isPlusNow } from "./plus";
import { Button, ModalCard, QuietButton, showCard } from "./ui";
import { t } from "./i18n";

// "Everything good?" under a recording's captions (app repo:
// components/TranscriptVote.tsx): thumbs up or down, remembered per recording
// and changeable, each vote a `transcript_voted`. Down asks what went wrong
// (TranscriptFeedbackPrompt). Up has no follow-up here: the app's is Apple's
// review sheet.

type Vote = "up" | "down";

export function TranscriptVote({ recordingId, kind, durationSeconds }: {
  recordingId: string; kind: string; durationSeconds: number;
}) {
  const key = `captio_transcript_vote_${recordingId}`;
  const [vote, setVote] = useState<Vote | null>(() => store.get<Vote | null>(key, null));
  const [popped, setPopped] = useState<Vote | null>(null);

  const pick = (v: Vote) => {
    if (v === vote) return;
    capture("transcript_voted", { vote: v, changed: vote !== null, kind, duration_seconds: durationSeconds });
    setVote(v);
    setPopped(v);
    store.set(key, v);
    // Let the thumb's pop play first.
    if (v === "down") setTimeout(() => showTranscriptFeedback(kind, durationSeconds), 350);
  };

  return (
    <div className="rv-vote">
      <span>{vote ? t("detail.voteThanks") : t("detail.everythingGood")}</span>
      <Thumb dir="up" selected={vote === "up"} pop={popped === "up"} onPress={() => pick("up")} />
      <Thumb dir="down" selected={vote === "down"} pop={popped === "down"} onPress={() => pick("down")} />
    </div>
  );
}

function Thumb({ dir, selected, pop, onPress }: { dir: Vote; selected: boolean; pop: boolean; onPress: () => void }) {
  const hand = dir === "up"
    ? "M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H7V10l3.5-7.5a3.13 3.13 0 0 1 4.5 3.38Z"
    : "M9 18.12 10 14H4.17a2 2 0 0 1-1.92-2.56l2.33-8A2 2 0 0 1 6.5 2H17v12l-3.5 7.5A3.13 3.13 0 0 1 9 18.12Z";
  const cuff = dir === "up" ? "M7 10H4a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h3Z" : "M17 14h3a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2h-3Z";
  const color = selected ? "var(--brand)" : "#8E8E93";
  return (
    <button
      type="button"
      className={`rv-thumb${pop ? " pop" : ""}`}
      onClick={onPress}
      aria-label={dir === "up" ? t("detail.voteUp") : t("detail.voteDown")}
      aria-pressed={selected}
    >
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d={cuff} stroke={color} strokeWidth={1.9} fill={selected ? color : "none"} />
        <path d={hand} stroke={color} strokeWidth={1.9} fill={selected ? color : "none"} />
        {/* Filled, the cuff and hand would merge: a thin gap between them. */}
        {selected && <path d={dir === "up" ? "M7 11v10" : "M17 13V3"} stroke="#FAFAFA" strokeWidth={1.6} />}
      </svg>
    </button>
  );
}

// ─── What went wrong? (app: TranscriptFeedbackPrompt) ─────────────────────────

type Reason = "wrongWords" | "missing" | "speakers" | "language" | "translation" | "slow" | "other";
// The app's keys are the reasons themselves (voteFeedback.<reason>).
const reasonLabel = (r: Reason): string => t(`voteFeedback.${r}`);

// Only the problems that can happen to this kind of recording.
function reasonsFor(kind: string): Reason[] {
  const live = kind === "captions" || kind === "translation";
  return [
    "wrongWords", "missing", "speakers", "language",
    ...(kind === "translation" ? ["translation" as const] : []),
    ...(live ? ["slow" as const] : []),
    "other",
  ];
}

export function showTranscriptFeedback(kind: string, durationSeconds: number) {
  showCard(close => <FeedbackCard kind={kind} durationSeconds={durationSeconds} close={close} />);
}

function FeedbackCard({ kind, durationSeconds, close }: { kind: string; durationSeconds: number; close: () => void }) {
  const [picked, setPicked] = useState<Reason[]>([]);
  const [message, setMessage] = useState("");
  const canSend = picked.length > 0 || message.trim().length > 0;
  const toggle = (r: Reason) => setPicked(p => (p.includes(r) ? p.filter(x => x !== r) : [...p, r]));
  const send = () => {
    capture("transcript_feedback_sent", {
      reasons: picked.join(","),
      message: message.trim().slice(0, 2000),
      kind,
      duration_seconds: durationSeconds,
      is_plus: isPlusNow(),
      signed_in: true,
    });
    close();
  };
  return (
    <ModalCard title={`⚠️ ${t("rating.feedbackTitle")}`} body={t("voteFeedback.sub")} onClose={close}>
      <div className="rv-options">
        {reasonsFor(kind).map(r => {
          const on = picked.includes(r);
          return (
            <button key={r} type="button" className="rv-option" role="checkbox" aria-checked={on} onClick={() => toggle(r)}>
              <span className={`rv-check${on ? " on" : ""}`} aria-hidden>
                {on && <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round"><path d="M5 12l5 5l10 -10" /></svg>}
              </span>
              <span>{reasonLabel(r)}</span>
            </button>
          );
        })}
      </div>
      <textarea
        className="input rv-feedback-input"
        rows={2}
        maxLength={1000}
        value={message}
        onChange={e => setMessage(e.target.value)}
        placeholder={t("rating.feedbackPlaceholder")}
        aria-label={t("web.vote.feedbackLabel")}
      />
      <Button label={t("rating.send")} size="compact" disabled={!canSend} onPress={send} style={{ marginTop: 14 }} />
      <QuietButton label={t("common.notNow")} onPress={close} />
    </ModalCard>
  );
}
