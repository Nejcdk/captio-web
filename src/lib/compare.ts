// The Compare section (/compare): caption and accessibility apps for deaf and
// hard of hearing people, side by side, every fact linked to the page it came
// from.
//
// Read at build time:
//   content/compare/apps/<slug>.json   one app: every fact, each with its sources
//   content/compare/pages/<slug>.md    one comparison page (frontmatter only):
//                                      apps, rows, verdict, differences, where
//                                      each one is better, situations, FAQs
//   content/compare/index.md           the /compare landing page
// Rules for all three are in content/compare/README.md.
//
// A file that breaks the shape below fails the build on purpose (like the
// blog): Vercel then keeps serving the last good deploy.

import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import type { Faq } from "@/lib/blog";

const APPS_DIR = path.join(process.cwd(), "content/compare/apps");
const PAGES_DIR = path.join(process.cwd(), "content/compare/pages");
const HUB_FILE = path.join(process.cwd(), "content/compare/index.md");

// ── Rows: what we compare ──────────────────────────────────────────────────
// Every app file has every key. A page picks the rows it shows, in its order.
// `why` is shown under the row name: why it matters to a deaf or hard of
// hearing reader.

export const ROWS = {
  platforms: { label: "Works on", why: "The phone you already have decides what you can use." },
  deviceRequirements: { label: "Needs", why: "Older phones are often left out of built-in features." },
  roomCaptions: { label: "Captions people in the room", why: "Speech picked up by the phone's microphone, for face-to-face conversations." },
  groupConversations: { label: "Group conversations", why: "At a table or in a meeting, voices come from every side." },
  languages: { label: "Languages for live captions", why: "The number of spoken languages it can caption live." },
  offline: { label: "Live captions without internet", why: "Planes, basements, hospitals and trips abroad often have no signal." },
  speakerLabels: { label: "Shows who is talking", why: "Without it, a group conversation is one block of text." },
  translation: { label: "Live translation", why: "For a conversation in a language you don't read." },
  saveTranscripts: { label: "Saves transcripts", why: "To read a lecture, appointment or meeting again later." },
  export: { label: "Export and share", why: "To send notes to yourself, a carer or a colleague." },
  fileUpload: { label: "Transcribes audio and video files", why: "For recordings and videos that have no captions." },
  summaries: { label: "AI summaries", why: "Key points and to-dos from a long transcript." },
  customWords: { label: "Add your own words and names", why: "Names, medicines and jargon are the words captions miss most." },
  display: { label: "Text size and colours", why: "Captions have to be readable at arm's length, flat on a table." },
  soundAlerts: { label: "Alerts for sounds", why: "Doorbells, alarms and a baby crying, as a notification." },
  phoneCalls: { label: "Captions phone calls", why: "Phone calls are a separate job from conversations in the room." },
  videoCalls: { label: "Captions video calls", why: "Zoom, Teams and Meet calls on the same device." },
  mediaOnDevice: { label: "Captions videos playing on the phone", why: "Videos, podcasts and voice messages without captions." },
  humanCaptioners: { label: "Human captioners", why: "A person checking the captions, for when every word matters." },
  signLanguage: { label: "Sign language", why: "Some deaf people prefer sign language to text." },
  privacy: { label: "Where speech is processed", why: "On the phone or in the cloud, and whether audio is kept." },
  account: { label: "Account needed", why: "Some people want to open the app and start, with no sign-up." },
  availability: { label: "Where it's available", why: "Some services only work in one country." },
  freePlan: { label: "Free plan", why: "What you can do without paying." },
  price: { label: "Paid plans", why: "Prices as listed by the company, with the country and date." },
  accessibilityFunding: { label: "Free through a government programme", why: "Some services are paid for by public programmes for eligible users." },
} as const;

export type FactKey = keyof typeof ROWS;
export const FACT_KEYS = Object.keys(ROWS) as FactKey[];

