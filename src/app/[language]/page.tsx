import { languages, getLanguageBySlug } from "@/lib/languages";
import { notFound } from "next/navigation";

export async function generateStaticParams() {
  return languages.map((lang) => ({ language: lang.languageSlug }));
}

type Props = {
  params: Promise<{ language: string }>;
};

export default async function LanguagePage({ params }: Props) {
  const { language } = await params;
  const lang = getLanguageBySlug(language);
  if (!lang) notFound();

  return (
    <main>
      <h1>{lang.language} — stub</h1>
    </main>
  );
}
