import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const googleSans = Plus_Jakarta_Sans({
  variable: "--font-google-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Captio AI — Live Captions & Transcription for Deaf and Hard of Hearing",
    template: "%s | Captio AI",
  },
  description:
    "Captio AI provides real-time live captions, live translation, audio transcription, and AI summaries for deaf and hard of hearing people. iOS app. 60+ languages.",
  metadataBase: new URL("https://captioai.app"),
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
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
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
