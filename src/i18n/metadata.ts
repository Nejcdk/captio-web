import type { Metadata } from "next";
import { getLocale } from "./locales";
import { languageAlternates, pagePath, type FeatureSlug, type Messages } from "./index";

// <head> of the home page and the feature pages in any language: canonical,
// hreflang links to every other language, and Open Graph in that language.

export function homeMetadata(code: string, m: Messages): Metadata {
  const path = pagePath(code, "home");
  return {
    // Absolute: under /[language] the layout's " | Captio AI" template would
    // apply, and the title already starts with the brand.
    title: { absolute: m.home.meta.title },
    description: m.home.meta.description,
    alternates: { canonical: path, languages: languageAlternates("home") },
    openGraph: {
      title: m.home.meta.title,
      description: m.home.meta.ogDescription,
      url: path,
      type: "website",
      images: ["/opengraph-image"],
      ...(code === "en" ? {} : { locale: getLocale(code).og }),
    },
  };
}

export function featureMetadata(code: string, m: Messages, feature: FeatureSlug): Metadata {
  const { title, description } = m.featurePages[feature].meta;
  const path = pagePath(code, feature);
  return {
    title,
    description,
    alternates: { canonical: path, languages: languageAlternates(feature) },
    openGraph: {
      // The root layout's title template appends " | Captio AI" to the page
      // title only, so Open Graph spells it out.
      title: `${title} | Captio AI`,
      description,
      url: path,
      type: "website",
      images: ["/opengraph-image"],
      ...(code === "en" ? {} : { locale: getLocale(code).og }),
    },
  };
}
