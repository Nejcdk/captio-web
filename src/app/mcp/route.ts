// The Captio AI connector for Claude, ChatGPT and other chat apps (MCP,
// Streamable HTTP, stateless). People add https://captioai.app/mcp as a
// connector, sign in with their Captio AI account (Supabase's OAuth server,
// consent page /oauth/consent), and the chat app can then search and read
// every recording they can see in the app: their own and those in shared
// folders they're in. Read-only.
//
// Sign-in: the chat app finds Supabase through
// /.well-known/oauth-protected-resource/mcp and registers itself there
// (dynamic client registration). Its access tokens are normal Supabase user
// tokens with a client_id claim, so the database rules apply as in the app.
// Data: supabase/chat_connector.sql in the app repo.

import { after } from "next/server";
import { createMcpHandler, withMcpAuth } from "mcp-handler";
import type { AuthInfo } from "@modelcontextprotocol/server";
import { ConnectorError, userForToken } from "@/lib/connector/data";
import { INSTRUCTIONS, TOOLS } from "@/lib/connector/tools";
import { captureError, captureToolCall, errorCode, personId } from "@/lib/connector/analytics";
import { runEmbedWorker } from "@/lib/connector/embedWorker";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

function jwtClaims(token: string): Record<string, unknown> | null {
  try {
    const payload = token.split(".")[1];
    return JSON.parse(Buffer.from(payload.replace(/-/g, "+").replace(/_/g, "/"), "base64").toString("utf8"));
  } catch {
    return null;
  }
}

// Only tokens Supabase issued to a connected chat app (they carry client_id),
// checked with Supabase so a revoked connection stops working.
async function verifyToken(_req: Request, token?: string): Promise<AuthInfo | undefined> {
  if (!token) return undefined;
  const claims = jwtClaims(token);
  const clientId = typeof claims?.client_id === "string" ? claims.client_id : null;
  if (!clientId) return undefined;
  const user = await userForToken(token);
  if (!user) return undefined;
  return {
    token,
    clientId,
    scopes: [],
    expiresAt: typeof claims?.exp === "number" ? claims.exp : undefined,
    extra: { userId: user.id },
  };
}

const handler = createMcpHandler(
  (server) => {
    for (const tool of TOOLS) {
      server.registerTool(
        tool.name,
        {
          title: tool.title,
          description: tool.description,
          inputSchema: tool.inputSchema,
          annotations: { readOnlyHint: true, openWorldHint: false, title: tool.title },
        },
        async (args: Record<string, unknown>, ctx) => {
          const auth = ctx.http?.authInfo;
          const started = Date.now();
          if (!auth) {
            return { content: [{ type: "text", text: "Not signed in to Captio AI." }], isError: true };
          }
          const meta: Record<string, unknown> = {};
          try {
            const text = await tool.run(args ?? {}, { token: auth.token, meta });
            after(() => captureToolCall(auth, tool.name, { ok: true, ms: Date.now() - started, chars: text.length, ...meta }));
            // Searches also keep the meaning vectors going, in case the
            // database's every-minute ping isn't getting through.
            if (tool.name === "search_transcripts") after(() => kickEmbedding());
            return { content: [{ type: "text", text }] };
          } catch (e) {
            const message = e instanceof ConnectorError ? e.message : String((e as Error)?.message ?? e);
            const code = errorCode();
            console.error(`[mcp] ${tool.name} ${code}:`, message);
            after(() => Promise.all([
              captureToolCall(auth, tool.name, { ok: false, ms: Date.now() - started, error_code: code, ...meta }),
              captureError(tool.name, message, personId(auth), {
                error_code: code, client_id: auth.clientId, status: e instanceof ConnectorError ? e.status : undefined,
              }),
            ]));
            return {
              content: [{ type: "text", text: `Captio AI couldn't answer that just now. Please try again in a moment. (Error code ${code})` }],
              isError: true,
            };
          }
        },
      );
    }
  },
  {
    serverInfo: { name: "Captio AI", version: "1.0.0" },
    instructions: INSTRUCTIONS,
  },
);

// At most one nudge a minute per server instance, 20 seconds of work.
let lastKick = 0;
async function kickEmbedding() {
  if (Date.now() - lastKick < 60_000) return;
  lastKick = Date.now();
  await runEmbedWorker(20_000).catch(() => {});
}

const authed = withMcpAuth(handler, verifyToken, {
  required: true,
  resourceMetadataPath: "/.well-known/oauth-protected-resource/mcp",
});

export { authed as GET, authed as POST, authed as DELETE };
