import type { Metadata, Viewport } from "next";
import Image from "next/image";
import Link from "next/link";
import LocaleShell from "@/components/LocaleShell";
import { fill } from "@/i18n/fill";
import { isLocale } from "@/i18n/locales";
import { getOrgMessages, type OrgMessages } from "@/i18n/organizations";
import { getOrgLink, normalizeOrgCode, type OrgLink } from "@/lib/orgPilot";
import { JoinOrg, OrgLinkViewed } from "./JoinOrg";

// captioai.app/o/<code>: an organization gives the people it forwards this
// link Captio AI Plus (a 30-day pilot, or paid yearly licenses). The person
// signs in here with Apple or Google, the same account they use (or will use)
// in the app, takes a place (org_join) and has Plus in the app as soon as
// they sign in there. Not a universal link: it always opens in the browser.
// In the language the organization signed up in (org_link_info → language;
// words: src/i18n/organizations/<code>.json → join), English when unknown.
// Rules and emails: app repo supabase/organizations.sql. Never indexed.

export const dynamic = "force-dynamic";
export const viewport: Viewport = { themeColor: "#F2F4F8" };

type Props = { params: Promise<{ code: string }> };

function languageOf(link: OrgLink | null): string {
  const code = link?.language ?? "";
  return isLocale(code) ? code : "en";
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const link = await getOrgLink(normalizeOrgCode((await params).code));
  const ok = link && link !== "error" ? link : null;
  const t = (await getOrgMessages(languageOf(ok))).join;
  const title = ok ? fill(t.metaTitle, { org: ok.name }) : "Captio AI";
  const description = ok ? fill(t.metaDescription, { org: ok.name }) : t.title;
  return {
    title: { absolute: title },
    description,
    robots: { index: false, follow: false },
    openGraph: { title, description, type: "website" },
  };
}

function Header() {
  return (
    <div className="sticky top-0 z-10 px-3 pt-3 sm:px-4 sm:pt-4">
      <header className="mx-auto flex h-14 max-w-xl items-center rounded-xl bg-brand px-4 shadow-[0_6px_20px_rgba(28,73,245,0.25)] sm:h-16 sm:px-5">
        <Link href="/" className="flex items-center gap-2">
          <Image src="/logo_image_profile.png" alt="" width={36} height={36} className="rounded-full sm:h-10 sm:w-10" priority />
          <Image src="/logo_text.png" alt="Captio AI" width={100} height={23} className="sm:w-[110px]" priority />
        </Link>
      </header>
    </div>
  );
}

function longDate(iso: string, lang: string): string {
  const opts: Intl.DateTimeFormatOptions = { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" };
  try {
    return new Intl.DateTimeFormat(lang === "en" ? "en-GB" : lang, opts).format(new Date(iso));
  } catch {
    return new Intl.DateTimeFormat("en-GB", opts).format(new Date(iso));
  }
}

function closedMessage(link: OrgLink, t: OrgMessages["join"]): { title: string; body: string } | null {
  const c = t.closed;
  const v = { org: link.name, seats: link.seats };
  switch (link.status) {
    case "full": return { title: c.fullTitle, body: fill(c.full, v) };
    case "stopped": return { title: c.stoppedTitle, body: fill(c.stopped, v) };
    case "link_expired": return { title: c.expiredTitle, body: fill(c.expired, v) };
    case "ended": return { title: fill(c.endedTitle, v), body: fill(c.ended, v) };
    default: return null;
  }
}

function Offer({ link, code, t, lang }: { link: OrgLink; code: string; t: OrgMessages["join"]; lang: string }) {
  const what = link.plan === "paid" && link.paid_until
    ? fill(t.paidOffer, { date: longDate(link.paid_until, lang), org: link.name })
    : fill(t.pilotOffer, { days: link.pilot_days });
  const closed = closedMessage(link, t);
  return (
    <article className="overflow-hidden rounded-3xl bg-white px-6 pb-8 pt-9 text-center shadow-sm ring-1 ring-black/5 sm:px-10">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-light text-3xl" aria-hidden>🏢</div>
      <p className="mt-5 text-[15px] text-gray-500">{fill(t.gives, { org: link.name })}</p>
      <h1 className="mt-1 text-3xl font-bold leading-tight text-gray-900">{t.title}</h1>
      <p className="mt-3 text-[16px] leading-relaxed text-gray-600">{what} {t.about}</p>

      <div className="mx-auto mt-8 max-w-sm text-start">
        {closed ? (
          <div className="rounded-xl bg-gray-50 p-5 text-center">
            <p className="font-bold text-gray-900">{closed.title}</p>
            <p className="mt-1 text-[15px] text-gray-600">{closed.body}</p>
          </div>
        ) : process.env.SUPABASE_URL && process.env.SUPABASE_ANON_KEY ? (
          <JoinOrg
            code={code}
            orgName={link.name}
            plan={link.plan}
            supabaseUrl={process.env.SUPABASE_URL}
            anonKey={process.env.SUPABASE_ANON_KEY}
            t={t}
            lang={lang}
          />
        ) : (
          <p className="text-center text-[15px] text-gray-600">{t.errorTitle}. {t.errorBody}</p>
        )}
      </div>
    </article>
  );
}

function Message({ title, body }: { title: string; body: string }) {
  return (
    <article className="rounded-3xl bg-white px-6 py-12 text-center shadow-sm ring-1 ring-black/5">
      <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
      <p className="mt-3 text-[16px] text-gray-600">{body}</p>
    </article>
  );
}

export default async function OrgLinkPage({ params }: Props) {
  const code = normalizeOrgCode((await params).code);
  const link = await getOrgLink(code);
  const ok = link && link !== "error" ? link : null;
  const lang = languageOf(ok);
  const t = (await getOrgMessages(lang)).join;
  return (
    <LocaleShell code={lang}>
      <main className="min-h-screen bg-[#F2F4F8]">
        <Header />
        <OrgLinkViewed valid={!!ok} error={link === "error"} status={ok?.status} plan={ok?.plan} placesLeft={ok?.places_left} language={lang} />
        <div className="mx-auto max-w-xl px-3 pb-16 pt-5 sm:px-4 sm:pt-8">
          {ok ? (
            <>
              <Offer link={ok} code={code} t={t} lang={lang} />
              <p className="mt-5 px-4 text-center text-[13px] leading-relaxed text-gray-500">
                {fill(t.privacyNote, { org: ok.name })}{" "}
                <Link href="/privacy" className="font-semibold text-gray-600 hover:underline">{t.privacyLink}</Link>
              </p>
            </>
          ) : link === "error" ? (
            <Message title={t.errorTitle} body={t.errorBody} />
          ) : (
            <Message title={t.invalidTitle} body={t.invalidBody} />
          )}
        </div>
      </main>
    </LocaleShell>
  );
}
