// Blog posts live as Markdown files in content/blog/posts/<slug>.md, with YAML
// frontmatter for the structured parts (short answer, key facts, FAQ, sources).
// Everything is read at build time; every post page is statically generated.
//
// A post that breaks the shape below fails the build on purpose: Vercel then
// keeps serving the last good deploy instead of shipping a broken page.

import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { Marked, Renderer, type Tokens } from "marked";
import { SITE_URL } from "@/lib/schema";

const POSTS_DIR = path.join(process.cwd(), "content/blog/posts");

export const CATEGORIES = {
  comparisons: {
    label: "Comparisons",
    description: "Side-by-side looks at caption apps, hearing tech and access services, with the facts that tell them apart.",
  },
  data: {
    label: "Data & statistics",
    description: "Hearing loss, deafness and accessibility in numbers, every figure linked to its source.",
  },
  guides: {
    label: "Guides",
    description: "Step-by-step help for following conversations, appointments, lectures and meetings with hearing loss.",
  },
  explainers: {
    label: "Explainers",
    description: "Plain answers to the terms and technology behind captions, transcription and hearing access.",
  },
} as const;

export type CategorySlug = keyof typeof CATEGORIES;

export const AUTHORS = {
  nate: {
    name: "Nate",
    byline: "Nate from Captio AI",
    role: "Captio AI",
    url: `${SITE_URL}/blog/author/nate`,
    type: "Person" as const,
    bio: "Nate writes the Captio AI blog: data, comparisons and guides about hearing loss, captions and access for deaf and hard of hearing people.",
  },
} as const;

export type AuthorKey = keyof typeof AUTHORS;

export type KeyFact = { value: string; label: string; source?: number };
export type Faq = { q: string; a: string };
export type Source = { title: string; publisher: string; url: string; year?: string };
export type TocItem = { id: string; text: string };

export type BlogPost = {
  slug: string;
  title: string;
  description: string;
  category: CategorySlug;
  published: string; // YYYY-MM-DD
  updated: string; // YYYY-MM-DD
  author: AuthorKey;
  answer: string;
  keyFacts: KeyFact[];
  faqs: Faq[];
  sources: Source[];
  tags: string[];
  draft: boolean;
  html: string;
  toc: TocItem[];
  words: number;
  readingMinutes: number;
};

// ── Parsing ────────────────────────────────────────────────────────────────

function fail(slug: string, msg: string): never {
  throw new Error(`[blog] ${slug}.md: ${msg}`);
}

// YAML turns unquoted 2026-10-21 into a Date; accept both and keep a plain day.
function toDay(value: unknown, slug: string, field: string): string {
  if (value instanceof Date) return value.toISOString().slice(0, 10);
  if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value)) return value;
  fail(slug, `"${field}" must be a date like 2026-10-21`);
}

function requireString(data: Record<string, unknown>, field: string, slug: string): string {
  const v = data[field];
  if (typeof v !== "string" || !v.trim()) fail(slug, `missing "${field}"`);
  return v.trim();
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/<sup[\s\S]*?<\/sup>/g, "")
    .replace(/<[^>]+>/g, "")
    .replace(/&[a-z]+;/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .slice(0, 60);
}

function escapeAttr(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");
}

/** Hands out heading ids in document order, numbering repeats ("x", "x-2"). */
function idMaker() {
  const ids = new Set<string>();
  return (text: string): string => {
    const base = slugify(text) || "section";
    let id = base;
    for (let n = 2; ids.has(id); n++) id = `${base}-${n}`;
    ids.add(id);
    return id;
  };
}

/** Renderer overrides: anchored h2/h3, scrollable tables, external links in a new tab. */
function blogRenderer(nextId: (text: string) => string) {
  return {
    heading(this: Renderer, token: Tokens.Heading): string {
      const inner = this.parser.parseInline(token.tokens);
      if (token.depth === 2 || token.depth === 3) {
        return `<h${token.depth} id="${nextId(token.text)}">${inner}</h${token.depth}>\n`;
      }
      return `<h${token.depth}>${inner}</h${token.depth}>\n`;
    },
    table(this: Renderer, token: Tokens.Table): string {
      return `<div class="table-wrap">${Renderer.prototype.table.call(this, token)}</div>\n`;
    },
    link(this: Renderer, token: Tokens.Link): string {
      const inner = this.parser.parseInline(token.tokens);
      const external = /^https?:\/\//.test(token.href) && !token.href.startsWith(SITE_URL);
      const attrs = external ? ' target="_blank" rel="noopener"' : "";
      return `<a href="${escapeAttr(token.href)}"${attrs}>${inner}</a>`;
    },
  };
}