export const APP_CATEGORIES = {
  "in-person-captions": { label: "Live captions for conversations in the room" },
  "built-in-captions": { label: "Captions built into the phone" },
  "meeting-transcription": { label: "Meeting transcription" },
  translation: { label: "Translation apps" },
  "smart-glasses": { label: "Captions on glasses" },
  "phone-call-captions": { label: "Phone call captions" },
} as const;

export type AppCategory = keyof typeof APP_CATEGORIES;

export const PAGE_KINDS = {
  versus: "Head to head",
  roundup: "Roundup",
  alternatives: "Alternatives",
} as const;

export type PageKind = keyof typeof PAGE_KINDS;

// ── Types ──────────────────────────────────────────────────────────────────

export type FactStatus = "yes" | "no" | "partial" | "not_stated";
export type Fact = { status: FactStatus; text: string; detail?: string; sources: string[] };
export type Claim = { text: string; sources: string[] };
export type AppSource = {
  id: string;
  title: string;
  publisher: string;
  url: string;
  type: string;
  opened: boolean;
  checked: string; // YYYY-MM-DD
  label?: string;
  quotes?: string[];
};

export type CompareApp = {
  slug: string;
  name: string;
  shortName: string;
  developer: string;
  developerCountry?: string;
  website: string;
  appStoreUrl: string | null;
  googlePlayUrl: string | null;
  category: AppCategory;
  oneLine: string;
  facts: Record<FactKey, Fact>;
  strengths: Claim[];
  limits: Claim[];
  sources: AppSource[];
  notes?: string;
  /** Oldest "checked" date among its sources. */
  checked: string;
};

/** A source as the reader sees it: a short name that links to the page. */
export type Src = { label: string; title: string; publisher: string; url: string; checked: string };

export type Cell = { app: CompareApp; fact: Fact; sources: Src[] };
export type TableRow = { key: FactKey; label: string; why: string; cells: Cell[] };
export type SourcedText = { text: string; sources: Src[] };

export const SITUATION_ICONS = [
  "doctor", "dinner", "meeting", "lecture", "travel", "home", "phone", "offline", "translate", "iphone", "android", "work", "glasses", "money", "video",
] as const;
export type SituationIcon = (typeof SITUATION_ICONS)[number];

export type Situation = { icon: SituationIcon; title: string; pick: CompareApp | "both" | "neither"; text: string; link?: string };

export type ComparePage = {
  slug: string;
  kind: PageKind;
  title: string;
  description: string;
  published: string;
  updated: string;
  answer: string;
  apps: CompareApp[];
  /** The app this page is about (the one that isn't Captio AI). */
  subject: CompareApp;
  picks: { app: CompareApp; text: string }[];
  table: TableRow[];
  differences: (SourcedText & { title: string })[];
  better: { app: CompareApp; items: SourcedText[] }[];
  situations: Situation[];
  faqs: Faq[];
  sources: { app: CompareApp; sources: Src[] }[];
  tags: string[];
  related: string[];
  draft: boolean;
  /** Oldest "checked" date of the facts on the page. */
  factsChecked: string;
};

// ── Helpers ────────────────────────────────────────────────────────────────

function fail(file: string, msg: string): never {
  throw new Error(`[compare] ${file}: ${msg}`);
}

const DAY = /^\d{4}-\d{2}-\d{2}$/;

function toDay(value: unknown, file: string, field: string): string {
  if (value instanceof Date) return value.toISOString().slice(0, 10);
  if (typeof value === "string" && DAY.test(value)) return value;
  fail(file, `"${field}" must be a date like 2026-10-28`);
}

function str(v: unknown, file: string, field: string): string {
  if (typeof v !== "string" || !v.trim()) fail(file, `missing "${field}"`);
  return v.trim();
}

// ── Apps ───────────────────────────────────────────────────────────────────

const STATUSES: FactStatus[] = ["yes", "no", "partial", "not_stated"];

