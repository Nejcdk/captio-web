import type { Metadata } from "next";
import { useCases, getUseCaseBySlug } from "@/lib/useCases";
import { notFound } from "next/navigation";

type Props = { params: Promise<{ useCase: string }> };

export async function generateStaticParams() {
  return useCases.map((uc) => ({ useCase: uc.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { useCase } = await params;
  const uc = getUseCaseBySlug(useCase);
  if (!uc) return {};
  return {
    title: `Live Captions for ${uc.label}`,
    description: `Captio AI provides real-time live captions for deaf and hard of hearing people during ${uc.label.toLowerCase()}. iPhone app. 60+ languages.`,
  };
}

export default async function LiveCaptionsUseCasePage({ params }: Props) {
  const { useCase } = await params;
  const uc = getUseCaseBySlug(useCase);
  if (!uc) notFound();

  return (
    <main className="max-w-5xl mx-auto px-6 py-16">
      <h1 className="text-3xl font-bold mb-4">Live Captions for {uc.label}</h1>
      <p className="text-gray-600">Use case page coming soon.</p>
    </main>
  );
}
