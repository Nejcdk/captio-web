"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

const navItems = [
  {
    label: "Features",
    href: "/#features",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-5 h-5">
        <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2M9 5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2M9 5a2 2 0 0 0 2-2h2a2 2 0 0 0 2 2" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    label: "Use Cases",
    href: "/#use-cases",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-5 h-5">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm14 2-3 3-1.5-1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    label: "Languages",
    href: "/#languages",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-5 h-5">
        <path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10Z" strokeLinecap="round" />
        <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10Z" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    label: "Pricing",
    href: "/pricing",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <path d="M12.586 2.586A2 2 0 0 0 11.172 2H4a2 2 0 0 0-2 2v7.172a2 2 0 0 0 .586 1.414l8.704 8.704a2.426 2.426 0 0 0 3.42 0l6.58-6.58a2.426 2.426 0 0 0 0-3.42z" strokeWidth="2" />
        <path fill="currentColor" d="M7 7.5a0.5 0.5 0 1 0 1 0 0.5 0.5 0 1 0-1 0" strokeWidth="2" />
      </svg>
    ),
  },
];

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <div className="px-4 pt-4 relative">
      <header className="max-w-6xl mx-auto bg-brand rounded-2xl px-5 h-14 sm:h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2" onClick={() => setOpen(false)}>
          <Image src="/owl_profile.png" alt="" width={32} height={32} className="rounded-full" priority />
          <Image src="/logo_text.png" alt="Captio" width={90} height={25} priority />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-white/80">
          <Link href="/live-captions" className="hover:text-white transition-colors">Features</Link>
          <Link href="/pricing" className="hover:text-white transition-colors">Pricing</Link>
          <Link href="/compare/otter-ai" className="hover:text-white transition-colors">Compare</Link>
        </nav>

        <a href="#download" className="hidden md:block bg-white text-brand text-sm font-semibold px-5 py-2.5 rounded-[14px] hover:bg-blue-50 transition-colors">
          Download
        </a>

        {/* Mobile burger */}
        <button className="md:hidden text-white p-1" onClick={() => setOpen(!open)} aria-label="Toggle menu">
          {open ? (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-6 h-6">
              <path d="M6 18L18 6M6 6l12 12" strokeLinecap="round" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-6 h-6">
              <path d="M4 6h16M4 12h16M4 18h16" strokeLinecap="round" />
            </svg>
          )}
        </button>
      </header>

      {/* Mobile menu — overlays content, does not push it down */}
      {open && (
        <div className="md:hidden absolute left-4 right-4 mt-2 bg-white rounded-2xl shadow-xl border border-gray-100 py-4 z-40">
          <nav className="flex flex-col gap-1 px-3">
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => setOpen(false)}
                className="flex items-center justify-center gap-3 px-4 py-3.5 text-gray-700 font-medium text-base hover:text-brand hover:bg-gray-50 rounded-xl transition-colors"
              >
                <span className="text-gray-400">{item.icon}</span>
                {item.label}
              </Link>
            ))}
            <div className="px-1 pt-3">
              <a
                href="#download"
                onClick={() => setOpen(false)}
                className="block text-center bg-brand text-white font-semibold py-3.5 rounded-[14px] hover:bg-brand-dark transition-colors text-sm"
              >
                Download
              </a>
            </div>
          </nav>
        </div>
      )}
    </div>
  );
}
