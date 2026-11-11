import { createHash } from "node:crypto";

// Server side of the web app (/app): who is calling, and the keys that never
// reach the browser (SONIOX_API_KEY, GEMINI_API_KEY, REVENUECAT_API_KEY in the
// Vercel env). Every /api/app route starts with requireUser(), or
// requireCaller() where someone without an account may use it too.

export type WebUser = { id: string; email: string | null };

export class HttpError extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}

// The caller's Supabase session (Authorization: Bearer <access token>),
// checked with Supabase itself. In `next dev` the made-up preview account
// (/app?preview=1) gets through without one.
export async function requireUser(req: Request): Promise<WebUser> {
  const token = req.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  if (!token) {
    if (process.env.NODE_ENV === "development" && req.headers.get("x-preview") === "1") return { id: "preview-me", email: null };
    throw new HttpError(401, "not signed in");
  }
  const { SUPABASE_URL, SUPABASE_ANON_KEY } = process.env;
  const res = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
    headers: { apikey: SUPABASE_ANON_KEY ?? "", Authorization: `Bearer ${token}` },
    cache: "no-store",
  });
  if (!res.ok) throw new HttpError(401, "session expired");
  const user = (await res.json()) as { id?: string; email?: string };
  if (!user.id) throw new HttpError(401, "session expired");
  return { id: user.id, email: user.email ?? null };
}

// ─── Guests (no account, Nejc 2026-11-11: try it before signing in) ──────────
// Like the app's "Skip for now": live captions, translation, uploads, titles
// and AI actions work without an account; recordings stay in that browser.
// The free credits are counted in the browser, so the server keeps its own
// daily ceiling per visitor (a daily-changing hash of the IP, never the IP)
// through web_guest_take (app repo: supabase/web_guest.sql), and a guest's
// speech key closes its stream after 5.5 minutes. Until that SQL runs, guests
// get through on the key's time limit alone.

export type GuestKind = "soniox_key" | "title" | "action" | "transcribe_file" | "transcribe_start" | "transcribe_poll";
export type Caller = WebUser & { guest: boolean };

function ipHash(req: Request): string {
  const ip = (req.headers.get("x-forwarded-for") ?? "").split(",")[0].trim() || req.headers.get("x-real-ip") || "local";
  const day = new Date().toISOString().slice(0, 10);
  return createHash("sha256").update(`${ip}|${day}|${process.env.AD_CLICK_PEPPER ?? "captio-web-guest"}`).digest("hex").slice(0, 32);
}

let guestSqlMissing = false;

async function takeGuestAllowance(req: Request, kind: GuestKind): Promise<void> {
  if (kind === "transcribe_poll" || guestSqlMissing) return;
  const { SUPABASE_URL, SUPABASE_ANON_KEY } = process.env;
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) return;
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/rpc/web_guest_take`, {
      method: "POST",
      headers: { apikey: SUPABASE_ANON_KEY, Authorization: `Bearer ${SUPABASE_ANON_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({ p_ip_hash: ipHash(req), p_kind: kind }),
      cache: "no-store",
      signal: AbortSignal.timeout(5000),
    });
    if (res.status === 404) {
      guestSqlMissing = true;
      console.warn("[web app] web_guest_take is missing: run the app repo's supabase/web_guest.sql");
      return;
    }
    if (!res.ok) return;
    if ((await res.json()) === false) throw new HttpError(429, "guest_limit");
  } catch (e) {
    if (e instanceof HttpError) throw e;
    // The ceiling is a safety net: a slow database never stops a guest.
  }
}

// The caller: the signed-in account, or (no token) a guest, allowed `kind`
// within today's ceiling. A guest's own random id (x-guest-id, kept in their
// browser) ties their speech jobs to them.
export async function requireCaller(req: Request, kind: GuestKind): Promise<Caller> {
  const token = req.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  if (token || (process.env.NODE_ENV === "development" && req.headers.get("x-preview") === "1")) {
    return { ...(await requireUser(req)), guest: false };
  }
  const guestId = (req.headers.get("x-guest-id") ?? "").replace(/[^a-zA-Z0-9]/g, "").slice(0, 32);
  if (guestId.length < 16) throw new HttpError(401, "not signed in");
  await takeGuestAllowance(req, kind);
  return { id: `guest_${guestId}`, email: null, guest: true };
}

export function errorResponse(e: unknown): Response {
  if (e instanceof HttpError) return Response.json({ error: e.message }, { status: e.status });
  console.error("[web app]", e);
  return Response.json({ error: String((e as Error)?.message ?? e).slice(0, 200) }, { status: 500 });
}

export function env(name: "SONIOX_API_KEY" | "GEMINI_API_KEY" | "REVENUECAT_API_KEY" | "REVENUECAT_PROJECT_ID"): string {
  const v = process.env[name];
  if (!v) throw new HttpError(503, `${name} is not set`);
  return v;
}

// Gemini (the same models as the app), JSON out.
export async function gemini(model: string, body: unknown, timeoutMs = 120_000): Promise<unknown> {
  const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-goog-api-key": env("GEMINI_API_KEY") },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(timeoutMs),
  });
  if (!res.ok) {
    const text = await res.text();
    let detail = text.slice(0, 120);
    try {
      const err = JSON.parse(text)?.error;
      detail = `${err?.status ?? ""} ${err?.message ?? ""}`.trim();
    } catch {
      // Not JSON (an overloaded API answers with HTML).
    }
    throw new HttpError(res.status === 429 ? 429 : 502, `gemini ${res.status} ${detail}`);
  }
  return res.json();
}
