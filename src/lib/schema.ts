// Centralised schema.org / JSON-LD builders.
// One source of truth for structured data across every page. Consumers merge
// all JSON-LD on a page by @id, so page-level nodes can reference the global
// Organization and WebSite defined in the root layout.

import en from "@/i18n/messages/en.json";

export const SITE_URL = "https://captioai.app";

const ORG_ID = `${SITE_URL}/#organization`;
const SITE_ID = `${SITE_URL}/#website`;

/** Canonical (storefront-neutral) App Store listing for the iOS app. */
export const APP_STORE_URL = "https://apps.apple.com/app/captio-ai/id6796617180";

/** Google Play listing for the Android app. */
export const GOOGLE_PLAY_URL = "https://play.google.com/store/apps/details?id=com.captio.app";

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
    "Captio AI is an iPhone and Android live captioning, translation, and transcription app for deaf and hard of hearing people, supporting 60+ languages.",
  // sameAs: add the organisation's own social profiles here once they exist.
  // (The store listings are linked from SoftwareApplication, not here — the
  // store lists the developer as a person, so it is not the same entity.)
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

/** The product features, referenced as SoftwareApplication.featureList. */
export const FEATURE_LIST = [
  "Live Captions",
  "Live Translator",
  "Audio Transcription",
  "AI Summary",
  "AI Actions: key points, notes, to-dos, questions and answers, follow-up message",
  "Export as text, link, PDF, email or AI chat prompt",
  "Folders and shared folders",
  "Recognize Voices",
  "Speaker Direction",
  "Connectors for Claude, ChatGPT, Gemini and Perplexity",
  "Home Screen and Lock Screen widgets",
];

/**
 * Pictures of the app made for the web (public/screenshots, 1200 × 1600, made
 * by scripts/app-images.sh): the real app screen in an iPhone, the Captio AI
 * name and one headline, nothing on top of the screen. They are the app's
 * `image` and `screenshot` on every page, so search engines and AI assistants
 * show Captio AI's own screens instead of picking another app's picture. Their
 * descriptions are `home.screenshots` in the messages, so translated pages
 * describe them in their own language.
 */
export const APP_SCREENSHOTS = [
  "/screenshots/captio-ai-live-captions.jpg",
  "/screenshots/captio-ai-live-translation.jpg",
  "/screenshots/captio-ai-ai-summary.jpg",
];
export const SCREENSHOT_SIZE = { width: 1200, height: 1600 };

function screenshotImages(captions: string[]) {
  return APP_SCREENSHOTS.map((path, i) => ({
    "@type": "ImageObject",
    url: `${SITE_URL}${path}`,
    contentUrl: `${SITE_URL}${path}`,
    width: SCREENSHOT_SIZE.width,
    height: SCREENSHOT_SIZE.height,
    caption: captions[i],
  }));
}

/** Build a SoftwareApplication node for a page. */
export function softwareApplicationSchema(opts: {
  url: string;
  description: string;
  inLanguage?: string;
  /** The feature names in the page's language (translated pages). */
  featureList?: string[];
  /** The screenshot descriptions in the page's language (translated pages). */
  screenshotCaptions?: string[];
}) {
  const screenshots = screenshotImages(opts.screenshotCaptions ?? en.home.screenshots);
  return {
    "@type": "SoftwareApplication",
    name: "Captio AI",
    alternateName: "Captio AI - Live Captions",
    // Google only recognises its fixed category list; UtilitiesApplication is
    // also the App Store's category. Accessibility goes in the subcategory.
    applicationCategory: "UtilitiesApplication",
    applicationSubCategory: "Accessibility",
    operatingSystem: "iOS, Android",
    description: opts.description,
    url: opts.url,
    downloadUrl: [APP_STORE_URL, GOOGLE_PLAY_URL],
    installUrl: [APP_STORE_URL, GOOGLE_PLAY_URL],
    sameAs: [APP_STORE_URL, GOOGLE_PLAY_URL],
    featureList: opts.featureList ?? FEATURE_LIST,
    image: screenshots[0],
    screenshot: screenshots,
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

/** Build a BlogPosting node for a blog post. Sources become `citation`s. */
export function blogPostingSchema(opts: {
  url: string;
  headline: string;
  description: string;
  datePublished: string;
  dateModified: string;
  author: { name: string; url: string; type: "Organization" | "Person" };
  section: string;
  keywords: string[];
  wordCount: number;
  image: string;
  citations: { title: string; url: string; publisher: string }[];
}) {
  const author =
    opts.author.type === "Organization" && opts.author.url === SITE_URL
      ? { "@id": ORG_ID }
      : {
          "@type": opts.author.type,
          "@id": `${opts.author.url}#person`,
          name: opts.author.name,
          url: opts.author.url,
          ...(opts.author.type === "Person" ? { worksFor: { "@id": ORG_ID } } : {}),
        };
  return {
    "@type": "BlogPosting",
    "@id": `${opts.url}#article`,
    headline: opts.headline,
    description: opts.description,
    url: opts.url,
    mainEntityOfPage: opts.url,
    datePublished: opts.datePublished,
    dateModified: opts.dateModified,
    author,
    publisher: { "@id": ORG_ID },
    isPartOf: { "@id": SITE_ID },
    inLanguage: "en",
    articleSection: opts.section,
    keywords: opts.keywords.join(", "),
    wordCount: opts.wordCount,
    image: opts.image,
    citation: opts.citations.map((c) => ({
      "@type": "CreativeWork",
      name: c.title,
      url: c.url,
      publisher: { "@type": "Organization", name: c.publisher },
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
