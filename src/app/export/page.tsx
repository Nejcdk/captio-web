import type { Metadata } from "next";
import FeaturePage from "@/components/FeaturePage";

const description =
  "Share captions or a summary from Captio AI as plain text, a link, a designed PDF, an email, or a ready prompt for your AI chat. Speaker names, dates and to-dos come along.";

export const metadata: Metadata = {
  title: "Export Captions and Summaries as Text, Link, PDF or Email",
  description,
  alternates: { canonical: "/export" },
  openGraph: {
    title: "Export Captions and Summaries as Text, Link, PDF or Email | Captio AI",
    description,
    url: "/export",
    type: "website",
    images: ["/opengraph-image"],
  },
};

const faqs = [
  {
    q: "How do I export a recording from Captio AI?",
    a: "Open the recording and tap the blue Export button, or tap ⋯ and choose Export. Pick the captions or the summary, then how to send it: Text, Link, PDF, Email or Chat.",
  },
  {
    q: "What can I export?",
    a: "The full captions with speaker names, or the summary. From the Actions tab, any result you made (key points, detailed notes, to-dos, questions and answers, a follow-up message) has its own Export button.",
  },
  {
    q: "What does the PDF look like?",
    a: "A clean document with the title, date, length and number of speakers at the top, the captions or summary in sections, and to-dos as checkboxes. It ends with a QR code to get Captio AI.",
  },
  {
    q: "How does the link work?",
    a: "Link makes a web page at captioai.app/r/… with the captions or the summary, and opens the share sheet with that address. Anyone with the link can read it, and copy it, print it, email it or ask an AI chat about it. Pages made from links are never shown in search engines and disappear when you delete the recording or your account. Links need a Captio AI account.",
  },
  {
    q: "Which email apps does it use?",
    a: "On iPhone, Captio AI opens Gmail or Outlook if you have one, with the text already written. Otherwise it uses Apple Mail with a designed email and the PDF attached. You send it yourself, from your own address.",
  },
  {
    q: "What is the Chat option?",
    a: "A ready prompt with everything about the recording: what it was, when, who spoke and what was said. Paste it into ChatGPT, Claude or another AI chat to ask your own questions about it.",
  },
  {
    q: "What if I export a summary that doesn't exist yet?",
    a: "Captio AI makes it first, then exports it, and keeps it with the recording. On the free plan this counts as one of your 3 AI results.",
  },
  {
    q: "Can I share the audio too?",
    a: "Yes. The share icon on the player sends the recording's audio file.",
  },
  {
    q: "Is exporting free?",
    a: "Yes, on every plan. Only making a new summary or AI result counts against the free plan's 3 AI results.",
  },
];

export default function ExportPage() {
  return (
    <FeaturePage
      slug="export"
      name="Export"
      schemaDescription="Export captions and summaries as plain text, a share link, a designed PDF, an email, or a ready AI chat prompt, with speaker names and dates."
      stepsHeading="From your phone to everyone who needs it."
      steps={[
        {
          title: "Tap Export",
          desc: "Open any recording and tap the blue Export button under the captions.",
          img: "/EX_mockup_1.png",
          alt: "A Weekly sync recording in Captio AI with named speakers and the Export button",
        },
        {
          title: "Pick what and how",
          desc: "Captions or summary, as Text, Link, PDF, Email or a prompt for your AI chat.",
          img: "/EX_mockup_2.png",
          alt: "The Export sheet with Text, Link, PDF, Email and Chat for captions and for the summary",
        },
        {
          title: "Send it",
          desc: "A designed PDF, an email, or a link anyone can open. Names, dates and to-dos come along.",
          img: "/EX_mockup_3.png",
          alt: "The exported PDF of the meeting summary open in Preview",
        },
      ]}
      featuresHeading="Built for sharing what you followed"
      featuresIntro="Send the meeting notes to your team, the doctor's instructions to your family, the lecture to your study group."
      subfeatures={[
        {
          title: "Text",
          description: "Just the content, nothing added, through the share sheet: Messages, WhatsApp, Notes, anywhere.",
        },
        {
          title: "Link",
          description: "A web page with the captions or summary. Readers can copy, print or email it from there.",
        },
        {
          title: "PDF",
          description: "A clean document with the date, length and speakers on top, ready to print or attach.",
        },
        {
          title: "Email",
          description: "Opens your own mail app with the text written, so it goes from your address.",
        },
        {
          title: "Chat",
          description: "A ready prompt with everything about the recording, to paste into your AI chat and ask questions.",
        },
        {
          title: "Speaker names included",
          description: "Names from your captions travel with the export, so everyone knows who said what.",
        },
        {
          title: "Any AI result",
          description: "Export key points, notes, to-dos or a follow-up message straight from the Actions tab.",
        },
        {
          title: "Made first if needed",
          description: "Export a summary that doesn't exist yet and Captio AI makes it on the spot.",
        },
        {
          title: "The audio too",
          description: "The share icon on the player sends the recording's audio file.",
        },
      ]}
      privacyHeading="You decide who gets it."
      privacy={[
        {
          title: "Sent by you",
          description: "Email goes from your own mail app and address. Captio AI never sends anything on your behalf.",
        },
        {
          title: "Links stay out of search",
          description: "Shared pages are never indexed by search engines, and they disappear when you delete the recording or your account.",
        },
        {
          title: "Not used to train anything",
          description: "What you export is never sold, never shared for advertising and never used to train AI models.",
        },
      ]}
      faqs={faqs}
    />
  );
}
