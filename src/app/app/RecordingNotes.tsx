"use client";

import { useEffect, useState } from "react";
import { capture } from "./client";
import type { Recording } from "./data";
import { getExtras } from "./local";
import { addRestToRecording, getLiveRest, isAddingRest } from "./liveRest";
import { openPaywall } from "./paywallStore";
import { plusForSale, usePlus } from "./plus";
import { isTranscribingRest, transcribeRest } from "./upload";
import { PlusCard, showErrorAlert } from "./ui";

// Notes under a recording's captions about what wasn't transcribed (app:
// DetailScreen's PlusCard notes):
//  - a file the free credits covered only partly (upload.tsx keeps
//    `transcribedUntil`): "Only the start of this file is transcribed." +
//    Transcribe all;
//  - live captions that stopped at the free credits while the recording went
//    on (liveRest.ts): "Captions stopped at M:SS, when today's free credits
//    ran out. N more minutes are recorded." + Unlock with Plus (Plus: Show the
//    rest; bought from here, it goes ahead by itself);
//  - a part the connection dropped that couldn't be added yet: Try again.

// Bought Plus from a note: that recording's rest is added once Plus is on.
const unlockAfterBuying = new Set<string>();

function clock(seconds: number): string {
  const s = Math.max(0, Math.round(seconds));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
}

export function RecordingNotes({ recording }: { recording: Recording }) {
  const { isPlus } = usePlus();
  const [busy, setBusy] = useState(() => isTranscribingRest(recording.id) || isAddingRest(recording.id));
  const [, redraw] = useState(0);
  const transcribedUntil = getExtras<number | null>(recording.id, "transcribedUntil", null);
  const uploadCut = transcribedUntil != null && recording.status !== "transcribing";
  const rest = getLiveRest(recording.id);
  const creditsGap = rest?.gaps.filter(g => g.kind === "credits") ?? [];
  const connectionGap = rest?.gaps.filter(g => g.kind === "connection") ?? [];
  const liveCut = creditsGap.length > 0;
  const where = liveCut ? "captions_cut_note" : "upload_cut_note";
  const style = isPlus ? "primary" : "gold";

  // Where Plus can't be bought the notes stay, without a way to the plans.
  const canUnlock = isPlus || plusForSale();
  useEffect(() => {
    if ((uploadCut || liveCut) && canUnlock) capture("plus_button_shown", { where, style });
  }, [uploadCut, liveCut, where, style, canUnlock]);

  // The missing part came in: the note goes.
  useEffect(() => {
    const onChange = (e: Event) => {
      if ((e as CustomEvent<{ id: string }>).detail?.id === recording.id) {
        setBusy(isTranscribingRest(recording.id) || isAddingRest(recording.id));
        redraw(n => n + 1);
      }
    };
    window.addEventListener("captio-recording-changed", onChange);
    return () => window.removeEventListener("captio-recording-changed", onChange);
  }, [recording.id]);

  const addRest = () => {
    setBusy(true);
    void addRestToRecording(recording.id)
      .catch(e => showErrorAlert({ where: "live_rest", error: e, retry: addRest }))
      .finally(() => setBusy(isAddingRest(recording.id)));
  };

  // Bought from the note: it goes ahead by itself.
  useEffect(() => {
    if (!isPlus || !unlockAfterBuying.has(recording.id)) return;
    unlockAfterBuying.delete(recording.id);
    addRest();
  }, [isPlus, recording.id]); // eslint-disable-line react-hooks/exhaustive-deps

  if (uploadCut) {
    return (
      <PlusCard
        style={{ marginTop: 24 }}
        body="Only the start of this file is transcribed."
        cta={busy ? "Transcribing..." : "Transcribe all"}
        upgrade={!isPlus}
        onPress={!canUnlock ? undefined : () => {
          if (busy) return;
          capture("plus_button_tapped", { where: "upload_cut_note", style });
          if (isPlus) setBusy(true);
          void transcribeRest(recording.id, recording.folderId).finally(() => setBusy(isTranscribingRest(recording.id)));
        }}
      />
    );
  }

  if (liveCut && rest) {
    const missing = creditsGap.reduce((n, g) => n + (g.to - g.from), 0);
    const minutes = Math.max(1, Math.round(missing / 60));
    return (
      <PlusCard
        style={{ marginTop: 24 }}
        body={`Captions stopped at ${clock(rest.cutAt ?? creditsGap[0].from)}, when today's free credits ran out. ${minutes} more ${minutes === 1 ? "minute is" : "minutes are"} recorded.`}
        cta={busy ? "Transcribing..." : isPlus ? "Show the rest" : "Unlock with Plus"}
        upgrade={!isPlus}
        onPress={!canUnlock ? undefined : () => {
          if (busy) return;
          capture("plus_button_tapped", { where: "captions_cut_note", style });
          capture("transcribe_rest_tapped", { live: true, is_plus: isPlus });
          if (isPlus) addRest();
          else {
            unlockAfterBuying.add(recording.id);
            openPaywall("captions_cut_note");
          }
        }}
      />
    );
  }

  if (connectionGap.length && !busy) {
    return (
      <PlusCard
        style={{ marginTop: 24 }}
        body="Part of this recording was made without a connection and isn't transcribed yet."
        cta="Try again"
        upgrade={false}
        onPress={addRest}
      />
    );
  }
  return null;
}
