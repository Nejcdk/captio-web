import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Header from "@/components/Header";
import BackButton from "@/components/BackButton";
import Footer from "@/components/Footer";
import FaqAccordion from "@/components/FaqAccordion";

import { SITE_URL, jsonLd, softwareApplicationSchema, faqPageSchema, breadcrumbSchema } from "@/lib/schema";

// Captio AI for Organizations: yearly per-person licenses, paid by invoice, for
// any organization that pays for captioning on someone's behalf. Nejc
// 2026-10-27: meant for any organization, never "students" or "staff".
// Prices and the pilot are decided in the app repo: tools/organizations/PLAN.md.
// Never name the speech provider here (business secret); /privacy lists them.

const PILOT_MAILTO = "mailto:hello@captioai.app?subject=Captio%20AI%20pilot";
const QUOTE_MAILTO = "mailto:hello@captioai.app?subject=Captio%20AI%20quote";

const DESCRIPTION =
  "Yearly Captio AI licenses for the deaf and hard of hearing people in your organization, paid by invoice. Live captions on their own phone, in 60+ languages. Free 30-day pilot.";

export const metadata: Metadata = {
  title: "Live Captions for Organizations",
  description: DESCRIPTION,
  alternates: { canonical: "/organizations" },
  openGraph: {
    title: "Live Captions for Organizations | Captio AI",
    description: DESCRIPTION,
    url: "/organizations",
    type: "website",
    images: ["/opengraph-image"],
  },
};

const plans = [
  { people: "1 to 19 people", gbp: "£89", eur: "€99", usd: "$109" },
  { people: "20 or more people", gbp: "£69", eur: "€79", usd: "$89" },
];

const included = [
  "Captio AI Plus for each person, for 12 months",
  "A setup call, if you'd like one",
  "Email support straight from the founder",
  "A quote, your purchase order, an invoice",
  "A data processing agreement",
  "No minimum, no setup fee, no auto-renewal",
];

const personGets = [
  { title: "Unlimited live captions", description: "Speech turns into text on their own phone while the person is still speaking, in person, wherever they need captions." },
  { title: "Live translation", description: "Captions in their own language while someone speaks another, for people working in a second language." },
  { title: "60+ languages", description: "Including people who switch languages mid-sentence, with regional accents and dialects." },
  { title: "Knows who is talking", description: "Each speaker gets their own label, and people they name once are recognised by voice." },
  { title: "Saved, searchable transcripts", description: "Keep a session, find a word in it later, and get an AI summary of it." },
  { title: "Recordings and files", description: "Upload an audio or video file and get a transcript of it." },
];

const pilotSteps = [
  { number: "1", title: "Tell us you'd like a pilot", description: "Email hello@captioai.app with your organization's name. Up to 5 people, for 30 days, free." },
  { number: "2", title: "They download Captio AI and sign in", description: "On iPhone or Android. Each person then emails us from the address shown at the top of the app's Settings." },
  { number: "3", title: "We unlock the full version", description: "Usually the same day. Your organization shares no personal data with us, so a pilot needs no paperwork." },
];

const dataFacts = [
  { title: "Stored in the EU", description: "Accounts and saved transcripts are stored in the European Union (Frankfurt)." },
  { title: "Audio is not kept on our servers", description: "Speech is processed in real time to make the captions. The audio of recordings people save stays on their own phone." },
  { title: "Never used to train AI", description: "No content is sold, shared for advertising, or used to train AI models, by us or by any provider we use." },
  { title: "Every processor is listed", description: "Our privacy policy names every company that processes data and what for. Transfers outside the UK and EEA are covered by Standard Contractual Clauses." },
  { title: "A data processing agreement", description: "We sign one with your organization for paid licenses, when you send us the names or emails of the people to unlock." },
  { title: "Deletion", description: "Anyone can delete their account and recordings in the app, at any time." },
];

