import Link from "next/link";
import { useCases } from "@/lib/useCases";
import type { Language } from "@/lib/languages";
import { LOCALES } from "@/i18n/locales";

// On a use-case × language page: the other eleven situations in the same
// language, the language's own page, and the site in that language. These are
// the links that tie the 720 pages, the 60 language pages and the translated
// site together (each page already lists the 60 languages for its use case).
export default function MoreSituations({ lang, current }: { lang: Language; current: string }) {
  const locale = LOCALES.find((l) => l.slug === lang.languageSlug);
  return (
    <section className="py-10 px-6 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-7">
          <span className="text-xs font-bold text-cta uppercase tracking-widest">{lang.language}</span>
          <h2 className="text-3xl font-bold text-gray-900 tracking-tight mt-3">Other situations in {lang.language}</h2>
          <p className="text-gray-500 mt-3 max-w-xl mx-auto">
            One page per situation: why {lang.language} is hard to follow there, the numbers on hearing loss where it is spoken, and the questions people ask.
          </p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {useCases
            .filter((uc) => uc.slug !== current)
            .map((uc) => (
              <Link
                key={uc.slug}
                href={`/use-cases/${uc.slug}/${lang.languageSlug}`}
                className="flex items-center gap-2 px-4 py-3 bg-white border border-gray-200 rounded-[8px] text-sm font-bold text-gray-900 hover:border-brand hover:text-brand transition-colors"
              >
                <span className="text-base">{uc.icon}</span>
                {uc.label}
              </Link>
            ))}
        </div>
        <div className="mt-4 grid sm:grid-cols-2 gap-3">
          <Link href={`/${lang.languageSlug}`} className="bg-white border border-gray-200 rounded-xl p-5 hover:border-brand transition-colors">
            <span className="font-bold text-gray-900">{lang.language} live captions: dialects, accents and sign languages</span>
            <span className="block mt-1 text-sm text-gray-500">{lang.dialectNote}.</span>
          </Link>
          {locale && (
            <Link href={`/${locale.code}`} className="bg-white border border-gray-200 rounded-xl p-5 hover:border-brand transition-colors">
              <span className="font-bold text-gray-900">Captio AI in {lang.language}</span>
              <span className="block mt-1 text-sm text-gray-500">
                <span lang={locale.code}>{locale.native}</span>: captioai.app/{locale.code}
              </span>
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
