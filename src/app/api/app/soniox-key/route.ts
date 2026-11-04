// A short-lived speech key for the browser's live captions and translation
// (and Add a voice later). The long-lived key never leaves the server; the
// browser sends this one with the connection (Sec-WebSocket-Protocol).

import { env, errorResponse, requireUser } from "@/lib/webapp/server";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const user = await requireUser(req);
    const res = await fetch("https://api.soniox.com/v1/auth/temporary-api-key", {
      method: "POST",
      headers: { Authorization: `Bearer ${env("SONIOX_API_KEY")}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        usage_type: "transcribe_websocket",
        expires_in_seconds: 60,
        single_use: true,
        // Soniox closes every stream at 300 minutes anyway.
        max_session_duration_seconds: 5 * 3600,
        client_reference_id: `web_${user.id}`.slice(0, 120),
      }),
      cache: "no-store",
    });
    if (!res.ok) return Response.json({ error: `soniox ${res.status}` }, { status: 502 });
    const { api_key } = (await res.json()) as { api_key: string };
    return Response.json({ api_key });
  } catch (e) {
    return errorResponse(e);
  }
}
