import type { Metadata } from "next";
import FeaturePage from "@/components/FeaturePage";

const description =
  "Turn any recording into a summary, key points, detailed notes, to-dos with owners and dates, questions and answers, or a follow-up message. One tap on the Actions tab in Captio AI.";

export const metadata: Metadata = {
  title: "AI Actions: Summary, To-dos and Follow-up Message From Any Recording",
  description,
  alternates: { canonical: "/ai-actions" },
  openGraph: {
    title: "AI Actions: Summary, To-dos and Follow-up Message From Any Recording | Captio AI",
    description,
    url: "/ai-actions",
    type: "website",
    images: ["/opengraph-image"],
  },
};

const faqs = [
  {
    q: "What are AI actions in Captio AI?",
    a: "Six things Captio AI can make from a recording's transcript: a Summary, Key points, Detailed notes, To-dos, Questions and answers, and a Follow-up message. Open a recording, tap the Actions tab and tap the one you need.",
  },
  {
    q: "How are AI actions different from AI Summary?",
    a: "The summary is one of the six. The other five shape the same recording for a different job: key points to skim, detailed notes to study from, to-dos to act on, questions and answers to check what was asked, and a message to send everyone afterwards.",
  },
  {
    q: "Do the to-dos say who does what?",
    a: "Yes. To-dos are grouped by person, with a due date when one was said, using the names in your captions. You can tick them off in the app.",
  },
  {
    q: "Does Captio AI know what kind of recording it is?",
    a: "Yes. It first works out whether it was a meeting, a lecture, a doctor's or other appointment, a talk, an interview or a voice note, and shapes the result to fit. It also uses the speakers' names and the recording's date.",
  },
  {
    q: "Which recordings can I use?",
    a: "Any recording in Captio AI: Live Captions, Live Translator and uploaded audio or video files.",
  },
  {
    q: "Can I make a new version?",
    a: "Yes. Tap Re-generate for a fresh result. You can make several actions for the same recording, and they are kept with it.",
  },
  {
    q: "Can I share the result?",
    a: "Yes. Every result has an Export button: send it as text, a link, a PDF, an email, or a ready prompt for an AI chat.",
  },
  {
    q: "Is it free?",
    a: "The free plan includes 3 AI results in total. Captio AI Plus removes the limit. A recording too short to say anything useful is not counted.",
  },
  {
    q: "Is my transcript used to train AI?",
    a: "No. The transcript is sent to a third-party AI provider only to make the result you asked for. It is never sold and never used to train AI models.",
  },
];

export default function AiActionsPage() {
  return (
    <FeaturePage
      slug="ai-actions"
      name="AI Actions"
      schemaDescription="Turn any recording into a summary, key points, detailed notes, to-dos with owners and due dates, questions and answers, or a follow-up message."
      stepsHeading="One recording. Six ways to use it."
      steps={[
        {
          title: "Open the Actions tab",
          desc: "Open any recording and tap Actions. Pick Summary, Key points, Detailed notes, To-dos, Q&A or Follow-up message.",
          img: "/AA_mockup_1.png",
          alt: "The Actions tab in Captio AI with six tiles: Summary, Key points, Detailed notes, To-dos, Questions & answers, Follow-up message",
        },
        {
          title: "Get your to-dos",
          desc: "Every task from the meeting, grouped by person, with the dates that were said.",
          img: "/AA_mockup_2.png",
          alt: "To-dos from a weekly meeting grouped by Sara, Emma, Ana and Marko, with due dates",
        },
        {
          title: "Send the follow-up",
          desc: "A ready recap with the decisions and next steps, to export and send to everyone who was there.",
          img: "/AA_mockup_3.png",
          alt: "A follow-up message with key decisions and next steps from the meeting",
        },
      ]}
      featuresHeading="From what was said to what happens next"
      featuresIntro="You followed the meeting through captions. Captio AI turns it into the notes, tasks and message you would otherwise write yourself."
      subfeatures={[
        {
          title: "Summary",
          description: "What the recording was about and what was decided, in sections you can scan in a minute.",
        },
        {
          title: "Key points",
          description: "The few things that mattered, for when you only need the gist.",
        },
        {
          title: "Detailed notes",
          description: "Structured notes of the whole recording, ready to study from after a lecture.",
        },
        {
          title: "To-dos",
          description: "Tasks grouped by person with due dates, which you can tick off in the app.",
        },
        {
          title: "Questions and answers",
          description: "Every question that was asked and the answer it got, useful after a doctor's appointment or an interview.",
        },
        {
          title: "Follow-up message",
          description: "A recap email for everyone who was there, with the decisions and next steps.",
        },
        {
          title: "Knows who said it",
          description: "Uses the speakers' names from your captions, so owners and quotes are right.",
        },
        {
          title: "Fits the recording",
          description: "A lecture gets study notes, an appointment gets instructions and follow-ups, a meeting gets decisions.",
        },
        {
          title: "Export in one tap",
          description: "Send any result as text, a link, a PDF, an email or a prompt for your AI chat.",
        },
      ]}
      privacyHeading="Your recording works for you, nobody else."
      privacy={[
        {
          title: "Only when you ask",
          description: "Nothing is sent until you tap an action, and Captio AI asks for your consent before anything is processed.",
        },
        {
          title: "Not a product",
          description: "Your transcripts and results are not something Captio AI sells, shares or monetizes.",
        },
        {
          title: "Not used to train anything",
          description: "What you summarize, a doctor's appointment, a meeting, an interview, never ends up in a training dataset.",
        },
      ]}
      faqs={faqs}
    />
  );
}
