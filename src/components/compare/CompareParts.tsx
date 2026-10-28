import Link from "next/link";
import { formatDay } from "@/lib/blog";
import type { Cell, CompareApp, ComparePage, FactStatus, SituationIcon, Src, TableRow } from "@/lib/compare";

// Landing-page pieces for /compare. No footnote numbers anywhere: a fact opens
// to show where it comes from, by name ("Google Play listing"), with the link.

// ── Small pieces ───────────────────────────────────────────────────────────

export function SectionHeading({ eyebrow, title, intro, id, onDark = false }: { eyebrow: string; title: string; intro?: string; id?: string; onDark?: boolean }) {
  return (
    <div className="text-center mb-8 sm:mb-10 max-w-3xl mx-auto">
      <span className="text-xs font-bold text-cta uppercase tracking-widest">{eyebrow}</span>
      <h2 id={id} className={`text-[1.75rem] leading-tight sm:text-4xl font-bold tracking-tight mt-3 scroll-mt-24 ${onDark ? "text-white" : "text-gray-900"}`}>
        {title}
      </h2>
      {intro && <p className={`mt-3 text-base sm:text-lg leading-relaxed ${onDark ? "text-blue-100" : "text-gray-500"}`}>{intro}</p>}
    </div>
  );
}

const STATUS: Record<FactStatus, { word: string; ring: string; path: string }> = {
  yes: { word: "Yes", ring: "bg-emerald-50 text-emerald-600", path: "m6.5 12.5 3.5 3.5 7.5-8" },
  no: { word: "No", ring: "bg-gray-100 text-gray-400", path: "M8 8l8 8M16 8l-8 8" },
  partial: { word: "Partly", ring: "bg-amber-50 text-amber-600", path: "M7 12h10" },
  not_stated: { word: "Not stated", ring: "bg-gray-50 text-gray-300", path: "M8 12h.01M12 12h.01M16 12h.01" },
};

export function StatusIcon({ status, size = "md" }: { status: FactStatus; size?: "md" | "lg" }) {
  const s = STATUS[status];
  const box = size === "lg" ? "w-6 h-6" : "w-5 h-5";
  return (
    <span aria-hidden className={`shrink-0 inline-flex items-center justify-center rounded-full ${box} ${s.ring}`}>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.6} strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
        <path d={s.path} />
      </svg>
    </span>
  );
}

/** "Source: Google Play listing, Use Live Transcribe (Google)" with links. */
export function SourceLinks({ sources, className = "" }: { sources: Src[]; className?: string }) {
  if (sources.length === 0) return null;
  return (
    <p className={`text-xs text-gray-400 leading-relaxed ${className}`}>
      {sources.length > 1 ? "Sources: " : "Source: "}
      {sources.map((s, i) => (
        <span key={s.url}>
          {i > 0 && ", "}
          <a href={s.url} target="_blank" rel="noopener" title={s.title} className="text-gray-500 underline decoration-gray-300 underline-offset-2 hover:text-brand">
            {s.label}
          </a>
          {!s.label.startsWith(s.publisher) && <span> ({s.publisher})</span>}
        </span>
      ))}
    </p>
  );
}

