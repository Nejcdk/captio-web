import type { ReactNode } from "react";

// The first thing a landing page says, in two or three sentences right under
// the headline: the sentences a search engine or an answer engine quotes.
// Below them, when the page was last reviewed, so the date is in the HTML and
// not only in the sitemap.
export default function ShortAnswer({ children, reviewed, footer }: { children: ReactNode; reviewed?: string; footer?: ReactNode }) {
  return (
    <section aria-labelledby="in-short" className="w-full max-w-2xl text-start bg-brand-light/60 border border-brand/15 rounded-xl px-5 py-4 sm:px-6 sm:py-5">
      <h2 id="in-short" className="text-xs font-bold text-brand uppercase tracking-widest">In short</h2>
      <p className="mt-2 text-base sm:text-[17px] leading-relaxed text-gray-900 font-medium">{children}</p>
      {(reviewed || footer) && (
        <p className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-500">
          {reviewed && <span>Reviewed {reviewed}</span>}
          {footer}
        </p>
      )}
    </section>
  );
}
