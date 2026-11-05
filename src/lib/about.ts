// The /about page: Captio AI on its own, in facts with their sources, for
// people and answer engines asking "what is Captio AI", "what does it cost",
// "who makes it". Also served as plain Markdown at /about.md.
//
// Read at build time:
//   content/compare/apps/captio-ai.json   the facts, strengths and limits: the
//                                         same ones the compare pages show, so
//                                         a fact changes in one place
//   content/about.md                      the short answer, which facts go in
//                                         which group, the other apps for the
//                                         jobs Captio AI doesn't do, apps with
//                                         similar names, the FAQ
//
// A file that breaks the shape below fails the build on purpose (like the
// blog and the compare pages).

import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import type { Faq } from "@/lib/blog";
import {
  Collector,
  ROWS,
  buildTable,
  comparePageFor,
  getAllApps,
  getApp,
  resolve,
  resolveRefs,
  type CompareApp,
  type FactKey,
  type Src,
  type TableRow,
} from "@/lib/compare";

const FILE = "content/about.md";
const DAY = /^\d{4}-\d{2}-\d{2}$/;

export type FactGroup = { id: string; title: string; intro: string; rows: TableRow[] };
export type OtherApp = { title: string; app: CompareApp; text: string; sources: Src[]; compareHref?: string };
export type SimilarName = { name: string; by?: string; what: string; url: string; checked: string };
export type SourcedText = { text: string; sources: Src[] };

export type AboutPage = {
  title: string;
  description: string;
  updated: string;
  answer: string;
  app: CompareApp;
  groups: FactGroup[];
  strengths: SourcedText[];
  limits: SourcedText[];
  otherApps: OtherApp[];
  similarNames: SimilarName[];
  faqs: Faq[];
  /** Every source the page cites, grouped by app, Captio AI first. */
  sources: { app: CompareApp; sources: Src[] }[];
  /** Oldest "checked" date of Captio AI's facts. */
  factsChecked: string;
};

function fail(msg: string): never {
  throw new Error(`[about] ${FILE}: ${msg}`);
}

function str(v: unknown, field: string): string {
  if (typeof v !== "string" || !v.trim()) fail(`missing "${field}"`);
  return v.trim();
}

function day(v: unknown, field: string): string {
  if (v instanceof Date) return v.toISOString().slice(0, 10);
  if (typeof v === "string" && DAY.test(v)) return v;
  fail(`"${field}" must be a date like 2026-11-04`);
}

let cache: AboutPage | null = null;

export function getAboutPage(): AboutPage {
  if (cache && process.env.NODE_ENV !== "development") return cache;

  const { data } = matter(fs.readFileSync(path.join(process.cwd(), FILE), "utf8"));
  const app = getApp("captio-ai") ?? fail("content/compare/apps/captio-ai.json is missing");
  const apps = getAllApps();
  const collect = new Collector();
  const refs = (list: unknown, where: string) => resolveRefs(list, apps, collect, FILE, where);

  // Every one of Captio AI's facts, each in exactly one group.
  const seen = new Set<FactKey>();
  const groups: FactGroup[] = (Array.isArray(data.groups) ? data.groups : []).map(
    (g: { title?: string; intro?: string; rows?: unknown }, i: number) => {
      if (!g?.title || !Array.isArray(g.rows) || g.rows.length === 0) fail(`group ${i + 1} needs title and rows`);
      for (const r of g.rows) {
        if (!(r in ROWS)) fail(`group ${i + 1}: unknown row "${r}"`);
        if (seen.has(r)) fail(`row "${r}" is in two groups`);
        seen.add(r);
      }
      return {
        id: g.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""),
        title: g.title,
        intro: g.intro ?? "",
        rows: buildTable([app], g.rows as FactKey[], collect),
      };
    },
  );
  const missing = (Object.keys(ROWS) as FactKey[]).filter((k) => !seen.has(k));
  if (missing.length > 0) fail(`these facts are in no group: ${missing.join(", ")}`);

  const claims = (list: CompareApp["strengths"]) => list.map((c) => ({ text: c.text, sources: collect.add(app, resolve(app, c.sources)) }));

  const otherApps: OtherApp[] = (Array.isArray(data.otherApps) ? data.otherApps : []).map(
    (o: { title?: string; app?: string; text?: string; sources?: unknown }, i: number) => {
      if (!o?.title || !o?.text) fail(`otherApps ${i + 1} needs title and text`);
      const other = getApp(String(o.app)) ?? fail(`otherApps ${i + 1}: unknown app "${o.app}"`);
      if (other.slug === "captio-ai") fail(`otherApps ${i + 1} must be another app`);
      const page = comparePageFor(other);
      return { title: o.title, app: other, text: o.text, sources: refs(o.sources, `otherApps ${i + 1}`), compareHref: page ? `/compare/${page.slug}` : undefined };
    },
  );
  if (otherApps.length === 0) fail("needs otherApps: the page must say when another app is the better choice");

  const similarNames: SimilarName[] = (Array.isArray(data.similarNames) ? data.similarNames : []).map(
    (s: { name?: string; by?: string; what?: string; url?: string; quote?: string; checked?: unknown }, i: number) => {
      if (!s?.name || !s?.what) fail(`similarNames ${i + 1} needs name and what`);
      if (!/^https:\/\//.test(s.url ?? "")) fail(`similarNames ${i + 1} needs an https url (its own page)`);
      if (!s.quote) fail(`similarNames ${i + 1} needs the quote from that page that says what it is`);
      return { name: s.name, by: s.by || undefined, what: s.what, url: s.url!, checked: day(s.checked, `similarNames ${i + 1} checked`) };
    },
  );

  const faqs: Faq[] = Array.isArray(data.faqs) ? data.faqs : [];
  if (faqs.length === 0) fail("needs faqs");
  faqs.forEach((f, i) => {
    if (!f?.q || !f?.a) fail(`faq ${i + 1} needs q and a`);
  });

  // By slug: on the dev server every getApp() reads the file again, so the same app can be two objects.
  const others = [...new Map(otherApps.map((o) => [o.app.slug, o.app])).values()];
  cache = {
    title: str(data.title, "title"),
    description: str(data.description, "description"),
    updated: day(data.updated, "updated"),
    answer: str(data.answer, "answer"),
    app,
    groups,
    strengths: claims(app.strengths),
    limits: claims(app.limits),
    otherApps,
    similarNames,
    faqs,
    sources: collect.grouped([app, ...others]),
    factsChecked: app.checked,
  };
  return cache;
}
