import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FaqAccordion from "@/components/FaqAccordion";
import ReviewCarousel from "@/components/ReviewCarousel";
import { useCases, getUseCaseBySlug } from "@/lib/useCases";
import { languages, getLanguageBySlug } from "@/lib/languages";

export async function generateStaticParams() {
  const params: { slug: string; language: string }[] = [];
  for (const uc of useCases) {
    for (const lang of languages) {
      params.push({ slug: uc.slug, language: lang.languageSlug });
    }
  }
  return params;
}

type Props = {
  params: Promise<{ slug: string; language: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, language } = await params;
  const uc = getUseCaseBySlug(slug);
  const lang = getLanguageBySlug(language);
  if (!uc || !lang) return {};
  return {
    title: `${uc.label} in ${lang.language} — Captio AI`,
    description: `Captio AI helps deaf and hard of hearing ${lang.language} speakers with ${uc.label.toLowerCase()}. Real-time live captions and translation. ${lang.dialectNote}.`,
  };
}

const AppStoreButton = () => (
  <a
    href="#"
    className="inline-flex items-center gap-3 bg-cta text-white font-semibold px-7 py-4 rounded-[8px] hover:bg-cta-dark transition-colors"
  >
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 shrink-0">
      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98l-.09.06c-.22.14-2.2 1.28-2.18 3.81.03 3.02 2.65 4.03 2.68 4.04l-.05.17ZM13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11Z" />
    </svg>
    <span>
      <span className="block text-xs font-normal opacity-75 leading-none mb-1">Download on the</span>
      <span className="block text-lg font-bold leading-none">App Store</span>
    </span>
  </a>
);

export default async function UseCaseLanguagePage({ params }: Props) {
  const { slug, language } = await params;
  const uc = getUseCaseBySlug(slug);
  const lang = getLanguageBySlug(language);
  if (!uc || !lang) notFound();

  const allFaqs = [...(lang.languageFAQs ?? []), ...uc.faqs];

  const schemaOrg = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "SoftwareApplication",
        name: "Captio AI",
        applicationCategory: "AccessibilityApplication",
        operatingSystem: "iOS",
        description: `Real-time live captions and translation for deaf and hard of hearing ${lang.language} speakers. ${uc.label} — ${lang.dialectNote}.`,
        url: `https://captioai.app/use-cases/${uc.slug}/${lang.languageSlug}`,
        offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
      },
      {
        "@type": "FAQPage",
        mainEntity: allFaqs.map((faq) => ({
          "@type": "Question",
          name: faq.q,
          acceptedAnswer: { "@type": "Answer", text: faq.a },
        })),
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaOrg) }}
      />
      <main>
        <Header />

        {/* ── SECTION PLACEHOLDER: Hero ── */}
        {/* Tell me what you want here and I'll build it */}
        <section className="pt-6 pb-10 sm:pt-10 sm:pb-16 px-5 bg-white">
          <div className="max-w-3xl mx-auto flex flex-col items-center text-center gap-4">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm text-gray-400 flex-wrap justify-center">
              <Link href="/" className="hover:text-brand transition-colors">Captio AI</Link>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5 shrink-0">
                <path d="m9 18 6-6-6-6" strokeWidth="2" />
              </svg>
              <Link href={`/use-cases/${uc.slug}`} className="hover:text-brand transition-colors">{uc.label}</Link>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5 shrink-0">
                <path d="m9 18 6-6-6-6" strokeWidth="2" />
              </svg>
              <Link href={`/${lang.languageSlug}`} className="hover:text-brand transition-colors">{lang.language}</Link>
            </div>

            <h1 className="text-[2.2rem] leading-[1.15] sm:text-5xl font-bold text-gray-900 tracking-tight">
              {uc.label} in{" "}
              <span className="bg-brand text-white px-3 py-1 rounded-[8px] inline-block">{lang.language}</span>
            </h1>

            <p className="text-base sm:text-lg text-gray-500 max-w-xl leading-relaxed">
              {uc.tagline} {lang.dialectNote}.
            </p>

            <AppStoreButton />
          </div>
        </section>

        {/* ── SECTION PLACEHOLDER: Content sections go here ── */}
        {/* Tell me the structure and I'll build all sections */}

        {/* ── FAQ ── */}
        <section className="py-10 px-6 bg-gray-50">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-7">
              <span className="text-xs font-bold text-cta uppercase tracking-widest">FAQ</span>
              <h2 className="text-3xl font-bold text-gray-900 tracking-tight mt-3">
                Frequently asked questions
              </h2>
            </div>
            <FaqAccordion faqs={allFaqs} />
          </div>
        </section>

        {/* ── Languages grid — other languages for this use case ── */}
        <section className="py-10 px-6 bg-white">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-7">
              <span className="text-xs font-bold text-cta uppercase tracking-widest">Languages</span>
              <h2 className="text-3xl font-bold text-gray-900 tracking-tight mt-3">
                {uc.label} in 60+ languages
              </h2>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {languages.map((l) => (
                <Link
                  key={l.languageSlug}
                  href={`/use-cases/${uc.slug}/${l.languageSlug}`}
                  className={`flex items-center gap-2 px-4 py-3 border rounded-[8px] text-base font-bold transition-colors ${
                    l.languageSlug === lang.languageSlug
                      ? "bg-brand text-white border-brand"
                      : "bg-white text-gray-900 border-brand hover:bg-brand-light hover:text-brand"
                  }`}
                >
                  <span className="text-base">{l.flag}</span>
                  {l.language}
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ── Use cases grid — other use cases for this language ── */}
        <section className="py-10 px-6 bg-gray-50">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-7">
              <span className="text-xs font-bold text-cta uppercase tracking-widest">Use Cases</span>
              <h2 className="text-3xl font-bold text-gray-900 tracking-tight mt-3">
                More ways to use Captio AI in {lang.language}
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {useCases.filter((u) => u.slug !== uc.slug).map((u) => (
                <Link
                  key={u.slug}
                  href={`/use-cases/${u.slug}/${lang.languageSlug}`}
                  className="group bg-white rounded-xl border border-gray-200 p-5 hover:border-brand hover:shadow-md transition-all flex flex-col gap-3"
                >
                  <span className="inline-flex items-center gap-2 bg-brand-light text-brand font-bold px-3.5 py-2 rounded-[8px] w-fit">
                    <span className="text-2xl leading-none">{u.icon}</span>
                    <span className="text-base">{u.label}</span>
                  </span>
                  <p className="text-sm text-gray-500 leading-relaxed">{u.description.split(".")[0]}.</p>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="pt-10 pb-20 px-6 bg-gray-50">
          <div className="max-w-2xl mx-auto flex flex-col items-center gap-6 text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight">
              {uc.tagline.split(".")[0]} in {lang.language}.
            </h2>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">
              Captio AI is free to start
            </p>
            <AppStoreButton />
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