function parseApp(file: string): CompareApp {
  const raw = JSON.parse(fs.readFileSync(path.join(APPS_DIR, file), "utf8"));
  const slug = str(raw.slug, file, "slug");
  if (`${slug}.json` !== file) fail(file, `slug "${slug}" must match the file name`);
  if (!(raw.category in APP_CATEGORIES)) fail(file, `unknown category "${raw.category}"`);

  const sources: AppSource[] = Array.isArray(raw.sources) ? raw.sources : [];
  if (sources.length === 0) fail(file, "needs sources");
  const ids = new Set<string>();
  for (const s of sources) {
    if (!s?.id || !s.title || !s.publisher || !/^https?:\/\//.test(s.url ?? "")) {
      fail(file, `source ${s?.id ?? "?"} needs id, title, publisher and an http(s) url`);
    }
    if (!DAY.test(s.checked ?? "")) fail(file, `source ${s.id} needs "checked" (YYYY-MM-DD)`);
    if (ids.has(s.id)) fail(file, `source id ${s.id} is used twice`);
    ids.add(s.id);
  }
  const known = (list: string[], where: string) => {
    if (!Array.isArray(list)) fail(file, `${where}: "sources" must be a list`);
    for (const id of list) if (!ids.has(id)) fail(file, `${where} cites ${id}, which is not in sources`);
  };

  const facts = {} as Record<FactKey, Fact>;
  for (const key of FACT_KEYS) {
    const f = raw.facts?.[key];
    if (!f) fail(file, `missing fact "${key}"`);
    if (!STATUSES.includes(f.status)) fail(file, `fact "${key}" has unknown status "${f.status}"`);
    if (typeof f.text !== "string" || !f.text.trim()) fail(file, `fact "${key}" needs "text"`);
    known(f.sources, `fact "${key}"`);
    if (f.status !== "not_stated" && f.sources.length === 0) fail(file, `fact "${key}" needs at least one source`);
    facts[key] = { status: f.status, text: f.text.trim(), detail: f.detail?.trim() || undefined, sources: f.sources };
  }

  const claims = (list: unknown, field: string): Claim[] => {
    if (!Array.isArray(list)) return [];
    return list.map((c, i) => {
      if (!c?.text) fail(file, `${field} ${i + 1} needs text`);
      known(c.sources, `${field} ${i + 1}`);
      if (c.sources.length === 0) fail(file, `${field} ${i + 1} needs a source`);
      return { text: c.text, sources: c.sources };
    });
  };

  return {
    slug,
    name: str(raw.name, file, "name"),
    shortName: str(raw.shortName ?? raw.name, file, "shortName"),
    developer: str(raw.developer, file, "developer"),
    developerCountry: raw.developerCountry || undefined,
    website: str(raw.website, file, "website"),
    appStoreUrl: raw.appStoreUrl || null,
    googlePlayUrl: raw.googlePlayUrl || null,
    category: raw.category,
    oneLine: str(raw.oneLine, file, "oneLine"),
    facts,
    strengths: claims(raw.strengths, "strength"),
    limits: claims(raw.limits, "limit"),
    sources,
    notes: raw.notes || undefined,
    checked: sources.map((s) => s.checked).sort()[0],
  };
}

let appCache: CompareApp[] | null = null;

/** Every app, Captio AI first, then by name. */
export function getAllApps(): CompareApp[] {
  if (!appCache || process.env.NODE_ENV === "development") {
    const files = fs.existsSync(APPS_DIR) ? fs.readdirSync(APPS_DIR).filter((f) => f.endsWith(".json")) : [];
    appCache = files
      .map(parseApp)
      .sort((a, b) => (a.slug === "captio-ai" ? -1 : b.slug === "captio-ai" ? 1 : a.name.localeCompare(b.name)));
  }
  return appCache;
}

export function getApp(slug: string): CompareApp | undefined {
  return getAllApps().find((a) => a.slug === slug);
}

