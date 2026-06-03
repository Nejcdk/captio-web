import type { Metadata } from "next";
import { languages } from "@/lib/languages";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Languages",
  description: "Captio supports 60+ languages for live captions, translation, and transcription.",
};

export default function LanguagesPage() {
  return (
    <main className="max-w-5xl mx-auto px-6 py-16">
      <h1 className="text-3xl font-bold mb-4">Supported Languages</h1>
      <p className="text-gray-600 mb-8">Captio supports 60+ languages for live captions and translation.</p>
      <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {languages.map((lang) => (
          <li key={lang.languageSlug}>
            <Link
              href={`/live-captions/meetings/${lang.languageSlug}`}
              className="block p-3 rounded-lg border border-gray-200 hover:border-brand hover:text-brand transition-colors text-sm font-medium"
            >
              {lang.language}
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
