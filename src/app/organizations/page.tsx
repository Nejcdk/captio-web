import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Footer from "@/components/Footer";
import FaqAccordion from "@/components/FaqAccordion";
import { PilotForm } from "./PilotForm";
import { PhoneVideo } from "./PhoneVideo";
import { DirectionMock, SoundsMock, VoicesMock } from "./FeatureMocks";

import { SITE_URL, jsonLd, softwareApplicationSchema, faqPageSchema, breadcrumbSchema } from "@/lib/schema";

// Captio AI for Organizations: a landing page of its own for people who have
// never heard of the app (Nejc 2026-10-28): its own header (logo + "for
// Organizations" + one button, no site menu), what Captio AI is in one
// sentence with the real app playing next to it, three short videos of what
// it does, why organizations buy it, the pilot form, prices, data, FAQ.
// Yearly per-person licenses, paid by invoice, for any organization that pays
// for captioning on someone's behalf (Nejc 2026-10-27: never "students" or
// "staff"). Prices and the pilot: app repo tools/organizations/PLAN.md. Never
// name the speech provider here (business secret); /privacy lists them.
// The pilot starts from the form (PilotForm.tsx): the link to forward is
// emailed at once, people join at /o/<code> (src/app/o/[code]). Videos: the
// app's onboarding loops in public/organizations (PhoneVideo.tsx).

const PILOT_ANCHOR = "#pilot";
const QUOTE_MAILTO = "mailto:hello@captioai.app?subject=Captio%20AI%20quote";

const DESCRIPTION =
  "Captio AI shows deaf and hard of hearing people live captions on their own phone, in person, in 60+ languages. Yearly licenses for your organization, paid by invoice. Free 30-day pilot.";

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

const facts = ["iPhone and Android", "60+ languages", "Stored in the EU"];

// The three main features, each with a loop of the real app.
const mainFeatures = [
  {
    video: "captions",
    label: "Live captions",
    title: "Every word, as it's said",
    description: "Open the app, tap the microphone and read along. Each speaker gets their own label, so it's clear who said what.",
  },
  {
    video: "translate",
    label: "Live translation",
    title: "Both languages side by side",
    description: "When someone speaks another language, they see what was said and its translation at the same time.",
  },
  {
    video: "upload",
    label: "Transcription",
    title: "Recordings and files to text",
    description: "Save any conversation, or add an audio or video file, and get the full transcript with an AI summary.",
  },
];

// Live in the App Store: Recognize voices since 1.1.3, Speaker direction since
// 1.1.4. Recognize sounds ships with 1.1.5: drop its `soon` once 1.1.5 is live.
const awareness = [
  {
    Mock: VoicesMock,
    title: "Knows who is talking",
    description: "Save a person's voice once, from about 20 seconds of them talking, and captions show their name instead of \"Speaker 2\", live and in saved recordings. Voices are made and kept on the phone.",
    where: "iPhone",
    soon: false,
  },
  {
    Mock: DirectionMock,
    title: "Shows where the voice is",
    description: "Waves at the edge of the screen show which side a voice is coming from, in that speaker's colour, so they know where to look in a busy room.",
    where: "iPhone 16 and later",
    soon: false,
  },
  {
    Mock: SoundsMock,
    title: "Hears the sounds around them",
    description: "Sounds show up in the captions the way film subtitles do it. A doorbell, an alarm or a crying baby also makes the phone vibrate.",
    where: "iPhone and iPad",
    soon: true,
  },
];

const reasons = [
  { icon: "⚡", title: "Ready the moment it's needed", description: "No booking a captioner in advance. Captions start with one tap, wherever the person is." },
  { icon: "📱", title: "On their own phone", description: "iPhone or Android. Nothing for your IT team to install and no hardware to hand out." },
  { icon: "🔒", title: "Private by design", description: "Stored in the EU. Audio isn't kept on our servers, and nothing is ever used to train AI." },
  { icon: "🧾", title: "Simple to buy", description: "One price per person per year, by invoice. No minimum, no setup fee, nothing renews by itself." },
];

const plans = [
  { people: "1 to 19 people", gbp: "£89", eur: "€99", usd: "$109" },
  { people: "20 or more people", gbp: "£69", eur: "€79", usd: "$89" },
];

const included = [
  "Captio AI Plus for each person, for 12 months",
  "One link to forward: people join in a minute",
  "Usage totals, never what was said",
  "A setup call, if you'd like one",
  "Email support straight from the founder",
  "A quote, your purchase order, an invoice",
  "A data processing agreement",
  "No minimum, no setup fee, no auto-renewal",
];


