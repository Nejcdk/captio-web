import { useState } from "react";
import Link from "next/link";
import { t } from "./i18n";

// Sign in or start a free account (Apple or Google, through the app's
// Supabase), the onboarding's Auth step on a computer. Someone who already
// uses the app signs in with the same account and finds their recordings. Apple on the web
// uses the Services ID the folder invite page set up (f/[code]). Like every
// link out of the app, the ones below open in a new tab.

export type Provider = "apple" | "google";

const APP_STORE_LINK = "https://apps.apple.com/app/apple-store/id6796617180?pt=129242349&ct=web_app&mt=8";

// `onTryFree`: use it without an account (app: "Skip for now"); `onBack`: a
// guest who came here to sign in goes back to their recordings.
export function SignIn({ onSignIn, error, onTryFree, onBack }: {
  onSignIn: (p: Provider) => Promise<void>; error: string | null; onTryFree?: () => void; onBack?: () => void;
}) {
  const [busy, setBusy] = useState<Provider | null>(null);
  const start = async (p: Provider) => {
    setBusy(p);
    await onSignIn(p);
    // Still here: the browser didn't go to Apple or Google.
    setBusy(null);
  };
  return (
    <main className="signin">
      <div className="inner">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="owl" src="/web-app/owl-wave.png" alt="" />
        <h1>{t("web.signIn.title")}</h1>
        <p className="lede">{t("web.signIn.lede")}</p>
        <div className="buttons">
          <button type="button" className="auth-btn apple" disabled={!!busy} onClick={() => start("apple")}>
            <svg width="17" height="20" viewBox="0 0 17 20" aria-hidden fill="currentColor">
              <path d="M14.1 10.6c0-2.6 2.1-3.8 2.2-3.9-1.2-1.8-3.1-2-3.7-2-1.6-.2-3.1.9-3.9.9-.8 0-2-.9-3.4-.9-1.7 0-3.3 1-4.2 2.6-1.8 3.1-.5 7.7 1.3 10.2.9 1.2 1.9 2.6 3.2 2.6 1.3-.1 1.8-.8 3.3-.8 1.6 0 2 .8 3.4.8 1.4 0 2.3-1.3 3.1-2.5 1-1.4 1.4-2.8 1.4-2.9 0 0-2.7-1-2.7-4.1zM11.5 3c.7-.9 1.2-2 1-3.2-1 0-2.3.7-3 1.6-.7.8-1.3 2-1.1 3.1 1.1.1 2.3-.6 3.1-1.5z" />
            </svg>
            {busy === "apple" ? t("web.signIn.signingIn") : t("auth.continueApple")}
          </button>
          <button type="button" className="auth-btn google" disabled={!!busy} onClick={() => start("google")}>
            <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden>
              <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z" />
              <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" />
              <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-8l-6.5 5C9.5 39.6 16.2 44 24 44z" />
              <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.4-.4-3.5z" />
            </svg>
            {busy === "google" ? t("web.signIn.signingIn") : t("auth.continueGoogle")}
          </button>
        </div>
        {error && <div className="error" role="alert">{error}</div>}
        {onTryFree && (
          <button type="button" className="signin-skip" onClick={onTryFree}>{t("web.signIn.tryWithoutAccount")}</button>
        )}
        {onBack && (
          <button type="button" className="signin-skip" onClick={onBack}>{t("common.notNow")}</button>
        )}
        <p className="quiet">{t("web.signIn.alreadyUseApp")}</p>
        <p className="quiet" style={{ marginTop: 8 }}>{t("web.signIn.preferPhone")} <a href={APP_STORE_LINK} target="_blank" rel="noopener">{t("web.signIn.getApp")}</a></p>
        <div className="legal">
          <Link href="/terms" target="_blank">{t("common.termsOfService")}</Link>
          <Link href="/privacy" target="_blank">{t("common.privacyPolicy")}</Link>
        </div>
      </div>
    </main>
  );
}
