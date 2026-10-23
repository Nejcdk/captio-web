// The meaning-vector worker (src/lib/connector/embedWorker.ts), started every
// minute by the database's pg_cron (app repo supabase/chat_connector.sql,
// job connector-embed) with the shared secret in x-embed-secret.

import { runEmbedWorker } from "@/lib/connector/embedWorker";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

export async function POST(req: Request) {
  const secret = process.env.CONNECTOR_EMBED_SECRET;
  if (!secret || req.headers.get("x-embed-secret") !== secret) {
    return Response.json({ error: "not allowed" }, { status: 401 });
  }
  const result = await runEmbedWorker(45_000);
  return Response.json(result);
}
