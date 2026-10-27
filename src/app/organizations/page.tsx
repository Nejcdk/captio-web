import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import BackButton from "@/components/BackButton";
import Footer from "@/components/Footer";
import FaqAccordion from "@/components/FaqAccordion";

import { SITE_URL, jsonLd, softwareApplicationSchema, faqPageSchema, breadcrumbSchema } from "@/lib/schema";

// Captio AI for Organizations: yearly per-person licences, paid by invoice, for
// universities and employers that pay for captioning on someone's behalf.
// Prices and the pilot are decided in the app repo: tools/organizations/PLAN.md.
// Never name the speech provider here (business secret); /privacy lists them.

const PILOT_MAILTO = "mailto:hello@captioai.app?subject=Captio%20AI%20pilot";
const QUOTE_MAILTO = "mailto:hello@captioai.app?subject=Captio%20AI%20quote";

const DESCRIPTION =
  "Yearly Captio AI licences for deaf and hard of hearing students and staff, paid by invoice. Live captions on their own phone, in 60+ languages. Free 30-day pilot.";

export const metadata: Metadata = {
  title: "Live Captions for Universities and Employers",
  description: DESCRIPTION,
  alternates: { canonical: "/organizations" },
  openGraph: {
    title: "Live Captions for Universities and Employers | Captio AI",
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
  "A quote, a purchase order process and an invoice (bank transfer)",
  "A data processing agreement for your data protection team",
];

const personGets = [
  { title: "Unlimited live captions", description: "Speech turns into text on their own phone while the person is still speaking, in person, wherever they need captions." },
  { title: "Live translation", description: "Captions in their own language while someone speaks another, for students and staff working in a second language." },
  { title: "60+ languages", description: "Including people who switch languages mid-sentence, with regional accents and dialects." },
  { title: "Knows who is talking", description: "Each speaker gets their own label, and people they name once are recognised by voice." },
  { title: "Saved, searchable transcripts", description: "Keep a session, find a word in it later, and get an AI summary of it." },
  { title: "Recordings and files", description: "Upload an audio or video file and get a transcript of it." },
];

const pilotSteps = [
  { number: "1", title: "Tell us you'd like a pilot", description: "Email hello@captioai.app with your organisation's name. Up to 5 people, for 30 days, free." },
  { number: "2", title: "They download Captio AI and sign in", description: "On iPhone or Android. Each person then emails us from the address shown at the top of the app's Settings." },
  { number: "3", title: "We unlock the full version", description: "Usually the same day. Your organisation shares no personal data with us, so a pilot needs no paperwork." },
];

const dataFacts = [
  { title: "Stored in the EU", description: "Accounts and saved transcripts are stored in the European Union (Frankfurt)." },
  { title: "Audio is not kept on our servers", description: "Speech is processed in real time to make the captions. The audio of recordings people save stays on their own phone." },
  { title: "Never used to train AI", description: "No content is sold, shared for advertising, or used to train AI models, by us or by any provider we use." },
  { title: "Every processor is listed", description: "Our privacy policy names every company that processes data and what for. Transfers outside the UK and EEA are covered by Standard Contractual Clauses." },
  { title: "A data processing agreement", description: "We sign one with your organisation for paid licences, when you send us the names or emails of the people to unlock." },
  { title: "Deletion", description: "Anyone can delete their account and recordings in the app, at any time." },
];

const faqs = [
  {
    q: "Who is Captio AI for Organizations for?",
    a: "Universities, colleges, schools and employers that pay for captioning on behalf of deaf and hard of hearing students or staff. Each person gets Captio AI Plus on their own phone for a year, and the organisation pays one invoice.",
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
    q: "Do the students or staff need to pay or set anything up?",
    a: "No. They download Captio AI for free on iPhone or Android, sign in, and we unlock the full version for them. Your IT team doesn't need to install anything.",
  },
  {
    q: "What happens after 12 months?",
    a: "We send a renewal quote a month before the licences end. Nothing renews or charges automatically.",
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
    a: "Yes, inside the app. Organisation licences are for when someone else pays: a university, a college, a school or an employer.",
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

function MailButton({ href, children, light = false }: { href: string; children: React.ReactNode; light?: boolean }) {
  return (
    <a
      href={href}
      className={
        light
          ? "inline-flex items-center justify-center rounded-2xl bg-white px-6 py-3.5 text-base font-semibold text-brand hover:bg-brand-light transition-colors"
          : "inline-flex items-center justify-center rounded-2xl bg-brand px-6 py-3.5 text-base font-semibold text-white hover:bg-brand-dark transition-colors"
      }
    >
      {children}
    </a>
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
        <section className="pt-2 pb-10 sm:pt-4 px-5 bg-white">
          <div className="max-w-3xl mx-auto flex flex-col items-center text-center gap-5">
            <h1 className="text-[2.2rem] leading-[1.15] sm:text-5xl font-bold text-gray-900 tracking-tight">
              Live captions for your deaf and hard of hearing students and staff
            </h1>
            <p className="text-base sm:text-lg text-gray-500 leading-relaxed max-w-2xl">
              Captio AI on their own phone, in person, wherever they need captions. One yearly licence per person,
              paid by invoice. Try it free for 30 days.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 mt-2">
              <MailButton href={PILOT_MAILTO}>Start a free pilot</MailButton>
              <a
                href={QUOTE_MAILTO}
                className="inline-flex items-center justify-center rounded-2xl border border-gray-200 px-6 py-3.5 text-base font-semibold text-gray-900 hover:bg-gray-50 transition-colors"
              >
                Ask for a quote
              </a>
            </div>
          </div>
        </section>

        {/* ── Pricing ── */}
        <section className="py-10 px-6 bg-gray-50">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <span className="text-xs font-bold text-cta uppercase tracking-widest">Pricing</span>
              <h2 className="text-3xl font-bold text-gray-900 tracking-tight mt-3">Per person, per year</h2>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              {plans.map((p) => (
                <div key={p.people} className="bg-white rounded-2xl p-6 border border-gray-100 flex flex-col gap-2">
                  <span className="text-sm font-semibold text-gray-500">{p.people}</span>
                  <span className="text-4xl font-bold text-gray-900 tracking-tight">{p.gbp}</span>
                  <span className="text-sm text-gray-500">
                    {p.eur} or {p.usd}, per person per year
                  </span>
                </div>
              ))}
            </div>
            <div className="bg-white rounded-2xl p-6 border border-gray-100 mt-4">
              <h3 className="font-bold text-gray-900 mb-3">Included</h3>
              <ul className="flex flex-col gap-2">
                {included.map((item) => (
                  <li key={item} className="text-sm text-gray-600 leading-relaxed">
                    ✅ {item}
                  </li>
                ))}
              </ul>
            </div>
            <p className="text-xs text-gray-400 text-center mt-4">
              No minimum, no setup fee, nothing renews automatically. Prices exclude VAT where it applies.
            </p>
          </div>
        </section>

        {/* ── Pilot ── */}
        <section className="py-10 px-6 bg-white">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-10">
              <span className="text-xs font-bold text-cta uppercase tracking-widest">Free pilot</span>
              <h2 className="text-3xl font-bold text-gray-900 tracking-tight mt-3">30 days, up to 5 people</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {pilotSteps.map((s) => (
                <div key={s.number} className="bg-gray-50 rounded-2xl p-5 border border-gray-100 flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-brand">{s.number}.</span>
                    <h3 className="font-bold text-gray-900 text-base leading-snug">{s.title}</h3>
                  </div>
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
        <section className="py-10 px-6 bg-white">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-8">
              <span className="text-xs font-bold text-cta uppercase tracking-widest">What each person gets</span>
              <h2 className="text-3xl font-bold text-gray-900 tracking-tight mt-3">Everything in Captio AI Plus</h2>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {personGets.map((f) => (
                <div key={f.title} className="bg-gray-50 rounded-2xl p-5 flex flex-col gap-2 border border-gray-100">
                  <h3 className="font-bold text-gray-900 text-base leading-snug">{f.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{f.description}</p>
                </div>
              ))}
            </div>
            <p className="text-sm text-gray-500 text-center mt-6">
              More about <Link href="/live-captions" className="text-brand font-semibold hover:underline">live captions</Link> and{" "}
              <Link href="/live-translator" className="text-brand font-semibold hover:underline">live translation</Link>.
            </p>
          </div>
        </section>

        {/* ── Data protection ── */}
        <section id="data" className="py-10 px-6 bg-brand">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-8">
              <span className="text-xs font-bold text-cta uppercase tracking-widest">For your data protection team</span>
              <h2 className="text-3xl font-bold text-white tracking-tight mt-3">How data is handled</h2>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {dataFacts.map((d) => (
                <div key={d.title} className="bg-white/10 rounded-2xl p-5 border border-white/20">
                  <h3 className="font-semibold text-white mb-1">{d.title}</h3>
                  <p className="text-sm text-blue-100 leading-relaxed">{d.description}</p>
                </div>
              ))}
            </div>
            <div className="flex flex-col sm:flex-row gap-3 justify-center mt-8">
              <Link
                href="/privacy"
                className="inline-flex items-center justify-center rounded-2xl border border-white/40 px-6 py-3.5 text-base font-semibold text-white hover:bg-white/10 transition-colors"
              >
                Read the privacy policy
              </Link>
              <MailButton href="mailto:hello@captioai.app?subject=Captio%20AI%20data%20processing%20agreement" light>
                Ask for the data processing agreement
              </MailButton>
            </div>
          </div>
        </section>

        {/* ── FAQ ── */}
        <section className="py-10 px-6 bg-gray-50">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-7">
              <span className="text-xs font-bold text-cta uppercase tracking-widest">FAQ</span>
              <h2 className="text-3xl font-bold text-gray-900 tracking-tight mt-3">Frequently asked questions</h2>
            </div>
            <FaqAccordion faqs={faqs} />
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="pt-10 pb-20 px-6 bg-gray-50">
          <div className="max-w-2xl mx-auto flex flex-col items-center gap-5 text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight">Try it with your people</h2>
            <p className="text-base text-gray-500 leading-relaxed">
              Free for 30 days, up to 5 people. Questions first? Write to{" "}
              <a href="mailto:hello@captioai.app" className="text-brand font-semibold hover:underline">hello@captioai.app</a>.
            </p>
            <MailButton href={PILOT_MAILTO}>Start a free pilot</MailButton>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
