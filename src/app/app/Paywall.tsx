"use client";

import "./paywall.css";
import { useEffect, useState } from "react";
import Link from "next/link";
import { ErrorCode, Purchases, PurchasesError, type Package } from "@revenuecat/purchases-js";
import { capture, getSupabase, isPreview, recordError, recordErrorOnce } from "./client";
import { closePaywall, usePaywall } from "./paywallStore";
import { isPlusNow, refreshPlus } from "./plus";
import { Button, ModalCard, showCard, showErrorAlert } from "./ui";

// The app's paywall (app repo: OnboardingScreen.tsx StepPaywall, standalone),
// the one dark screen: the PLUS wordmark, Free ✕ / Plus ✓ for the standard
// rows, Yearly (left, gold, SAVE tag, pre-selected) and Monthly (right, blue),
// Continue →, Terms and Privacy. Opened from anywhere with openPaywall(source).
//
// Sold through RevenueCat Web Billing (Nejc 2026-11-03: one place to track
// every purchase), the customer being the Supabase user id like in the app,
// so a purchase here is Plus on the phone too. Until the Web Billing app's
// public key is set (NEXT_PUBLIC_REVENUECAT_WEB_KEY, rcb_…), the paywall
// still shows, without prices, and Continue opens the App Store instead.

const WEB_KEY = process.env.NEXT_PUBLIC_REVENUECAT_WEB_KEY ?? "";
const APP_STORE_LINK = "https://apps.apple.com/app/apple-store/id6796617180?pt=129242349&ct=web_app&mt=8";
const DEFAULT_PLAN: Plan = "annual";
const ROWS = ["live captions", "translations", "file uploads", "AI actions", "recognized voices"];

type Plan = "annual" | "monthly";
type Plans = { annual: Package | null; monthly: Package | null };

let instance: Purchases | null = null;

// RevenueCat for the signed-in account, or null where it can't sell (no key
// yet, the dev preview, nobody signed in).
export async function getPurchases(): Promise<Purchases | null> {
  if (!WEB_KEY || isPreview()) return null;
  if (instance) return instance;
  const { data } = await getSupabase().auth.getSession();
  const userId = data.session?.user.id;
  if (!userId) return null;
  instance = Purchases.configure({ apiKey: WEB_KEY, appUserId: userId });
  return instance;
}

async function loadPlans(): Promise<Plans> {
  const purchases = await getPurchases();
  if (!purchases) return { annual: null, monthly: null };
  const offerings = await purchases.getOfferings();
  return { annual: offerings.current?.annual ?? null, monthly: offerings.current?.monthly ?? null };
}

function perMonth(pkg: Package): string {
  const price = pkg.product.currentPrice;
  try {
    return new Intl.NumberFormat(undefined, { style: "currency", currency: price.currency }).format(price.amountMicros / 1e6 / 12);
  } catch {
    return `${(price.amountMicros / 1e6 / 12).toFixed(2)}`;
  }
}

export function Paywall() {
  const { open, source } = usePaywall();
  if (!open) return null;
  return <PaywallScreen key={source} source={source} />;
}

