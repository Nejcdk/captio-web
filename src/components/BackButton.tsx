"use client";
import { useRouter } from "next/navigation";

export default function BackButton({ label = "Go back" }: { label?: string }) {
  const router = useRouter();
  return (
    <button
      onClick={() => router.back()}
      className="inline-flex items-center gap-1 text-brand font-semibold text-sm hover:underline"
    >
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
        <path d="m15 18-6-6 6-6" strokeWidth="2" />
      </svg>
      {label}
    </button>
  );
}
