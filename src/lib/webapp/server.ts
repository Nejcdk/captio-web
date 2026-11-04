// Server side of the web app (/app): who is calling, and the keys that never
// reach the browser (SONIOX_API_KEY, GEMINI_API_KEY, REVENUECAT_API_KEY in the
// Vercel env). Every /api/app route starts with requireUser().

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
