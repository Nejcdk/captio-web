import { useSyncExternalStore } from "react";
import { capture, getSupabase, isPreview, recordErrorOnce, store } from "./client";

// The referral program on the web (app repo: src/lib/referrals.ts,
// inviteNudges.ts, CLAUDE.md "Cash for invites"): an invited friend's first
// payment earns the inviter $10 (monthly) or $50 (yearly), up to $2,500 in
// all, paid by PayPal. Every rule lives in Supabase (referral_stats,
// redeem_referral_code); this only reads the stats and shares the one link.

export type ReferralCash = {
  monthlyUsd: number; yearlyUsd: number; maxUsd: number;
  readyUsd: number; waitingUsd: number; paidUsd: number;
};
export type ReferralStats = { code: string; friendsJoined: number; cash: ReferralCash | null };

// ─── Amounts (the server decides; the last ones seen are remembered) ─────────

type CashAmounts = { monthlyUsd: number; yearlyUsd: number; maxUsd: number };
const AMOUNTS_KEY = "captio_referral_cash_amounts";
const DEFAULT_AMOUNTS: CashAmounts = { monthlyUsd: 10, yearlyUsd: 50, maxUsd: 2500 };
let amounts: CashAmounts | null = null;
const amountListeners = new Set<() => void>();

function readAmounts(): CashAmounts {
  if (!amounts) amounts = { ...DEFAULT_AMOUNTS, ...store.get<Partial<CashAmounts>>(AMOUNTS_KEY, {}) };
  return amounts;
}

function setAmounts(next: CashAmounts) {
  if (!(next.monthlyUsd > 0 && next.yearlyUsd > 0)) return;
  const cur = readAmounts();
  if (next.monthlyUsd === cur.monthlyUsd && next.yearlyUsd === cur.yearlyUsd && next.maxUsd === cur.maxUsd) return;
  amounts = next;
  store.set(AMOUNTS_KEY, next);
  amountListeners.forEach(l => l());
}

export function useCashAmounts(): CashAmounts {
  return useSyncExternalStore(
    l => { amountListeners.add(l); return () => amountListeners.delete(l); },
    readAmounts,
    () => DEFAULT_AMOUNTS,
  );
}

// "$10", cents only when there are any.
export function formatUsd(amount: number): string {
  const whole = Math.round(amount * 100) % 100 === 0;
  const digits = whole ? 0 : 2;
  try {
    // The web app is in English: "$2,500", never "US$2,500" (a browser set to en-GB).
    return new Intl.NumberFormat("en-US", {
      style: "currency", currency: "USD", minimumFractionDigits: digits, maximumFractionDigits: digits,
    }).format(amount);
  } catch {
    return `$${amount.toFixed(digits)}`;
  }
}

// ─── Where the cash can be paid ──────────────────────────────────────────────
// No cash where US sanctions stop payouts: there the program isn't shown at
// all. The app reads the phone's region; a browser has its locale's region
// and its time zone, and either one in those countries is enough.

const NO_CASH_REGIONS = new Set(["CU", "IR", "KP", "SY", "RU", "BY"]);
const NO_CASH_ZONES = new Set([
  "America/Havana", "Asia/Tehran", "Asia/Pyongyang", "Asia/Damascus", "Europe/Minsk",
  "Europe/Moscow", "Europe/Kaliningrad", "Europe/Samara", "Europe/Volgograd", "Europe/Kirov", "Europe/Astrakhan",
  "Europe/Saratov", "Europe/Ulyanovsk", "Asia/Yekaterinburg", "Asia/Omsk", "Asia/Novosibirsk", "Asia/Barnaul",
  "Asia/Tomsk", "Asia/Novokuznetsk", "Asia/Krasnoyarsk", "Asia/Irkutsk", "Asia/Chita", "Asia/Yakutsk",
  "Asia/Khandyga", "Asia/Vladivostok", "Asia/Ust-Nera", "Asia/Magadan", "Asia/Sakhalin", "Asia/Srednekolymsk",
  "Asia/Kamchatka", "Asia/Anadyr",
]);

export function cashAvailable(): boolean {
  if (typeof navigator === "undefined") return true;
  try {
    const region = new Intl.Locale(navigator.language).maximize().region?.toUpperCase();
    if (region && NO_CASH_REGIONS.has(region)) return false;
    const zone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    return !(zone && NO_CASH_ZONES.has(zone));
  } catch {
    return true;
  }
}

// ─── Stats, the link, redeeming a code ───────────────────────────────────────

export const referralLink = (code: string) => `https://captioai.app/i/${code}`;

export function shareMessage(code: string): string {
  return `🦉 Captio AI is an app for deaf and hard of hearing people. It turns what people say into live captions on your phone.\n\n👉 ${referralLink(code)}`;
}

// Dev preview (/app?preview=1): made-up earnings, like the app's
// EXPO_PUBLIC_PREVIEW_INVITE_CASH.
function previewStats(): ReferralStats {
  return { code: "PREVW7", friendsJoined: 4, cash: { monthlyUsd: 10, yearlyUsd: 50, maxUsd: 2500, readyUsd: 50, waitingUsd: 10, paidUsd: 10 } };
}

