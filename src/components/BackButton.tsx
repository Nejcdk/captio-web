"use client";
import { useRouter } from "next/navigation";

// Goes back only when the page before was on this site. A page opened straight
// from a link (an email, another app, a new tab) has nothing on this site to go
// back to: router.back() then did nothing at all, or left the site. It goes to
// the homepage (or fallbackHref) instead.
export default function BackButton({ label = "Go back", fallbackHref = "/" }: { label?: string; fallbackHref?: string }) {
  const router = useRouter();
  const goBack = () => {
    const fromThisSite = document.referrer.startsWith(window.location.origin);
    if (fromThisSite && window.history.length > 1) router.back();
    else router.push(fallbackHref);
  };
  return (
    <button
      onClick={goBack}
      className="inline-flex items-center gap-1 text-brand font-semibold text-sm hover:underline"
    >
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 rtl:-scale-x-100">
        <path d="m15 18-6-6 6-6" strokeWidth="2" />
      </svg>
      {label}
    </button>
  );
}
