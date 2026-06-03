import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Captio AI privacy policy — how we handle your data.",
};

export default function PrivacyPage() {
  return (
    <main className="max-w-3xl mx-auto px-6 py-16">
      <h1 className="text-3xl font-bold mb-2">Privacy Policy</h1>
      <p className="text-sm text-gray-500 mb-12">Last updated: June 2025</p>
      <p className="text-gray-600">Content coming soon.</p>
    </main>
  );
}