// ── Sources ────────────────────────────────────────────────────────────────
// No footnote numbers: a reader sees "Google Play listing" or "Use Live
// Transcribe (Google)", and the link goes to the page. Each page also lists
// every source it used at the bottom, grouped by app.

const TYPE_LABEL: Record<string, string> = { store: "listing", privacy: "privacy policy", pricing: "pricing page" };

export function sourceLabel(s: AppSource): string {
  if (s.label) return s.label;
  if (TYPE_LABEL[s.type]) return `${s.publisher} ${TYPE_LABEL[s.type]}`;
  const short = s.title.split(/ [-|–] /)[0].trim();
  return short.length > 60 ? `${short.slice(0, 57).trimEnd()}…` : short;
}

function toSrc(s: AppSource): Src {
  return { label: sourceLabel(s), title: s.title, publisher: s.publisher, url: s.url, checked: s.checked };
}

export function resolve(app: CompareApp, ids: string[]): Src[] {
  return ids.map((id) => toSrc(app.sources.find((s) => s.id === id)!));
}

/** Collects every source a page shows, per app, without repeats. */
class Collector {
  private seen = new Map<string, Map<string, Src>>();
  add(app: CompareApp, srcs: Src[]): Src[] {
    const mine = this.seen.get(app.slug) ?? new Map<string, Src>();
    for (const s of srcs) mine.set(s.url, s);
    this.seen.set(app.slug, mine);
    return srcs;
  }
  grouped(apps: CompareApp[]) {
    return apps.map((app) => ({ app, sources: [...(this.seen.get(app.slug)?.values() ?? [])] })).filter((g) => g.sources.length > 0);
  }
}

export function buildTable(apps: CompareApp[], rows: FactKey[], collect?: Collector): TableRow[] {
  return rows.map((key) => ({
    key,
    label: ROWS[key].label,
    why: ROWS[key].why,
    cells: apps.map((app) => {
      const sources = resolve(app, app.facts[key].sources);
      collect?.add(app, sources);
      return { app, fact: app.facts[key], sources };
    }),
  }));
}

// "live-transcribe:offline" = every source behind that fact,
// "live-transcribe:s3" = that one source.
function resolveRefs(refs: unknown, apps: CompareApp[], collect: Collector, file: string, where: string): Src[] {
  if (!Array.isArray(refs) || refs.length === 0) fail(file, `${where} needs sources (like live-transcribe:offline)`);
  const out = new Map<string, Src>();
  for (const ref of refs) {
    const [slug, part] = String(ref).split(":");
    const app = apps.find((a) => a.slug === slug);
    if (!app) fail(file, `${where}: source "${ref}" names an app that isn't on this page`);
    let ids: string[];
    if (part in ROWS) ids = app.facts[part as FactKey].sources;
    else if (app.sources.some((s) => s.id === part)) ids = [part];
    else fail(file, `${where}: no fact or source "${part}" in ${slug}`);
    if (ids.length === 0) fail(file, `${where}: "${ref}" has no sources`);
    for (const s of collect.add(app, resolve(app, ids))) out.set(s.url, s);
  }
  return [...out.values()];
}

// ── Pages ──────────────────────────────────────────────────────────────────

