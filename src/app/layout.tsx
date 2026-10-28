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

// The same font's accented Latin (Polish, Czech, Turkish…) and Vietnamese
// letters, used only on the translated pages (.font-intl in globals.css), ahead
// of the font above: the browser takes each letter from the first font that has
// it, and downloads these only when a page contains such a letter.
const jakartaLatinExt = localFont({
  src: "./fonts/PlusJakartaSans-latin-ext-variable.woff2",
  variable: "--font-jakarta-latin-ext",
  weight: "200 800",
  display: "swap",
  preload: false,
  adjustFontFallback: false,
  declarations: [{ prop: "unicode-range", value: "U+0100-02BA, U+02BD-02C5, U+02C7-02CC, U+02CE-02D7, U+02DD-02FF, U+0304, U+0308, U+0329, U+1D00-1DBF, U+1E00-1E9F, U+1EF2-1EFF, U+2020, U+20A0-20AB, U+20AD-20C4, U+2113, U+2C60-2C7F, U+A720-A7FF" }],
});
const jakartaVietnamese = localFont({
  src: "./fonts/PlusJakartaSans-vietnamese-variable.woff2",
  variable: "--font-jakarta-vietnamese",
  weight: "200 800",
  display: "swap",
  preload: false,
  adjustFontFallback: false,
  declarations: [{ prop: "unicode-range", value: "U+0102-0103, U+0110-0111, U+0128-0129, U+0168-0169, U+01A0-01A1, U+01AF-01B0, U+0300-0301, U+0303-0304, U+0308-0309, U+0323, U+0329, U+1EA0-1EF9, U+20AB" }],
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
    // suppressHydrationWarning: a translated page sets lang (and dir) before
    // hydration (components/DocumentLanguage.tsx).
    <html lang="en" className={`${googleSans.variable} ${jakartaLatinExt.variable} ${jakartaVietnamese.variable} h-full`} suppressHydrationWarning>
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