const faqs = [
  {
    q: "Who is Captio AI for Organizations for?",
    a: "Any organization that pays for captioning on behalf of deaf and hard of hearing people. Each person gets Captio AI Plus on their own phone for a year, and the organization pays one invoice.",
  },
  {
    q: "How much does it cost?",
    a: "£89, €99 or $109 per person per year for 1 to 19 people, and £69, €79 or $89 per person per year from 20 people. There is no minimum and no setup fee. Prices exclude VAT where it applies.",
  },
  {
    q: "How do we pay?",
    a: "By invoice and bank transfer. We send a quote first, and we're happy to work with your purchase order process.",
  },
  {
    q: "Can we try it first?",
    a: "Yes. A free 30-day pilot for up to 5 people. Nothing to pay and nothing to sign. Email hello@captioai.app to start.",
  },
  {
    q: "Do the people using it need to pay or set anything up?",
    a: "No. They download Captio AI for free on iPhone or Android, sign in, and we unlock the full version for them. Your IT team doesn't need to install anything.",
  },
  {
    q: "What happens after 12 months?",
    a: "We send a renewal quote a month before the licenses end. Nothing renews or charges automatically.",
  },
  {
    q: "Does it replace a human captioner or note-taker?",
    a: "Not in every case. Captio AI gives instant captions wherever the person is, without booking anyone in advance. Where a perfect record is required, many services use it alongside human support.",
  },
  {
    q: "Where is our data stored, and who processes it?",
    a: "Accounts and saved transcripts are stored in the EU (Frankfurt). Audio is processed in real time and not kept on our servers. Our privacy policy lists every company that processes data. Nothing is used to train AI models.",
  },
  {
    q: "Can one person buy Captio AI Plus themselves?",
    a: "Yes, inside the app. Organization licenses are for when an organization pays on someone's behalf.",
  },
];

const schemaOrg = jsonLd(
  softwareApplicationSchema({
    url: `${SITE_URL}/organizations`,
    description: DESCRIPTION,
  }),
  faqPageSchema(faqs),
  breadcrumbSchema([
    { name: "Home", path: "/" },
    { name: "For organizations", path: "/organizations" },
  ]),
);

type ButtonKind = "primary" | "outline" | "white" | "outlineWhite";

const BUTTON: Record<ButtonKind, string> = {
  primary: "bg-cta text-white hover:bg-cta-dark",
  outline: "bg-white text-brand border border-brand hover:bg-brand-light",
  white: "bg-white text-brand hover:bg-white/90",
  outlineWhite: "text-white border border-white/50 hover:bg-white/10",
};

// Same shape as every other button on the site: 8px corners, semibold.
function MailButton({ href, children, kind = "primary" }: { href: string; children: React.ReactNode; kind?: ButtonKind }) {
  return (
    <a
      href={href}
      className={`inline-flex items-center justify-center gap-2 rounded-[8px] px-6 py-3.5 text-base font-semibold transition-colors ${BUTTON[kind]}`}
    >
      {children}
    </a>
  );
}

