import type { Metadata } from "next";
import FeaturePage from "@/components/FeaturePage";

const description =
  "Save the voices of the people you talk to most. Captio AI shows their names in your captions instead of Speaker 2, live and in saved recordings. Voices are made and kept on your phone.";

export const metadata: Metadata = {
  title: "Recognize Voices: Captions That Show Who Is Talking by Name",
  description,
  alternates: { canonical: "/recognize-voices" },
  openGraph: {
    title: "Recognize Voices: Captions That Show Who Is Talking by Name | Captio AI",
    description,
    url: "/recognize-voices",
    type: "website",
    images: ["/opengraph-image"],
  },
};

const faqs = [
  {
    q: "How does Captio AI recognize voices?",
    a: "It turns about 20 seconds of someone's speech into a voiceprint on your phone. During captions it compares each speaker's turn with the voices you saved and shows the name when it is confident. When it isn't sure, the line keeps Speaker 1 or Speaker 2.",
  },
  {
    q: "How long does someone need to talk to save their voice?",
    a: "About 20 seconds of actual speech. The recording stops by itself as soon as it has enough. If there still isn't 20 seconds of talking after 90 seconds, nothing is saved and you can try again.",
  },
  {
    q: "Do names show in live captions?",
    a: "Yes. Names appear while people talk, and in saved recordings too. Separate speakers needs to be on (Settings, then Captions).",
  },
  {
    q: "Is Recognize voices free?",
    a: "Yes. The free plan recognizes your own voice plus one other person. Captio AI Plus recognizes more people. On the free plan, recording a voice uses your 100 free credits a day, like captions; saving a voice from a file uses none.",
  },
  {
    q: "Are voiceprints uploaded anywhere?",
    a: "No. Voiceprints are made on your iPhone and stay there. They are not synced to your account or shared. Only the names shown on a recording's lines travel with that recording.",
  },
  {
    q: "What if Captio AI gets a name wrong?",
    a: "Tap the speaker's tag in the recording and pick the right person. The fix applies everywhere that speaker talks in the recording, and the voice learns from your answer.",
  },
  {
    q: "What about people I haven't saved?",
    a: "Their lines show Speaker 1, Speaker 2 and so on. When someone new talks for a while, Captio AI asks who it is. One answer names them in every recording they are in. You can turn the questions off with Ask me who's talking.",
  },
  {
    q: "Can I save a voice from an audio file?",
    a: "Yes. In Add a voice, tap Choose a file instead of recording. The file needs at least 20 seconds of that person talking.",
  },
  {
    q: "Can I remove a saved voice?",
    a: "Yes. Open the person and tap Forget. Their voiceprint is deleted; names already shown in recordings stay until you change them.",
  },
];

export default function RecognizeVoicesPage() {
  return (
    <FeaturePage
      slug="recognize-voices"
      name="Recognize Voices"
      schemaDescription="Captions that show the names of people you talk to often instead of Speaker 2, live and in saved recordings. Voiceprints are made and kept on the phone."
      stepsHeading="Mum, not Speaker 2."
      steps={[
        {
          title: "Add a voice",
          desc: "Open Settings, then Recognize voices, and tap Add a voice. Start with your own.",
          img: "/RV_mockup_1.png",
          alt: "Recognize voices in Captio AI with saved voices for Me, Mum, Ana and Tom",
        },
        {
          title: "Record 20 seconds",
          desc: "Ask them first, then let them talk about anything. It stops by itself once it has 20 seconds of speech.",
          img: "/RV_mockup_2.png",
          alt: "Captio AI recording Mum's voice with live captions and 12 of 20 seconds of talking",
        },
        {
          title: "See names in captions",
          desc: "Their name and emoji show on every line they say, live and in saved recordings.",
          img: "/RV_mockup_3.png",
          alt: "A Sunday lunch recording with lines tagged Me, Mum and Tom",
        },
      ]}
      featuresHeading="Built for tables with many voices"
      featuresIntro="Family dinners, team meetings, a regular appointment. The people you talk to most, named in your captions."
      subfeatures={[
        {
          title: "Names while people talk",
          description: "Names show in live captions as people speak, not only after the recording, so you know who is talking without watching faces.",
        },
        {
          title: "Made on your phone",
          description: "Each voiceprint is made on your iPhone and stays there. It is never uploaded or synced.",
        },
        {
          title: "Captio AI asks who's new",
          description: "When someone it doesn't know talks for a while, Captio AI asks who it is. One answer names them in every recording.",
        },
        {
          title: "Every answer teaches it",
          description: "Tap a speaker's tag to fix a name. Each answer makes recognition better next time.",
        },
        {
          title: "Your own voice too",
          description: "Save your voice and your lines carry your name, so it's clear what you said and what others said.",
        },
        {
          title: "An emoji and a colour per person",
          description: "Pick an emoji and a colour for each person. Their tag looks the same in every recording.",
        },
        {
          title: "Names in exports and summaries",
          description: "Names carry into exports and AI Summary, so the notes say who said what.",
        },
        {
          title: "From a file, too",
          description: "Save a voice from an audio file instead of recording it live.",
        },
        {
          title: "Forget anyone",
          description: "Forget deletes a person's voiceprint whenever you want.",
        },
      ]}
      privacyHeading="Voices never leave your phone."
      privacy={[
        {
          title: "Made on your phone",
          description: "Voiceprints are calculated on your iPhone. The voice engine downloads once, then works on the phone.",
        },
        {
          title: "Never synced",
          description: "Saved voices stay on this phone. They are not uploaded, not synced to your account and not shared.",
        },
        {
          title: "Ask first, forget anytime",
          description: "Captio AI reminds you to ask people before saving their voice. Forget removes a voice whenever you want.",
        },
      ]}
      faqs={faqs}
    />
  );
}
