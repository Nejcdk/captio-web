import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/schema";
import { languages } from "@/lib/languages";
import { useCases } from "@/lib/useCases";

// Generated from the same data that generates the pages, so it stays in sync
// automatically. Next serves this at /sitemap.xml. While robots.txt blocks all
// crawlers it is inert; submit it to Search Console at go-live.
export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  const staticPaths = [
    "/",
    "/live-captions",
    "/live-translator",
    "/audio-transcription",
    "/ai-summary",
    "/demo",
    "/pricing",
    "/support",
    "/privacy",
    "/terms",
  ];

  const entries: MetadataRoute.Sitemap = staticPaths.map((path) => ({
    url: `${SITE_URL}${path}`,
    lastModified,
  }));

  // 60 language pages — /[language]
  for (const lang of languages) {
    entries.push({ url: `${SITE_URL}/${lang.languageSlug}`, lastModified });
  }

  // 12 use-case pages — /use-cases/[slug]
  for (const uc of useCases) {
    entries.push({ url: `${SITE_URL}/use-cases/${uc.slug}`, lastModified });
  }

  // 720 use-case × language pages — /use-cases/[slug]/[language]
  for (const uc of useCases) {
    for (const lang of languages) {
      entries.push({
        url: `${SITE_URL}/use-cases/${uc.slug}/${lang.languageSlug}`,
        lastModified,
      });
    }
  }

  return entries;
}
