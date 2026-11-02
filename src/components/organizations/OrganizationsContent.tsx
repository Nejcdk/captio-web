import Image from "next/image";
import Link from "next/link";
import Footer from "@/components/Footer";
import FaqAccordion from "@/components/FaqAccordion";
import LocaleShell from "@/components/LocaleShell";
import { PilotForm } from "./PilotForm";
import { PhoneVideo } from "./PhoneVideo";
import { OrgHeader } from "./OrgHeader";
import { languageName, languageOptions, pagePath, type Messages } from "@/i18n";
import { ENGLISH, LOCALES } from "@/i18n/locales";
import { fill, orgCurrency, type OrgMessages } from "@/i18n/organizations";
import { appImage } from "@/lib/appImages";
import { languages as languagePages } from "@/lib/languages";
import { SITE_URL, jsonLd, softwareApplicationSchema, faqPageSchema, breadcrumbSchema } from "@/lib/schema";

// Captio AI for Organizations, in any language: /organizations (English) and
// /<code>/organizations. A landing page of its own for people who have never
// heard of the app (Nejc 2026-10-28): its own header (logo, "for
// Organizations", language menu, one button, no site menu), then the hero
// (Nejc 2026-11-02): the heading, three small phones under it (live captions,
// live translation, transcription) and the pilot form beside them. Right under
// it Recognize voices / Speaker direction / Recognize sounds, each with a real
// picture of the app (Nejc 2026-11-02: pictures, not drawings), then every
// caption language, the three main features with their videos, why
// organizations choose it, the pilot steps with the form again, prices, data,
// FAQ, and a last banner with the form a third time.
// The words present the app and what it does, never "your people will…"
// (Nejc 2026-11-02). All words come from src/i18n/organizations/<code>.json.
// Yearly per-person licenses, paid by invoice, for any organization that pays
// for captioning on someone's behalf (Nejc 2026-10-27: never "students" or
// "staff"). Prices and the pilot: app repo tools/organizations/PLAN.md. Never
// name the speech provider here (business secret); /privacy lists them.
// The pilot starts from the form (PilotForm.tsx): the link to forward is
// emailed at once in this page's language, people join at /o/<code>.
// Phones in the hero and the features: the site's app pictures
// (src/lib/appImages.ts). Videos: the app's onboarding loops in
// public/organizations (PhoneVideo.tsx).

const DPA_MAILTO = "mailto:hello@captioai.app?subject=Captio%20AI%20data%20processing%20agreement";
const ADDRESS = "hello@captioai.app";

const PRICES = [
  { gbp: "£89", eur: "€99", usd: "$109" },
  { gbp: "£69", eur: "€79", usd: "$89" },
];

const FEATURE_VIDEOS = ["captions", "translate", "upload"] as const;
const REASON_ICONS = ["⚡", "📱", "🔒", "🧾"];
// One real app picture per feature in t.awareness.items: named speakers,
// speaker direction, a sound written into the captions.
const FEATURE_PICTURES = ["RV_mockup_3.png", "SD_mockup_3.png", "RS_mockup_1.png"].map(appImage);

// Every language the site (and live captions) has, with its flag: shown, not linked.
const FLAGS = new Map(languagePages.map((l) => [l.languageSlug, l.flag]));

