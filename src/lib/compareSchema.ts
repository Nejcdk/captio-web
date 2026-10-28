// JSON-LD for the Compare section. Kept apart from schema.ts because it needs
// the compare data types.
//
// Other companies' apps are described as plain ListItems (name + their own
// website), never as SoftwareApplication or Product: those types ask Google
// for rich results that need prices and ratings, and we neither own nor keep
// those numbers for other companies. No aggregateRating or Review, ever.

import type { CompareApp, ComparePage } from "@/lib/compare";
import { SITE_URL } from "@/lib/schema";

const ORG_ID = `${SITE_URL}/#organization`;
const SITE_ID = `${SITE_URL}/#website`;

export function compareItemListSchema(apps: CompareApp[], id: string, name: string) {
  return {
    "@type": "ItemList",
    "@id": id,
    name,
    numberOfItems: apps.length,
    itemListElement: apps.map((app, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: app.name,
      url: app.website,
    })),
  };
}

export function compareArticleSchema(page: ComparePage, url: string) {
  return {
    "@type": "Article",
    "@id": `${url}#article`,
    headline: page.title,
    description: page.description,
    url,
    mainEntityOfPage: url,
    datePublished: page.published,
    dateModified: page.updated,
    author: { "@id": ORG_ID },
    publisher: { "@id": ORG_ID },
    isPartOf: { "@id": SITE_ID },
    inLanguage: "en",
    articleSection: "Compare",
    keywords: page.tags.join(", "),
    image: `${url}/opengraph-image`,
    about: { "@id": `${url}#apps` },
    mentions: page.apps.map((app) => ({ "@type": "Thing", name: app.name, url: app.website })),
    citation: page.sources.flatMap((g) => g.sources).map((s) => ({
      "@type": "CreativeWork",
      name: s.title,
      url: s.url,
      publisher: { "@type": "Organization", name: s.publisher },
    })),
  };
}
