"use client";

import Link from "next/link";
import type { LanguageOption } from "@/i18n";

/** The globe button in the header: the current language's code, opens the menu. */
export function LanguageButton({
  code,
  label,
  open,
  onToggle,
}: {
  code: string;
  label: string;
  open: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={label}
      aria-expanded={open}
      aria-haspopup="true"
      className={`inline-flex items-center gap-1.5 rounded-[8px] px-2.5 py-2 text-sm font-semibold text-white transition-colors hover:bg-white/10 ${open ? "bg-white/15" : ""}`}
    >
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" aria-hidden className="w-5 h-5">
        <path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10Z" />
        <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10Z" />
      </svg>
      <span className="uppercase">{code}</span>
    </button>
  );
}

/**
 * Every language the page exists in, each linking to the same page in that
 * language. Plain links, so search engines find every version from every page.
 */
export default function LanguageMenu({
  code,
  label,
  options,
  onPick,
}: {
  code: string;
  label: string;
  options: LanguageOption[];
  onPick: () => void;
}) {
  return (
    <div className="absolute inset-x-4 top-full z-40 mt-2">
      <div className="max-w-6xl mx-auto flex justify-end">
        <div className="w-full md:w-[600px] bg-white rounded-xl shadow-xl border border-gray-100 p-3">
          <p className="px-3 pt-1 pb-2 text-xs font-bold text-gray-400 uppercase tracking-widest">{label}</p>
          <ul className="grid grid-cols-2 sm:grid-cols-3 gap-1 max-h-[min(65vh,520px)] overflow-y-auto">
            {options.map((o) => {
              const current = o.code === code;
              return (
                <li key={o.code}>
                  <Link
                    href={o.href}
                    hrefLang={o.code}
                    prefetch={false}
                    onClick={onPick}
                    aria-current={current ? "page" : undefined}
                    className={`flex flex-col rounded-[8px] px-3 py-2 transition-colors ${current ? "bg-brand-light text-brand" : "text-gray-900 hover:bg-gray-50"}`}
                  >
                    <span lang={o.code} className="text-sm font-semibold leading-snug">{o.native}</span>
                    {o.local !== o.native && (
                      <span className={`text-xs leading-snug ${current ? "text-brand/70" : "text-gray-500"}`}>{o.local}</span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
}
