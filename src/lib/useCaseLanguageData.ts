import type { SubUseCase } from "./useCases";

export type WhyHardCard = {
  tag: string;
  title: string;
  description: string;
};

export type UseCaseLanguageVariant = {
  useCaseSlug: string;
  languageSlug: string;
  heroDescription?: string;
  whyHardSection: {
    headline: string;
    cards: WhyHardCard[];
  };
  subUseCases: SubUseCase[];
  challenge: {
    headline: string;
    paragraphs: string[];
    citations?: { label: string; url: string }[];
  };
  reviews: { name: string; flag: string; email: string; detail: string; quote: string }[];
  faqs: { q: string; a: string }[];
};

export const useCaseLanguageVariants: UseCaseLanguageVariant[] = [
  {
    useCaseSlug: "everyday-conversations",
    languageSlug: "chinese",
    heroDescription: "Chinese everyday conversations move at full speed — tones neutralised, syllables dropped, regional varieties shifting mid-sentence. Captio AI captions Mandarin and Cantonese in real time so nothing leaves you behind.",
    whyHardSection: {
      headline: "Everyday Chinese conversations have no accommodation and no second chance",
      cards: [
        {
          tag: "Counter interactions",
          title: "The pharmacy counter does not wait",
          description: "Shop staff, pharmacists, and service workers speak at full conversational pace and do not know you are deaf. There is no interpreter at a pharmacy counter. The person behind you is already impatient. You have one exchange to get it right.",
        },
        {
          tag: "Family settings",
          title: "Family dinners exclude through speed, not hostility",
          description: "Multigenerational Chinese family gatherings involve fast overlapping speech, jokes, callbacks, and sudden topic shifts. The social meaning — who laughed, what was implied — matters as much as the words. Casual family Mandarin is nothing like formal speech: syllables drop, tones flatten, regional varieties mix.",
        },
        {
          tag: "Casual register",
          title: "Daily Chinese sounds nothing like the textbook",
          description: "Formal Mandarin has clear tones and deliberate pronunciation. Everyday speech drops syllables, neutralises tones, and runs sentence particles together. The gap between classroom Chinese and what a street vendor or neighbour actually says is immense — and widens at conversational speed.",
        },
        {
          tag: "No formal support",
          title: "Workplaces sometimes accommodate. Daily life never does.",
          description: "Hospitals and employers occasionally provide accessibility support. Street markets, dinner tables, taxi rides, and shop queues never do. These interactions happen dozens of times a day, with no interpreter, no system, and no fallback — just the deaf person navigating alone.",
        },
        {
          tag: "Code-switching",
          title: "Daily conversations switch languages without warning",
          description: "In Hong Kong, Singapore, and urban Taiwan, a single street interaction or family meal can move between Cantonese, Mandarin, and English mid-sentence. Following the meaning requires all three at once — something no single-language approach handles.",
        },
      ],
    },
    subUseCases: [
      {
        icon: "🏪",
        title: "Counter conversations",
        description: "Pharmacy staff, shop assistants, and service workers speaking at full pace in regional Mandarin or Cantonese. In Hong Kong, Cantonese is the default. In mainland cities, regional-accented Mandarin. Captio AI captions whoever is speaking so you follow the exchange before the moment passes.",
      },
      {
        icon: "🍽️",
        title: "Multigenerational family dinners",
        description: "Chinese family meals often involve multiple generations using different varieties — grandparents in Shanghainese or Cantonese, parents in Mandarin, younger generations switching to English mid-sentence. Captio AI follows whoever is speaking without any manual switching.",
      },
      {
        icon: "👋",
        title: "Talking to strangers",
        description: "Asking for directions, meeting neighbours, chatting with locals in unfamiliar cities. In China's major urban centres, you are likely to encounter Mandarin with strong regional accents. Captio AI captions anyone who speaks near you.",
      },
      {
        icon: "☕",
        title: "Informal work moments",
        description: "Office chats, hallway catch-ups, quick questions in Chinese workplaces where conversations happen fast and often shift between formal and casual registers. Captio AI keeps you in the moments that happen without warning.",
      },
      {
        icon: "📋",
        title: "Appointments and admin",
        description: "Hospitals, government offices, and banks in China move fast, use formal vocabulary, and rarely repeat. Captio AI gives you a real-time transcript of everything said so you can follow and respond accurately.",
      },
      {
        icon: "🚉",
        title: "Getting around",
        description: "Transport staff, metro announcements, taxi drivers, asking for help at rail stations. China's transport infrastructure announces everything by sound. Captio AI captions whoever is speaking — on a platform or across a counter.",
      },
    ],
    challenge: {
      headline: "27.8 million people. Excluded from ordinary life.",
      paragraphs: [
        "China has the largest deaf and hard of hearing population in the world — 27.8 million people, according to the Second National Sample Survey on Disability. They are not excluded from education or employment alone. They are excluded from the texture of daily social life: the family meal where everyone else is laughing, the neighbourhood exchange that hearing people complete without thinking, the moment of belonging that happens through casual conversation.",
        "China has no formal recognition of sign language as a national language. Interpreter services are concentrated in cities and institutions. For the 27.8 million navigating everyday life — not workplaces or hospitals, but streets, homes, and the unstructured flow of daily existence — there is no system. There is only the individual, managing alone, every day.",
        "Hearing loss prevalence in China has risen consistently from 1990 to 2021, driven by an ageing population, and is projected to continue increasing. The number of people navigating daily Chinese life without sound is growing. The infrastructure to support them in everyday conversation is not keeping pace.",
      ],
      citations: [
        { label: "China's Second National Sample Survey on Disability — hearing disability prevalence", url: "https://pubmed.ncbi.nlm.nih.gov/19031751/" },
        { label: "Barriers to Chinese National Sign Language acceptance — SAGE Journals, 2025", url: "https://journals.sagepub.com/doi/10.1177/21582440251332390" },
        { label: "Temporal trends in hearing loss in China 1990–2021 — Frontiers in Public Health, 2025", url: "https://www.frontiersin.org/journals/public-health/articles/10.3389/fpubh.2025.1538145/full" },
      ],
    },
    reviews: [
      { name: "Wei L.", flag: "🇨🇳", email: "wei.l***@gmail.com", detail: "Deaf since childhood, Beijing", quote: "Casual Mandarin in Beijing moves fast and the tones run together. Captio AI follows every word. Everyday conversations stopped being exhausting." },
      { name: "Mei C.", flag: "🇭🇰", email: "mei.c***@gmail.com", detail: "Hard of hearing, Hong Kong", quote: "Cantonese everyday speech is fast and nobody thinks to slow down. I put Captio AI between me and whoever I am talking to. I stopped missing things." },
      { name: "Jing T.", flag: "🇨🇳", email: "jing.t***@gmail.com", detail: "Hard of hearing, Shanghai", quote: "Shanghai Mandarin carries Wu features that make lip-reading almost useless. Captio AI gives me the words as they are spoken. It changed how I navigate the city." },
      { name: "Nathan K.", flag: "🇸🇬", email: "nathan.k***@gmail.com", detail: "Hard of hearing, Singapore", quote: "Singapore conversations switch between English and Mandarin without warning. Captio AI handles both in the same session. I follow everything now." },
    ],
    faqs: [
      { q: "Does Captio AI handle the tones in fast casual Mandarin speech?", a: "Yes. Captio AI is trained on real conversational Mandarin, not just formal or textbook speech. It handles the tone reduction, syllable dropping, and sound connections that characterise fast casual Mandarin accurately." },
      { q: "Does it work for Cantonese everyday conversations?", a: "Yes. Captio AI supports Cantonese with full accuracy, displaying captions in Traditional Chinese characters. For everyday conversations in Hong Kong, Guangdong, Macau, and overseas Cantonese communities, it works the same way as for Mandarin." },
      { q: "What about code-switching between Chinese and English?", a: "Yes. Many Chinese speakers in Hong Kong, Singapore, and Taiwan mix Chinese and English mid-sentence. Captio AI handles this naturally, displaying each language in the correct script without any manual switching." },
      { q: "Does it work for regional accents — Shanghai, Guangdong-accented Mandarin?", a: "Yes. Captio AI handles regional-accented Mandarin including Shanghainese Mandarin (Wu-influenced), southern Mandarin from Guangdong, and the distinct phonological patterns of Taiwanese Mandarin. Regional variation is part of how real Chinese is spoken." },
      { q: "Does it display Simplified or Traditional Chinese characters?", a: "Captio AI displays the correct character set automatically. Mainland Mandarin appears in Simplified characters. Cantonese and Taiwanese Mandarin appear in Traditional characters. No manual switching is needed." },
      { q: "Does it work for multigenerational conversations where different family members speak different varieties?", a: "Yes. Captio AI follows whoever is speaking at any moment. In a family setting where one person speaks Cantonese, another Mandarin, and a younger member code-switches with English, it captions each speaker in the variety they are using." },
      { q: "What about noisy everyday settings — markets, street food stalls, busy restaurants?", a: "Yes. Captio AI handles typical background noise in Chinese everyday environments — street markets, busy restaurants, loud family gatherings. Hold or place the phone toward whoever you want to follow. Very loud environments may reduce accuracy slightly but typical busy Chinese settings are handled well." },
      { q: "Does Captio AI work in mainland China?", a: "Captio AI requires an internet connection. It works on any Wi-Fi or mobile data connection available in mainland China. Standard mobile data connections in China are sufficient to run the app." },
      { q: "Does it work for conversations with elderly Chinese speakers who may use non-Mandarin varieties?", a: "Yes. If an elderly family member speaks Cantonese or Shanghainese Mandarin, Captio AI handles those varieties. For speakers of regional dialects like Hokkien or Hakka, accuracy depends on the specific variety — Cantonese and standard regional Mandarin are fully supported." },
      { q: "What if someone in the conversation speaks a language I do not understand?", a: "Switch to Live Translator. The other person speaks their language — you read in yours in real time. For Chinese-English, Chinese-French, or any combination across the 60+ supported languages, Live Translator handles it without any manual setup." },
    ],
  },
];

export function getUseCaseLanguageVariant(
  useCaseSlug: string,
  languageSlug: string
): UseCaseLanguageVariant | undefined {
  return useCaseLanguageVariants.find(
    (v) => v.useCaseSlug === useCaseSlug && v.languageSlug === languageSlug
  );
}
