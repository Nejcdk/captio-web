// The meaning vector of a search question, made with the same model the
// database uses for the passages (supabase/chat_connector.sql in the app repo:
// gemini-embedding-2, 768 numbers). null when there's no key or Gemini doesn't
// answer in time: the search then falls back to words.

const MODEL = "gemini-embedding-2";
const cache = new Map<string, string>();

export async function embedQuery(question: string): Promise<string | null> {
  const key = process.env.GEMINI_API_KEY;
  if (!key) return null;
  const text = question.trim().slice(0, 2000);
  const hit = cache.get(text);
  if (hit) return hit;
  try {
    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:embedContent`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-goog-api-key": key },
      body: JSON.stringify({
        content: { parts: [{ text: `task: search result | query: ${text}` }] },
        outputDimensionality: 768,
      }),
      signal: AbortSignal.timeout(5000),
      cache: "no-store",
    });
    if (!res.ok) {
      console.error(`[mcp] embed ${res.status}: ${(await res.text()).slice(0, 200)}`);
      return null;
    }
    const values = ((await res.json()) as { embedding?: { values?: number[] }; embeddings?: { values?: number[] }[] });
    const vec = values.embedding?.values ?? values.embeddings?.[0]?.values;
    if (!vec || vec.length !== 768) return null;
    const out = `[${vec.join(",")}]`;
    if (cache.size > 200) cache.delete(cache.keys().next().value as string);
    cache.set(text, out);
    return out;
  } catch (e) {
    console.error("[mcp] embed failed:", (e as Error)?.message ?? e);
    return null;
  }
}
