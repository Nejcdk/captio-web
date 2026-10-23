import { createHash, randomBytes } from "crypto";
import type { AuthInfo } from "@modelcontextprotocol/server";

// The connector's events, in the app's PostHog project (EU), from the server.
// Never what anyone asked or what came back: tools, counts, timings, errors.
// A person is a hash of their account id (the app's analytics are anonymous
// too). Errors are `app_error` like the app's, with `where` starting with
// `connector` and source "connector", so the 🚨 Errors section of
// "4. Error handling" shows them in their own tiles (tools/posthog/
// update_connector.py in the app repo); the app's own error tiles only count
// the app ($lib posthog-react-native).
const POSTHOG_KEY = "phc_onGfnjHHLYmduU7NwB4i3Q6UmVr6L75cjM4Jh7qQBbX2";

export function personId(auth: AuthInfo | null | undefined): string {
  const id = typeof auth?.extra?.userId === "string" ? auth.extra.userId : auth?.clientId ?? "worker";
  return `connector_${createHash("sha256").update(id).digest("hex").slice(0, 20)}`;
}

export async function capture(event: string, distinctId: string, props: Record<string, unknown>) {
  if (process.env.NODE_ENV !== "production") return;
  try {
    await fetch("https://eu.i.posthog.com/i/v0/e/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        api_key: POSTHOG_KEY,
        event,
        distinct_id: distinctId,
        properties: { source: "connector", platform: "connector", $process_person_profile: false, ...props },
      }),
      signal: AbortSignal.timeout(5000),
    });
  } catch {
    // Analytics must never break an answer.
  }
}

// One per tool call: which tool, which chat app (client_id), how long, how big.
export function captureToolCall(auth: AuthInfo, tool: string, props: Record<string, unknown>) {
  return capture("connector_tool_called", personId(auth), { tool, client_id: auth.clientId, ...props });
}

// A 6-character code, as in the app's error alerts, shown to the person so a
// report can be matched to the event.
export function errorCode(): string {
  return randomBytes(4).toString("base64").replace(/[^A-Za-z0-9]/g, "").slice(0, 6).toUpperCase().padEnd(6, "X");
}

export function captureError(where: string, error: unknown, distinctId: string, extra: Record<string, unknown> = {}) {
  const message = String((error as Error)?.message ?? error).slice(0, 300);
  return capture("app_error", distinctId, { where: `connector_${where}`, message, ...extra });
}
