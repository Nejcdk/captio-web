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
import { captureConnectorEvent } from "@/lib/connector/analytics";

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
          try {
            const text = await tool.run(args ?? {}, { token: auth.token });
            after(() => captureConnectorEvent(auth, tool.name, { ok: true, ms: Date.now() - started, chars: text.length }));
            return { content: [{ type: "text", text }] };
          } catch (e) {
            const message = e instanceof ConnectorError ? e.message : String((e as Error)?.message ?? e);
            console.error(`[mcp] ${tool.name}:`, message);
            after(() => captureConnectorEvent(auth, tool.name, { ok: false, ms: Date.now() - started, error: message.slice(0, 200) }));
            return {
              content: [{ type: "text", text: "Captio AI couldn't answer that just now. Please try again in a moment." }],
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

const authed = withMcpAuth(handler, verifyToken, {
  required: true,
  resourceMetadataPath: "/.well-known/oauth-protected-resource/mcp",
});

export { authed as GET, authed as POST, authed as DELETE };
