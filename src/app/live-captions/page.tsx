import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FaqAccordion from "@/components/FaqAccordion";

export const metadata: Metadata = {
  title: "Live Captions — Captio AI",
  description:
    "Real-time speech to text via your iPhone microphone. Follow any conversation, in any language, instantly. Built for deaf and hard of hearing people.",
};

const steps = [
  {
    number: "1",
    title: "Open Captio AI and tap Live Captions",
    description:
      "Select Live Captions from the home screen. Choose your language — or leave it on auto-detect.",
  },
  {
    number: "2",
    title: "Point the microphone at the speaker",
    description:
      "Place your phone on the table or hold it toward whoever is speaking. No pairing, no setup — it starts immediately.",
  },
  {
    number: "3",
    title: "Read captions as they appear",
    description:
      "Words appear on screen word by word as the person speaks — not after they finish. Follow the conversation in real time.",
  },
];

const subfeatures = [
  {
    title: "Words that match what was said",
    description: "Captio AI captures what someone actually said, not a rough paraphrase. So you can trust the transcript when it matters — at the doctor, in an interview, in a meeting.",
  },
  {
    title: "Zero latency",
    description: "Latency is well under a second. Captions appear word by word while the person is still speaking, so you read what they say at the same moment everyone else hears it.",
  },
  {
    title: "Know who is talking",
    description: "In groups and meetings, Captio AI labels each speaker separately so you always know who said what, without watching faces or tracking lip movements.",
  },
  {
    title: "60+ languages",
    description: "Follow a conversation in French, Japanese, or Arabic the same way you follow one in English. No switching modes. Hearing loss is never also a language barrier.",
  },
  {
    title: "Handles languages that mix mid-sentence",
    description: "When people switch languages mid-conversation, Captio AI keeps up. No gap in the captions, no mode to switch.",
  },
  {
    title: "Teach it your vocabulary",
    description: "Add names, medical terms, or specialist words you hear often. Captio AI uses your vocabulary list to caption your actual conversations more accurately.",
  },
  {
    title: "Add a language hint",
    description: "Tell Captio AI which language to expect and it starts tuned in from the first word — useful when the spoken language is not obvious from context.",
  },
  {
    title: "Retranscribe later for more accuracy",
    description: "Run any recording through again after the fact for a cleaner transcript. Useful for lectures, appointments, and any conversation worth reviewing.",
  },
  {
    title: "Read it your way",
    description: "Adjust text size, background color, and contrast until captions are easy to read at a glance — phone in hand, flat on a table, or propped on a desk.",
  },
];

const faqs = [
  {
    q: "How is Captio AI different from Apple's built-in Live Captions?",
    a: "Apple's Live Captions support fewer languages, offer no translation, and don't include Audio Transcription or AI Summary. Captio AI supports 60+ languages, provides real-time translation, lets you transcribe uploaded files, and generates AI summaries. It also lets you customise text size, colors, and contrast to match how you read best.",
  },
  {
    q: "How accurate are the live captions?",
    a: "Accuracy is high in typical conversation conditions. Captio AI is built for real speech — not just clean studio audio — so it handles fast talkers, regional accents, background noise, and mixed-language sentences. You can also add custom vocabulary (names, medical terms, specialist words) to improve accuracy for your specific conversations.",
  },
  {
    q: "How fast do captions appear?",
    a: "Word by word, while the person is still speaking. The latency is well under a second — close to real time. You read what someone says at the same moment everyone else hears it, not after they finish the sentence.",
  },
  {
    q: "Does Live Captions work in noisy places?",
    a: "Yes. Captio AI is designed for real environments — restaurants, streets, waiting rooms, public transport. Point the microphone toward the speaker and captions appear regardless of background noise.",
  },
  {
    q: "Which languages does Live Captions support?",
    a: "60+ languages including English, Spanish, French, German, Mandarin, Arabic, Hindi, Japanese, Korean, Portuguese, Russian, and many more. Regional accents and dialects are supported across all major languages.",
  },
  {
    q: "Does it work with accents and dialects?",
    a: "Yes. Captio AI handles a wide range of regional accents — not just standard textbook speech. Australian English, Latin American Spanish, Swiss German, Québécois French, and many others are supported.",
  },
  {
    q: "Can I save my captions?",
    a: "Yes. You can save transcriptions and audio recordings after a session and review them later. You can also retranscribe a saved recording for a cleaner, more accurate transcript.",
  },
  {
    q: "Do I need an internet connection?",
    a: "Yes. Live Captions requires an internet connection to process speech in real time. Offline captioning is not currently supported.",
  },
];

