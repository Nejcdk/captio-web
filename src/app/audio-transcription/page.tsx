import type { Metadata } from "next";
import Image from "next/image";
import Header from "@/components/Header";
import BackButton from "@/components/BackButton";
import Footer from "@/components/Footer";
import { DownloadCard, StoreButtons } from "@/components/StoreButtons";
import FaqAccordion from "@/components/FaqAccordion";

import { SITE_URL, jsonLd, softwareApplicationSchema, faqPageSchema, breadcrumbSchema } from "@/lib/schema";

export const metadata: Metadata = {
  title: "Audio Transcription: Audio and Video to Text on iPhone",
  description:
    "Upload any audio or video file and get a full written transcript. 60+ languages, speaker separation, searchable. Built for deaf and hard of hearing people.",
  alternates: { canonical: "/audio-transcription" },
  openGraph: {
    title: "Audio Transcription: Audio and Video to Text on iPhone | Captio AI",
    description:
      "Upload any audio or video file and get a full written transcript. 60+ languages, speaker separation, searchable. Built for deaf and hard of hearing people.",
    url: "/audio-transcription",
    type: "website",
    images: ["/opengraph-image"],
  },
};

const subfeatures = [
  {
    title: "Any format",
    description: "MP3, MP4, M4A, WAV, and more. Lectures, meetings, voicemails, podcasts, interviews, phone recordings — if it has speech in it, Captio AI can transcribe it.",
  },
  {
    title: "Highest accuracy",
    description: "Captio AI is built for real-world audio, not just clean studio files. Phone call audio, lecture hall recordings, noisy environments — it handles them all.",
  },
  {
    title: "Any language",
    description: "Upload a recording in French, Japanese, Arabic, or 57 other languages. Captio AI identifies the language and transcribes it accurately.",
  },
  {
    title: "Multiple languages",
    description: "When speakers switch languages mid-recording, Captio AI keeps up. The transcript reflects every language that was spoken, without gaps.",
  },
  {
    title: "Timestamps",
    description: "Every line in the transcript is time-stamped so you can jump to any moment in the recording and find exactly what was said and when.",
  },
  {
    title: "Export and share",
    description: "Copy the full transcript, share it, or save it. Your recordings and transcripts stay accessible whenever you need them.",
  },
];

const faqs = [
  {
    q: "How is Audio Transcription different from Live Captions?",
    a: "Live Captions work in real time while someone is speaking. Audio Transcription is for recordings — you upload an audio or video file and get a full written transcript. It is ideal for reviewing lectures you recorded, doctor appointments, interviews, or any content you want to read rather than listen to.",
  },
  {
    q: "What file formats does Audio Transcription support?",
    a: "Captio AI accepts common audio and video formats including MP3, MP4, M4A, WAV, and more. If you recorded it on your phone or downloaded it from a video platform, it will work.",
  },
  {
    q: "How accurate is the transcription?",
    a: "Accuracy is high for clear recordings in supported languages. Captio AI handles real-world audio — phone calls, lecture hall recordings, noisy environments — not just studio-quality files. You can also retranscribe a file for a second pass if needed.",
  },
  {
    q: "Which languages are supported?",
    a: "60+ languages including English, Spanish, French, German, Mandarin, Arabic, Hindi, Japanese, Korean, Portuguese, Russian, and many more. Captio AI auto-detects the spoken language in the file.",
  },
  {
    q: "Does it separate speakers?",
    a: "Yes. Captio AI labels each speaker separately in the transcript so you can follow who said what — useful for meetings, interviews, doctor appointments, and any multi-person recording.",
  },
  {
    q: "How long does transcription take?",
    a: "Transcription is fast. A one-hour recording typically takes a few minutes. The time depends on file length and audio quality.",
  },
  {
    q: "Is my audio stored after transcription?",
    a: "No. Audio is processed and immediately discarded. Nothing is stored on any server after transcription is complete. Your recordings are never sold or used to train AI models.",
  },
  {
    q: "Can I transcribe a video file?",
    a: "Yes. Upload the video file directly and Captio AI extracts the audio and transcribes it. No need to convert the file first.",
  },
];


const schemaOrg = jsonLd(
  softwareApplicationSchema({
    url: `${SITE_URL}/audio-transcription`,
    description: "Upload any audio or video file and get a full written transcript. 60+ languages, speaker separation, timestamps. Built for deaf and hard of hearing people.",
  }),
  faqPageSchema(faqs),
  breadcrumbSchema([
    { name: "Home", path: "/" },
    { name: "Audio Transcription", path: "/audio-transcription" },
  ]),
);

export default function AudioTranscriptionPage() {
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
            <span className="text-sm font-medium text-gray-500">Audio Transcription</span>
          </div>
        </div>

        <section className="pt-2 pb-4 sm:pt-4 sm:pb-6 px-5 bg-white">
          <div className="max-w-3xl mx-auto flex flex-col items-center text-center">
            <h1 className="text-[2.4rem] leading-[1.15] sm:text-6xl font-bold text-gray-900 tracking-tight">
              Audio Transcription
            </h1>
          </div>
        </section>

        {/* ── How it works ── */}
        <section className="pt-4 pb-10 px-6 bg-white">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-10">
              <span className="text-xs font-bold text-cta uppercase tracking-widest">How it works</span>
              <h2 className="text-3xl font-bold text-gray-900 tracking-tight mt-3">
                Upload. Read. Done.
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-10">
              {[
                { step: "1", title: "Choose upload format", desc: "Select whether you are uploading an audio file or a video file.", img: "/AT_mockup_1.png" },
                { step: "2", title: "Select a file", desc: "Pick the file from your phone. Captio AI starts transcribing immediately.", img: "/AT_mockup_2.png" },
                { step: "3", title: "See the transcription", desc: "Read the full transcript, organized by speaker, with timestamps.", img: "/AT_mockup_3.png" },
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
                Built for real recordings
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
                { title: "Gone the moment it ends", description: "Captio AI processes your audio and discards it immediately after transcription. Nothing is stored on any server." },
                { title: "Not a product", description: "Your recordings are not something Captio AI sells, shares, or monetizes — to anyone, for any reason." },
                { title: "Not used to train anything", description: "What you upload — a doctor's appointment, a meeting, an interview — never ends up in a training dataset. Not ours. Not anyone else's." },
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
