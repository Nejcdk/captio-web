import Image from "next/image";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { DownloadCard, StoreButtons } from "@/components/StoreButtons";
import FaqAccordion from "@/components/FaqAccordion";
import HeroDownload from "@/components/HeroDownload";
import LocaleShell from "@/components/LocaleShell";
import { FEATURE_SLUGS, languageName, languageOptions, pagePath, type Messages } from "@/i18n";
import { ALL_LOCALES } from "@/i18n/locales";
import { SITE_URL, jsonLd, softwareApplicationSchema, faqPageSchema } from "@/lib/schema";

// The home page, in any language: "/" (English) and "/<code>". All of its words
// come from src/i18n/messages/<code>.json.

const featureIcons = {
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
      <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a0.5 0.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a0.5 0.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a0.5 0.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a0.5 0.5 0 0 1-.963 0z" strokeWidth="2" />
      <path d="M20 3v4" strokeWidth="2" />
      <path d="M22 5h-4" strokeWidth="2" />
      <path d="M4 17v2" strokeWidth="2" />
      <path d="M5 18H3" strokeWidth="2" />
    </svg>
  ),
};

// Order of the cards; their words are home.useCases.<slug> in the messages.
const useCases = [
  { slug: "everyday-conversations", icon: "💬" },
  { slug: "deaf-hoh-communication", icon: "🤟" },
  { slug: "meetings", icon: "💼" },
  { slug: "lectures", icon: "🎓" },
  { slug: "doctor-appointments", icon: "🏥" },
  { slug: "job-interviews", icon: "🤝" },
  { slug: "phone-video-calls", icon: "📱" },
  { slug: "group-settings", icon: "👥" },
  { slug: "restaurants", icon: "🍽️" },
  { slug: "traveling", icon: "✈️" },
  { slug: "conferences", icon: "🎤" },
  { slug: "tv-media", icon: "📺" },
] as const;

// The language grid links to the (English) language pages, /[slug].
const languages = [
  { name: "English", flag: "🇬🇧", slug: "english" },
  { name: "Chinese", flag: "🇨🇳", slug: "chinese" },
  { name: "Hindi", flag: "🇮🇳", slug: "hindi" },
  { name: "Spanish", flag: "🇪🇸", slug: "spanish" },
  { name: "Arabic", flag: "🇸🇦", slug: "arabic" },
  { name: "Bengali", flag: "🇧🇩", slug: "bengali" },
  { name: "Portuguese", flag: "🇵🇹", slug: "portuguese" },
  { name: "Russian", flag: "🇷🇺", slug: "russian" },
  { name: "Urdu", flag: "🇵🇰", slug: "urdu" },
  { name: "Indonesian", flag: "🇮🇩", slug: "indonesian" },
  { name: "German", flag: "🇩🇪", slug: "german" },
  { name: "Japanese", flag: "🇯🇵", slug: "japanese" },
  { name: "Swahili", flag: "🇰🇪", slug: "swahili" },
  { name: "Marathi", flag: "🇮🇳", slug: "marathi" },
  { name: "Telugu", flag: "🇮🇳", slug: "telugu" },
  { name: "Turkish", flag: "🇹🇷", slug: "turkish" },
  { name: "Vietnamese", flag: "🇻🇳", slug: "vietnamese" },
  { name: "Korean", flag: "🇰🇷", slug: "korean" },
  { name: "French", flag: "🇫🇷", slug: "french" },
  { name: "Italian", flag: "🇮🇹", slug: "italian" },
  { name: "Tamil", flag: "🇮🇳", slug: "tamil" },
  { name: "Persian", flag: "🇮🇷", slug: "persian" },
  { name: "Punjabi", flag: "🇮🇳", slug: "punjabi" },
  { name: "Gujarati", flag: "🇮🇳", slug: "gujarati" },
  { name: "Thai", flag: "🇹🇭", slug: "thai" },
  { name: "Polish", flag: "🇵🇱", slug: "polish" },
  { name: "Ukrainian", flag: "🇺🇦", slug: "ukrainian" },
  { name: "Malay", flag: "🇲🇾", slug: "malay" },
  { name: "Malayalam", flag: "🇮🇳", slug: "malayalam" },
  { name: "Kannada", flag: "🇮🇳", slug: "kannada" },
  { name: "Tagalog", flag: "🇵🇭", slug: "tagalog" },
  { name: "Azerbaijani", flag: "🇦🇿", slug: "azerbaijani" },
  { name: "Dutch", flag: "🇳🇱", slug: "dutch" },
  { name: "Romanian", flag: "🇷🇴", slug: "romanian" },
  { name: "Kazakh", flag: "🇰🇿", slug: "kazakh" },
  { name: "Czech", flag: "🇨🇿", slug: "czech" },
  { name: "Hungarian", flag: "🇭🇺", slug: "hungarian" },
  { name: "Greek", flag: "🇬🇷", slug: "greek" },
  { name: "Swedish", flag: "🇸🇪", slug: "swedish" },
  { name: "Hebrew", flag: "🇮🇱", slug: "hebrew" },
  { name: "Bulgarian", flag: "🇧🇬", slug: "bulgarian" },
  { name: "Serbian", flag: "🇷🇸", slug: "serbian" },
  { name: "Danish", flag: "🇩🇰", slug: "danish" },
  { name: "Albanian", flag: "🇦🇱", slug: "albanian" },
  { name: "Afrikaans", flag: "🇿🇦", slug: "afrikaans" },
  { name: "Belarusian", flag: "🇧🇾", slug: "belarusian" },
  { name: "Finnish", flag: "🇫🇮", slug: "finnish" },
  { name: "Slovak", flag: "🇸🇰", slug: "slovak" },
  { name: "Croatian", flag: "🇭🇷", slug: "croatian" },
  { name: "Norwegian", flag: "🇳🇴", slug: "norwegian" },
  { name: "Catalan", flag: "🇪🇸", slug: "catalan" },
  { name: "Lithuanian", flag: "🇱🇹", slug: "lithuanian" },
  { name: "Bosnian", flag: "🇧🇦", slug: "bosnian" },
  { name: "Galician", flag: "🇪🇸", slug: "galician" },
  { name: "Macedonian", flag: "🇲🇰", slug: "macedonian" },
  { name: "Slovenian", flag: "🇸🇮", slug: "slovenian" },
  { name: "Latvian", flag: "🇱🇻", slug: "latvian" },
  { name: "Estonian", flag: "🇪🇪", slug: "estonian" },
  { name: "Welsh", flag: "🏴󠁧󠁢󠁷󠁬󠁳󠁿", slug: "welsh" },
  { name: "Basque", flag: "🇪🇸", slug: "basque" },
];

