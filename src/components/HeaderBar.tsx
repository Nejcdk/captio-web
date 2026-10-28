"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { LanguageOption, Messages } from "@/i18n";
import LanguageMenu, { LanguageButton } from "@/components/LanguageMenu";

type HeaderLabels = Messages["header"];

// Features, Use Cases and Languages are sections of the home page in the
// reader's language ("/#features", "/de#features"); Compare and Blog are
// English only.
function navItems(t: HeaderLabels, homeHref: string) {
  return [
    {
      label: t.features,
      href: `${homeHref}#features`,
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-5 h-5">
          <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2M9 5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2M9 5a2 2 0 0 0 2-2h2a2 2 0 0 0 2 2" strokeLinecap="round" />
        </svg>
      ),
    },
    {
      label: t.useCases,
      href: `${homeHref}#use-cases`,
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-5 h-5">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm14 2-3 3-1.5-1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
    },
    {
      label: t.languages,
      href: `${homeHref}#languages`,
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-5 h-5">
          <path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10Z" strokeLinecap="round" />
          <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10Z" strokeLinecap="round" />
        </svg>
      ),
    },
    {
      label: t.compare,
      href: "/compare",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-5 h-5">
          <path d="M4 4h16v16H4zM12 4v16M4 10h16M4 15h16" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
    },
    {
      label: t.blog,
      href: "/blog",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-5 h-5">
          <path d="M4 19.5V5a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v14.5a1.5 1.5 0 0 1-1.5 1.5H6a2 2 0 0 1-2-1.5ZM8 7h8M8 11h8M8 15h5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
    },
  ];
}

export default function HeaderBar({
  code,
  t,
  homeHref,
  languages,
}: {
  code: string;
  t: HeaderLabels;
  homeHref: string;
  /** The same page in every language; without it there is no language button (English-only pages). */
  languages?: LanguageOption[];
}) {
  const [open, setOpen] = useState<null | "menu" | "languages">(null);
  const ref = useRef<HTMLDivElement>(null);
  const items = navItems(t, homeHref);
  const close = () => setOpen(null);

  // A tap outside the header or Escape closes whichever panel is open.
  useEffect(() => {
    if (!open) return;
    const onPointer = (e: PointerEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(null);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(null);
    };
    document.addEventListener("pointerdown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={ref} className="px-4 pt-4 relative">
      <header className="max-w-6xl mx-auto bg-brand rounded-xl px-5 h-14 sm:h-16 flex items-center justify-between">
        <Link href={homeHref} className="flex items-center gap-2" onClick={close}>
          <Image src="/logo_image_profile.png" alt="" width={40} height={40} className="rounded-full" priority />
          <Image src="/logo_text.png" alt="Captio AI" width={110} height={30} priority />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-white/80">
          {items.map((item) => (
            <Link key={item.href} href={item.href} className="hover:text-white transition-colors">{item.label}</Link>
          ))}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          {languages && (
            <LanguageButton
              code={code}
              label={t.chooseLanguage}
              open={open === "languages"}
              onToggle={() => setOpen(open === "languages" ? null : "languages")}
            />
          )}

          <a href="#download" className="hidden md:block bg-white text-brand text-sm font-semibold px-5 py-2.5 rounded-[8px] hover:bg-white/90 transition-colors">
            {t.download}
          </a>

          {/* Mobile burger */}
          <button className="md:hidden text-white p-1" onClick={() => setOpen(open === "menu" ? null : "menu")} aria-label={t.toggleMenu}>
            {open === "menu" ? (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-6 h-6">
                <path d="M6 18L18 6M6 6l12 12" strokeLinecap="round" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-6 h-6">
                <path d="M4 6h16M4 12h16M4 18h16" strokeLinecap="round" />
              </svg>
            )}
          </button>
        </div>
      </header>

      {open === "languages" && languages && (
        <LanguageMenu code={code} label={t.chooseLanguage} options={languages} onPick={close} />
      )}

      {/* Mobile menu — overlays content, does not push it down */}
      {open === "menu" && (
        <div className="md:hidden absolute left-4 right-4 mt-2 bg-white rounded-xl shadow-xl border border-gray-100 py-4 z-40">
          <nav className="flex flex-col gap-1 px-3">
            {items.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={close}
                className="flex items-center justify-center gap-3 px-4 py-3.5 text-gray-700 font-medium text-base hover:text-brand hover:bg-gray-50 rounded-xl transition-colors"
              >
                <span className="text-gray-400">{item.icon}</span>
                {item.label}
              </Link>
            ))}
            <div className="px-1 pt-3">
              <a
                href="#download"
                onClick={close}
                className="block text-center bg-cta text-white font-semibold py-3.5 rounded-[8px] hover:bg-cta-dark transition-colors text-sm"
              >
                {t.download}
              </a>
            </div>
          </nav>
        </div>
      )}
    </div>
  );
}
