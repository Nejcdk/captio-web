import { useSyncExternalStore } from "react";
import { api, isPreview, recordErrorOnce, store } from "./client";

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
