import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Live Captions",
  description:
    "Real-time live captions for deaf and hard of hearing people. Captio AI converts speech to text instantly via your iPhone microphone. 60+ languages.",
};

export default function LiveCaptionsPage() {
  return (
    <main className="max-w-5xl mx-auto px-6 py-16">
      <h1 className="text-3xl font-bold mb-4">Live Captions</h1>
      <p className="text-gray-600">Feature page coming soon.</p>
    </main>
  );
}
