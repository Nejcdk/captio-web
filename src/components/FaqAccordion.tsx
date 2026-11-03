type Faq = { q: string; a: string };

// Rendered on the server with the browser's own <details>: every answer is in
// the page's HTML, where search engines and answer engines read it, and no
// JavaScript is needed to open one. Looks like the click-to-open list it
// replaced (which only put an answer on the page after a click).
export default function FaqAccordion({ faqs }: { faqs: Faq[] }) {
  return (
    <div className="flex flex-col gap-3">
      {faqs.map((faq) => (
        <details
          key={faq.q}
          className="group bg-white rounded-[8px] border border-gray-200 open:border-brand transition-colors"
        >
          <summary className="list-none cursor-pointer flex items-center justify-between gap-4 px-6 py-5 text-start [&::-webkit-details-marker]:hidden">
            <h3 className="font-semibold text-gray-900 text-sm sm:text-base">{faq.q}</h3>
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              aria-hidden
              className="w-5 h-5 shrink-0 text-gray-400 transition-transform group-open:rotate-180 group-open:text-brand"
            >
              <path d="m6 9 6 6 6-6" />
            </svg>
          </summary>
          <div className="px-6 pb-5 text-gray-500 text-sm leading-relaxed border-t border-gray-100 pt-4">
            {faq.a}
          </div>
        </details>
      ))}
    </div>
  );
}
