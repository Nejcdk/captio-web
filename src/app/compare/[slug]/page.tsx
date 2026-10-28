import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { DownloadCard, StoreButtons } from "@/components/StoreButtons";
import {
  AppPickCard,
  BetterColumn,
  CompareFaq,
  ComparisonCard,
  DifferenceCard,
  HowWeCompare,
  SectionHeading,
  SituationCard,
  SourcesByApp,
  VersusTable,
} from "@/components/compare/CompareParts";
import { formatDay } from "@/lib/blog";
import { getAllComparePages, getComparePage, getRelatedComparePages } from "@/lib/compare";
import { compareArticleSchema, compareItemListSchema } from "@/lib/compareSchema";
import { SITE_URL, breadcrumbSchema, faqPageSchema, jsonLd, softwareApplicationSchema } from "@/lib/schema";

export const dynamicParams = false;

export function generateStaticParams() {
  return getAllComparePages().map((p) => ({ slug: p.slug }));
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const page = getComparePage(slug);
  if (!page) return {};
  const url = `/compare/${page.slug}`;
  return {
    title: page.title,
    description: page.description,
    alternates: { canonical: url },
    openGraph: {
      title: `${page.title} | Captio AI`,
      description: page.description,
      url,
      type: "article",
      publishedTime: page.published,
      modifiedTime: page.updated,
      section: "Compare",
      tags: page.tags,
    },
    other: {
      "article:published_time": page.published,
      "article:modified_time": page.updated,
    },
  };
}

