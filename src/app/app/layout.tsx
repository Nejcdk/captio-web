import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./app.css";

// captioai.app/app: Captio AI on the computer. Google Sans, the app's own font
// (OFL, ./fonts), cut down to Latin so each weight is ~40 KB.
const googleSans = localFont({
  src: [
    { path: "./fonts/GoogleSans-400Regular.woff2", weight: "400", style: "normal" },
    { path: "./fonts/GoogleSans-400Regular_Italic.woff2", weight: "400", style: "italic" },
    { path: "./fonts/GoogleSans-500Medium.woff2", weight: "500", style: "normal" },
    { path: "./fonts/GoogleSans-600SemiBold.woff2", weight: "600", style: "normal" },
    { path: "./fonts/GoogleSans-700Bold.woff2", weight: "700", style: "normal" },
  ],
  variable: "--font-app",
  display: "swap",
});

export const metadata: Metadata = {
  title: { absolute: "Captio AI" },
  description: "Your Captio AI recordings on your computer: captions, summaries and folders.",
  robots: { index: false, follow: false },
};

export const viewport: Viewport = { themeColor: "#FFFFFF" };

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return <div className={googleSans.variable}>{children}</div>;
}
