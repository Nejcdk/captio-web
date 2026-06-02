export type Feature = {
  slug: string;
  label: string;
  description: string;
};

export const features: Feature[] = [
  {
    slug: "live-captions",
    label: "Live Captions",
    description: "Real-time speech to text via microphone",
  },
  {
    slug: "live-translator",
    label: "Live Translator",
    description: "Real-time translation across 60+ languages",
  },
  {
    slug: "audio-transcription",
    label: "Audio Transcription",
    description: "Upload audio or video files and get a full transcript",
  },
  {
    slug: "ai-summary",
    label: "AI Summary",
    description: "Structured summaries from any transcript",
  },
];

export function getFeatureBySlug(slug: string): Feature | undefined {
  return features.find((f) => f.slug === slug);
}