export default async function ComparePageView({ params }: Props) {
  const { slug } = await params;
  const page = getComparePage(slug);
  if (!page) notFound();

  const url = `${SITE_URL}/compare/${page.slug}`;
  const related = getRelatedComparePages(page);
  const names = page.apps.map((a) => a.shortName);
  const pickFor = (slugOf: string) => page.picks.find((p) => p.app.slug === slugOf)?.text;
  // The other app first in the hero and "better" blocks, Captio AI second:
  // the reader came for the other app.
  const order = [...page.apps].sort((a, b) => (a.slug === "captio-ai" ? 1 : b.slug === "captio-ai" ? -1 : 0));
  const better = [...page.better].sort((a, b) => (a.app.slug === "captio-ai" ? 1 : b.app.slug === "captio-ai" ? -1 : 0));

  const schema = jsonLd(
    compareArticleSchema(page, url),
    compareItemListSchema(page.apps, `${url}#apps`, "Apps compared on this page"),
    ...(page.faqs.length > 0 ? [faqPageSchema(page.faqs)] : []),
    breadcrumbSchema([
      { name: "Home", path: "/" },
      { name: "Compare", path: "/compare" },
      { name: page.title, path: `/compare/${page.slug}` },
    ]),
    softwareApplicationSchema({ url, description: page.description }),
  );

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <main>
        <Header />

        {/* ── Hero: the verdict and one card per app ── */}
        <section className="px-5 sm:px-6 pt-8 sm:pt-14 pb-12 sm:pb-16 bg-white">
          <div className="max-w-5xl mx-auto">
            <nav aria-label="Breadcrumb" className="flex items-center justify-center gap-2 text-sm text-gray-400">
              <Link href="/compare" className="hover:text-brand transition-colors">Compare</Link>
              <span aria-hidden>/</span>
              <span className="text-gray-500">{names.join(" vs ")}</span>
            </nav>
            <div className="mt-5 text-center max-w-3xl mx-auto">
              <h1 className="text-[2.3rem] leading-[1.1] sm:text-6xl sm:leading-[1.05] font-bold text-gray-900 tracking-tight">{page.title}</h1>
              <p className="mt-5 text-lg sm:text-xl text-gray-500 leading-relaxed">{page.description}</p>
              <p className="mt-4 text-sm text-gray-400">
                Facts checked <time dateTime={page.factsChecked}>{formatDay(page.factsChecked)}</time>
                {" on each company's own pages. "}
                <a href="#how-we-compared" className="underline decoration-gray-300 underline-offset-2 hover:text-brand">How we compare</a>
              </p>
            </div>

            <section aria-labelledby="verdict" className="mt-10 max-w-3xl mx-auto bg-brand-light/60 border border-brand/15 rounded-xl p-6 sm:p-7">
              <h2 id="verdict" className="text-xs font-bold text-brand uppercase tracking-widest">The short answer</h2>
              <p className="mt-2.5 text-[17px] sm:text-lg leading-relaxed text-gray-900 font-medium">{page.answer}</p>
            </section>

            <div className={`mt-6 grid gap-4 ${order.length === 2 ? "md:grid-cols-2" : "md:grid-cols-3"}`}>
              {order.map((app) => (
                <AppPickCard key={app.slug} app={app} pick={pickFor(app.slug)} />
              ))}
            </div>
          </div>
        </section>

        {/* ── The table ── */}
        <section aria-labelledby="side-by-side" className="px-5 sm:px-6 py-12 sm:py-16 bg-gray-50 border-y border-gray-100">
          <div className="max-w-5xl mx-auto">
            <SectionHeading
              id="side-by-side"
              eyebrow="Side by side"
              title={`${names.join(" vs ")}, feature by feature`}
              intro="Tap any fact to see the details and the page it comes from."
            />
            <VersusTable apps={page.apps} rows={page.table} caption={`${page.title}: features compared, facts checked ${formatDay(page.factsChecked)}`} />
          </div>
        </section>

        {/* ── Key differences ── */}
        {page.differences.length > 0 && (
          <section aria-labelledby="differences" className="px-5 sm:px-6 py-12 sm:py-16 bg-white">
            <div className="max-w-5xl mx-auto">
              <SectionHeading id="differences" eyebrow="Key differences" title="What actually sets them apart" />
              <div className="grid md:grid-cols-2 gap-4">
                {page.differences.map((d) => (
                  <DifferenceCard key={d.title} {...d} />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ── Where each one is better ── */}
        {better.length > 0 && (
          <section aria-labelledby="better" className="px-5 sm:px-6 py-12 sm:py-16 bg-white border-t border-gray-100">
            <div className="max-w-5xl mx-auto">
              <SectionHeading id="better" eyebrow="Honest take" title="Where each one wins" />
              <div className="grid md:grid-cols-2 gap-4">
                {better.map((b) => (
                  <BetterColumn key={b.app.slug} {...b} />
                ))}
              </div>
            </div>
          </section>
        )}

        <div className="py-8 flex flex-col items-center gap-2 bg-white">
          <p className="text-xs text-gray-400 font-medium tracking-wide uppercase">Try Captio AI free</p>
          <StoreButtons />
        </div>

        {/* ── Which one for which situation ── */}
        {page.situations.length > 0 && (
          <section aria-labelledby="situations" className="px-5 sm:px-6 py-12 sm:py-16 bg-gray-50 border-y border-gray-100">
            <div className="max-w-6xl mx-auto">
              <SectionHeading id="situations" eyebrow="Which one should you use?" title="It depends on where you are" />
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {page.situations.map((s) => (
                  <SituationCard key={s.title} situation={s} />
                ))}
              </div>
            </div>
          </section>
        )}

        <HowWeCompare factsChecked={page.factsChecked} />

        {/* ── FAQ ── */}
        {page.faqs.length > 0 && (
          <section aria-labelledby="faq" className="px-5 sm:px-6 py-12 sm:py-16 bg-gray-50">
            <div className="max-w-3xl mx-auto">
              <SectionHeading id="faq" eyebrow="FAQ" title="Frequently asked questions" />
              <CompareFaq faqs={page.faqs} />
            </div>
          </section>
        )}

        {/* ── Download ── */}
        <section className="pt-4 pb-16 px-5 sm:px-6 bg-gray-50">
          <div className="max-w-2xl mx-auto flex flex-col items-center gap-6">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight text-center">Try Captio AI</h2>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest text-center">Free to start, iPhone and Android</p>
            <DownloadCard id="download" className="w-full" />
          </div>
        </section>

        {/* ── More comparisons ── */}
        {related.length > 0 && (
          <section aria-labelledby="more" className="px-5 sm:px-6 py-12 sm:py-16 bg-white">
            <div className="max-w-6xl mx-auto">
              <SectionHeading id="more" eyebrow="Compare" title="More comparisons" />
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {related.map((p) => (
                  <ComparisonCard key={p.slug} page={p} />
                ))}
              </div>
              <div className="mt-8 text-center">
                <Link href="/compare" className="inline-block text-sm font-semibold text-brand border border-brand/30 rounded-[8px] px-5 py-2.5 hover:bg-brand-light transition-colors">
                  All comparisons
                </Link>
              </div>
            </div>
          </section>
        )}

        {/* ── Sources ── */}
        <section aria-labelledby="sources" className="px-5 sm:px-6 py-12 border-t border-gray-100 bg-white">
          <div className="max-w-5xl mx-auto">
            <h2 id="sources" className="text-xl font-bold text-gray-900 tracking-tight">Sources</h2>
            <p className="mt-1 mb-6 text-sm text-gray-400">Every page this comparison uses, with the date we checked it.</p>
            <SourcesByApp groups={page.sources} />
            <p className="mt-10 text-xs text-gray-400 leading-relaxed">
              Published {formatDay(page.published)}
              {page.updated !== page.published ? `, last updated ${formatDay(page.updated)}` : ""}. App names and trademarks belong to their owners. This page is
              not affiliated with or endorsed by the companies it compares.
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
