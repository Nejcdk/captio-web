import type { Metadata, Viewport } from "next";
import Image from "next/image";
import Link from "next/link";
import { getOrgLink, normalizeOrgCode, type OrgLink } from "@/lib/orgPilot";
import { JoinOrg, OrgLinkViewed } from "./JoinOrg";

// captioai.app/o/<code>: an organization gives the people it forwards this
// link Captio AI Plus (a 30-day pilot, or paid yearly licenses). The person
// signs in here with Apple or Google, the same account they use (or will use)
// in the app, takes a place (org_join) and has Plus in the app as soon as
// they sign in there. Not a universal link: it always opens in the browser.
// Rules and emails: app repo supabase/organizations.sql. Never indexed.

export const dynamic = "force-dynamic";
export const viewport: Viewport = { themeColor: "#F2F4F8" };

type Props = { params: Promise<{ code: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const link = await getOrgLink(normalizeOrgCode((await params).code));
  const ok = link && link !== "error" ? link : null;
  const title = ok ? `Captio AI from ${ok.name}` : "Captio AI";
  const description = ok
    ? `${ok.name} gives you Captio AI: live captions of what people say, on your own phone.`
    : "Live captions on your own phone.";
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

const until = (iso: string) =>
  new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }).format(new Date(iso));

function closedMessage(link: OrgLink): { title: string; body: string } | null {
  switch (link.status) {
    case "full":
      return { title: "All places are taken", body: `All ${link.seats} places from ${link.name} are taken. Ask ${link.name} about more places.` };
    case "stopped":
      return { title: "This link has been closed", body: `Ask ${link.name} for a new one.` };
    case "link_expired":
      return { title: "This pilot link has expired", body: `Ask ${link.name} for a new one.` };
    case "ended":
      return { title: `${link.name}'s licenses have ended`, body: `Ask ${link.name} whether they're renewing Captio AI.` };
    default:
      return null;
  }
}

function Offer({ link, code }: { link: OrgLink; code: string }) {
  const what = link.plan === "paid" && link.paid_until
    ? `The full version of Captio AI until ${until(link.paid_until)}, paid for by ${link.name}.`
    : `The full version of Captio AI, free for ${link.pilot_days} days.`;
  const closed = closedMessage(link);
  return (
    <article className="overflow-hidden rounded-3xl bg-white px-6 pb-8 pt-9 text-center shadow-sm ring-1 ring-black/5 sm:px-10">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-light text-3xl" aria-hidden>🏢</div>
      <p className="mt-5 text-[15px] text-gray-500">{link.name} gives you</p>
      <h1 className="mt-1 text-3xl font-bold leading-tight text-gray-900">Live captions on your phone</h1>
      <p className="mt-3 text-[16px] leading-relaxed text-gray-600">{what} Captions of what people say, as they speak, in 60+ languages.</p>

      <div className="mx-auto mt-8 max-w-sm text-left">
        {closed ? (
          <div className="rounded-xl bg-gray-50 p-5 text-center">
            <p className="font-bold text-gray-900">{closed.title}</p>
            <p className="mt-1 text-[15px] text-gray-600">{closed.body}</p>
          </div>
        ) : process.env.SUPABASE_URL && process.env.SUPABASE_ANON_KEY ? (
          <JoinOrg code={code} orgName={link.name} plan={link.plan} supabaseUrl={process.env.SUPABASE_URL} anonKey={process.env.SUPABASE_ANON_KEY} />
        ) : (
          <p className="text-center text-[15px] text-gray-600">Couldn&rsquo;t load this page. Please try again in a moment.</p>
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
  return (
    <main className="min-h-screen bg-[#F2F4F8]">
      <Header />
      <OrgLinkViewed valid={!!ok} error={link === "error"} status={ok?.status} plan={ok?.plan} placesLeft={ok?.places_left} />
      <div className="mx-auto max-w-xl px-3 pb-16 pt-5 sm:px-4 sm:pt-8">
        {ok ? (
          <>
            <Offer link={ok} code={code} />
            <p className="mt-5 px-4 text-center text-[13px] leading-relaxed text-gray-500">
              {ok.name} only sees how many people joined and how much Captio AI was used in total, never what was said.{" "}
              <Link href="/privacy" className="font-semibold text-gray-600 hover:underline">Privacy policy</Link>
            </p>
          </>
        ) : link === "error" ? (
          <Message title="Couldn’t load this page" body="Please try again in a moment." />
        ) : (
          <Message title="This link doesn’t work" body="Check that it was copied in full, or ask whoever sent it for a new one." />
        )}
      </div>
    </main>
  );
}
