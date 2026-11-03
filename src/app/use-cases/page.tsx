import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import ShortAnswer from "@/components/ShortAnswer";
import { DownloadCard } from "@/components/StoreButtons";
import { useCases } from "@/lib/useCases";
import { languages } from "@/lib/languages";
import { SITE_URL, jsonLd, softwareApplicationSchema, breadcrumbSchema, webPageSchema, itemListSchema } from "@/lib/schema";
import { UPDATED, formatMonth } from "@/lib/updated";

// The hub of the use-case pages: one card per situation, each of which has a
// page per language. English only, like the pages it lists.

const TITLE = "Live Captions Use Cases for Deaf and Hard of Hearing";
const DESCRIPTION =
  "Twelve situations where Captio AI captions speech in real time for deaf and hard of hearing people: meetings, doctor appointments, lectures, group conversations, restaurants, travel and more, each in 60 languages.";

export const metadata: Metadata = {
  // The root layout's title template appends " | Captio AI".
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/use-cases" },
  openGraph: { title: `${TITLE} | Captio AI`, description: DESCRIPTION, url: "/use-cases", type: "website", images: ["/opengraph-image"] },
};

const crumbs = [
  { name: "Home", path: "/" },
  { name: "Use cases", path: "/use-cases" },
];

// Three examples of the language pages, so the hub shows what they are.
const examples = [
  { uc: "doctor-appointments", lang: "german" },
  { uc: "meetings", lang: "spanish" },
  { uc: "lectures", lang: "hindi" },
];

export default function UseCasesHubPage() {
  const schemaOrg = jsonLd(
    webPageSchema({ url: `${SITE_URL}/use-cases`, name: TITLE, description: DESCRIPTION, dateModified: UPDATED.hubs }),
    itemListSchema({
      id: `${SITE_URL}/use-cases#list`,
      name: "Captio AI use cases",
      items: useCases.map((uc) => ({ name: uc.label, url: `${SITE_URL}/use-cases/${uc.slug}` })),
    }),
    softwareApplicationSchema({ url: `${SITE_URL}/use-cases`, description: DESCRIPTION }),
    breadcrumbSchema(crumbs),
  );

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaOrg) }} />
      <main>
        <Header />

        {/* ── Hero ── */}
        <section className="pt-6 pb-10 sm:pt-10 sm:pb-12 px-5 bg-white">
          <div className="max-w-3xl mx-auto flex flex-col items-center text-center gap-4 sm:gap-6">
            <Breadcrumbs items={crumbs} />
            <span className="text-[11px] font-bold text-brand uppercase tracking-widest">
              🦻 Accessibility + 💻 Productivity App
            </span>
            <h1 className="text-[2.4rem] leading-[1.15] sm:text-6xl font-bold text-gray-900 tracking-tight">
              <span className="underline decoration-brand decoration-4 underline-offset-4">Live captions</span> for every situation
            </h1>
            <p className="text-xl sm:text-2xl font-semibold text-gray-800 max-w-xl">
              For <span className="text-brand">deaf</span> and <span className="text-brand">hard of hearing</span> people.
            </p>
            <ShortAnswer reviewed={formatMonth(UPDATED.hubs)}>
              Captio AI shows what the people around you say as text on your iPhone or Android while they are still speaking. These twelve pages cover the situations deaf and hard of hearing people ask about most, from a team meeting to a doctor&apos;s appointment, and each one comes in {languages.length} languages.
            </ShortAnswer>
          </div>
        </section>

        {/* ── The twelve use cases ── */}
        <section className="py-10 px-6 bg-gray-50">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {useCases.map((uc) => (
                <Link
                  key={uc.slug}
                  href={`/use-cases/${uc.slug}`}
                  className="group bg-white rounded-xl border border-gray-200 p-5 hover:border-brand hover:shadow-md transition-all flex flex-col gap-3"
                >
                  <span className="inline-flex items-center gap-2 bg-brand-light text-brand font-bold px-3.5 py-2 rounded-[8px] w-fit">
                    <span className="text-2xl leading-none">{uc.icon}</span>
                    <span className="text-base">{uc.label}</span>
                  </span>
                  <p className="text-sm text-gray-500 leading-relaxed">{uc.description}</p>
                  <span className="mt-auto text-xs font-semibold text-gray-400">In {languages.length} languages</span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ── Every situation in every language ── */}
        <section className="py-10 px-6 bg-white">
          <div className="max-w-3xl mx-auto text-center">
            <span className="text-xs font-bold text-cta uppercase tracking-widest">Languages</span>
            <h2 className="text-3xl font-bold text-gray-900 tracking-tight mt-3">Every situation, in {languages.length} languages</h2>
            <p className="text-gray-500 mt-3 leading-relaxed">
              Each use case has one page per language: why that language is hard to follow in that setting, the numbers on hearing loss where it is spoken, and the questions people ask. For example{" "}
              {examples.map((e, i) => {
                const uc = useCases.find((u) => u.slug === e.uc)!;
                const lang = languages.find((l) => l.languageSlug === e.lang)!;
                return (
                  <span key={e.uc}>
                    {i > 0 && (i === examples.length - 1 ? " or " : ", ")}
                    <Link href={`/use-cases/${e.uc}/${e.lang}`} className="text-brand font-semibold hover:underline">
                      {lang.language} {uc.label.toLowerCase()}
                    </Link>
                  </span>
                );
              })}
              .
            </p>
            <Link href="/languages" className="inline-block mt-5 bg-brand text-white text-sm font-semibold px-5 py-2.5 rounded-[8px] hover:opacity-95 transition-opacity">
              All {languages.length} languages
            </Link>
          </div>
        </section>

        {/* ── Final CTA ── */}
        <section className="pt-10 pb-20 px-6 bg-gray-50">
          <div className="max-w-2xl mx-auto flex flex-col items-center gap-6 text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight">Follow the conversation, wherever it is.</h2>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Captio AI is free to start</p>
            <DownloadCard className="w-full" />
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
