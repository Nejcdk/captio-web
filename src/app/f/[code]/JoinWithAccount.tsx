"use client";

import { useEffect, useRef, useState } from "react";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import posthog from "posthog-js";
import { INVITE_STORE_LINK } from "@/lib/folderInvite";

// For people without the app: sign in here with the account they'll use in the
// app (Apple or Google, through the app's own Supabase), join the folder now,
// then get the app — once they sign in there with the same account, the folder
// and its recordings are already waiting. No code, no clipboard.
//
// Flow: Continue with … → the provider → back to this page (?join=<provider>
// plus Supabase's ?code=) → session → join_folder() → signed out again (the
// site keeps nothing) → "You're in" with the App Store button.
// The sign-in's own short-lived data lives in sessionStorage only.
//
// Apple on the web: Services ID com.captio.nejcdovzan.web, key 3XBDAZ5Q88; its
// client secret in Supabase's Apple provider expires every 6 months (next:
// 2027-04-18 — renew with credentials/apple/README.txt in the app repo).
const APPLE_WEB_SIGNIN = true;

type Provider = "google" | "apple";
type State =
  | { step: "idle" }
  | { step: "working"; provider: Provider }
  | { step: "joined"; provider: Provider; already: boolean }
  | { step: "error"; message: string };

function capture(event: string, props: Record<string, unknown>) {
  try {
    posthog.capture(event, { ...props, page: "folder_invite" }, { transport: "sendBeacon", send_instantly: true });
  } catch {
    // Analytics must never block joining.
  }
}

const PROVIDER_NAME: Record<Provider, string> = { google: "Google", apple: "Apple" };

export function JoinWithAccount({ code, folderName, supabaseUrl, anonKey }: {
  code: string;
  folderName: string;
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
          storageKey: "captio-folder-invite",
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
    window.history.replaceState(null, "", `/f/${code}`);
    if (providerError) {
      capture("folder_invite_web_signin_returned", { provider, ok: false, error: providerError.slice(0, 120) });
      setState({ step: "error", message: "Signing in didn't work. Please try again." });
      return;
    }
    setState({ step: "working", provider });
    (async () => {
      const sb = supabase();
      const { data: { session }, error } = authCode
        ? await sb.auth.exchangeCodeForSession(authCode)
        : { data: { session: null }, error: new Error("no auth code") };
      if (error || !session) {
        capture("folder_invite_web_signin_returned", { provider, ok: false, error: (error?.message ?? "no session").slice(0, 120) });
        setState({ step: "error", message: "Signing in didn't work. Please try again." });
        return;
      }
      capture("folder_invite_web_signin_returned", { provider, ok: true });
      const { data, error: joinError } = await sb.rpc("join_folder", { p_code: code, p_device: null });
      await sb.auth.signOut({ scope: "local" }).catch(() => {});
      if (joinError || !data) {
        capture("folder_invite_error", { where: "web_join", message: (joinError?.message ?? "no data").slice(0, 120) });
        setState({ step: "error", message: "Couldn't join the folder. Please try again." });
        return;
      }
      if (!data.ok) {
        capture("folder_invite_web_join_failed", { provider, reason: data.error });
        setState({
          step: "error",
          message: data.error === "folder_full" ? "This folder is full." : "This invite doesn't work anymore. Ask for a new one.",
        });
        return;
      }
      capture("folder_invite_web_joined", { provider, already: !!data.already, referral: !!data.referral });
      setState({ step: "joined", provider, already: !!data.already });
    })().catch((e) => {
      capture("folder_invite_error", { where: "web_signin_finish", message: String((e as Error)?.message ?? e).slice(0, 120) });
      setState({ step: "error", message: "Something went wrong. Please try again." });
    });
  }, []);

  const start = async (provider: Provider) => {
    capture("folder_invite_web_signin_tapped", { provider });
    setState({ step: "working", provider });
    const { error } = await supabase().auth.signInWithOAuth({
      provider,
      options: { redirectTo: `${window.location.origin}/f/${code}?join=${provider}` },
    });
    if (error) {
      capture("folder_invite_error", { where: "web_signin_start", provider, message: error.message.slice(0, 120) });
      setState({ step: "error", message: "Signing in didn't work. Please try again." });
    }
  };

  if (state.step === "joined") {
    return (
      <div>
        <svg width="44" height="44" viewBox="0 0 44 44" aria-hidden className="mx-auto">
          <rect width="44" height="44" rx="12" fill="#1C49F5" />
          <path d="M13.5 22.5l5.5 5.5L30.5 16.5" fill="none" stroke="#fff" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <p className="mt-3 text-xl font-bold text-gray-900">You&rsquo;re in</p>
        <p className="mt-1 text-[15px] leading-relaxed text-gray-600">
          Get Captio AI and sign in with the same {PROVIDER_NAME[state.provider]} account. {folderName} will be waiting.
        </p>
        <a
          href={INVITE_STORE_LINK}
          onClick={() => capture("folder_invite_store_redirect", { from: "joined", copied: false, reason: "joined_on_web" })}
          className="mt-6 block rounded-lg bg-brand px-5 py-4 text-[17px] font-bold text-white transition-colors hover:bg-brand/90"
        >
          Get Captio AI
        </a>
      </div>
    );
  }

  const busy = state.step === "working";
  return (
    <div>
      <div className="flex flex-col gap-3">
        {APPLE_WEB_SIGNIN && (
          <button
            type="button"
            disabled={busy}
            onClick={() => start("apple")}
            className="flex items-center justify-center gap-2.5 rounded-lg bg-black px-5 py-4 text-[17px] font-semibold text-white disabled:opacity-60"
          >
            <svg width="17" height="20" viewBox="0 0 17 20" aria-hidden fill="currentColor">
              <path d="M14.1 10.6c0-2.6 2.1-3.8 2.2-3.9-1.2-1.8-3.1-2-3.7-2-1.6-.2-3.1.9-3.9.9-.8 0-2-.9-3.4-.9-1.7 0-3.3 1-4.2 2.6-1.8 3.1-.5 7.7 1.3 10.2.9 1.2 1.9 2.6 3.2 2.6 1.3-.1 1.8-.8 3.3-.8 1.6 0 2 .8 3.4.8 1.4 0 2.3-1.3 3.1-2.5 1-1.4 1.4-2.8 1.4-2.9 0 0-2.7-1-2.7-4.1zM11.5 3c.7-.9 1.2-2 1-3.2-1 0-2.3.7-3 1.6-.7.8-1.3 2-1.1 3.1 1.1.1 2.3-.6 3.1-1.5z" />
            </svg>
            Continue with Apple
          </button>
        )}
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
          {busy && state.step === "working" && state.provider === "google" ? "Signing in…" : "Continue with Google"}
        </button>
      </div>
      <p className="mt-4 text-[14px] leading-relaxed text-gray-500">
        Then sign in to Captio AI with the same account.
      </p>
      {state.step === "error" && <p className="mt-3 text-[14px] font-medium text-red-600">{state.message}</p>}
    </div>
  );
}