function Chevron() {
  return (
    <svg aria-hidden viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" className="w-3.5 h-3.5 shrink-0 mt-1 text-gray-300 transition-transform group-open:rotate-180 group-hover:text-brand">
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

/** A fact. Tap it to see the longer sentence and its sources. */
export function FactCell({ cell }: { cell: Cell }) {
  const { fact, sources } = cell;
  const word = STATUS[fact.status].word;
  const saysStatus = fact.text.toLowerCase().startsWith(word.toLowerCase());
  const label = (
    <>
      <StatusIcon status={fact.status} />
      <span className={`flex-1 min-w-0 text-[14px] sm:text-[15px] leading-snug ${fact.status === "not_stated" ? "text-gray-400" : "text-gray-900 font-medium"}`}>
        {!saysStatus && <span className="sr-only">{word}: </span>}
        {fact.text}
      </span>
    </>
  );
  if (!fact.detail && sources.length === 0) return <div className="flex gap-2">{label}</div>;
  return (
    <details className="group compare-fact">
      <summary className="flex gap-2 cursor-pointer list-none rounded-[6px] -m-1 p-1 hover:bg-gray-50">
        {label}
        <Chevron />
      </summary>
      <div className="mt-2 ml-7 flex flex-col gap-1.5">
        {fact.detail && <p className="text-[13px] sm:text-sm text-gray-500 leading-snug">{fact.detail}</p>}
        <SourceLinks sources={sources} />
      </div>
    </details>
  );
}

function shortDeveloper(app: CompareApp) {
  return app.developer.replace(/ \(.*\)$/, "").replace(/,? Inc\.?$|,? LLC$| Corporation$/, "");
}

// ── Tables ─────────────────────────────────────────────────────────────────
// Real <table>s (with ARIA roles, so they stay tables when CSS reflows them).
// Head to head: on phones each row stacks: the feature on top, the apps side
// by side under it. Roundup: on phones and tablets each app becomes a card.

/** Features down the side, apps across the top. For head-to-head pages. */
export function VersusTable({ apps, rows, caption }: { apps: CompareApp[]; rows: TableRow[]; caption: string }) {
  const cols = apps.length === 2 ? "grid-cols-2" : apps.length === 3 ? "grid-cols-3" : "grid-cols-2";
  return (
    <div className="border border-gray-200 rounded-xl bg-white">
      <table role="table" className="w-full border-separate border-spacing-0 text-left table-fixed">
        <caption className="sr-only">{caption}</caption>
        <thead role="rowgroup" className="hidden md:table-header-group">
          <tr role="row">
            <th role="columnheader" scope="col" className="sticky top-0 z-10 w-[30%] bg-gray-50 border-b border-gray-200 rounded-tl-xl px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest align-bottom">
              Feature
            </th>
            {apps.map((app, i) => (
              <th
                key={app.slug}
                role="columnheader"
                scope="col"
                className={`sticky top-0 z-10 border-b border-gray-200 px-6 py-4 align-bottom ${app.slug === "captio-ai" ? "bg-[#eef2fe]" : "bg-gray-50"} ${i === apps.length - 1 ? "rounded-tr-xl" : ""}`}
              >
                <span className="block font-bold text-gray-900 text-base leading-tight">{app.shortName}</span>
                <span className="block mt-0.5 text-xs font-medium text-gray-400">{shortDeveloper(app)}</span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody role="rowgroup">
          {rows.map((row, r) => (
            <tr key={row.key} role="row" className={`grid ${cols} gap-x-4 gap-y-3 px-4 py-4 md:table-row md:p-0 ${r > 0 ? "border-t border-gray-100" : ""}`}>
              <th role="rowheader" scope="row" className="col-span-full md:table-cell md:px-6 md:py-5 align-top text-left md:border-t md:border-gray-100 first:md:border-t-0">
                <span className="block font-semibold text-gray-900 text-[15px] leading-snug">{row.label}</span>
                <span className="hidden md:block mt-1 text-[13px] font-normal text-gray-400 leading-snug">{row.why}</span>
              </th>
              {row.cells.map((cell) => (
                <td
                  key={cell.app.slug}
                  role="cell"
                  className={`align-top md:table-cell md:px-6 md:py-5 md:border-t md:border-gray-100 ${r === 0 ? "md:border-t-0" : ""} ${cell.app.slug === "captio-ai" ? "md:bg-[#f7f9ff]" : ""}`}
                >
                  <span className="md:hidden block mb-1.5 text-[11px] font-bold uppercase tracking-widest text-gray-400">{cell.app.shortName}</span>
                  <FactCell cell={cell} />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/** Apps down the side, features across the top. On phones and tablets each app is a card. */
export function RoundupTable({ apps, rows, caption, hrefFor }: { apps: CompareApp[]; rows: TableRow[]; caption: string; hrefFor?: (app: CompareApp) => string | undefined }) {
  return (
    <div className="lg:border lg:border-gray-200 lg:rounded-xl lg:bg-white">
      <table role="table" className="w-full border-separate border-spacing-0 text-left">
        <caption className="sr-only">{caption}</caption>
        <thead role="rowgroup" className="hidden lg:table-header-group">
          <tr role="row">
            <th role="columnheader" scope="col" className="w-[13rem] bg-gray-50 border-b border-gray-200 rounded-tl-xl px-5 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest align-bottom">
              App
            </th>
            {rows.map((row, i) => (
              <th key={row.key} role="columnheader" scope="col" className={`bg-gray-50 border-b border-gray-200 px-4 py-4 text-[13px] font-semibold text-gray-900 leading-snug align-bottom ${i === rows.length - 1 ? "rounded-tr-xl" : ""}`}>
                {row.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody role="rowgroup" className="grid sm:grid-cols-2 gap-4 lg:table-row-group">
          {apps.map((app, a) => {
            const href = hrefFor?.(app);
            const mine = app.slug === "captio-ai";
            return (
              <tr
                key={app.slug}
                role="row"
                className={`flex flex-col gap-3 border rounded-xl p-5 lg:table-row lg:border-0 lg:rounded-none lg:p-0 ${mine ? "border-brand/30 bg-[#f7f9ff]" : "border-gray-200 bg-white"}`}
              >
                <th role="rowheader" scope="row" className={`text-left align-top lg:table-cell lg:px-5 lg:py-4 ${a > 0 ? "lg:border-t lg:border-gray-100" : ""}`}>
                  {href ? (
                    <Link href={href} className="group inline-block">
                      <span className="block font-bold text-gray-900 text-lg lg:text-[15px] leading-tight group-hover:text-brand">{app.shortName}</span>
                      <span className="block mt-0.5 text-xs font-medium text-gray-400">{shortDeveloper(app)}</span>
                      <span className="mt-1.5 inline-block text-xs font-semibold text-brand">Compare with Captio AI</span>
                    </Link>
                  ) : (
                    <>
                      <span className="block font-bold text-gray-900 text-lg lg:text-[15px] leading-tight">{app.shortName}</span>
                      <span className="block mt-0.5 text-xs font-medium text-gray-400">{shortDeveloper(app)}</span>
                    </>
                  )}
                </th>
                {rows.map((row) => (
                  <td key={row.key} role="cell" className={`grid grid-cols-[7.5rem_1fr] gap-3 align-top lg:table-cell lg:px-4 lg:py-4 ${a > 0 ? "lg:border-t lg:border-gray-100" : ""}`}>
                    <span className="lg:hidden text-[13px] font-semibold text-gray-500 leading-snug pt-0.5">{row.label}</span>
                    <FactCell cell={row.cells[a]} />
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

// ── Head-to-head blocks ────────────────────────────────────────────────────

function StoreLinks({ app, onDark = false }: { app: CompareApp; onDark?: boolean }) {
  const links = [
    { label: "Website", href: app.website },
    app.appStoreUrl ? { label: "App Store", href: app.appStoreUrl } : null,
    app.googlePlayUrl ? { label: "Google Play", href: app.googlePlayUrl } : null,
  ].filter((l): l is { label: string; href: string } => !!l);
  return (
    <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm">
      {links.map((l) => (
        <a key={l.label} href={l.href} target="_blank" rel="noopener" className={`font-semibold hover:underline ${onDark ? "text-white" : "text-brand"}`}>
          {l.label}
        </a>
      ))}
    </div>
  );
}

/** Hero card per app: who makes it, where it runs, what's free, and when to pick it. */
export function AppPickCard({ app, pick }: { app: CompareApp; pick?: string }) {
  const mine = app.slug === "captio-ai";
  const fact = (k: "platforms" | "freePlan") => app.facts[k].text;
  return (
    <div className={`flex flex-col rounded-xl p-6 sm:p-7 text-left ${mine ? "bg-brand text-white" : "bg-white border border-gray-200"}`}>
      <p className={`text-xs font-bold uppercase tracking-widest ${mine ? "text-white/60" : "text-gray-400"}`}>{shortDeveloper(app)}</p>
      <h2 className={`mt-1.5 text-2xl font-bold tracking-tight ${mine ? "text-white" : "text-gray-900"}`}>{app.shortName}</h2>
      <dl className={`mt-4 grid grid-cols-[5.5rem_1fr] gap-x-3 gap-y-1.5 text-sm ${mine ? "text-blue-50" : "text-gray-600"}`}>
        <dt className={mine ? "text-white/60" : "text-gray-400"}>Works on</dt>
        <dd className="font-medium">{fact("platforms")}</dd>
        <dt className={mine ? "text-white/60" : "text-gray-400"}>Free</dt>
        <dd className="font-medium">{fact("freePlan")}</dd>
      </dl>
      {pick && (
        <div className={`mt-5 pt-5 border-t ${mine ? "border-white/20" : "border-gray-100"}`}>
          <p className={`text-xs font-bold uppercase tracking-widest ${mine ? "text-white/60" : "text-gray-400"}`}>Pick it if</p>
          <p className={`mt-1.5 text-[15px] leading-relaxed ${mine ? "text-white" : "text-gray-800"}`}>{pick}</p>
        </div>
      )}
      <div className="mt-auto pt-5">
        <StoreLinks app={app} onDark={mine} />
      </div>
    </div>
  );
}

export function DifferenceCard({ title, text, sources }: ComparePage["differences"][number]) {
  return (
    <div className="bg-gray-50 border border-gray-100 rounded-xl p-6 flex flex-col">
      <h3 className="font-bold text-gray-900 text-lg leading-snug">{title}</h3>
      <p className="mt-2 text-[15px] text-gray-600 leading-relaxed">{text}</p>
      <SourceLinks sources={sources} className="mt-auto pt-4" />
    </div>
  );
}

export function BetterColumn({ app, items }: ComparePage["better"][number]) {
  const mine = app.slug === "captio-ai";
  return (
    <div className={`rounded-xl p-6 sm:p-7 ${mine ? "bg-brand-light/50 border border-brand/15" : "bg-white border border-gray-200"}`}>
      <h3 className="font-bold text-gray-900 text-xl tracking-tight">Where {app.shortName} is the better choice</h3>
      <ul className="mt-5 flex flex-col gap-4">
        {items.map((it) => (
          <li key={it.text} className="flex gap-3">
            <StatusIcon status="yes" size="lg" />
            <div className="min-w-0">
              <p className="text-[15px] text-gray-800 leading-relaxed">{it.text}</p>
              <SourceLinks sources={it.sources} className="mt-1" />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

const ICONS: Record<SituationIcon, string> = {
  doctor: "M9 3h6v6h6v6h-6v6H9v-6H3V9h6z",
  dinner: "M7 3v8a2 2 0 0 0 4 0V3M9 11v10M17 3c-1.7 0-3 2-3 5s1.3 4 3 4v9",
  meeting: "M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75",
  lecture: "M22 10 12 5 2 10l10 5 10-5ZM6 12v5c3 2 9 2 12 0v-5",
  travel: "M2 16h20M6 16l2-8h8l2 8M9 8V5h6v3M5 20h2M17 20h2",
  home: "M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9M10.3 21a1.94 1.94 0 0 0 3.4 0",
  phone: "M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z",
  offline: "M2 2l20 20M8.5 16.5a5 5 0 0 1 7 0M2 8.82a15 15 0 0 1 4.17-2.65M10.66 5c4.01-.36 8.14.9 11.34 3.76M16.85 11.25a10 10 0 0 1 2.22 1.68M5 13a10 10 0 0 1 5.24-2.76M12 20h.01",
  translate: "m5 8 6 6M4 14l6-6 2-3M2 5h12M7 2h1M22 22l-5-10-5 10M14 18h6",
  iphone: "M7 2h10a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2zM12 18h.01",
  android: "M7 2h10a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2zM12 18h.01",
  work: "M16 20V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16M4 6h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2z",
  glasses: "M2 14a4 4 0 1 0 8 0 4 4 0 1 0-8 0M14 14a4 4 0 1 0 8 0 4 4 0 1 0-8 0M10 14h4M2.5 12 5 6M21.5 12 19 6",
  money: "M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6",
  video: "m22 8-6 4 6 4V8ZM2 6h14v12H2z",
};

export function SituationCard({ situation }: { situation: ComparePage["situations"][number] }) {
  const { icon, title, pick, text, link } = situation;
  const pickLabel = pick === "both" ? "Either one" : pick === "neither" ? "Neither: see below" : pick.shortName;
  const mine = typeof pick !== "string" && pick.slug === "captio-ai";
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 flex flex-col">
      <div className="flex items-center justify-between gap-3">
        <span className="w-11 h-11 rounded-xl bg-brand-light text-brand flex items-center justify-center">
          <svg aria-hidden viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
            <path d={ICONS[icon]} />
          </svg>
        </span>
        <span className={`text-xs font-bold rounded-[6px] px-2.5 py-1 ${mine ? "bg-brand text-white" : "bg-gray-100 text-gray-700"}`}>{pickLabel}</span>
      </div>
      <h3 className="mt-4 font-bold text-gray-900 text-base sm:text-lg leading-snug">{title}</h3>
      <p className="mt-2 text-[15px] text-gray-600 leading-relaxed">{text}</p>
      {link && (
        <Link href={link} className="mt-auto pt-4 text-sm font-semibold text-brand hover:underline">
          Captions for this situation
        </Link>
      )}
    </div>
  );
}

// ── Shared landing blocks ──────────────────────────────────────────────────

/** FAQ with the answers always in the HTML (answer engines read them closed). */
export function CompareFaq({ faqs }: { faqs: { q: string; a: string }[] }) {
  return (
    <div className="flex flex-col gap-3">
      {faqs.map((faq) => (
        <details key={faq.q} className="group bg-white rounded-[8px] border border-gray-200 open:border-brand transition-colors">
          <summary className="cursor-pointer list-none flex items-center justify-between gap-4 px-6 py-5 text-left">
            <h3 className="font-semibold text-gray-900 text-sm sm:text-base">{faq.q}</h3>
            <svg aria-hidden viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" className="w-5 h-5 shrink-0 text-gray-400 transition-transform group-open:rotate-180 group-open:text-brand">
              <path d="m6 9 6 6 6-6" />
            </svg>
          </summary>
          <p className="px-6 pb-5 pt-4 border-t border-gray-100 text-gray-500 text-sm sm:text-[15px] leading-relaxed">{faq.a}</p>
        </details>
      ))}
    </div>
  );
}

/** How the comparison was made, on brand blue, three cards. */
export function HowWeCompare({ factsChecked }: { factsChecked: string }) {
  const cards = [
    {
      title: "From their own pages",
      text: "Every fact comes from the company's website, help pages, privacy policy or store listing. Tap any fact to see the page it comes from.",
    },
    {
      title: `Checked ${formatDay(factsChecked)}`,
      text: "Each source has the date we opened it. If a company doesn't say something publicly, the table says \"Not stated\" instead of guessing.",
    },
    {
      title: "We make Captio AI",
      text: "So it's described with the same rules as every other app, limits included, and each page says where the other app is the better choice.",
    },
  ];
  return (
    <section aria-labelledby="how-we-compared" className="py-14 sm:py-16 px-5 sm:px-6 bg-brand">
      <div className="max-w-5xl mx-auto">
        <SectionHeading id="how-we-compared" eyebrow="How we compare" title="Facts you can check, not opinions." onDark />
        <div className="grid sm:grid-cols-3 gap-4">
          {cards.map((c) => (
            <div key={c.title} className="bg-white/10 rounded-xl p-6 border border-white/20">
              <h3 className="font-semibold text-white">{c.title}</h3>
              <p className="mt-1.5 text-sm text-blue-100 leading-relaxed">{c.text}</p>
            </div>
          ))}
        </div>
        <p className="mt-8 text-center text-sm text-blue-100">
          Something out of date?{" "}
          <a href="mailto:hello@captioai.app" className="font-semibold text-white underline underline-offset-2">hello@captioai.app</a>
        </p>
      </div>
    </section>
  );
}

/** Every source the page used, grouped by app, by name and date. */
export function SourcesByApp({ groups }: { groups: ComparePage["sources"] }) {
  return (
    <div className="grid md:grid-cols-2 gap-8">
      {groups.map(({ app, sources }) => (
        <div key={app.slug}>
          <h3 className="font-bold text-gray-900">{app.shortName}</h3>
          <ul className="mt-3 flex flex-col gap-2.5">
            {sources.map((s) => (
              <li key={s.url} className="text-sm leading-snug">
                <a href={s.url} target="_blank" rel="noopener" className="font-medium text-gray-700 hover:text-brand underline decoration-gray-300 underline-offset-2 break-words">
                  {s.title}
                </a>
                <span className="block text-xs text-gray-400 mt-0.5">
                  {s.publisher}, checked {formatDay(s.checked)}
                </span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

/** A comparison on the landing page: just the two names, what the other app is, and a way in. */
export function ComparisonCard({ page }: { page: ComparePage }) {
  const app = page.subject;
  return (
    <Link href={`/compare/${page.slug}`} className="group flex items-center gap-4 bg-white border border-gray-200 rounded-xl px-5 py-5 sm:px-6 hover:border-brand transition-colors">
      <div className="min-w-0 flex-1">
        <h3 className="text-lg font-bold text-gray-900 tracking-tight leading-snug group-hover:text-brand transition-colors">
          <span className="text-gray-400 font-semibold">Captio AI vs </span>
          {app.shortName}
        </h3>
        <p className="mt-1 text-sm text-gray-500 leading-snug line-clamp-2">{app.oneLine}</p>
      </div>
      <span aria-hidden className="shrink-0 w-9 h-9 rounded-full bg-gray-50 text-gray-400 flex items-center justify-center group-hover:bg-brand group-hover:text-white transition-colors">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
          <path d="M5 12h14M13 6l6 6-6 6" />
        </svg>
      </span>
    </Link>
  );
}
