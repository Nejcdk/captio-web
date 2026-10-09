import { createHmac, randomUUID } from "node:crypto";
import { after } from "next/server";

// ChatGPT ad links: captioai.app/go/<lang> forwards straight to the App Store
// with that ad language's campaign tag (ct=cg_<lang>), so App Store Connect
// counts installs per ad language. Nothing is shown to the visitor.
//
// Each click is logged after the redirect is sent: OpenAI's click id (oppref)
// and the campaign/ad ids that the ads add to the link, plus an HMAC of the IP
// (never the IP itself), so the app repo's `revenuecat-openai` edge function
// can match a later trial to the click (see supabase/ad_clicks.sql in the app
// repo). A copy without any identifier goes to PostHog as `chatgpt_ad_click`.

const LANGS = new Set([
  "en-uk", "en-intl", "de", "ja", "fr", "pl", "es", "ko", "ar", "it", "hu", "nl", "pt-br", "sv", "th",
  "vi", "tr", "zh-hans", "es-mx", "hi", "id", "he", "el", "ru", "sk", "ca", "cs", "da", "ms", "uk",
  "nb", "pt-pt", "hr", "fi", "te", "mr", "ta", "ml", "ro", "pa", "bn", "gu", "kn", "sl",
]);
const APP_STORE = "https://apps.apple.com/app/apple-store/id6796617180?pt=129242349&mt=8";
const BOT = /bot|crawl|spider|preview|fetch|curl|wget|python|headless/i;

export const dynamic = "force-dynamic";

export async function GET(request: Request, { params }: { params: Promise<{ lang: string }> }) {
  const lang = (await params).lang.toLowerCase();
  const known = LANGS.has(lang);
  const target = new URL(APP_STORE);
  if (known) target.searchParams.set("ct", `cg_${lang}`);

  const query = new URL(request.url).searchParams;
  const ip = (request.headers.get("x-forwarded-for") ?? "").split(",")[0].trim() || request.headers.get("x-real-ip");
  const ua = request.headers.get("user-agent") ?? "";
  if (known && ip && !BOT.test(ua)) {
    after(() =>
      logClick({
        lang,
        ip,
        oppref: query.get("oppref"),
        campaignId: query.get("cmp"),
        adId: query.get("ad"),
      }),
    );
  }

  return Response.redirect(target.toString(), 302);
}

type Click = { lang: string; ip: string; oppref: string | null; campaignId: string | null; adId: string | null };

async function logClick(c: Click) {
  const { SUPABASE_URL, SUPABASE_ANON_KEY, AD_CLICK_PEPPER } = process.env;
  const jobs: Promise<unknown>[] = [];
  if (SUPABASE_URL && SUPABASE_ANON_KEY && AD_CLICK_PEPPER) {
    jobs.push(
      fetch(`${SUPABASE_URL}/rest/v1/rpc/log_ad_click`, {
        method: "POST",
        headers: {
          apikey: SUPABASE_ANON_KEY,
          Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          p_lang: c.lang,
          p_ip_hash: createHmac("sha256", AD_CLICK_PEPPER).update(c.ip).digest("hex"),
          p_oppref: c.oppref,
          p_campaign_id: c.campaignId,
          p_ad_id: c.adId,
        }),
      }),
    );
  }
  jobs.push(
    fetch("https://eu.i.posthog.com/i/v0/e/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        api_key: "phc_onGfnjHHLYmduU7NwB4i3Q6UmVr6L75cjM4Jh7qQBbX2",
        event: "chatgpt_ad_click",
        distinct_id: randomUUID(),
        properties: {
          platform: "web",
          lang: c.lang,
          campaign_id: c.campaignId,
          ad_id: c.adId,
          has_click_id: !!c.oppref,
          $process_person_profile: false,
          $ip: null,
        },
      }),
    }),
  );
  const results = await Promise.allSettled(jobs);
  for (const r of results) if (r.status === "rejected") console.error("[go] click log failed", r.reason);
}
