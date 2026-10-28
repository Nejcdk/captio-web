import Image from "next/image";
import Link from "next/link";
import Header from "@/components/Header";
import BackButton from "@/components/BackButton";
import Footer from "@/components/Footer";
import { DownloadCard, StoreButtons } from "@/components/StoreButtons";
import FaqAccordion from "@/components/FaqAccordion";
import { features } from "@/lib/features";
import { SITE_URL, jsonLd, softwareApplicationSchema, faqPageSchema, breadcrumbSchema } from "@/lib/schema";

// The layout of the feature pages (/live-captions and the others): a
// three-step "How it works" with phone mockups, feature cards, privacy, FAQ
// and the download card. Pages added after the first four pass their content
// in; the first four still carry the same markup inline.

export type FeatureStep = { title: string; desc: string; img: string; alt: string };
export type FeatureCard = { title: string; description: string };
export type FeatureFaq = { q: string; a: string };

export type FeaturePageProps = {
  slug: string;
  name: string;
  schemaDescription: string;
  stepsHeading: string;
  steps: FeatureStep[];
  featuresHeading: string;
  featuresIntro?: string;
  subfeatures: FeatureCard[];
  privacyHeading: string;
  privacy: FeatureCard[];
  faqs: FeatureFaq[];
};

function InlineCta({ className = "py-8" }: { className?: string }) {
  return (
    <div className={`${className} flex flex-col items-center gap-2 bg-white`}>
      <p className="text-xs text-gray-400 font-medium tracking-wide uppercase">Download for free</p>
      <StoreButtons />
    </div>
  );
}

export default function FeaturePage(p: FeaturePageProps) {
  const schemaOrg = jsonLd(
    softwareApplicationSchema({ url: `${SITE_URL}/${p.slug}`, description: p.schemaDescription }),
    faqPageSchema(p.faqs),
    breadcrumbSchema([
      { name: "Home", path: "/" },
      { name: p.name, path: `/${p.slug}` },
    ]),
  );
  const others = features.filter((f) => f.slug !== p.slug);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaOrg) }} />
      <main>
        <Header />

        {/* ── Nav bar ── */}
        <div className="px-6 pt-6 pb-3 sm:pt-10 bg-white">
          <div className="max-w-6xl mx-auto flex items-center justify-center gap-4">
            <BackButton label="Back" />
            <span className="text-sm font-medium text-gray-500">{p.name}</span>
          </div>
        </div>

        {/* ── Hero ── */}
        <section className="pt-2 pb-4 sm:pt-4 sm:pb-6 px-5 bg-white">
          <div className="max-w-3xl mx-auto flex flex-col items-center text-center">
            <h1 className="text-[2.4rem] leading-[1.15] sm:text-6xl font-bold text-gray-900 tracking-tight">
              {p.name}
            </h1>
          </div>
        </section>

        {/* ── How it works ── */}
        <section className="pt-4 pb-10 px-6 bg-white">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-10">
              <span className="text-xs font-bold text-cta uppercase tracking-widest">How it works</span>
              <h2 className="text-3xl font-bold text-gray-900 tracking-tight mt-3">{p.stepsHeading}</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-10">
              {p.steps.map((item, i) => (
                <div key={item.title} className="flex flex-col items-center text-center gap-3">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-brand">{i + 1}.</span>
                    <h3 className="font-bold text-gray-900 text-sm sm:text-base">{item.title}</h3>
                  </div>
                  <p className="text-xs sm:text-sm text-gray-500 leading-relaxed">{item.desc}</p>
                  <Image
                    src={item.img}
                    alt={item.alt}
                    width={240}
                    height={480}
                    className="w-full max-w-[160px] sm:max-w-[200px] h-auto drop-shadow-lg"
                  />
                </div>
              ))}
            </div>
          </div>
        </section>

        <InlineCta className="py-6" />

        {/* ── Subfeatures ── */}
        <section className="py-10 px-6 bg-white">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-8">
              <span className="text-xs font-bold text-cta uppercase tracking-widest">Features</span>
              <h2 className="text-3xl font-bold text-gray-900 tracking-tight mt-3">{p.featuresHeading}</h2>
              {p.featuresIntro && <p className="text-gray-500 mt-3 max-w-xl mx-auto">{p.featuresIntro}</p>}
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {p.subfeatures.map((sf) => (
                <div key={sf.title} className="bg-gray-50 rounded-xl p-5 flex flex-col gap-2 border border-gray-100">
                  <h3 className="font-bold text-gray-900 text-base leading-snug">{sf.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{sf.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <InlineCta />

        {/* ── Privacy ── */}
        <section className="py-10 px-6 bg-brand">
          <div className="max-w-3xl mx-auto text-center">
            <span className="text-xs font-bold text-cta uppercase tracking-widest">Privacy</span>
            <h2 className="text-3xl font-bold text-white tracking-tight mt-3 mb-8">{p.privacyHeading}</h2>
            <div className="grid sm:grid-cols-3 gap-4 mb-10">
              {p.privacy.map((item) => (
                <div key={item.title} className="bg-white/10 backdrop-blur rounded-xl p-6 border border-white/20 text-left">
                  <h3 className="font-semibold text-white mb-1">{item.title}</h3>
                  <p className="text-sm text-blue-100 leading-relaxed">{item.description}</p>
                </div>
              ))}
            </div>
            <div className="flex justify-center">
              <Image
                src="/privacy.png"
                alt="Private by default: never sold, never used for training"
                width={160}
                height={160}
                className="drop-shadow-2xl"
              />
            </div>
          </div>
        </section>

        <InlineCta />

        {/* ── FAQ ── */}
        <section className="py-10 px-6 bg-gray-50">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-7">
              <span className="text-xs font-bold text-cta uppercase tracking-widest">FAQ</span>
              <h2 className="text-3xl font-bold text-gray-900 tracking-tight mt-3">Frequently asked questions</h2>
            </div>
            <FaqAccordion faqs={p.faqs} />
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="pt-10 pb-20 px-6 bg-gray-50">
          <div className="max-w-2xl mx-auto flex flex-col items-center gap-6">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight text-center">Get started</h2>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest text-center">
              Captio AI is free to start
            </p>
            <DownloadCard id="download" className="w-full" />
          </div>
        </section>

        {/* ── Other features ── */}
        <section className="py-10 px-6 bg-white border-t border-gray-100">
          <div className="max-w-2xl mx-auto flex flex-col items-center gap-4 text-center">
            <p className="text-sm text-gray-500 leading-relaxed">
              Captio AI also includes{" "}
              {others.map((f, i) => (
                <span key={f.slug}>
                  <Link href={`/${f.slug}`} className="text-brand font-semibold hover:underline">{f.label}</Link>
                  {i < others.length - 2 ? ", " : i === others.length - 2 ? " and " : "."}
                </span>
              ))}
            </p>
            <BackButton label="Go back" />
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
