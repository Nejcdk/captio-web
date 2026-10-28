import DocumentLanguage from "@/components/DocumentLanguage";
import { DEFAULT_LOCALE, getLocale } from "@/i18n/locales";

// Wraps a translated page. The lang and dir attributes are on this element as
// well as <html> so they are right in the server HTML too; display: contents
// keeps the page's layout exactly as in English. font-intl adds Plus Jakarta
// Sans's accented-Latin and Vietnamese letters (globals.css).
export default function LocaleShell({ code, children }: { code: string; children: React.ReactNode }) {
  if (code === DEFAULT_LOCALE) return <>{children}</>;
  const rtl = Boolean(getLocale(code).rtl);
  return (
    <div lang={code} dir={rtl ? "rtl" : "ltr"} className="contents font-intl">
      <DocumentLanguage lang={code} rtl={rtl} />
      {children}
    </div>
  );
}
