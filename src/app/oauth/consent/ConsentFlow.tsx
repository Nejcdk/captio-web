"use client";

import { useEffect, useRef, useState } from "react";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import posthog from "posthog-js";

// Connecting a chat app (Claude, ChatGPT…) to a Captio AI account:
// sign in with the account used in the app (Apple or Google, through the app's
// Supabase) → see what the chat app gets → Allow / Cancel → back to the chat
// app with Supabase's answer. The site keeps nothing: the sign-in lives in
// sessionStorage and is signed out again once the person decides (the chat
// app's own access is a separate grant; this doesn't touch it).

type Provider = "google" | "apple";
type State =
  | { step: "loading" }
  | { step: "signin"; working?: Provider }
  | { step: "consent"; client: string; email: string; recordings: number | null; working?: "allow" | "deny" }
  | { step: "leaving" }
  | { step: "error"; message: string };

function capture(event: string, props: Record<string, unknown> = {}) {
  try {
    posthog.capture(event, { ...props, page: "connector_consent" }, { transport: "sendBeacon", send_instantly: true });
  } catch {
    // Analytics must never block connecting.
  }
}

const EXPIRED = "This request has expired. Start connecting again from your chat app.";

export function ConsentFlow({ authorizationId, supabaseUrl, anonKey }: {
  authorizationId: string;
  supabaseUrl: string;
  anonKey: string;
}) {
  const [state, setState] = useState<State>({ step: "loading" });
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
          storageKey: "captio-connect",
        },
      });
    }
    return client.current;
  };
  const here = () => `${window.location.origin}/oauth/consent?authorization_id=${encodeURIComponent(authorizationId)}`;

  const showConsent = async () => {
    const sb = supabase();
    const { data, error } = await sb.auth.oauth.getAuthorizationDetails(authorizationId);
    if (error || !data) {
      capture("connector_error", { where: "details", message: (error?.message ?? "no data").slice(0, 120) });
      setState({ step: "error", message: EXPIRED });
      return;
    }
    if (!("authorization_id" in data)) {
      // Allowed before: straight back to the chat app.
      capture("connector_consent_skipped");
      await leave(data.redirect_url);
      return;
    }
    const { data: me } = await sb.rpc("connector_me");
    const recordings = typeof me?.recordings === "number" ? me.recordings : null;
    capture("connector_consent_viewed", { client: data.client.name, recordings });
    setState({ step: "consent", client: data.client.name || "Your chat app", email: data.user.email, recordings });
  };

  const leave = async (url: string) => {
    setState({ step: "leaving" });
    await supabase().auth.signOut({ scope: "local" }).catch(() => {});
    window.location.href = url;
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const providerError = params.get("error_description") ?? params.get("error");
    const authCode = params.get("code");
    if (authCode || providerError) window.history.replaceState(null, "", here());
    (async () => {
      const sb = supabase();
      if (providerError) {
        capture("connector_error", { where: "signin_return", message: providerError.slice(0, 120) });
        setState({ step: "signin" });
        return;
      }
      if (authCode) {
        const { error } = await sb.auth.exchangeCodeForSession(authCode);
        if (error) {
          capture("connector_error", { where: "signin_exchange", message: error.message.slice(0, 120) });
          setState({ step: "signin" });
          return;
        }
        capture("connector_signed_in");
      }
      const { data: { session } } = await sb.auth.getSession();
      if (!session) {
        capture("connector_signin_viewed");
        setState({ step: "signin" });
        return;
      }
      await showConsent();
    })().catch((e) => {
      capture("connector_error", { where: "load", message: String((e as Error)?.message ?? e).slice(0, 120) });
      setState({ step: "error", message: "Something went wrong. Please try again." });
    });
  }, []);

  const signIn = async (provider: Provider) => {
    capture("connector_signin_tapped", { provider });
    setState({ step: "signin", working: provider });
    const { error } = await supabase().auth.signInWithOAuth({ provider, options: { redirectTo: here() } });
    if (error) {
      capture("connector_error", { where: "signin_start", provider, message: error.message.slice(0, 120) });
      setState({ step: "error", message: "Signing in didn't work. Please try again." });
    }
  };

  const decide = async (allow: boolean) => {
    if (state.step !== "consent") return;
    setState({ ...state, working: allow ? "allow" : "deny" });
    const sb = supabase();
    const { data, error } = allow
      ? await sb.auth.oauth.approveAuthorization(authorizationId, { skipBrowserRedirect: true })
      : await sb.auth.oauth.denyAuthorization(authorizationId, { skipBrowserRedirect: true });
    capture("connector_consent_decided", { allow, client: state.client, ok: !error });
    if (error || !data?.redirect_url) {
      setState({ step: "error", message: EXPIRED });
      return;
    }
    await leave(data.redirect_url);
  };

  const switchAccount = async () => {
    capture("connector_switch_account");
    await supabase().auth.signOut({ scope: "local" }).catch(() => {});
    setState({ step: "signin" });
  };

  if (state.step === "loading" || state.step === "leaving") {
    return <p className="py-10 text-[16px] text-gray-500">{state.step === "leaving" ? "Going back to your chat app…" : "Loading…"}</p>;
  }

  if (state.step === "error") {
    return (
      <>
        <h1 className="text-2xl font-bold text-gray-900">Couldn&rsquo;t connect</h1>
        <p className="mt-3 text-[16px] text-gray-600">{state.message}</p>
      </>
    );
  }

  if (state.step === "signin") {
    const busy = !!state.working;
    return (
      <div>
        <h1 className="text-[26px] font-bold leading-tight text-gray-900">Connect your recordings</h1>
        <p className="mt-2 text-[16px] leading-relaxed text-gray-600">
          Sign in with the account you use in the Captio AI app.
        </p>
        <div className="mx-auto mt-7 flex max-w-sm flex-col gap-3">
          <button
            type="button"
            disabled={busy}
            onClick={() => signIn("apple")}
            className="flex items-center justify-center gap-2.5 rounded-lg bg-black px-5 py-4 text-[17px] font-semibold text-white disabled:opacity-60"
          >
            <svg width="17" height="20" viewBox="0 0 17 20" aria-hidden fill="currentColor">
              <path d="M14.1 10.6c0-2.6 2.1-3.8 2.2-3.9-1.2-1.8-3.1-2-3.7-2-1.6-.2-3.1.9-3.9.9-.8 0-2-.9-3.4-.9-1.7 0-3.3 1-4.2 2.6-1.8 3.1-.5 7.7 1.3 10.2.9 1.2 1.9 2.6 3.2 2.6 1.3-.1 1.8-.8 3.3-.8 1.6 0 2 .8 3.4.8 1.4 0 2.3-1.3 3.1-2.5 1-1.4 1.4-2.8 1.4-2.9 0 0-2.7-1-2.7-4.1zM11.5 3c.7-.9 1.2-2 1-3.2-1 0-2.3.7-3 1.6-.7.8-1.3 2-1.1 3.1 1.1.1 2.3-.6 3.1-1.5z" />
            </svg>
            {state.working === "apple" ? "Signing in…" : "Continue with Apple"}
          </button>
          <button
            type="button"
            disabled={busy}
            onClick={() => signIn("google")}
            className="flex items-center justify-center gap-2.5 rounded-lg bg-white px-5 py-4 text-[17px] font-semibold text-gray-900 ring-1 ring-gray-300 transition-colors hover:bg-gray-50 disabled:opacity-60"
          >
            <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden>
              <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z" />
              <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" />
              <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-8l-6.5 5C9.5 39.6 16.2 44 24 44z" />
              <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.4-.4-3.5z" />
            </svg>
            {state.working === "google" ? "Signing in…" : "Continue with Google"}
          </button>
        </div>
      </div>
    );
  }

  const busy = !!state.working;
  return (
    <div>
      <h1 className="text-[26px] font-bold leading-tight text-gray-900">
        {state.client} wants to read your Captio AI recordings
      </h1>
      <p className="mt-2 text-[15px] text-gray-500">Signed in as {state.email}</p>
      {state.recordings === 0 && (
        <p className="mx-auto mt-4 max-w-sm rounded-lg bg-amber-50 px-4 py-3 text-[15px] leading-relaxed text-amber-900">
          This account has no recordings of its own yet. Is it the one you use in the app?
        </p>
      )}
      <ul className="mx-auto mt-6 max-w-sm space-y-3 text-left text-[16px] leading-snug text-gray-700">
        <li className="flex gap-3"><span aria-hidden>✅</span>Search and read your transcripts and summaries</li>
        <li className="flex gap-3"><span aria-hidden>✅</span>Recordings in folders shared with you too</li>
        <li className="flex gap-3"><span aria-hidden>✅</span>Who said what, and when</li>
        <li className="flex gap-3"><span aria-hidden>🔒</span>It can&rsquo;t change, delete or record anything</li>
      </ul>
      <div className="mx-auto mt-8 flex max-w-sm flex-col gap-3">
        <button
          type="button"
          disabled={busy}
          onClick={() => decide(true)}
          className="rounded-lg bg-brand px-5 py-4 text-[17px] font-bold text-white transition-colors hover:bg-brand/90 disabled:opacity-60"
        >
          {state.working === "allow" ? "Connecting…" : "Allow"}
        </button>
        <button
          type="button"
          disabled={busy}
          onClick={() => decide(false)}
          className="rounded-lg bg-white px-5 py-4 text-[17px] font-semibold text-gray-700 ring-1 ring-gray-300 transition-colors hover:bg-gray-50 disabled:opacity-60"
        >
          Cancel
        </button>
      </div>
      <p className="mt-5 text-[14px] leading-relaxed text-gray-500">
        You can disconnect any time in {state.client}&rsquo;s settings.{" "}
        <button type="button" onClick={switchAccount} disabled={busy} className="font-semibold text-brand underline-offset-2 hover:underline">
          Use another account
        </button>
      </p>
    </div>
  );
}
