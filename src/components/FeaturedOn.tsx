import { FEATURED_ON } from "@/lib/press";

// Disabled World's own globe mark (their favicon), drawn without a clip path so
// it can appear twice on one page without clashing ids.
function DisabledWorldMark({ className }: { className: string }) {
  return (
    <svg viewBox="0 0 32 32" aria-hidden className={className}>
      <circle cx="16" cy="16" r="16" fill="#123262" />
      <g fill="none" stroke="#f7eb90" strokeWidth="2">
        <circle cx="16" cy="16" r="14" />
        <ellipse cx="16" cy="16" rx="6" ry="14" />
        <ellipse cx="16" cy="16" rx="14" ry="6" />
      </g>
    </svg>
  );
}

/** One quiet line under the homepage download button. */
export function FeaturedOnLine({ label = "Featured on" }: { label?: string }) {
  return (
    <a
      href={FEATURED_ON.url}
      target="_blank"
      rel="noopener"
      className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 transition-colors"
    >
      <DisabledWorldMark className="w-5 h-5 shrink-0" />
      <span>
        {label} <span className="font-semibold text-gray-900">{FEATURED_ON.name}</span>
      </span>
    </a>
  );
}

/** Footer card under the Product Hunt one, on every page. */
export function FeaturedOnCard({ label = "Featured on" }: { label?: string }) {
  return (
    <a
      href={FEATURED_ON.url}
      target="_blank"
      rel="noopener"
      className="mt-3 flex max-w-xs items-center gap-3 rounded-xl bg-white/10 p-4 ring-1 ring-white/15 hover:bg-white/15 transition-colors"
    >
      <DisabledWorldMark className="w-12 h-12 shrink-0" />
      <div className="min-w-0">
        <p className="text-[11px] font-semibold text-white/50 uppercase tracking-widest">{label}</p>
        <p className="font-semibold leading-tight">{FEATURED_ON.name}</p>
        <p className="mt-1 text-xs text-white/60 leading-snug line-clamp-2">{FEATURED_ON.title} →</p>
      </div>
    </a>
  );
}
