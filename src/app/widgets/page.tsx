import type { Metadata } from "next";
import FeaturePage from "@/components/FeaturePage";

const description =
  "Add Captio AI to your iPhone Home Screen or Lock Screen and start Live Captions or translation in one tap. Widgets for captions, translation, file uploads and recent recordings.";

export const metadata: Metadata = {
  title: "Widgets: Start Live Captions in One Tap on iPhone",
  description,
  alternates: { canonical: "/widgets" },
  openGraph: {
    title: "Widgets: Start Live Captions in One Tap on iPhone | Captio AI",
    description,
    url: "/widgets",
    type: "website",
    images: ["/opengraph-image"],
  },
};

const faqs = [
  {
    q: "Which Captio AI widgets are there?",
    a: "On the Home Screen: Live captions, Translate and Upload file (small), Captions and translate, and Recent recordings (medium). On the Lock Screen: a round Live captions widget. There is also a Live captions control for Control Center and the buttons at the bottom of the Lock Screen.",
  },
  {
    q: "How do I add a Captio AI widget to my Home Screen?",
    a: "Hold an empty spot on your Home Screen and tap Edit, then Add Widget. Search for Captio AI, pick a widget and tap Add Widget.",
  },
  {
    q: "How do I add Captio AI to my Lock Screen?",
    a: "Hold your Lock Screen and tap Customize, then Add Widgets. Pick Captio AI, tap the mic and tap Done.",
  },
  {
    q: "Can I replace the camera button on the Lock Screen?",
    a: "Yes. Hold your Lock Screen, tap Customize, tap − on the camera button, then + and choose Live captions. Tap Done.",
  },
  {
    q: "What does the Recent recordings widget show?",
    a: "A Start button for captions and your latest recordings with their length and day. Tap one to open it.",
  },
  {
    q: "Do captions keep going when I lock my phone?",
    a: "Yes, on iPhone. Captions keep recording with the screen locked, and the Lock Screen and Dynamic Island show a red dot and a timer with pause and resume.",
  },
  {
    q: "Where is the guide in the app?",
    a: "Settings, then Add to Home Screen. It shows the steps for the Home Screen, the Lock Screen and the camera button.",
  },
  {
    q: "Are widgets free?",
    a: "Yes, on every plan. What you record with them uses the same 100 free credits a day as the rest of the free plan.",
  },
  {
    q: "Are there widgets on Android?",
    a: "Not yet. Widgets, the Lock Screen control and captions with the screen locked are on iPhone.",
  },
];

export default function WidgetsPage() {
  return (
    <FeaturePage
      slug="widgets"
      name="Widgets"
      schemaDescription="iPhone Home Screen and Lock Screen widgets that start Live Captions, translation or a file upload in one tap, plus a recent recordings widget."
      stepsHeading="One tap from captions."
      steps={[
        {
          title: "Add it to your Home Screen",
          desc: "Hold an empty spot, tap Edit, then Add Widget, and search Captio AI.",
          img: "/WG_mockup_1.png",
          alt: "Captio AI widgets on an iPhone Home Screen: Start with recent recordings, Live captions and Translate, Upload file",
        },
        {
          title: "Or to your Lock Screen",
          desc: "Hold your Lock Screen, tap Customize, then Add Widgets, and pick the Captio AI mic.",
          img: "/WG_mockup_2.png",
          alt: "The round Captio AI mic widget under the clock on an iPhone Lock Screen",
        },
        {
          title: "Or swap the camera button",
          desc: "Put Live captions where the camera button was at the bottom of your Lock Screen.",
          img: "/WG_mockup_3.png",
          alt: "The Lock Screen camera button replaced with a Live captions mic button",
        },
      ]}
      featuresHeading="Captions before the moment passes"
      featuresIntro="Someone starts talking at the pharmacy counter. Captions should start before you've found the app."
      subfeatures={[
        {
          title: "Live captions",
          description: "A small widget that starts Live Captions in one tap. Also on the Lock Screen as a round mic.",
        },
        {
          title: "Captions and translate",
          description: "A wide widget with both buttons: Live Captions, or Live Translator for a conversation in another language.",
        },
        {
          title: "Recent recordings",
          description: "A Start button next to your latest recordings, so the lecture from this morning is one tap away.",
        },
        {
          title: "Translate",
          description: "A small widget that starts Live Translator straight away.",
        },
        {
          title: "Upload file",
          description: "A small widget that opens the file picker to transcribe audio or video.",
        },
        {
          title: "Control Center and Lock Screen button",
          description: "Start live captions from Control Center or from the buttons at the bottom of the Lock Screen.",
        },
        {
          title: "Keeps going with the screen locked",
          description: "Captions keep recording with the screen locked. The Lock Screen and Dynamic Island show a timer with pause and resume.",
        },
        {
          title: "A guide in the app",
          description: "Settings, then Add to Home Screen walks you through the Home Screen, the Lock Screen and the camera button.",
        },
        {
          title: "In your language",
          description: "Widgets show in the same language as the app.",
        },
      ]}
      privacyHeading="What you hear stays with you."
      privacy={[
        {
          title: "Processed, not kept",
          description: "Captio AI processes audio in real time and doesn't store it on its servers.",
        },
        {
          title: "Not a product",
          description: "Your conversations are not something Captio AI sells, shares or monetizes, to anyone, for any reason.",
        },
        {
          title: "Not used to train anything",
          description: "What you caption at the doctor's or in a job interview never ends up in a training dataset.",
        },
      ]}
      faqs={faqs}
    />
  );
}
