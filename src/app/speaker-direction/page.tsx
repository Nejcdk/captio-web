import type { Metadata } from "next";
import FeaturePage from "@/components/FeaturePage";

const description =
  "Waves at the edge of your live captions show which side a voice is coming from, in the speaker's colour, so you know where to look at a busy table. iPhone 16 and later.";

export const metadata: Metadata = {
  title: "Speaker Direction: See Where a Voice Is Coming From",
  description,
  alternates: { canonical: "/speaker-direction" },
  openGraph: {
    title: "Speaker Direction: See Where a Voice Is Coming From | Captio AI",
    description,
    url: "/speaker-direction",
    type: "website",
    images: ["/opengraph-image"],
  },
};

const faqs = [
  {
    q: "Which iPhones support speaker direction?",
    a: "iPhone 16 and later, on iOS 26 or later: the iPhones that can record spatial audio. On other iPhones, on iPad and on Android the setting doesn't appear and captions work as usual.",
  },
  {
    q: "How do I turn it on?",
    a: "It is on by default. Lay your iPhone flat on the table and start Live Captions. The first sessions show a short notice that explains the waves. To turn it off, tap Turn off on that notice, or go to Settings, then Captions, then Speaker direction.",
  },
  {
    q: "Why do the waves only show some of the time?",
    a: "They show only while the captions are writing new words. Room noise alone, like a coffee machine or plates, never shows waves, so you aren't sent looking around for nothing.",
  },
  {
    q: "What do the colours mean?",
    a: "The wave takes the colour of the talking speaker's tag in the captions, Speaker 2's colour or a recognized person's colour. The colour tells you who, the side tells you where.",
  },
  {
    q: "Does it work with AirPods or an external microphone?",
    a: "No. Speaker direction needs the iPhone's own microphones. With AirPods, a headset or an external microphone, captions keep working without the waves.",
  },
  {
    q: "Does it work when I hold the phone?",
    a: "It works best flat on the table. When you pick the phone up, Captio AI keeps where each speaker was while the phone lay flat and turns that with the phone. Lay it flat again and it reads the room live within about a second.",
  },
  {
    q: "Does it work with the screen locked?",
    a: "No. Speaker direction runs only while the captions are on screen. Captions themselves keep recording with the screen locked.",
  },
  {
    q: "Does it work with Live Translator?",
    a: "Yes. The waves show in live translation sessions as well as in Live Captions.",
  },
  {
    q: "Does it use more battery?",
    a: "A little more than captions alone, because it listens with all of the iPhone's microphones. You can turn it off at any time.",
  },
  {
    q: "Is speaker direction free?",
    a: "Yes. It is part of Live Captions on every plan.",
  },
];

export default function SpeakerDirectionPage() {
  return (
    <FeaturePage
      slug="speaker-direction"
      name="Speaker Direction"
      schemaDescription="Live captions that show which side a voice is coming from, with waves at the edge of the screen in the speaker's colour. Uses spatial audio on iPhone 16 and later."
      stepsHeading="Know where to look."
      steps={[
        {
          title: "Lay your phone flat",
          desc: "Put your iPhone 16 or later flat on the table and start Live Captions. Speaker direction is on by default.",
          img: "/SD_mockup_1.png",
          alt: "Live captions starting with the Speaker direction notice: best with the phone flat on a table",
        },
        {
          title: "Waves point to the voice",
          desc: "A wave grows at the edge of the captions on the side the voice comes from, while new words appear.",
          img: "/SD_mockup_2.png",
          alt: "Blue waves on the left edge of the captions while Speaker 1 talks",
        },
        {
          title: "Each voice, its own colour",
          desc: "The wave takes the colour of the speaker's tag, so you know who is talking and where to look.",
          img: "/SD_mockup_3.png",
          alt: "Red waves on the right edge of the captions while Speaker 2 talks",
        },
      ]}
      featuresHeading="Built for busy tables"
      featuresIntro="Six people around a dinner table, a meeting room, a group at the café. Read the words, and know whose face to look at."
      subfeatures={[
        {
          title: "Look up at the right person",
          description: "Glance at the side the wave is on and find who is talking, instead of scanning every face at the table.",
        },
        {
          title: "Only for speech",
          description: "Waves show only while the captions are writing new words. A clattering kitchen doesn't send you looking around.",
        },
        {
          title: "Matches the speaker tag",
          description: "The wave takes the colour of the talking speaker's tag, including the names you saved with Recognize Voices.",
        },
        {
          title: "Keeps up when you lift the phone",
          description: "Pick the phone up and it remembers where each speaker sat, turning with the phone. Lay it flat and it reads the room live again.",
        },
        {
          title: "Captions and translation",
          description: "Works in Live Captions and in Live Translator sessions.",
        },
        {
          title: "Uses the iPhone's spatial microphones",
          description: "On iPhone 16 and later, Captio AI listens with the same microphones the iPhone uses for spatial audio recording.",
        },
        {
          title: "Never takes over your headphones",
          description: "If you are on AirPods or an external microphone, captions stay on that microphone and the waves simply don't show.",
        },
        {
          title: "On by default, off in one tap",
          description: "Turn it off from the notice in the captions, or in Settings, then Captions, then Speaker direction.",
        },
        {
          title: "Free on every plan",
          description: "Speaker direction is part of Live Captions, on the free plan and on Plus.",
        },
      ]}
      privacyHeading="Worked out on your phone."
      privacy={[
        {
          title: "On your iPhone",
          description: "The direction is calculated on your iPhone from its microphones. It is not sent anywhere.",
        },
        {
          title: "Nothing kept",
          description: "Where people sat is used only during the session. It is not saved with the recording.",
        },
        {
          title: "Only while you look",
          description: "It runs only while the captions are on screen, never in the background, and you can turn it off at any time.",
        },
      ]}
      faqs={faqs}
    />
  );
}
