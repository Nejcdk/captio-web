import type { Metadata } from "next";
import Image from "next/image";
import Header from "@/components/Header";
import BackButton from "@/components/BackButton";
import Footer from "@/components/Footer";
import FaqAccordion from "@/components/FaqAccordion";

export const metadata: Metadata = {
  title: "Live Translator — Captio AI",
  description:
    "Real-time speech translation on your iPhone. The person speaks their language, you read in yours — instantly, in any language. Built for deaf and hard of hearing people.",
};

const subfeatures = [
  {
    title: "Any language",
    description: "French, Japanese, Arabic, Spanish, German, Mandarin — 60+ languages, any direction. Hearing loss is never also a language barrier.",
  },
  {
    title: "Auto-detects the spoken language",
    description: "Leave the source language on auto and Captio AI figures it out from the first words. No manual selection before each conversation.",
  },
  {
    title: "No delay",
    description: "Translation latency is well under a second. You read what someone says at the same moment everyone else hears it, not after they finish the sentence.",
  },
  {
    title: "Add language hints",
    description: "Tell Captio AI which language to expect and it starts tuned in from the first word — useful when the spoken language is not obvious from context.",
  },
  {
    title: "Multiple languages at the same time",
    description: "When people switch languages mid-conversation, Captio AI keeps up — translating each into your language without any manual intervention.",
  },
  {
    title: "Read it your way",
    description: "Adjust background color, text color, and font size so the translation is easy to read at a glance, whether the phone is in your hand or flat on a table.",
  },
];

const faqs = [
  {
    q: "How is Live Translator different from Live Captions?",
    a: "Live Captions transcribes speech in the original spoken language. Live Translator takes that speech and translates it into your chosen language in real time. If the other person speaks French and you read English, Live Translator is what you use.",
  },
  {
    q: "How accurate is the translation?",
    a: "Translation accuracy is high for common language pairs in everyday conversation. Captio AI handles natural speech — fast talkers, accents, background noise — not just clean studio audio. For rare language pairs or highly technical content, accuracy may vary.",
  },
  {
    q: "Which languages are supported?",
    a: "60+ languages including English, Spanish, French, German, Mandarin, Arabic, Hindi, Japanese, Korean, Portuguese, Russian, and many more. Both the source and target language can be any of the supported languages.",
  },
  {
    q: "How fast does the translation appear?",
    a: "Latency is well under a second. You read the translation word by word while the person is still speaking — close to real time, not after they finish the sentence.",
  },
  {
    q: "Does it work for doctor appointments with a foreign-speaking doctor?",
    a: "Yes. This is one of the most important use cases. Place your phone on the desk, set the source language to the doctor's language, and read everything they say in your language in real time. You can also save the translated transcript to review their instructions afterward.",
  },
  {
    q: "Does it work in noisy places?",
    a: "Yes. Captio AI is built for real environments — waiting rooms, restaurants, airports. Point the microphone toward the speaker and translation appears regardless of ambient noise.",
  },
  {
    q: "Can I save the translated transcript?",
    a: "Yes. After a session you can save the translated text and review it later. Useful for medical appointments, meetings, and any conversation you want a record of.",
  },
  {
    q: "Do I need an internet connection?",
    a: "Yes. Live Translator requires an internet connection to process and translate speech in real time. Offline translation is not currently supported.",
  },
];

const AppStoreButton = () => (
  <a
    href="#"
    className="inline-flex items-center gap-3 bg-cta text-white font-semibold px-7 py-4 rounded-[8px] hover:bg-cta-dark transition-colors"
  >
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 shrink-0">
      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98l-.09.06c-.22.14-2.2 1.28-2.18 3.81.03 3.02 2.65 4.03 2.68 4.04l-.05.17ZM13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11Z" />
    </svg>
    <span>
      <span className="block text-xs font-normal opacity-75 leading-none mb-1">Download on the</span>
      <span className="block text-lg font-bold leading-none">App Store</span>
    </span>
  </a>
);

const schemaOrg = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "SoftwareApplication",
      name: "Captio AI",
      applicationCategory: "AccessibilityApplication",
      operatingSystem: "iOS",
      description: "Real-time speech translation for deaf and hard of hearing people. 60+ languages, each person speaks their own language, you read in yours.",
      url: "https://captioai.app/live-translator",
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    },
    {
      "@type": "FAQPage",
      mainEntity: faqs.map((faq) => ({
        "@type": "Question",
        name: faq.q,
        acceptedAnswer: { "@type": "Answer", text: faq.a },
      })),
    },
  ],
};

