import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI Summary",
  description:
    "Get structured AI summaries from any transcript. Captio AI Summary helps deaf and hard of hearing people quickly understand any recorded content.",
};

export default function AiSummaryPage() {
  return (
    <main className="max-w-5xl mx-auto px-6 py-16">
      <h1 className="text-3xl font-bold mb-4">AI Summary</h1>
      <p className="text-gray-600">Feature page coming soon.</p>
    </main>
  );
}
