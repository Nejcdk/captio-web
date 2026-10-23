// Gives every transcript passage its meaning vector (Gemini gemini-embedding-2,
// 768 numbers, the same model search_transcripts embeds questions with).
// The database keeps the queue (app repo supabase/chat_connector.sql:
// connector_embed_queue, newest recordings first); this takes up to 100
// passages at a time, asks Gemini, and puts the vectors back, until the queue
// is empty or the time is up. Started every minute by pg_cron
// (/api/connector/embed) and after searches, so a pause in either still
// catches up. Passages Gemini refused before go one at a time, so one bad
// passage can't hold up the rest; a rate limit or server error stops the run
// and the next one carries on.

import { capture, captureError } from "./analytics";

const MODEL = "gemini-embedding-2";
const DISTINCT = "connector_embed_worker";

type Waiting = { content_hash: string; content: string | null; attempts: number };
export type WorkerResult = { done: number; refused: number; deferred: number; batches: number; ms: number; stopped?: string; error?: string };

async function call<T>(fn: string, args: Record<string, unknown>): Promise<T> {
  const { SUPABASE_URL, SUPABASE_ANON_KEY } = process.env;
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) throw new Error("Supabase is not configured");
  const res = await fetch(`${SUPABASE_URL}/rest/v1/rpc/${fn}`, {
    method: "POST",
    headers: { apikey: SUPABASE_ANON_KEY, Authorization: `Bearer ${SUPABASE_ANON_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify(args),
    cache: "no-store",
    signal: AbortSignal.timeout(20_000),
  });
  if (!res.ok) throw new Error(`${fn}: ${res.status} ${(await res.text().catch(() => "")).slice(0, 200)}`);
  return res.json() as Promise<T>;
}

async function embed(texts: string[], key: string): Promise<{ ok: true; vectors: string[] } | { ok: false; status: number; error: string }> {
  try {
    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:batchEmbedContents`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-goog-api-key": key },
      body: JSON.stringify({
        requests: texts.map(text => ({ model: `models/${MODEL}`, content: { parts: [{ text }] }, outputDimensionality: 768 })),
      }),
      signal: AbortSignal.timeout(30_000),
      cache: "no-store",
    });
    const body = await res.text();
    if (!res.ok) return { ok: false, status: res.status, error: `${res.status}: ${body.slice(0, 250)}` };
    const parsed = JSON.parse(body) as { embeddings?: { values?: number[] }[] };
    const vectors = (parsed.embeddings ?? []).map(e => (e.values?.length === 768 ? `[${e.values.map(v => +v.toFixed(6)).join(",")}]` : ""));
    if (vectors.length !== texts.length || vectors.some(v => !v)) return { ok: false, status: 502, error: "bad embeddings answer" };
    return { ok: true, vectors };
  } catch (e) {
    return { ok: false, status: 0, error: String((e as Error)?.message ?? e).slice(0, 250) };
  }
}

let running: Promise<WorkerResult> | null = null;

// One run at a time per server instance; a second caller gets the same run.
export function runEmbedWorker(budgetMs = 45_000): Promise<WorkerResult> {
  running ??= work(budgetMs).finally(() => { running = null; });
  return running;
}

async function work(budgetMs: number): Promise<WorkerResult> {
  const started = Date.now();
  const secret = process.env.CONNECTOR_EMBED_SECRET;
  const key = process.env.GEMINI_API_KEY;
  const out: WorkerResult = { done: 0, refused: 0, deferred: 0, batches: 0, ms: 0 };
  if (!secret || !key) {
    out.stopped = "not_configured";
    out.error = `missing ${[!secret && "CONNECTOR_EMBED_SECRET", !key && "GEMINI_API_KEY"].filter(Boolean).join(", ")}`;
    await captureError("embed", out.error, DISTINCT);
    return out;
  }
  try {
    while (Date.now() - started < budgetMs) {
      const waiting = await call<Waiting[]>("connector_embed_take", { p_secret: secret, p_limit: 100 });
      if (!waiting.length) { out.stopped = "empty"; break; }
      // Text gone (recording deleted meanwhile): just leaves the queue.
      const gone = waiting.filter(w => !w.content);
      if (gone.length) await call("connector_embed_put", { p_secret: secret, p_hashes: gone.map(w => w.content_hash), p_vectors: gone.map(() => null) });
      const fresh = waiting.filter(w => w.content && w.attempts === 0);
      const retry = waiting.filter(w => w.content && w.attempts > 0);
      const handled = new Set<string>();
      for (const group of [fresh, ...retry.map(w => [w])]) {
        if (!group.length) continue;
        const hashes = group.map(w => w.content_hash);
        hashes.forEach(h => handled.add(h));
        const answer = await embed(group.map(w => w.content as string), key);
        out.batches++;
        if (answer.ok) {
          const stored = await call<unknown>("connector_embed_put", { p_secret: secret, p_hashes: hashes, p_vectors: answer.vectors });
          out.done += typeof stored === "number" ? stored : hashes.length;
          continue;
        }
        // A key or permission problem isn't the passages' fault: nothing counts,
        // everything waits, and the error shows on the dashboard.
        const keyProblem = answer.status === 401 || answer.status === 403 || /API[_ ]?KEY|PERMISSION_DENIED|UNAUTHENTICATED|billing/i.test(answer.error);
        const refusedByGemini = !keyProblem && answer.status >= 400 && answer.status < 500 && answer.status !== 429;
        await call("connector_embed_failed", { p_secret: secret, p_hashes: hashes, p_error: answer.error, p_counts: refusedByGemini });
        out.error = answer.error;
        if (refusedByGemini) { out.refused += hashes.length; continue; }
        // Rate limit, server error, timeout: this and every passage not sent
        // yet go back to waiting for the next run.
        const rest = waiting.filter(w => w.content && !handled.has(w.content_hash)).map(w => w.content_hash);
        if (rest.length) await call("connector_embed_failed", { p_secret: secret, p_hashes: rest, p_error: answer.error, p_counts: false });
        out.deferred += hashes.length + rest.length;
        out.stopped = keyProblem ? "gemini_key" : answer.status === 429 ? "rate_limited" : "gemini_error";
        break;
      }
      if (out.stopped) break;
    }
    if (!out.stopped) out.stopped = "time_up";
  } catch (e) {
    out.stopped = "failed";
    out.error = String((e as Error)?.message ?? e).slice(0, 300);
  }
  out.ms = Date.now() - started;
  if (out.error) await captureError("embed", out.error, DISTINCT, { stopped: out.stopped, done: out.done });
  if (out.done || out.refused || out.deferred || out.error) await capture("connector_embed_run", DISTINCT, { ...out });
  await call("connector_embed_report", { p_secret: secret, p_result: out }).catch(() => {});
  return out;
}
