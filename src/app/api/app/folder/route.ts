// Which of the user's folders a new recording belongs in, the app's prompt and
// model (app repo: shared.ts suggestFolder). Nothing moves here: the page asks
// "Save to {folder}?", and only a "high" confidence pick is worth asking.

import { errorResponse, gemini, requireUser } from "@/lib/webapp/server";

export const dynamic = "force-dynamic";

type Choice = { id: string; name: string; examples: string[] };

export async function POST(req: Request) {
  try {
    await requireUser(req);
    const { transcript, folders } = (await req.json()) as { transcript?: string; folders?: Choice[] };
    if (!transcript?.trim() || !folders?.length) return Response.json({ folderId: null, picked: false, confidence: null });
    const list = folders.slice(0, 50).map((f, i) => `${i + 1}. "${f.name}"${f.examples?.length
      ? `, recordings already in it: ${f.examples.slice(0, 5).map(e => `"${e}"`).join(", ")}`
      : ", empty so far"}`).join("\n");
    const data = (await gemini("gemini-3.1-flash-lite", {
      contents: [{
        parts: [{
          text: `A user saved a new voice recording. They keep some recordings in these folders:
${list}

Decide whether this recording belongs in one of these folders. They will be asked "Save it to <folder>?", and a wrong suggestion is worse than none.

Think it through, in this order:
1. "kind": what kind of recording this is (meeting, lecture, class, sermon, appointment, phone call, chat, voice note, video or podcast, news, …), who is talking and what it's about.
2. "folders": for the one or two closest folders, what the user collects there, judging by its name and the recordings already in it, and whether this recording is that same kind of thing for the same part of their life. A shared word or subject is not enough: a news story about doctors is not the user's doctor visit, a lesson held in Spanish is not a Spanish class, a friend mentioning their dermatologist is a chat with a friend.
3. "folder": the number of the folder it belongs in, or 0 when none clearly fits.
4. "confidence": "high" only when you're sure the user would put it there themselves; else "medium" or "low".

Transcript:
${transcript.slice(0, 4000)}`,
        }],
      }],
      generationConfig: {
        responseMimeType: "application/json",
        // The reasoning fields come first so the pick is made after them.
        responseSchema: {
          type: "OBJECT",
          properties: {
            kind: { type: "STRING" },
            folders: { type: "STRING" },
            folder: { type: "INTEGER" },
            confidence: { type: "STRING", enum: ["high", "medium", "low"] },
          },
          required: ["kind", "folders", "folder", "confidence"],
          propertyOrdering: ["kind", "folders", "folder", "confidence"],
        },
      },
    }, 30_000)) as { candidates?: { content?: { parts?: { text?: string }[] } }[] };
    const result = JSON.parse(data.candidates?.[0]?.content?.parts?.[0]?.text ?? "{}") as { folder?: number; confidence?: string };
    const n = Number(result.folder);
    const picked = Number.isInteger(n) && n >= 1 && n <= folders.length;
    const suggested = picked && result.confidence === "high";
    return Response.json({ folderId: suggested ? folders[n - 1].id : null, picked, confidence: result.confidence ?? null });
  } catch (e) {
    return errorResponse(e);
  }
}
