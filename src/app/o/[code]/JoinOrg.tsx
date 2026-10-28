"use client";

import { useEffect, useRef, useState } from "react";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import posthog from "posthog-js";

// Signs the person in with Apple or Google (through the app's own Supabase,
// so it's the same account as in the app), takes a place with org_join() and
// signs out again (the site keeps nothing). Plus is granted in RevenueCat by
// the database; the app shows it once they sign in there with that account.
// Same flow as the folder invite (src/app/f/[code]/JoinWithAccount.tsx):
// Continue with … → the provider → back here (?join=<provider> plus
// Supabase's ?code=) → session → org_join() → signed out → "You're in".
// Supabase → Authentication → URL Configuration → Redirect URLs must
// include https://captioai.app/o/**.
//
// Events (PostHog, platform "web"; never the code, it lets people in):
//   org_link_viewed          valid, error, status, plan, places_left, device, in_app_browser
//   org_join_signin_tapped   provider
//   org_join_signin_returned provider, ok, error
//   org_joined               provider, already, plan, ended
//   org_join_failed          provider, reason
//   app_error                where org_join_*

// Tagged so App Store Connect / Play Console count installs from these links.
const APP_STORE_LINK = "https://apps.apple.com/app/apple-store/id6796617180?pt=129242349&ct=org_link&mt=8";
const GOOGLE_PLAY_LINK = "https://play.google.com/store/apps/details?id=com.captio.app&referrer=utm_source%3Dcaptioai.app%26utm_campaign%3Dorg_link";

type Provider = "google" | "apple";
type Joined = { provider: Provider; already: boolean; until: string; ended: boolean };
type State =
  | { step: "idle" }
  | { step: "working"; provider: Provider }
  | { step: "joined"; joined: Joined }
  | { step: "error"; message: string };

const PROVIDER_NAME: Record<Provider, string> = { google: "Google", apple: "Apple" };

function capture(event: string, props: Record<string, unknown>) {
  try {
    posthog.capture(event, { ...props, page: "org_link" }, { transport: "sendBeacon", send_instantly: true });
  } catch {
    // Analytics must never block joining.
  }
}

function device(): "ios" | "android" | "desktop" {
  const ua = navigator.userAgent;
  if (/iPhone|iPad|iPod/i.test(ua) || (/Macintosh/.test(ua) && navigator.maxTouchPoints > 1)) return "ios";
  if (/Android/i.test(ua)) return "android";
  return "desktop";
}

function inAppBrowser(): string | undefined {
  const m = navigator.userAgent.match(/(Instagram|FBAN|FBAV|LinkedInApp|TikTok|musical_ly|Snapchat|Line\/|GSA\/)/);
  return m ? m[1].replace("/", "") : undefined;
}

const longDate = (iso: string) =>
  new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "long", year: "numeric" }).format(new Date(iso));

function failure(reason: string, orgName: string): string {
  switch (reason) {
    case "full": return `All places from ${orgName} are taken. Ask ${orgName} about more places.`;
    case "stopped": return `This link has been closed. Ask ${orgName} for a new one.`;
    case "link_expired": return `This pilot link has expired. Ask ${orgName} for a new one.`;
    case "ended": return `${orgName}'s licenses have ended.`;
    case "other_org": return "Your account already gets Captio AI through another organization.";
    case "had_pilot": return `This account has already had a free pilot. Ask ${orgName} about keeping Captio AI.`;
    case "not_found": return "This link doesn't work. Ask whoever sent it for a new one.";
    default: return "Something went wrong. Please try again.";
  }
}

