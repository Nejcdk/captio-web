import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { jsonLd, organizationSchema, websiteSchema } from "@/lib/schema";
import { Analytics } from "@vercel/analytics/next";

// Plus Jakarta Sans, served from the repo (variable font, latin, OFL licence in
// ./fonts). Self-hosted so the build never downloads anything: the daily blog
// job builds the site in a sandbox without access to Google Fonts.
const googleSans = localFont({
  src: "./fonts/PlusJakartaSans-latin-variable.woff2",
  variable: "--font-google-sans",
  weight: "200 800",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Captio AI — Live Captions & Transcription for Deaf and Hard of Hearing",
    template: "%s | Captio AI",
  },
  description:
    "Captio AI provides real-time live captions, live translation, audio transcription, and AI summaries for deaf and hard of hearing people. iPhone and Android app. 60+ languages.",
  metadataBase: new URL("https://captioai.app"),
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  openGraph: {
    siteName: "Captio AI",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${googleSans.variable} h-full`}>
      <body className="min-h-full flex flex-col">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLd(organizationSchema, websiteSchema)),
          }}
        />
        {children}
        <Analytics />
      </body>
    </html>
  );
}
