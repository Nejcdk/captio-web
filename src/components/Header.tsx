import HeaderBar from "@/components/HeaderBar";
import en from "@/i18n/messages/en.json";
import { pagePath, type LanguageOption, type Messages } from "@/i18n";

// The site header. English-only pages call it as <Header />; the translated
// pages pass their language, its labels and the language menu's links.
export default function Header({
  code = "en",
  t = en.header,
  languages,
}: {
  code?: string;
  t?: Messages["header"];
  languages?: LanguageOption[];
}) {
  return <HeaderBar code={code} t={t} homeHref={pagePath(code, "home")} languages={languages} />;
}
