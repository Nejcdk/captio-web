import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/schema";
import { pageImages } from "@/lib/appImages";
import { languages } from "@/lib/languages";
import { useCases } from "@/lib/useCases";
import { AUTHORS, CATEGORIES, getAllPosts, getPostsByAuthor, getPostsByCategory, type AuthorKey, type CategorySlug } from "@/lib/blog";
import { getAllComparePages, getCompareHub } from "@/lib/compare";
import { getAboutPage } from "@/lib/about";
import { FEATURE_SLUGS, languageAlternates, pagePath, type TranslatedPage } from "@/i18n";
import { LOCALE_CODES } from "@/i18n/locales";
import { UPDATED } from "@/lib/updated";

// Generated from the same data that generates the pages, so it stays in sync
// automatically. Next serves this at /sitemap.xml.
//
// lastModified is a fixed date per page group (src/lib/updated.ts), NOT the
// build time: search engines only trust <lastmod> when it changes with the
// content. The pages that exist in every language carry their hreflang links
// here too, the same links as in their <head>.

type SitemapAlternates = MetadataRoute.Sitemap[number]["alternates"];

function alternates(page: TranslatedPage): SitemapAlternates {
  const languages: Record<string, string> = {};
  for (const [code, path] of Object.entries(languageAlternates(page))) languages[code] = `${SITE_URL}${path}`;
  return { languages: languages as NonNullable<SitemapAlternates>["languages"] };
}

// The app pictures on a page (src/lib/app-images.json), as image-sitemap
// entries, so image search finds Captio AI's own pictures.
function images(...pages: string[]): { images?: string[] } {
  const list = pages.flatMap(pageImages).map((img) => `${SITE_URL}${img.src}`);
  return list.length > 0 ? { images: list } : {};
}

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, lastModified: UPDATED.core, alternates: alternates("home"), ...images("home") },
    ...FEATURE_SLUGS.map((slug) => ({ url: `${SITE_URL}/${slug}`, lastModified: UPDATED.core, alternates: alternates(slug), ...images(slug) })),
    ...["ai-actions", "export", "folders", "recognize-voices", "speaker-direction", "recognize-sounds", "connectors", "widgets"].map((slug) => ({
      url: `${SITE_URL}/${slug}`,
      lastModified: UPDATED.moreFeatures,
      ...images(slug),
    })),
    { url: `${SITE_URL}/use-cases`, lastModified: UPDATED.hubs },
    { url: `${SITE_URL}/languages`, lastModified: UPDATED.hubs },
    { url: `${SITE_URL}/about`, lastModified: getAboutPage().updated, ...images("home") },
    { url: `${SITE_URL}/organizations`, lastModified: UPDATED.organizations, alternates: alternates("organizations") },
    { url: `${SITE_URL}/privacy`, lastModified: UPDATED.privacy },
    { url: `${SITE_URL}/terms`, lastModified: UPDATED.terms },
  ];

  // The home page and the four feature pages in 59 more languages — /de, /de/live-captions
  for (const code of LOCALE_CODES) {
    for (const page of ["home", ...FEATURE_SLUGS] as const) {
      entries.push({ url: `${SITE_URL}${pagePath(code, page)}`, lastModified: UPDATED.translations, alternates: alternates(page), ...images(page) });
    }
    // and /de/organizations
    entries.push({ url: `${SITE_URL}${pagePath(code, "organizations")}`, lastModified: UPDATED.organizations, alternates: alternates("organizations") });
  }

  // 60 language pages — /[language]
  for (const lang of languages) {
    entries.push({ url: `${SITE_URL}/${lang.languageSlug}`, lastModified: UPDATED.languages, ...images("home") });
  }

  // 12 use-case pages — /use-cases/[slug]
  for (const uc of useCases) {
    entries.push({ url: `${SITE_URL}/use-cases/${uc.slug}`, lastModified: UPDATED.useCases, ...images("home", "use-case") });
  }

  // 720 use-case × language pages — /use-cases/[slug]/[language]
  for (const uc of useCases) {
    for (const lang of languages) {
      entries.push({
        url: `${SITE_URL}/use-cases/${uc.slug}/${lang.languageSlug}`,
        lastModified: UPDATED.useCases,
        ...images("home", "use-case"),
      });
    }
  }

  // Blog: each article carries its own updated date from its frontmatter, so
  // <lastmod> moves only when that article changes. Empty categories are left
  // out (they are noindex until they have articles).
  const posts = getAllPosts();
  if (posts.length > 0) {
    const newest = posts.map((p) => p.updated).sort().pop()!;
    entries.push({ url: `${SITE_URL}/blog`, lastModified: newest });
    for (const slug of Object.keys(CATEGORIES) as CategorySlug[]) {
      const inCategory = getPostsByCategory(slug);
      if (inCategory.length === 0) continue;
      entries.push({
        url: `${SITE_URL}/blog/category/${slug}`,
        lastModified: inCategory.map((p) => p.updated).sort().pop()!,
      });
    }
    for (const author of Object.keys(AUTHORS) as AuthorKey[]) {
      const byAuthor = getPostsByAuthor(author);
      if (byAuthor.length === 0) continue;
      entries.push({
        url: `${SITE_URL}/blog/author/${author}`,
        lastModified: byAuthor.map((p) => p.updated).sort().pop()!,
      });
    }
    for (const post of posts) {
      const pictures = post.images.map((img) => `${SITE_URL}${img.src}`);
      entries.push({ url: `${SITE_URL}/blog/${post.slug}`, lastModified: post.updated, ...(pictures.length ? { images: pictures } : {}) });
    }
  }

  // Compare: the hub moves with its own date, each page with its frontmatter.
  entries.push({ url: `${SITE_URL}/compare`, lastModified: getCompareHub().updated });
  for (const page of getAllComparePages()) {
    entries.push({ url: `${SITE_URL}/compare/${page.slug}`, lastModified: page.updated });
  }

  return entries;
}