export async function getReferralStats(): Promise<ReferralStats | null> {
  if (isPreview()) return previewStats();
  const { data, error } = await getSupabase().rpc("referral_stats");
  if (error || !data) {
    recordErrorOnce("referral_stats", error ?? "no data");
    return null;
  }
  const c = data.cash as Record<string, unknown> | null;
  const cash: ReferralCash | null = c ? {
    monthlyUsd: Number(c.monthly_usd ?? 10),
    yearlyUsd: Number(c.yearly_usd ?? 50),
    maxUsd: Number(c.max_usd ?? 2500),
    readyUsd: Number(c.ready_usd ?? 0),
    waitingUsd: Number(c.waiting_usd ?? 0),
    paidUsd: Number(c.paid_usd ?? 0),
  } : null;
  if (cash) setAmounts({ monthlyUsd: cash.monthlyUsd, yearlyUsd: cash.yearlyUsd, maxUsd: cash.maxUsd });
  return { code: String(data.code), friendsJoined: Number(data.friends_joined ?? 0), cash };
}

export type RedeemError = "invalid_code" | "self_referral" | "already_referred" | "device_already_used" | "not_authenticated" | "network";
export type RedeemResult = { ok: true } | { ok: false; error: RedeemError };

export const REDEEM_ERRORS: Record<RedeemError, string> = {
  invalid_code: "That code doesn't exist. Check the letters and try again.",
  self_referral: "That's your own code! Share it with a friend instead.",
  already_referred: "You've already used an invite code.",
  device_already_used: "This device has already claimed an invite.",
  not_authenticated: "Sign in first, then enter the code.",
  network: "Couldn't reach the server. Check your connection and try again.",
};

// One per browser, so one computer can't farm invites by making accounts
// (the server also allows one referral per account). Null in `next dev`.
function deviceId(): string | null {
  if (process.env.NODE_ENV === "development") return null;
  let id = store.get<string | null>("captio_referral_device_id", null);
  if (!id) {
    id = `web-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
    store.set("captio_referral_device_id", id);
  }
  return id;
}

export async function redeemReferralCode(code: string): Promise<RedeemResult> {
  if (isPreview()) return { ok: true };
  const { data, error } = await getSupabase().rpc("redeem_referral_code", { p_code: code.trim(), p_device: deviceId() });
  if (error) {
    recordErrorOnce("referral_redeem", error);
    return { ok: false, error: "network" };
  }
  if (data?.ok) {
    capture("referral_redeemed");
    return { ok: true };
  }
  const reason = (data?.error ?? "network") as RedeemError;
  capture("referral_redeem_failed", { reason });
  return { ok: false, error: reason };
}

// A link opened as captioai.app/app?invite=<code> (or ?i=): put on the account
// quietly, the way the app applies a link from Home. Read before the address
// is tidied up.
export function takeInviteFromUrl(): string | null {
  try {
    const p = new URLSearchParams(window.location.search);
    const raw = p.get("invite") ?? p.get("i");
    const code = raw?.trim().toUpperCase() ?? "";
    return /^[A-Z0-9]{6,32}$/.test(code) ? code : null;
  } catch {
    return null;
  }
}

export async function applyReferralLink(code: string): Promise<void> {
  const res = await redeemReferralCode(code);
  capture("referral_link_applied", { from: "web_app", ok: res.ok, error: res.ok ? undefined : res.error });
}

// ─── The page opening by itself (app: inviteNudges.ts) ───────────────────────
// After something good (a save once they have two recordings of their own, a
// 4–5 star rating) or 1 time in 3 when they come back: every 3 days at most
// since they last saw it (7 once they've shared), 12 times in all, never over
// another screen or card, never where there's no cash.

const SHARED_KEY = "captio_invite_shared";
const COUNT_KEY = "captio_invite_auto_count";
const LAST_KEY = "captio_invite_auto_last";
const MAX_OPENS = 12;
const GAP_MS = 3 * 86_400_000;
const GAP_SHARED_MS = 7 * 86_400_000;

export type InviteMoment = "saved_recording" | "good_rating" | "back_home";
let due: InviteMoment | null = null;
const dueListeners = new Set<() => void>();

export function markInviteSeen() {
  store.set(LAST_KEY, Date.now());
}

export function markInviteShared() {
  store.set(SHARED_KEY, true);
}

// ownRecordings: their own recordings (not the welcome or onboarding demo).
// true = it will open.
export function markInviteDue(moment: InviteMoment, ownRecordings: number): boolean {
  if (due) return true;
  if (!cashAvailable()) return false;
  const shared = store.get<boolean>(SHARED_KEY, false);
  const count = store.get<number>(COUNT_KEY, 0);
  const last = store.get<number>(LAST_KEY, 0);
  if (count >= MAX_OPENS || Date.now() - last < (shared ? GAP_SHARED_MS : GAP_MS)) return false;
  if (moment !== "good_rating" && ownRecordings < 2) return false;
  if (moment === "back_home" && Math.random() >= 1 / 3) return false;
  due = moment;
  dueListeners.forEach(l => l());
  return true;
}

export function onInviteDue(l: () => void): () => void {
  dueListeners.add(l);
  return () => dueListeners.delete(l);
}

export function takeDueInvite(): InviteMoment | null {
  const moment = due;
  due = null;
  if (!moment) return null;
  const nth = store.get<number>(COUNT_KEY, 0) + 1;
  store.set(COUNT_KEY, nth);
  capture("invite_auto_opened", { moment, nth });
  return moment;
}

// ─── Open / close ────────────────────────────────────────────────────────────

type OpenState = { open: boolean; source: string };
let openState: OpenState = { open: false, source: "" };
const openListeners = new Set<() => void>();

export function openInvite(source: string) {
  if (!cashAvailable()) return;
  openState = { open: true, source };
  openListeners.forEach(l => l());
}

export function closeInvite() {
  openState = { open: false, source: openState.source };
  openListeners.forEach(l => l());
}

export function useInviteOpen(): OpenState {
  return useSyncExternalStore(
    l => { openListeners.add(l); return () => openListeners.delete(l); },
    () => openState,
    () => openState,
  );
}
