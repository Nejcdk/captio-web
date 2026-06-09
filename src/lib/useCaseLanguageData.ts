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
      headline: "Chinese everyday speech bears little resemblance to the Mandarin in a textbook",
      cards: [
        {
          tag: "Tonal system",
          title: "Tones you cannot lip-read",
          description: "Mandarin's 4 tones distinguish thousands of homophones — but tone is purely acoustic. Lip-reading captures mouth shape, not pitch. In casual speech, those tones are further reduced and neutralised (arXiv, 2024).",
        },
        {
          tag: "Casual speech",
          title: "Syllables dropped, sounds swallowed",
          description: "Fast conversational Mandarin bears little resemblance to textbook pronunciation. Sentence-final particles — 吧, 吗, 呢 — are often barely audible. Unstressed syllables disappear entirely.",
        },
        {
          tag: "Regional varieties",
          title: "Cantonese, Wu, Min — not one language",
          description: "Hong Kong runs on Cantonese. Shanghai carries Wu phonology. These are not accents — they are distinct linguistic systems, each with their own tonal structure and vocabulary.",
        },
        {
          tag: "Code-switching",
          title: "Chinese-English, mid-sentence",
          description: "In Singapore, Hong Kong, and Taiwan, sentences routinely switch between Chinese and English without warning. Neither language alone captures the full conversation.",
        },
        {
          tag: "Homophones",
          title: "Same sound, dozens of meanings",
          description: "Mandarin has among the highest homophone density of any language. Without tones — which casual speech drops — the same syllable can mean entirely different things. Context fills the gap only if you caught what came before.",
        },
        {
          tag: "Written gap",
          title: "Characters do not bridge the conversation",
          description: "Typing on a phone to communicate breaks the flow, requires character literacy from both sides, and marks every interaction as different from what hearing participants experience. It is a workaround, not a solution.",
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
      headline: "27.8 million. Left out.",
      paragraphs: [
        "China has the largest deaf population in the world: 27.8 million people, according to China's Second National Disability Survey — navigating daily life in a country where sign language has no formal legal recognition, specialist deaf schools are concentrated in cities, and accessibility infrastructure for everyday communication is sparse. Hearing loss prevalence has risen consistently from 1990 to 2021, driven by an ageing population, and is projected to increase further (Frontiers in Public Health, 2025).",
        "For many Chinese deaf and hard of hearing people, everyday interactions are described as uphill battles — from pharmacies to bank counters to family gatherings (Medium, 2024). Over 75% of people with disabilities in China live in rural areas, far from the urban centres where support is concentrated. In those settings, a deaf person navigating a counter conversation or a street interaction has no formal system to fall back on.",
        "The burden is carried individually and invisibly. Without sign language recognition or interpreter availability, deaf and hard of hearing Chinese speakers navigate conversations through lip-reading tones that cannot be lip-read, typing characters on phones that breaks every conversation's rhythm, and — too often — simply not fully participating. A hearing person's casual exchange requires no effort. The same exchange, for a deaf or hard of hearing Chinese speaker, is a series of reconstructions. Captio AI captions Mandarin and Cantonese at the speed of real conversation, not textbook speech.",
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
