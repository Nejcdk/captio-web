import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Audio Transcription",
  description:
    "Upload audio or video files and get an accurate transcript. Captio AI audio transcription for deaf and hard of hearing people. 60+ languages.",
};

export default function AudioTranscriptionPage() {
  return (
    <main className="max-w-5xl mx-auto px-6 py-16">
      <h1 className="text-3xl font-bold mb-4">Audio Transcription</h1>
      <p className="text-gray-600">Feature page coming soon.</p>
    </main>
  );
}
