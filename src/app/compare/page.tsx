import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { DownloadCard } from "@/components/StoreButtons";
import { CompareFaq, ComparisonCard, HowWeCompare, RoundupTable, SectionHeading } from "@/components/compare/CompareParts";
import { formatDay } from "@/lib/blog";
import { comparePageFor, getAllComparePages, getCompareHub } from "@/lib/compare";
import { compareItemListSchema } from "@/lib/compareSchema";
import { SITE_URL, breadcrumbSchema, faqPageSchema, jsonLd } from "@/lib/schema";

const hub = getCompareHub();

export const metadata: Metadata = {
  title: hub.title,
  description: hub.description,
  alternates: { canonical: "/compare" },
  openGraph: {
    title: `${hub.title} | Captio AI`,
    description: hub.description,
    url: "/compare",
    type: "website",
    images: ["/opengraph-image"],
  },
};

export default function CompareHubPage() {
  const pages = getAllComparePages();
  const url = `${SITE_URL}/compare`;
  const hrefFor = (app: Parameters<typeof comparePageFor>[0]) => {
    const p = comparePageFor(app);
    return p ? `/compare/${p.slug}` : undefined;
  };

  const schema = jsonLd(
    {
      "@type": "CollectionPage",
      "@id": `${url}#page`,
      name: hub.title,
      description: hub.description,
      url,
      dateModified: hub.updated,
      inLanguage: "en",
      isPartOf: { "@id": `${SITE_URL}/#website` },
      publisher: { "@id": `${SITE_URL}/#organization` },
      hasPart: pages.map((p) => ({ "@type": "Article", "@id": `${SITE_URL}/compare/${p.slug}#article`, headline: p.title, url: `${SITE_URL}/compare/${p.slug}` })),
    },
    {
      "@type": "ItemList",
      "@id": `${url}#comparisons`,
      name: "Comparisons",
      numberOfItems: pages.length,
      itemListElement: pages.map((p, i) => ({ "@type": "ListItem", position: i + 1, name: p.title, url: `${SITE_URL}/compare/${p.slug}` })),
    },
    compareItemListSchema(hub.overview.apps, `${url}#overview`, hub.overview.title),
    ...(hub.faqs.length > 0 ? [faqPageSchema(hub.faqs)] : []),
    breadcrumbSchema([
      { name: "Home", path: "/" },
      { name: "Compare", path: "/compare" },
    ]),
  );

  const stats = [
    { value: String(hub.appCount), label: "apps compared with Captio AI" },
    { value: `${hub.sourceCount}`, label: "official pages read, every fact linked" },
    { value: formatDay(hub.factsChecked).replace(/ \d{4}$/, ""), label: `facts checked, ${hub.factsChecked.slice(0, 4)}` },
  ];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <main>
        <Header />

        {/* ── Hero ── */}
        <section className="px-5 sm:px-6 pt-10 sm:pt-16 pb-12 sm:pb-16 bg-white">
          <div className="max-w-4xl mx-auto text-center">
            <span className="text-xs font-bold text-cta uppercase tracking-widest">Compare</span>
            <h1 className="mt-3 text-[2.3rem] leading-[1.1] sm:text-6xl sm:leading-[1.05] font-bold text-gray-900 tracking-tight">{hub.title}</h1>
            <p className="mt-5 text-lg sm:text-xl text-gray-500 leading-relaxed max-w-3xl mx-auto">{hub.description}</p>
          </div>
          <div className="mt-10 max-w-4xl mx-auto grid grid-cols-3 gap-3 sm:gap-4">
            {stats.map((s) => (
              <div key={s.label} className="bg-gray-50 border border-gray-100 rounded-xl px-3 py-4 sm:p-6 text-center">
                <p className="text-2xl sm:text-4xl font-bold text-brand tracking-tight">{s.value}</p>
                <p className="mt-1.5 text-xs sm:text-sm text-gray-500 leading-snug">{s.label}</p>
              </div>
            ))}
          </div>
          <section aria-labelledby="short-answer" className="mt-6 max-w-4xl mx-auto bg-brand-light/60 border border-brand/15 rounded-xl p-6 sm:p-7">
            <h2 id="short-answer" className="text-xs font-bold text-brand uppercase tracking-widest">Which caption app should I use?</h2>
            <p className="mt-2.5 text-[17px] sm:text-lg leading-relaxed text-gray-900 font-medium">{hub.answer}</p>
          </section>
        </section>

        {/* ── The comparisons, by kind of app ── */}
        {hub.groups.map((g, i) => {
          const groupPages = g.apps.map((a) => comparePageFor(a)).filter((p): p is NonNullable<typeof p> => !!p);
          if (groupPages.length === 0) return null;
          return (
            <section key={g.id} aria-labelledby={g.id} className={`px-5 sm:px-6 py-12 sm:py-14 ${i % 2 === 0 ? "bg-gray-50 border-y border-gray-100" : "bg-white"}`}>
              <div className="max-w-6xl mx-auto">
                <SectionHeading id={g.id} eyebrow="Compare" title={g.title} intro={g.intro} />
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {groupPages.map((p) => (
                    <ComparisonCard key={p.slug} page={p} />
                  ))}
                </div>
              </div>
            </section>
          );
        })}

        {/* ── All at a glance ── */}
        <section aria-labelledby="overview" className="px-5 sm:px-6 py-12 sm:py-16 bg-white">
          <div className="max-w-6xl mx-auto">
            <SectionHeading id="overview" eyebrow="At a glance" title={hub.overview.title} intro={hub.overview.intro} />
            <RoundupTable apps={hub.overview.apps} rows={hub.overview.table} caption={`${hub.overview.title}, facts checked ${formatDay(hub.factsChecked)}`} hrefFor={hrefFor} />
          </div>
        </section>

        <HowWeCompare factsChecked={hub.factsChecked} />

        {hub.faqs.length > 0 && (
          <section aria-labelledby="faq" className="px-5 sm:px-6 py-12 sm:py-16 bg-gray-50">
            <div className="max-w-3xl mx-auto">
              <SectionHeading id="faq" eyebrow="FAQ" title="Frequently asked questions" />
              <CompareFaq faqs={hub.faqs} />
            </div>
          </section>
        )}

        <section className="pt-4 pb-16 px-5 sm:px-6 bg-gray-50">
          <div className="max-w-2xl mx-auto flex flex-col items-center gap-6">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight text-center">Try Captio AI</h2>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest text-center">Free to start, iPhone and Android</p>
            <DownloadCard id="download" className="w-full" />
          </div>
        </section>

        <p className="px-5 sm:px-6 py-8 bg-white text-center text-xs text-gray-400 leading-relaxed">
          Last updated {formatDay(hub.updated)}. App names and trademarks belong to their owners. This page is not affiliated with or endorsed by the companies it
          compares.
        </p>
      </main>
      <Footer />
    </>
  );
}
