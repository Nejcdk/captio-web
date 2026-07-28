import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pricing",
  description: "Captio pricing — free and Plus plans for live captions and transcription.",
  alternates: { canonical: "/pricing" },
  openGraph: {
    title: "Pricing — Captio AI",
    description: "Captio pricing — free and Plus plans for live captions and transcription.",
    url: "/pricing",
    type: "website",
    images: ["/opengraph-image"],
  },
};

export default function PricingPage() {
  return (
    <main className="max-w-5xl mx-auto px-6 py-16">
      <h1 className="text-3xl font-bold mb-4">Pricing</h1>
      <p className="text-gray-600">Content coming soon.</p>
    </main>
  );
}
