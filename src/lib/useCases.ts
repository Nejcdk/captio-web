export type UseCase = {
  slug: string;
  label: string;
  icon: string;
  tagline: string;
  description: string;
  howItHelps: string[];
  faqs: { q: string; a: string }[];
  reviews: { name: string; flag: string; email: string; detail: string; quote: string }[];
};

export const useCases: UseCase[] = [
  {
    slug: "meetings",
    label: "Meetings",
    icon: "💼",
    tagline: "Follow every word. Never miss a decision.",
    description: "In meetings, decisions happen fast and people talk over each other. For deaf and hard of hearing people, a missed word can mean a missed action item, a wrong answer to a direct question, or falling behind without a way to catch up. Captio AI captions every speaker in real time — so you follow the meeting as it happens.",
    howItHelps: [
      "Captions appear word by word while the person is still speaking — not after",
      "Works in conference rooms, open-plan offices, and video calls",
      "Handles multiple speakers and fast-paced discussion",
      "60+ languages — works in multilingual and international teams",
    ],
    faqs: [
      { q: "Does Captio AI work in video call meetings (Zoom, Teams, Google Meet)?", a: "Yes. Captio AI works by listening through your phone's microphone. Put the call on speaker and point the phone toward the audio. Captions appear in real time, regardless of the conferencing platform." },
      { q: "What if multiple people speak at once in a meeting?", a: "Captio AI follows the dominant voice at any moment — whoever is speaking loudest in the microphone's direction. In a normal meeting room, this tracks whoever is speaking. Genuine simultaneous crosstalk follows the loudest voice." },
      { q: "Does Captio AI work for stand-ups and small team meetings?", a: "Yes. Stand-ups, 1:1s, retrospectives, and larger all-hands meetings are all handled the same way — point the microphone toward the speakers and read along in real time." },
      { q: "Can I use Captio AI in meetings without telling anyone?", a: "Yes. The app runs quietly on your phone. You can place it on the table or hold it without drawing attention. Audio is processed in real time and discarded immediately — nothing is recorded or stored." },
    ],
    reviews: [
      { name: "Sarah K.", flag: "🇬🇧", email: "sarah.k***@gmail.com", detail: "Hard of hearing, London", quote: "I put Captio AI on the table at the start of every meeting. I haven't missed a decision in months." },
      { name: "Florian B.", flag: "🇩🇪", email: "florian.b***@gmail.com", detail: "Deaf, Berlin", quote: "My team in Berlin speaks fast German. Captio AI keeps up with every speaker. It changed how I participate." },
      { name: "Yuki T.", flag: "🇯🇵", email: "yuki.t***@gmail.com", detail: "Hard of hearing, Tokyo", quote: "Japanese meetings move at a pace that was exhausting to follow. Captio AI gives me everything, word by word." },
      { name: "Lena F.", flag: "🇸🇪", email: "lena.f***@gmail.com", detail: "Hard of hearing, Stockholm", quote: "Our meetings are in English and Swedish. Captio AI handles both in the same session without any setup." },
    ],
  },
  {
    slug: "doctor-appointments",
    label: "Doctor Appointments",
    icon: "🏥",
    tagline: "Understand your diagnosis. Ask the right questions.",
    description: "Doctors speak quickly, use clinical language, and rarely repeat themselves. For deaf and hard of hearing people, a missed word in a medical consultation can mean misunderstanding a diagnosis, a medication instruction, or a follow-up step. Captio AI shows you everything the doctor says in real time — so nothing important is missed.",
    howItHelps: [
      "Place your phone on the desk — captions appear as the doctor speaks",
      "Medical terminology is handled accurately",
      "Works in any language — for visiting foreign doctors or specialists",
      "Audio is processed in real time and discarded — 100% private",
    ],
    faqs: [
      { q: "Is it appropriate to use Captio AI at a doctor's appointment?", a: "Yes. Using a captioning app is a reasonable accessibility accommodation. Most doctors are supportive once they understand. You can place the phone on the desk — no explanation is needed, though most people find it helpful to briefly mention it." },
      { q: "Does Captio AI handle medical terminology?", a: "Yes. Captio AI handles medical vocabulary including drug names, procedure names, and clinical terms. Accuracy depends on audio clarity — in a typical quiet consultation room, accuracy is very high." },
      { q: "Does the doctor need to do anything differently?", a: "No. Captio AI works without any special setup on the doctor's side. They speak normally while you read the captions. If audio clarity is an issue, you can ask them to face the microphone — but it is usually not necessary." },
      { q: "What if the appointment is in a language I'm not fluent in?", a: "Use Live Translator instead of Live Captions. Live Translator captions the doctor's speech and translates it into your language in real time — so you follow your diagnosis in the language you understand best." },
    ],
    reviews: [
      { name: "Miriam L.", flag: "🇺🇸", email: "miriam.l***@gmail.com", detail: "Hard of hearing since birth, New York", quote: "I used to bring a family member to every appointment just to catch what the doctor said. Now I go alone with Captio AI." },
      { name: "Takeshi N.", flag: "🇯🇵", email: "takeshi.n***@gmail.com", detail: "Progressive hearing loss, Osaka", quote: "Japanese doctors speak fast and do not repeat. Captio AI gives me a full transcript of every consultation." },
      { name: "Amara D.", flag: "🇸🇪", email: "amara.d***@gmail.com", detail: "Hard of hearing, Stockholm", quote: "I moved from Senegal and my Swedish is not perfect. Captio AI captions the doctor in Swedish and I can read along." },
      { name: "Reza K.", flag: "🇮🇷", email: "reza.k***@gmail.com", detail: "Hard of hearing, Tehran", quote: "Doctor appointments in Iran move fast. Captio AI shows me everything in real time. I never have to ask for a repeat." },
    ],
  },
  {
    slug: "lectures",
    label: "Lectures",
    icon: "🎓",
    tagline: "Follow every lecture. Don't miss the point.",
    description: "Lecturers speak quickly, cover complex material, and rarely repeat themselves. For deaf and hard of hearing students, following a lecture while simultaneously lip-reading, taking notes, and processing content is an impossible cognitive load. Captio AI gives you a live transcript of everything said — so you can focus on understanding, not straining to hear.",
    howItHelps: [
      "Captions appear in real time — follow the lecture as it happens",
      "Read without splitting attention between lip-reading and note-taking",
      "Works in lecture halls, seminars, tutorials, and online classes",
      "60+ languages — for international students and foreign-language courses",
    ],
    faqs: [
      { q: "Does Captio AI work in large lecture halls?", a: "Yes. In a large lecture hall, place your phone on the desk in front of you. Audio from PA systems in large halls typically gives a clear signal for accurate captions. Point the microphone toward the nearest speaker output for best results." },
      { q: "Can I use Captio AI instead of a note-taker?", a: "Captio AI provides a live caption stream while you are in the room. For review after the fact, use Audio Transcription: record the lecture, then upload it to get a full written transcript you can read, search, and study from." },
      { q: "Does Captio AI work for online lectures?", a: "Yes. Put the lecture audio on speaker and point your phone toward it, or hold the phone near the audio output of your laptop. Captio AI captions whatever is playing in real time." },
      { q: "Is using Captio AI in an exam allowed?", a: "Captio AI is an accessibility tool. Whether it is permitted in assessed settings depends on your institution's accessibility policy. For formal accommodations, contact your university's disability services office." },
    ],
    reviews: [
      { name: "Priya S.", flag: "🇮🇳", email: "priya.s***@gmail.com", detail: "Hard of hearing student, Delhi", quote: "I was struggling to follow lectures and keep notes at the same time. Captio AI handles the following — I just focus on understanding." },
      { name: "Lucas M.", flag: "🇧🇷", email: "lucas.m***@gmail.com", detail: "Deaf, São Paulo", quote: "I am studying in Brazil and my Portuguese is not perfect. Captio AI captions every professor accurately." },
      { name: "Emma J.", flag: "🇬🇧", email: "emma.j***@gmail.com", detail: "Hard of hearing, Manchester", quote: "My university has official captioning for some lectures. Captio AI covers everything else." },
      { name: "Giulia R.", flag: "🇮🇹", email: "giulia.r***@gmail.com", detail: "Hard of hearing student, Milan", quote: "Italian university lectures go fast. Captio AI gives me everything the professor says as they say it." },
    ],
  },
  {
    slug: "everyday-conversations",
    label: "Everyday Conversations",
    icon: "💬",
    tagline: "Follow any conversation. In any situation.",
    description: "Most conversations happen fast, at normal pace, without warning — in the street, at the shops, at a family dinner. For deaf and hard of hearing people, everyday speech is the hardest to accommodate because there is no formal support and no system to request. Captio AI gives you real-time captions for any spoken conversation, anywhere.",
    howItHelps: [
      "Captions appear instantly as people speak — no setup required",
      "Works indoors, outdoors, in noisy and quiet environments",
      "Handles all accents, speaking speeds, and regional varieties",
      "60+ languages — for conversations anywhere in the world",
    ],
    faqs: [
      { q: "Does Captio AI work in noisy environments?", a: "Yes. Captio AI is built for real-world noise, not just quiet rooms. It handles moderate background noise well — restaurants, streets, busy offices. Very loud environments (concerts, heavy machinery) may reduce accuracy." },
      { q: "Can I use Captio AI for conversations with strangers?", a: "Yes. Place your phone between yourself and the other person. They speak normally; you read the captions. Most people quickly understand and adapt naturally." },
      { q: "Does it work for fast speakers?", a: "Yes. Captio AI handles natural conversational speed, including fast speakers. It is designed for real-world speech, not slow dictation." },
      { q: "What if someone switches language mid-conversation?", a: "Switch to Live Translator mode. Live Translator detects the spoken language and translates into your chosen language in real time — so language switches are handled automatically." },
    ],
    reviews: [
      { name: "James R.", flag: "🇦🇺", email: "james.r***@gmail.com", detail: "Progressive hearing loss, Sydney", quote: "My hearing started going last year. Captio AI means I can still have normal conversations without making it awkward." },
      { name: "Fatima A.", flag: "🇸🇦", email: "fatima.a***@gmail.com", detail: "Hard of hearing, Riyadh", quote: "Arabic conversations move fast. Captio AI keeps up. I use it for everything now." },
      { name: "Nina P.", flag: "🇸🇮", email: "nina.p***@gmail.com", detail: "Hard of hearing since childhood, Ljubljana", quote: "I always had to ask people to repeat themselves. Now I just read. It is so much less exhausting." },
      { name: "Daniel O.", flag: "🇳🇬", email: "daniel.o***@gmail.com", detail: "Hard of hearing, Lagos", quote: "Captio AI handles fast conversational English and local accents accurately. I use it every day." },
    ],
  },
  {
    slug: "job-interviews",
    label: "Job Interviews",
    icon: "🤝",
    tagline: "Hear every question. Give your best answer.",
    description: "Missing a question in an interview means answering wrong or asking for a repeat — either outcome affects how you come across. For deaf and hard of hearing people, the interview room is one of the highest-stakes environments where mishearing has direct consequences. Captio AI shows you every word the interviewer says so you can focus entirely on your answer.",
    howItHelps: [
      "Read the full question before you answer — nothing missed, nothing guessed",
      "Works in person, on video calls, and over the phone",
      "Discreet — runs quietly on your phone without drawing attention",
      "Audio is never recorded or stored — 100% private",
    ],
    faqs: [
      { q: "Should I tell the interviewer I am using Captio AI?", a: "That is your choice. Many people disclose their hearing situation and mention Captio AI as an accommodation — most interviewers are supportive. Others use it discreetly without disclosure. Both are valid." },
      { q: "Does Captio AI work for video interviews on Zoom or Teams?", a: "Yes. Put the call on speaker and point your phone's microphone toward the audio. Captions appear in real time as the interviewer speaks, regardless of the platform." },
      { q: "What if I miss a question mid-interview?", a: "Captio AI gives you the full caption of what was said, word by word, in real time. You can glance at it at any moment to confirm what you heard — without asking for a repeat." },
      { q: "Is using Captio AI in an interview allowed?", a: "Captio AI is an accessibility tool, equivalent to any other hearing accommodation. Interviewers are legally required in most jurisdictions to make reasonable accommodations for deaf and hard of hearing candidates." },
    ],
    reviews: [
      { name: "David C.", flag: "🇬🇧", email: "david.c***@gmail.com", detail: "Hard of hearing, Birmingham", quote: "I used to dread phone interviews. With Captio AI I can read every word in real time. I got the job." },
      { name: "Hana K.", flag: "🇨🇿", email: "hana.k***@gmail.com", detail: "Hard of hearing, Prague", quote: "I told the interviewer I would be using a captioning app. She was completely fine. The interview went perfectly." },
      { name: "Marco B.", flag: "🇮🇹", email: "marco.b***@gmail.com", detail: "Progressive hearing loss, Milan", quote: "Fast Italian in a formal setting is hard to follow. Captio AI gave me every question clearly." },
      { name: "Aoi S.", flag: "🇯🇵", email: "aoi.s***@gmail.com", detail: "Hard of hearing, Tokyo", quote: "Japanese interviews are structured but fast. Captio AI made sure I heard every question the panel asked." },
    ],
  },
  {
    slug: "phone-video-calls",
    label: "Phone & Video Calls",
    icon: "📱",
    tagline: "Follow every call. No more asking people to repeat.",
    description: "Phone and video calls are harder to follow than in-person conversations — no lip reading, often compressed audio, and no visual cues. For deaf and hard of hearing people, calls require more effort and more requests to repeat. Captio AI captions whoever is speaking in real time, so you can follow without interrupting.",
    howItHelps: [
      "Put the call on speaker and point your phone's microphone toward the audio",
      "Works with any phone, video call app, or device",
      "Handles compressed call audio and background noise",
      "60+ languages — for international and multilingual calls",
    ],
    faqs: [
      { q: "How do I use Captio AI during a phone call?", a: "Put your call on speaker, then open Captio AI and point the microphone toward the speaker. The app captions the other person's speech in real time. You speak normally; they speak normally; you read the captions." },
      { q: "Does Captio AI work with Zoom, Teams, FaceTime, or WhatsApp calls?", a: "Yes. Captio AI works by listening through the microphone — it does not need to integrate with any app. Put the call on speaker or hold the phone near the audio output and read the captions." },
      { q: "Does audio quality affect accuracy on calls?", a: "Compressed call audio is less clean than in-person speech, which can reduce accuracy slightly. In typical phone and video call conditions, accuracy remains high. Very poor connections or heavy compression may reduce accuracy." },
      { q: "Can I use Captio AI for conference calls with multiple participants?", a: "Yes. Captio AI captions whoever is speaking at any moment. In a multi-participant call, it follows the active speaker. Simultaneous crosstalk follows the loudest voice." },
    ],
    reviews: [
      { name: "Ruth T.", flag: "🇺🇸", email: "ruth.t***@gmail.com", detail: "Hard of hearing, Chicago", quote: "I avoided phone calls for years. Captio AI changed that completely. I can call anyone now." },
      { name: "Anders L.", flag: "🇸🇪", email: "anders.l***@gmail.com", detail: "Deaf, Gothenburg", quote: "Video calls with my family used to be exhausting. Captio AI gives me everything they say in real time." },
      { name: "Sofia R.", flag: "🇵🇹", email: "sofia.r***@gmail.com", detail: "Hard of hearing, Lisbon", quote: "Portuguese phone calls are fast. Captio AI keeps up with every word." },
      { name: "Nour M.", flag: "🇱🇧", email: "nour.m***@gmail.com", detail: "Hard of hearing, Beirut", quote: "Calls in Arabic were the hardest for me. Captio AI made them manageable for the first time." },
    ],
  },
  {
    slug: "group-settings",
    label: "Group Settings",
    icon: "👥",
    tagline: "Keep up with the group. Never lose the thread.",
    description: "In group conversations, multiple people talk at once and the thread moves fast. Following who said what, when, and why is demanding even for people with full hearing. For deaf and hard of hearing people, group settings are among the most tiring everyday environments. Captio AI captions whoever is speaking so you can follow without losing the thread.",
    howItHelps: [
      "Real-time captions of whoever is speaking at any moment",
      "Works for small groups and larger gatherings",
      "Place your phone in the centre of the group for best coverage",
      "60+ languages — for multilingual groups and gatherings",
    ],
    faqs: [
      { q: "Does Captio AI work when multiple people speak at once?", a: "Captio AI follows the dominant voice at any moment — whoever is loudest in the microphone's direction. In genuine simultaneous speech, it follows the loudest voice. This mirrors what happens with human hearing in the same situation." },
      { q: "Where should I place my phone in a group setting?", a: "Place the phone in the centre of the group with the microphone facing the most active part of the conversation. A small stand or holder keeps it stable without drawing attention." },
      { q: "Does Captio AI work at family dinners, parties, and social events?", a: "Yes. These are exactly the situations Captio AI is designed for — informal group settings where no formal support is available. The app works in any environment where speech occurs." },
      { q: "What if the group is loud?", a: "Moderate background noise is handled well. Very loud environments — nightclub-level noise — reduce accuracy. In a typical noisy social setting like a party or dinner, accuracy remains high for nearby speakers." },
    ],
    reviews: [
      { name: "Chloe B.", flag: "🇫🇷", email: "chloe.b***@gmail.com", detail: "Hard of hearing, Paris", quote: "French dinner conversations move fast and loud. I put Captio AI in the middle of the table and follow everything." },
      { name: "Ivan S.", flag: "🇷🇺", email: "ivan.s***@gmail.com", detail: "Progressive hearing loss, Moscow", quote: "Russian family gatherings are chaotic. Captio AI helps me follow who is saying what." },
      { name: "Ingrid H.", flag: "🇳🇴", email: "ingrid.h***@gmail.com", detail: "Hard of hearing, Oslo", quote: "Group settings used to be where I zoned out. Now I actually participate." },
      { name: "Youssef A.", flag: "🇲🇦", email: "youssef.a***@gmail.com", detail: "Hard of hearing, Casablanca", quote: "Family gatherings in Moroccan Arabic — Captio AI keeps up with everyone. I stopped dreading them." },
    ],
  },
  {
    slug: "restaurants",
    label: "Restaurants & Cafes",
    icon: "🍽️",
    tagline: "Have a real conversation through the noise.",
    description: "Background noise in restaurants and cafes makes speech harder to follow even for people with full hearing. For deaf and hard of hearing people, the combination of ambient noise, distance from the speaker, and no lip-reading cues makes restaurants one of the most difficult everyday environments. Captio AI focuses on whoever is speaking to you and captions them in real time.",
    howItHelps: [
      "Focuses on nearby speech even through ambient restaurant noise",
      "Place your phone on the table between you and the other person",
      "Works across the table without needing to face the speaker directly",
      "60+ languages — for restaurants anywhere in the world",
    ],
    faqs: [
      { q: "Does Captio AI work in noisy restaurants?", a: "Yes. Captio AI handles moderate restaurant-level background noise well. It focuses on the nearest speaker — the person across the table — and filters ambient noise. Very loud environments may reduce accuracy." },
      { q: "How do I set up Captio AI at a restaurant table?", a: "Place your phone on the table between you and the person you are talking to, with the microphone facing them. Captions appear on your screen. You can glance at it naturally without making the situation awkward." },
      { q: "Does Captio AI work when talking to waitstaff?", a: "Yes. Ordering, asking about the menu, and following specials are all captioned in real time. Hold or place the phone near whoever is speaking." },
      { q: "What if the restaurant is abroad and people speak another language?", a: "Use Live Translator. The waiter or companion speaks their language — you read the translation in real time. Works in any of the 60+ supported languages." },
    ],
    reviews: [
      { name: "Elena V.", flag: "🇮🇹", email: "elena.v***@gmail.com", detail: "Hard of hearing, Rome", quote: "Italian restaurants are loud. I put Captio AI between me and my friend and have a proper conversation for the first time in years." },
      { name: "Thomas K.", flag: "🇩🇪", email: "thomas.k***@gmail.com", detail: "Deaf, Hamburg", quote: "Going out used to mean nodding along. Now I actually follow what is being said." },
      { name: "Mei L.", flag: "🇨🇳", email: "mei.l***@gmail.com", detail: "Hard of hearing, Shanghai", quote: "Background noise used to cut me off from conversations completely. Captio AI changed that." },
      { name: "Pablo G.", flag: "🇲🇽", email: "pablo.g***@gmail.com", detail: "Hard of hearing, Mexico City", quote: "Mexican Spanish at a loud table — Captio AI handles it. I finally enjoy going out again." },
    ],
  },
  {
    slug: "traveling",
    label: "Traveling",
    icon: "✈️",
    tagline: "Navigate confidently. In any language, in any country.",
    description: "Airports, train stations, hotels, and unfamiliar cities are environments where mishearing a gate number, a customs instruction, or a street direction has real consequences. For deaf and hard of hearing travelers, these are the highest-stakes everyday situations. Captio AI captions speech in 60+ languages so you can navigate anywhere.",
    howItHelps: [
      "Real-time captions of announcements, directions, and conversations",
      "Live Translator covers 60+ languages — no language barrier",
      "Works in airports, stations, hotels, taxis, and tourist sites",
      "Works anywhere with a mobile data or Wi-Fi connection",
    ],
    faqs: [
      { q: "Does Captio AI work in foreign countries where people speak a different language?", a: "Yes. Use Live Translator to caption and translate speech in real time. A customs officer, hotel receptionist, or local you ask for directions — they speak their language, you read in yours." },
      { q: "Does Captio AI work for airport announcements?", a: "Yes. Hold your phone near the announcement speaker or point it toward the PA system. Captions appear in real time. In noisy airport environments, accuracy depends on how clearly the PA system projects." },
      { q: "Does Captio AI need Wi-Fi or can it use mobile data?", a: "Captio AI works on any active internet connection — Wi-Fi or mobile data. A local SIM or roaming data plan keeps it working in any country." },
      { q: "What if I need to communicate with someone who speaks no English?", a: "Use Live Translator: they speak their language, you read the translation in real time. You can also type your response and show them the screen if spoken communication is not possible." },
    ],
    reviews: [
      { name: "Kenji M.", flag: "🇯🇵", email: "kenji.m***@gmail.com", detail: "Hard of hearing, traveling in Europe", quote: "I travel solo with hearing loss. Live Translator lets me navigate Europe without any language barrier." },
      { name: "Sophie D.", flag: "🇫🇷", email: "sophie.d***@gmail.com", detail: "Deaf, traveling in Japan", quote: "In Japan I used Captio AI to follow every announcement and conversation. It made the trip possible." },
      { name: "Carlos M.", flag: "🇧🇷", email: "carlos.m***@gmail.com", detail: "Hard of hearing, São Paulo", quote: "At international airports I used to panic about missing gate calls. Captio AI covers me everywhere." },
      { name: "Fatou S.", flag: "🇸🇳", email: "fatou.s***@gmail.com", detail: "Hard of hearing, Dakar", quote: "I traveled through Europe without speaking the local languages. Captio AI was my translator for the whole trip." },
    ],
  },
  {
    slug: "conferences",
    label: "Conferences & Events",
    icon: "🎤",
    tagline: "Follow every speaker. From any seat.",
    description: "At conferences, speakers are far away, acoustics are often poor, and you cannot ask for a repeat in front of a crowd. For deaf and hard of hearing attendees, conferences are among the most inaccessible public environments — even venues with hearing loops cover only part of the space. Captio AI gives you a live transcript of every speaker from any seat.",
    howItHelps: [
      "Live captions of every speaker — no loop system or captioning service required",
      "Works in conference halls, seminar rooms, and outdoor events",
      "Point toward the nearest speaker or PA output for best accuracy",
      "60+ languages — for international and multilingual conferences",
    ],
    faqs: [
      { q: "Does Captio AI work in large conference halls?", a: "Yes. In a venue with a PA system, point your phone's microphone toward a speaker. The PA audio gives a clear signal. In smaller rooms without PA, the phone on your desk captions the speaker at the front." },
      { q: "Does Captio AI replace hearing loop systems?", a: "Captio AI is an independent solution that does not depend on venue infrastructure. If a venue has a loop, that may give cleaner audio. If it does not, Captio AI works independently via microphone." },
      { q: "Can I use Captio AI at panel discussions with multiple speakers?", a: "Yes. Captio AI follows whoever is speaking — the dominant voice at any moment. In a panel, it follows whichever panellist is speaking and handles natural speaker transitions." },
      { q: "Does Captio AI work at networking events and smaller talks?", a: "Yes. For smaller sessions and networking conversations, Captio AI works exactly as it does in any group setting — place or hold it near whoever you want to follow." },
    ],
    reviews: [
      { name: "Rachel F.", flag: "🇬🇧", email: "rachel.f***@gmail.com", detail: "Hard of hearing, London", quote: "I go to industry conferences regularly. Captio AI gives me better captions than most official captioning I have seen." },
      { name: "Henrik J.", flag: "🇩🇰", email: "henrik.j***@gmail.com", detail: "Deaf, Copenhagen", quote: "International conferences in English are now fully accessible to me. Captio AI captions every speaker." },
      { name: "Aisha B.", flag: "🇿🇦", email: "aisha.b***@gmail.com", detail: "Hard of hearing, Cape Town", quote: "South African conferences sometimes have SASL interpreters. When they do not, Captio AI covers me." },
      { name: "Vera N.", flag: "🇷🇴", email: "vera.n***@gmail.com", detail: "Hard of hearing, Bucharest", quote: "I attended a multilingual conference last year. Live Translator let me follow speakers in three languages." },
    ],
  },
  {
    slug: "tv-media",
    label: "TV & Media",
    icon: "📺",
    tagline: "Watch anything. Without depending on subtitles.",
    description: "Built-in subtitles are often wrong, delayed, or missing entirely — especially for live TV, streaming content in foreign languages, or user-generated content. For deaf and hard of hearing people, the quality of subtitle provision varies enormously across platforms and content types. Captio AI captions whatever is playing in real time, on any screen, for any content.",
    howItHelps: [
      "Point your phone toward the TV, laptop, or device speaker",
      "Real-time captions for any content — live TV, streaming, YouTube",
      "No subtitle file needed — captions directly from the audio",
      "60+ languages — for content in any language",
    ],
    faqs: [
      { q: "How do I use Captio AI with my TV?", a: "Point your phone's microphone toward the TV's speakers. Captio AI captions whatever is playing in real time. Turning up the TV volume slightly gives the cleanest audio for accurate captions." },
      { q: "Does Captio AI work for live TV — news, sport, live events?", a: "Yes. Live TV is handled the same as any live audio. Captio AI captions in real time — unlike pre-generated subtitles, which lag behind live content." },
      { q: "Does Captio AI work for foreign-language content?", a: "Yes. Use Live Translator to caption and translate foreign-language content in real time. A French film, a Spanish news broadcast, or a Japanese anime — Captio AI translates into your language as it plays." },
      { q: "Can I use Captio AI in a cinema?", a: "Yes. Hold your phone discreetly near the audio output. In a cinema with good sound, Captio AI produces accurate captions. Be considerate to others — dim the screen and hold it low." },
    ],
    reviews: [
      { name: "Jonathan W.", flag: "🇺🇸", email: "jonathan.w***@gmail.com", detail: "Hard of hearing since childhood, Boston", quote: "Netflix subtitles are often wrong or delayed. Captio AI gives me captions that actually match what is being said." },
      { name: "Emilie C.", flag: "🇫🇷", email: "emilie.c***@gmail.com", detail: "Hard of hearing, Lyon", quote: "French live news with Captio AI. Never missed a word since I started using it." },
      { name: "Björn A.", flag: "🇸🇪", email: "bjorn.a***@gmail.com", detail: "Deaf, Stockholm", quote: "I use Captio AI for any content that does not have good subtitles. That is most of the internet." },
      { name: "Hyun J.", flag: "🇰🇷", email: "hyun.j***@gmail.com", detail: "Hard of hearing, Seoul", quote: "Korean streaming has decent subtitles. For everything else — news, YouTube, foreign shows — Captio AI fills the gap." },
    ],
  },
  {
    slug: "deaf-hoh-communication",
    label: "Communicating with Deaf & HoH",
    icon: "🤟",
    tagline: "Make every conversation work — for both sides.",
    description: "Hearing people often don't know how to adapt when talking with deaf or hard of hearing people — whether to slow down, write things down, or face them directly. Captio AI removes that adjustment burden: the hearing person speaks naturally while the deaf or hard of hearing person reads the captions. The conversation happens on equal terms.",
    howItHelps: [
      "The hearing person speaks naturally — no special adaptation needed",
      "The deaf or hard of hearing person reads in real time",
      "Works in any setting — indoors, outdoors, noisy or quiet",
      "Bridges the gap without requiring sign language from either side",
    ],
    faqs: [
      { q: "Does the hearing person need to do anything special?", a: "No. The hearing person speaks naturally at their normal pace. They do not need to write, slow down, or adjust. Captio AI handles the captioning automatically." },
      { q: "Is Captio AI a replacement for sign language?", a: "No. Captio AI captions spoken speech in real time — it does not teach or translate sign language. For deaf people who communicate primarily in sign language, Captio AI helps in situations where the other person does not sign." },
      { q: "Does Captio AI work when a deaf person is the one speaking aloud?", a: "Captio AI captions whoever is speaking aloud. It is designed for situations where a hearing person is speaking and a deaf or hard of hearing person needs to read what is said." },
      { q: "Can both people in the conversation use Captio AI?", a: "Yes. If both people are deaf or hard of hearing, each can use Captio AI on their own device to caption the other person's speech simultaneously." },
    ],
    reviews: [
      { name: "Tom A.", flag: "🇬🇧", email: "tom.a***@gmail.com", detail: "Hearing, partner is deaf, Manchester", quote: "My partner is deaf. Captio AI means I can just talk normally and she reads everything. No more typing on phones." },
      { name: "Lena B.", flag: "🇩🇪", email: "lena.b***@gmail.com", detail: "Deaf, Berlin", quote: "Most hearing people do not know how to communicate with me. Captio AI removes the awkwardness completely." },
      { name: "Maria C.", flag: "🇪🇸", email: "maria.c***@gmail.com", detail: "Hard of hearing, Madrid", quote: "I show Captio AI to people I meet and explain they just speak normally. It works every time." },
      { name: "Jin W.", flag: "🇨🇳", email: "jin.w***@gmail.com", detail: "Hard of hearing, Beijing", quote: "My hearing friends used to struggle around me. Captio AI made communication natural again." },
    ],
  },
];

export function getUseCaseBySlug(slug: string): UseCase | undefined {
  return useCases.find((uc) => uc.slug === slug);
}
