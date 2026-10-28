import { features } from "@/lib/features";
import { languages } from "@/lib/languages";
import { useCases } from "@/lib/useCases";
import { getAllPosts } from "@/lib/blog";
import { getAllComparePages } from "@/lib/compare";
import { FEATURED_ON } from "@/lib/press";
import { APP_STORE_URL, GOOGLE_PLAY_URL, SITE_URL } from "@/lib/schema";

// /llms.txt: a plain-text map of the site for AI assistants and their crawlers
// (format: https://llmstxt.org). Built from the same data as the pages, so new
// blog articles appear here the day they are published.
export const dynamic = "force-static";

export function GET() {
  const posts = getAllPosts();
  const comparePages = getAllComparePages();
  const lines = [
    "# Captio AI",
    "",
    "> Captio AI is a live captioning app for deaf and hard of hearing people. It shows what people around you say as text on your phone while they are still speaking, translates conversations live, transcribes audio and video files, and turns transcripts into summaries, key points and to-dos. 60+ languages. iPhone and Android.",
    "",
    "Key facts:",
    "- Made for in-person speech picked up by the phone's microphone: conversations, doctor's appointments, lectures, meetings, dinners, travel.",
    "- Labels speakers, handles accents and mid-sentence language switches, and lets you add your own words and names.",
    "- Free plan with 100 free credits a day; Captio AI Plus removes the limit.",
    "- Audio is processed in real time and not stored on Captio AI's servers; content is never sold or used to train AI models.",
    `- iPhone: ${APP_STORE_URL}`,
    `- Android: ${GOOGLE_PLAY_URL}`,
    "",
    "## Features",
    ...features.map((f) => `- [${f.label}](${SITE_URL}/${f.slug}): ${f.description}`),
    "",
    "## Use cases",
    ...useCases.map((uc) => `- [${uc.label}](${SITE_URL}/use-cases/${uc.slug})`),
    "",
    "## Blog",
    `- [All articles](${SITE_URL}/blog): data, comparisons and guides about hearing loss and captions, every number sourced.`,
    ...posts.map((p) => `- [${p.title}](${SITE_URL}/blog/${p.slug}): ${p.answer}`),
    "",
    "## Compare",
    `- [Caption apps compared](${SITE_URL}/compare): caption, translation and phone-call caption apps for deaf and hard of hearing people side by side, every fact linked to the company's own page.`,
    ...comparePages.map((p) => `- [${p.title}](${SITE_URL}/compare/${p.slug}): ${p.answer}`),
    "",
    "## Coverage",
    `- [${FEATURED_ON.title}](${FEATURED_ON.url}): ${FEATURED_ON.name}, Assistive Technology section, 27 October 2026.`,
    "",
    "## Languages",
    `Each language has its own page about dialects and accents, e.g. ${SITE_URL}/${languages[0].languageSlug}, and pages per use case, e.g. ${SITE_URL}/use-cases/${useCases[0].slug}/${languages[0].languageSlug}.`,
    languages.map((l) => `[${l.language}](${SITE_URL}/${l.languageSlug})`).join(", "),
    "",
    "## Optional",
    `- [Privacy Policy](${SITE_URL}/privacy)`,
    `- [Terms of Service](${SITE_URL}/terms)`,
    `- [Sitemap](${SITE_URL}/sitemap.xml)`,
    `- [Blog RSS](${SITE_URL}/blog/rss.xml)`,
    "",
  ];

  return new Response(lines.join("\n"), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
