import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FaqAccordion from "@/components/FaqAccordion";
import ReviewCarousel from "@/components/ReviewCarousel";
import { useCases, getUseCaseBySlug } from "@/lib/useCases";
import { languages, getLanguageBySlug } from "@/lib/languages";
import { getUseCaseLanguageVariant } from "@/lib/useCaseLanguageData";
import LanguageMetrics from "@/components/LanguageMetrics";

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

const featureIcons: Record<string, React.ReactNode> = {
  "live-captions": (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
      <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" strokeWidth="2" />
      <path d="M19 10v2a7 7 0 0 1-14 0v-2" strokeWidth="2" />
      <path d="m12 19 0 3" strokeWidth="2" />
    </svg>
  ),
  "live-translator": (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
      <path d="m5 8 6 6" strokeWidth="2" />
      <path d="m4 14 6-6 2-3" strokeWidth="2" />
      <path d="M2 5h12" strokeWidth="2" />
      <path d="M7 2h1" strokeWidth="2" />
      <path d="m22 22-5-10-5 10" strokeWidth="2" />
      <path d="M14 18h6" strokeWidth="2" />
    </svg>
  ),
  "audio-transcription": (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" strokeWidth="2" />
      <path d="m17 8-5-5-5 5" strokeWidth="2" />
      <path d="m12 3 0 12" strokeWidth="2" />
    </svg>
  ),
  "ai-summary": (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
      <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z" strokeWidth="2" />
      <path d="M20 3v4" strokeWidth="2" />
      <path d="M22 5h-4" strokeWidth="2" />
      <path d="M4 17v2" strokeWidth="2" />
      <path d="M5 18H3" strokeWidth="2" />
    </svg>
  ),
};