// The page's one call to action, everywhere: Start a free pilot (Nejc
// 2026-10-29). Same shape as every other button on the site: 8px corners.
function LinkButton({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-[8px] bg-cta px-6 py-3.5 text-base font-semibold text-white transition-colors hover:bg-cta-dark"
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

// "… the moment people [speak]": the bracketed words are underlined.
function Underlined({ text }: { text: string }) {
  return (
    <>
      {text.split(/(\[[^\]]+\])/).map((part, i) =>
        part.startsWith("[") ? (
          <span key={i} className="underline decoration-brand decoration-4 underline-offset-4">{part.slice(1, -1)}</span>
        ) : (
          part
        ),
      )}
    </>
  );
}

export default function OrganizationsContent({ code, t, m }: { code: string; t: OrgMessages; m: Messages }) {
  const path = pagePath(code, "organizations");
  const currency = orgCurrency(code);
  const others = (["gbp", "eur", "usd"] as const).filter((c) => c !== currency);
  const heroPhones = [
    { image: appImage("LC_mockup_4.png"), label: t.features.items[0].label },
    { image: appImage("LT_mockup_3.png"), label: t.features.items[1].label },
    { image: appImage("AS_mockup_3.png"), label: t.features.items[2].label },
  ];
  const captionLanguages = [ENGLISH, ...LOCALES].map((l) => ({
    code: l.code,
    name: languageName(l.code, code),
    flag: FLAGS.get(l.slug) ?? "🌐",
  }));
  const schemaOrg = jsonLd(
    softwareApplicationSchema({ url: `${SITE_URL}${path}`, description: t.meta.description }),
    faqPageSchema(t.faq.items),
    breadcrumbSchema([
      { name: "Captio AI", path: pagePath(code, "home") },
      { name: t.meta.title, path },
    ]),
  );

  return (
    <LocaleShell code={code}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaOrg) }} />
      <main>
        <OrgHeader
          code={code}
          homeHref={pagePath(code, "home")}
          forOrganizations={t.header.forOrganizations}
          startPilot={t.header.startPilot}
          chooseLanguage={t.header.chooseLanguage}
          languages={languageOptions(code, "organizations")}
        />

        {/* ── Hero: the heading and the app on the left, the form on the right ── */}
        <section className="px-5 pt-8 pb-12 sm:pt-12 sm:pb-16">
          {/* Nejc 2026-11-02: just the heading, a few small phones under it
              showing what the app does, and the pilot form beside them. Phones:
              heading, the three phones in a row, the form. */}
          <div className="max-w-6xl mx-auto grid gap-8 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:gap-12 lg:items-start">
            <div className="flex flex-col gap-8 text-center lg:text-start">
              <h1 className="text-[2.2rem] leading-[1.12] sm:text-[3.1rem] font-bold text-gray-900 tracking-tight">
                <Underlined text={t.hero.title} />
              </h1>
              <ul className="grid grid-cols-3 gap-3 sm:gap-5 w-full max-w-[640px] mx-auto lg:mx-0">
                {heroPhones.map((p) => (
                  <li key={p.image.src} className="flex flex-col items-center gap-2">
                    <Image
                      src={p.image.src}
                      alt={`Captio AI: ${p.label}`}
                      width={p.image.width}
                      height={p.image.height}
                      unoptimized
                      priority
                      className="h-auto w-full select-none"
                    />
                    <span className="text-xs sm:text-sm font-semibold text-gray-700 leading-snug">{p.label}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div id="start" className="w-full max-w-xl mx-auto scroll-mt-4 lg:max-w-none">
              <PilotForm t={t.form} title={t.header.startPilot} language={code} address={ADDRESS} placement="hero" />
            </div>
          </div>
        </section>

        {/* ── More than captions: each feature with its own app picture ── */}
        {/* Nejc 2026-11-02: right under the hero, a real picture of the app for
            each feature (not drawings), then the languages. */}
        <section className="pt-4 pb-14 px-6 bg-white">
          <div className="max-w-6xl mx-auto">
            <SectionTitle eyebrow={t.awareness.eyebrow} title={t.awareness.title} subtitle={t.awareness.subtitle} />
            {/* Phones: a row to swipe through; larger screens: three columns. */}
            <div className="-mx-6 px-6 flex gap-5 overflow-x-auto snap-x snap-mandatory pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:mx-0 sm:px-0 sm:grid sm:grid-cols-3 sm:gap-8 sm:overflow-visible sm:pb-0">
              {t.awareness.items.map((item, i) => {
                const image = FEATURE_PICTURES[i];
                return (
                  <div key={item.title} className="w-[68%] shrink-0 snap-center sm:w-auto flex flex-col items-center text-center gap-5">
                    <div className="w-full max-w-[200px] sm:max-w-[230px]">
                      <Image
                        src={image.src}
                        alt={`Captio AI: ${item.title}`}
                        width={image.width}
                        height={image.height}
                        unoptimized
                        className="h-auto w-full select-none"
                      />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 text-lg">{item.title}</h3>
                      <p className="mt-1.5 text-sm text-gray-500 leading-relaxed max-w-xs mx-auto">{item.description}</p>
                      <p className="mt-2 text-xs font-semibold text-brand">{item.where}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── Languages ── */}
        <section className="pb-14 px-6 bg-white">
          <div className="max-w-5xl mx-auto">
            <SectionTitle eyebrow={t.languages.eyebrow} title={t.languages.title} subtitle={t.languages.subtitle} />
            <ul className="flex flex-wrap justify-center gap-2">
              {captionLanguages.map((l) => (
                <li key={l.code} className="flex items-center gap-1.5 rounded-[8px] border border-gray-200 bg-gray-50 px-2.5 py-1.5 text-[13px] font-medium text-gray-700">
                  <span aria-hidden>{l.flag}</span>
                  {l.name}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ── The three main features ── */}
        <section id="how" className="pb-14 px-6 bg-white scroll-mt-4">
          <div className="max-w-6xl mx-auto">
            <SectionTitle eyebrow={t.features.eyebrow} title={t.features.title} subtitle={t.features.subtitle} />
            {/* Phones: a row to swipe through; larger screens: three columns. */}
            <div className="-mx-6 px-6 flex gap-5 overflow-x-auto snap-x snap-mandatory pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:mx-0 sm:px-0 sm:grid sm:grid-cols-3 sm:gap-8 sm:overflow-visible sm:pb-0">
              {t.features.items.map((f, i) => (
                <div key={FEATURE_VIDEOS[i]} className="w-[68%] shrink-0 snap-center sm:w-auto flex flex-col items-center text-center gap-5">
                  <div className="w-full max-w-[200px] sm:max-w-[220px]">
                    <PhoneVideo name={FEATURE_VIDEOS[i]} label={`Captio AI: ${f.label}`} />
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

        {/* ── Why organizations choose it ── */}
        <section className="py-12 px-6 bg-brand">
          <div className="max-w-6xl mx-auto">
            <SectionTitle eyebrow={t.reasons.eyebrow} title={t.reasons.title} onBlue />
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {t.reasons.items.map((r, i) => (
                <div key={r.title} className="bg-white/10 rounded-xl p-6 border border-white/20">
                  <span className="text-2xl" aria-hidden>{REASON_ICONS[i]}</span>
                  <h3 className="mt-3 font-semibold text-white">{r.title}</h3>
                  <p className="mt-1 text-sm text-blue-100 leading-relaxed">{r.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Pilot: how it works, and the form again ── */}
        <section id="pilot" className="py-12 px-6 bg-white scroll-mt-4">
          <div className="max-w-6xl mx-auto">
            <SectionTitle eyebrow={t.pilot.eyebrow} title={t.pilot.title} />
            <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 lg:items-center">
              <ol className="flex flex-col gap-4">
                {t.pilot.steps.map((s, i) => (
                  <li key={s.title} className="bg-white rounded-xl border border-gray-200 p-5 flex gap-4">
                    <span className="w-9 h-9 shrink-0 rounded-[8px] bg-brand-light text-brand font-bold flex items-center justify-center">{i + 1}</span>
                    <div>
                      <h3 className="font-bold text-gray-900 leading-snug">{s.title}</h3>
                      <p className="mt-1 text-sm text-gray-500 leading-relaxed">{s.description}</p>
                    </div>
                  </li>
                ))}
              </ol>
              <div className="w-full max-w-xl mx-auto lg:max-w-none">
                <PilotForm t={t.form} title={t.header.startPilot} language={code} address={ADDRESS} placement="middle" />
              </div>
            </div>
          </div>
        </section>

        {/* ── Pricing ── */}
        <section className="py-12 px-6 bg-gray-50">
          <div className="max-w-4xl mx-auto">
            <SectionTitle eyebrow={t.pricing.eyebrow} title={t.pricing.title} subtitle={t.pricing.subtitle} />
            <div className="grid sm:grid-cols-2 gap-5">
              {PRICES.map((p, i) => {
                const first = i === 0;
                return (
                  <div key={i} className={`rounded-xl p-8 flex flex-col gap-1 ${first ? "bg-brand" : "bg-white border-2 border-brand"}`}>
                    <span className={`text-xs font-bold uppercase tracking-wide ${first ? "text-cta" : "text-brand"}`}>{t.pricing.plans[i]}</span>
                    <span className={`text-5xl font-bold tracking-tight mt-3 ${first ? "text-white" : "text-gray-900"}`}>{p[currency]}</span>
                    <span className={`text-sm mt-1 ${first ? "text-white/80" : "text-gray-600"}`}>{t.pricing.perPersonYear}</span>
                    <span className={`text-sm ${first ? "text-white/60" : "text-gray-400"}`}>
                      {fill(t.pricing.otherCurrencies, { a: p[others[0]], b: p[others[1]] })}
                    </span>
                  </div>
                );
              })}
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-6 sm:p-8 mt-5">
              <h3 className="font-bold text-gray-900 mb-4">{t.pricing.includedTitle}</h3>
              <ul className="grid sm:grid-cols-2 gap-x-8 gap-y-3">
                {t.pricing.included.map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-sm text-gray-600 leading-relaxed">
                    <Check />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex justify-center mt-6">
              <LinkButton href="#pilot">{t.header.startPilot}</LinkButton>
            </div>
          </div>
        </section>

        {/* ── Data protection ── */}
        <section id="data" className="py-12 px-6 bg-white">
          <div className="max-w-5xl mx-auto">
            <SectionTitle eyebrow={t.data.eyebrow} title={t.data.title} />
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {t.data.items.map((d) => (
                <div key={d.title} className="bg-gray-50 rounded-xl p-6 border border-gray-100">
                  <h3 className="font-semibold text-gray-900 mb-1">{d.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{d.description}</p>
                </div>
              ))}
            </div>
            {/* Plain links, not buttons: the page has one call to action, Start a free pilot (Nejc 2026-10-29). */}
            <p className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-6 text-sm font-semibold">
              <a href={DPA_MAILTO} className="text-brand hover:underline">{t.data.dpa}</a>
              <Link href="/privacy" className="text-brand hover:underline">{t.data.privacy}</Link>
            </p>
          </div>
        </section>

        {/* ── FAQ ── */}
        <section className="py-12 px-6 bg-gray-50">
          <div className="max-w-3xl mx-auto">
            <SectionTitle eyebrow={t.faq.eyebrow} title={t.faq.title} />
            <FaqAccordion faqs={t.faq.items} />
          </div>
        </section>

        {/* ── Last banner, with the form a third time ── */}
        <section className="pt-12 pb-20 px-6 bg-white">
          <div className="max-w-6xl mx-auto bg-brand rounded-xl px-5 py-10 sm:px-10 sm:py-12 grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div className="flex flex-col items-center text-center gap-4 lg:items-start lg:text-start">
              <span className="text-xs font-bold text-cta uppercase tracking-widest">{t.cta.eyebrow}</span>
              <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">{t.cta.title}</h2>
              <p className="text-blue-100 max-w-lg">{fill(t.cta.body, { address: ADDRESS })}</p>
            </div>
            <div className="w-full max-w-xl mx-auto lg:max-w-none">
              <PilotForm t={t.form} title={t.header.startPilot} language={code} address={ADDRESS} placement="end" />
            </div>
          </div>
        </section>
      </main>
      <Footer code={code} m={m} />
    </LocaleShell>
  );
}
