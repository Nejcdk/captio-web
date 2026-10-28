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
  {
    slug: "folders",
    label: "Folders",
    description: "Sort recordings into folders and share a folder with family, classmates or a team",
  },
  {
    slug: "recognize-voices",
    label: "Recognize Voices",
    description: "Captions show the names of people you talk to often instead of Speaker 2",
  },
  {
    slug: "speaker-direction",
    label: "Speaker Direction",
    description: "Waves at the edge of the captions show where the voice is coming from (iPhone 16 and later)",
  },
  {
    slug: "connectors",
    label: "Connectors",
    description: "Ask Claude, ChatGPT, Gemini or Perplexity about your recordings",
  },
  {
    slug: "widgets",
    label: "Widgets",
    description: "Start live captions from the iPhone Home Screen or Lock Screen in one tap",
  },
];

export function getFeatureBySlug(slug: string): Feature | undefined {
  return features.find((f) => f.slug === slug);
}
