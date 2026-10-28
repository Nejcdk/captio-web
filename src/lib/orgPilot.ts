import { cache } from "react";

// Captio AI for Organizations: the pilot link (captioai.app/o/<code>) and the
// form on /organizations. All rules live in Postgres (app repo:
// supabase/organizations.sql, plan in tools/organizations/PLAN.md):
//   org_pilot_request()  the form: creates the organization and EMAILS the
//                        link (never returned here, so the address is real)
//   org_link_info()      what /o/<code> shows before signing in
//   org_join()           the signed-in person takes a place and gets Plus
// The emails (link, day 7, usage report, paid, renewal) are sent by the
// app repo's send-emails function.

export type OrgLink = {
  ok: true;
  name: string;
  plan: "pilot" | "paid";
  seats: number;
  places_left: number;
  pilot_days: number;
  paid_until: string | null;
  status: "open" | "full" | "stopped" | "link_expired" | "ended";
};

export const normalizeOrgCode = (code: string) => code.toUpperCase().replace(/[^A-Z0-9]/g, "");

async function rpc(fn: string, args: Record<string, unknown>): Promise<Response> {
  const { SUPABASE_URL, SUPABASE_ANON_KEY } = process.env;
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) throw new Error("SUPABASE_URL / SUPABASE_ANON_KEY not set");
  return fetch(`${SUPABASE_URL}/rest/v1/rpc/${fn}`, {
    method: "POST",
    headers: {
      apikey: SUPABASE_ANON_KEY,
      Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(args),
    cache: "no-store",
  });
}

// null: no such link. "error": couldn't be read right now (the page says so).
export const getOrgLink = cache(async (code: string): Promise<OrgLink | null | "error"> => {
  if (!/^[A-Z0-9]{6,16}$/.test(code)) return null;
  try {
    const res = await rpc("org_link_info", { p_code: code });
    if (!res.ok) {
      console.error("[org link] rpc", res.status, (await res.text()).slice(0, 200));
      return "error";
    }
    const data = await res.json();
    return data?.ok ? (data as OrgLink) : null;
  } catch (e) {
    console.error("[org link] fetch", e);
    return "error";
  }
});

export type PilotRequest = {
  org: string;
  name: string;
  email: string;
  people: string;
  timeZone: string | null;
  country: string | null;
  ipHash: string | null;
};

export type PilotAnswer = { ok: true; resent: boolean } | { ok: false; error: string };

export async function requestPilot(r: PilotRequest): Promise<PilotAnswer> {
  const res = await rpc("org_pilot_request", {
    p_org: r.org,
    p_name: r.name,
    p_email: r.email,
    p_people: r.people,
    p_country: r.country,
    p_time_zone: r.timeZone,
    p_ip_hash: r.ipHash,
  });
  if (!res.ok) throw new Error(`org_pilot_request ${res.status}: ${(await res.text()).slice(0, 200)}`);
  return (await res.json()) as PilotAnswer;
}
