import { generateProtectedResourceMetadata, getPublicOrigin } from "mcp-handler";

// RFC 9728 document that tells Claude / ChatGPT where to sign in for /mcp:
// Supabase Auth's OAuth server (issuer <project>.supabase.co/auth/v1).
// `resource` must be exactly the URL people add as the connector.
export function protectedResourceMetadata(req: Request): Response {
  const supabaseUrl = process.env.SUPABASE_URL;
  if (!supabaseUrl) return new Response("Not configured", { status: 500 });
  const metadata = generateProtectedResourceMetadata({
    authServerUrls: [`${supabaseUrl.replace(/\/$/, "")}/auth/v1`],
    resourceUrl: `${getPublicOrigin(req)}/mcp`,
    additionalMetadata: { resource_name: "Captio AI", bearer_methods_supported: ["header"] },
  });
  return new Response(JSON.stringify(metadata), {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "*",
      "Cache-Control": "max-age=3600",
      "Content-Type": "application/json",
    },
  });
}
