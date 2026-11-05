import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import ShortAnswer from "@/components/ShortAnswer";
import { DownloadCard, StoreButtons } from "@/components/StoreButtons";
import { CompareFaq, SectionHeading, SourcesByApp } from "@/components/compare/CompareParts";
import { ClaimColumn, FactSheet, OtherAppCard, SimilarNameCard } from "@/components/about/AboutParts";
import { getAboutPage } from "@/lib/about";
import { appImage } from "@/lib/appImages";
import { formatDay } from "@/lib/blog";
import { SITE_URL, breadcrumbSchema, faqPageSchema, jsonLd, softwareApplicationSchema } from "@/lib/schema";

// Captio AI on its own, in facts with sources: what it is, what it costs, what
// it doesn't do, which apps only share its name, and when another app is the
// better choice. Data: src/lib/about.ts.

const page = getAboutPage();
const crumbs = [
  { name: "Home", path: "/" },
  { name: "About", path: "/about" },
];
const hero = appImage("mockup_app.png");

export const metadata: Metadata = {
  // The brand is in the title already, so the " | Captio AI" template is left off.
  title: { absolute: "About Captio AI: what it does, what it costs, who makes it" },
  description: page.description,
  alternates: { canonical: "/about" },
  openGraph: {
    title: "About Captio AI",
    description: page.description,
    url: "/about",
    type: "website",
    images: ["/opengraph-image"],
  },
};