function Check({ className = "text-brand" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden className={`w-4 h-4 shrink-0 mt-0.5 ${className}`}>
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

function SectionTitle({ eyebrow, title, subtitle, onBlue = false }: { eyebrow: string; title: string; subtitle?: string; onBlue?: boolean }) {
  return (
    <div className="text-center mb-8">
      <span className="text-xs font-bold text-cta uppercase tracking-widest">{eyebrow}</span>
      <h2 className={`text-3xl font-bold tracking-tight mt-3 ${onBlue ? "text-white" : "text-gray-900"}`}>{title}</h2>
      {subtitle && <p className={`mt-3 max-w-xl mx-auto ${onBlue ? "text-blue-100" : "text-gray-500"}`}>{subtitle}</p>}
    </div>
  );
}

export default function OrganizationsPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaOrg) }} />
      <main>
        <Header />

        {/* ── Nav bar ── */}
        <div className="px-6 pt-6 pb-3 sm:pt-10 bg-white">
          <div className="max-w-6xl mx-auto flex items-center justify-center gap-4">
            <BackButton label="Back" />
            <span className="text-sm font-medium text-gray-500">For organizations</span>
          </div>
        </div>

        {/* ── Hero ── */}
        <section className="pt-2 pb-12 sm:pt-4 sm:pb-16 px-5 bg-white">
          <div className="max-w-3xl mx-auto flex flex-col items-center text-center gap-4 sm:gap-6">
            <span className="text-[11px] font-bold text-brand uppercase tracking-widest">🏢 For organizations</span>
            <h1 className="text-[2.2rem] leading-[1.15] sm:text-[3.4rem] font-bold text-gray-900 tracking-tight">
              Live captions for the{" "}
              <span className="underline decoration-brand decoration-4 underline-offset-4">deaf and hard of hearing</span>{" "}
              people in your organization
            </h1>
            <p className="text-base sm:text-lg text-gray-500 max-w-xl leading-relaxed">
              Captio AI on their own phone, in person, wherever they need captions. One yearly license per person, paid by invoice.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              <MailButton href={PILOT_MAILTO}>Start a free pilot</MailButton>
              <MailButton href={QUOTE_MAILTO} kind="outline">Ask for a quote</MailButton>
            </div>
            <p className="text-xs text-gray-400">Free for 30 days, up to 5 people. Nothing to pay, nothing to sign.</p>
            <Image
              src="/mockup_app.png"
              alt="Captio AI showing live captions and a saved transcript with its summary"
              width={895}
              height={1024}
              className="w-[260px] sm:w-[340px] h-auto mx-auto mt-4 sm:mt-6 drop-shadow-2xl"
              priority
            />
          </div>
        </section>

        {/* ── Pricing ── */}
        <section className="py-12 px-6 bg-gray-50">
          <div className="max-w-4xl mx-auto">
            <SectionTitle eyebrow="Pricing" title="One price per person, per year" subtitle="Paid by invoice and bank transfer. Prices exclude VAT where it applies." />
            <div className="grid sm:grid-cols-2 gap-5">
              <div className="bg-brand rounded-xl p-8 flex flex-col gap-1">
                <span className="text-xs font-bold text-cta uppercase tracking-wide">{plans[0].people}</span>
                <span className="text-5xl font-bold text-white tracking-tight mt-3">{plans[0].gbp}</span>
                <span className="text-sm text-white/80 mt-1">per person per year</span>
                <span className="text-sm text-white/60">{plans[0].eur} or {plans[0].usd}</span>
              </div>
              <div className="bg-white rounded-xl p-8 flex flex-col gap-1 border-2 border-brand">
                <span className="text-xs font-bold text-brand uppercase tracking-wide">{plans[1].people}</span>
                <span className="text-5xl font-bold text-gray-900 tracking-tight mt-3">{plans[1].gbp}</span>
                <span className="text-sm text-gray-600 mt-1">per person per year</span>
                <span className="text-sm text-gray-400">{plans[1].eur} or {plans[1].usd}</span>
              </div>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-6 sm:p-8 mt-5">
              <h3 className="font-bold text-gray-900 mb-4">Included</h3>
              <ul className="grid sm:grid-cols-2 gap-x-8 gap-y-3">
                {included.map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-sm text-gray-600 leading-relaxed">
                    <Check />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* ── Pilot ── */}
        <section className="py-12 px-6 bg-white">
          <div className="max-w-5xl mx-auto">
            <SectionTitle eyebrow="Free pilot" title="Try it for 30 days with up to 5 people" />
            <div className="grid sm:grid-cols-3 gap-5">
              {pilotSteps.map((s) => (
                <div key={s.number} className="bg-white rounded-xl border border-gray-200 p-6 flex flex-col gap-3">
                  <span className="w-9 h-9 rounded-[8px] bg-brand-light text-brand font-bold flex items-center justify-center">{s.number}</span>
                  <h3 className="font-bold text-gray-900 leading-snug">{s.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{s.description}</p>
                </div>
              ))}
            </div>
            <div className="flex justify-center mt-8">
              <MailButton href={PILOT_MAILTO}>Start a free pilot</MailButton>
            </div>
          </div>
        </section>

        {/* ── What each person gets ── */}
        <section className="py-12 px-6 bg-gray-50">
          <div className="max-w-6xl mx-auto">
            <SectionTitle eyebrow="What each person gets" title="Everything in Captio AI Plus" />
            <div className="grid lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] gap-5 items-center">
              <Image
                src="/work_mockup.png"
                alt="Captio AI live captions on a phone, held in one hand"
                width={1024}
                height={1024}
                className="w-full max-w-md lg:max-w-none mx-auto h-auto rounded-xl object-cover"
              />
              <div className="grid sm:grid-cols-2 gap-4">
                {personGets.map((f) => (
                  <div key={f.title} className="bg-white rounded-xl border border-gray-200 p-5 flex flex-col gap-2">
                    <h3 className="font-bold text-gray-900 leading-snug flex items-start gap-2.5">
                      <Check />
                      {f.title}
                    </h3>
                    <p className="text-sm text-gray-500 leading-relaxed">{f.description}</p>
                  </div>
                ))}
              </div>
            </div>
            <p className="text-sm text-gray-500 text-center mt-6">
              More about <Link href="/live-captions" className="text-brand font-semibold hover:underline">live captions</Link> and{" "}
              <Link href="/live-translator" className="text-brand font-semibold hover:underline">live translation</Link>.
            </p>
          </div>
        </section>

        {/* ── Data protection ── */}
        <section id="data" className="py-12 px-6 bg-brand">
          <div className="max-w-5xl mx-auto">
            <SectionTitle eyebrow="For your data protection team" title="How data is handled" onBlue />
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {dataFacts.map((d) => (
                <div key={d.title} className="bg-white/10 rounded-xl p-6 border border-white/20">
                  <h3 className="font-semibold text-white mb-1">{d.title}</h3>
                  <p className="text-sm text-blue-100 leading-relaxed">{d.description}</p>
                </div>
              ))}
            </div>
            <div className="flex flex-col sm:flex-row gap-3 justify-center mt-8">
              <MailButton href="mailto:hello@captioai.app?subject=Captio%20AI%20data%20processing%20agreement" kind="white">
                Ask for the data processing agreement
              </MailButton>
              <Link
                href="/privacy"
                className="inline-flex items-center justify-center rounded-[8px] px-6 py-3.5 text-base font-semibold text-white border border-white/50 hover:bg-white/10 transition-colors"
              >
                Read the privacy policy
              </Link>
            </div>
          </div>
        </section>

        {/* ── FAQ ── */}
        <section className="py-12 px-6 bg-white">
          <div className="max-w-3xl mx-auto">
            <SectionTitle eyebrow="FAQ" title="Frequently asked questions" />
            <FaqAccordion faqs={faqs} />
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="pt-4 pb-20 px-6 bg-white">
          <div className="max-w-4xl mx-auto bg-brand rounded-xl px-6 py-10 sm:px-12 sm:py-12 flex flex-col items-center text-center gap-4">
            <span className="text-xs font-bold text-cta uppercase tracking-widest">Free pilot</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">Try it free for 30 days</h2>
            <p className="text-blue-100 max-w-lg">
              Up to 5 people, nothing to pay. Questions first? Write to hello@captioai.app.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 mt-2 w-full sm:w-auto">
              <MailButton href={PILOT_MAILTO}>Start a free pilot</MailButton>
              <MailButton href={QUOTE_MAILTO} kind="outlineWhite">Ask for a quote</MailButton>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
