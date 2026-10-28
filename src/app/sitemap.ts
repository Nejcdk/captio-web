import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/schema";
import { languages } from "@/lib/languages";
import { useCases } from "@/lib/useCases";
import { AUTHORS, CATEGORIES, getAllPosts, getPostsByAuthor, getPostsByCategory, type AuthorKey, type CategorySlug } from "@/lib/blog";
import { getAllComparePages, getCompareHub } from "@/lib/compare";
import { FEATURE_SLUGS, pagePath } from "@/i18n";
import { LOCALE_CODES } from "@/i18n/locales";

// Generated from the same data that generates the pages, so it stays in sync
// automatically. Next serves this at /sitemap.xml.
//
// lastModified is a fixed date per page group, NOT the build time. Search
// engines only trust <lastmod> when it changes with the content; stamping every
// URL with the deploy date teaches them to ignore it. When you meaningfully edit
// a group's content, bump its date here.
const UPDATED = {
  core: "2026-10-13", // homepage, feature pages
  languages: "2026-10-13", // /[language]
  useCases: "2026-10-13", // /use-cases/[slug] and /use-cases/[slug]/[language]
  privacy: "2026-10-07",
  terms: "2026-10-07",
  organizations: "2026-10-27",
  translations: "2026-10-28", // /<code> and /<code>/<feature>
};

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, lastModified: UPDATED.core },
    { url: `${SITE_URL}/live-captions`, lastModified: UPDATED.core },
    { url: `${SITE_URL}/live-translator`, lastModified: UPDATED.core },
    { url: `${SITE_URL}/audio-transcription`, lastModified: UPDATED.core },
    { url: `${SITE_URL}/ai-summary`, lastModified: UPDATED.core },
    { url: `${SITE_URL}/organizations`, lastModified: UPDATED.organizations },
    { url: `${SITE_URL}/privacy`, lastModified: UPDATED.privacy },
    { url: `${SITE_URL}/terms`, lastModified: UPDATED.terms },
  ];

  // The home page and the four feature pages in 59 more languages — /de, /de/live-captions
  for (const code of LOCALE_CODES) {
    for (const page of ["home", ...FEATURE_SLUGS] as const) {
      entries.push({ url: `${SITE_URL}${pagePath(code, page)}`, lastModified: UPDATED.translations });
    }
  }

  // 60 language pages — /[language]
  for (const lang of languages) {
    entries.push({ url: `${SITE_URL}/${lang.languageSlug}`, lastModified: UPDATED.languages });
  }

  // 12 use-case pages — /use-cases/[slug]
  for (const uc of useCases) {
    entries.push({ url: `${SITE_URL}/use-cases/${uc.slug}`, lastModified: UPDATED.useCases });
  }

  // 720 use-case × language pages — /use-cases/[slug]/[language]
  for (const uc of useCases) {
    for (const lang of languages) {
      entries.push({
        url: `${SITE_URL}/use-cases/${uc.slug}/${lang.languageSlug}`,
        lastModified: UPDATED.useCases,
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
      entries.push({ url: `${SITE_URL}/blog/${post.slug}`, lastModified: post.updated });
    }
  }

  // Compare: the hub moves with its own date, each page with its frontmatter.
  entries.push({ url: `${SITE_URL}/compare`, lastModified: getCompareHub().updated });
  for (const page of getAllComparePages()) {
    entries.push({ url: `${SITE_URL}/compare/${page.slug}`, lastModified: page.updated });
  }

  return entries;
}
