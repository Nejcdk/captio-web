import { store } from "./client";

// The free plan, as in the app (app repo: src/lib/usage.ts): 100 credits a
// day, 1 credit = 3 s of captions, translation or a file transcribed, counted
// in this browser like the phone counts on the phone. Copy always says
// credits, never minutes. Plus has no limit.

export const FREE_DAILY_LIMIT_SECONDS = 5 * 60;
export const SECONDS_PER_CREDIT = 3;
export const FREE_DAILY_CREDITS = FREE_DAILY_LIMIT_SECONDS / SECONDS_PER_CREDIT; // 100
// The Actions tab: free users make this many in all, then Plus.
export const FREE_SUMMARY_LIMIT = 3;

function todayKey(): string {
  const d = new Date();
  return `captio_usage_${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export function getTodayUsage(): number {
  return store.get<number>(todayKey(), 0);
}

export function setTodayUsage(seconds: number) {
  store.set(todayKey(), Math.max(0, Math.round(seconds)));
}

export function addUsage(seconds: number) {
  if (seconds > 0) setTodayUsage(getTodayUsage() + seconds);
}

export function freeSecondsLeft(): number {
  return Math.max(0, FREE_DAILY_LIMIT_SECONDS - getTodayUsage());
}

export function creditsRemaining(usedSeconds = getTodayUsage()): number {
  return Math.max(0, Math.floor((FREE_DAILY_LIMIT_SECONDS - usedSeconds) / SECONDS_PER_CREDIT));
}

export function getFreeSummariesUsed(): number {
  return store.get<number>("captio_free_summaries_used", 0);
}

export function incrementFreeSummariesUsed(): number {
  const next = getFreeSummariesUsed() + 1;
  store.set("captio_free_summaries_used", next);
  return next;
}

// Sending a summary out (Export's SUMMARY half, or an action's own Export):
// free users get this many in all, then Plus. Counted when something was sent.
export const FREE_SUMMARY_EXPORT_LIMIT = 3;

export function getFreeSummaryExportsUsed(): number {
  return store.get<number>("captio_free_summary_exports_used", 0);
}

export function incrementFreeSummaryExportsUsed(): number {
  const next = getFreeSummaryExportsUsed() + 1;
  store.set("captio_free_summary_exports_used", next);
  return next;
}
