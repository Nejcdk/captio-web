import { useSyncExternalStore } from "react";
import { capture, isGuest, needsAccount } from "./client";
import { plusForSale } from "./plus";

// Opening the paywall from anywhere (out of credits, Get Plus buttons, the
// Actions limit, Settings): the app's navigation.navigate('Paywall', { source }).
// Shell renders <Paywall /> while it's open.

type PaywallState = { open: boolean; source: string };
let state: PaywallState = { open: false, source: "" };
const listeners = new Set<() => void>();
const emit = () => listeners.forEach(l => l());

export function openPaywall(source: string) {
  // Where Plus can't be bought the plans never open (plus.ts plusForSale).
  if (!plusForSale()) {
    capture("paywall_skipped", { source, reason: "store_unavailable" });
    return;
  }
  // Plus belongs to an account: a guest signs in first.
  if (isGuest()) {
    capture("paywall_skipped", { source, reason: "signed_out" });
    needsAccount("plus");
    return;
  }
  state = { open: true, source };
  emit();
}

export function closePaywall() {
  state = { open: false, source: state.source };
  emit();
}

export function usePaywall(): PaywallState {
  return useSyncExternalStore(l => { listeners.add(l); return () => listeners.delete(l); }, () => state, () => state);
}