const pilotSteps = [
  { number: "1", title: "Get your pilot link", description: "Fill in the form below. The link arrives in your inbox within a minute, with a message ready to forward." },
  { number: "2", title: "Forward it to up to 5 people", description: "Each person opens it on their phone, continues with Apple or Google, and gets Captio AI on iPhone or Android." },
  { number: "3", title: "They have the full version for 30 days", description: "No personal data from you, so no paperwork. Near the end you get a summary of how much it was used, and the price to keep it." },
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
    q: "What is Captio AI?",
    a: "An app for iPhone and Android that shows what people say as text, the moment they say it, in 60+ languages. Deaf and hard of hearing people use it in person, wherever they need captions: they open it, tap the microphone and read along. It can also translate, tell speakers apart and call people it knows by name, show where a voice is coming from (iPhone 16 and later), and save and summarise what was said.",
  },
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
    a: "Yes. A free 30-day pilot for up to 5 people. Fill in the form on this page and the link to forward arrives by email within a minute. Nothing to pay and nothing to sign.",
  },
  {
    q: "Do the people using it need to pay or set anything up?",
    a: "No. They open the link you forward, continue with Apple or Google, then download Captio AI for free on iPhone or Android and sign in with the same account. They have the full version straight away. Your IT team doesn't need to install anything.",
  },
  {
    q: "What do we see about how it's used?",
    a: "Totals only: how many people joined, how many opened Captio AI in the last week, and how many recordings were saved and how long they are. Never what was said, and never who said it.",
  },
  {
    q: "How do we add people after we buy?",
    a: "With the same link. Once your licenses are active, anyone you send it to can join, up to the number of licenses you have. People from the pilot keep everything they saved.",
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
        {/* ── Its own header: no site menu, one way forward ── */}
        <div className="px-4 pt-4">
          <header className="max-w-6xl mx-auto bg-brand rounded-xl px-4 sm:px-5 h-14 sm:h-16 flex items-center justify-between gap-3">
            <Link href="/" className="flex items-center gap-2 min-w-0">
              <Image src="/logo_image_profile.png" alt="" width={40} height={40} className="rounded-full w-9 h-9 sm:w-10 sm:h-10" priority />
              <Image src="/logo_text.png" alt="Captio AI" width={110} height={30} className="w-[92px] sm:w-[110px] h-auto" priority />
              <span className="hidden sm:inline text-sm font-semibold text-white/80 border-l border-white/30 pl-3 ml-1 whitespace-nowrap">for Organizations</span>
            </Link>
            <a
              href={PILOT_ANCHOR}
              className="shrink-0 inline-flex items-center justify-center rounded-[8px] bg-white px-4 py-2.5 text-sm font-semibold text-brand transition-colors hover:bg-white/90 sm:px-5"
            >
              Start a free pilot
            </a>
          </header>
        </div>

        {/* ── Hero: what it is, and the real app working ── */}
        <section className="px-5 pt-8 pb-12 sm:pt-14 sm:pb-16">
          {/* Phones: headline, then the app playing, then the words (the text
              column is "contents" there, so its children and the video share one
              ordered column). Desktop: text left, video right. */}
          <div className="max-w-6xl mx-auto flex flex-col items-center text-center gap-5 lg:grid lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:gap-12 lg:text-left">
            <div className="contents lg:flex lg:flex-col lg:items-start lg:gap-5">
              <span className="order-1 text-[11px] font-bold text-brand uppercase tracking-widest">🏢 Captio AI for Organizations</span>
              <h1 className="order-2 text-[2.3rem] leading-[1.12] sm:text-[3.3rem] font-bold text-gray-900 tracking-tight">
                Live captions on their phone, the moment people{" "}
                <span className="underline decoration-brand decoration-4 underline-offset-4">speak</span>
              </h1>
              <p className="order-4 text-base sm:text-lg text-gray-600 max-w-xl leading-relaxed">
                Captio AI is an app for deaf and hard of hearing people. It listens and shows what&rsquo;s said as text, in person, in 60+ languages. Give it to the people in your organization who need it: one yearly license each, paid by invoice.
              </p>
              <div className="order-5 flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                <MailButton href={PILOT_ANCHOR}>Start a free pilot</MailButton>
                <MailButton href="#how" kind="outline">See how it works</MailButton>
              </div>
              <p className="order-6 text-xs text-gray-500 -mt-1">Free for 30 days, up to 5 people. Nothing to pay, nothing to sign.</p>
              <ul className="order-7 flex flex-wrap justify-center lg:justify-start gap-2">
                {facts.map((f) => (
                  <li key={f} className="flex items-center gap-1.5 rounded-[8px] bg-brand-light px-3 py-1.5 text-xs font-semibold text-brand">
                    <Check className="text-brand" />
                    {f}
                  </li>
                ))}
              </ul>
            </div>
            <div className="order-3 lg:order-none mx-auto w-full max-w-[210px] sm:max-w-[250px] lg:max-w-[270px] my-2 lg:my-0">
              <PhoneVideo name="captions" label="Captio AI showing live captions of two people talking, with a label for each speaker" priority />
            </div>
          </div>
        </section>

        {/* ── What it does ── */}
        <section id="how" className="pt-4 pb-14 px-6 bg-white scroll-mt-4">
          <div className="max-w-6xl mx-auto">
            <SectionTitle
              eyebrow="What Captio AI does"
              title="Live captions, translation and transcription"
              subtitle="Three tools in one app, on their own phone, in 60+ languages."
            />
            {/* Phones: a row to swipe through; larger screens: three columns. */}
            <div className="-mx-6 px-6 flex gap-5 overflow-x-auto snap-x snap-mandatory pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:mx-0 sm:px-0 sm:grid sm:grid-cols-3 sm:gap-8 sm:overflow-visible sm:pb-0">
              {mainFeatures.map((f) => (
                <div key={f.video} className="w-[68%] shrink-0 snap-center sm:w-auto flex flex-col items-center text-center gap-5">
                  <div className="w-full max-w-[200px] sm:max-w-[220px]">
                    <PhoneVideo name={f.video} label={`Captio AI: ${f.label.toLowerCase()}`} />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-cta uppercase tracking-widest">{f.label}</span>
                    <h3 className="mt-1.5 font-bold text-gray-900 text-lg">{f.title}</h3>
                    <p className="mt-1.5 text-sm text-gray-500 leading-relaxed max-w-xs mx-auto">{f.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Made for people who can't hear the room ── */}
        <section className="pb-14 px-6 bg-white">
          <div className="max-w-6xl mx-auto">
            <SectionTitle
              eyebrow="Made for deaf and hard of hearing people"
              title="More than words on a screen"
              subtitle="Who is talking, where they are and what else is going on: the things that matter when you can't hear the room."
            />
            <div className="grid sm:grid-cols-3 gap-5">
              {awareness.map(({ Mock, title, description, where, soon }) => (
                <div key={title} className="rounded-xl border border-gray-200 bg-white p-5 flex flex-col gap-4">
                  <div className="rounded-[10px] bg-gray-50 p-4 min-h-[150px] flex flex-col justify-center">
                    <Mock />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg flex flex-wrap items-center gap-2">
                      {title}
                      {soon && <span className="rounded-[6px] bg-cta/10 px-2 py-0.5 text-[11px] font-bold uppercase tracking-wide text-cta">Next update</span>}
                    </h3>
                    <p className="mt-1.5 text-sm text-gray-500 leading-relaxed">{description}</p>
                    <p className="mt-2 text-xs font-semibold text-brand">{where}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Why organizations choose it ── */}
        <section className="py-12 px-6 bg-brand">
          <div className="max-w-6xl mx-auto">
            <SectionTitle eyebrow="For your organization" title="Why organizations choose Captio AI" onBlue />
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {reasons.map((r) => (
                <div key={r.title} className="bg-white/10 rounded-xl p-6 border border-white/20">
                  <span className="text-2xl" aria-hidden>{r.icon}</span>
                  <h3 className="mt-3 font-semibold text-white">{r.title}</h3>
                  <p className="mt-1 text-sm text-blue-100 leading-relaxed">{r.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Pilot ── */}
        <section id="pilot" className="py-12 px-6 bg-white scroll-mt-4">
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
            <div className="max-w-xl mx-auto mt-8">
              <PilotForm />
            </div>
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
            <div className="flex justify-center mt-6">
              <MailButton href={QUOTE_MAILTO} kind="outline">Ask for a quote</MailButton>
            </div>
          </div>
        </section>

        {/* ── Data protection ── */}
        <section id="data" className="py-12 px-6 bg-white">
          <div className="max-w-5xl mx-auto">
            <SectionTitle eyebrow="For your data protection team" title="How data is handled" />
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {dataFacts.map((d) => (
                <div key={d.title} className="bg-gray-50 rounded-xl p-6 border border-gray-100">
                  <h3 className="font-semibold text-gray-900 mb-1">{d.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{d.description}</p>
                </div>
              ))}
            </div>
            <div className="flex flex-col sm:flex-row gap-3 justify-center mt-8">
              <MailButton href="mailto:hello@captioai.app?subject=Captio%20AI%20data%20processing%20agreement" kind="outline">
                Ask for the data processing agreement
              </MailButton>
              <Link
                href="/privacy"
                className="inline-flex items-center justify-center rounded-[8px] px-6 py-3.5 text-base font-semibold text-brand hover:bg-brand-light transition-colors"
              >
                Read the privacy policy
              </Link>
            </div>
          </div>
        </section>

        {/* ── FAQ ── */}
        <section className="py-12 px-6 bg-gray-50">
          <div className="max-w-3xl mx-auto">
            <SectionTitle eyebrow="FAQ" title="Frequently asked questions" />
            <FaqAccordion faqs={faqs} />
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="pt-12 pb-20 px-6 bg-white">
          <div className="max-w-4xl mx-auto bg-brand rounded-xl px-6 py-10 sm:px-12 sm:py-12 flex flex-col items-center text-center gap-4">
            <span className="text-xs font-bold text-cta uppercase tracking-widest">Free pilot</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">See it with your own people</h2>
            <p className="text-blue-100 max-w-lg">
              Up to 5 people, free for 30 days. The link arrives in your inbox within a minute. Questions first? Write to hello@captioai.app.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 mt-2 w-full sm:w-auto">
              <MailButton href={PILOT_ANCHOR}>Start a free pilot</MailButton>
              <MailButton href={QUOTE_MAILTO} kind="outlineWhite">Ask for a quote</MailButton>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
