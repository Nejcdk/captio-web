import { getAboutPage } from "@/lib/about";
import { formatDay } from "@/lib/blog";
import type { Src } from "@/lib/compare";
import { APP_STORE_URL, GOOGLE_PLAY_URL, SITE_URL } from "@/lib/schema";

// /about.md: the /about page as plain Markdown, for AI assistants and their
// crawlers (linked from /llms.txt). Built from the same data as the page, so
// the two never disagree.
export const dynamic = "force-static";

const links = (sources: Src[]) => sources.map((s) => `[${s.label}](${s.url})`).join(", ");

export function GET() {
  const page = getAboutPage();
  const lines = [
    `# ${page.title}`,
    "",
    `> ${page.answer}`,
    "",
    `Last updated ${formatDay(page.updated)}. Facts checked ${formatDay(page.factsChecked)}, each on the page it comes from. Web page: ${SITE_URL}/about`,
    "",
    `- iPhone and iPad: ${APP_STORE_URL}`,
    `- Android: ${GOOGLE_PLAY_URL}`,
    "",
    "## Captio AI, fact by fact",
    "",
    ...page.groups.flatMap((g) => [
      `### ${g.title}`,
      "",
      ...g.rows.map((row) => {
        const { fact, sources } = row.cells[0];
        const text = /[.!?]$/.test(fact.text) ? fact.text : `${fact.text}.`;
        const detail = fact.detail ? ` ${fact.detail}` : "";
        return `- **${row.label}:** ${text}${detail} (${links(sources)})`;
      }),
      "",
    ]),
    "## What Captio AI does well",
    "",
    ...page.strengths.map((s) => `- ${s.text} (${links(s.sources)})`),
    "",
    "## Its limits",
    "",
    ...page.limits.map((s) => `- ${s.text} (${links(s.sources)})`),
    "",
    "## When another app is the better choice",
    "",
    ...page.otherApps.map((o) => {
      const compare = o.compareHref ? ` Comparison: ${SITE_URL}${o.compareHref}` : "";
      return `- **${o.title}: ${o.app.shortName}.** ${o.text} (${links(o.sources)})${compare}`;
    }),
    "",
    "## Apps with similar names",
    "",
    "Captio AI is not related to these:",
    "",
    ...page.similarNames.map((s) => `- **${s.name}**${s.by ? ` (${s.by})` : ""}: ${s.what} (${s.url}, checked ${formatDay(s.checked)})`),
    "",
    "## Who makes Captio AI",
    "",
    `${page.maker.text} (${links(page.maker.sources)})`,
    "",
    "Contact: hello@captioai.app",
    "",
    "## Frequently asked questions",
    "",
    ...page.faqs.flatMap((f) => [`### ${f.q}`, "", f.a, ""]),
    "## Sources",
    "",
    ...page.sources.flatMap(({ app, sources }) => [
      `### ${app.shortName}`,
      "",
      ...sources.map((s) => `- [${s.title}](${s.url}), ${s.publisher}, checked ${formatDay(s.checked)}`),
      "",
    ]),
  ];

  return new Response(lines.join("\n"), {
    headers: { "Content-Type": "text/markdown; charset=utf-8" },
  });
}
