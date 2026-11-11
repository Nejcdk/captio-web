"use client";

import { useState } from "react";
import { capture, getSupabase, isLocalOnly, recordErrorOnce, store } from "./client";
import { markInviteDue } from "./invite";
import { Button, ModalCard, QuietButton, showCard } from "./ui";
import { t } from "./i18n";

// "How accurate was this transcript?" (app repo: TranscriptRatingPrompt.tsx,
// lib/transcriptRating.ts): after saving a live recording longer than a
// minute, at most every 14 days; 20+ minute recordings always ask. 4–5 stars
// end it and make the referral page due (the app asks Apple's review sheet
// first, which a browser has none of);
// 1–3 stars ask what went wrong. Every rating goes to Supabase
// (`transcript_feedback`) and PostHog.

const LAST_PROMPT_KEY = "captio_rating_last_prompt_at";
const MIN_SECONDS = 60;
const INTERVAL_MS = 14 * 24 * 60 * 60 * 1000;
export const LONG_RECORDING_SECONDS = 20 * 60;
const GOOD_RATING = 4;

export type RatingKind = "captions" | "translation";

export function shouldAskForRating(durationSeconds: number): boolean {
  if (durationSeconds <= MIN_SECONDS) return false;
  if (durationSeconds >= LONG_RECORDING_SECONDS) return true;
  return Date.now() - store.get<number>(LAST_PROMPT_KEY, 0) >= INTERVAL_MS;
}

async function submitRating(rating: number, kind: RatingKind, durationSeconds: number, message?: string) {
  capture("transcript_rated", { rating, has_message: !!message?.trim(), duration_seconds: durationSeconds, kind });
  if (isLocalOnly()) return;
  try {
    const sb = getSupabase();
    const { data } = await sb.auth.getSession();
    const { error } = await sb.from("transcript_feedback").insert({
      user_id: data.session?.user.id ?? null,
      rating,
      message: message?.trim() || null,
      duration_seconds: durationSeconds,
      kind,
      app_version: "web",
    });
    // The user's written feedback is lost.
    if (error) recordErrorOnce("rating_insert", error);
  } catch (e) {
    recordErrorOnce("rating_insert", e);
  }
}

// Shows the stars; resolves once it's answered or closed.
export function showRatingPrompt(kind: RatingKind, durationSeconds: number, ownRecordings = 0): Promise<void> {
  store.set(LAST_PROMPT_KEY, Date.now());
  capture("rating_prompt_shown", { kind, duration_seconds: durationSeconds, long_recording: durationSeconds >= LONG_RECORDING_SECONDS });
  return new Promise(resolve => {
    showCard(close => (
      <RatingCard kind={kind} durationSeconds={durationSeconds} ownRecordings={ownRecordings} close={() => { close(); resolve(); }} />
    ));
  });
}

function RatingCard({ kind, durationSeconds, ownRecordings, close }: {
  kind: RatingKind; durationSeconds: number; ownRecordings: number; close: () => void;
}) {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [step, setStep] = useState<"stars" | "feedback">("stars");
  const [message, setMessage] = useState("");

  const pick = (n: number) => {
    if (rating) return;
    setRating(n);
    // Let the filled stars register before moving on.
    setTimeout(() => {
      if (n >= GOOD_RATING) {
        void submitRating(n, kind, durationSeconds);
        close();
        markInviteDue("good_rating", ownRecordings);
      } else {
        setStep("feedback");
      }
    }, 350);
  };

  const finish = (send: boolean) => {
    void submitRating(rating, kind, durationSeconds, send ? message : undefined);
    capture(send ? "rating_feedback_sent" : "rating_feedback_skipped", {
      rating, message: send ? message.trim().slice(0, 1000) : undefined, kind,
    });
    close();
  };

  const dismiss = () => {
    if (step === "stars" && !rating) capture("rating_prompt_dismissed");
    else if (step === "feedback") { finish(false); return; }
    close();
  };

  if (step === "feedback") {
    return (
      <ModalCard title={t("rating.feedbackTitle")} body={t("rating.feedbackSub")} onClose={dismiss}>
        <textarea
          className="input rv-feedback-input"
          rows={3}
          autoFocus
          maxLength={1000}
          value={message}
          onChange={e => setMessage(e.target.value)}
          placeholder={t("rating.feedbackPlaceholder")}
          aria-label={t("rating.feedbackTitle")}
        />
        <Button label={t("rating.send")} size="compact" disabled={!message.trim()} onPress={() => finish(true)} style={{ marginTop: 14 }} />
        <QuietButton label={t("common.notNow")} onPress={() => finish(false)} />
      </ModalCard>
    );
  }
  const shown = rating || hover;
  return (
    <ModalCard title={t("rating.title")} body={t("rating.sub")} onClose={dismiss}>
      <div className="rv-stars" onMouseLeave={() => setHover(0)}>
        {[1, 2, 3, 4, 5].map(n => (
          <button
            key={n}
            type="button"
            className="rv-star"
            aria-label={t("web.rating.stars", { count: n })}
            onMouseEnter={() => !rating && setHover(n)}
            onClick={() => pick(n)}
          >
            <svg width="40" height="40" viewBox="0 0 24 24" aria-hidden>
              <path
                d="M12 2l3.09 6.26L22 9.27l-5 4.87l1.18 6.88L12 17.77l-6.18 3.25L7 14.14L2 9.27l6.91-1.01L12 2z"
                fill={n <= shown ? "#FFB800" : "none"}
                stroke={n <= shown ? "#FFB800" : "#D1D1D6"}
                strokeWidth={1.8}
                strokeLinejoin="round"
              />
            </svg>
          </button>
        ))}
      </div>
      <QuietButton label={t("common.notNow")} onPress={dismiss} />
    </ModalCard>
  );
}
