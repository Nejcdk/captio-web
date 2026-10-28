"use client";

import { useEffect } from "react";

// The root layout renders <html lang="en">, and every page but the translated
// ones is English. A translated page corrects it: the inline script before the
// first paint on a full page load, the effect on navigations inside the site
// (and English is put back when the reader leaves the page).
export default function DocumentLanguage({ lang, rtl }: { lang: string; rtl: boolean }) {
  useEffect(() => {
    const html = document.documentElement;
    html.lang = lang;
    if (rtl) html.dir = "rtl";
    else html.removeAttribute("dir");
    return () => {
      html.lang = "en";
      html.removeAttribute("dir");
    };
  }, [lang, rtl]);

  const set = `document.documentElement.lang=${JSON.stringify(lang)};${rtl ? 'document.documentElement.dir="rtl";' : ""}`;
  return (
    <script
      // React warns about <script> rendered on the client; it only has to run
      // from the server HTML (Next.js "preventing flash" guide).
      type={typeof window === "undefined" ? "text/javascript" : "text/plain"}
      suppressHydrationWarning
      dangerouslySetInnerHTML={{ __html: set }}
    />
  );
}
