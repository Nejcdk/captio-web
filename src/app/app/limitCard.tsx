"use client";

import { capture } from "./client";
import { openPaywall } from "./paywallStore";
import { plusForSale } from "./plus";
import { Button, ModalCard, QuietButton, showCard } from "./ui";

// The app's out-of-credits card (app repo: components/DailyLimitPrompt.tsx):
// the sleeping owl, "You've used today's free credits", Get unlimited with Plus
// (gold) → the paywall, Not now. `saved` = said after a recording was saved.
export function showDailyLimit(kind: "start" | "saved", where: string) {
  const saved = kind === "saved";
  // Where Plus can't be bought: the same card with Close only.
  const sale = plusForSale();
  capture("daily_limit_prompt_shown", { saved, where, plus: sale });
  if (sale) capture("plus_button_shown", { where: "limit", style: "gold" });
  showCard(close => (
    <ModalCard
      owl="owl-sleeping"
      title="You've used today's free credits"
      body={!sale
        ? kind === "saved" ? "Your recording is saved. Free credits are back tomorrow." : "Free credits are back tomorrow."
        : kind === "saved"
          ? "Your recording is saved. Free credits are back tomorrow, or keep going now with unlimited captions in Plus."
          : "Free credits are back tomorrow, or keep going now with unlimited captions in Plus."}
      onClose={() => { capture("daily_limit_prompt_dismissed", { saved }); close(); }}
    >
      {!sale && <Button label="Close" size="compact" onPress={() => { capture("daily_limit_prompt_dismissed", { saved }); close(); }} />}
      {sale && <Button
        label="Get unlimited with Plus"
        variant="gold"
        size="compact"
        onPress={() => { capture("daily_limit_prompt_upgrade", { saved }); capture("plus_button_tapped", { where: "limit", style: "gold" }); close(); openPaywall("daily_limit"); }}
      />}
      {sale && <QuietButton label="Not now" onPress={() => { capture("daily_limit_prompt_dismissed", { saved }); close(); }} />}
    </ModalCard>
  ));
}

// A free allowance used up where Plus can't be bought (plus.ts plusForSale):
// said plainly instead of a button that does nothing.
export function showFreeUsedUp(title: string, where: string) {
  capture("free_used_up_shown", { where });
  showCard(close => (
    <ModalCard owl="owl-sleeping" title={title} body="Captio AI Plus isn't available in your country yet." onClose={close}>
      <Button label="Close" size="compact" onPress={close} />
    </ModalCard>
  ));
}
