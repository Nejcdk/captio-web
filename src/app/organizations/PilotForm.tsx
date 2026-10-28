"use client";

import { useEffect, useRef, useState } from "react";
import posthog from "posthog-js";

// The free pilot, started in one step: the link to forward goes to the email
// address typed here (POST /api/org-pilot → org_pilot_request in the app
// repo's supabase/organizations.sql), so it's never shown on this page.
//
// Events (PostHog, platform "web"; never the email or the name):
//   org_pilot_form_started  first time someone types in it
//   org_pilot_form_sent     ok, resent, error, people, free_mail

type State =
  | { step: "idle" }
  | { step: "sending" }
  | { step: "sent"; email: string; resent: boolean }
  | { step: "error"; message: string };

const PEOPLE = [
  { value: "1-5", label: "1 to 5" },
  { value: "6-19", label: "6 to 19" },
  { value: "20-50", label: "20 to 50" },
  { value: "50+", label: "More than 50" },
];

const ERRORS: Record<string, string> = {
  org: "Please add your organization's name.",
  email: "That email address doesn't look right.",
  too_many: "Too many requests from here today. Please write to hello@captioai.app instead.",
  domain_limit: "Your organization already has pilots running. Write to hello@captioai.app and we'll add more.",
  busy: "We've had a lot of requests today. Please write to hello@captioai.app and you'll have your link within a day.",
};

function capture(event: string, props: Record<string, unknown>) {
  try {
    posthog.capture(event, { ...props, page: "organizations" }, { transport: "sendBeacon", send_instantly: true });
  } catch {
    // Analytics must never stop the form.
  }
}

const field =
  "w-full rounded-[8px] border border-gray-300 bg-white px-4 py-3 text-base text-gray-900 placeholder:text-gray-400 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20";

export function PilotForm() {
  const [state, setState] = useState<State>({ step: "idle" });
  const shownAt = useRef(0);
  const started = useRef(false);
  useEffect(() => {
    shownAt.current = Date.now();
  }, []);

  const onStart = () => {
    if (started.current) return;
    started.current = true;
    capture("org_pilot_form_started", {});
  };

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const email = String(f.get("email") ?? "").trim();
    const people = String(f.get("people") ?? "");
    setState({ step: "sending" });
    let timeZone: string | null = null;
    try {
      timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone ?? null;
    } catch {
      // Older browsers: the server guesses from the country.
    }
    try {
      const res = await fetch("/api/org-pilot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          org: f.get("org"),
          name: f.get("name"),
          email,
          people,
          timeZone,
          website: f.get("website"),
          ms: Date.now() - shownAt.current,
        }),
      });
      const answer = await res.json().catch(() => ({ ok: false, error: "server" }));
      const freeMail = /@(gmail|googlemail|outlook|hotmail|live|yahoo|icloud|me|aol|proton|gmx)\./i.test(email);
      capture("org_pilot_form_sent", { ok: !!answer.ok, resent: !!answer.resent, error: answer.error, people, free_mail: freeMail });
      if (answer.ok) {
        setState({ step: "sent", email, resent: !!answer.resent });
        return;
      }
      setState({
        step: "error",
        message: ERRORS[answer.error] ?? `Something went wrong${answer.code ? ` (code ${answer.code})` : ""}. Please try again, or write to hello@captioai.app.`,
      });
    } catch {
      capture("org_pilot_form_sent", { ok: false, error: "network", people });
      setState({ step: "error", message: "Couldn't send. Check your connection and try again." });
    }
  };

  if (state.step === "sent") {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-6 sm:p-8 text-center" role="status">
        <svg width="44" height="44" viewBox="0 0 44 44" aria-hidden className="mx-auto">
          <rect width="44" height="44" rx="12" fill="#1C49F5" />
          <path d="M13.5 22.5l5.5 5.5L30.5 16.5" fill="none" stroke="#fff" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <h3 className="mt-4 text-xl font-bold text-gray-900">Check your inbox</h3>
        <p className="mt-2 text-gray-600 leading-relaxed">
          {state.resent ? "We've sent your pilot link again to " : "Your pilot link is on its way to "}
          <span className="font-semibold text-gray-900 break-all">{state.email}</span>, with a message you can forward to the people who&rsquo;ll use it.
        </p>
        <p className="mt-3 text-sm text-gray-500">
          It usually arrives within a minute. Not there? Check your spam folder, or write to{" "}
          <a href="mailto:hello@captioai.app" className="font-semibold text-brand hover:underline">hello@captioai.app</a>.
        </p>
      </div>
    );
  }

  const busy = state.step === "sending";
  return (
    <form onSubmit={submit} onFocus={onStart} className="rounded-xl border border-gray-200 bg-white p-6 sm:p-8 flex flex-col gap-4 text-left">
      <div className="grid sm:grid-cols-2 gap-4">
        <label className="flex flex-col gap-1.5">
          <span className="text-sm font-semibold text-gray-700">Organization</span>
          <input name="org" required minLength={2} maxLength={120} autoComplete="organization" className={field} />
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="text-sm font-semibold text-gray-700">Your name</span>
          <input name="name" maxLength={80} autoComplete="name" className={field} />
        </label>
      </div>
      <label className="flex flex-col gap-1.5">
        <span className="text-sm font-semibold text-gray-700">Your work email</span>
        <input name="email" type="email" required maxLength={200} autoComplete="email" inputMode="email" className={field} />
        <span className="text-xs text-gray-500">The pilot link is sent here.</span>
      </label>
      <label className="flex flex-col gap-1.5">
        <span className="text-sm font-semibold text-gray-700">About how many people might use it?</span>
        <select name="people" defaultValue="1-5" className={field}>
          {PEOPLE.map((p) => (
            <option key={p.value} value={p.value}>{p.label}</option>
          ))}
        </select>
      </label>
      {/* For bots only: people never see it. */}
      <input name="website" tabIndex={-1} autoComplete="off" aria-hidden className="hidden" />
      <button
        type="submit"
        disabled={busy}
        className="mt-1 inline-flex items-center justify-center rounded-[8px] bg-cta px-6 py-3.5 text-base font-semibold text-white transition-colors hover:bg-cta-dark disabled:opacity-60"
      >
        {busy ? "Sending…" : "Send me the pilot link"}
      </button>
      {state.step === "error" && <p className="text-sm font-medium text-red-600" role="alert">{state.message}</p>}
      <p className="text-xs text-gray-500 text-center">
        Free for 30 days, up to 5 people. Nothing to pay, nothing to sign.
      </p>
    </form>
  );
}
