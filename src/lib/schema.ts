// Centralised schema.org / JSON-LD builders.
// One source of truth for structured data across every page. Consumers merge
// all JSON-LD on a page by @id, so page-level nodes can reference the global
// Organization and WebSite defined in the root layout.

export const SITE_URL = "https://captioai.app";

const ORG_ID = `${SITE_URL}/#organization`;
const SITE_ID = `${SITE_URL}/#website`;

/** Global publisher entity. Rendered once, in the root layout. */
export const organizationSchema = {
  "@type": "Organization",
  "@id": ORG_ID,
  name: "Captio AI",
  url: SITE_URL,
  logo: {
    "@type": "ImageObject",
    url: `${SITE_URL}/logo_image_profile.png`,
  },
  description:
    "Captio AI is an iOS live captioning, translation, and transcription app for deaf and hard of hearing people, supporting 60+ languages.",
  // sameAs: add social + App Store URLs here once they exist.
};

/** Global website entity. Rendered once, in the root layout. */
export const websiteSchema = {
  "@type": "WebSite",
  "@id": SITE_ID,
  name: "Captio AI",
  url: SITE_URL,
  inLanguage: "en",
  publisher: { "@id": ORG_ID },
};

/** The four product features, referenced as SoftwareApplication.featureList. */
export const FEATURE_LIST = [
  "Live Captions",
  "Live Translator",
  "Audio Transcription",
  "AI Summary",
];

/** Build a SoftwareApplication node for a page. */
export function softwareApplicationSchema(opts: {
  url: string;
  description: string;
  inLanguage?: string;
}) {
  return {
    "@type": "SoftwareApplication",
    name: "Captio AI",
    applicationCategory: "AccessibilityApplication",
    operatingSystem: "iOS",
    description: opts.description,
    url: opts.url,
    featureList: FEATURE_LIST,
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    publisher: { "@id": ORG_ID },
    ...(opts.inLanguage ? { inLanguage: opts.inLanguage } : {}),
  };
}

/** Build an FAQPage node from a list of Q/A pairs. */
export function faqPageSchema(faqs: { q: string; a: string }[]) {
  return {
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.q,
      acceptedAnswer: { "@type": "Answer", text: faq.a },
    })),
  };
}

/** Build a BreadcrumbList node. Pass items in order, root first. */
export function breadcrumbSchema(items: { name: string; path: string }[]) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: `${SITE_URL}${item.path}`,
    })),
  };
}

/** Wrap one or more nodes into a single @graph document for a <script> tag. */
export function jsonLd(...nodes: object[]) {
  return {
    "@context": "https://schema.org",
    "@graph": nodes,
  };
}
