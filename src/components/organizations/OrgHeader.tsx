"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import LanguageMenu, { LanguageButton } from "@/components/LanguageMenu";
import type { LanguageOption } from "@/i18n";

// /organizations' own header: the logo, "for Organizations", the language
// menu and one button. No site menu: the page is a product of its own.
export function OrgHeader({
  code,
  homeHref,
  forOrganizations,
  startPilot,
  chooseLanguage,
  languages,
}: {
  code: string;
  homeHref: string;
  forOrganizations: string;
  startPilot: string;
  chooseLanguage: string;
  languages: LanguageOption[];
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // A tap outside the header or Escape closes the language menu.
  useEffect(() => {
    if (!open) return;
    const onPointer = (e: PointerEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("pointerdown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={ref} className="relative px-4 pt-4">
      <header className="max-w-6xl mx-auto bg-brand rounded-xl px-4 sm:px-5 h-14 sm:h-16 flex items-center justify-between gap-2 sm:gap-3">
        <Link href={homeHref} className="flex items-center gap-2 min-w-0">
          <Image src="/logo_image_profile.png" alt="" width={40} height={40} className="rounded-full w-9 h-9 sm:w-10 sm:h-10" priority />
          <Image src="/logo_text.png" alt="Captio AI" width={110} height={30} className="hidden min-[400px]:block w-[92px] sm:w-[110px] h-auto" priority />
          <span className="hidden md:inline text-sm font-semibold text-white/80 border-l border-white/30 pl-3 ml-1 whitespace-nowrap">{forOrganizations}</span>
        </Link>
        <div className="flex items-center gap-1 sm:gap-2 shrink-0">
          <LanguageButton code={code} label={chooseLanguage} open={open} onToggle={() => setOpen(!open)} />
          <a
            href="#pilot"
            className="inline-flex items-center justify-center rounded-[8px] bg-white px-3 py-2.5 text-sm font-semibold text-brand transition-colors hover:bg-white/90 sm:px-5 whitespace-nowrap"
          >
            {startPilot}
          </a>
        </div>
      </header>
      {open && <LanguageMenu code={code} label={chooseLanguage} options={languages} onPick={() => setOpen(false)} />}
    </div>
  );
}
