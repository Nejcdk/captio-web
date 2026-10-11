import { STORE_LINK } from "@/lib/sharedExport";

// A deleted recording (or account), or a mistyped link.
export default function SharedNotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#F2F4F8] px-4">
      <div className="w-full max-w-md rounded-3xl bg-white p-8 text-center ring-1 ring-black/5">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/icon.png" alt="" width={56} height={56} className="mx-auto h-14 w-14 rounded-2xl" />
        <h1 className="mt-5 text-xl font-bold text-gray-900">This link is no longer available</h1>
        <p className="mt-2 text-gray-500">The recording was deleted by the person who shared it.</p>
        <a href={STORE_LINK} className="mt-6 inline-flex rounded-xl bg-brand px-6 py-3 font-semibold text-white hover:bg-brand-dark">
          Get Captio AI
        </a>
      </div>
    </main>
  );
}
