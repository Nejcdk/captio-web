"use client";

import { capture } from "./client";
import { openPaywall } from "./paywallStore";
import { Button, ModalCard, QuietButton, showCard } from "./ui";

// The app's out-of-credits card (app repo: components/DailyLimitPrompt.tsx):
// the sleeping owl, "You've used today's free credits", Get unlimited with Plus
// (gold) → the paywall, Not now. `saved` = said after a recording was saved.
export function showDailyLimit(kind: "start" | "saved", where: string) {
  const saved = kind === "saved";
  capture("daily_limit_prompt_shown", { saved, where });
  capture("plus_button_shown", { where: "limit", style: "gold" });
  showCard(close => (
    <ModalCard
      owl="owl-sleeping"
      title="You've used today's free credits"
      body={kind === "saved"
        ? "Your recording is saved. Free credits are back tomorrow, or keep going now with unlimited captions in Plus."
        : "Free credits are back tomorrow, or keep going now with unlimited captions in Plus."}
      onClose={() => { capture("daily_limit_prompt_dismissed", { saved }); close(); }}
    >
      <Button
        label="Get unlimited with Plus"
        variant="gold"
        size="compact"
        onPress={() => { capture("daily_limit_prompt_upgrade", { saved }); capture("plus_button_tapped", { where: "limit", style: "gold" }); close(); openPaywall("daily_limit"); }}
      />
      <QuietButton label="Not now" onPress={() => { capture("daily_limit_prompt_dismissed", { saved }); close(); }} />
    </ModalCard>
  ));
}
