import { useSyncExternalStore } from "react";
import { api, capture, isPreview, recordErrorOnce, store } from "./client";

// Whether this account has Plus (RevenueCat, same customer as the app), read
// once per visit and remembered so a reload doesn't flash the free plan.
// Dev: /app?preview=1&plus=1 acts as a Plus user.

type PlusState = { isPlus: boolean; known: boolean };
let state: PlusState = { isPlus: false, known: false };
const listeners = new Set<() => void>();
let loading: Promise<void> | null = null;

function set(next: PlusState) {
  state = next;
  listeners.forEach(l => l());
}

export function refreshPlus(): Promise<void> {
  loading = (async () => {
    if (isPreview()) {
      set({ isPlus: new URLSearchParams(window.location.search).get("plus") === "1", known: true });
      return;
    }
    const cached = store.get<boolean | null>("captio_plus", null);
    if (cached !== null && !state.known) set({ isPlus: cached, known: false });
    try {
      const { plus } = await api<{ plus: boolean }>("/api/app/plus");
      store.set("captio_plus", plus);
      set({ isPlus: plus, known: true });
    } catch (e) {
      // Keep the last known answer; free until we know better.
      recordErrorOnce("purchases_customer_info", e);
      set({ isPlus: cached ?? false, known: true });
    }
  })();
  return loading;
}

export function isPlusNow(): boolean {
  return state.isPlus;
}

const subscribe = (l: () => void) => {
  listeners.add(l);
  if (!loading) refreshPlus();
  return () => listeners.delete(l);
};
const SERVER: PlusState = { isPlus: false, known: false };

export function usePlus(): PlusState {
  return useSyncExternalStore(subscribe, () => state, () => SERVER);
}

// ─── Where Plus can be bought ────────────────────────────────────────────────
// Plus on the web is paid by card (Stripe through RevenueCat), and cards from
// these countries can't pay: there Plus isn't offered at all, as the app does
// where the store can't sell (PurchasesContext storeCanSell): no PLUS badge or
// upgrade button, the out-of-credits card without the Plus button, and any
// other way to the plans closes at once (paywall_skipped). Real users in Iran
// and Afghanistan hit the plans and could never buy (2026-11). A browser has
// its time zone and, sometimes, its language's region: either is enough.
// Dev: /app?preview=1&nosale=1.

export const RUSSIA_ZONES = [
  "Europe/Moscow", "Europe/Kaliningrad", "Europe/Samara", "Europe/Volgograd", "Europe/Kirov", "Europe/Astrakhan",
  "Europe/Saratov", "Europe/Ulyanovsk", "Asia/Yekaterinburg", "Asia/Omsk", "Asia/Novosibirsk", "Asia/Barnaul",
  "Asia/Tomsk", "Asia/Novokuznetsk", "Asia/Krasnoyarsk", "Asia/Irkutsk", "Asia/Chita", "Asia/Yakutsk",
  "Asia/Khandyga", "Asia/Vladivostok", "Asia/Ust-Nera", "Asia/Magadan", "Asia/Sakhalin", "Asia/Srednekolymsk",
  "Asia/Kamchatka", "Asia/Anadyr",
];
const NO_SALE_REGIONS = new Set(["AF", "BY", "CU", "IR", "KP", "RU", "SY"]);
const NO_SALE_ZONES = new Set([
  ...RUSSIA_ZONES, "Asia/Tehran", "Asia/Kabul", "America/Havana", "Asia/Pyongyang", "Asia/Damascus", "Europe/Minsk", "Europe/Simferopol",
]);

let forSale: boolean | null = null;

export function plusForSale(): boolean {
  if (forSale !== null) return forSale;
  if (typeof window === "undefined") return true;
  let zone = "";
  let region = "";
  try {
    zone = Intl.DateTimeFormat().resolvedOptions().timeZone ?? "";
    // Only a region the browser names ("fa-IR"), never one guessed from the
    // language: a Persian speaker in Germany can buy.
    for (const l of navigator.languages ?? [navigator.language]) {
      const r = new Intl.Locale(l).region?.toUpperCase();
      if (r && NO_SALE_REGIONS.has(r)) { region = r; break; }
    }
  } catch {
    // Can't tell: offered as everywhere else.
  }
  const devOff = isPreview() && new URLSearchParams(window.location.search).get("nosale") === "1";
  forSale = !devOff && !NO_SALE_ZONES.has(zone) && !region;
  if (!forSale) capture("purchases_unavailable", { reason: "region", zone, region: region || undefined });
  return forSale;
}
