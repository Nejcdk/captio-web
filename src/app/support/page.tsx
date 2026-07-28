import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Support",
  description: "Get help with Captio — FAQs, contact, and troubleshooting.",
  alternates: { canonical: "/support" },
  openGraph: {
    title: "Support — Captio AI",
    description: "Get help with Captio — FAQs, contact, and troubleshooting.",
    url: "/support",
    type: "website",
    images: ["/opengraph-image"],
  },
};

export default function SupportPage() {
  return (
    <main className="max-w-3xl mx-auto px-6 py-16">
      <h1 className="text-3xl font-bold mb-4">Support</h1>
      <p className="text-gray-600">Content coming soon.</p>
    </main>
  );
}