// "five [2]." in the body becomes "five²." with the 2 linking to source 2 at
// the bottom (the space before the marker is dropped). Markdown links
// ("[text](url)") and footnote-like "[2]:" are left alone.
function linkCitations(markdown: string, sourceCount: number, slug: string): string {
  return markdown.replace(/[ \t]?\[(\d{1,2})\](?![(:])/g, (_, n: string) => {
    const i = Number(n);
    if (i < 1 || i > sourceCount) fail(slug, `body cites [${i}] but there are ${sourceCount} sources`);
    return `<sup class="cite"><a href="#source-${i}" aria-label="Source ${i}">${i}</a></sup>`;
  });
}

function renderBody(markdown: string, sourceCount: number, slug: string) {
  const marked = new Marked({ gfm: true });
  marked.use({ renderer: blogRenderer(idMaker()) });
  const withCites = linkCitations(markdown, sourceCount, slug);
  const tokens = marked.lexer(withCites);

  // Table of contents from the h2s, using the same ids the renderer will give
  // them (a second id sequence over the same headings gives the same ids).
  const tocId = idMaker();
  const toc: TocItem[] = [];
  for (const t of tokens) {
    if (t.type === "heading" && (t.depth === 2 || t.depth === 3)) {
      const id = tocId(t.text);
      const text = t.text
        .replace(/<sup[\s\S]*?<\/sup>/g, "")
        .replace(/<[^>]+>/g, "")
        .replace(/\*\*|__|`/g, "")
        .trim();
      if (t.depth === 2) toc.push({ id, text });
    }
  }

  const html = marked.parser(tokens);
  return { html, toc };
}

function parsePost(file: string): BlogPost {
  const slug = file.replace(/\.md$/, "");
  if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(slug)) fail(slug, "file name must be a lowercase-hyphenated slug");

  const raw = fs.readFileSync(path.join(POSTS_DIR, file), "utf8");
  const { data, content } = matter(raw);

  const category = requireString(data, "category", slug);
  if (!(category in CATEGORIES)) fail(slug, `unknown category "${category}" (use ${Object.keys(CATEGORIES).join(", ")})`);

  const author = (data.author ?? "nate") as string;
  if (!(author in AUTHORS)) fail(slug, `unknown author "${author}"`);

  const sources: Source[] = Array.isArray(data.sources) ? data.sources : [];
  if (sources.length === 0) fail(slug, "needs at least one source");
  sources.forEach((s, i) => {
    if (!s?.title || !s?.publisher || !/^https?:\/\//.test(s?.url ?? "")) {
      fail(slug, `source ${i + 1} needs title, publisher and an http(s) url`);
    }
    if (s.year !== undefined) s.year = String(s.year);
  });

  const faqs: Faq[] = Array.isArray(data.faqs) ? data.faqs : [];
  faqs.forEach((f, i) => {
    if (!f?.q || !f?.a) fail(slug, `faq ${i + 1} needs q and a`);
  });

  const keyFacts: KeyFact[] = Array.isArray(data.keyFacts) ? data.keyFacts : [];
  keyFacts.forEach((k, i) => {
    if (!k?.value || !k?.label) fail(slug, `key fact ${i + 1} needs value and label`);
    if (k.source !== undefined && (k.source < 1 || k.source > sources.length)) {
      fail(slug, `key fact ${i + 1} points to source ${k.source}, which does not exist`);
    }
  });

  const { html, toc } = renderBody(content, sources.length, slug);
  const words = content.split(/\s+/).filter(Boolean).length;

  return {
    slug,
    title: requireString(data, "title", slug),
    description: requireString(data, "description", slug),
    category: category as CategorySlug,
    published: toDay(data.published, slug, "published"),
    updated: toDay(data.updated ?? data.published, slug, "updated"),
    author: author as AuthorKey,
    answer: requireString(data, "answer", slug),
    keyFacts,
    faqs,
    sources,
    tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
    draft: data.draft === true,
    html,
    toc,
    words,
    readingMinutes: Math.max(1, Math.round(words / 230)),
  };
}

// ── Queries ────────────────────────────────────────────────────────────────

let cache: BlogPost[] | null = null;

/** Published posts, newest first. Drafts only show on the dev server. */
export function getAllPosts(): BlogPost[] {
  if (!cache || process.env.NODE_ENV === "development") {
    const files = fs.existsSync(POSTS_DIR)
      ? fs.readdirSync(POSTS_DIR).filter((f) => f.endsWith(".md"))
      : [];
    cache = files
      .map(parsePost)
      .filter((p) => !p.draft || process.env.NODE_ENV === "development")
      .sort((a, b) => b.published.localeCompare(a.published) || a.title.localeCompare(b.title));
  }
  return cache;
}

export function getPost(slug: string): BlogPost | undefined {
  return getAllPosts().find((p) => p.slug === slug);
}

export function getPostsByAuthor(author: AuthorKey): BlogPost[] {
  return getAllPosts().filter((p) => p.author === author);
}

export function getPostsByCategory(category: CategorySlug): BlogPost[] {
  return getAllPosts().filter((p) => p.category === category);
}

/** Same category first, then the newest of the rest. */
export function getRelatedPosts(post: BlogPost, count = 3): BlogPost[] {
  const others = getAllPosts().filter((p) => p.slug !== post.slug);
  const same = others.filter((p) => p.category === post.category);
  const rest = others.filter((p) => p.category !== post.category);
  return [...same, ...rest].slice(0, count);
}

/** "21 October 2026" */
export function formatDay(day: string): string {
  return new Date(`${day}T12:00:00Z`).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}
