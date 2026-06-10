import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import DemoRecorder from "@/components/DemoRecorder";

export const metadata: Metadata = {
  title: "Try Captio AI Live — Real-Time Captions in Any Language",
  description: "Try Captio AI in your browser. Start recording and see real-time captions in any of 60+ languages — no download needed to see how it works.",
};

const AppStoreButton = () => (
  <a
    href="#"
    className="inline-flex items-center gap-3 bg-cta text-white font-semibold px-7 py-4 rounded-[8px] hover:bg-cta-dark transition-colors"
  >
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 shrink-0">
      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98l-.09.06c-.22.14-2.2 1.28-2.18 3.81.03 3.02 2.65 4.03 2.68 4.04l-.05.17ZM13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11Z" />
    </svg>
    <span>
      <span className="block text-xs font-normal opacity-75 leading-none mb-1">Download on the</span>
      <span className="block text-lg font-bold leading-none">App Store</span>
    </span>
  </a>
);

export default function DemoPage() {
  return (
    <>
      <main>
        <Header />

        {/* ── Hero ── */}
        <section className="pt-10 pb-6 px-5 bg-white">
          <div className="max-w-3xl mx-auto flex flex-col items-center text-center gap-3">
            <span className="text-[11px] font-bold text-cta uppercase tracking-widest">Live Demo</span>
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 tracking-tight leading-[1.15]">
              See it work.<br />In any language.
            </h1>
          </div>
        </section>

        {/* ── Demo card ── */}
        <section className="py-6 px-5 bg-white">
          <div className="max-w-3xl mx-auto">
            <DemoRecorder />
          </div>
        </section>

        {/* ── Inline CTA ── */}
        <div className="py-8 flex flex-col items-center gap-2 bg-white">
          <p className="text-xs text-gray-400 font-medium tracking-wide uppercase">Download for free</p>
          <AppStoreButton />
        </div>

        {/* ── Features reminder ── */}
        <section className="py-10 px-5 bg-white">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-7">
              <span className="text-[11px] font-bold text-cta uppercase tracking-widest">Features</span>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight mt-2">
                More than captions.
              </h2>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                { label: "Live Captions", description: "Word by word, as the person speaks. Any accent, any pace, any noise level.", href: "/live-captions" },
                { label: "Live Translator", description: "They speak their language. You read in yours. 60+ languages, no setup.", href: "/live-translator" },
                { label: "Audio Transcription", description: "Upload any audio or video file. Get a full written transcript organised by speaker.", href: "/audio-transcription" },
                { label: "AI Summary", description: "Key points and decisions extracted from any transcript automatically.", href: "/ai-summary" },
              ].map((f) => (
                <Link
                  key={f.label}
                  href={f.href}
                  className="bg-gray-50 border border-gray-100 rounded-xl p-5 flex flex-col gap-2 hover:border-brand/30 hover:bg-brand/5 transition-colors"
                >
                  <h3 className="font-bold text-gray-900 text-base">{f.label}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{f.description}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ── Final CTA ── */}
        <section className="pt-10 pb-20 px-6 bg-gray-50">
          <div className="max-w-2xl mx-auto flex flex-col items-center gap-6">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight text-center">
              Ready for the real thing?
            </h2>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest text-center">
              Captio AI is free to start
            </p>
            <div className="w-full bg-white rounded-xl border border-gray-100 shadow-sm px-8 py-8 flex flex-col items-center gap-6">
              <div className="flex items-center gap-8">
                <div className="hidden sm:block p-3 bg-white border border-gray-200 rounded-xl">
                  <div className="w-24 h-24 bg-gray-50 rounded-lg flex items-center justify-center text-gray-300 text-[10px] text-center leading-tight">
                    QR<br />coming soon
                  </div>
                </div>
                <div className="flex flex-col gap-2 items-center">
                  <p className="text-xs text-gray-400 font-medium tracking-wide uppercase">Download for free</p>
                  <AppStoreButton />
                </div>
              </div>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
