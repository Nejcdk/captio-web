import { CATEGORIES, getAllPosts } from "@/lib/blog";
import { SITE_URL } from "@/lib/schema";

// RSS feed of the blog, built at deploy time. Feed readers and some AI search
// crawlers pick up new articles from here faster than from the sitemap.
export const dynamic = "force-static";

function esc(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

export function GET() {
  const posts = getAllPosts().slice(0, 50);
  const items = posts
    .map((p) => {
      const url = `${SITE_URL}/blog/${p.slug}`;
      return `    <item>
      <title>${esc(p.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <pubDate>${new Date(`${p.published}T08:00:00Z`).toUTCString()}</pubDate>
      <category>${esc(CATEGORIES[p.category].label)}</category>
      <description>${esc(p.answer)}</description>
    </item>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Captio AI Blog</title>
    <link>${SITE_URL}/blog</link>
    <description>Data, comparisons and guides about hearing loss, live captions and accessibility.</description>
    <language>en</language>
    <atom:link href="${SITE_URL}/blog/rss.xml" rel="self" type="application/rss+xml" />
${posts[0] ? `    <lastBuildDate>${new Date(`${posts[0].updated}T08:00:00Z`).toUTCString()}</lastBuildDate>\n` : ""}${items}
  </channel>
</rss>
`;

  return new Response(xml, {
    headers: { "Content-Type": "application/rss+xml; charset=utf-8" },
  });
}
