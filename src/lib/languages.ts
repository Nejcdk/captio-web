export type Language = {
  language: string;
  languageSlug: string;
  countries: string;
  speakerCount: string;
  dialectNote: string;
  languageFAQ: string;
};

export const languages: Language[] = [
  { language: "English", languageSlug: "english", countries: "United States, United Kingdom, Australia, Canada", speakerCount: "1.5 billion", dialectNote: "Supports American, British, Australian and other English accents", languageFAQ: "Does Captio AI work with strong regional English accents?" },
  { language: "Chinese", languageSlug: "chinese", countries: "China, Taiwan, Singapore", speakerCount: "1.1 billion", dialectNote: "Supports Mandarin (Simplified and Traditional characters)", languageFAQ: "Does Captio AI support Cantonese as well as Mandarin?" },
  { language: "Hindi", languageSlug: "hindi", countries: "India", speakerCount: "600 million", dialectNote: "Supports Standard Hindi and common regional accents", languageFAQ: "Does Captio AI work with Hinglish (Hindi-English code-switching)?" },
  { language: "Spanish", languageSlug: "spanish", countries: "Spain, Mexico, Colombia, Argentina, and 17 more countries", speakerCount: "500 million", dialectNote: "Supports Latin American Spanish and Castilian Spanish", languageFAQ: "Does Captio AI work with Mexican Spanish and Latin American accents?" },
  { language: "Arabic", languageSlug: "arabic", countries: "Egypt, Saudi Arabia, UAE, Morocco, and 18 more countries", speakerCount: "420 million", dialectNote: "Supports Modern Standard Arabic and major regional dialects", languageFAQ: "Does Captio AI work with Egyptian Arabic and Gulf Arabic dialects?" },
  { language: "Bengali", languageSlug: "bengali", countries: "Bangladesh, India", speakerCount: "230 million", dialectNote: "Supports Standard Bengali", languageFAQ: "Does Captio AI work for Bengali-speaking deaf and hard of hearing users?" },
  { language: "Portuguese", languageSlug: "portuguese", countries: "Brazil, Portugal, Angola, Mozambique", speakerCount: "260 million", dialectNote: "Supports Brazilian Portuguese and European Portuguese", languageFAQ: "Does Captio AI distinguish between Brazilian and European Portuguese?" },
  { language: "Russian", languageSlug: "russian", countries: "Russia, Belarus, Kazakhstan, Kyrgyzstan", speakerCount: "258 million", dialectNote: "Supports Standard Russian across all regional accents", languageFAQ: "Does Captio AI work with regional Russian accents?" },
  { language: "Urdu", languageSlug: "urdu", countries: "Pakistan, India", speakerCount: "170 million", dialectNote: "Supports Standard Urdu", languageFAQ: "Does Captio AI work for Urdu-speaking deaf users in Pakistan?" },
  { language: "Indonesian", languageSlug: "indonesian", countries: "Indonesia", speakerCount: "270 million", dialectNote: "Supports Standard Indonesian (Bahasa Indonesia)", languageFAQ: "Does Captio AI work with Indonesian regional accents?" },
  { language: "German", languageSlug: "german", countries: "Germany, Austria, Switzerland", speakerCount: "135 million", dialectNote: "Supports Standard German, Austrian and Swiss German", languageFAQ: "Does Captio AI work in Swiss German dialect?" },
  { language: "Japanese", languageSlug: "japanese", countries: "Japan", speakerCount: "125 million", dialectNote: "Supports Standard Japanese (Tokyo dialect) and common regional speech", languageFAQ: "Does Captio AI work with Osaka dialect (Kansai-ben)?" },
  { language: "Swahili", languageSlug: "swahili", countries: "Kenya, Tanzania, Uganda", speakerCount: "200 million", dialectNote: "Supports Standard Swahili", languageFAQ: "Does Captio AI work for Swahili-speaking deaf users in East Africa?" },
  { language: "Marathi", languageSlug: "marathi", countries: "India (Maharashtra)", speakerCount: "83 million", dialectNote: "Supports Standard Marathi", languageFAQ: "Does Captio AI work for Marathi-speaking hard of hearing users?" },
  { language: "Telugu", languageSlug: "telugu", countries: "India (Andhra Pradesh, Telangana)", speakerCount: "83 million", dialectNote: "Supports Standard Telugu", languageFAQ: "Does Captio AI work for Telugu-speaking deaf users?" },
  { language: "Turkish", languageSlug: "turkish", countries: "Turkey, Cyprus", speakerCount: "88 million", dialectNote: "Supports Standard Turkish across all regional accents", languageFAQ: "Does Captio AI work for deaf people who use Turkish Sign Language?" },
  { language: "Vietnamese", languageSlug: "vietnamese", countries: "Vietnam", speakerCount: "95 million", dialectNote: "Supports Northern and Southern Vietnamese varieties", languageFAQ: "Does Captio AI work with both Northern and Southern Vietnamese?" },
  { language: "Korean", languageSlug: "korean", countries: "South Korea, North Korea", speakerCount: "80 million", dialectNote: "Supports Standard Korean (Seoul dialect)", languageFAQ: "Does Captio AI work for Korean sign language users who also speak Korean?" },
  { language: "French", languageSlug: "french", countries: "France, Belgium, Switzerland, Canada, and 25 more countries", speakerCount: "310 million", dialectNote: "Supports Standard French, Canadian French, and Belgian French", languageFAQ: "Does Captio AI work with Québécois French accent?" },
  { language: "Italian", languageSlug: "italian", countries: "Italy, Switzerland, San Marino", speakerCount: "85 million", dialectNote: "Supports Standard Italian and regional accents", languageFAQ: "Does Captio AI work with Southern Italian accents?" },
  { language: "Tamil", languageSlug: "tamil", countries: "India, Sri Lanka, Singapore", speakerCount: "78 million", dialectNote: "Supports Standard Tamil", languageFAQ: "Does Captio AI work for Tamil-speaking deaf users in Sri Lanka?" },
  { language: "Persian", languageSlug: "persian", countries: "Iran, Afghanistan, Tajikistan", speakerCount: "70 million", dialectNote: "Supports Farsi (Iranian Persian) and Dari", languageFAQ: "Does Captio AI work with Afghan Dari Persian?" },
  { language: "Punjabi", languageSlug: "punjabi", countries: "India, Pakistan", speakerCount: "130 million", dialectNote: "Supports Standard Punjabi", languageFAQ: "Does Captio AI work for Punjabi-speaking deaf users?" },
  { language: "Gujarati", languageSlug: "gujarati", countries: "India (Gujarat)", speakerCount: "55 million", dialectNote: "Supports Standard Gujarati", languageFAQ: "Does Captio AI work for Gujarati-speaking hard of hearing users?" },
  { language: "Thai", languageSlug: "thai", countries: "Thailand", speakerCount: "60 million", dialectNote: "Supports Standard Thai (Central Thai dialect)", languageFAQ: "Does Captio AI work with Thai regional dialects and tones?" },
  { language: "Polish", languageSlug: "polish", countries: "Poland", speakerCount: "45 million", dialectNote: "Supports Standard Polish and regional accents", languageFAQ: "Does Captio AI work with Silesian or Kashubian accents in Polish?" },
  { language: "Ukrainian", languageSlug: "ukrainian", countries: "Ukraine", speakerCount: "40 million", dialectNote: "Supports Standard Ukrainian", languageFAQ: "Does Captio AI work for Ukrainian deaf and hard of hearing users?" },
  { language: "Malay", languageSlug: "malay", countries: "Malaysia, Singapore, Brunei", speakerCount: "33 million", dialectNote: "Supports Standard Malay and Malaysian English-Malay speech", languageFAQ: "Does Captio AI work with Bahasa Malaysia and Singaporean Malay?" },
  { language: "Malayalam", languageSlug: "malayalam", countries: "India (Kerala)", speakerCount: "35 million", dialectNote: "Supports Standard Malayalam", languageFAQ: "Does Captio AI work for Malayalam-speaking deaf users in Kerala?" },
  { language: "Kannada", languageSlug: "kannada", countries: "India (Karnataka)", speakerCount: "43 million", dialectNote: "Supports Standard Kannada", languageFAQ: "Does Captio AI work for Kannada-speaking hard of hearing users?" },
  { language: "Tagalog", languageSlug: "tagalog", countries: "Philippines", speakerCount: "28 million", dialectNote: "Supports Standard Filipino/Tagalog", languageFAQ: "Does Captio AI work for Filipino deaf users?" },
  { language: "Azerbaijani", languageSlug: "azerbaijani", countries: "Azerbaijan, Iran", speakerCount: "35 million", dialectNote: "Supports Standard Azerbaijani", languageFAQ: "Does Captio AI work for Azerbaijani-speaking hard of hearing users?" },
  { language: "Dutch", languageSlug: "dutch", countries: "Netherlands, Belgium", speakerCount: "25 million", dialectNote: "Supports Standard Dutch and Flemish Dutch", languageFAQ: "Does Captio AI work with Belgian Dutch (Flemish)?" },
  { language: "Romanian", languageSlug: "romanian", countries: "Romania, Moldova", speakerCount: "24 million", dialectNote: "Supports Standard Romanian", languageFAQ: "Does Captio AI work for Romanian hard of hearing users?" },
  { language: "Kazakh", languageSlug: "kazakh", countries: "Kazakhstan", speakerCount: "13 million", dialectNote: "Supports Standard Kazakh", languageFAQ: "Does Captio AI work for Kazakh-speaking deaf users?" },
  { language: "Czech", languageSlug: "czech", countries: "Czech Republic", speakerCount: "11 million", dialectNote: "Supports Standard Czech", languageFAQ: "Does Captio AI work with Czech regional accents and dialects?" },
  { language: "Hungarian", languageSlug: "hungarian", countries: "Hungary, Romania, Slovakia", speakerCount: "13 million", dialectNote: "Supports Standard Hungarian", languageFAQ: "Does Captio AI work for Hungarian deaf community users?" },
  { language: "Greek", languageSlug: "greek", countries: "Greece, Cyprus", speakerCount: "13 million", dialectNote: "Supports Standard Modern Greek", languageFAQ: "Does Captio AI work with Cypriot Greek accent?" },
  { language: "Swedish", languageSlug: "swedish", countries: "Sweden, Finland", speakerCount: "13 million", dialectNote: "Supports Standard Swedish and Finland Swedish", languageFAQ: "Does Captio AI work with Swedish regional dialects like Scanian?" },
  { language: "Hebrew", languageSlug: "hebrew", countries: "Israel", speakerCount: "9 million", dialectNote: "Supports Modern Hebrew", languageFAQ: "Does Captio AI work for Israeli deaf and hard of hearing users?" },
  { language: "Bulgarian", languageSlug: "bulgarian", countries: "Bulgaria", speakerCount: "8 million", dialectNote: "Supports Standard Bulgarian", languageFAQ: "Does Captio AI work for Bulgarian-speaking hard of hearing users?" },
  { language: "Serbian", languageSlug: "serbian", countries: "Serbia, Bosnia", speakerCount: "12 million", dialectNote: "Supports Standard Serbian", languageFAQ: "Does Captio AI work for Serbian deaf users?" },
  { language: "Danish", languageSlug: "danish", countries: "Denmark", speakerCount: "6 million", dialectNote: "Supports Standard Danish", languageFAQ: "Does Captio AI work with Danish regional accents?" },
  { language: "Albanian", languageSlug: "albanian", countries: "Albania, Kosovo", speakerCount: "7.5 million", dialectNote: "Supports Standard Albanian (Tosk and Gheg)", languageFAQ: "Does Captio AI work with Kosovo Albanian accent?" },
  { language: "Afrikaans", languageSlug: "afrikaans", countries: "South Africa, Namibia", speakerCount: "7 million", dialectNote: "Supports Standard Afrikaans", languageFAQ: "Does Captio AI work for Afrikaans-speaking deaf users in South Africa?" },
  { language: "Belarusian", languageSlug: "belarusian", countries: "Belarus", speakerCount: "7 million", dialectNote: "Supports Standard Belarusian", languageFAQ: "Does Captio AI work for Belarusian hard of hearing users?" },
  { language: "Finnish", languageSlug: "finnish", countries: "Finland", speakerCount: "5 million", dialectNote: "Supports Standard Finnish", languageFAQ: "Does Captio AI work for Finnish deaf community users?" },
  { language: "Slovak", languageSlug: "slovak", countries: "Slovakia", speakerCount: "5 million", dialectNote: "Supports Standard Slovak", languageFAQ: "Does Captio AI work for Slovak-speaking hard of hearing users?" },
  { language: "Croatian", languageSlug: "croatian", countries: "Croatia, Bosnia", speakerCount: "5 million", dialectNote: "Supports Standard Croatian", languageFAQ: "Does Captio AI work for Croatian deaf users?" },
  { language: "Norwegian", languageSlug: "norwegian", countries: "Norway", speakerCount: "5 million", dialectNote: "Supports Bokmål and Nynorsk varieties of Norwegian", languageFAQ: "Does Captio AI support both Bokmål and Nynorsk Norwegian?" },
  { language: "Catalan", languageSlug: "catalan", countries: "Spain (Catalonia, Valencia, Balearic Islands), Andorra", speakerCount: "10 million", dialectNote: "Supports Central Catalan and Valencian", languageFAQ: "Does Captio AI work with Valencian dialect of Catalan?" },
  { language: "Lithuanian", languageSlug: "lithuanian", countries: "Lithuania", speakerCount: "3 million", dialectNote: "Supports Standard Lithuanian", languageFAQ: "Does Captio AI work for Lithuanian hard of hearing users?" },
  { language: "Bosnian", languageSlug: "bosnian", countries: "Bosnia and Herzegovina", speakerCount: "2.5 million", dialectNote: "Supports Standard Bosnian", languageFAQ: "Does Captio AI work for Bosnian deaf users?" },
  { language: "Galician", languageSlug: "galician", countries: "Spain (Galicia)", speakerCount: "2.4 million", dialectNote: "Supports Standard Galician", languageFAQ: "Does Captio AI work for Galician-speaking hard of hearing users?" },
  { language: "Macedonian", languageSlug: "macedonian", countries: "North Macedonia", speakerCount: "2 million", dialectNote: "Supports Standard Macedonian", languageFAQ: "Does Captio AI work for Macedonian deaf users?" },
  { language: "Slovenian", languageSlug: "slovenian", countries: "Slovenia", speakerCount: "2 million", dialectNote: "Supports Standard Slovenian", languageFAQ: "Does Captio AI work for Slovenian hard of hearing users?" },
  { language: "Latvian", languageSlug: "latvian", countries: "Latvia", speakerCount: "1.7 million", dialectNote: "Supports Standard Latvian", languageFAQ: "Does Captio AI work for Latvian deaf community users?" },
  { language: "Estonian", languageSlug: "estonian", countries: "Estonia", speakerCount: "1 million", dialectNote: "Supports Standard Estonian", languageFAQ: "Does Captio AI work for Estonian hard of hearing users?" },
  { language: "Welsh", languageSlug: "welsh", countries: "Wales, United Kingdom", speakerCount: "700,000", dialectNote: "Supports Standard Welsh", languageFAQ: "Does Captio AI work for Welsh-speaking deaf users in Wales?" },
  { language: "Basque", languageSlug: "basque", countries: "Spain (Basque Country), France", speakerCount: "750,000", dialectNote: "Supports Standard Basque (Batua)", languageFAQ: "Does Captio AI work for Basque-speaking hard of hearing users?" },
];

export function getLanguageBySlug(slug: string): Language | undefined {
  return languages.find((l) => l.languageSlug === slug);
}
