import FeatureContent from "@/components/FeatureContent";
import en from "@/i18n/messages/en.json";
import { featureMetadata } from "@/i18n/metadata";

// English feature page. Its words live in src/i18n/messages/en.json; the
// translations are served at /<code>/audio-transcription by [language]/[feature]/page.tsx.
export const metadata = featureMetadata("en", en, "audio-transcription");

export default function AudioTranscriptionPage() {
  return <FeatureContent code="en" m={en} feature="audio-transcription" />;
}
