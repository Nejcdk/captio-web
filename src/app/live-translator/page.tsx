import type { Metadata } from "next";
import Image from "next/image";
import Header from "@/components/Header";
import BackButton from "@/components/BackButton";
import Footer from "@/components/Footer";
import { DownloadCard, StoreButtons } from "@/components/StoreButtons";
import FaqAccordion from "@/components/FaqAccordion";

import { SITE_URL, jsonLd, softwareApplicationSchema, faqPageSchema, breadcrumbSchema } from "@/lib/schema";

export const metadata: Metadata = {
  title: "Live Translator: Real-Time Speech Translation on iPhone",
  description:
    "Real-time speech translation on your iPhone. The person speaks their language, you read in yours — instantly, in any language. Built for deaf and hard of hearing people.",
  alternates: { canonical: "/live-translator" },
  openGraph: {
    title: "Live Translator: Real-Time Speech Translation on iPhone | Captio AI",
    description:
      "Real-time speech translation on your iPhone. The person speaks their language, you read in yours — instantly, in any language. Built for deaf and hard of hearing people.",
    url: "/live-translator",
    type: "website",
    images: ["/opengraph-image"],
  },
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


const schemaOrg = jsonLd(
  softwareApplicationSchema({
    url: `${SITE_URL}/live-translator`,
    description: "Real-time speech translation for deaf and hard of hearing people. 60+ languages, each person speaks their own language, you read in yours.",
  }),
  faqPageSchema(faqs),
  breadcrumbSchema([
    { name: "Home", path: "/" },
    { name: "Live Translator", path: "/live-translator" },
  ]),
);

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

        <section className="pt-2 pb-4 sm:pt-4 sm:pb-6 px-5 bg-white">
          <div className="max-w-3xl mx-auto flex flex-col items-center text-center">
            <h1 className="text-[2.4rem] leading-[1.15] sm:text-6xl font-bold text-gray-900 tracking-tight">
              Live Translator
            </h1>
          </div>
        </section>

        {/* ── How it works ── */}
        <section className="pt-4 pb-10 px-6 bg-white">
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

        {/* ── Inline CTA (post how-it-works) ── */}
        <div className="py-6 flex flex-col items-center gap-2 bg-white">
          <p className="text-xs text-gray-400 font-medium tracking-wide uppercase">Download for free</p>
          <StoreButtons />
        </div>

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
          <StoreButtons />
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
              <Image
                src="/privacy.png"
                alt="Private by default — your audio is discarded, never sold, never used for training"
                width={160}
                height={160}
                className="drop-shadow-2xl"
              />
            </div>
          </div>
        </section>

        {/* ── Inline CTA ── */}
        <div className="py-8 flex flex-col items-center gap-2 bg-white">
          <p className="text-xs text-gray-400 font-medium tracking-wide uppercase">Download for free</p>
          <StoreButtons />
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
            <DownloadCard id="download" className="w-full" />
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
