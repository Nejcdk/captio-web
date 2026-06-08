import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FaqAccordion from "@/components/FaqAccordion";
import { useCases, getUseCaseBySlug } from "@/lib/useCases";
import { languages } from "@/lib/languages";

export async function generateStaticParams() {
  return useCases.map((uc) => ({ slug: uc.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const uc = getUseCaseBySlug(slug);
  if (!uc) return {};
  return {
    title: `${uc.label} — Captio AI Live Captions for Deaf and Hard of Hearing`,
    description: uc.description,
  };
}

export default async function UseCasePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const uc = getUseCaseBySlug(slug);
  if (!uc) notFound();

  const schemaOrg = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "SoftwareApplication",
        name: "Captio AI",
        applicationCategory: "AccessibilityApplication",
        operatingSystem: "iOS",
        description: uc.description,
        url: `https://captioai.app/use-cases/${uc.slug}`,
        offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
      },
      {
        "@type": "FAQPage",
        mainEntity: uc.faqs.map((faq) => ({
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

        {/* ── Hero ── */}
        <section className="pt-12 pb-10 sm:pt-20 sm:pb-14 px-5 bg-white">
          <div className="max-w-3xl mx-auto flex flex-col items-center text-center gap-4 sm:gap-6">
            <span className="inline-flex items-center gap-2 bg-brand-light text-brand font-bold px-4 py-2 rounded-[10px] text-sm">
              <span className="text-2xl leading-none">{uc.icon}</span>
              {uc.label}
            </span>

            <h1 className="text-[2.2rem] leading-[1.15] sm:text-5xl font-bold text-gray-900 tracking-tight">
              {uc.tagline}
            </h1>

            <p className="text-base sm:text-lg text-gray-500 max-w-2xl leading-relaxed">
              {uc.description}
            </p>

            <a
              href="#"
              className="inline-flex items-center gap-3 bg-cta text-white font-semibold px-7 py-4 rounded-[8px] hover:bg-cta-dark transition-colors mt-2"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 shrink-0">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98l-.09.06c-.22.14-2.2 1.28-2.18 3.81.03 3.02 2.65 4.03 2.68 4.04l-.05.17ZM13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11Z" />
              </svg>
              <span>
                <span className="block text-xs font-normal opacity-75 leading-none mb-1">Download on the</span>
                <span className="block text-lg font-bold leading-none">App Store</span>
              </span>
            </a>
          </div>
        </section>

        {/* ── How it helps ── */}
        <section className="py-10 px-6 bg-brand">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-7">
              <span className="text-xs font-bold text-cta uppercase tracking-widest">How it works</span>
              <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mt-3">
                How Captio AI helps in {uc.label.toLowerCase()}
              </h2>
            </div>
            <ul className="flex flex-col gap-4">
              {uc.howItHelps.map((point) => (
                <li key={point} className="flex items-start gap-4 bg-white/10 rounded-xl p-5 border border-white/20">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-white shrink-0 mt-0.5">
                    <path d="M20 6 9 17l-5-5" strokeWidth="2.5" />
                  </svg>
                  <span className="text-white text-sm sm:text-base leading-relaxed">{point}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ── Reviews ── */}
        <section className="py-10 px-6 bg-white">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-7">
              <span className="text-xs font-bold text-cta uppercase tracking-widest">Reviews</span>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight mt-3">
                What people say
              </h2>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              {uc.reviews.map((r) => (
                <div key={r.email} className="bg-gray-50 rounded-xl p-5 flex flex-col gap-3 border border-gray-100">
                  <p className="text-sm text-gray-700 leading-relaxed">"{r.quote}"</p>
                  <div className="flex items-center gap-2 mt-auto pt-2 border-t border-gray-200">
                    <span className="text-xl">{r.flag}</span>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{r.name}</p>
                      <p className="text-xs text-gray-400">{r.detail}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Languages ── */}
        <section className="py-10 px-6 bg-gray-50">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-7">
              <span className="text-xs font-bold text-cta uppercase tracking-widest">Languages</span>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight mt-3">
                {uc.label} in 60+ languages
              </h2>
              <p className="text-gray-500 mt-3 max-w-xl mx-auto text-sm">
                Select a language for dialect support, community notes, and language-specific guidance.
              </p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {languages.map((lang) => (
                <Link
                  key={lang.languageSlug}
                  href={`/use-cases/${uc.slug}/${lang.languageSlug}`}
                  className="flex items-center gap-2 px-4 py-3 bg-white border border-brand rounded-[8px] text-sm font-bold text-gray-900 hover:bg-brand-light hover:text-brand transition-colors"
                >
                  <span className="text-base">{lang.flag}</span>
                  {lang.language}
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ── FAQ ── */}
        <section className="py-10 px-6 bg-white">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-7">
              <span className="text-xs font-bold text-cta uppercase tracking-widest">FAQ</span>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight mt-3">
                Frequently asked questions
              </h2>
            </div>
            <FaqAccordion faqs={uc.faqs} />
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="pt-10 pb-20 px-6 bg-gray-50">
          <div className="max-w-2xl mx-auto flex flex-col items-center gap-6 text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight">
              Get started free
            </h2>
            <p className="text-gray-500 max-w-md">
              Captio AI is free to download. Use it for {uc.label.toLowerCase()} today.
            </p>
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
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
