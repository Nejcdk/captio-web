import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import posthog from "posthog-js";

// The browser side's one Supabase client, the calls to our own server
// (/api/app/*, with the session token) and analytics. Every file of the web
// app goes through here.

let sb: SupabaseClient | null = null;
let preview = false;

export function initClient(url: string, anonKey: string) {
  if (!sb) {
    sb = createClient(url, anonKey, {
      auth: { flowType: "pkce", detectSessionInUrl: true, persistSession: true, autoRefreshToken: true, storageKey: "captio-web-app" },
    });
  }
  return sb;
}

export function getSupabase(): SupabaseClient {
  if (!sb) throw new Error("Supabase client not ready");
  return sb;
}

// /app?preview=1 in `next dev`: made-up recordings, no account.
export function setPreview(on: boolean) { preview = on; }
export function isPreview() { return preview; }

// A guest: using the app without an account (app: "Skip for now"). Their
// recordings live in this browser; the server lets them through within a
// daily ceiling (src/lib/webapp/server.ts requireCaller).
let guest = false;
export function setGuest(on: boolean) { guest = on; }
export function isGuest() { return guest; }
// No account: recordings are kept in this browser (the dev preview or a guest).
export function isLocalOnly() { return preview || guest; }

// A guest's own random id, which ties their speech jobs to them.
function guestId(): string {
  let id = "";
  try { id = localStorage.getItem("captio_guest_id") ?? ""; } catch { /* storage blocked */ }
  if (id.length < 16) {
    const a = "abcdefghijklmnopqrstuvwxyz0123456789";
    id = Array.from(crypto.getRandomValues(new Uint8Array(24)), b => a[b % a.length]).join("");
    try { localStorage.setItem("captio_guest_id", id); } catch { /* this visit only */ }
  }
  return id;
}

// Something only an account can do (folders, invites, links, Plus, big
// files): Shell shows the sign-in card.
export function needsAccount(reason: string) {
  capture("action_blocked", { action: reason, reason: "signed_out" });
  window.dispatchEvent(new CustomEvent("captio-needs-account", { detail: { reason } }));
}

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}

async function authHeaders(): Promise<Record<string, string>> {
  if (preview) return { "x-preview": "1" };
  const { data } = await getSupabase().auth.getSession();
  return data.session ? { Authorization: `Bearer ${data.session.access_token}` } : { "x-guest-id": guestId() };
}

// JSON in, JSON out, or an ApiError with the server's message.
export async function api<T>(path: string, body?: unknown, init: { method?: string; signal?: AbortSignal } = {}): Promise<T> {
  const res = await fetch(path, {
    method: init.method ?? (body === undefined ? "GET" : "POST"),
    headers: { ...(await authHeaders()), ...(body === undefined ? {} : { "Content-Type": "application/json" }) },
    body: body === undefined ? undefined : JSON.stringify(body),
    signal: init.signal,
  });
  const text = await res.text();
  let data: unknown = null;
  try { data = text ? JSON.parse(text) : null; } catch { /* not JSON */ }
  if (!res.ok) throw new ApiError(res.status, (data as { error?: string } | null)?.error ?? `HTTP ${res.status}`);
  return data as T;
}

// A file or other raw body (uploads).
export async function apiRaw<T>(path: string, body: BodyInit, headers: Record<string, string> = {}, signal?: AbortSignal): Promise<T> {
  const res = await fetch(path, { method: "POST", headers: { ...(await authHeaders()), ...headers }, body, signal });
  const data = await res.json().catch(() => null);
  if (!res.ok) throw new ApiError(res.status, (data as { error?: string } | null)?.error ?? `HTTP ${res.status}`);
  return data as T;
}

export function errorCode(): string {
  const a = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  return Array.from({ length: 6 }, () => a[Math.floor(Math.random() * a.length)]).join("");
}

// The app's app_error: where it happened, the message, a 6-character code.
export function recordError(where: string, error?: unknown, extra: Record<string, unknown> = {}): string {
  const code = errorCode();
  capture("app_error", { where, message: String((error as Error)?.message ?? error ?? "").slice(0, 200), error_code: code, ...extra });
  return code;
}

// Pipelines that retry by themselves report once per page load (app: trackErrorOnce).
const reported = new Set<string>();
export function recordErrorOnce(where: string, error?: unknown, extra: Record<string, unknown> = {}) {
  if (reported.has(where) || (typeof navigator !== "undefined" && !navigator.onLine)) return;
  reported.add(where);
  recordError(where, error, extra);
}

export function capture(event: string, props: Record<string, unknown> = {}) {
  try {
    posthog.capture(event, { ...props, page: "web_app" });
  } catch {
    // Analytics must never break the app.
  }
}

// localStorage that never throws (private windows, blocked storage).
export const store = {
  get<T>(key: string, fallback: T): T {
    try {
      const v = localStorage.getItem(key);
      return v === null ? fallback : (JSON.parse(v) as T);
    } catch {
      return fallback;
    }
  },
  set(key: string, value: unknown) {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* kept for this visit only */ }
  },
  remove(key: string) {
    try { localStorage.removeItem(key); } catch { /* nothing to do */ }
  },
};

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}
