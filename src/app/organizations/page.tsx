import type { Metadata } from "next";
import OrganizationsContent from "@/components/organizations/OrganizationsContent";
import { getMessages } from "@/i18n";
import { organizationsMetadata } from "@/i18n/metadata";
import { getOrgMessages } from "@/i18n/organizations";

// Captio AI for Organizations in English. The page itself, and what it's for:
// src/components/organizations/OrganizationsContent.tsx. Other languages:
// src/app/[language]/organizations.

export async function generateMetadata(): Promise<Metadata> {
  return organizationsMetadata("en", await getOrgMessages("en"));
}

export default async function OrganizationsPage() {
  return <OrganizationsContent code="en" t={await getOrgMessages("en")} m={await getMessages("en")} />;
}
