import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FaqAccordion from "@/components/FaqAccordion";
import ReviewCarousel from "@/components/ReviewCarousel";

export const metadata: Metadata = {
  title: "Captio AI — Live Captions & Transcription for Deaf and Hard of Hearing",
  description:
    "Captio AI gives deaf and hard of hearing people real-time live captions, live translation, audio transcription, and AI summaries — right on their phone. 60+ languages.",
};

const features = [
  {
    label: "LIVE CAPTIONS",
    title: "Real-Time Speech to Text",
    bullets: [
      "Word by word, in real time",
      "Works in noisy places",
      "Any accent, any pace",
      "No lip reading needed",
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
    title: "Translate Any Language in Real Time",
    bullets: [
      "Translates as they speak",
      "Each person speaks their own language",
      "Handles mid-sentence switches",
      "60+ languages",
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
    title: "Transcribe Any Audio or Video File",
    bullets: [
      "Any audio or video file",
      "Organized by speaker",
      "60+ languages",
      "Read, copy, search, share",
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
    title: "Turn Transcripts into Structured Summaries",
    bullets: [
      "Key points and decisions",
      "Action items extracted",
      "Works on any transcript",
      "Organized into sections",
    ],
    href: "/ai-summary",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
        <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a0.5 0.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a0.5 0.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a0.5 0.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a0.5 0.5 0 0 1-.963 0z" strokeWidth="2" />
        <path d="M20 3v4" strokeWidth="2" />
        <path d="M22 5h-4" strokeWidth="2" />
        <path d="M4 17v2" strokeWidth="2" />
        <path d="M5 18H3" strokeWidth="2" />
      </svg>
    ),
  },
];

const useCases = [
  {
    label: "Everyday Conversations",
    href: "/use-cases/everyday-conversations",
    description: "Most conversations happen fast, at normal pace, without warning. Captio AI captions every word as it's spoken, so you can follow without asking anyone to repeat themselves.",
    icon: "💬",
  },
  {
    label: "Communicating with Deaf & HoH",
    href: "/use-cases/deaf-hoh-communication",
    description: "Hearing people often don't know how to adapt when talking with deaf or hard of hearing friends. Captio AI turns their speech into real-time captions, so the conversation can happen naturally on both sides.",
    icon: "🤟",
  },
  {
    label: "Meetings",
    href: "/use-cases/meetings",
    description: "In meetings, decisions happen fast and people talk over each other. Captio AI captions every speaker as they talk, so you never miss a decision or a question directed at you.",
    icon: "💼",
  },
  {
    label: "Lectures",
    href: "/use-cases/lectures",
    description: "Lecturers speak quickly, cover complex material, and rarely repeat themselves. Captio AI gives you a live transcript of everything said, so you can follow the content instead of straining to hear it.",
    icon: "🎓",
  },
  {
    label: "Doctor Appointments",
    href: "/use-cases/doctor-appointments",
    description: "Doctors speak quickly and use clinical language that's easy to mishear. Captio AI shows you everything they say in real time, so you can follow your diagnosis and ask the right questions.",
    icon: "🏥",
  },
  {
    label: "Job Interviews",
    href: "/use-cases/job-interviews",
    description: "Missing a question in an interview means answering wrong or asking for a repeat. Captio AI shows you every word the interviewer says, so you can focus entirely on your answer.",
    icon: "🤝",
  },
  {
    label: "Phone & Video Calls",
    href: "/use-cases/phone-video-calls",
    description: "Phone and video calls are harder to follow than in-person conversations. No lip reading, often poor audio quality. Captio AI captions whoever is speaking in real time, so you do not need to ask for repeats.",
    icon: "📱",
  },
  {
    label: "Group Settings",
    href: "/use-cases/group-settings",
    description: "In groups, multiple people talk at once and the conversation moves fast. Captio AI keeps up with whoever is speaking, so you can follow without losing where the conversation is going.",
    icon: "👥",
  },
  {
    label: "Restaurants & Cafes",
    href: "/use-cases/restaurants",
    description: "Background noise makes speech hard to follow even for people without hearing loss. Captio AI focuses on whoever is speaking to you, so you can have a real conversation through the noise.",
    icon: "🍽️",
  },
  {
    label: "Traveling",
    href: "/use-cases/traveling",
    description: "In airports, hotels, and unfamiliar cities there is no margin for mishearing. Captio AI captions speech in 60+ languages, so you can navigate confidently wherever you go.",
    icon: "✈️",
  },
  {
    label: "Conferences & Events",
    href: "/use-cases/conferences",
    description: "Speakers are far away, acoustics are unpredictable, and you cannot ask for a repeat. Captio AI gives you a live transcript of every speaker, so you can follow the full event from any seat.",
    icon: "🎤",
  },
  {
    label: "TV & Media",
    href: "/use-cases/tv-media",
    description: "Built-in subtitles are often wrong, delayed, or missing entirely. Captio AI captions whatever is playing in real time, so you are not dependent on whether the content has subtitles.",
    icon: "📺",
  },
];

const languages = [
  { name: "English", flag: "🇬🇧", slug: "english" },
  { name: "Chinese", flag: "🇨🇳", slug: "chinese" },
  { name: "Hindi", flag: "🇮🇳", slug: "hindi" },
  { name: "Spanish", flag: "🇪🇸", slug: "spanish" },
  { name: "Arabic", flag: "🇸🇦", slug: "arabic" },
  { name: "Bengali", flag: "🇧🇩", slug: "bengali" },
  { name: "Portuguese", flag: "🇵🇹", slug: "portuguese" },
  { name: "Russian", flag: "🇷🇺", slug: "russian" },
  { name: "Urdu", flag: "🇵🇰", slug: "urdu" },
  { name: "Indonesian", flag: "🇮🇩", slug: "indonesian" },
  { name: "German", flag: "🇩🇪", slug: "german" },
  { name: "Japanese", flag: "🇯🇵", slug: "japanese" },
  { name: "Swahili", flag: "🇰🇪", slug: "swahili" },
  { name: "Marathi", flag: "🇮🇳", slug: "marathi" },
  { name: "Telugu", flag: "🇮🇳", slug: "telugu" },
  { name: "Turkish", flag: "🇹🇷", slug: "turkish" },
  { name: "Vietnamese", flag: "🇻🇳", slug: "vietnamese" },
  { name: "Korean", flag: "🇰🇷", slug: "korean" },
  { name: "French", flag: "🇫🇷", slug: "french" },
  { name: "Italian", flag: "🇮🇹", slug: "italian" },
  { name: "Tamil", flag: "🇮🇳", slug: "tamil" },
  { name: "Persian", flag: "🇮🇷", slug: "persian" },
  { name: "Punjabi", flag: "🇮🇳", slug: "punjabi" },
  { name: "Gujarati", flag: "🇮🇳", slug: "gujarati" },
  { name: "Thai", flag: "🇹🇭", slug: "thai" },
  { name: "Polish", flag: "🇵🇱", slug: "polish" },
  { name: "Ukrainian", flag: "🇺🇦", slug: "ukrainian" },
  { name: "Malay", flag: "🇲🇾", slug: "malay" },
  { name: "Malayalam", flag: "🇮🇳", slug: "malayalam" },
  { name: "Kannada", flag: "🇮🇳", slug: "kannada" },
  { name: "Tagalog", flag: "🇵🇭", slug: "tagalog" },
  { name: "Azerbaijani", flag: "🇦🇿", slug: "azerbaijani" },
  { name: "Dutch", flag: "🇳🇱", slug: "dutch" },
  { name: "Romanian", flag: "🇷🇴", slug: "romanian" },
  { name: "Kazakh", flag: "🇰🇿", slug: "kazakh" },
  { name: "Czech", flag: "🇨🇿", slug: "czech" },
  { name: "Hungarian", flag: "🇭🇺", slug: "hungarian" },
  { name: "Greek", flag: "🇬🇷", slug: "greek" },
  { name: "Swedish", flag: "🇸🇪", slug: "swedish" },
  { name: "Hebrew", flag: "🇮🇱", slug: "hebrew" },
  { name: "Bulgarian", flag: "🇧🇬", slug: "bulgarian" },
  { name: "Serbian", flag: "🇷🇸", slug: "serbian" },
  { name: "Danish", flag: "🇩🇰", slug: "danish" },
  { name: "Albanian", flag: "🇦🇱", slug: "albanian" },
  { name: "Afrikaans", flag: "🇿🇦", slug: "afrikaans" },
  { name: "Belarusian", flag: "🇧🇾", slug: "belarusian" },
  { name: "Finnish", flag: "🇫🇮", slug: "finnish" },
  { name: "Slovak", flag: "🇸🇰", slug: "slovak" },
  { name: "Croatian", flag: "🇭🇷", slug: "croatian" },
  { name: "Norwegian", flag: "🇳🇴", slug: "norwegian" },
  { name: "Catalan", flag: "🇪🇸", slug: "catalan" },
  { name: "Lithuanian", flag: "🇱🇹", slug: "lithuanian" },
  { name: "Bosnian", flag: "🇧🇦", slug: "bosnian" },
  { name: "Galician", flag: "🇪🇸", slug: "galician" },
  { name: "Macedonian", flag: "🇲🇰", slug: "macedonian" },
  { name: "Slovenian", flag: "🇸🇮", slug: "slovenian" },
  { name: "Latvian", flag: "🇱🇻", slug: "latvian" },
  { name: "Estonian", flag: "🇪🇪", slug: "estonian" },
  { name: "Welsh", flag: "🏴󠁧󠁢󠁷󠁬󠁳󠁿", slug: "welsh" },
  { name: "Basque", flag: "🇪🇸", slug: "basque" },
];

const faqs = [
  {
    q: "Who is Captio AI designed for?",
    a: "Captio AI is built primarily for deaf and hard of hearing people who need to follow spoken conversations in real time. It's also widely used by people with auditory processing disorder, people in noisy environments, language learners, and anyone who finds reading faster or easier than listening.",
  },
  {
    q: "How accurate are the live captions?",
    a: "Captio AI uses advanced speech recognition built specifically for accuracy and low latency. Accuracy depends on audio clarity, accent, and background noise — but in typical conversation conditions, accuracy is very high, comparable to professional captioning services.",
  },
  {
    q: "Which languages does Captio AI support?",
    a: "Captio AI supports 60+ languages including English, Spanish, French, German, Mandarin, Arabic, Hindi, Japanese, Korean, Portuguese, Russian, and many more. All languages are available for Live Captions and Live Translator. See the full list on this page.",
  },
  {
    q: "Does Captio AI work with different accents and dialects?",
    a: "Yes. Captio AI handles a wide range of regional accents and dialects — not just standard textbook speech. It supports Australian English, Latin American Spanish, Swiss German, Brazilian Portuguese, Québécois French, and many others.",
  },
  {
    q: "What is the difference between Live Captions and Live Translator?",
    a: "Live Captions transcribes speech in the original spoken language. Live Translator takes that speech and translates it into your chosen language in real time — ideal when the speaker and the reader speak different languages, such as a foreign doctor or a business meeting in another language.",
  },
  {
    q: "Does Captio AI store or share my audio?",
    a: "No. Audio is processed in real time in real time and immediately discarded. Nothing is recorded or stored on any server. Your conversations are never sold and never used to train AI models — ours or anyone else's.",
  },
  {
    q: "Does Captio AI work without an internet connection?",
    a: "Live Captions and Live Translator require an internet connection to process speech in real time. Audio Transcription (for uploaded files) also requires connectivity. Offline captioning is not currently supported.",
  },
  {
    q: "What phone or iPad do I need?",
    a: "Captio AI runs on any phone or iPad running iOS 16 or later. It is optimized for phone and works best when the microphone has a clear line to the speaker.",
  },
  {
    q: "Can I use Captio AI at a doctor's appointment?",
    a: "Yes — doctor appointments are one of the most important use cases. You can place your phone on the desk or hold it toward the doctor and read everything they say in real time. Medical terminology is handled accurately, making Captio AI a practical accessibility tool in healthcare settings.",
  },
  {
    q: "Can I use Captio AI in meetings and lectures?",
    a: "Yes. Captio AI works in any setting where speech occurs — work meetings, university lectures, team standups, conferences, and video calls. Point the microphone toward the speaker and captions appear instantly.",
  },
  {
    q: "What is Audio Transcription and how is it different from Live Captions?",
    a: "Live Captions work in real time while someone is speaking. Audio Transcription is for recordings — you upload an audio or video file and get a full written transcript. It's ideal for reviewing lectures you recorded, interviews, podcasts, or any content you want to read rather than listen to.",
  },
  {
    q: "What does the AI Summary feature do?",
    a: "AI Summary takes any transcript and extracts the key information — main points, decisions made, action items, and important details — into a structured summary. It saves time when you have a long transcript from a meeting or lecture and need the highlights quickly.",
  },
  {
    q: "Is Captio AI free to use?",
    a: "Captio AI has a free tier that lets you get started without any payment. A Plus plan is available for users who need unlimited access. See the Pricing page for current plan details.",
  },
  {
    q: "How is Captio AI different from Apple's built-in Live Captions?",
    a: "Apple's Live Captions are built into iOS but support fewer languages, offer no translation, and don't include Audio Transcription or AI Summary. Captio AI supports 60+ languages, provides real-time translation, lets you transcribe uploaded files, and generates AI summaries — making it a far more complete accessibility and productivity tool.",
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
        <section className="pt-6 pb-4 sm:pt-10 sm:pb-10 px-5">
          <div className="max-w-3xl mx-auto flex flex-col items-center text-center gap-4 sm:gap-6">
            <span className="text-[11px] font-bold text-brand uppercase tracking-widest mt-2 sm:mt-0">
              🦻 Accessibility + 💻 Productivity App
            </span>

            <h1 className="text-[2.4rem] leading-[1.15] sm:text-6xl font-bold text-gray-900 tracking-tight">
              <span className="underline decoration-brand decoration-4 underline-offset-4">Live captions</span> and{" "}
              <span className="underline decoration-brand decoration-4 underline-offset-4">productivity tool</span>{" "}
              for deaf and HoH people.
            </h1>

            <p className="text-base sm:text-lg text-gray-500 max-w-xl leading-relaxed">
              Follow any conversation, meeting or lecture. In any language.
            </p>

            <div id="download" className="bg-white rounded-xl border border-gray-100 shadow-sm px-8 py-6 flex items-center gap-8">
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

            {/* App mockup */}
            <div className="mt-6 sm:mt-10">
              <Image
                src="/mockup_app.png"
                alt="Captio AI app showing live captions and translation"
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
                Everything you need to follow any conversation
              </h2>
              <p className="text-gray-500 mt-3 max-w-xl mx-auto">
                Four tools built specifically for deaf and hard of hearing people.
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
              {useCases.map((uc) => (
                <Link
                  key={uc.label}
                  href={uc.href}
                  className="group bg-white rounded-xl border border-gray-200 p-5 hover:border-brand hover:shadow-md transition-all flex flex-col gap-3 relative"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" className="absolute top-4 right-4 w-5 h-5 text-cta opacity-0 group-hover:opacity-100 transition-opacity">
                    <path d="M22 14a8 8 0 0 1-8 8" strokeWidth="2" />
                    <path d="M18 11v-1a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v0" strokeWidth="2" />
                    <path d="M14 10V9a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v1" strokeWidth="2" />
                    <path d="M10 9.5V4a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v10" strokeWidth="2" />
                    <path d="M18 11a2 2 0 1 1 4 0v3a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15" strokeWidth="2" />
                  </svg>
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
              {languages.map((lang) => (
                <Link
                  key={lang.slug}
                  href={`/${lang.slug}`}
                  className="flex items-center gap-2 px-4 py-3 bg-white border border-brand rounded-[8px] text-base font-bold text-gray-900 hover:bg-brand-light hover:text-brand transition-colors"
                >
                  <span className="text-base">{lang.flag}</span>
                  {lang.name}
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ── Inline CTA: after languages ── */}
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
                  description: "Captio AI processes your audio in real time and discards it immediately. Nothing is recorded. Nothing is kept.",
                },
                {
                  title: "Not a product",
                  description: "Your conversations are not something Captio AI sells, shares, or monetizes — to anyone, for any reason.",
                },
                {
                  title: "Not used to train anything",
                  description: "What you say in a doctor's appointment or a job interview never ends up in a training dataset. Not ours. Not anyone else's.",
                },
              ].map((item) => (
                <div key={item.title} className="bg-white/10 backdrop-blur rounded-xl p-6 border border-white/20 text-left">
                  <h3 className="font-semibold text-white mb-1">{item.title}</h3>
                  <p className="text-sm text-blue-100 leading-relaxed">{item.description}</p>
                </div>
              ))}
            </div>

            {/* Shield SVG */}
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

        {/* ── Testimonials ── */}
        <section className="py-10 bg-white overflow-hidden">
          <div className="max-w-6xl mx-auto px-6 mb-7">
            <div className="text-center">
              <span className="text-xs font-bold text-cta uppercase tracking-widest">Reviews</span>
              <h2 className="text-3xl font-bold text-gray-900 tracking-tight mt-3">People love Captio AI</h2>
            </div>
          </div>
          <ReviewCarousel />
        </section>

        {/* ── Inline CTA: after testimonials ── */}
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

            {/* Card */}
            <div className="w-full bg-white rounded-xl border border-gray-100 shadow-sm px-8 py-8 flex flex-col items-center gap-6">
              <div className="flex items-center gap-8">
                {/* QR code — replace value with App Store URL once live */}
                <div className="hidden sm:block p-3 bg-white border border-gray-200 rounded-xl">
                  {/* Install react-qr-code and replace this placeholder:
                      import QRCode from "react-qr-code";
                      <QRCode value="https://apps.apple.com/app/captio/..." size={96} /> */}
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

      </main>
      <Footer />
    </>
  );
}
