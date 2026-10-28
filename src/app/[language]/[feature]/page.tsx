import type { Metadata } from "next";
import { notFound } from "next/navigation";
import FeatureContent from "@/components/FeatureContent";
import { FEATURE_SLUGS, getMessages, isFeatureSlug } from "@/i18n";
import { LOCALE_CODES, isLocale } from "@/i18n/locales";
import { featureMetadata } from "@/i18n/metadata";

// A feature page in another language: /de/live-captions. The [language] segment
// is shared with the English language pages (/german); only language codes
// have feature pages under it.

export const dynamicParams = false;

export async function generateStaticParams() {
  return LOCALE_CODES.flatMap((language) => FEATURE_SLUGS.map((feature) => ({ language, feature })));
}

type Props = {
  params: Promise<{ language: string; feature: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { language, feature } = await params;
  if (!isLocale(language) || !isFeatureSlug(feature)) return {};
  return featureMetadata(language, await getMessages(language), feature);
}

export default async function TranslatedFeaturePage({ params }: Props) {
  const { language, feature } = await params;
  if (!isLocale(language) || !isFeatureSlug(feature)) notFound();
  return <FeatureContent code={language} m={await getMessages(language)} feature={feature} />;
}