const schemaOrg = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "SoftwareApplication",
      name: "Captio AI",
      applicationCategory: "AccessibilityApplication",
      operatingSystem: "iOS",
      description: "Real-time live captions for deaf and hard of hearing people. 60+ languages, well under a second latency, works anywhere.",
      url: "https://captioai.app/live-captions",
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

export default function LiveCaptionsPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaOrg) }} />
      <main>
        <Header />

        {/* ── Hero ── */}
        <section className="pt-6 pb-10 sm:pt-10 sm:pb-16 px-5 bg-white">
          <div className="max-w-3xl mx-auto flex flex-col items-center text-center gap-4 sm:gap-6">

            {/* Feature breadcrumb */}
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <Link href="/" className="hover:text-brand transition-colors">Captio AI</Link>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
                <path d="m9 18 6-6-6-6" strokeWidth="2" />
              </svg>
              <span className="text-gray-600 font-medium">Live Captions</span>
            </div>

            <h1 className="text-[2.4rem] leading-[1.15] sm:text-6xl font-bold text-gray-900 tracking-tight">
              Live Captions
            </h1>

            <p className="text-base sm:text-lg text-gray-500 max-w-xl leading-relaxed">
              No lip reading. No asking for repeats. Captions appear word by word while the person is still speaking. In any language, in any accent, anywhere.
            </p>

            <div className="bg-white rounded-xl border border-gray-100 shadow-sm px-8 py-6 flex items-center gap-8">
              <div className="hidden sm:block p-3 bg-white border border-gray-200 rounded-xl">
                <div className="w-24 h-24 bg-gray-50 rounded-lg flex items-center justify-center text-gray-300 text-[10px] text-center leading-tight">
                  QR<br/>coming soon
                </div>
              </div>
              <div className="flex flex-col gap-2 items-center">
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
            </div>


          </div>
        </section>

        {/* ── How it works ── */}
        <section className="py-10 px-6 bg-gray-50">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-10">
              <span className="text-xs font-bold text-cta uppercase tracking-widest">How it works</span>
              <h2 className="text-3xl font-bold text-gray-900 tracking-tight mt-3">
                Three taps. Full conversation.
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-10">
              {[
                { step: "1", title: "Start recording", desc: "Press the record button. Captio AI starts listening immediately.", img: "/LC_mockup_1.png" },
                { step: "2", title: "See words appear", desc: "Captions show up word by word while the person is still speaking.", img: "/LC_mockup_4.png" },
                { step: "3", title: "Save it", desc: "Keep the transcription and audio recording for later.", img: "/LC_mockup_3.png" },
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
              </div>
            </div>
          </div>
        </section>

        {/* ── Other features ── */}
        <section className="py-10 px-6 bg-white border-t border-gray-100">
          <div className="max-w-2xl mx-auto flex flex-col items-center gap-4 text-center">
            <p className="text-sm text-gray-500">Captio AI includes Live Captions, Live Translator, Audio Transcription, and AI Summary.</p>
            <Link href="/#features" className="inline-flex items-center gap-1 text-brand font-semibold text-sm hover:underline">
              Learn about other Captio AI features
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                <path d="m9 18 6-6-6-6" strokeWidth="2" />
              </svg>
            </Link>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