/** The hero title marks its two underlined phrases with [square brackets]. */
function underlined(text: string) {
  return text.split(/\[([^\]]+)\]/).map((part, i) =>
    i % 2 === 1 ? (
      <span key={i} className="underline decoration-brand decoration-4 underline-offset-4">{part}</span>
    ) : (
      part
    ),
  );
}

export default function HomeContent({ code, m }: { code: string; m: Messages }) {
  const h = m.home;
  const c = m.common;
  const codeForSlug = (slug: string) => ALL_LOCALES.find((l) => l.slug === slug)?.code ?? "en";

  const schemaOrg = jsonLd(
    softwareApplicationSchema({
      url: code === "en" ? SITE_URL : `${SITE_URL}${pagePath(code, "home")}`,
      description: h.meta.schemaDescription,
      inLanguage: code,
      ...(code === "en" ? {} : { featureList: FEATURE_SLUGS.map((s) => c.featureNames[s]) }),
    }),
    faqPageSchema(h.faqs),
  );

  return (
    <LocaleShell code={code}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaOrg) }}
      />
      <main>
      {/* ── Gradient wrapper: header + hero share one background ── */}
      <Header code={code} t={m.header} languages={languageOptions(code, "home")} />

        {/* ── Hero ── */}
        <section className="pt-6 pb-4 sm:pt-10 sm:pb-10 px-5">
          <div className="max-w-3xl mx-auto flex flex-col items-center text-center gap-4 sm:gap-6">
            <span className="text-[11px] font-bold text-brand uppercase tracking-widest mt-2 sm:mt-0">
              {h.eyebrow}
            </span>

            <h1 className="text-[2.4rem] leading-[1.15] sm:text-6xl font-bold text-gray-900 tracking-tight">
              {underlined(h.heroTitle)}
            </h1>

            <p className="text-base sm:text-lg text-gray-500 max-w-xl leading-relaxed">
              {h.heroSubtitle}
            </p>

            <HeroDownload alt={h.mockupAlt} t={m.store} />
          </div>
        </section>

        {/* ── Features ── */}
        <section id="features" className="pt-8 pb-10 sm:pt-10 sm:pb-12 px-6 bg-white">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-7">
              <span className="text-xs font-bold text-cta uppercase tracking-widest">{c.featuresLabel}</span>
              <h2 className="text-3xl font-bold text-gray-900 tracking-tight mt-3">
                {h.featuresTitle}
              </h2>
              <p className="text-gray-500 mt-3 max-w-xl mx-auto">
                {h.featuresSubtitle}
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-5">
              {FEATURE_SLUGS.map((slug) => {
                const f = h.features[slug];
                return (
                  <Link
                    key={slug}
                    href={pagePath(code, slug)}
                    className="group bg-brand p-8 rounded-xl hover:opacity-95 transition-all flex flex-col gap-5"
                  >
                    <div className="flex items-center gap-3">
                      <div className="text-cta">{featureIcons[slug]}</div>
                      <span className="text-xs font-bold text-cta uppercase tracking-wide">{c.featureNames[slug]}</span>
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
                        {c.explore}
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 rtl:-scale-x-100">
                          <path d="m9 18 6-6-6-6" strokeWidth="2" />
                        </svg>
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>

            {/* The newer feature pages are English only; their cards follow the page's language. */}
            <h3 className="text-xl font-bold text-gray-900 tracking-tight text-center mt-10 mb-5">{h.moreFeaturesTitle}</h3>
            <div className="flex flex-wrap justify-center gap-4">
              {Object.entries(h.moreFeatures).map(([slug, f]) => (
                <Link
                  key={slug}
                  href={`/${slug}`}
                  className="w-full sm:w-[calc(50%-0.5rem)] lg:w-[calc(25%-0.75rem)] group bg-gray-50 border border-gray-100 rounded-xl p-5 flex flex-col gap-2 hover:border-brand/30 transition-colors"
                >
                  <span className="text-xs font-bold text-brand uppercase tracking-wide">{f.label}</span>
                  <span className="font-bold text-gray-900 text-base leading-snug">{f.title}</span>
                  <span className="text-sm text-gray-500 leading-relaxed flex-1">{f.description}</span>
                  <span className="inline-flex items-center gap-1 text-brand text-sm font-semibold mt-1 group-hover:underline">
                    {c.explore}
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 rtl:-scale-x-100">
                      <path d="m9 18 6-6-6-6" strokeWidth="2" />
                    </svg>
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ── Use Cases ── */}
        <section id="use-cases" className="py-10 px-6 bg-gray-50">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-7">
              <span className="text-xs font-bold text-cta uppercase tracking-widest">{h.useCasesLabel}</span>
              <h2 className="text-3xl font-bold text-gray-900 tracking-tight mt-3">
                {h.useCasesTitle}
              </h2>
              <p className="text-gray-500 mt-3 max-w-xl mx-auto">
                {h.useCasesSubtitle}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {useCases.map((uc) => (
                <Link
                  key={uc.slug}
                  href={`/use-cases/${uc.slug}`}
                  className="group bg-white rounded-xl border border-gray-200 p-5 hover:border-brand hover:shadow-md transition-all flex flex-col gap-3 relative"
                >
                  <span className="inline-flex items-center gap-2 bg-brand-light text-brand font-bold px-3.5 py-2 rounded-[8px] w-fit">
                    <span className="text-2xl leading-none">{uc.icon}</span>
                    <span className="text-base">{h.useCases[uc.slug].label}</span>
                  </span>
                  <p className="text-sm text-gray-500 leading-relaxed">{h.useCases[uc.slug].description}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ── Inline CTA ── */}
        <div className="py-8 flex flex-col items-center gap-2 bg-gray-50">
          <p className="text-xs text-gray-400 font-medium tracking-wide uppercase">{m.store.downloadForFree}</p>
          <StoreButtons t={m.store} />
        </div>

        {/* ── Languages ── */}
        <section id="languages" className="py-10 px-6 bg-white">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-7">
              <span className="text-xs font-bold text-cta uppercase tracking-widest">{h.languagesLabel}</span>
              <h2 className="text-3xl font-bold text-gray-900 tracking-tight mt-3">
                {h.languagesTitle}
              </h2>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {languages.map((lang) => (
                <Link
                  key={lang.slug}
                  href={`/${lang.slug}`}
                  className="flex items-center gap-2 px-4 py-3 bg-white border border-brand rounded-[8px] text-base font-bold text-gray-900 hover:bg-brand-light hover:text-brand transition-colors"
                >
                  <span className="text-base">{lang.flag}</span>
                  {code === "en" ? lang.name : languageName(codeForSlug(lang.slug), code)}
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ── Inline CTA: after languages ── */}
        <div className="py-8 flex flex-col items-center gap-2 bg-white">
          <p className="text-xs text-gray-400 font-medium tracking-wide uppercase">{m.store.downloadForFree}</p>
          <StoreButtons t={m.store} />
        </div>

        {/* ── Trust ── */}
        <section id="privacy" className="py-10 px-6 bg-brand">
          <div className="max-w-3xl mx-auto text-center">
            <span className="text-xs font-bold text-cta uppercase tracking-widest">{c.privacyLabel}</span>
            <h2 className="text-3xl font-bold text-white tracking-tight mt-3 mb-2">
              {c.privacyTitle}
            </h2>
            <div className="mb-8" />

            <div className="grid sm:grid-cols-3 gap-4 mb-10">
              {h.privacyCards.map((item) => (
                <div key={item.title} className="bg-white/10 backdrop-blur rounded-xl p-6 border border-white/20 text-start">
                  <h3 className="font-semibold text-white mb-1">{item.title}</h3>
                  <p className="text-sm text-blue-100 leading-relaxed">{item.description}</p>
                </div>
              ))}
            </div>

            {/* Shield SVG */}
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

            <FaqAccordion faqs={h.faqs} />
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

            <DownloadCard className="w-full" t={m.store} />
          </div>
        </section>

      </main>
      <Footer code={code} m={m} />
    </LocaleShell>
  );
}
