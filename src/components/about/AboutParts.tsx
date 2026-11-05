import Link from "next/link";
import { formatDay } from "@/lib/blog";
import type { OtherApp, SimilarName, SourcedText } from "@/lib/about";
import type { TableRow } from "@/lib/compare";
import { FactCell, SourceLinks, StatusIcon } from "@/components/compare/CompareParts";

// Pieces of /about. Facts open to show their detail and sources, like on the
// compare pages. No other app's icon anywhere on this page: it is the page
// image search and answer engines read to learn what Captio AI looks like.

/** One group of Captio AI's facts: what the row is on the left, the fact on the right. On phones each row stacks. */
export function FactSheet({ id, title, intro, rows }: { id: string; title: string; intro: string; rows: TableRow[] }) {
  return (
    <section aria-labelledby={id} className="border border-gray-200 rounded-xl bg-white">
      <div className="px-5 sm:px-6 pt-5 sm:pt-6 pb-4 border-b border-gray-100">
        <h3 id={id} className="text-lg sm:text-xl font-bold text-gray-900 tracking-tight scroll-mt-24">{title}</h3>
        {intro && <p className="mt-1 text-sm text-gray-500 leading-relaxed">{intro}</p>}
      </div>
      <table role="table" className="w-full border-separate border-spacing-0 text-left table-fixed">
        <caption className="sr-only">{`Captio AI: ${title.toLowerCase()}`}</caption>
        <tbody role="rowgroup">
          {rows.map((row, r) => (
            <tr key={row.key} role="row" className={`grid gap-2 px-5 py-4 md:table-row md:p-0 ${r > 0 ? "border-t border-gray-100" : ""}`}>
              <th role="rowheader" scope="row" className={`md:table-cell md:w-[40%] md:px-6 md:py-4 align-top text-left ${r > 0 ? "md:border-t md:border-gray-100" : ""}`}>
                <span className="block font-semibold text-gray-900 text-[15px] leading-snug">{row.label}</span>
                <span className="hidden md:block mt-1 text-[13px] font-normal text-gray-400 leading-snug">{row.why}</span>
              </th>
              <td role="cell" className={`align-top md:table-cell md:px-6 md:py-4 ${r > 0 ? "md:border-t md:border-gray-100" : ""}`}>
                <FactCell cell={row.cells[0]} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}

/** "What it does well" or "Its limits": short sentences, each with its sources. */
export function ClaimColumn({ title, items, kind }: { title: string; items: SourcedText[]; kind: "strength" | "limit" }) {
  return (
    <div className={`rounded-xl p-6 sm:p-7 ${kind === "strength" ? "bg-brand-light/50 border border-brand/15" : "bg-white border border-gray-200"}`}>
      <h3 className="font-bold text-gray-900 text-xl tracking-tight">{title}</h3>
      <ul className="mt-5 flex flex-col gap-4">
        {items.map((it) => (
          <li key={it.text} className="flex gap-3">
            <StatusIcon status={kind === "strength" ? "yes" : "partial"} size="lg" />
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

/** A job another app does better: the situation, the app, why, and its comparison. */
export function OtherAppCard({ item }: { item: OtherApp }) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 flex flex-col">
      <h3 className="font-bold text-gray-900 text-base sm:text-lg leading-snug">{item.title}</h3>
      <p className="mt-1 text-sm font-semibold text-brand">Use {item.app.shortName}</p>
      <p className="mt-3 text-[15px] text-gray-600 leading-relaxed">{item.text}</p>
      {/* Folded: these facts cite several pages each. The links stay in the HTML. */}
      <details className="mt-3 group">
        <summary className="cursor-pointer list-none text-xs font-medium text-gray-400 hover:text-brand">
          {item.sources.length} {item.sources.length === 1 ? "source" : "sources"}
          <span aria-hidden className="ml-1 inline-block transition-transform group-open:rotate-180">⌄</span>
        </summary>
        <SourceLinks sources={item.sources} className="mt-1.5" />
      </details>
      {item.compareHref && (
        <Link href={item.compareHref} className="mt-auto pt-4 text-sm font-semibold text-brand hover:underline">
          Captio AI vs {item.app.shortName}
        </Link>
      )}
    </div>
  );
}

/** An app or product with a name like Captio AI's, and what it actually is. */
export function SimilarNameCard({ item }: { item: SimilarName }) {
  return (
    <div className="bg-gray-50 border border-gray-100 rounded-xl p-6 flex flex-col">
      <h3 className="font-bold text-gray-900 text-base sm:text-lg leading-snug">{item.name}</h3>
      {item.by && <p className="mt-0.5 text-sm text-gray-400">by {item.by}</p>}
      <p className="mt-3 text-[15px] text-gray-600 leading-relaxed">{item.what}</p>
      <p className="mt-auto pt-4 text-xs text-gray-400 leading-relaxed">
        Source:{" "}
        <a href={item.url} target="_blank" rel="noopener" className="text-gray-500 underline decoration-gray-300 underline-offset-2 hover:text-brand">
          its own page
        </a>
        , checked {formatDay(item.checked)}
      </p>
    </div>
  );
}
