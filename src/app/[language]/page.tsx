import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FaqAccordion from "@/components/FaqAccordion";
import ReviewCarousel from "@/components/ReviewCarousel";
import { languages, getLanguageBySlug } from "@/lib/languages";

export async function generateStaticParams() {
  return languages.map((lang) => ({ language: lang.languageSlug }));
}

type Props = {
  params: Promise<{ language: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { language } = await params;
  const lang = getLanguageBySlug(language);
  if (!lang) return {};
  return {
    title: `${lang.language} Live Captions & Transcription — Captio AI`,
    description: `Captio AI gives deaf and hard of hearing ${lang.language} speakers real-time live captions, live translation, audio transcription, and AI summaries. ${lang.dialectNote}.`,
  };
}

const baseFaqs = [
  {
    q: "Who is Captio AI designed for?",
    a: "Captio AI is built primarily for deaf and hard of hearing people who need to follow spoken conversations in real time. It's also widely used by people with auditory processing disorder, people in noisy environments, language learners, and anyone who finds reading faster or easier than listening.",
  },
  {
    q: "Does Captio AI work in loud places like restaurants, streets, or public transport?",
    a: "Yes. Captio AI is designed for real-world environments — not quiet rooms. It handles background noise from restaurants, street traffic, public transport, and crowded spaces. Point the microphone toward the speaker and captions appear in real time regardless of ambient noise.",
  },
  {
    q: "Does it work when multiple people are talking at once?",
    a: "Yes. Captio AI captions speech as it's spoken — in group conversations, meetings, and social gatherings where multiple people take turns talking. It doesn't require any setup per speaker. Each person's speech is captioned as they speak, so you can follow the full conversation.",
  },
  {
    q: "How fast do captions appear?",
    a: "Captions appear word by word as the person is speaking — not after they finish a sentence. The delay is typically under one second. This makes Captio AI usable in real conversations, not just for reviewing recordings after the fact.",
  },
  {
    q: "What do I need to use Captio AI?",
    a: "An iPhone running iOS. No special hardware, no external microphone required — the built-in iPhone microphone works for most situations. A stable internet connection is needed for Live Captions and Live Translator.",
  },
  {
    q: "Does Captio AI store or share my audio?",
    a: "No. Audio is processed in real time and immediately discarded. Nothing is recorded or stored on any server. Your conversations are never sold and never used to train AI models — ours or anyone else's.",
  },
  {
    q: "Does Captio AI work without an internet connection?",
    a: "Live Captions and Live Translator require an internet connection to process speech in real time. Audio Transcription for uploaded files also requires connectivity. Offline captioning is not currently supported.",
  },
  {
    q: "Is Captio AI free to use?",
    a: "Captio AI has a free tier that lets you get started without any payment. A Plus plan is available for users who need unlimited access. See the Pricing page for current plan details.",
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

export default async function LanguagePage({ params }: Props) {
  const { language } = await params;
  const lang = getLanguageBySlug(language);
  if (!lang) notFound();

  const allFaqs = [...(lang.languageFAQs ?? []), ...baseFaqs];

  const useCaseItems = [
    { label: "Everyday Conversations", slug: "everyday-conversations", icon: "💬", description: `Most ${lang.language} conversations happen fast, at normal pace, without warning. Captio AI captions every word as it's spoken, so you can follow without asking anyone to repeat themselves.` },
    { label: "Communicating with Deaf & HoH", slug: "deaf-hoh-communication", icon: "🤟", description: `Hearing people often don't know how to adapt when talking with deaf or hard of hearing ${lang.language} speakers. Captio AI turns their speech into real-time captions, so the conversation can happen naturally on both sides.` },
    { label: "Meetings", slug: "meetings", icon: "💼", description: `In ${lang.language} meetings, decisions happen fast and people talk over each other. Captio AI captions every speaker as they talk, so you never miss a decision or a question directed at you.` },
    { label: "Lectures", slug: "lectures", icon: "🎓", description: `${lang.language} lecturers speak quickly, cover complex material, and rarely repeat themselves. Captio AI gives you a live transcript of everything said, so you can follow the content instead of straining to hear it.` },
    { label: "Doctor Appointments", slug: "doctor-appointments", icon: "🏥", description: `Doctors speak quickly in ${lang.language} and use clinical language that's easy to mishear. Captio AI shows you everything they say in real time, so you can follow your diagnosis and ask the right questions.` },
    { label: "Job Interviews", slug: "job-interviews", icon: "🤝", description: `Missing a question in a ${lang.language} interview means answering wrong or asking for a repeat. Captio AI shows you every word the interviewer says, so you can focus entirely on your answer.` },
    { label: "Phone & Video Calls", slug: "phone-video-calls", icon: "📱", description: `${lang.language} phone and video calls are harder to follow than in-person conversations. No lip reading, often poor audio quality. Captio AI captions whoever is speaking in real time, so you do not need to ask for repeats.` },
    { label: "Group Settings", slug: "group-settings", icon: "👥", description: `In ${lang.language} group conversations, multiple people talk at once and the thread moves fast. Captio AI keeps up with whoever is speaking, so you can follow without losing where the conversation is going.` },
    { label: "Restaurants & Cafes", slug: "restaurants", icon: "🍽️", description: `Background noise in ${lang.language}-speaking restaurants and cafes makes speech hard to follow. Captio AI focuses on whoever is speaking to you, so you can have a real conversation through the noise.` },
    { label: "Traveling", slug: "traveling", icon: "✈️", description: `In ${lang.language}-speaking cities, airports, and hotels there is no margin for mishearing. Captio AI captions speech in real time, so you can navigate confidently wherever you go.` },
    { label: "Conferences & Events", slug: "conferences", icon: "🎤", description: `At ${lang.language} conferences, speakers are far away, acoustics are unpredictable, and you cannot ask for a repeat. Captio AI gives you a live transcript of every speaker, so you can follow the full event from any seat.` },
    { label: "TV & Media", slug: "tv-media", icon: "📺", description: `Built-in subtitles on ${lang.language} TV, films, and videos are often wrong, delayed, or missing. Captio AI captions whatever is playing in real time, so you are not dependent on what the content provides.` },
  ];

  const schemaOrg = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "SoftwareApplication",
        name: "Captio AI",
        applicationCategory: "AccessibilityApplication",
        operatingSystem: "iOS",
        description: `Real-time live captions, live translation, audio transcription, and AI summaries for ${lang.language} speakers. ${lang.dialectNote}.`,
        url: `https://captioai.app/${lang.languageSlug}`,
        offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
      },
      {
        "@type": "FAQPage",
        mainEntity: allFaqs.map((faq) => ({
          "@type": "Question",
          name: faq.q,
          acceptedAnswer: { "@type": "Answer", text: faq.a },
        })),
      },
    ],
  };

  const features = [
    {
      label: "LIVE CAPTIONS",
      title: `Real-Time ${lang.language} Speech to Text`,
      bullets: [
        `${lang.language} captions appear word by word while the person is still speaking`,
        `Works in noisy places — restaurants, hallways, busy streets`,
        `${lang.dialectNote}`,
        `No need to face the speaker or watch their lips`,
      ],
      href: "/live-captions",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
          <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" strokeWidth="2" />
          <path d="M19 10v2a7 7 0 0 1-14 0v-2" strokeWidth="2" />
          <path d="m12 19 0 3" strokeWidth="2" />
        </svg>
      ),
    },
    {
      label: "LIVE TRANSLATOR",
      title: `Translate ${lang.language} in Real Time`,
      bullets: [
        `Translate ${lang.language} to English or 60+ other languages continuously as people speak`,
        `Each person speaks their own language — you read in ${lang.language}`,
        `Handles mid-sentence language switches automatically`,
        `${lang.dialectNote}`,
      ],
      href: "/live-translator",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
          <path d="m5 8 6 6" strokeWidth="2" />
          <path d="m4 14 6-6 2-3" strokeWidth="2" />
          <path d="M2 5h12" strokeWidth="2" />
          <path d="M7 2h1" strokeWidth="2" />
          <path d="m22 22-5-10-5 10" strokeWidth="2" />
          <path d="M14 18h6" strokeWidth="2" />
        </svg>
      ),
    },
    {
      label: "AUDIO TRANSCRIPTION",
      title: `Transcribe Any ${lang.language} Audio or Video`,
      bullets: [
        `Upload ${lang.language} audio and video files — lectures, meetings, voicemails, podcasts`,
        `Full ${lang.language} transcript organized by speaker, not one continuous block`,
        `Accurate for ${lang.dialectNote.toLowerCase()}`,
        `Ready to read, copy, search, or share`,
      ],
      href: "/audio-transcription",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" strokeWidth="2" />
          <path d="m17 8-5-5-5 5" strokeWidth="2" />
          <path d="m12 3 0 12" strokeWidth="2" />
        </svg>
      ),
    },
    {
      label: "AI SUMMARY",
      title: `Turn ${lang.language} Transcripts into Summaries`,
      bullets: [
        `Key points and decisions from ${lang.language} meetings surfaced automatically`,
        `Action items pulled out so nothing gets missed`,
        `Works on any Captio AI ${lang.language} transcript`,
        `Organized into sections, not one continuous block`,
      ],
      href: "/ai-summary",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
          <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z" strokeWidth="2" />
          <path d="M20 3v4" strokeWidth="2" />
          <path d="M22 5h-4" strokeWidth="2" />
          <path d="M4 17v2" strokeWidth="2" />
          <path d="M5 18H3" strokeWidth="2" />
        </svg>
      ),
    },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaOrg) }}
      />
      <main>
        <Header />

        {/* ── Hero ── */}
        <section className="pt-6 pb-4 sm:pt-10 sm:pb-10 px-5">
          <div className="max-w-3xl mx-auto flex flex-col items-center text-center gap-4 sm:gap-6">
            <span className="text-[11px] font-bold text-brand uppercase tracking-widest mt-2 sm:mt-0">
              🦻 Accessibility + 💻 Productivity App
            </span>
            <h1 className="text-[2.4rem] leading-[1.15] sm:text-6xl font-bold text-gray-900 tracking-tight">
              <span className="bg-brand text-white px-3 py-1 rounded-[8px] inline-block">{lang.language}</span>{" "}
              <span className="underline decoration-brand decoration-4 underline-offset-4">live captions</span>{" "}
              and{" "}
              <span className="underline decoration-brand decoration-4 underline-offset-4">productivity tool</span>{" "}
              for deaf and HoH people.
            </h1>
            <p className="text-base sm:text-lg text-gray-500 max-w-xl leading-relaxed">
              Follow any {lang.language} conversation, meeting or lecture. {lang.dialectNote}.
            </p>
            <div id="download" className="bg-white rounded-xl border border-gray-100 shadow-sm px-8 py-6 flex items-center gap-8">
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
            <div className="mt-6 sm:mt-10">
              <Image
                src="/mockup_app.png"
                alt={`Captio AI app showing live captions in ${lang.language}`}
                width={400}
                height={340}
                className="w-[280px] sm:w-[400px] h-auto mx-auto drop-shadow-2xl"
                priority
              />
            </div>
          </div>
        </section>

        {/* ── Features ── */}
        <section id="features" className="pt-8 pb-10 sm:pt-10 sm:pb-12 px-6 bg-white">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-7">
              <span className="text-xs font-bold text-cta uppercase tracking-widest">Features</span>
              <h2 className="text-3xl font-bold text-gray-900 tracking-tight mt-3">
                Everything you need to follow any {lang.language} conversation
              </h2>
              <p className="text-gray-500 mt-3 max-w-xl mx-auto">
                Four tools built specifically for deaf and hard of hearing {lang.language} speakers.
              </p>
            </div>
            <div className="grid sm:grid-cols-2 gap-5">
              {features.map((f) => (
                <Link
                  key={f.title}
                  href={f.href}
                  className="group bg-brand p-8 rounded-xl hover:opacity-95 transition-all flex flex-col gap-5"
                >
                  <div className="flex items-center gap-3">
                    <div className="text-cta">{f.icon}</div>
                    <span className="text-xs font-bold text-cta uppercase tracking-wide">{f.label}</span>
                  </div>
                  <h3 className="text-xl font-bold text-white leading-snug">{f.title}</h3>
                  <ul className="flex flex-col gap-2 flex-1">
                    {f.bullets.map((b) => (
                      <li key={b} className="flex items-start gap-2 text-sm text-white/80">
                        <span className="mt-1 w-1.5 h-1.5 rounded-full bg-white/50 shrink-0" />
                        {b}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-2">
                    <span className="inline-flex items-center gap-1 bg-white text-brand text-sm font-semibold px-5 py-2.5 rounded-[8px]">
                      Explore
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                        <path d="m9 18 6-6-6-6" strokeWidth="2" />
                      </svg>
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ── Use Cases ── */}
        <section id="use-cases" className="py-10 px-6 bg-gray-50">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-7">
              <span className="text-xs font-bold text-cta uppercase tracking-widest">Use Cases</span>
              <h2 className="text-3xl font-bold text-gray-900 tracking-tight mt-3">
                Works in every situation
              </h2>
              <p className="text-gray-500 mt-3 max-w-xl mx-auto">
                Designed for the real moments that matter — not just quiet controlled environments.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {useCaseItems.map((uc) => (
                <Link
                  key={uc.slug}
                  href={`/use-cases/${uc.slug}/${lang.languageSlug}`}
                  className="group bg-white rounded-xl border border-gray-200 p-5 hover:border-brand hover:shadow-md transition-all flex flex-col gap-3 relative"
                >
                  <span className="inline-flex items-center gap-2 bg-brand-light text-brand font-bold px-3.5 py-2 rounded-[8px] w-fit">
                    <span className="text-2xl leading-none">{uc.icon}</span>
                    <span className="text-base">{uc.label}</span>
                  </span>
                  <p className="text-sm text-gray-500 leading-relaxed">{uc.description}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ── Inline CTA ── */}
        <div className="py-8 flex flex-col items-center gap-2 bg-gray-50">
          <p className="text-xs text-gray-400 font-medium tracking-wide uppercase">Download for free</p>
          <AppStoreButton />
        </div>

        {/* ── Dialect & Accent Support ── */}
        <section className="py-10 px-6 bg-white">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-7">
              <span className="text-xs font-bold text-cta uppercase tracking-widest">Dialect & Accent Support</span>
              <h2 className="text-3xl font-bold text-gray-900 tracking-tight mt-3">
                {lang.language} dialect & accent support
              </h2>
              <p className="text-gray-500 mt-3 max-w-xl mx-auto">
                {lang.dialectNote}.
              </p>
            </div>
            {lang.dialectCards ? (
              <div className="grid sm:grid-cols-2 gap-4">
                {lang.dialectCards.map((card) => (
                  <div key={card.name} className="bg-gray-50 rounded-[8px] px-5 py-4">
                    <h3 className="font-bold text-gray-900 mb-1">{card.name}</h3>
                    <p className="text-sm text-gray-500 leading-relaxed">{card.description}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-500 max-w-xl mx-auto">{lang.dialectNote}.</p>
            )}
          </div>
        </section>

        {/* ── Languages ── */}
        <section id="languages" className="py-10 px-6 bg-white">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-7">
              <span className="text-xs font-bold text-cta uppercase tracking-widest">Languages</span>
              <h2 className="text-3xl font-bold text-gray-900 tracking-tight mt-3">
                Captio AI supports 60+ languages
              </h2>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {languages.map((l) => (
                <Link
                  key={l.languageSlug}
                  href={`/${l.languageSlug}`}
                  className={`flex items-center gap-2 px-4 py-3 border rounded-[8px] text-base font-bold transition-colors ${
                    l.languageSlug === lang.languageSlug
                      ? "bg-brand text-white border-brand"
                      : "bg-white text-gray-900 border-brand hover:bg-brand-light hover:text-brand"
                  }`}
                >
                  <span className="text-base">{l.flag}</span>
                  {l.language}
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ── Inline CTA ── */}
        <div className="py-8 flex flex-col items-center gap-2 bg-white">
          <p className="text-xs text-gray-400 font-medium tracking-wide uppercase">Download for free</p>
          <AppStoreButton />
        </div>

        {/* ── Trust ── */}
        <section id="privacy" className="py-10 px-6 bg-brand">
          <div className="max-w-3xl mx-auto text-center">
            <span className="text-xs font-bold text-cta uppercase tracking-widest">Privacy</span>
            <h2 className="text-3xl font-bold text-white tracking-tight mt-3 mb-2">
              What you hear stays with you.
            </h2>
            <div className="mb-8" />
            <div className="grid sm:grid-cols-3 gap-4 mb-10">
              {[
                {
                  title: "Gone the moment it ends",
                  description: `Captio AI processes your ${lang.language} audio in real time and discards it immediately. Nothing is recorded. Nothing is kept.`,
                },
                {
                  title: "Not a product",
                  description: "Your conversations are not something Captio AI sells, shares, or monetizes — to anyone, for any reason.",
                },
                {
                  title: "Not used to train anything",
                  description: `What you say in a ${lang.language} doctor's appointment or job interview never ends up in a training dataset. Not ours. Not anyone else's.`,
                },
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

        {/* ── Community Note ── */}
        {lang.communityNote && (
          <section className="py-10 px-6 bg-white">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-7">
                <span className="text-xs font-bold text-cta uppercase tracking-widest">Accessibility</span>
                <h2 className="text-3xl font-bold text-gray-900 tracking-tight mt-3">
                  Hearing accessibility for {lang.language} speakers
                </h2>
              </div>
              <div className="flex flex-wrap justify-center gap-2 mb-8">
                {lang.communityNote.signLanguages.split(" · ").map((sl) => (
                  <span key={sl} className="bg-brand/10 text-brand text-sm font-medium px-3 py-1.5 rounded-[8px]">
                    {sl}
                  </span>
                ))}
              </div>
              <div className="max-w-2xl mx-auto space-y-3">
                {lang.communityNote.paragraphs.map((p, i) => (
                  <div key={i} className="bg-gray-50 rounded-[8px] px-5 py-4">
                    <p className="text-sm text-gray-600 leading-relaxed">{p}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {lang.communityNote && (
          <div className="py-8 flex flex-col items-center gap-2 bg-white">
            <p className="text-xs text-gray-400 font-medium tracking-wide uppercase">Download for free</p>
            <AppStoreButton />
          </div>
        )}

        {/* ── Testimonials ── */}
        <section className="py-10 bg-white overflow-hidden">
          <div className="max-w-6xl mx-auto px-6 mb-7">
            <div className="text-center">
              <span className="text-xs font-bold text-cta uppercase tracking-widest">Reviews</span>
              <h2 className="text-3xl font-bold text-gray-900 tracking-tight mt-3">People love Captio AI</h2>
            </div>
          </div>
          <ReviewCarousel reviews={lang.reviews} />
        </section>

        {/* ── Inline CTA after testimonials ── */}
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
            <FaqAccordion faqs={allFaqs} />
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="pt-10 pb-20 px-6 bg-gray-50">
          <div className="max-w-2xl mx-auto flex flex-col items-center gap-6">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight text-center">
              Start captioning in {lang.language}
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
      </main>
      <Footer />
    </>
  );
}
