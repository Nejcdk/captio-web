"use client";

import { useState } from "react";

type Faq = { q: string; a: string };

export default function FaqAccordion({ faqs }: { faqs: Faq[] }) {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div className="flex flex-col gap-3">
      {faqs.map((faq, i) => (
        <div
          key={faq.q}
          className={`bg-white rounded-2xl border transition-colors ${open === i ? "border-brand" : "border-gray-200"}`}
        >
          <button
            className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left"
            onClick={() => setOpen(open === i ? null : i)}
          >
            <span className="font-semibold text-gray-900 text-sm sm:text-base">{faq.q}</span>
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              className={`w-5 h-5 shrink-0 text-gray-400 transition-transform ${open === i ? "rotate-180 text-brand" : ""}`}
            >
              <path d="m6 9 6 6 6-6" />
            </svg>
          </button>
          {open === i && (
            <div className="px-6 pb-5 text-gray-500 text-sm leading-relaxed border-t border-gray-100 pt-4">
              {faq.a}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
