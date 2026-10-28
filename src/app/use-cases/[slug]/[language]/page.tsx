import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { DownloadCard, StoreButtons } from "@/components/StoreButtons";
import FaqAccordion from "@/components/FaqAccordion";
import { useCases, getUseCaseBySlug, inlineUseCaseLabel, type UseCase } from "@/lib/useCases";
import { languages, getLanguageBySlug, type Language } from "@/lib/languages";
import { getUseCaseLanguageVariant, type UseCaseLanguageVariant } from "@/lib/useCaseLanguageData";
import LanguageMetrics from "@/components/LanguageMetrics";
import { SITE_URL, jsonLd, softwareApplicationSchema, faqPageSchema, breadcrumbSchema } from "@/lib/schema";

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
  // Mirrors the h1. The root layout's title template appends " | Captio AI".
  const title = `${lang.language} Live Captions for ${uc.label}`;
  const description = pageDescription(uc, lang, getUseCaseLanguageVariant(slug, language));
  const path = `/use-cases/${uc.slug}/${lang.languageSlug}`;
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: { title: `${title} | Captio AI`, description, url: path, type: "website", images: ["/opengraph-image"] },
  };
}

// Leads with the variant's hand-written heroTitle, so each of the 720 pages has
// a unique description instead of a find-and-replace template.
function pageDescription(
  uc: UseCase,
  lang: Language,
  variant: UseCaseLanguageVariant | undefined,
) {
  const generic = `Real-time ${lang.language} live captions for ${inlineUseCaseLabel(uc)}, built for deaf and hard of hearing people. ${lang.dialectNote}.`;
  if (variant?.heroDescription) return variant.heroDescription;
  return variant?.heroTitle ? `${variant.heroTitle} ${generic}` : generic;
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


export default async function UseCaseLanguagePage({ params }: Props) {
  const { slug, language } = await params;
  const uc = getUseCaseBySlug(slug);
  const lang = getLanguageBySlug(language);
  if (!uc || !lang) notFound();

  const variant = getUseCaseLanguageVariant(slug, language);
  const allFaqs = [
    ...(variant?.faqs ?? []),
    ...uc.faqs,
  ];

  const path = `/use-cases/${uc.slug}/${lang.languageSlug}`;
  const schemaOrg = jsonLd(
    softwareApplicationSchema({
      url: `${SITE_URL}${path}`,
      description: pageDescription(uc, lang, variant),
    }),
    faqPageSchema(allFaqs),
    breadcrumbSchema([
      { name: "Home", path: "/" },
      { name: uc.label, path: `/use-cases/${uc.slug}` },
      { name: lang.language, path },
    ]),
  );

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
              for {inlineUseCaseLabel(uc)}
            </h1>
            <p className="text-xl sm:text-2xl font-semibold text-gray-800 max-w-xl">
              For <span className="text-brand">deaf</span> and <span className="text-brand">hard of hearing</span> people.
            </p>
            <DownloadCard id="download" />
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
                  Everything you need to follow {lang.language} {inlineUseCaseLabel(uc)}
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

        {/* ── Inline CTA (after features) ── */}
        <div className="pt-8 pb-3 flex flex-col items-center gap-2 bg-white">
          <p className="text-xs text-gray-400 font-medium tracking-wide uppercase">Download for free</p>
          <StoreButtons />
        </div>

        {/* ── Sub-use-cases ── */}
        {uc.subUseCases && (
          <section className="py-10 px-6 bg-gray-50">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-8">
                <span className="text-xs font-bold text-cta uppercase tracking-widest">Use Cases</span>
                <h2 className="text-3xl font-bold text-gray-900 tracking-tight mt-3">
                  Every situation covered
                </h2>
                <p className="text-gray-500 mt-3 max-w-xl mx-auto">
                  Designed for the real moments that matter — not just quiet controlled environments.
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {uc.subUseCases.map((s, i) => (
                  <div key={s.title} className="bg-white rounded-xl border border-gray-200 p-5 flex flex-col gap-3">
                    <span className="inline-flex items-center gap-2 bg-brand-light text-brand font-bold px-3.5 py-2 rounded-[8px] w-fit">
                      <span className="text-2xl leading-none">{s.icon}</span>
                      <span className="text-base">{s.title}</span>
                    </span>
                    <p className="text-sm text-gray-500 leading-relaxed">{variant?.useCaseDescriptions?.[i] ?? s.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ── Performance ── */}
        <div className="bg-white px-6 pb-8">
          <div className="max-w-3xl mx-auto">
            <LanguageMetrics language={lang.language} wer={lang.wer} useCer={lang.useCer} />
          </div>
        </div>

        {/* ── Inline CTA ── */}
        <div className="py-8 flex flex-col items-center gap-2 bg-gray-50">
          <p className="text-xs text-gray-400 font-medium tracking-wide uppercase">Download for free</p>
          <StoreButtons />
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
            </div>
          </section>
        )}

        {/* ── Inline CTA ── */}
        <div className="py-8 flex flex-col items-center gap-2 bg-white">
          <p className="text-xs text-gray-400 font-medium tracking-wide uppercase">Download for free</p>
          <StoreButtons />
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
          <StoreButtons />
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
                { title: "Audio stays off our servers", description: "Your audio is turned into text in real time and never stored on our servers. Recordings you save stay on your phone, and their transcripts sync only to your own account." },
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
              <Image
                src="/privacy.png"
                alt="Private by default — your audio is never stored on our servers, never sold, never used for training"
                width={160}
                height={160}
                className="drop-shadow-2xl"
              />
            </div>
          </div>
        </section>

        {/* ── Inline CTA ── */}
        <div className="py-8 flex flex-col items-center gap-2 bg-white">
          <p className="text-xs text-gray-400 font-medium tracking-wide uppercase">Private by default</p>
          <StoreButtons />
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

        {/* ── Inline CTA ── */}
        <div className="py-8 flex flex-col items-center gap-2 bg-white">
          <p className="text-xs text-gray-400 font-medium tracking-wide uppercase">Download for free</p>
          <StoreButtons />
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
            <DownloadCard className="w-full" />
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
