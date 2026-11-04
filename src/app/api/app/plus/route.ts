// Whether the signed-in account has Plus: RevenueCat, the same customer the
// app logs in with (the Supabase user id), any active entitlement.

import { env, errorResponse, requireUser } from "@/lib/webapp/server";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const user = await requireUser(req);
    if (user.id === "preview-me") return Response.json({ plus: false });
    const res = await fetch(
      `https://api.revenuecat.com/v2/projects/${env("REVENUECAT_PROJECT_ID")}/customers/${encodeURIComponent(user.id)}/active_entitlements`,
      { headers: { Authorization: `Bearer ${env("REVENUECAT_API_KEY")}` }, cache: "no-store" },
    );
    // Never bought anything: RevenueCat doesn't know the customer.
    if (res.status === 404) return Response.json({ plus: false });
    if (!res.ok) return Response.json({ error: `revenuecat ${res.status}` }, { status: 502 });
    const data = (await res.json()) as { items?: unknown[] };
    return Response.json({ plus: (data.items?.length ?? 0) > 0 });
  } catch (e) {
    return errorResponse(e);
  }
}
