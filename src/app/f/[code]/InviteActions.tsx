"use client";

import { useEffect } from "react";
import posthog from "posthog-js";
import { INVITE_STORE_LINK } from "@/lib/folderInvite";

// The invite page's two ways into the app, and its tracking.
//
// Both first put the invite link on the clipboard: a phone that installs the
// app from here has no other way to carry the code through the App Store, and
// the app looks for it there once, after its first sign-in (src/lib/
// folderSharing.ts in the app repo), and joins the folder by itself.
//
// "Open in Captio AI" then tries the app (captio://join/<code>); if the page is
// still on screen a moment later the app isn't installed, so it goes to the App
// Store. "Get Captio AI" (header) goes to the App Store straight away.
//
// Events (PostHog, platform "web"; never the code itself — it lets anyone in):
//   folder_invite_page_viewed   valid, members, recordings, has_inviter, device, in_app_browser
//   folder_invite_open_tapped   from (card | header), device, in_app_browser
//   folder_invite_clipboard     ok, error, from
//   folder_invite_app_opened    from, ms (the app took the page away)
//   folder_invite_store_redirect from, copied, reason (header | app_not_opened | not_ios)
//   folder_invite_error         where, message

const OPEN_TIMEOUT_MS = 1600;

type From = "card" | "header";

function device(): "ios" | "android" | "desktop" {
  const ua = navigator.userAgent;
  if (/iPhone|iPad|iPod/i.test(ua) || (/Macintosh/.test(ua) && navigator.maxTouchPoints > 1)) return "ios";
  if (/Android/i.test(ua)) return "android";
  return "desktop";
}

// Instagram, Facebook, LinkedIn, TikTok… open links in their own browser, where
// opening another app and the clipboard often don't work.
function inAppBrowser(): string | undefined {
  const ua = navigator.userAgent;
  const m = ua.match(/(Instagram|FBAN|FBAV|LinkedInApp|TikTok|musical_ly|Snapchat|Line\/|GSA\/)/);
  return m ? m[1].replace("/", "") : undefined;
}

function capture(event: string, props: Record<string, unknown>) {
  try {
    posthog.capture(event, { ...props, page: "folder_invite" }, { transport: "sendBeacon", send_instantly: true });
  } catch {
    // Analytics must never stop the way into the app.
  }
}

async function copyInvite(code: string, from: From): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(`https://captioai.app/f/${code}`);
    capture("folder_invite_clipboard", { ok: true, from });
    return true;
  } catch (e) {
    capture("folder_invite_clipboard", { ok: false, from, error: String((e as Error)?.name ?? e).slice(0, 80) });
    return false;
  }
}

function toStore(from: From, copied: boolean, reason: string) {
  capture("folder_invite_store_redirect", { from, copied, reason, device: device() });
  window.location.href = INVITE_STORE_LINK;
}

function open(code: string, from: From) {
  const d = device();
  const iab = inAppBrowser();
  capture("folder_invite_open_tapped", { from, device: d, in_app_browser: iab });
  // Started inside the tap: browsers only let a page write the clipboard then.
  const copying = copyInvite(code, from);

  if (from === "header" || d !== "ios") {
    void copying.then((copied) => toStore(from, copied, from === "header" ? "header" : "not_ios"));
    return;
  }

  const startedAt = Date.now();
  let left = false;
  const onHide = () => {
    if (document.visibilityState !== "hidden" || left) return;
    left = true;
    capture("folder_invite_app_opened", { from, ms: Date.now() - startedAt });
  };
  document.addEventListener("visibilitychange", onHide);
  try {
    window.location.href = `captio://join/${code}`;
  } catch (e) {
    capture("folder_invite_error", { where: "open_scheme", message: String((e as Error)?.message ?? e).slice(0, 120) });
  }
  setTimeout(async () => {
    document.removeEventListener("visibilitychange", onHide);
    if (left) return;
    toStore(from, await copying, "app_not_opened");
  }, OPEN_TIMEOUT_MS);
}

export function OpenInApp({ code }: { code: string }) {
  return (
    <button
      type="button"
      onClick={() => open(code, "card")}
      className="w-full rounded-lg bg-brand px-5 py-4 text-[17px] font-bold text-white transition-colors hover:bg-brand/90"
    >
      Open in Captio AI
    </button>
  );
}

// The header's CTA, like the shared-recording page's.
export function GetAppHeader({ code }: { code: string | null }) {
  return (
    <button
      type="button"
      onClick={() => {
        if (code) open(code, "header");
        else toStore("header", false, "header");
      }}
      className="inline-flex items-center justify-center rounded-[8px] bg-white px-4 py-2.5 text-sm font-semibold text-brand transition-colors hover:bg-white/90 sm:px-5"
    >
      Get Captio AI
    </button>
  );
}

export function InviteViewed(props: { valid: boolean; error: boolean; members?: number; recordings?: number; hasInviter?: boolean }) {
  useEffect(() => {
    if (props.error) capture("folder_invite_error", { where: "load_invite", message: "folder_invite_info failed" });
    capture("folder_invite_page_viewed", {
      valid: props.valid,
      error: props.error,
      members: props.members,
      recordings: props.recordings,
      has_inviter: props.hasInviter,
      device: device(),
      in_app_browser: inAppBrowser(),
    });
  }, []);
  return null;
}
