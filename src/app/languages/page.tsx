import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import ShortAnswer from "@/components/ShortAnswer";
import FaqAccordion from "@/components/FaqAccordion";
import HeroDownload from "@/components/HeroDownload";
import { DownloadCard } from "@/components/StoreButtons";
import { languages } from "@/lib/languages";
import { useCases } from "@/lib/useCases";
import { LOCALES } from "@/i18n/locales";
import { SITE_URL, jsonLd, softwareApplicationSchema, faqPageSchema, breadcrumbSchema, webPageSchema, itemListSchema } from "@/lib/schema";
import { UPDATED, formatMonth } from "@/lib/updated";

// The hub of the language pages: the answer to "which languages does Captio AI
// support", with one card per language. English only, like the pages it lists;
// each card also links to the site in that language.

const COUNT = languages.length;
const TITLE = `${COUNT} Languages for Live Captions and Translation`;
const DESCRIPTION = `Captio AI captions, translates and transcribes speech in ${COUNT} languages, from English, Spanish and Chinese to Welsh and Basque. Every language has its own page with the regional accents and dialects it covers, and one page for each situation where you use it.`;

export const metadata: Metadata = {
  // The root layout's title template appends " | Captio AI".
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/languages" },
  openGraph: { title: `${TITLE} | Captio AI`, description: DESCRIPTION, url: "/languages", type: "website", images: ["/opengraph-image"] },
};

const crumbs = [
  { name: "Home", path: "/" },
  { name: "Languages", path: "/languages" },
];

// The first, second and fourth say what the home page's FAQ says.
const faqs = [
  {
    q: "Which languages does Captio AI support?",
    a: `Captio AI supports ${COUNT} languages including English, Spanish, French, German, Mandarin, Arabic, Hindi, Japanese, Korean, Portuguese, Russian, and many more. All languages are available for Live Captions and Live Translator. The full list is on this page, and each language links to its own page.`,
  },
  {
    q: "Does Captio AI work with different accents and dialects?",
    a: "Yes. Captio AI handles a wide range of regional accents and dialects — not just standard textbook speech. It supports Australian English, Latin American Spanish, Swiss German, Brazilian Portuguese, Québécois French, and many others. Each language page lists the regional varieties it covers.",
  },
  {
    q: "Can Captio AI follow a conversation that switches between two languages?",
    a: "Yes. Captio AI handles speech that switches languages mid-sentence, and you can tell it which language to expect so it starts tuned in from the first word.",
  },
  {
    q: "What is the difference between Live Captions and Live Translator?",
    a: "Live Captions transcribes speech in the original spoken language. Live Translator takes that speech and translates it into your chosen language in real time — ideal when the speaker and the reader speak different languages, such as a foreign doctor or a business meeting in another language.",
  },
  {
    q: "Is this website in my language?",
    a: `The home page, the four feature pages and the organizations page are in all ${COUNT} languages: use the globe button in the header, or the link on a language's card on this page. The language pages, the use-case pages, the blog and the comparisons are in English.`,
  },
];

export default function LanguagesHubPage() {
  const schemaOrg = jsonLd(
    webPageSchema({ url: `${SITE_URL}/languages`, name: TITLE, description: DESCRIPTION, dateModified: UPDATED.hubs }),
    itemListSchema({
      id: `${SITE_URL}/languages#list`,
      name: "Languages Captio AI supports",
      items: languages.map((l) => ({ name: l.language, url: `${SITE_URL}/${l.languageSlug}` })),
    }),
    softwareApplicationSchema({ url: `${SITE_URL}/languages`, description: DESCRIPTION }),
    faqPageSchema(faqs),
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
              <span className="underline decoration-brand decoration-4 underline-offset-4">Live captions</span> in{" "}
              <span className="bg-brand text-white px-3 py-1 rounded-[8px] inline-block">{COUNT} languages</span>
            </h1>
            <p className="text-xl sm:text-2xl font-semibold text-gray-800 max-w-xl">
              For <span className="text-brand">deaf</span> and <span className="text-brand">hard of hearing</span> people.
            </p>
            <HeroDownload alt="Captio AI app showing live captions in 60 languages" />
            <ShortAnswer reviewed={formatMonth(UPDATED.hubs)}>
              Captio AI captions, translates and transcribes speech in {COUNT} languages on iPhone and Android, for deaf and hard of hearing people. Each language below has its own page with the regional accents and dialects it covers, and one page for each of {useCases.length} situations, from meetings to doctor appointments. This website itself is in all {COUNT} languages.
            </ShortAnswer>
          </div>
        </section>

        {/* ── The languages ── */}
        <section className="py-10 px-6 bg-gray-50">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {languages.map((l) => {
                const locale = LOCALES.find((x) => x.slug === l.languageSlug);
                const varieties = l.dialectCards?.length ?? 0;
                return (
                  <div key={l.languageSlug} className="bg-white rounded-xl border border-gray-200 p-5 flex flex-col gap-2 hover:border-brand transition-colors">
                    <Link href={`/${l.languageSlug}`} className="inline-flex items-center gap-2 bg-brand-light text-brand font-bold px-3.5 py-2 rounded-[8px] w-fit hover:bg-brand hover:text-white transition-colors">
                      <span className="text-2xl leading-none">{l.flag}</span>
                      <span className="text-base">{l.language}</span>
                    </Link>
                    <p className="text-sm text-gray-500 leading-relaxed">{l.countries}</p>
                    <p className="text-sm text-gray-700">
                      <Link href={`/${l.languageSlug}`} className="font-semibold hover:text-brand transition-colors">
                        {varieties > 0 ? `${varieties} regional varieties` : "Dialects and accents"}
                      </Link>
                      {locale && (
                        <>
                          <span className="text-gray-300" aria-hidden> | </span>
                          <Link href={`/${locale.code}`} className="font-semibold hover:text-brand transition-colors">
                            Site in <span lang={locale.code}>{locale.native}</span>
                          </Link>
                        </>
                      )}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── Every language, every situation ── */}
        <section className="py-10 px-6 bg-white">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-7">
              <span className="text-xs font-bold text-cta uppercase tracking-widest">Use cases</span>
              <h2 className="text-3xl font-bold text-gray-900 tracking-tight mt-3">Every language, in every situation</h2>
              <p className="text-gray-500 mt-3 max-w-xl mx-auto">
                Each of these {useCases.length} situations has a page for each of the {COUNT} languages: open one, then pick your language from the list on it.
              </p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {useCases.map((uc) => (
                <Link
                  key={uc.slug}
                  href={`/use-cases/${uc.slug}`}
                  className="flex items-center gap-2 px-4 py-3 bg-white border border-gray-200 rounded-[8px] text-sm font-bold text-gray-900 hover:border-brand hover:text-brand transition-colors"
                >
                  <span className="text-base">{uc.icon}</span>
                  {uc.label}
                </Link>
              ))}
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

        {/* ── Final CTA ── */}
        <section className="pt-10 pb-20 px-6 bg-gray-50">
          <div className="max-w-2xl mx-auto flex flex-col items-center gap-6 text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight">Start captioning in your language.</h2>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Captio AI is free to start</p>
            <DownloadCard className="w-full" />
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
