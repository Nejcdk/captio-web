import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Live Translator",
  description:
    "Real-time live translation for deaf and hard of hearing people. Captio translates speech instantly across 60+ languages on iPhone.",
};

export default function LiveTranslatorPage() {
  return (
    <main className="max-w-5xl mx-auto px-6 py-16">
      <h1 className="text-3xl font-bold mb-4">Live Translator</h1>
      <p className="text-gray-600">Feature page coming soon.</p>
    </main>
  );
}
