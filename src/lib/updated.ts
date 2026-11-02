// When each group of pages last changed in a way worth telling search engines
// about. The sitemap's <lastmod>, the "Reviewed" line on the landing pages and
// the WebPage dateModified in their JSON-LD all read the same date here, so
// they never disagree. Bump a group's date when its content meaningfully
// changes; never stamp the build time (engines learn to ignore a date that
// moves with every deploy).
export const UPDATED = {
  core: "2026-11-02", // homepage, feature pages
  languages: "2026-11-02", // /[language]
  useCases: "2026-11-02", // /use-cases/[slug] and /use-cases/[slug]/[language]
  hubs: "2026-11-02", // /use-cases, /languages
  privacy: "2026-10-07",
  terms: "2026-10-07",
  organizations: "2026-11-02",
  translations: "2026-11-02", // /<code> and /<code>/<feature>
  moreFeatures: "2026-11-02", // /ai-actions, /export, /folders, /recognize-voices, /speaker-direction, /recognize-sounds, /connectors, /widgets
} as const;

/** "October 2026" */
export function formatMonth(day: string): string {
  return new Date(`${day}T12:00:00Z`).toLocaleDateString("en-GB", { month: "long", year: "numeric", timeZone: "UTC" });
}
