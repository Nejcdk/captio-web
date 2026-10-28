import HomeContent from "@/components/HomeContent";
import en from "@/i18n/messages/en.json";
import { homeMetadata } from "@/i18n/metadata";

// The English home page. Its words live in src/i18n/messages/en.json; the
// translations are served at /<code> by [language]/page.tsx.
export const metadata = homeMetadata("en", en);

export default function HomePage() {
  return <HomeContent code="en" m={en} />;
}
