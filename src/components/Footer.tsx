import Link from "next/link";
import Image from "next/image";
import { useCases } from "@/lib/useCases";
import { getAllPosts } from "@/lib/blog";
import { getAllComparePages } from "@/lib/compare";
import { FeaturedOnCard } from "@/components/FeaturedOn";
import en from "@/i18n/messages/en.json";
import { FEATURE_SLUGS, pagePath, type Messages } from "@/i18n";

// On a translated page (code + m) the footer's words follow the page's language
// and the feature links go to that language's feature pages. Articles,
// comparisons and use-case pages are English only: their links stay, and the
// use cases are labelled from the home page's translation.
export default function Footer({ code = "en", m = en }: { code?: string; m?: Messages }) {
  const t = m.footer;
  const useCaseLabels: Record<string, { label: string }> = m.home.useCases;
  // Newest articles on every page: readers find them, and crawlers reach a new
  // article from ~800 pages the day it is published.
  const latestPosts = getAllPosts().slice(0, 4);
  const comparePages = getAllComparePages();
  return (
    <footer className="bg-brand text-white">
      <div className="max-w-6xl mx-auto px-6 pt-12 pb-0">
        <div className="flex flex-col md:flex-row justify-between gap-10">
          <div>
            <Image src="/logo_text.png" alt="Captio AI" width={90} height={25} />
            <p className="mt-3 text-sm text-white/60 max-w-xs leading-relaxed">
              {t.tagline}
            </p>

            {/* Product Hunt's embed card, rebuilt in Tailwind with the app icon served from here. */}
            <div className="mt-6 max-w-xs rounded-xl bg-white p-4 shadow-sm">
              <div className="flex items-center gap-3">
                <Image src="/app_icon.png" alt="Captio AI" width={48} height={48} className="rounded-lg shrink-0" />
                <div className="min-w-0">
                  <p className="font-semibold text-[#1a1a1a] leading-tight">Captio AI</p>
                  <p className="mt-1 text-xs text-[#666] leading-snug line-clamp-2">{t.productHuntTagline}</p>
                </div>
              </div>
              <a
                href="https://www.producthunt.com/products/captio-ai?embed=true&utm_source=embed&utm_medium=post_embed"
                target="_blank"
                rel="noopener"
                className="mt-3 inline-flex items-center rounded-full bg-[#FF6154] px-4 py-2 text-sm font-semibold text-white hover:bg-[#e8564a] transition-colors"
              >
                {t.productHunt}
              </a>
            </div>

            <FeaturedOnCard label={t.featuredOn} />
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-10 text-sm md:max-w-3xl">
            <div className="flex flex-col gap-2">
              <span className="font-semibold text-white/40 uppercase tracking-widest text-xs mb-1">{t.features}</span>
              {FEATURE_SLUGS.map((slug) => (
                <Link key={slug} href={pagePath(code, slug)} className="text-white/70 hover:text-white transition-colors">{m.common.featureNames[slug]}</Link>
              ))}
              {/* The newer feature pages are English only. */}
              {Object.entries(m.home.moreFeatures).map(([slug, f]) => (
                <Link key={slug} href={`/${slug}`} className="text-white/70 hover:text-white transition-colors">{f.label}</Link>
              ))}
            </div>

            <div className="flex flex-col gap-2">
              <span className="font-semibold text-white/40 uppercase tracking-widest text-xs mb-1">{t.useCases}</span>
              {useCases.map((uc) => (
                <Link key={uc.slug} href={`/use-cases/${uc.slug}`} className="text-white/70 hover:text-white transition-colors">{code === "en" ? uc.label : (useCaseLabels[uc.slug]?.label ?? uc.label)}</Link>
              ))}
            </div>

            <div className="flex flex-col gap-2">
              <Link href="/compare" className="font-semibold text-white/40 hover:text-white uppercase tracking-widest text-xs mb-1 transition-colors">{t.compare}</Link>
              {comparePages.map((page) => (
                <Link key={page.slug} href={`/compare/${page.slug}`} className="text-white/70 hover:text-white transition-colors leading-snug">{page.title}</Link>
              ))}
              <Link href="/compare" className="text-white font-semibold hover:underline">{t.compareApps}</Link>
            </div>

            <div className="flex flex-col gap-2">
              <Link href="/blog" className="font-semibold text-white/40 hover:text-white uppercase tracking-widest text-xs mb-1 transition-colors">{t.blog}</Link>
              {latestPosts.map((post) => (
                <Link key={post.slug} href={`/blog/${post.slug}`} className="text-white/70 hover:text-white transition-colors leading-snug">{post.title}</Link>
              ))}
              <Link href="/blog" className="text-white font-semibold hover:underline">{t.allArticles}</Link>

              <span className="font-semibold text-white/40 uppercase tracking-widest text-xs mt-6 mb-1">{t.company}</span>
              <Link href="/organizations" className="text-white/70 hover:text-white transition-colors">{t.organizations}</Link>
              <Link href="/privacy" className="text-white/70 hover:text-white transition-colors">{t.privacy}</Link>
              <Link href="/terms" className="text-white/70 hover:text-white transition-colors">{t.terms}</Link>
            </div>
          </div>
        </div>

      </div>

      <div className="flex justify-center overflow-hidden h-72">
        <Image
          src="/captio_original.png"
          alt=""
          width={460}
          height={460}
          className="object-top object-cover"
        />
      </div>
    </footer>
  );
}
