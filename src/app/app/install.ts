"use client";

import { useSyncExternalStore } from "react";
import { capture, recordErrorOnce } from "./client";

// Installing the web app as a desktop app (Chrome, Edge: "Install Captio AI"
// in the address bar, and the row in Settings while the browser offers it).
// public/web-app/manifest.webmanifest + public/app-sw.js (scope /app).
// Installed launches open /app?from=installed (web_app_viewed from: installed).

type InstallEvent = Event & { prompt: () => Promise<void>; userChoice: Promise<{ outcome: "accepted" | "dismissed" }> };

let deferred: InstallEvent | null = null;
const listeners = new Set<() => void>();
const emit = () => listeners.forEach(l => l());
let started = false;

export function startInstallSupport() {
  if (started || typeof window === "undefined") return;
  started = true;
  window.addEventListener("beforeinstallprompt", e => {
    e.preventDefault();
    deferred = e as InstallEvent;
    emit();
  });
  window.addEventListener("appinstalled", () => {
    deferred = null;
    capture("web_app_installed");
    emit();
  });
  // Never in `next dev`: a worker there keeps serving old pages.
  if (process.env.NODE_ENV === "production" && "serviceWorker" in navigator) {
    navigator.serviceWorker.register("/app-sw.js", { scope: "/app" }).catch(e => recordErrorOnce("service_worker", e));
  }
}

export function isInstalled(): boolean {
  try {
    return window.matchMedia("(display-mode: standalone)").matches;
  } catch {
    return false;
  }
}

export async function promptInstall(): Promise<void> {
  const e = deferred;
  if (!e) return;
  capture("web_app_install_tapped");
  await e.prompt();
  const { outcome } = await e.userChoice;
  capture("web_app_install_answered", { outcome });
  deferred = null;
  emit();
}

export function useCanInstall(): boolean {
  return useSyncExternalStore(
    l => { listeners.add(l); return () => listeners.delete(l); },
    () => !!deferred,
    () => false,
  );
}
