import FeatureContent from "@/components/FeatureContent";
import en from "@/i18n/messages/en.json";
import { featureMetadata } from "@/i18n/metadata";

// English feature page. Its words live in src/i18n/messages/en.json; the
// translations are served at /<code>/live-captions by [language]/[feature]/page.tsx.
export const metadata = featureMetadata("en", en, "live-captions");

export default function LiveCaptionsPage() {
  return <FeatureContent code="en" m={en} feature="live-captions" />;
}
