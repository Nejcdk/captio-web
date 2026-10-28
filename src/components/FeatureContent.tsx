import Image from "next/image";
import Header from "@/components/Header";
import BackButton from "@/components/BackButton";
import Footer from "@/components/Footer";
import { DownloadCard, StoreButtons } from "@/components/StoreButtons";
import FaqAccordion from "@/components/FaqAccordion";
import LocaleShell from "@/components/LocaleShell";
import { FEATURE_SLUGS, languageOptions, pagePath, type FeatureSlug, type Messages } from "@/i18n";
import { SITE_URL, jsonLd, softwareApplicationSchema, faqPageSchema, breadcrumbSchema } from "@/lib/schema";

// The four feature pages share one template, in any language: "/live-captions"
// (English) and "/<code>/live-captions". Their words come from
// src/i18n/messages/<code>.json (featurePages.<slug>).

// The app screens next to the three "How it works" steps.
const stepImages: Record<FeatureSlug, [string, string, string]> = {
  "live-captions": ["/LC_mockup_1.png", "/LC_mockup_4.png", "/LC_mockup_3.png"],
  "live-translator": ["/LT_mockup_1.png", "/LT_mockup_2.png", "/LT_mockup_3.png"],
  "audio-transcription": ["/AT_mockup_1.png", "/AT_mockup_2.png", "/AT_mockup_3.png"],
  "ai-summary": ["/AS_mockup_1.png", "/AS_mockup_2.png", "/AS_mockup_3.png"],
};