function parsePage(file: string): ComparePage {
  const slug = file.replace(/\.md$/, "");
  if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(slug)) fail(file, "file name must be a lowercase-hyphenated slug");
  const { data } = matter(fs.readFileSync(path.join(PAGES_DIR, file), "utf8"));

  const kind = str(data.kind, file, "kind");
  if (!(kind in PAGE_KINDS)) fail(file, `unknown kind "${kind}" (use ${Object.keys(PAGE_KINDS).join(", ")})`);

  const appSlugs: string[] = Array.isArray(data.apps) ? data.apps : [];
  if (appSlugs.length < 2) fail(file, "needs at least two apps");
  const apps = appSlugs.map((s) => getApp(s) ?? fail(file, `unknown app "${s}" (no content/compare/apps/${s}.json)`));
  const appBySlug = (s: unknown, where: string) => apps.find((a) => a.slug === s) ?? fail(file, `${where}: "${s}" is not one of this page's apps`);

  const rows: FactKey[] = Array.isArray(data.rows) ? data.rows : [];
  if (rows.length === 0) fail(file, "needs rows");
  for (const r of rows) if (!(r in ROWS)) fail(file, `unknown row "${r}" (use ${FACT_KEYS.join(", ")})`);

  const collect = new Collector();
  const table = buildTable(apps, rows, collect);

  const picks = (Array.isArray(data.picks) ? data.picks : []).map((p: { app?: string; text?: string }, i: number) => {
    if (!p?.text) fail(file, `pick ${i + 1} needs text`);
    return { app: appBySlug(p.app, `pick ${i + 1}`), text: p.text };
  });

  const differences = (Array.isArray(data.differences) ? data.differences : []).map(
    (d: { title?: string; text?: string; sources?: unknown }, i: number) => {
      if (!d?.title || !d?.text) fail(file, `difference ${i + 1} needs title and text`);
      return { title: d.title, text: d.text, sources: resolveRefs(d.sources, apps, collect, file, `difference ${i + 1}`) };
    },
  );

  const betterRaw = (data.better ?? {}) as Record<string, { text?: string; sources?: unknown }[]>;
  const better = Object.entries(betterRaw).map(([s, items]) => ({
    app: appBySlug(s, "better"),
    items: (items ?? []).map((it, i) => {
      if (!it?.text) fail(file, `better.${s} ${i + 1} needs text`);
      return { text: it.text, sources: resolveRefs(it.sources, apps, collect, file, `better.${s} ${i + 1}`) };
    }),
  }));

  const situations: Situation[] = (Array.isArray(data.situations) ? data.situations : []).map(
    (x: { icon?: string; title?: string; pick?: string; text?: string; link?: string }, i: number) => {
      if (!x?.title || !x?.text) fail(file, `situation ${i + 1} needs title and text`);
      if (!SITUATION_ICONS.includes(x.icon as SituationIcon)) fail(file, `situation ${i + 1}: icon must be one of ${SITUATION_ICONS.join(", ")}`);
      if (x.link && !x.link.startsWith("/")) fail(file, `situation ${i + 1}: link must be a path on this site`);
      const pick = x.pick === "both" || x.pick === "neither" ? x.pick : appBySlug(x.pick, `situation ${i + 1}`);
      return { icon: x.icon as SituationIcon, title: x.title, pick, text: x.text, link: x.link };
    },
  );

  const faqs: Faq[] = Array.isArray(data.faqs) ? data.faqs : [];
  faqs.forEach((f, i) => {
    if (!f?.q || !f?.a) fail(file, `faq ${i + 1} needs q and a`);
  });

  return {
    slug,
    kind: kind as PageKind,
    title: str(data.title, file, "title"),
    description: str(data.description, file, "description"),
    published: toDay(data.published, file, "published"),
    updated: toDay(data.updated ?? data.published, file, "updated"),
    answer: str(data.answer, file, "answer"),
    apps,
    subject: apps.find((a) => a.slug !== "captio-ai") ?? apps[0],
    picks,
    table,
    differences,
    better,
    situations,
    faqs,
    sources: collect.grouped(apps),
    tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
    related: Array.isArray(data.related) ? data.related.map(String) : [],
    draft: data.draft === true,
    factsChecked: apps.map((a) => a.checked).sort()[0],
  };
}

let pageCache: ComparePage[] | null = null;