export function OrgLinkViewed(props: { valid: boolean; error: boolean; status?: string; plan?: string; placesLeft?: number }) {
  useEffect(() => {
    if (props.error) capture("app_error", { where: "org_join_load", message: "org_link_info failed", source: "organizations" });
    capture("org_link_viewed", {
      valid: props.valid, error: props.error, status: props.status, plan: props.plan,
      places_left: props.placesLeft, device: device(), in_app_browser: inAppBrowser(),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps -- once per page view
  }, []);
  return null;
}

function StoreLinks({ provider }: { provider: Provider }) {
  // Only rendered after joining (in the browser), never on the server.
  const [d] = useState(device);
  const apple = (
    <a key="apple" href={APP_STORE_LINK} className="block rounded-lg bg-brand px-5 py-4 text-center text-[17px] font-bold text-white transition-colors hover:bg-brand/90">
      Get Captio AI on the App Store
    </a>
  );
  const google = (
    <a key="google" href={GOOGLE_PLAY_LINK} className={`block rounded-lg px-5 py-4 text-center text-[17px] font-bold transition-colors ${d === "android" ? "bg-brand text-white hover:bg-brand/90" : "bg-white text-brand ring-1 ring-brand hover:bg-brand-light"}`}>
      Get Captio AI on Google Play
    </a>
  );
  return (
    <div className="mt-6 flex flex-col gap-3">
      {d === "android" ? [google] : d === "ios" ? [apple] : [apple, google]}
      {d === "desktop" && <p className="text-center text-[14px] text-gray-500">Captio AI is a phone app: get it on your iPhone or Android phone.</p>}
      <p className="text-[14px] leading-relaxed text-gray-500 text-center">
        Then sign in to Captio AI with the same {PROVIDER_NAME[provider]} account. Already have the app? Close it and open it again.
      </p>
    </div>
  );
}

export function JoinOrg({ code, orgName, plan, supabaseUrl, anonKey }: {
  code: string;
  orgName: string;
  plan: "pilot" | "paid";
  supabaseUrl: string;
  anonKey: string;
}) {
  const [state, setState] = useState<State>({ step: "idle" });
  const client = useRef<SupabaseClient | null>(null);
  const supabase = () => {
    if (!client.current) {
      client.current = createClient(supabaseUrl, anonKey, {
        auth: {
          flowType: "pkce",
          detectSessionInUrl: false,
          persistSession: true,
          autoRefreshToken: false,
          storage: window.sessionStorage,
          storageKey: "captio-org-join",
        },
      });
    }
    return client.current;
  };

  // Back from Apple/Google: finish signing in, join, sign out again.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const provider = params.get("join") as Provider | null;
    if (!provider || !(provider in PROVIDER_NAME)) return;
    const providerError = params.get("error_description") ?? params.get("error");
    const authCode = params.get("code");
    window.history.replaceState(null, "", `/o/${code}`);
    (async () => {
      if (providerError) {
        capture("org_join_signin_returned", { provider, ok: false, error: providerError.slice(0, 120) });
        setState({ step: "error", message: "Signing in didn't work. Please try again." });
        return;
      }
      setState({ step: "working", provider });
      const sb = supabase();
      const { data: { session }, error } = authCode
        ? await sb.auth.exchangeCodeForSession(authCode)
        : { data: { session: null }, error: new Error("no auth code") };
      if (error || !session) {
        capture("org_join_signin_returned", { provider, ok: false, error: (error?.message ?? "no session").slice(0, 120) });
        setState({ step: "error", message: "Signing in didn't work. Please try again." });
        return;
      }
      capture("org_join_signin_returned", { provider, ok: true });
      const { data, error: joinError } = await sb.rpc("org_join", { p_code: code });
      await sb.auth.signOut({ scope: "local" }).catch(() => {});
      if (joinError || !data) {
        capture("app_error", { where: "org_join_rpc", message: (joinError?.message ?? "no data").slice(0, 200), source: "organizations" });
        setState({ step: "error", message: "Couldn't add you just now. Please try again." });
        return;
      }
      if (!data.ok) {
        capture("org_join_failed", { provider, reason: data.error });
        setState({ step: "error", message: failure(data.error, orgName) });
        return;
      }
      capture("org_joined", { provider, already: !!data.already, plan: data.plan, ended: !!data.ended });
      setState({ step: "joined", joined: { provider, already: !!data.already, until: data.until, ended: !!data.ended } });
    })().catch((e) => {
      capture("app_error", { where: "org_join_finish", message: String((e as Error)?.message ?? e).slice(0, 200), source: "organizations" });
      setState({ step: "error", message: "Something went wrong. Please try again." });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps -- once, on the return from the sign-in
  }, []);

  const start = async (provider: Provider) => {
    capture("org_join_signin_tapped", { provider });
    setState({ step: "working", provider });
    const { error } = await supabase().auth.signInWithOAuth({
      provider,
      options: { redirectTo: `${window.location.origin}/o/${code}?join=${provider}` },
    });
    if (error) {
      capture("app_error", { where: "org_join_signin_start", provider, message: error.message.slice(0, 200), source: "organizations" });
      setState({ step: "error", message: "Signing in didn't work. Please try again." });
    }
  };

  if (state.step === "joined") {
    const j = state.joined;
    if (j.ended) {
      return (
        <div className="text-center">
          <p className="text-xl font-bold text-gray-900">Your free days have ended</p>
          <p className="mt-1 text-[15px] leading-relaxed text-gray-600">
            Your Captio AI from {orgName} ended on {longDate(j.until)}. Ask {orgName} about keeping it.
          </p>
        </div>
      );
    }
    return (
      <div className="text-center">
        <svg width="44" height="44" viewBox="0 0 44 44" aria-hidden className="mx-auto">
          <rect width="44" height="44" rx="12" fill="#1C49F5" />
          <path d="M13.5 22.5l5.5 5.5L30.5 16.5" fill="none" stroke="#fff" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <p className="mt-3 text-xl font-bold text-gray-900">{j.already ? "You're already in" : "You're in"}</p>
        <p className="mt-1 text-[15px] leading-relaxed text-gray-600">
          You have the full version of Captio AI until {longDate(j.until)}.
        </p>
        <StoreLinks provider={j.provider} />
      </div>
    );
  }

  const busy = state.step === "working";
  return (
    <div>
      <ol className="mb-6 flex flex-col gap-2.5 text-[15px] text-gray-700">
        <li className="flex gap-3"><span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-[6px] bg-brand-light text-[13px] font-bold text-brand">1</span>Continue with Apple or Google below</li>
        <li className="flex gap-3"><span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-[6px] bg-brand-light text-[13px] font-bold text-brand">2</span>Get Captio AI from the App Store or Google Play</li>
        <li className="flex gap-3"><span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-[6px] bg-brand-light text-[13px] font-bold text-brand">3</span>Sign in to the app with the same account</li>
      </ol>
      <div className="flex flex-col gap-3">
        <button
          type="button"
          disabled={busy}
          onClick={() => start("apple")}
          className="flex items-center justify-center gap-2.5 rounded-lg bg-black px-5 py-4 text-[17px] font-semibold text-white disabled:opacity-60"
        >
          <svg width="17" height="20" viewBox="0 0 17 20" aria-hidden fill="currentColor">
            <path d="M14.1 10.6c0-2.6 2.1-3.8 2.2-3.9-1.2-1.8-3.1-2-3.7-2-1.6-.2-3.1.9-3.9.9-.8 0-2-.9-3.4-.9-1.7 0-3.3 1-4.2 2.6-1.8 3.1-.5 7.7 1.3 10.2.9 1.2 1.9 2.6 3.2 2.6 1.3-.1 1.8-.8 3.3-.8 1.6 0 2 .8 3.4.8 1.4 0 2.3-1.3 3.1-2.5 1-1.4 1.4-2.8 1.4-2.9 0 0-2.7-1-2.7-4.1zM11.5 3c.7-.9 1.2-2 1-3.2-1 0-2.3.7-3 1.6-.7.8-1.3 2-1.1 3.1 1.1.1 2.3-.6 3.1-1.5z" />
          </svg>
          {busy && state.provider === "apple" ? "Signing in…" : "Continue with Apple"}
        </button>
        <button
          type="button"
          disabled={busy}
          onClick={() => start("google")}
          className="flex items-center justify-center gap-2.5 rounded-lg bg-white px-5 py-4 text-[17px] font-semibold text-gray-900 ring-1 ring-gray-300 transition-colors hover:bg-gray-50 disabled:opacity-60"
        >
          <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden>
            <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z" />
            <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" />
            <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-8l-6.5 5C9.5 39.6 16.2 44 24 44z" />
            <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.4-.4-3.5z" />
          </svg>
          {busy && state.provider === "google" ? "Signing in…" : "Continue with Google"}
        </button>
      </div>
      <p className="mt-4 text-center text-[14px] leading-relaxed text-gray-500">
        Already use Captio AI? Continue with the account you use in the app.
      </p>
      {plan === "pilot" && <p className="mt-2 text-center text-[13px] text-gray-400">Nothing to pay. It simply ends after the free days.</p>}
      {state.step === "error" && <p className="mt-3 text-center text-[14px] font-medium text-red-600" role="alert">{state.message}</p>}
    </div>
  );
}
