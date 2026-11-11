// Gemini for the phone app where Google turns the phone's own location away
// ("400 FAILED_PRECONDITION User location is not supported for the API use",
// titles, summaries and every action; app repo: src/lib/gemini.ts). The app
// sends the request it would have sent to Gemini; the reply is Gemini's own,
// status included, so the app reads it exactly as before. Signed-in users and
// the app's models only.

import { env, errorResponse, requireUser } from "@/lib/webapp/server";

export const dynamic = "force-dynamic";
// Long notes of a long recording take a while (the app waits up to 120 s).
export const maxDuration = 300;

const MODELS = new Set(["gemini-3.1-flash-lite", "gemini-2.5-flash"]);

export async function POST(req: Request) {
  try {
    await requireUser(req);
    const { model, body } = (await req.json()) as { model?: string; body?: unknown };
    if (!model || !MODELS.has(model) || !body || typeof body !== "object") {
      return Response.json({ error: { status: "INVALID_ARGUMENT", message: "unknown model or empty request" } }, { status: 400 });
    }
    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-goog-api-key": env("GEMINI_API_KEY") },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(280_000),
    });
    return new Response(await res.text(), {
      status: res.status,
      headers: { "Content-Type": res.headers.get("content-type") ?? "application/json" },
    });
  } catch (e) {
    return errorResponse(e);
  }
}