function PaywallScreen({ source }: { source: string }) {
  const [selected, setSelected] = useState<Plan>(DEFAULT_PLAN);
  const [plans, setPlans] = useState<Plans>({ annual: null, monthly: null });
  const [busy, setBusy] = useState<"buy" | "restore" | null>(null);

  const close = () => {
    capture("paywall_dismissed", { standalone: true, source });
    closePaywall();
  };

  useEffect(() => {
    capture("paywall_viewed", { standalone: true, source, default_plan: DEFAULT_PLAN, plan_order: "yearly_first", use_case: "none", store: WEB_KEY ? "web_billing" : "app_store_link" });
    let live = true;
    loadPlans().then(p => { if (live) setPlans(p); }).catch(e => recordError("paywall_offerings", e));
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") close(); };
    window.addEventListener("keydown", onKey);
    return () => { live = false; window.removeEventListener("keydown", onKey); };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const { annual, monthly } = plans;
  const hasPrices = !!(annual || monthly);
  const savingsPct = annual && monthly
    ? Math.max(0, Math.round((1 - annual.product.currentPrice.amountMicros / (monthly.product.currentPrice.amountMicros * 12)) * 100))
    : null;

  const subscribe = async () => {
    capture("purchase_attempted", { plan: selected, source });
    const purchases = await getPurchases();
    // No Web Billing yet: Plus is bought in the app for now.
    if (!purchases) {
      capture("paywall_app_store_opened", { plan: selected, source });
      window.open(APP_STORE_LINK, "_blank", "noopener");
      return;
    }
    setBusy("buy");
    try {
      let pkg = selected === "annual" ? annual : monthly;
      if (!pkg) {
        const fresh = await loadPlans();
        setPlans(fresh);
        pkg = selected === "annual" ? fresh.annual : fresh.monthly;
      }
      if (!pkg) {
        setBusy(null);
        showErrorAlert({
          where: "paywall_no_offering",
          error: "no package to sell",
          title: "Products unavailable",
          body: "Could not load subscription options. Please check your connection and try again.",
          retry: subscribe,
        });
        return;
      }
      const { data } = await getSupabase().auth.getSession();
      await purchases.purchase({ rcPackage: pkg, customerEmail: data.session?.user.email ?? undefined });
      capture("purchase_completed", { plan: selected, source });
      await refreshPlus();
      setBusy(null);
      closePaywall();
    } catch (e) {
      setBusy(null);
      if (e instanceof PurchasesError && e.errorCode === ErrorCode.UserCancelledError) {
        capture("purchase_cancelled", { plan: selected, source });
        return;
      }
      showErrorAlert({ where: "paywall_purchase", error: e, title: "Purchase failed", body: "Something went wrong. Please try again." });
    }
  };

  // Plus bought in the app, or on another computer: ask RevenueCat again.
  const restore = async () => {
    capture("restore_attempted");
    setBusy("restore");
    await refreshPlus();
    setBusy(null);
    if (isPlusNow()) { closePaywall(); return; }
    showCard(done => (
      <ModalCard title="No purchases found" body="We could not find any previous purchases linked to this account." onClose={done}>
        <Button label="Close" size="compact" onPress={done} />
      </ModalCard>
    ));
  };

  return (
    <div className="paywall" role="dialog" aria-modal="true" aria-label="Captio AI Plus">
      <div className="paywall-inner">
        <div className="paywall-corners">
          <button type="button" className="paywall-restore" onClick={restore} disabled={!!busy}>
            {busy === "restore" ? "Please wait…" : "Restore"}
          </button>
          <button type="button" className="paywall-x" onClick={close} aria-label="Close">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden><path d="M18 6L6 18M6 6l12 12" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" /></svg>
          </button>
        </div>

        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="paywall-logo" src="/web-app/logo-text-plus.png" alt="Captio AI Plus" />

        <div className="paywall-table">
          <div className="paywall-head">
            <span />
            <span className="free">Free</span>
            <span className="plus">Plus</span>
          </div>
          <div className="paywall-grid">
            <div className="paywall-labels">
              {ROWS.map(r => <div key={r} className="paywall-label"><u>Unlimited</u> {r}</div>)}
            </div>
            <div className="paywall-col free">
              {ROWS.map(r => (
                <div key={r} className="cell">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-label="No"><path d="M18 6L6 18M6 6l12 12" stroke="rgba(255,255,255,0.28)" strokeWidth="2.5" strokeLinecap="round" /></svg>
                </div>
              ))}
            </div>
            <div className="paywall-col plus">
              {ROWS.map(r => (
                <div key={r} className="cell">
                  <span className="tick"><svg width="11" height="11" viewBox="0 0 24 24" fill="none" aria-label="Yes"><path d="M5 12.5l4.5 4.5L19 7" stroke="#fff" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" /></svg></span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="paywall-plans">
          <div className="plan-wrap">
            {savingsPct !== null && <span className="plan-badge">SAVE {savingsPct}%</span>}
            <button type="button" className={`plan-card annual${selected === "annual" ? " on" : ""}`} onClick={() => setSelected("annual")} aria-pressed={selected === "annual"}>
              <span className="plan-head"><span className="plan-check">{selected === "annual" && <Tick />}</span>Yearly</span>
              {annual && <span className="plan-price">{annual.product.currentPrice.formattedPrice}/year</span>}
              {annual && <span className="plan-sub">≈ {perMonth(annual)}/month</span>}
              <span className="plan-sub">Cancel anytime.</span>
            </button>
          </div>
          <div className="plan-wrap">
            <button type="button" className={`plan-card monthly${selected === "monthly" ? " on" : ""}`} onClick={() => setSelected("monthly")} aria-pressed={selected === "monthly"}>
              <span className="plan-head"><span className="plan-check">{selected === "monthly" && <Tick />}</span>Monthly</span>
              {monthly && <span className="plan-price">{monthly.product.currentPrice.formattedPrice}/month</span>}
              <span className="plan-sub">Billed every month</span>
              <span className="plan-sub">Cancel anytime.</span>
            </button>
          </div>
        </div>
        {!hasPrices && WEB_KEY && <div className="paywall-loading" aria-hidden />}

        <button type="button" className="paywall-cta" onClick={subscribe} disabled={busy === "buy"}>
          {busy === "buy" ? "Please wait…" : (
            <>
              Continue
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden><path d="M5 12h14M13 6l6 6-6 6" stroke="#0A1628" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </>
          )}
        </button>

        <div className="paywall-legal">
          <Link href="/terms" target="_blank">Terms of Use</Link>
          <Link href="/privacy" target="_blank">Privacy Policy</Link>
        </div>
      </div>
    </div>
  );
}

function Tick() {
  return <svg width="10" height="10" viewBox="0 0 24 24" fill="none" aria-hidden><path d="M5 12.5l4.5 4.5L19 7" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}

// Manage Subscription (Settings, Plus users): Web Billing's own page when the
// plan was bought here, else the App Store's subscriptions page.
export async function manageSubscriptionUrl(): Promise<string> {
  try {
    const purchases = await getPurchases();
    const info = purchases ? await purchases.getCustomerInfo() : null;
    if (info?.managementURL) return info.managementURL;
  } catch (e) {
    // Fall through to the App Store.
    recordErrorOnce("purchases_management_url", e);
  }
  return "https://apps.apple.com/account/subscriptions";
}
