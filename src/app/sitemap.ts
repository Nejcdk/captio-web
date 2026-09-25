import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/schema";
import { languages } from "@/lib/languages";
import { useCases } from "@/lib/useCases";

// Generated from the same data that generates the pages, so it stays in sync
// automatically. Next serves this at /sitemap.xml.
//
// lastModified is a fixed date per page group, NOT the build time. Search
// engines only trust <lastmod> when it changes with the content; stamping every
// URL with the deploy date teaches them to ignore it. When you meaningfully edit
// a group's content, bump its date here.
const UPDATED = {
  core: "2026-09-25", // homepage, feature pages
  languages: "2026-09-25", // /[language]
  useCases: "2026-09-25", // /use-cases/[slug] and /use-cases/[slug]/[language]
  privacy: "2026-08-13",
  terms: "2026-07-31",
};

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, lastModified: UPDATED.core },
    { url: `${SITE_URL}/live-captions`, lastModified: UPDATED.core },
    { url: `${SITE_URL}/live-translator`, lastModified: UPDATED.core },
    { url: `${SITE_URL}/audio-transcription`, lastModified: UPDATED.core },
    { url: `${SITE_URL}/ai-summary`, lastModified: UPDATED.core },
    { url: `${SITE_URL}/privacy`, lastModified: UPDATED.privacy },
    { url: `${SITE_URL}/terms`, lastModified: UPDATED.terms },
  ];

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

  return entries;
}
