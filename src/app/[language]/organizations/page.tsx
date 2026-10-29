import type { Metadata } from "next";
import { notFound } from "next/navigation";
import OrganizationsContent from "@/components/organizations/OrganizationsContent";
import { getMessages } from "@/i18n";
import { LOCALE_CODES, isLocale } from "@/i18n/locales";
import { organizationsMetadata } from "@/i18n/metadata";
import { getOrgMessages } from "@/i18n/organizations";

// Captio AI for Organizations in another language: /de/organizations. The
// [language] segment is shared with the English language pages (/german);
// only language codes have this page.

export const dynamicParams = false;

export async function generateStaticParams() {
  return LOCALE_CODES.map((language) => ({ language }));
}

type Props = { params: Promise<{ language: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { language } = await params;
  if (!isLocale(language)) return {};
  return organizationsMetadata(language, await getOrgMessages(language));
}

export default async function TranslatedOrganizationsPage({ params }: Props) {
  const { language } = await params;
  if (!isLocale(language)) notFound();
  return <OrganizationsContent code={language} t={await getOrgMessages(language)} m={await getMessages(language)} />;
}
