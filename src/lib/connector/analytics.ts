import { createHash } from "crypto";
import type { AuthInfo } from "@modelcontextprotocol/server";

// One PostHog event per tool call (same EU project as the app), so the
// dashboards can show who uses the connector and how. Never the question or
// what came back: only the tool, timing and size. The person is a hash of
// their account id (the app's analytics are anonymous too).
const POSTHOG_KEY = "phc_onGfnjHHLYmduU7NwB4i3Q6UmVr6L75cjM4Jh7qQBbX2";

export async function captureConnectorEvent(auth: AuthInfo, tool: string, props: Record<string, unknown>) {
  if (process.env.NODE_ENV !== "production") return;
  const userId = typeof auth.extra?.userId === "string" ? auth.extra.userId : auth.clientId;
  try {
    await fetch("https://eu.i.posthog.com/i/v0/e/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        api_key: POSTHOG_KEY,
        event: "connector_tool_called",
        distinct_id: `connector_${createHash("sha256").update(userId).digest("hex").slice(0, 20)}`,
        properties: { tool, client_id: auth.clientId, platform: "connector", $process_person_profile: false, ...props },
      }),
    });
  } catch {
    // Analytics must never break an answer.
  }
}
