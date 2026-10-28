import { createHash } from "crypto";
import { requestPilot } from "@/lib/orgPilot";
import { capture, errorCode } from "@/lib/connector/analytics";

// POST from the pilot form on /organizations. The database checks and limits
// everything (org_pilot_request in the app repo's supabase/organizations.sql)
// and emails the link; this adds what only the server knows: the country
// (Vercel's IP lookup) and a daily-changing hash of the IP for the
// per-visitor limit (never the IP itself).
// Bots: a hidden field and a minimum fill time; they get "ok" and nothing happens.

export const dynamic = "force-dynamic";

const PEOPLE = new Set(["1-5", "6-19", "20-50", "50+"]);

export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return Response.json({ ok: false, error: "bad_request" }, { status: 400 });
  }
  const text = (v: unknown, max: number) => (typeof v === "string" ? v.trim().slice(0, max) : "");

  if (text(body.website, 200) || (typeof body.ms === "number" && body.ms < 2000)) {
    return Response.json({ ok: true, resent: false });
  }

  const ip = (req.headers.get("x-forwarded-for") ?? "").split(",")[0].trim();
  const day = new Date().toISOString().slice(0, 10);
  const ipHash = ip
    ? createHash("sha256").update(`${ip}|${day}|${process.env.AD_CLICK_PEPPER ?? "captio-organizations"}`).digest("hex").slice(0, 32)
    : null;
  const people = text(body.people, 10);

  try {
    const answer = await requestPilot({
      org: text(body.org, 120),
      name: text(body.name, 80),
      email: text(body.email, 200),
      people: PEOPLE.has(people) ? people : "",
      timeZone: text(body.timeZone, 64) || null,
      country: req.headers.get("x-vercel-ip-country"),
      ipHash,
    });
    return Response.json(answer);
  } catch (e) {
    const code = errorCode();
    console.error("[org pilot] request", code, e);
    await capture("app_error", "organizations_web", {
      where: "org_pilot_request",
      message: String((e as Error)?.message ?? e).slice(0, 300),
      error_code: code,
      source: "organizations",
      platform: "web",
    });
    return Response.json({ ok: false, error: "server", code }, { status: 502 });
  }
}
