"use client";

import "./invite.css";
import { capture } from "./client";
import { cashAvailable, formatUsd, openInvite, useCashAmounts } from "./invite";
import { t } from "./i18n";

// Home's 🎁 chip on the blue band (app: components/InviteChip.tsx): the most
// anyone can earn, in reward red, on a white rounded rectangle the size of
// PLUS, with a soft white glow that breathes (only the light moves) and the 🎁
// wiggling every 4 s. Opens the referral page. Nothing where there's no cash.
// still = the 🎁 holds still (the start bubble is wiggling: one per screen).
// compact = just the 🎁 (narrow windows with PLUS showing).
export function InviteChip({ still = false, compact = false }: { still?: boolean; compact?: boolean }) {
  const amounts = useCashAmounts();
  if (!cashAvailable()) return null;
  return (
    <span className="invite-chip-wrap">
      <span className="invite-chip-glow" aria-hidden />
      <button
        type="button"
        className={`invite-chip${compact ? " compact" : ""}`}
        aria-label={t("web.invite.chipLabel", { monthly: formatUsd(amounts.monthlyUsd), yearly: formatUsd(amounts.yearlyUsd) })}
        onClick={() => {
          capture("invite_chip_tapped", { cash: true, compact });
          openInvite("home_chip");
        }}
      >
        <span className={`invite-gift${still ? " still" : ""}`} aria-hidden>🎁</span>
        {!compact && <span className="invite-chip-amount">{formatUsd(amounts.maxUsd)}</span>}
      </button>
    </span>
  );
}

// Settings' note under the plan card (app: SettingsScreen inviteNote): the
// yearly reward, title only.
export function InviteSettingsNote() {
  const amounts = useCashAmounts();
  if (!cashAvailable()) return null;
  return (
    <button type="button" className="invite-settings-note" onClick={() => openInvite("settings")}>
      {t("settings.inviteTitleCash", { amount: formatUsd(amounts.yearlyUsd) })}
    </button>
  );
}
