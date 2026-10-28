import type { Metadata } from "next";
import FeaturePage from "@/components/FeaturePage";

const description =
  "Add Captio AI to Claude, ChatGPT, Gemini or Perplexity and ask about any recording: what was decided, who said it, what the doctor said about your medication. Read-only, free and Plus alike.";

export const metadata: Metadata = {
  title: "Connectors: Ask Claude, ChatGPT, Gemini or Perplexity About Your Recordings",
  description,
  alternates: { canonical: "/connectors" },
  openGraph: {
    title: "Connectors: Ask Claude, ChatGPT, Gemini or Perplexity About Your Recordings | Captio AI",
    description,
    url: "/connectors",
    type: "website",
    images: ["/opengraph-image"],
  },
};

const faqs = [
  {
    q: "What is the Captio AI connector?",
    a: "An address you add to your chat app: https://captioai.app/mcp. It uses MCP (Model Context Protocol), the standard chat apps use to connect to other services. Once it's added, the chat app can search and read the recordings saved to your Captio AI account.",
  },
  {
    q: "Which chat apps work with it?",
    a: "Claude, ChatGPT, Gemini and Perplexity. Each app sets its own rules for custom connectors. As of October 2026: Claude allows one on the free plan and more on paid plans. ChatGPT offers them on Business, Enterprise and Edu, and on Plus and Pro as OpenAI rolls them out. Gemini needs a personal Google account in the US, age 18 or over, in English. Perplexity needs Pro, Max or Enterprise.",
  },
  {
    q: "Do I need Captio AI Plus?",
    a: "No. The connector works on the free plan and on Plus. You need a Captio AI account (sign in with Apple or Google), because the chat app reads the recordings saved to your account.",
  },
  {
    q: "How do I add it to Claude?",
    a: "On claude.ai, open Customize, then Connectors. Click +, then Add custom connector. Name it Captio AI, enter https://captioai.app/mcp and click Add. Click Connect, sign in with your Captio AI account and click Allow.",
  },
  {
    q: "How do I add it to ChatGPT?",
    a: "In ChatGPT, open Plugins, click + and choose Add custom MCP server. Enter a name, https://captioai.app/mcp and OAuth as the authentication, confirm, then sign in with your Captio AI account and click Allow. Install it with + in Plugins and type @ in a chat to use it. Settings, then Connectors in the app shows the current steps for every chat app.",
  },
  {
    q: "What can I ask?",
    a: "Anything about what was said. “What did we decide about the launch date?”, “What did the doctor say about my blood pressure?”, “Summarise Tuesday's lecture.” It finds passages by meaning, finds exact names and numbers, and can read a whole recording or one stretch of it.",
  },
  {
    q: "Does it work across languages?",
    a: "Yes. It searches by meaning, so a question in English finds a discussion that was spoken in another language.",
  },
  {
    q: "Can it read recordings in shared folders?",
    a: "Yes: your own recordings and every recording in the shared folders you are in. Never a colleague's other recordings. If you leave a folder, its recordings are no longer readable.",
  },
  {
    q: "Can the chat app change or delete my recordings?",
    a: "No. The connector is read-only. It can search and read, nothing else.",
  },
  {
    q: "Where do my recordings go when the chat app reads them?",
    a: "The passages the chat app reads are sent to the chat app you connected and handled under that app's own privacy terms. Captio AI never sells your content and never uses it to train AI models. Remove the connector in your chat app to stop it.",
  },
];

export default function ConnectorsPage() {
  return (
    <FeaturePage
      slug="connectors"
      name="Connectors"
      schemaDescription="A read-only connector (MCP) that lets Claude, ChatGPT, Gemini and Perplexity search and read your Captio AI recordings, including shared folders."
      stepsHeading="Ask your recordings anything."
      steps={[
        {
          title: "Copy the address",
          desc: "In Captio AI, open Settings, then Connectors, and copy https://captioai.app/mcp, or send it to your computer.",
          img: "/CN_mockup_1.png",
          alt: "The Connectors screen in Captio AI with the address https://captioai.app/mcp",
        },
        {
          title: "Add it to your chat app",
          desc: "Add a custom connector in Claude, ChatGPT, Gemini or Perplexity. Captio AI shows the steps for each.",
          img: "/CN_mockup_2.png",
          alt: "Step guide: name the connector Captio AI, enter https://captioai.app/mcp and click Add",
        },
        {
          title: "Sign in and ask",
          desc: "Sign in with your Captio AI account, click Allow, then ask about any recording.",
          img: "/CN_mockup_3.png",
          alt: "Step guide: Claude asking to read your Captio AI recordings, with the Allow button",
        },
      ]}
      featuresHeading="Your captions, one question away"
      featuresIntro="Hours of meetings, lectures and appointments. Ask the chat app you already use and get the answer with who said it and when."
      subfeatures={[
        {
          title: "Finds it by meaning",
          description: "Ask in your own words. It finds the passage even when different words were spoken, and across languages.",
        },
        {
          title: "Exact words too",
          description: "Names, numbers and quotes: it can list every line where the exact words were said.",
        },
        {
          title: "Reads a whole recording",
          description: "Ask for a summary of Tuesday's meeting, or just the part where someone talked about the budget.",
        },
        {
          title: "Knows who said it",
          description: "Answers come with who said it, from the names in your captions, and when and where it was recorded.",
        },
        {
          title: "Shared folders included",
          description: "A team that records into one shared folder can each ask their own chat app about the same meetings.",
        },
        {
          title: "Four chat apps",
          description: "Claude, ChatGPT, Gemini and Perplexity. Once added on the web, it also works in that chat app on your phone.",
        },
        {
          title: "Read-only",
          description: "The chat app can search and read. It can't change, add or delete anything.",
        },
        {
          title: "Nothing to install",
          description: "It's one address you add in your chat app. No plugin, no download.",
        },
        {
          title: "Free and Plus alike",
          description: "Every Captio AI account can use it. Your chat app's own plan rules for custom connectors apply.",
        },
      ]}
      privacyHeading="You decide what it reads."
      privacy={[
        {
          title: "Read-only",
          description: "The connector can search and read your recordings. It can't edit, delete or add anything.",
        },
        {
          title: "Only what you can see",
          description: "Your own recordings and those in shared folders you belong to. Never anyone's other recordings.",
        },
        {
          title: "Only after you allow it",
          description: "It works only after you sign in with your Captio AI account and click Allow. Remove the connector in your chat app to stop it.",
        },
      ]}
      faqs={faqs}
    />
  );
}
