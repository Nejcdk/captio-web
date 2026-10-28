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
    slug: "ai-actions",
    label: "AI Actions",
    description: "Summary, key points, detailed notes, to-dos, questions and answers, or a follow-up message from any recording",
  },
  {
    slug: "export",
    label: "Export",
    description: "Share captions or a summary as text, a link, a PDF, an email or an AI chat prompt",
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
    slug: "recognize-sounds",
    label: "Recognize Sounds",
    description: "A doorbell, an alarm or a crying baby shows in your captions, and alerts make your phone vibrate (version 1.1.5)",
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
