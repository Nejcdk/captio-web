"use client";

import { useEffect, useState } from "react";
import posthog from "posthog-js";

// The way into the app, and its tracking. The button first puts the link on the
// clipboard: a phone that installs the app from here has no other way to carry
// the code through the store, and the app looks for it there once, after its
// first sign-in, and applies the invite by itself.
//
// No try at captio://: nearly everyone here hasn't got the app (with it, the
// universal link never shows this page), and Safari answers an unknown scheme
// with an error alert.
//
// Events (PostHog, platform "web"; never the code):
//   referral_page_viewed      device, in_app_browser
//   referral_page_get_tapped  from (card | header), device, in_app_browser, copied
//   referral_page_code_copied device, in_app_browser, ok

const IOS_STORE = "https://apps.apple.com/app/apple-store/id6796617180?pt=129242349&ct=referral";
const PLAY_STORE = "https://play.google.com/store/apps/details?id=com.captio.app";

type From = "card" | "header";

function device(): "ios" | "android" | "desktop" {
  const ua = navigator.userAgent;
  if (/iPhone|iPad|iPod/i.test(ua) || (/Macintosh/.test(ua) && navigator.maxTouchPoints > 1)) return "ios";
  if (/Android/i.test(ua)) return "android";
  return "desktop";
}

// Instagram, Facebook, TikTok… open links in their own browser, where the
// clipboard often doesn't work. The code on the page is the backup.
function inAppBrowser(): string | undefined {
  const m = navigator.userAgent.match(/(Instagram|FBAN|FBAV|LinkedInApp|TikTok|musical_ly|Snapchat|Line\/|GSA\/)/);
  return m ? m[1].replace("/", "") : undefined;
}

function capture(event: string, props: Record<string, unknown>) {
  try {
    posthog.capture(event, { ...props, page: "referral" }, { transport: "sendBeacon", send_instantly: true });
  } catch {
    // Analytics must never stop the way into the app.
  }
}

async function get(code: string, from: From) {
  // Inside the tap: browsers only let a page write the clipboard then.
  let copied = false;
  try {
    await navigator.clipboard.writeText(`https://captioai.app/i/${code}`);
    copied = true;
  } catch {
    // Non-secure page, or an in-app browser.
  }
  const d = device();
  capture("referral_page_get_tapped", { from, device: d, in_app_browser: inAppBrowser(), copied });
  window.location.href = d === "android" ? PLAY_STORE : IOS_STORE;
}

// The code in a dashed box, the copy icon on the right: the whole box is the
// button. The app also accepts the bare code from the clipboard.
export function CopyCode({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    let ok = false;
    try {
      await navigator.clipboard.writeText(code);
      ok = true;
    } catch {
      // Non-secure page, or an in-app browser: the older way still works there.
      const field = document.createElement("textarea");
      field.value = code;
      field.setAttribute("readonly", "");
      field.style.position = "fixed";
      field.style.opacity = "0";
      document.body.appendChild(field);
      field.select();
      ok = document.execCommand("copy");
      field.remove();
    }
    capture("referral_page_code_copied", { device: device(), in_app_browser: inAppBrowser(), ok });
    if (!ok) return;
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button
      type="button"
      onClick={copy}
      aria-label={`Copy code ${code}`}
      className="flex w-full items-center justify-between rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 px-4 py-3.5"
    >
      <span className="text-[22px] font-bold tracking-[0.18em] text-gray-900">{code}</span>
      <span className="flex items-center gap-1.5 text-[14px] font-semibold text-brand">
        {copied && "Copied"}
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          {copied ? (
            <path d="M5 12l5 5l10 -10" />
          ) : (
            <>
              <path d="M7 9.667a2.667 2.667 0 0 1 2.667 -2.667h8.666a2.667 2.667 0 0 1 2.667 2.667v8.666a2.667 2.667 0 0 1 -2.667 2.667h-8.666a2.667 2.667 0 0 1 -2.667 -2.667z" />
              <path d="M4.012 16.737a2.005 2.005 0 0 1 -1.012 -1.737v-10c0 -1.1 .9 -2 2 -2h10c.75 0 1.158 .385 1.5 1" />
            </>
          )}
        </svg>
      </span>
    </button>
  );
}

export function GetApp({ code }: { code: string }) {
  return (
    <button
      type="button"
      onClick={() => get(code, "card")}
      className="w-full rounded-lg bg-brand px-5 py-4 text-[17px] font-bold text-white transition-colors hover:bg-brand/90"
    >
      Get Captio AI
    </button>
  );
}

export function GetAppHeader({ code }: { code: string }) {
  return (
    <button
      type="button"
      onClick={() => get(code, "header")}
      className="inline-flex items-center justify-center rounded-[8px] bg-white px-4 py-2.5 text-sm font-semibold text-brand"
    >
      Get Captio AI
    </button>
  );
}

export function PageViewed() {
  useEffect(() => {
    capture("referral_page_viewed", { device: device(), in_app_browser: inAppBrowser() });
  }, []);
  return null;
}