const featureLabels: Record<string, string> = {
  "live-captions": "LIVE CAPTIONS",
  "live-translator": "LIVE TRANSLATOR",
  "audio-transcription": "AUDIO TRANSCRIPTION",
  "ai-summary": "AI SUMMARY",
};

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

  const variant = getUseCaseLanguageVariant(slug, language);
  const subUseCases = variant?.subUseCases ?? uc.subUseCases;
  const reviews = variant?.reviews ?? uc.reviews;
  const allFaqs = [
    ...(variant?.faqs ?? []),
    ...uc.faqs,
  ];

  const schemaOrg = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "SoftwareApplication",
        name: "Captio AI",
        applicationCategory: "AccessibilityApplication",
        operatingSystem: "iOS",
        description: variant?.heroDescription ?? `Real-time live captions and translation for deaf and hard of hearing ${lang.language} speakers. ${uc.label} — ${lang.dialectNote}.`,
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

        {/* ── Hero ── */}
        <section className="pt-6 pb-10 sm:pt-10 sm:pb-16 px-5 bg-white">
          <div className="max-w-3xl mx-auto flex flex-col items-center text-center gap-4 sm:gap-6">
            <span className="text-[11px] font-bold text-brand uppercase tracking-widest">
              🦻 Accessibility + 💻 Productivity App
            </span>
            <h1 className="text-[2.4rem] leading-[1.15] sm:text-6xl font-bold text-gray-900 tracking-tight">
              <span className="bg-brand text-white px-3 py-1 rounded-[8px] inline-block">{lang.language}</span>{" "}
              <span className="underline decoration-brand decoration-4 underline-offset-4">live captions</span>{" "}
              and{" "}
              <span className="underline decoration-brand decoration-4 underline-offset-4">productivity tool</span>{" "}
              for {uc.label.toLowerCase()}
            </h1>
            <p className="text-xl sm:text-2xl font-semibold text-gray-800 max-w-xl">
              For <span className="text-brand">deaf</span> and <span className="text-brand">hard of hearing</span> people.
            </p>
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm px-8 py-6 flex items-center gap-8">
              <div className="hidden sm:block p-3 bg-white border border-gray-200 rounded-xl">
                <div className="w-24 h-24 bg-gray-50 rounded-lg flex items-center justify-center text-gray-300 text-[10px] text-center leading-tight">
                  QR<br />coming soon
                </div>
              </div>
              <div className="flex flex-col gap-2 items-center">
                <p className="text-xs text-gray-400 font-medium tracking-wide uppercase">Download for free</p>
                <AppStoreButton />
              </div>
            </div>
            <div className="mt-6 sm:mt-10">
              <Image
                src="/mockup_app.png"
                alt="Captio AI app showing live captions"
                width={400}
                height={340}
                className="w-[280px] sm:w-[400px] h-auto mx-auto drop-shadow-2xl"
                priority
              />
            </div>
          </div>
        </section>

        {/* ── Features ── */}
        {uc.featureHighlights && (
          <section className="pt-8 pb-10 sm:pt-10 sm:pb-12 px-6 bg-white">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-7">
                <span className="text-xs font-bold text-cta uppercase tracking-widest">Features</span>
                <h2 className="text-3xl font-bold text-gray-900 tracking-tight mt-3">
                  Everything you need to follow {lang.language} {uc.label.toLowerCase()}
                </h2>
                <p className="text-gray-500 mt-3 max-w-xl mx-auto">
                  Four tools built for deaf and hard of hearing {lang.language} speakers.
                </p>
              </div>
              <div className="grid sm:grid-cols-2 gap-5">
                {uc.featureHighlights.map((f) => (
                  <Link
                    key={f.slug}
                    href={`/${f.slug}`}
                    className="group bg-brand p-8 rounded-xl hover:opacity-95 transition-all flex flex-col gap-5"
                  >
                    <div className="flex items-center gap-3">
                      <div className="text-cta">{featureIcons[f.slug]}</div>
                      <span className="text-xs font-bold text-cta uppercase tracking-wide">{featureLabels[f.slug]}</span>
                    </div>
                    <h3 className="text-xl font-bold text-white leading-snug">{f.title}</h3>
                    <ul className="flex flex-col gap-2 flex-1">
                      {f.bullets.map((b) => (
                        <li key={b} className="flex items-start gap-2 text-sm text-white/80">
                          <span className="mt-1 w-1.5 h-1.5 rounded-full bg-white/50 shrink-0" />
                          {b}
                        </li>
                      ))}
                    </ul>
                    <div className="mt-2">
                      <span className="inline-flex items-center gap-1 bg-white text-brand text-sm font-semibold px-5 py-2.5 rounded-[8px]">
                        Explore
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                          <path d="m9 18 6-6-6-6" strokeWidth="2" />
                        </svg>
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ── Inline CTA ── */}
        <div className="py-8 flex flex-col items-center gap-2 bg-white">
          <p className="text-xs text-gray-400 font-medium tracking-wide uppercase">Free to start</p>
          <AppStoreButton />
        </div>

        {/* ── Sub-use-cases ── */}
        {subUseCases && (
          <section className="py-10 px-6 bg-gray-50">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-8">
                <span className="text-xs font-bold text-cta uppercase tracking-widest">Use Cases</span>
                <h2 className="text-3xl font-bold text-gray-900 tracking-tight mt-3">
                  Every {lang.language} situation covered
                </h2>
                <p className="text-gray-500 mt-3 max-w-xl mx-auto">
                  Designed for the real moments that matter — in {lang.language}.
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {subUseCases.map((s) => (
                  <div key={s.title} className="bg-white rounded-xl border border-gray-200 p-5 flex flex-col gap-3">
                    <span className="inline-flex items-center gap-2 bg-brand-light text-brand font-bold px-3.5 py-2 rounded-[8px] w-fit">
                      <span className="text-2xl leading-none">{s.icon}</span>
                      <span className="text-base">{s.title}</span>
                    </span>
                    <p className="text-sm text-gray-500 leading-relaxed">{s.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ── Inline CTA ── */}
        <div className="py-8 flex flex-col items-center gap-2 bg-gray-50">
          <p className="text-xs text-gray-400 font-medium tracking-wide uppercase">Download for free</p>
          <AppStoreButton />
        </div>

        {/* ── Mockup images ── */}
        <div className="px-6 py-4 bg-white flex justify-center gap-4">
          <Image
            src="/lifestyle_mockup.png"
            alt="Captio AI in everyday use"
            width={1200}
            height={600}
            className={`h-auto rounded-2xl object-cover sm:w-[520px] ${uc.mobileImage === "work" ? "hidden sm:block" : "w-full"}`}
          />
          <Image
            src="/work_mockup.png"
            alt="Captio AI at work"
            width={1200}
            height={600}
            className={`h-auto rounded-2xl object-cover sm:w-[520px] ${uc.mobileImage === "work" ? "w-full sm:w-[520px]" : "hidden sm:block"}`}
          />
        </div>

        {/* ── Benefits ── */}
        {uc.benefits && (
          <section className="py-10 px-6 bg-white">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-8">
                <span className="text-xs font-bold text-cta uppercase tracking-widest">Why Captio AI</span>
                <h2 className="text-3xl font-bold text-gray-900 tracking-tight mt-3">
                  {uc.benefitsHeadline ?? "Built for this"}
                </h2>
                {uc.benefitsSubtitle && (
                  <p className="text-gray-500 mt-3 max-w-xl mx-auto">{uc.benefitsSubtitle}</p>
                )}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {uc.benefits.map((b) => (
                  <div key={b.title} className="bg-gray-50 rounded-xl p-6 flex flex-col gap-3 border border-gray-100">
                    <h3 className="font-bold text-gray-900 text-base leading-snug">{b.title}</h3>
                    <p className="text-sm text-gray-500 leading-relaxed">{b.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ── Why [Language] is hard in [UseCase] ── */}
        {variant?.whyHardSection && (
          <section className="py-10 px-6 bg-white">
            <div className="max-w-3xl mx-auto">
              <div className="text-center mb-7">
                <span className="text-xs font-bold text-cta uppercase tracking-widest">{lang.language}</span>
                <h2 className="text-3xl font-bold text-gray-900 tracking-tight mt-3">
                  Why {lang.language} is hard to understand
                </h2>
              </div>
              <div className="bg-gray-50 rounded-2xl border border-gray-100 overflow-hidden">
                {variant.whyHardSection.cards.map((card, i) => (
                  <div key={card.title} className={`px-7 py-6 ${i !== 0 ? "border-t border-gray-200" : ""}`}>
                    <h3 className="font-bold text-gray-900 text-base mb-2">{card.tag}</h3>
                    <ul className="flex flex-col gap-3">
                      <li className="flex items-start gap-3">
                        <svg className="w-[18px] h-[18px] text-gray-400 shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
                          <path d="M3 3v5h5"/>
                          <path d="M12 7v5l4 2"/>
                        </svg>
                        <span className="text-sm font-semibold text-gray-800 leading-snug">{card.title}</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <svg className="w-[18px] h-[18px] text-gray-400 shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"/>
                          <path d="M9 18h6"/>
                          <path d="M10 22h4"/>
                        </svg>
                        <span className="text-sm text-gray-500 leading-relaxed">{card.description}</span>
                      </li>
                    </ul>
                  </div>
                ))}
              </div>
              <LanguageMetrics language={lang.language} wer={lang.wer} useCer={lang.useCer} />
            </div>
          </section>
        )}

        {/* ── Inline CTA ── */}
        <div className="py-8 flex flex-col items-center gap-2 bg-white">
          <p className="text-xs text-gray-400 font-medium tracking-wide uppercase">Download for free</p>
          <AppStoreButton />
        </div>

        {/* ── Challenge ── */}
        {variant?.challenge && (
          <section className="py-10 px-6 bg-white">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-7">
                <span className="text-xs font-bold text-cta uppercase tracking-widest">The Challenge</span>
                <h2 className="text-3xl font-bold text-gray-900 tracking-tight mt-3">
                  {variant.challenge.headline}
                </h2>
              </div>
              <div className="flex flex-col gap-4">
                {variant.challenge.paragraphs.slice(0, 3).map((p, i) => (
                  <div key={i} className="bg-gray-50 rounded-[8px] px-5 py-4">
                    <p className="text-sm text-gray-500 leading-relaxed">{p}</p>
                  </div>
                ))}
              </div>
              {variant.challenge.citations && (
                <div className="mt-5 flex flex-col gap-1">
                  {variant.challenge.citations.map((c, i) => (
                    <p key={i} className="text-[11px] text-gray-400 leading-snug">
                      <span className="mr-1.5 font-semibold">[{i + 1}]</span>
                      <a
                        href={c.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline underline-offset-2 hover:text-gray-600 transition-colors"
                      >
                        {c.label}
                      </a>
                    </p>
                  ))}
                </div>
              )}
            </div>
          </section>
        )}

        {/* ── Inline CTA ── */}
        <div className="py-8 flex flex-col items-center gap-2 bg-white">
          <p className="text-xs text-gray-400 font-medium tracking-wide uppercase">Download for free</p>
          <AppStoreButton />
        </div>

        {/* ── Privacy ── */}
        <section className="py-10 px-6 bg-brand">
          <div className="max-w-3xl mx-auto text-center">
            <span className="text-xs font-bold text-cta uppercase tracking-widest">Privacy</span>
            <h2 className="text-3xl font-bold text-white tracking-tight mt-3 mb-2">
              What you hear stays with you.
            </h2>
            <div className="mb-8" />
            <div className="grid sm:grid-cols-3 gap-4 mb-10">
              {[
                { title: "Gone the moment it ends", description: "Captio AI processes your audio in real time and discards it immediately. Nothing is recorded. Nothing is kept." },
                { title: "Not a product", description: "Your conversations are not something Captio AI sells, shares, or monetizes — to anyone, for any reason." },
                { title: "Not used to train anything", description: "What you say in a doctor's appointment or a job interview never ends up in a training dataset. Not ours. Not anyone else's." },
              ].map((item) => (
                <div key={item.title} className="bg-white/10 backdrop-blur rounded-xl p-6 border border-white/20 text-left">
                  <h3 className="font-semibold text-white mb-1">{item.title}</h3>
                  <p className="text-sm text-blue-100 leading-relaxed">{item.description}</p>
                </div>
              ))}
            </div>
            <div className="flex justify-center">
              <svg width="160" height="179" viewBox="0 0 200 224" xmlns="http://www.w3.org/2000/svg">
                <path d="M100 14 L172 38 V100 C172 142 140 174 100 188 C60 174 28 142 28 100 V38 Z" fill="white" fillOpacity="0.15"/>
                <path d="M100 14 L172 38 V100 C172 142 140 174 100 188 C60 174 28 142 28 100 V38 Z" fill="none" stroke="white" strokeOpacity="0.4" strokeWidth="2"/>
                <path d="M100 28 L160 48 V100 C160 136 132 162 100 174 C68 162 40 136 40 100 V48 Z" fill="none" stroke="white" strokeOpacity="0.3" strokeWidth="1.5"/>
                <path d="M72 100 L92 120 L132 78" fill="none" stroke="white" strokeWidth="9" strokeLinecap="round" strokeLinejoin="round"/>
                <rect x="36" y="198" width="128" height="26" rx="13" fill="white" fillOpacity="0.2" stroke="white" strokeOpacity="0.4" strokeWidth="1.5"/>
                <text x="100" y="216" textAnchor="middle" fontFamily="sans-serif" fontSize="11" fontWeight="700" fill="white" letterSpacing="1.6">100% PRIVATE</text>
              </svg>
            </div>
          </div>
        </section>

        {/* ── Inline CTA ── */}
        <div className="py-8 flex flex-col items-center gap-2 bg-white">
          <p className="text-xs text-gray-400 font-medium tracking-wide uppercase">Private by default</p>
          <AppStoreButton />
        </div>

        {/* ── Languages ── */}
        <section className="py-10 px-6 bg-white">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-7">
              <span className="text-xs font-bold text-cta uppercase tracking-widest">Languages</span>
              <h2 className="text-3xl font-bold text-gray-900 tracking-tight mt-3">
                Captio AI supports 60+ languages
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

        {/* ── Testimonials ── */}
        <section className="py-10 bg-white overflow-hidden">
          <div className="max-w-6xl mx-auto px-6 mb-7">
            <div className="text-center">
              <span className="text-xs font-bold text-cta uppercase tracking-widest">Reviews</span>
              <h2 className="text-3xl font-bold text-gray-900 tracking-tight mt-3">
                People love Captio AI
              </h2>
            </div>
          </div>
          <ReviewCarousel reviews={reviews} />
        </section>

        {/* ── Inline CTA ── */}
        <div className="py-8 flex flex-col items-center gap-2 bg-white">
          <p className="text-xs text-gray-400 font-medium tracking-wide uppercase">Download for free</p>
          <AppStoreButton />
        </div>

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

        {/* ── Final CTA ── */}
        <section className="pt-10 pb-20 px-6 bg-gray-50">
          <div className="max-w-2xl mx-auto flex flex-col items-center gap-6 text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight">
              {uc.tagline.split(".")[0]} in {lang.language}.
            </h2>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">
              Captio AI is free to start
            </p>
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm px-8 py-8 flex flex-col items-center gap-6">
              <div className="flex items-center gap-8">
                <div className="hidden sm:block p-3 bg-white border border-gray-200 rounded-xl">
                  <div className="w-24 h-24 bg-gray-50 rounded-lg flex items-center justify-center text-gray-300 text-[10px] text-center leading-tight">
                    QR<br />coming soon
                  </div>
                </div>
                <div className="flex flex-col gap-2 items-center">
                  <p className="text-xs text-gray-400 font-medium tracking-wide uppercase">Download for free</p>
                  <AppStoreButton />
                </div>
              </div>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