export default function FeatureContent({ code, m, feature }: { code: string; m: Messages; feature: FeatureSlug }) {
  const p = m.featurePages[feature];
  const c = m.common;
  const name = c.featureNames[feature];
  const home = pagePath(code, "home");

  const schemaOrg = jsonLd(
    softwareApplicationSchema({
      url: `${SITE_URL}${pagePath(code, feature)}`,
      description: p.meta.schemaDescription,
      inLanguage: code,
      ...(code === "en" ? {} : { featureList: FEATURE_SLUGS.map((s) => c.featureNames[s]) }),
    }),
    faqPageSchema(p.faqs),
    breadcrumbSchema([
      { name: c.home, path: home },
      { name, path: pagePath(code, feature) },
    ]),
  );

  return (
    <LocaleShell code={code}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaOrg) }} />
      <main>
        <Header code={code} t={m.header} languages={languageOptions(code, feature)} />

        {/* ── Nav bar ── */}
        <div className="px-6 pt-6 pb-3 sm:pt-10 bg-white">
          <div className="max-w-6xl mx-auto flex items-center justify-center gap-4">
            <BackButton label={c.back} fallbackHref={home} />
            <span className="text-sm font-medium text-gray-500">{name}</span>
          </div>
        </div>

        {/* ── Hero ── */}
        <section className="pt-2 pb-4 sm:pt-4 sm:pb-6 px-5 bg-white">
          <div className="max-w-3xl mx-auto flex flex-col items-center text-center">
            <h1 className="text-[2.4rem] leading-[1.15] sm:text-6xl font-bold text-gray-900 tracking-tight">
              {name}
            </h1>
          </div>
        </section>

        {/* ── How it works ── */}
        <section className="pt-4 pb-10 px-6 bg-white">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-10">
              <span className="text-xs font-bold text-cta uppercase tracking-widest">{c.howItWorks}</span>
              <h2 className="text-3xl font-bold text-gray-900 tracking-tight mt-3">
                {p.howTitle}
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-10">
              {p.steps.map((item, i) => (
                <div key={i} className="flex flex-col items-center text-center gap-3">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-brand">{i + 1}.</span>
                    <h3 className="font-bold text-gray-900 text-sm sm:text-base">{item.title}</h3>
                  </div>
                  <p className="text-xs sm:text-sm text-gray-500 leading-relaxed">{item.desc}</p>
                  <Image
                    src={stepImages[feature][i]}
                    alt={item.title}
                    width={240}
                    height={480}
                    className="w-full max-w-[160px] sm:max-w-[200px] h-auto drop-shadow-lg"
                  />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Inline CTA (post how-it-works) ── */}
        <div className="py-6 flex flex-col items-center gap-2 bg-white">
          <p className="text-xs text-gray-400 font-medium tracking-wide uppercase">{m.store.downloadForFree}</p>
          <StoreButtons t={m.store} />
        </div>

        {/* ── Subfeatures / Benefits ── */}
        <section className="py-10 px-6 bg-white">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-8">
              <span className="text-xs font-bold text-cta uppercase tracking-widest">{c.featuresLabel}</span>
              <h2 className="text-3xl font-bold text-gray-900 tracking-tight mt-3">
                {p.featuresTitle}
              </h2>
              {p.featuresSubtitle && (
                <p className="text-gray-500 mt-3 max-w-xl mx-auto">
                  {p.featuresSubtitle}
                </p>
              )}
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {p.subfeatures.map((sf) => (
                <div key={sf.title} className="bg-gray-50 rounded-xl p-5 flex flex-col gap-2 border border-gray-100">
                  <h3 className="font-bold text-gray-900 text-base leading-snug">{sf.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{sf.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Inline CTA ── */}
        <div className="py-8 flex flex-col items-center gap-2 bg-white">
          <p className="text-xs text-gray-400 font-medium tracking-wide uppercase">{m.store.downloadForFree}</p>
          <StoreButtons t={m.store} />
        </div>

        {/* ── Privacy ── */}
        <section className="py-10 px-6 bg-brand">
          <div className="max-w-3xl mx-auto text-center">
            <span className="text-xs font-bold text-cta uppercase tracking-widest">{c.privacyLabel}</span>
            <h2 className="text-3xl font-bold text-white tracking-tight mt-3 mb-8">
              {c.privacyTitle}
            </h2>
            <div className="grid sm:grid-cols-3 gap-4 mb-10">
              {p.privacyCards.map((item) => (
                <div key={item.title} className="bg-white/10 backdrop-blur rounded-xl p-6 border border-white/20 text-start">
                  <h3 className="font-semibold text-white mb-1">{item.title}</h3>
                  <p className="text-sm text-blue-100 leading-relaxed">{item.description}</p>
                </div>
              ))}
            </div>
            <div className="flex justify-center">
              <Image
                src="/privacy.png"
                alt={c.privacyImageAlt}
                width={160}
                height={160}
                className="drop-shadow-2xl"
              />
            </div>
          </div>
        </section>

        {/* ── Inline CTA ── */}
        <div className="py-8 flex flex-col items-center gap-2 bg-white">
          <p className="text-xs text-gray-400 font-medium tracking-wide uppercase">{m.store.downloadForFree}</p>
          <StoreButtons t={m.store} />
        </div>

        {/* ── FAQ ── */}
        <section className="py-10 px-6 bg-gray-50">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-7">
              <span className="text-xs font-bold text-cta uppercase tracking-widest">{c.faqLabel}</span>
              <h2 className="text-3xl font-bold text-gray-900 tracking-tight mt-3">
                {c.faqTitle}
              </h2>
            </div>
            <FaqAccordion faqs={p.faqs} />
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="pt-10 pb-20 px-6 bg-gray-50">
          <div className="max-w-2xl mx-auto flex flex-col items-center gap-6">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight text-center">
              {c.getStarted}
            </h2>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest text-center">
              {c.freeToStart}
            </p>
            <DownloadCard id="download" className="w-full" t={m.store} />
          </div>
        </section>

        {/* ── Other features ── */}
        <section className="py-10 px-6 bg-white border-t border-gray-100">
          <div className="max-w-2xl mx-auto flex flex-col items-center gap-4 text-center">
            <p className="text-sm text-gray-500">{c.allFeatures}</p>
            <BackButton label={c.goBack} fallbackHref={home} />
          </div>
        </section>

      </main>
      <Footer code={code} m={m} />
    </LocaleShell>
  );
}