export default function LiveTranslatorPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaOrg) }} />
      <main>
        <Header />

        {/* ── Hero ── */}
        {/* ── Nav bar ── */}
        <div className="px-6 pt-6 pb-3 sm:pt-10 bg-white">
          <div className="max-w-6xl mx-auto flex items-center justify-center gap-4">
            <BackButton label="Back" />
            <span className="text-sm font-medium text-gray-500">Live Translator</span>
          </div>
        </div>

        <section className="pt-2 pb-10 sm:pt-4 sm:pb-16 px-5 bg-white">
          <div className="max-w-3xl mx-auto flex flex-col items-center text-center gap-4 sm:gap-6">
            <h1 className="text-[2.4rem] leading-[1.15] sm:text-6xl font-bold text-gray-900 tracking-tight">
              Live Translator
            </h1>

            <p className="text-base sm:text-lg text-gray-500 max-w-xl leading-relaxed">
              They speak their language. You read in yours. In real time, while they are still talking. No interpreter, no gap, no asking anyone to slow down.
            </p>

            <div className="bg-white rounded-xl border border-gray-100 shadow-sm px-8 py-6 flex items-center gap-8">
              <div className="hidden sm:block p-3 bg-white border border-gray-200 rounded-xl">
                <div className="w-24 h-24 bg-gray-50 rounded-lg flex items-center justify-center text-gray-300 text-[10px] text-center leading-tight">
                  QR<br/>coming soon
                </div>
              </div>
              <div className="flex flex-col gap-2 items-center">
                <p className="text-xs text-gray-400 font-medium tracking-wide uppercase">Download for free</p>
                <AppStoreButton />
              </div>
            </div>

          </div>
        </section>

        {/* ── How it works ── */}
        <section className="py-10 px-6 bg-gray-50">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-10">
              <span className="text-xs font-bold text-cta uppercase tracking-widest">How it works</span>
              <h2 className="text-3xl font-bold text-gray-900 tracking-tight mt-3">
                Three taps. Any language.
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-10">
              {[
                { step: "1", title: "Choose translator mode", desc: "Open Captio AI and select Live Translator.", img: "/LT_mockup_1.png" },
                { step: "2", title: "Select the preferred language", desc: "Pick the language you want to read in.", img: "/LT_mockup_2.png" },
                { step: "3", title: "See translation in real time", desc: "Captio AI translates word by word.", img: "/LT_mockup_3.png" },
              ].map((item) => (
                <div key={item.step} className="flex flex-col items-center text-center gap-3">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-brand">{item.step}.</span>
                    <h3 className="font-bold text-gray-900 text-sm sm:text-base">{item.title}</h3>
                  </div>
                  <p className="text-xs sm:text-sm text-gray-500 leading-relaxed">{item.desc}</p>
                  <Image
                    src={item.img}
                    alt={item.title}
                    width={240}
                    height={480}
                    className="w-full max-w-[160px] sm:max-w-[200px] h-auto drop-shadow-lg"
                  />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Subfeatures / Benefits ── */}
        <section className="py-10 px-6 bg-white">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-8">
              <span className="text-xs font-bold text-cta uppercase tracking-widest">Features</span>
              <h2 className="text-3xl font-bold text-gray-900 tracking-tight mt-3">
                Built for real conversations
              </h2>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {subfeatures.map((sf) => (
                <div key={sf.title} className="bg-gray-50 rounded-xl p-5 flex flex-col gap-2 border border-gray-100">
                  <h3 className="font-bold text-gray-900 text-base leading-snug">{sf.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{sf.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Inline CTA ── */}
        <div className="py-8 flex flex-col items-center gap-2 bg-white">
          <p className="text-xs text-gray-400 font-medium tracking-wide uppercase">Download for free</p>
          <a
            href="#"
            className="inline-flex items-center gap-3 bg-cta text-white font-semibold px-7 py-4 rounded-[8px] hover:bg-cta-dark transition-colors"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 shrink-0">
              <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98l-.09.06c-.22.14-2.2 1.28-2.18 3.81.03 3.02 2.65 4.03 2.68 4.04l-.05.17ZM13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11Z" />
            </svg>
            <span>
              <span className="block text-xs font-normal opacity-75 leading-none mb-1">Download on the</span>
              <span className="block text-lg font-bold leading-none">App Store</span>
            </span>
          </a>
        </div>

        {/* ── Privacy ── */}
        <section className="py-10 px-6 bg-brand">
          <div className="max-w-3xl mx-auto text-center">
            <span className="text-xs font-bold text-cta uppercase tracking-widest">Privacy</span>
            <h2 className="text-3xl font-bold text-white tracking-tight mt-3 mb-8">
              What you hear stays with you.
            </h2>
            <div className="grid sm:grid-cols-3 gap-4 mb-10">
              {[
                { title: "Gone the moment it ends", description: "Captio AI processes your audio in real time and discards it immediately. Nothing is recorded. Nothing is kept." },
                { title: "Not a product", description: "Your conversations are not something Captio AI sells, shares, or monetizes — to anyone, for any reason." },
                { title: "Not used to train anything", description: "What you say in a doctor's appointment or a job interview never ends up in a training dataset. Not ours. Not anyone else's." },
              ].map((item) => (
                <div key={item.title} className="bg-white/10 backdrop-blur rounded-xl p-6 border border-white/20 text-left">
                  <h3 className="font-semibold text-white mb-1">{item.title}</h3>
                  <p className="text-sm text-blue-100 leading-relaxed">{item.description}</p>
                </div>
              ))}
            </div>
            <div className="flex justify-center">
              <svg width="160" height="179" viewBox="0 0 200 224" xmlns="http://www.w3.org/2000/svg">
                <path d="M100 14 L172 38 V100 C172 142 140 174 100 188 C60 174 28 142 28 100 V38 Z" fill="white" fillOpacity="0.15"/>
                <path d="M100 14 L172 38 V100 C172 142 140 174 100 188 C60 174 28 142 28 100 V38 Z" fill="none" stroke="white" strokeOpacity="0.4" strokeWidth="2"/>
                <path d="M100 28 L160 48 V100 C160 136 132 162 100 174 C68 162 40 136 40 100 V48 Z" fill="none" stroke="white" strokeOpacity="0.3" strokeWidth="1.5"/>
                <path d="M72 100 L92 120 L132 78" fill="none" stroke="white" strokeWidth="9" strokeLinecap="round" strokeLinejoin="round"/>
                <rect x="36" y="198" width="128" height="26" rx="13" fill="white" fillOpacity="0.2" stroke="white" strokeOpacity="0.4" strokeWidth="1.5"/>
                <text x="100" y="216" textAnchor="middle" fontFamily="sans-serif" fontSize="11" fontWeight="700" fill="white" letterSpacing="1.6">100% PRIVATE</text>
              </svg>
            </div>
          </div>
        </section>

        {/* ── Inline CTA ── */}
        <div className="py-8 flex flex-col items-center gap-2 bg-white">
          <p className="text-xs text-gray-400 font-medium tracking-wide uppercase">Download for free</p>
          <AppStoreButton />
        </div>

        {/* ── FAQ ── */}
        <section className="py-10 px-6 bg-gray-50">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-7">
              <span className="text-xs font-bold text-cta uppercase tracking-widest">FAQ</span>
              <h2 className="text-3xl font-bold text-gray-900 tracking-tight mt-3">
                Frequently asked questions
              </h2>
            </div>
            <FaqAccordion faqs={faqs} />
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="pt-10 pb-20 px-6 bg-gray-50">
          <div className="max-w-2xl mx-auto flex flex-col items-center gap-6">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight text-center">
              Get started
            </h2>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest text-center">
              Captio AI is free to start
            </p>
            <div className="w-full bg-white rounded-xl border border-gray-100 shadow-sm px-8 py-8 flex flex-col items-center gap-6">
              <div className="flex items-center gap-8">
                <div className="hidden sm:block p-3 bg-white border border-gray-200 rounded-xl">
                  <div className="w-24 h-24 bg-gray-50 rounded-lg flex items-center justify-center text-gray-300 text-[10px] text-center leading-tight">
                    QR<br/>coming soon
                  </div>
                </div>
                <div className="flex flex-col gap-2 items-center">
                  <p className="text-xs text-gray-400 font-medium tracking-wide uppercase">Download for free</p>
                  <AppStoreButton />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Other features ── */}
        <section className="py-10 px-6 bg-white border-t border-gray-100">
          <div className="max-w-2xl mx-auto flex flex-col items-center gap-4 text-center">
            <p className="text-sm text-gray-500">Captio AI includes Live Captions, Live Translator, Audio Transcription, and AI Summary.</p>
            <BackButton label="Go back" />
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