export default function AboutPageView() {
  const url = `${SITE_URL}/about`;
  const notRelated = page.similarNames.map((s) => (s.by && !s.name.includes(s.by) ? `${s.name} (${s.by})` : s.name));

  const schema = jsonLd(
    {
      "@type": "AboutPage",
      "@id": `${url}#webpage`,
      url,
      name: page.title,
      description: page.description,
      dateModified: page.updated,
      lastReviewed: page.updated,
      inLanguage: "en",
      isPartOf: { "@id": `${SITE_URL}/#website` },
      publisher: { "@id": `${SITE_URL}/#organization` },
      about: { "@id": `${SITE_URL}/#organization` },
      mainEntity: { "@id": `${url}#app` },
    },
    {
      ...softwareApplicationSchema({ url, description: page.answer }),
      "@id": `${url}#app`,
      disambiguatingDescription: `A live captioning app for deaf and hard of hearing people. Not related to ${notRelated.join(", ")}.`,
    },
    faqPageSchema(page.faqs),
    breadcrumbSchema(crumbs),
  );

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <main>
        <Header />

        {/* ── Hero: what it is, in a few sentences ── */}
        <section className="px-5 sm:px-6 pt-8 sm:pt-14 pb-12 sm:pb-16 bg-white">
          <div className="max-w-5xl mx-auto grid md:grid-cols-[1fr_auto] gap-10 md:gap-12 items-center">
            <div className="flex flex-col items-center md:items-start text-center md:text-start">
              <Breadcrumbs items={crumbs} className="md:justify-start" />
              <h1 className="mt-5 text-[2.3rem] leading-[1.1] sm:text-6xl sm:leading-[1.05] font-bold text-gray-900 tracking-tight">{page.title}</h1>
              <p className="mt-5 text-lg sm:text-xl text-gray-500 leading-relaxed max-w-2xl">{page.description}</p>
              <div className="mt-7 w-full flex justify-center md:justify-start">
                <ShortAnswer
                  reviewed={formatDay(page.updated)}
                  footer={
                    <>
                      <span>Facts checked {formatDay(page.factsChecked)}</span>
                      <a href="/about.md" className="underline decoration-gray-300 underline-offset-2 hover:text-brand">Plain text version</a>
                    </>
                  }
                >
                  {page.answer}
                </ShortAnswer>
              </div>
              <div className="mt-7">
                <StoreButtons />
              </div>
            </div>
            <Image src={hero.src} alt={hero.alt} width={hero.width} height={hero.height} unoptimized priority className="mx-auto w-[260px] sm:w-[320px] h-auto" />
          </div>
        </section>

        {/* ── The facts, in four groups ── */}
        <section aria-labelledby="facts" className="px-5 sm:px-6 py-12 sm:py-16 bg-gray-50 border-y border-gray-100">
          <div className="max-w-4xl mx-auto">
            <SectionHeading
              id="facts"
              eyebrow="Facts"
              title="Captio AI, fact by fact"
              intro="The same facts the comparison pages use. Tap any fact to see the details and the page it comes from."
            />
            <div className="flex flex-col gap-5">
              {page.groups.map((g) => (
                <FactSheet key={g.id} id={g.id} title={g.title} intro={g.intro} rows={g.rows} />
              ))}
            </div>
          </div>
        </section>

        {/* ── Strengths and limits ── */}
        <section aria-labelledby="honest" className="px-5 sm:px-6 py-12 sm:py-16 bg-white">
          <div className="max-w-5xl mx-auto">
            <SectionHeading id="honest" eyebrow="Honest take" title="What it does well, and its limits" />
            <div className="grid md:grid-cols-2 gap-4">
              <ClaimColumn title="What Captio AI does well" items={page.strengths} kind="strength" />
              <ClaimColumn title="Its limits" items={page.limits} kind="limit" />
            </div>
          </div>
        </section>

        {/* ── When another app is the better choice ── */}
        <section aria-labelledby="other-apps" className="px-5 sm:px-6 py-12 sm:py-16 bg-gray-50 border-y border-gray-100">
          <div className="max-w-6xl mx-auto">
            <SectionHeading
              id="other-apps"
              eyebrow="Other apps"
              title="When another app is the better choice"
              intro="Captio AI captions conversations in the room. For these jobs, another app or service does more."
            />
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {page.otherApps.map((o) => (
                <OtherAppCard key={o.title} item={o} />
              ))}
            </div>
            <div className="mt-8 text-center">
              <Link href="/compare" className="inline-block text-sm font-semibold text-brand border border-brand/30 rounded-[8px] px-5 py-2.5 hover:bg-brand-light transition-colors">
                All caption apps compared
              </Link>
            </div>
          </div>
        </section>

        {/* ── Similar names ── */}
        <section aria-labelledby="similar-names" className="px-5 sm:px-6 py-12 sm:py-16 bg-white">
          <div className="max-w-6xl mx-auto">
            <SectionHeading
              id="similar-names"
              eyebrow="Not to be confused with"
              title="Apps with similar names"
              intro="Captio AI is not related to these. They make other things, by other companies."
            />
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {page.similarNames.map((s) => (
                <SimilarNameCard key={s.name} item={s} />
              ))}
            </div>
          </div>
        </section>

        {/* ── FAQ ── */}
        <section aria-labelledby="faq" className="px-5 sm:px-6 py-12 sm:py-16 bg-gray-50">
          <div className="max-w-3xl mx-auto">
            <SectionHeading id="faq" eyebrow="FAQ" title="Frequently asked questions" />
            <CompareFaq faqs={page.faqs} />
          </div>
        </section>

        {/* ── Download ── */}
        <section className="pt-4 pb-16 px-5 sm:px-6 bg-gray-50">
          <div className="max-w-2xl mx-auto flex flex-col items-center gap-6">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight text-center">Try Captio AI</h2>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest text-center">Free to start, iPhone and Android</p>
            <DownloadCard id="download" className="w-full" />
          </div>
        </section>

        {/* ── Sources ── */}
        <section aria-labelledby="sources" className="px-5 sm:px-6 py-12 border-t border-gray-100 bg-white">
          <div className="max-w-5xl mx-auto">
            <h2 id="sources" className="text-xl font-bold text-gray-900 tracking-tight">Sources</h2>
            <p className="mt-1 mb-6 text-sm text-gray-400">Every page the facts above come from, with the date we checked it.</p>
            <SourcesByApp groups={page.sources} />
            <p className="mt-10 text-xs text-gray-400 leading-relaxed">
              Last updated {formatDay(page.updated)}. Something out of date? Write to{" "}
              <a href="mailto:hello@captioai.app" className="underline underline-offset-2">hello@captioai.app</a>. App names and trademarks belong to their
              owners.
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
