// The Actions tab: makes one result (summary, key points, notes, to-dos, Q&A,
// follow-up) with the app's prompts and model (src/app/app/actionPrompts.ts).
// The browser sends the transcript it already shows; one try per request, the
// browser tries once more when another try could help. An error answers
// { error: <ActionErrorCode> } so the browser can say why.

import { BRIEF, MODEL, SCHEMA, TIMEOUT_MS, buildPrompt, clean, tooShort, type ActionErrorCode, type ActionKind, ACTION_KINDS } from "@/app/app/actionPrompts";
import { HttpError, errorResponse, gemini, requireCaller } from "@/lib/webapp/server";

export const dynamic = "force-dynamic";
// Long notes of a long recording take a while.
export const maxDuration = 300;

const BLOCKED = ["SAFETY", "RECITATION", "PROHIBITED_CONTENT", "BLOCKLIST", "SPII", "OTHER"];

const fail = (code: ActionErrorCode, status: number) => Response.json({ error: code }, { status });

type Body = {
  kind?: ActionKind;
  title?: string;
  createdAt?: number;
  durationSeconds?: number;
  speakers?: string[];
  transcript?: string;
};

type GeminiReply = {
  promptFeedback?: { blockReason?: string };
  candidates?: { finishReason?: string; content?: { parts?: { text?: string }[] } }[];
};

export async function POST(req: Request) {
  try {
    await requireCaller(req, "action");
    const body = (await req.json()) as Body;
    const kind = body.kind;
    if (!kind || !ACTION_KINDS.includes(kind)) return fail("request", 400);
    const transcript = String(body.transcript ?? "");
    // Only genuinely short content is "not enough context".
    if (tooShort(transcript)) return Response.json({ blocks: [{ type: "insufficient_context" }] });
    if (!process.env.GEMINI_API_KEY) return fail("no_key", 503);

    const prompt = buildPrompt(kind, {
      title: String(body.title ?? ""),
      createdAt: Number(body.createdAt) || Date.now(),
      durationSeconds: Number(body.durationSeconds) || 0,
      speakers: Array.isArray(body.speakers) ? body.speakers.map(String).slice(0, 40) : [],
    }, transcript);

    let data: GeminiReply;
    try {
      data = (await gemini(MODEL, {
        systemInstruction: { parts: [{ text: BRIEF }] },
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig: { responseMimeType: "application/json", responseSchema: SCHEMA, maxOutputTokens: 32768 },
      }, TIMEOUT_MS)) as GeminiReply;
    } catch (e) {
      if ((e as Error)?.name === "TimeoutError" || (e as Error)?.name === "AbortError") return fail("timeout", 504);
      if (e instanceof HttpError) {
        if (e.status === 429) return fail("rate_limited", 429);
        if (/gemini 5\d\d/.test(e.message)) return fail("server", 502);
        if (e.status === 503) return fail("no_key", 503);
        return fail("request", 502);
      }
      return fail("server", 502);
    }

    const candidate = data.candidates?.[0];
    if (data.promptFeedback?.blockReason) return fail("blocked", 422);
    if (candidate?.finishReason && BLOCKED.includes(candidate.finishReason)) return fail("blocked", 422);
    if (candidate?.finishReason === "MAX_TOKENS") return fail("truncated", 502);
    const raw = candidate?.content?.parts?.[0]?.text;
    if (!raw) return fail("empty", 502);
    let parsed: { blocks?: unknown };
    try {
      parsed = JSON.parse(raw);
    } catch {
      return fail("bad_response", 502);
    }
    const blocks = clean(parsed?.blocks);
    if (!blocks.length) return fail("empty", 502);
    return Response.json({ blocks });
  } catch (e) {
    return errorResponse(e);
  }
}
