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
    title: `Audio Transcription for ${uc.label}`,
    description: `Captio transcribes audio and video from ${uc.label.toLowerCase()} for deaf and hard of hearing people. Upload any file and get a full transcript.`,
  };
}

export default async function AudioTranscriptionUseCasePage({ params }: Props) {
  const { useCase } = await params;
  const uc = getUseCaseBySlug(useCase);
  if (!uc) notFound();

  return (
    <main className="max-w-5xl mx-auto px-6 py-16">
      <h1 className="text-3xl font-bold mb-4">Audio Transcription for {uc.label}</h1>
      <p className="text-gray-600">Use case page coming soon.</p>
    </main>
  );
}
