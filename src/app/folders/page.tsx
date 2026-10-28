import type { Metadata } from "next";
import FeaturePage from "@/components/FeaturePage";

const description =
  "Sort your saved captions into folders and share a folder with family, classmates or your team. Captio AI suggests a folder for each new recording and asks before it moves anything.";

export const metadata: Metadata = {
  title: "Folders and Shared Folders for Your Captions",
  description,
  alternates: { canonical: "/folders" },
  openGraph: {
    title: "Folders and Shared Folders for Your Captions | Captio AI",
    description,
    url: "/folders",
    type: "website",
    images: ["/opengraph-image"],
  },
};

const faqs = [
  {
    q: "How do I make a folder in Captio AI?",
    a: "Open the Folders tab on the home screen and tap New folder. Give it a name, an icon and a colour. Hold a folder to drag it to a new place in the grid.",
  },
  {
    q: "How do I move a recording into a folder?",
    a: "Tap ⋯ next to a recording and choose Move to folder. You can also open a folder and start Live Captions, Live Translator or an upload from inside it, and the recording is saved straight into that folder.",
  },
  {
    q: "Does Captio AI move my recordings on its own?",
    a: "No. When a recording is saved, Captio AI suggests the folder it fits best and asks. Nothing moves until you tap Save to folder. You can pick another folder or tap No thanks.",
  },
  {
    q: "How do I share a folder?",
    a: "Open the folder and tap Add members. Captio AI makes an invite link and a code you can send any way you like. People join by opening the link or typing the code under the folder grid. Everyone in a shared folder needs a Captio AI account.",
  },
  {
    q: "What can people in a shared folder see?",
    a: "Every recording in that folder, from everyone in it, with its captions. Each recording shows who added it. Nothing outside the folder is shared: your other recordings stay yours.",
  },
  {
    q: "Can people in a shared folder edit my recordings?",
    a: "No. Only the person who made a recording can change it. Everyone else in the folder can read it. The folder's owner can rename the folder, remove people or delete the folder.",
  },
  {
    q: "What happens when someone leaves a shared folder?",
    a: "Their recordings leave the folder with them, and they no longer see the recordings of the others in it.",
  },
  {
    q: "Will I know when someone adds a recording?",
    a: "Yes, if notifications are on for Captio AI. You get a notification such as: Ana added “Weekly sync”. Tapping it opens the folder.",
  },
  {
    q: "Can a whole office record into one shared folder?",
    a: "Yes. A recording made in a shared folder is saved every hour and carries on in a new recording, so a long day becomes a row of hour-long recordings that everyone in the folder can read. With Connectors, each person can also ask their own chat app about what was said.",
  },
  {
    q: "Are folders free?",
    a: "Yes. Folders and shared folders work on the free plan. Recording still uses the free plan's 100 free credits a day; Captio AI Plus removes the daily limit.",
  },
];

export default function FoldersPage() {
  return (
    <FeaturePage
      slug="folders"
      name="Folders"
      schemaDescription="Folders for saved captions and transcripts, with shared folders for family, classmates and teams. Captio AI suggests a folder for each recording and asks before moving it."
      stepsHeading="Every recording in its place."
      steps={[
        {
          title: "Make a folder",
          desc: "Name it and give it an icon and a colour: Lectures, Doctor, Family, Work.",
          img: "/FO_mockup_1.png",
          alt: "The Folders tab in Captio AI with folders for Weekly sync, Lectures, Doctor, Family and Church",
        },
        {
          title: "Say yes to the suggestion",
          desc: "When you save a recording, Captio AI suggests the folder it fits. Nothing moves until you say yes.",
          img: "/FO_mockup_2.png",
          alt: "Captio AI asking “Save to Lectures?” after a biology lecture was recorded",
        },
        {
          title: "Share it",
          desc: "Invite people with a link. Everyone sees every recording in the folder and can add their own.",
          img: "/FO_mockup_3.png",
          alt: "A shared Weekly sync folder with recordings added by Ana, Marko and Sara",
        },
      ]}
      featuresHeading="Built for the way you keep things"
      featuresIntro="Lectures in one place, doctor's appointments in another, the team's meetings where the whole team can read them."
      subfeatures={[
        {
          title: "A folder for every part of your life",
          description: "Lectures, check-ups, family dinners, team meetings. Each folder gets its own icon and colour, so you find it at a glance.",
        },
        {
          title: "Captio AI asks first",
          description: "After a recording is saved, Captio AI suggests the folder it belongs in and waits for your answer. It never moves a recording on its own.",
        },
        {
          title: "Shared folders",
          description: "Invite family, classmates or colleagues with a link or a code. Everyone reads the same captions, so nobody has to retell what was said.",
        },
        {
          title: "Record straight into a folder",
          description: "Open a folder and start Live Captions, Live Translator or an upload from there. The recording lands in that folder.",
        },
        {
          title: "See who added what",
          description: "Each recording in a shared folder shows who made it, and a notification tells you when someone adds a new one.",
        },
        {
          title: "Only the author edits",
          description: "In a shared folder, only the person who made a recording can change it. Everyone else reads it.",
        },
        {
          title: "Caption a whole day",
          description: "Recording into a shared folder saves every hour and carries on in a new recording, so an office can caption a full working day.",
        },
        {
          title: "Leave whenever you want",
          description: "Leaving a folder takes your recordings out of it. Your other recordings were never in it.",
        },
        {
          title: "Free on every plan",
          description: "Folders and shared folders are part of the free plan, next to 100 free credits a day for captions.",
        },
      ]}
      privacyHeading="Shared with your people, nobody else."
      privacy={[
        {
          title: "Only the people you invite",
          description: "A shared folder is open only to people who got your invite. The folder's owner can remove anyone at any time.",
        },
        {
          title: "The rest stays yours",
          description: "Sharing one folder never shows your other recordings. Leaving a folder takes your recordings out of it.",
        },
        {
          title: "Not used to train anything",
          description: "Recordings in your folders are never sold, never shared for advertising and never used to train AI models.",
        },
      ]}
      faqs={faqs}
    />
  );
}
