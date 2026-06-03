import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Captio — Live Captions & Transcription for Deaf and Hard of Hearing",
  description:
    "Captio gives deaf and hard of hearing people real-time live captions, live translation, audio transcription, and AI summaries — right on their iPhone. 60+ languages.",
};

const features = [
  {
    label: "LIVE CAPTIONS",
    title: "Real-Time Speech to Text",
    description:
      "Point your iPhone at any speaker and read what they say instantly. No lag, no effort — captions appear as fast as people speak.",
    href: "/live-captions",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6" stroke="currentColor" strokeWidth={1.8}>
        <path d="M12 18.5a6.5 6.5 0 1 0 0-13 6.5 6.5 0 0 0 0 13Z" strokeLinecap="round" />
        <path d="M8 12h2m4 0h2" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    label: "LIVE TRANSLATOR",
    title: "Translate Any Language in Real Time",
    description:
      "Follow conversations in 60+ languages instantly. Hear Spanish, read English — or any combination you need.",
    href: "/live-translator",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6" stroke="currentColor" strokeWidth={1.8}>
        <path d="M5 8h6M5 12h4m9-4-4 8m0-8 4 8M3 20l3-8 3 8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    label: "AUDIO TRANSCRIPTION",
    title: "Transcribe Any Audio or Video File",
    description:
      "Upload a recording and get a clean, accurate transcript in minutes. Lectures, meetings, podcasts — anything.",
    href: "/audio-transcription",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6" stroke="currentColor" strokeWidth={1.8}>
        <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2M9 5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2M9 5a2 2 0 0 0 2-2h2a2 2 0 0 0 2 2" strokeLinecap="round" />
        <path d="M9 12h6M9 16h4" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    label: "AI SUMMARY",
    title: "Turn Transcripts into Structured Summaries",
    description:
      "Key points, action items, and decisions — extracted automatically from any transcript.",
    href: "/ai-summary",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6" stroke="currentColor" strokeWidth={1.8}>
        <path d="M9 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2h-4M9 3a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2M9 3h6" strokeLinecap="round" />
        <path d="m9 13 2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
];

const useCases = [
  { label: "Face-to-Face", href: "/live-captions/face-to-face" },
  { label: "Group Settings", href: "/live-captions/group-settings" },
  { label: "Meetings", href: "/live-captions/meetings" },
  { label: "Lectures", href: "/live-captions/lectures" },
  { label: "Doctor Appointments", href: "/live-captions/doctor-appointments" },
  { label: "Traveling", href: "/live-captions/traveling" },
  { label: "TV & Media", href: "/live-captions/tv-media" },
];

const languages = [
  "Spanish", "French", "German", "Italian", "Portuguese",
  "Dutch", "Russian", "Japanese", "Korean", "Chinese",
  "Arabic", "Hindi", "Turkish", "Polish", "Swedish",
  "Norwegian", "Danish", "Finnish", "Greek", "Ukrainian",
];

const testimonials = [
  {
    quote: "Captio changed how I navigate everyday life. I can follow conversations at work, at restaurants, everywhere — without asking people to repeat themselves.",
    name: "Sarah M.",
    detail: "Hard of hearing since birth",
  },
  {
    quote: "I use it in every lecture. The captions are fast enough that I don't fall behind. My professors don't even need to know.",
    name: "James L.",
    detail: "University student, deaf",
  },
  {
    quote: "Finally an app that works in German too. I was using English tools with poor accuracy. Captio is accurate and instant.",
    name: "Anna K.",
    detail: "Hard of hearing, Germany",
  },
];

const faqs = [
  {
    q: "Who is Captio designed for?",
    a: "Captio is built primarily for deaf and hard of hearing people who need to follow spoken conversations in real time. It's also used by people in noisy environments, language learners, and anyone who prefers reading over listening.",
  },
  {
    q: "Which languages does Captio support?",
    a: "Captio supports 60+ languages for live captions and translation, including Spanish, French, German, Japanese, Chinese, Arabic, Hindi, and many more. See the full list on the Languages page.",
  },
  {
    q: "Is my audio stored or shared?",
    a: "No. Captio processes audio in real time via Soniox. Conversations are never stored on any server. Your data is never sold and never used for AI training.",
  },
  {
    q: "Does Captio work without an internet connection?",
    a: "Live captioning requires an internet connection to process audio via Soniox. Audio Transcription for uploaded files also requires connectivity.",
  },
  {
    q: "What's the difference between Live Captions and Live Translator?",
    a: "Live Captions transcribes speech in the original language. Live Translator takes that speech and translates it into your chosen language in real time — useful when the speaker and the listener speak different languages.",
  },
];

const schemaOrg = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "SoftwareApplication",
      name: "Captio",
      applicationCategory: "AccessibilityApplication",
      operatingSystem: "iOS",
      description: "Real-time live captions, live translation, audio transcription, and AI summaries for deaf and hard of hearing people. 60+ languages.",
      url: "https://captioai.app",
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
      inLanguage: "en",
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

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaOrg) }}
      />
      <main>
      {/* ── Gradient wrapper: header + hero share one background ── */}
      <Header />

        {/* ── Hero ── */}
        <section className="pt-6 pb-10 sm:pt-16 sm:pb-24 px-5">
          <div className="max-w-3xl mx-auto flex flex-col items-center text-center gap-4 sm:gap-6">
            <span className="text-[11px] font-bold text-brand uppercase tracking-widest mt-4 sm:mt-0">
              Accessibility + Productivity App
            </span>

            <h1 className="text-[2.4rem] leading-[1.15] sm:text-6xl font-bold text-gray-900 tracking-tight">
              <span className="underline decoration-brand decoration-4 underline-offset-4">Live captions</span> and{" "}
              <span className="underline decoration-brand decoration-4 underline-offset-4">productivity tool</span>{" "}
              for deaf and HoH people.
            </h1>

            <p className="text-base sm:text-lg text-gray-500 max-w-xl leading-relaxed">
              Follow any conversation, meeting or lecture — in any language.
            </p>

            <div id="download">
              <a
                href="#"
                className="inline-flex items-center gap-2 bg-brand text-white font-semibold px-6 py-3.5 rounded-[14px] text-sm shadow-lg hover:bg-brand-dark transition-colors"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98l-.09.06c-.22.14-2.2 1.28-2.18 3.81.03 3.02 2.65 4.03 2.68 4.04l-.05.17ZM13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11Z" />
                </svg>
                Download
              </a>
            </div>

            {/* Phone mockup */}
            <div className="mt-6 sm:mt-10">
              <div className="w-[200px] h-[400px] sm:w-[260px] sm:h-[520px] bg-gray-900 rounded-[36px] sm:rounded-[44px] border-4 border-gray-800 shadow-2xl flex flex-col overflow-hidden mx-auto">
                <div className="flex justify-between items-center px-6 pt-4 pb-2">
                  <span className="text-white text-xs font-medium">9:41</span>
                  <div className="flex gap-1">
                    <div className="w-3 h-1.5 bg-white rounded-sm" />
                    <div className="w-1 h-1.5 bg-white/50 rounded-sm" />
                  </div>
                </div>
                <div className="flex-1 bg-black px-4 py-2 flex flex-col gap-3">
                  <div className="text-brand text-xs font-semibold text-center py-2">● LIVE</div>
                  <div className="flex-1 bg-gray-900 rounded-2xl p-4 flex flex-col gap-3 justify-end">
                    <div className="bg-gray-800 rounded-xl p-3">
                      <p className="text-white text-sm leading-relaxed">"Good morning everyone, today we're going to discuss the quarterly results..."</p>
                    </div>
                    <div className="bg-brand rounded-xl p-3">
                      <p className="text-white text-sm leading-relaxed">"The numbers look great. Revenue is up 24% compared to last quarter."</p>
                    </div>
                    <div className="h-1 w-16 bg-white/20 rounded-full animate-pulse mx-auto" />
                  </div>
                </div>
                <div className="flex justify-center py-2 bg-black">
                  <div className="w-24 h-1 bg-white/30 rounded-full" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Features ── */}
        <section className="py-24 px-6 bg-white">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-14">
              <span className="text-xs font-bold text-brand uppercase tracking-widest">Features</span>
              <h2 className="text-3xl font-bold text-gray-900 tracking-tight mt-3">
                Everything you need to follow any conversation
              </h2>
              <p className="text-gray-500 mt-3 max-w-xl mx-auto">
                Four tools built specifically for deaf and hard of hearing people — all in one app.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-5">
              {features.map((f) => (
                <Link
                  key={f.title}
                  href={f.href}
                  className="group bg-white p-8 rounded-2xl border border-gray-200 hover:border-brand hover:shadow-md transition-all"
                >
                  <span className="inline-block text-xs font-bold text-brand bg-brand-light px-3 py-1 rounded-full mb-5 tracking-wide">
                    {f.label}
                  </span>
                  <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-brand transition-colors">
                    {f.title}
                  </h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{f.description}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ── Use Cases ── */}
        <section className="py-24 px-6 bg-gray-50">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-14">
              <span className="text-xs font-bold text-brand uppercase tracking-widest">Use Cases</span>
              <h2 className="text-3xl font-bold text-gray-900 tracking-tight mt-3">
                Works in every situation
              </h2>
              <p className="text-gray-500 mt-3 max-w-xl mx-auto">
                Designed for the real moments that matter — not just quiet controlled environments.
              </p>
            </div>

            <div className="flex flex-wrap justify-center gap-3">
              {useCases.map((uc) => (
                <Link
                  key={uc.label}
                  href={uc.href}
                  className="px-5 py-3 rounded-full border border-gray-200 bg-white text-sm font-medium text-gray-700 hover:border-brand hover:text-brand hover:bg-brand-light transition-colors shadow-sm"
                >
                  {uc.label}
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ── Languages ── */}
        <section className="py-24 px-6 bg-white">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-14">
              <span className="text-xs font-bold text-brand uppercase tracking-widest">Languages</span>
              <h2 className="text-3xl font-bold text-gray-900 tracking-tight mt-3">
                60+ languages, every accent
              </h2>
              <p className="text-gray-500 mt-3 max-w-xl mx-auto">
                Captio handles regional dialects and accents — not just textbook speech.
              </p>
            </div>

            <div className="flex flex-wrap justify-center gap-2 mb-8">
              {languages.map((lang) => (
                <Link
                  key={lang}
                  href={`/live-captions/meetings/${lang.toLowerCase()}`}
                  className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-full text-sm text-gray-600 hover:bg-brand-light hover:text-brand hover:border-brand transition-colors font-medium"
                >
                  {lang}
                </Link>
              ))}
            </div>

            <div className="text-center">
              <Link href="/live-captions" className="text-sm font-semibold text-brand hover:underline">
                See all supported languages →
              </Link>
            </div>
          </div>
        </section>

        {/* ── Trust ── */}
        <section className="py-24 px-6 bg-brand">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-14">
              <span className="text-xs font-bold text-white/60 uppercase tracking-widest">Privacy</span>
              <h2 className="text-3xl font-bold text-white tracking-tight mt-3">
                Your conversations stay private
              </h2>
              <p className="text-blue-200 mt-3 max-w-xl mx-auto">
                Captio was built around trust. What you say never leaves your control.
              </p>
            </div>

            <div className="grid sm:grid-cols-3 gap-5">
              {[
                {
                  title: "Never stored",
                  description: "Audio is processed in real time via Soniox and immediately discarded. No recordings are kept on any server.",
                },
                {
                  title: "Never sold",
                  description: "Your data is your data. Captio does not sell, share, or monetize any information about you or your conversations.",
                },
                {
                  title: "Not used for AI training",
                  description: "Your conversations are never used to train AI models — ours or anyone else's.",
                },
              ].map((item) => (
                <div key={item.title} className="bg-white/10 backdrop-blur rounded-2xl p-8 border border-white/20">
                  <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center mb-5">
                    <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5 text-white" stroke="currentColor" strokeWidth={2}>
                      <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-white mb-2">{item.title}</h3>
                  <p className="text-sm text-blue-100 leading-relaxed">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Testimonials ── */}
        <section className="py-24 px-6 bg-white">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-14">
              <span className="text-xs font-bold text-brand uppercase tracking-widest">Reviews</span>
              <h2 className="text-3xl font-bold text-gray-900 tracking-tight mt-3">What users say</h2>
            </div>

            <div className="grid sm:grid-cols-3 gap-5">
              {testimonials.map((t) => (
                <div key={t.name} className="p-8 rounded-2xl border border-gray-200 bg-white shadow-sm flex flex-col gap-4">
                  <div className="flex gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <svg key={i} viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-brand">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <p className="text-gray-700 text-sm leading-relaxed flex-1">"{t.quote}"</p>
                  <div>
                    <div className="font-semibold text-gray-900 text-sm">{t.name}</div>
                    <div className="text-gray-400 text-xs mt-0.5">{t.detail}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── FAQ ── */}
        <section className="py-24 px-6 bg-gray-50">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-14">
              <span className="text-xs font-bold text-brand uppercase tracking-widest">FAQ</span>
              <h2 className="text-3xl font-bold text-gray-900 tracking-tight mt-3">
                Frequently asked questions
              </h2>
            </div>

            <div className="flex flex-col gap-4">
              {faqs.map((faq) => (
                <div key={faq.q} className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                  <h3 className="font-semibold text-gray-900 mb-2">{faq.q}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="py-24 px-6 bg-white">
          <div className="max-w-3xl mx-auto text-center flex flex-col items-center gap-6">
            <span className="text-xs font-bold text-brand uppercase tracking-widest">Get Started</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight">
              Start following every conversation
            </h2>
            <p className="text-gray-500 max-w-md">
              Free to download. No account required. Live captions start the moment you open the app.
            </p>
            <a
              href="#"
              className="inline-flex items-center gap-2 bg-brand text-white font-semibold px-8 py-4 rounded-full hover:bg-brand-dark transition-colors text-sm shadow-lg shadow-brand/30"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98l-.09.06c-.22.14-2.2 1.28-2.18 3.81.03 3.02 2.65 4.03 2.68 4.04l-.05.17ZM13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11Z" />
              </svg>
              Download on App Store
            </a>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
