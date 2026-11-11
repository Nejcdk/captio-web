// A new recording's title and emoji, the app's prompt and model (app repo:
// shared.ts generateTitleAndEmoji).

import { errorResponse, gemini, requireCaller } from "@/lib/webapp/server";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    await requireCaller(req, "title");
    const { transcript, titleLanguage } = (await req.json()) as { transcript?: string; titleLanguage?: string };
    if (!transcript?.trim()) return Response.json({ title: "", emoji: "🎙️" });
    const langInstruction = titleLanguage
      ? `Write the title in ${titleLanguage}.`
      : "Write the title in the dominant language of the transcript.";
    const data = (await gemini("gemini-3.1-flash-lite", {
      contents: [{ parts: [{ text: `Generate an ultra-short title (2-4 words, no punctuation) and one relevant emoji for this voice recording transcript. ${langInstruction} Return only valid JSON: {"title": "...", "emoji": "..."}.\n\nTranscript: ${transcript.slice(0, 600)}` }] }],
      generationConfig: { responseMimeType: "application/json" },
    }, 30_000)) as { candidates?: { content?: { parts?: { text?: string }[] } }[] };
    const result = JSON.parse(data.candidates?.[0]?.content?.parts?.[0]?.text ?? "{}") as { title?: string; emoji?: string };
    return Response.json({ title: result.title?.trim() ?? "", emoji: result.emoji?.trim() || "🎙️" });
  } catch (e) {
    return errorResponse(e);
  }
}
