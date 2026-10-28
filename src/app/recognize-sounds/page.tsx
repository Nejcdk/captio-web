import type { Metadata } from "next";
import FeaturePage from "@/components/FeaturePage";

const description =
  "Sounds around you show in your live captions, like [doorbell rings], and alerts such as a smoke alarm or a crying baby make your phone vibrate. Free, on iPhone and iPad.";

export const metadata: Metadata = {
  title: "Recognize Sounds: Doorbells and Alarms in Your Captions",
  description,
  alternates: { canonical: "/recognize-sounds" },
  openGraph: {
    title: "Recognize Sounds: Doorbells and Alarms in Your Captions | Captio AI",
    description,
    url: "/recognize-sounds",
    type: "website",
    images: ["/opengraph-image"],
  },
};

const faqs = [
  {
    q: "Which sounds does Captio AI recognize?",
    a: "On by default: doorbell, knocking, smoke or fire alarm, alarm or timer, siren, phone ringing, baby crying, dog barking, laughter, applause and music. Under More sounds you can add 17 more: car horn, cat, glass breaking, shouting, crying, door, water running, water boiling, microwave, beeping, whistling, singing, thunder, train horn, plane or helicopter, vacuum cleaner and coughing.",
  },
  {
    q: "How do sounds show in the captions?",
    a: "Like film subtitles for deaf viewers: in grey, lower case and in brackets, inside the text where the sound happened, for example \"See you then. [doorbell rings] Who's that?\"",
  },
  {
    q: "Which sounds make my phone vibrate?",
    a: "The alert sounds: doorbell, knocking, smoke or fire alarm, alarm or timer, siren, phone ringing and a baby crying. The phone vibrates three times. If the screen is locked while you record, you also get a notification, for example \"Doorbell\".",
  },
  {
    q: "Does it work when Captio AI isn't recording?",
    a: "No. Sounds are recognized while Live Captions or Live Translator are recording, including with the screen locked on iPhone, and in audio and video files you upload. It is not an always-on sound alarm.",
  },
  {
    q: "Will music or laughter fill my captions?",
    a: "No. Captio AI keeps quiet sounds quiet: a sound that isn't an alert never shows within 8 seconds of the last one, laughter shows again only after 45 seconds without it, and music after 2 minutes of quiet. Your phone vibrates at most once every 20 seconds, except for a smoke alarm.",
  },
  {
    q: "Are there sounds it misses?",
    a: "Some. A classic ding-dong doorbell is recognized, but some melodic electronic door chimes sound like music to it, and musical ringtones can too.",
  },
  {
    q: "Are the sounds kept in my recording?",
    a: "Yes. They stay in the saved recording, at the place they happened. If you turn a sound off in Settings, it is hidden in your saved recordings too.",
  },
  {
    q: "Is my audio sent anywhere to recognize sounds?",
    a: "No. Sounds are recognized on your phone, from the same audio the captions use. Nothing is downloaded and nothing is sent anywhere for it.",
  },
  {
    q: "Does it work with AirPods?",
    a: "Yes. Recognize Sounds listens to the same microphone as your captions, so it works with AirPods, a headset or an external microphone, and doesn't change which microphone is used.",
  },
  {
    q: "Is it free? Which version and which phones?",
    a: "Yes, free for everyone, on the free plan and on Plus. It comes with Captio AI version 1.1.5, on iPhone and iPad. It is not on Android yet.",
  },
];

export default function RecognizeSoundsPage() {
  return (
    <FeaturePage
      slug="recognize-sounds"
      name="Recognize Sounds"
      schemaDescription="Live captions that show the sounds around you, like a doorbell, a smoke alarm or a crying baby, written into the captions where they happen, with vibration for alerts. Recognized on the phone. iPhone and iPad, from version 1.1.5."
      stepsHeading="See the sounds, not only the words."
      steps={[
        {
          title: "Start Live Captions",
          desc: "Recognize Sounds is on by default. It listens while you caption or translate a conversation, or transcribe a file.",
        },
        {
          title: "Sounds appear in the text",
          desc: "A doorbell shows where it rang, like [doorbell rings], in grey between the words, the way film subtitles do it.",
        },
        {
          title: "Alerts make the phone vibrate",
          desc: "A smoke alarm, a siren, knocking or a crying baby buzzes your phone, even with the screen locked while you record.",
        },
      ]}
      featuresHeading="Know what you didn't hear"
      featuresIntro="A knock at the door during a meeting, an alarm in the next room, laughter at the table. Read it in the captions, as it happens."
      subfeatures={[
        {
          title: "11 sounds on by default",
          description: "Doorbell, knocking, smoke or fire alarm, alarm or timer, siren, phone ringing, baby crying, dog barking, laughter, applause and music.",
        },
        {
          title: "17 more when you want them",
          description: "Add sounds like a car horn, glass breaking, water boiling or the microwave under More sounds.",
        },
        {
          title: "Alerts you can feel",
          description: "Alert sounds vibrate the phone three times, and send a notification when the screen is locked during a recording.",
        },
        {
          title: "Where it happened",
          description: "Each sound sits in the captions at the moment it was heard, and stays there in the saved recording.",
        },
        {
          title: "Captions, translation and files",
          description: "Works in Live Captions, in both panes of Live Translator, and in audio and video files you upload.",
        },
        {
          title: "Quiet when it should be",
          description: "Music and laughter show once, not every few seconds, so the captions stay about the conversation.",
        },
        {
          title: "Works with AirPods",
          description: "It uses the same audio as your captions, so it works with whatever microphone the captions use.",
        },
        {
          title: "Your sounds, your choice",
          description: "Turn single sounds on or off, or all of them, in Settings, then Captions, then Recognize sounds.",
        },
        {
          title: "Free on every plan",
          description: "Recognize Sounds is free for everyone, on the free plan and on Plus.",
        },
      ]}
      privacyHeading="Recognized on your phone."
      privacy={[
        {
          title: "On your phone",
          description: "Sounds are recognized on your iPhone or iPad. No audio is sent anywhere to do it.",
        },
        {
          title: "Nothing to download",
          description: "It works from the first session, with nothing extra to install.",
        },
        {
          title: "Only while you caption",
          description: "It listens only while Captio AI is recording captions or transcribing a file you chose.",
        },
      ]}
      faqs={faqs}
    />
  );
}