/** Published comparison pages, in the order of the hub (Captio AI vs …, by name). Drafts only show on the dev server. */
export function getAllComparePages(): ComparePage[] {
  if (!pageCache || process.env.NODE_ENV === "development") {
    const files = fs.existsSync(PAGES_DIR) ? fs.readdirSync(PAGES_DIR).filter((f) => f.endsWith(".md")) : [];
    pageCache = files
      .map(parsePage)
      .filter((p) => !p.draft || process.env.NODE_ENV === "development")
      .sort((a, b) => a.subject.name.localeCompare(b.subject.name));
  }
  return pageCache;
}

export function getComparePage(slug: string): ComparePage | undefined {
  return getAllComparePages().find((p) => p.slug === slug);
}

/** The head-to-head page for an app, if one exists. */
export function comparePageFor(app: CompareApp): ComparePage | undefined {
  if (app.slug === "captio-ai") return undefined;
  return getAllComparePages().find((p) => p.kind === "versus" && p.apps.some((a) => a.slug === app.slug));
}

/** Pages listed in `related`, then pages about apps of the same kind, then the rest. */
export function getRelatedComparePages(page: ComparePage, count = 3): ComparePage[] {
  const others = getAllComparePages().filter((p) => p.slug !== page.slug);
  const named = page.related.map((s) => others.find((p) => p.slug === s)).filter((p): p is ComparePage => !!p);
  const sameKind = others.filter((p) => !named.includes(p) && p.subject.category === page.subject.category);
  const rest = others.filter((p) => !named.includes(p) && !sameKind.includes(p));
  return [...named, ...sameKind, ...rest].slice(0, count);
}

// ── The landing page (/compare) ────────────────────────────────────────────

export type HubGroup = { id: string; title: string; intro: string; apps: CompareApp[] };

export type CompareHub = {
  title: string;
  description: string;
  updated: string;
  answer: string;
  groups: HubGroup[];
  overview: { title: string; intro: string; apps: CompareApp[]; table: TableRow[] };
  faqs: Faq[];
  appCount: number;
  sourceCount: number;
  factsChecked: string;
};

export function getCompareHub(): CompareHub {
  const file = "index.md";
  const { data } = matter(fs.readFileSync(HUB_FILE, "utf8"));
  const app = (s: string, where: string) => getApp(s) ?? fail(file, `${where}: unknown app "${s}"`);

  const groups: HubGroup[] = (Array.isArray(data.groups) ? data.groups : []).map(
    (g: { title?: string; intro?: string; apps?: string[] }, i: number) => {
      if (!g?.title || !Array.isArray(g.apps)) fail(file, `group ${i + 1} needs title and apps`);
      return {
        id: g.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""),
        title: g.title,
        intro: g.intro ?? "",
        apps: g.apps.map((s) => app(s, `group ${i + 1}`)),
      };
    },
  );
  if (groups.length === 0) fail(file, "needs at least one group");

  const o = data.overview ?? {};
  if (!o.title || !Array.isArray(o.apps) || !Array.isArray(o.rows)) fail(file, "overview needs title, apps and rows");
  for (const r of o.rows) if (!(r in ROWS)) fail(file, `overview: unknown row "${r}"`);
  const overviewApps = (o.apps as string[]).map((s) => app(s, "overview"));

  const faqs: Faq[] = Array.isArray(data.faqs) ? data.faqs : [];
  faqs.forEach((f, i) => {
    if (!f?.q || !f?.a) fail(file, `faq ${i + 1} needs q and a`);
  });

  const all = getAllApps();
  return {
    title: str(data.title, file, "title"),
    description: str(data.description, file, "description"),
    updated: toDay(data.updated, file, "updated"),
    answer: str(data.answer, file, "answer"),
    groups,
    overview: { title: o.title, intro: o.intro ?? "", apps: overviewApps, table: buildTable(overviewApps, o.rows as FactKey[]) },
    faqs,
    appCount: all.filter((a) => a.slug !== "captio-ai").length,
    sourceCount: new Set(all.flatMap((a) => a.sources.map((s) => s.url))).size,
    factsChecked: all.map((a) => a.checked).sort()[0],
  };
}
