"use client";

import { useEffect, useState } from "react";
import posthog from "posthog-js";
import type { ReaderExports, SharedExport } from "@/lib/sharedExport";

// The app's Export button, for whoever opened the link: Text, PDF, Email and
// Chat, the same options (and the same ready-made texts) as in the app, minus
// Link. Text and Chat go through the device's share sheet where there is one,
// else to the clipboard; Email opens the mail app; PDF prints the page (the
// browser's own Save as PDF). The sheet looks like the app's export sheet.

type Way = "text" | "pdf" | "email" | "chat";

const COLORS: Record<Way, string> = { text: "#1C49F5", pdf: "#D93025", email: "#E37400", chat: "#8430CE" };

function Icon({ way }: { way: Way }) {
  const stroke = { stroke: COLORS[way], strokeWidth: 2, fill: "none", strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  return (
    <svg width={22} height={22} viewBox="0 0 24 24" aria-hidden>
      {way === "text" && (<><path d="M4 6h16" {...stroke} /><path d="M4 12h16" {...stroke} /><path d="M4 18h10" {...stroke} /></>)}
      {way === "pdf" && (<>
        <path d="M9 2h6s1 0 1 1v2s0 1 -1 1H9S8 6 8 5V3s0 -1 1 -1" {...stroke} />
        <path d="M10.4 12.6a2 2 0 0 1 3 3L8 21l-4 1 1 -4Z" {...stroke} />
        <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1 -2 2h-5.5" {...stroke} />
        <path d="M4 13.5V6a2 2 0 0 1 2 -2h2" {...stroke} />
      </>)}
      {way === "email" && (<>
        <path d="M3 7a2 2 0 0 1 2 -2h14a2 2 0 0 1 2 2v10a2 2 0 0 1 -2 2H5a2 2 0 0 1 -2 -2V7z" {...stroke} strokeWidth={1.8} />
        <path d="M3 7l9 6l9 -6" {...stroke} strokeWidth={1.8} />
      </>)}
      {way === "chat" && (<>
        <path d="M12 8V4H8" {...stroke} />
        <path d="M6 8h12a2 2 0 0 1 2 2v8a2 2 0 0 1 -2 2H6a2 2 0 0 1 -2 -2v-8a2 2 0 0 1 2 -2z" {...stroke} />
        <path d="M2 14h2" {...stroke} /><path d="M20 14h2" {...stroke} />
        <path d="M15 13v2" {...stroke} /><path d="M9 13v2" {...stroke} />
      </>)}
    </svg>
  );
}

export default function ExportMenu({ shared, exports }: { shared: SharedExport; exports: ReaderExports }) {
  const { labels } = shared;
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const shareOrCopy = async (text: string) => {
    if (navigator.share) {
      try { await navigator.share({ text }); } catch { /* closed */ }
      return;
    }
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  const pick = (way: Way) => {
    posthog.capture("share_page_export", { as: way, what: shared.what });
    setOpen(false);
    if (way === "text") void shareOrCopy(exports.text);
    else if (way === "chat") void shareOrCopy(exports.chat);
    else if (way === "email") {
      window.location.assign(`mailto:?subject=${encodeURIComponent(exports.emailSubject)}&body=${encodeURIComponent(exports.emailBody)}`);
    } else {
      // Once the sheet is gone, so it isn't in the printout.
      setTimeout(() => window.print(), 250);
    }
  };

  const ways: { way: Way; label: string }[] = [
    { way: "text", label: labels.text ?? "Text" },
    { way: "pdf", label: labels.pdf ?? "PDF" },
    { way: "email", label: labels.email ?? "Email" },
    { way: "chat", label: labels.chat ?? "Chat" },
  ];

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="mt-5 flex h-16 w-full items-center justify-center gap-2.5 rounded-[18px] bg-brand text-[19px] font-semibold text-white shadow-[0_4px_12px_rgba(28,73,245,0.3)] transition-colors hover:bg-brand-dark print:hidden"
      >
        <svg width={24} height={24} viewBox="0 0 24 24" fill="none" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <path d="M21 15v4a2 2 0 0 1 -2 2H5a2 2 0 0 1 -2 -2v-4" stroke="white" strokeWidth={2} />
          <path d="m17 8 -5 -5 -5 5" stroke="white" strokeWidth={2} />
          <path d="m12 3 0 12" stroke="white" strokeWidth={2} />
        </svg>
        {labels.exportButton ?? "Export"}
      </button>

      {open && (
        <div
          className="fixed inset-0 z-20 flex items-end justify-center bg-black/40 sm:items-center print:hidden"
          onClick={() => setOpen(false)}
        >
          <div
            role="dialog"
            className="w-full rounded-t-[28px] bg-white px-6 pb-10 pt-3 sm:max-w-sm sm:rounded-[28px] sm:pb-6"
            onClick={e => e.stopPropagation()}
          >
            <div className="mx-auto h-1 w-10 rounded-full bg-gray-300 sm:hidden" />
            <div className="mb-3 mt-2 flex justify-end">
              <button type="button" onClick={() => setOpen(false)} aria-label="Close" className="p-1">
                <svg width={22} height={22} viewBox="0 0 24 24" fill="none" strokeLinecap="round" aria-hidden>
                  <path d="M18 6 6 18" stroke="#1C2A5E" strokeWidth={2} /><path d="m6 6 12 12" stroke="#1C2A5E" strokeWidth={2} />
                </svg>
              </button>
            </div>
            <div className="flex flex-col gap-2.5">
              {ways.map(({ way, label }) => (
                <button
                  key={way}
                  type="button"
                  onClick={() => pick(way)}
                  className="flex h-14 items-center gap-3 rounded-2xl border-2 border-[#D1D1D6] bg-white px-4 text-start text-base font-semibold text-gray-900 transition-colors hover:bg-gray-50"
                >
                  <Icon way={way} />
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {copied && (
        <div className="fixed bottom-6 left-1/2 z-30 -translate-x-1/2 rounded-xl bg-gray-900 px-4 py-2.5 text-sm font-medium text-white print:hidden">
          {labels.copied ?? "Copied"}
        </div>
      )}
    </>
  );
}
