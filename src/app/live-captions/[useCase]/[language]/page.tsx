import type { Metadata } from "next";
import { useCases, getUseCaseBySlug } from "@/lib/useCases";
import { languages, getLanguageBySlug } from "@/lib/languages";
import { notFound } from "next/navigation";

type Props = { params: Promise<{ useCase: string; language: string }> };

export async function generateStaticParams() {
  return useCases.flatMap((uc) =>
    languages.map((lang) => ({
      useCase: uc.slug,
      language: lang.languageSlug,
    }))
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { useCase, language } = await params;
  const uc = getUseCaseBySlug(useCase);
  const lang = getLanguageBySlug(language);
  if (!uc || !lang) return {};
  return {
    title: `Live Captions for ${uc.label} in ${lang.language}`,
    description: `Captio AI provides real-time ${lang.language} live captions for deaf and hard of hearing people during ${uc.label.toLowerCase()}. iPhone app.`,
  };
}

export default async function LiveCaptionsLanguagePage({ params }: Props) {
  const { useCase, language } = await params;
  const uc = getUseCaseBySlug(useCase);
  const lang = getLanguageBySlug(language);
  if (!uc || !lang) notFound();

  return (
    <main className="max-w-5xl mx-auto px-6 py-16">
      <h1 className="text-3xl font-bold mb-4">
        Live Captions for {uc.label} in {lang.language}
      </h1>
      <p className="text-gray-600">Language use case page coming soon.</p>
    </main>
  );
}
