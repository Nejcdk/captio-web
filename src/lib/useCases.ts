export type SubUseCase = {
  icon: string;
  title: string;
  description: string;
};

export type Benefit = {
  title: string;
  description: string;
};

export type FeatureHighlight = {
  slug: "live-captions" | "live-translator" | "audio-transcription" | "ai-summary";
  title: string;
  bullets: string[];
};

export type UseCase = {
  slug: string;
  label: string;
  icon: string;
  tagline: string;
  heroSubtitle?: string;
  description: string;
  howItHelps: string[];
  headingLabel?: string;
  mobileImage?: "lifestyle" | "work";
  challenge?: {
    headline: string;
    paragraphs: string[];
  };
  subUseCases?: SubUseCase[];
  benefitsHeadline?: string;
  benefitsSubtitle?: string;
  benefits?: Benefit[];
  featureHighlights?: FeatureHighlight[];
  faqs: { q: string; a: string }[];
  reviews: { name: string; flag: string; email: string; detail: string; quote: string; languageSlug?: string }[];
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
    featureHighlights: [
      {
        slug: "live-captions",
        title: "Follow the meeting as it happens",
        bullets: [
          "Captions appear word by word while speakers are still talking",
          "Works in conference rooms, boardrooms, and open offices",
          "Handles fast-paced discussion and multiple speakers",
          "No setup — place the phone on the table and start",
        ],
      },
      {
        slug: "live-translator",
        title: "International and multilingual meetings",
        bullets: [
          "Each person speaks their own language",
          "You read in yours, in real time",
          "60+ languages, no mode switching",
          "Handles mid-sentence language changes",
        ],
      },
      {
        slug: "audio-transcription",
        title: "Full transcript after the meeting",
        bullets: [
          "Upload the recording and get a complete written transcript",
          "Organised by speaker — know exactly who said what",
          "Review decisions and action items at your own pace",
          "Searchable, copyable, shareable",
        ],
      },
      {
        slug: "ai-summary",
        title: "Decisions and action items, extracted",
        bullets: [
          "Key points and decisions pulled from any transcript",
          "Action items surfaced automatically",
          "Organised into sections — not one continuous block",
          "Works on any Captio AI meeting transcript",
        ],
      },
    ],
    subUseCases: [
      {
        icon: "🔄",
        title: "Stand-ups and team syncs",
        description: "Fast-moving, short meetings where everyone speaks in quick succession. Captio AI captions each person as they speak so you follow every update without asking for repeats.",
      },
      {
        icon: "📹",
        title: "Video calls",
        description: "Zoom, Teams, Google Meet, FaceTime. Put the call on speaker, point Captio AI toward the audio, and read captions in real time — regardless of which platform the meeting is on.",
      },
      {
        icon: "🎯",
        title: "One-on-ones and reviews",
        description: "Performance reviews, 1:1 check-ins, feedback sessions. High-stakes conversations where every word matters. Captio AI gives you a complete caption of everything said so nothing gets misunderstood.",
      },
      {
        icon: "🎤",
        title: "All-hands and town halls",
        description: "Large company meetings where speakers are far away and you cannot ask for a repeat. Point the phone toward the nearest speaker output and read every word from any seat.",
      },
      {
        icon: "🌍",
        title: "International and multilingual meetings",
        description: "Teams that switch between languages or where not everyone speaks the same first language. Live Translator captions and translates in real time — follow the meeting in the language you read best.",
      },
      {
        icon: "☕",
        title: "Informal catch-ups",
        description: "Kitchen chats, corridor meetings, quick questions at someone's desk. The unofficial conversations where decisions also happen. Captio AI covers those too.",
      },
    ],
    benefitsHeadline: "Built for the speed of a real meeting",
    benefits: [
      {
        title: "Captions while they are still speaking",
        description: "Words appear on screen as each person talks — not after they finish. You read what someone is saying at the same moment everyone else hears it.",
      },
      {
        title: "Works in any meeting format",
        description: "Conference rooms, open-plan offices, video calls, all-hands. Place the phone on the table or hold it — Captio AI handles the rest.",
      },
      {
        title: "Handles fast speech and crosstalk",
        description: "Captio AI is designed for real meetings, not controlled dictation. It follows whoever is speaking loudest at any moment, keeping up with the natural pace of discussion.",
      },
      {
        title: "No setup, no explaining",
        description: "Open the app and place the phone. No pairing, no telling colleagues what you are doing, no requesting anything from the meeting organiser.",
      },
      {
        title: "Review everything after",
        description: "Record the meeting and upload it to Audio Transcription for a full written record. Use AI Summary to extract decisions and action items so nothing from the meeting gets lost.",
      },
      {
        title: "60+ languages",
        description: "For international teams, multilingual meetings, or colleagues who switch between languages mid-discussion. No setup required — Captio AI detects and captions in real time.",
      },
    ],
    challenge: {
      headline: "Meetings are where deaf and HoH people fall furthest behind",
      paragraphs: [
        "Only 53% of deaf people are employed compared to 76% of hearing people — a gap of more than 20 percentage points (National Deaf Center, 2017). Researchers consistently point to communication in the workplace as the primary driver. Of all the workplace barriers studied, meetings are where the access gap is most acute: fast speech, multiple speakers, no protocol for asking someone to repeat, and decisions that land before you have caught up.",
        "A study of deaf and hard of hearing workers found that 70% attributed communication difficulties — particularly in meetings — as contributing to poor employment outcomes (American Annals of the Deaf, 2016). Employers are often aware the problem exists: 62% of concerns raised by employers about workers with hearing loss were specifically communication-related (HLAA). The awareness does not translate into solutions. Less than half of workplaces provide reasonable accommodations.",
        "In a meeting room, the informal rules work against you. People talk over each other. They turn away from you to address someone else. They reference something said two minutes ago that you missed. The chair moves on before you have finished processing what was said. Everyone else absorbs this in real time. For a deaf or hard of hearing person, it requires constant reconstruction — and occasional bluffing.",
        "Captio AI is built to close that gap in the room where it matters most. Captions appear word by word as each person speaks, so you follow the meeting as it happens — not catching up after. Every speaker, every decision, every action item. In real time.",
      ],
    },
    faqs: [
      { q: "Does Captio AI work in video call meetings on Zoom, Teams, or Google Meet?", a: "Yes. Captio AI works by listening through your phone's microphone. Put the call on speaker and point the phone toward the audio. Captions appear in real time regardless of which conferencing platform is being used." },
      { q: "How do I position the phone in a conference room?", a: "Place it flat on the table in front of you, microphone facing the centre of the room or toward the most active speaker. A small phone stand keeps it stable without drawing attention. For video calls, point it toward your laptop's speaker output." },
      { q: "What if multiple people speak at once?", a: "Captio AI follows the dominant voice at any moment — whoever is speaking loudest in the microphone's direction. In a normal meeting room this tracks the active speaker. Genuine simultaneous crosstalk follows the loudest voice, which mirrors how hearing works in the same situation." },
      { q: "Does it work for stand-ups and small team meetings?", a: "Yes. Stand-ups, 1:1s, retrospectives, and larger all-hands are all handled the same way — place the phone on the table, point it toward whoever is speaking, and read along in real time." },
      { q: "Can I use Captio AI in meetings without telling anyone?", a: "Yes. The app runs quietly on your phone. You can place it on the table or hold it without drawing attention. Audio is processed in real time and discarded immediately — nothing is recorded or stored." },
      { q: "Can I get a written transcript of the meeting afterwards?", a: "Yes. Record the meeting audio on your phone and upload it to Audio Transcription. You get a full written transcript organised by speaker — useful for reviewing decisions, confirming action items, or sharing notes with your team." },
      { q: "Does it work for all-hands meetings and large presentations?", a: "Yes. In a venue with a PA system, point the phone's microphone toward a speaker output. The PA audio gives a clean signal. In smaller rooms without PA, the phone on your desk captions the speaker at the front." },
      { q: "What about meetings in another language or with international colleagues?", a: "Use Live Translator. Your colleagues speak their language — you read the translation in real time. Works across 60+ languages with no manual setup between speakers or language switches." },
      { q: "Is using Captio AI a reasonable workplace accommodation?", a: "Yes. Captio AI is an accessibility tool equivalent to any other hearing accommodation. In most jurisdictions, employers are legally required to make reasonable accommodations for deaf and hard of hearing employees. Using a captioning app at work is a recognised accommodation." },
      { q: "What if the meeting room has poor acoustics or echo?", a: "Position the phone as close as possible to the nearest speaker — either the person talking or a PA output. Closer proximity reduces the impact of room acoustics. In very echoey rooms, accuracy may be slightly reduced but captions remain useful." },
    ],
    reviews: [
      { name: "Sarah K.", flag: "🇬🇧", email: "sarah.k***@gmail.com", detail: "Hard of hearing, London", quote: "I put Captio AI on the table at the start of every meeting. I have not missed a decision in months." },
      { name: "Florian B.", flag: "🇩🇪", email: "florian.b***@gmail.com", detail: "Deaf, Berlin", quote: "My team speaks fast German and switches to English mid-sentence. Captio AI keeps up with every speaker. It changed how I participate." },
      { name: "Yuki T.", flag: "🇯🇵", email: "yuki.t***@gmail.com", detail: "Hard of hearing, Tokyo", quote: "Japanese meetings move at a pace that was exhausting to follow. Captio AI gives me everything, word by word, as it happens." },
      { name: "Lena F.", flag: "🇸🇪", email: "lena.f***@gmail.com", detail: "Hard of hearing, Stockholm", quote: "Our team meetings mix English and Swedish. Captio AI handles both in the same session without any setup. I finally contribute in real time." },
    ],
  },
  {
    slug: "doctor-appointments",
    label: "Doctor Appointments",
    icon: "🏥",
    tagline: "Understand your diagnosis. Ask the right questions.",
    description: "Doctors speak quickly, use clinical language, and rarely repeat themselves. For deaf and hard of hearing people, a missed word in a medical consultation can mean misunderstanding a diagnosis, a drug name, or a follow-up instruction. Captio AI shows you everything the doctor says in real time — so nothing important is missed.",
    howItHelps: [
      "Place your phone on the desk — captions appear as the doctor speaks",
      "Medical terminology is handled accurately",
      "Works in any language — for visiting foreign doctors or specialists",
      "Audio is processed in real time and discarded — 100% private",
    ],
    featureHighlights: [
      {
        slug: "live-captions",
        title: "Follow what the doctor says in real time",
        bullets: [
          "Captions appear word by word as they speak",
          "Handles medical terminology, drug names, and clinical language",
          "Place the phone on the desk — no setup needed",
          "Works in any consultation room, clinic, or hospital setting",
        ],
      },
      {
        slug: "live-translator",
        title: "When the doctor speaks another language",
        bullets: [
          "Captions and translates in real time",
          "Follow your diagnosis in the language you understand best",
          "60+ languages, no manual switching",
          "For foreign specialists, travel, or immigration settings",
        ],
      },
      {
        slug: "audio-transcription",
        title: "A full record of the consultation",
        bullets: [
          "Record the appointment and upload it for a complete transcript",
          "Review instructions, drug names, and follow-up steps at home",
          "Share with a family member or carer if needed",
          "Works on any consultation recording",
        ],
      },
      {
        slug: "ai-summary",
        title: "Key instructions extracted automatically",
        bullets: [
          "Diagnosis, medication, and follow-up steps pulled from any transcript",
          "Organised into clear sections",
          "Nothing important missed or forgotten",
          "Works on any saved appointment recording",
        ],
      },
    ],
    subUseCases: [
      {
        icon: "🩺",
        title: "GP and primary care visits",
        description: "Your regular doctor, speaking at their own pace. Captio AI captions everything — symptoms discussed, test results explained, prescriptions issued — so you leave the appointment understanding exactly what was said.",
      },
      {
        icon: "🔬",
        title: "Specialist consultations",
        description: "Specialists use dense clinical vocabulary and cover a lot of ground quickly. Captio AI captions every term, every instruction, and every referral in real time — so you follow your diagnosis without gaps.",
      },
      {
        icon: "💊",
        title: "Pharmacy conversations",
        description: "Pharmacists explain dosage, side effects, and interactions quickly over a counter. Captio AI captions the exchange so you understand every instruction before you leave.",
      },
      {
        icon: "🦷",
        title: "Dental appointments",
        description: "Dentists speak while working, often with their back turned or their hands near your face. Captio AI captures what they say when they step back to explain — so you follow the treatment plan accurately.",
      },
      {
        icon: "🧠",
        title: "Mental health sessions",
        description: "Therapy, psychiatry, and counselling sessions where every word matters and repeating yourself is costly. Captio AI captions the clinician in real time so you can focus on the conversation.",
      },
      {
        icon: "🚑",
        title: "Emergency and urgent care",
        description: "A&E departments, urgent care clinics, paramedics. Fast speech, high stakes, no time to accommodate. Captio AI gives you real-time captions in the moments when understanding is most critical.",
      },
    ],
    benefitsHeadline: "Built for the conversations where every word matters",
    benefits: [
      {
        title: "Captions as the doctor speaks",
        description: "Words appear on screen while the doctor is still talking. You read the diagnosis, drug name, or follow-up instruction at the same moment it is said — not after they have moved on.",
      },
      {
        title: "Medical terminology handled accurately",
        description: "Drug names, procedure names, clinical terms. Captio AI handles the vocabulary of a real consultation — not just everyday speech.",
      },
      {
        title: "Review the appointment after",
        description: "Record the consultation and upload it to Audio Transcription. Get a full written record of everything said — instructions, dosages, referrals — to review at home and share with a carer if needed.",
      },
      {
        title: "Works in any clinical setting",
        description: "Consultation rooms, hospital wards, A&E, dental chairs, pharmacy counters. Place the phone near the speaker and Captio AI captions whoever is talking.",
      },
      {
        title: "Any language",
        description: "For foreign-language doctors, specialists abroad, or appointments through an interpreter. Live Translator captions and translates in real time so you follow your diagnosis in the language you understand best.",
      },
      {
        title: "100% private",
        description: "Medical conversations are among the most sensitive there are. Captio AI processes audio in real time and discards it immediately. Nothing is recorded, stored, or shared.",
      },
    ],
    challenge: {
      headline: "Healthcare is harder to access when you cannot hear what is being said",
      paragraphs: [
        "A German study of deaf and hard of hearing adults found that 57% deliberately avoided visiting a doctor even when they had symptoms — not because they were not concerned, but because the appointment itself was too difficult to navigate (NCBI, 2023). That figure is not an outlier. Across multiple countries and healthcare systems, deaf and hard of hearing people consistently report reduced healthcare-seeking behaviour driven by communication barriers, not by the absence of symptoms.",
        "When they do attend, the gap between disclosure and accommodation is striking. Research published in PMC found that 93% of deaf and hard of hearing patients told their healthcare providers about their hearing loss — yet 29% reported that no arrangements were made to improve communication as a result (PMC, 2021). Most doctors want to help. Most simply do not know what to do, and the system provides no default.",
        "The consequences are concrete. Poor communication between patients and clinicians is associated with misdiagnosis, poor treatment adherence, lower patient satisfaction, and increased healthcare costs (NCBI, 2024). In acute care settings specifically, hearing loss is associated with longer hospital stays and worse outcomes. A missed word in a doctor's surgery is not an inconvenience — it is a clinical risk.",
        "Captio AI is built to eliminate that risk. The doctor speaks. You read every word in real time — the diagnosis, the drug name, the follow-up instruction. Record the consultation and review it at home. Nothing misheard. Nothing reconstructed. Just what was said, exactly as it was said.",
      ],
    },
    faqs: [
      { q: "Is it appropriate to use Captio AI at a doctor's appointment?", a: "Yes. Using a captioning app is a reasonable accessibility accommodation. Most doctors are supportive once they understand. You can place the phone on the desk without explanation — though many people find it helpful to briefly mention it so the doctor faces the microphone when speaking." },
      { q: "Does Captio AI handle medical terminology?", a: "Yes. Captio AI handles medical vocabulary including drug names, procedure names, dosage instructions, and clinical terms. In a typical quiet consultation room, accuracy is very high." },
      { q: "Does the doctor need to do anything differently?", a: "No. Captio AI works without any special setup on the doctor's side. They speak normally while you read the captions. If audio clarity is an issue — for example if they turn away — you can ask them to face the microphone, but it is usually not necessary." },
      { q: "Can I record the consultation and review it afterwards?", a: "Yes. Record the appointment on your phone and upload it to Audio Transcription. You get a full written transcript of the consultation — useful for reviewing instructions at home, checking drug names, or sharing with a family member or carer." },
      { q: "What if the appointment is in a language I am not fully fluent in?", a: "Use Live Translator. The doctor speaks their language — you read the translation in real time. For immigrants, travellers, or patients seeing foreign specialists, this means following your own diagnosis in the language you understand best." },
      { q: "Does it work at the pharmacy?", a: "Yes. Hold or place the phone near the pharmacist as they explain dosage, side effects, or interactions. Captions appear in real time so you leave the counter with a full understanding of what was said." },
      { q: "What about specialist appointments with dense clinical vocabulary?", a: "Captio AI handles specialist vocabulary — oncology, cardiology, neurology — including the technical terms specialists use. Record the appointment for a full written record you can review alongside any written materials the specialist provides." },
      { q: "Does it work in A&E or urgent care?", a: "Yes. In high-pressure environments like A&E, hold the phone toward whoever is speaking. Captions appear in real time for triage, examination, and discharge instructions — the moments when accurate understanding matters most." },
      { q: "Should I tell the doctor I am using it?", a: "You do not have to. Many people place the phone on the desk without mentioning it. If you do mention it, most doctors respond positively and face the microphone when speaking — which improves accuracy. Both approaches are valid." },
      { q: "Does using Captio AI count as a disability accommodation?", a: "Yes. Using a captioning app at a medical appointment is a recognised accessibility accommodation. Under disability equality legislation in most countries, healthcare providers are required to make reasonable adjustments for deaf and hard of hearing patients." },
    ],
    reviews: [
      { name: "Miriam L.", flag: "🇺🇸", email: "miriam.l***@gmail.com", detail: "Hard of hearing since birth, New York", quote: "I used to bring a family member to every appointment to catch what the doctor said. Now I go alone. Captio AI gives me everything in real time." },
      { name: "Takeshi N.", flag: "🇯🇵", email: "takeshi.n***@gmail.com", detail: "Progressive hearing loss, Osaka", quote: "Japanese doctors speak fast and do not repeat. Captio AI gives me a full transcript of every consultation so I leave knowing exactly what was said." },
      { name: "Amara D.", flag: "🇸🇪", email: "amara.d***@gmail.com", detail: "Hard of hearing, Stockholm", quote: "I moved from Senegal and my Swedish is not perfect. Live Translator captions the doctor in Swedish and I read in French. No more misunderstandings." },
      { name: "Reza K.", flag: "🇮🇷", email: "reza.k***@gmail.com", detail: "Hard of hearing, Tehran", quote: "I used to avoid appointments because they were too stressful. Captio AI changed that. I go to every one now and I understand everything." },
    ],
  },
  {
    slug: "lectures",
    label: "Lectures",
    icon: "🎓",
    tagline: "Follow every lecture. Don't miss the point.",
    description: "Lecturers speak quickly, cover complex material, and rarely repeat themselves. For deaf and hard of hearing students, following a lecture while lip-reading, taking notes, and processing content is an impossible split of attention. Captio AI gives you a live transcript of everything said — so you can focus on understanding, not straining to hear.",
    howItHelps: [
      "Captions appear in real time — follow the lecture as it happens",
      "Read without splitting attention between lip-reading and note-taking",
      "Works in lecture halls, seminars, tutorials, and online classes",
      "60+ languages — for international students and foreign-language courses",
    ],
    featureHighlights: [
      {
        slug: "live-captions",
        title: "Follow the lecture as it happens",
        bullets: [
          "Captions appear word by word while the lecturer is still speaking",
          "Works in lecture halls, seminars, and tutorials",
          "No setup — place the phone on your desk and start",
          "Any accent, any pace",
        ],
      },
      {
        slug: "live-translator",
        title: "For courses in another language",
        bullets: [
          "Captions and translates in real time",
          "For international students or foreign-language courses",
          "60+ languages, no switching",
          "Follow the lecture in the language you read best",
        ],
      },
      {
        slug: "audio-transcription",
        title: "Full transcript to study from",
        bullets: [
          "Record the lecture and upload it for a complete written transcript",
          "Searchable, copyable, shareable",
          "Review at your own pace after class",
          "Works on any lecture recording",
        ],
      },
      {
        slug: "ai-summary",
        title: "Key points extracted automatically",
        bullets: [
          "Important concepts and takeaways pulled from any transcript",
          "Organised into sections — not one continuous block",
          "Useful for revision and exam preparation",
          "Works on any saved lecture transcript",
        ],
      },
    ],
    subUseCases: [
      {
        icon: "🏛️",
        title: "Large lecture halls",
        description: "Hundreds of students, a PA system, a lecturer far away. Place your phone on the desk and point it toward the nearest speaker output. Captio AI captions everything clearly from any row.",
      },
      {
        icon: "🔬",
        title: "Seminars and tutorials",
        description: "Small groups, fast discussion, multiple voices. Captio AI follows whoever is speaking so you contribute without losing the thread of the conversation.",
      },
      {
        icon: "💻",
        title: "Online and recorded lectures",
        description: "Put the lecture on speaker and point Captio AI toward the audio. Captions appear in real time for live streams, recorded videos, and video call tutorials — regardless of the platform.",
      },
      {
        icon: "📚",
        title: "Study groups",
        description: "Group revision sessions, peer discussions, study catch-ups. Captio AI captions whoever is speaking so you follow every argument and contribution without asking for repeats.",
      },
      {
        icon: "🌍",
        title: "Foreign-language and international courses",
        description: "Studying abroad or taking a course in a second language. Live Translator captions the lecturer in their language and delivers it in yours — so the language barrier does not become an access barrier.",
      },
      {
        icon: "🎤",
        title: "Guest speakers and public talks",
        description: "One-off lectures, visiting professors, public talks on campus. No official captioning, no warning. Captio AI covers any speaker, in any space, without advance notice.",
      },
    ],
    benefitsHeadline: "Built for the pace and pressure of a real lecture",
    benefits: [
      {
        title: "Follow without splitting your attention",
        description: "Lip-reading and note-taking at the same time is an impossible cognitive load. Captio AI handles the following so you can direct all your attention to understanding what is being said.",
      },
      {
        title: "Captions while the lecturer is still speaking",
        description: "Words appear on your screen as they are said — not after the sentence ends. You stay in sync with the lecture rather than always being a beat behind.",
      },
      {
        title: "Works in any lecture setting",
        description: "Lecture halls, seminar rooms, online classes, study groups. Place the phone on your desk, point it toward the audio source, and Captio AI handles the rest.",
      },
      {
        title: "A full transcript to study from",
        description: "Record the lecture and upload it to Audio Transcription after class. Get a complete written record you can search, annotate, and revise from — at your own pace.",
      },
      {
        title: "60+ languages",
        description: "For international students, students studying abroad, or courses taught in a second language. Captio AI captions or translates in real time with no manual setup.",
      },
      {
        title: "No advance notice needed",
        description: "Official university captioning requires booking in advance and is not available for every session. Captio AI works for any lecture, any time, with no prior arrangement.",
      },
    ],
    challenge: {
      headline: "Deaf and HoH students are falling behind — and lectures are why",
      paragraphs: [
        "Only 18% of deaf and hard of hearing students graduate with a bachelor's degree, compared to 33% of hearing students (National Deaf Center). That gap does not exist because deaf and hard of hearing students are less capable. It exists because the lecture — the primary format of university teaching — is built entirely around hearing. Fast speech, no transcripts, no repeats, and a pace set by someone who cannot see whether you are keeping up.",
        "Communication in lectures was identified as the central challenge for deaf and hard of hearing students navigating university, with most reporting significant barriers to understanding spoken content during lectures specifically (Springer, 2025). Only 8% of postsecondary students with hearing loss even disclose their condition to their institution — which means the majority are navigating the gap without any formal support in place (PMC, 2024).",
        "The effort required in a lecture is qualitatively different from what hearing students experience. Following by lip-reading requires constant visual attention. Taking notes requires looking away from the lecturer — which breaks lip-reading. Processing the content requires cognitive bandwidth that is being used up by the act of following. The result is that a deaf or hard of hearing student sits through the same lecture as everyone else and leaves with a fraction of what was said.",
        "Captio AI is built to remove that constraint. Captions appear word by word as the lecturer speaks, so you follow without lip-reading, without splitting attention, without falling behind. Record the lecture and get a full transcript to study from. Nothing missed. Nothing reconstructed. Just the lecture, as it happened.",
      ],
    },
    faqs: [
      { q: "Does Captio AI work in large lecture halls?", a: "Yes. In a large lecture hall with a PA system, point your phone's microphone toward the nearest speaker output. The PA audio gives a clean signal for accurate captions. In smaller rooms without PA, place the phone on your desk pointed toward the front." },
      { q: "How do I position the phone during a lecture?", a: "Place it flat on your desk, microphone facing the lecturer or the nearest PA speaker. A small phone stand keeps it stable and angled for easy reading. You can glance at it naturally without losing track of the lecture." },
      { q: "Can I use Captio AI instead of a note-taker?", a: "Captio AI provides live captions in the room so you follow the lecture as it happens. For a written record to study from afterward, record the lecture and upload it to Audio Transcription — you get a full, searchable transcript organised by speaker." },
      { q: "Does it work for online lectures?", a: "Yes. Put the lecture on speaker and point your phone toward the audio output of your laptop or device. Captio AI captions whatever is playing in real time, regardless of the streaming or video platform." },
      { q: "Can I record the lecture and transcribe it afterwards?", a: "Yes. Record the audio on your phone during the lecture, then upload it to Audio Transcription. You get a complete written transcript you can read, search, copy, and study from — a full record of everything said." },
      { q: "Does it work for seminars where discussion moves quickly between students?", a: "Yes. In a seminar, place the phone in the centre of the table or hold it toward whoever is speaking. Captio AI follows the active voice at any moment, so you track who is contributing and what they are saying." },
      { q: "What about lectures taught in another language?", a: "Use Live Translator. The lecturer speaks their language — you read the translation in real time. Useful for students studying abroad, international exchange programmes, or courses delivered in a second language." },
      { q: "How is Captio AI different from official university captioning services?", a: "Official university captioning must be booked in advance, is not available for every session, and may involve a delay. Captio AI works for any lecture, any time, with no advance notice or booking required — including guest speakers, pop-up sessions, and online content." },
      { q: "Is using Captio AI in a lecture allowed?", a: "Yes. Captio AI is an accessibility tool. Using a captioning app in class is a standard reasonable accommodation. For assessed settings, check with your institution's disability services office — policies vary on what is permitted in exams." },
      { q: "Does it work for study groups and peer revision sessions?", a: "Yes. Place the phone on the table between participants and point it toward the most active speaker. Captio AI captions whoever is talking so you follow every contribution without asking for repeats." },
    ],
    reviews: [
      { name: "Priya S.", flag: "🇮🇳", email: "priya.s***@gmail.com", detail: "Hard of hearing student, Delhi", quote: "I was trying to lip-read and take notes at the same time. It was exhausting. Captio AI handles the following — I just focus on understanding." },
      { name: "Lucas M.", flag: "🇧🇷", email: "lucas.m***@gmail.com", detail: "Deaf, São Paulo", quote: "My university has no official captioning. Captio AI covers every lecture, every seminar, every guest speaker. I stopped missing things." },
      { name: "Emma J.", flag: "🇬🇧", email: "emma.j***@gmail.com", detail: "Hard of hearing, Manchester", quote: "Official captioning only covers some lectures. Captio AI covers everything else — and it is faster and more accurate anyway." },
      { name: "Giulia R.", flag: "🇮🇹", email: "giulia.r***@gmail.com", detail: "Hard of hearing student, Milan", quote: "Italian lectures move fast and professors do not repeat. Captio AI gives me every word, in real time, so I keep up with the same content as everyone else." },
    ],
  },
  {
    slug: "everyday-conversations",
    label: "Everyday Conversations",
    icon: "💬",
    tagline: "Follow any conversation. In any situation.",
    challenge: {
      headline: "Everyday conversations are the hardest ones to access",
      paragraphs: [
        "Most deaf and hard of hearing people do not struggle primarily in hospitals or formal settings — those at least sometimes have accommodations. The real struggle is the everyday: the pharmacy counter, the colleague who asks a question while walking past, the dinner where everyone starts talking at once. Research tracking adults over eight years found that hearing loss is associated with 28% higher odds of social isolation (NCBI, 2024). That number is not driven by medical appointments. It is driven by the moments no one thinks to prepare for.",
        "The effect builds quietly. A 2025 survey found that only 37% of deaf individuals could manage everyday tasks independently with minimal assistance — not complex medical tasks, but ordinary ones: errands, appointments, counter conversations (PR Newswire, 2025). Each of those tasks requires a negotiation most people around you are not even aware is happening. You ask for a repeat. You lean in. You guess. You nod when you are not sure. That is the baseline before the day has really started.",
        "What accumulates is loneliness — but not the kind people usually talk about. Research in The Laryngoscope found that 38% of adults with hearing loss experience loneliness compared to 29% in the general population, and among those with moderate to severe hearing loss the figure rises to 69% (Döge et al., 2025). Researchers do not attribute this to the hearing loss itself. They attribute it to the communication barriers — to dinners where you follow half the table, to conversations that move too fast, to social settings where everyone else absorbs what is happening and you are working to keep up.",
        "Deaf individuals are twice as likely to experience mental health issues compared to the general population (Inclusive ASL, 2023). The cause is not the hearing loss — it is the effort. Lip reading, guessing, asking for repeats, absorbing the social cost of all three, across every ordinary day. If you are reading this, you already know what that effort feels like. It is not a medical problem. It is an access problem. Captio AI is built to solve the access problem — so that every conversation, in any setting, is one you can fully be part of.",
      ],
    },
    description: "Most conversations happen fast, at normal pace, without warning — in the street, at the shops, at a family dinner. For deaf and hard of hearing people, everyday speech is the hardest to accommodate because there is no formal support and no system to request. Captio AI gives you real-time captions for any spoken conversation, anywhere.",
    howItHelps: [
      "Captions appear instantly as people speak — no setup required",
      "Works indoors, outdoors, in noisy and quiet environments",
      "Handles all accents, speaking speeds, and regional varieties",
      "60+ languages — for conversations anywhere in the world",
    ],
    featureHighlights: [
      {
        slug: "live-captions",
        title: "Captions any conversation in real time",
        bullets: [
          "Word by word, as the person speaks",
          "Works in noisy places — counters, streets, busy rooms",
          "Any accent, any pace",
          "No lip reading needed",
        ],
      },
      {
        slug: "live-translator",
        title: "Everyday conversations in any language",
        bullets: [
          "Translates as they speak, not after",
          "Each person speaks their own language",
          "Handles mid-sentence switches",
          "60+ languages, no setup",
        ],
      },
      {
        slug: "audio-transcription",
        title: "Save any conversation for later",
        bullets: [
          "Record and get the full transcript",
          "Organized by speaker",
          "Read, copy, search, share",
          "Any language, any audio",
        ],
      },
      {
        slug: "ai-summary",
        title: "Key points from any exchange",
        bullets: [
          "Important points extracted automatically",
          "Works on any saved transcript",
          "Organized into clear sections",
          "Nothing gets missed",
        ],
      },
    ],
    subUseCases: [
      {
        icon: "🏪",
        title: "Counter conversations",
        description: "Pharmacies, post offices, shops, government offices. The person behind the counter speaks at their own pace and does not expect you to ask for a repeat. Captio AI shows you what they said before the moment passes.",
      },
      {
        icon: "🍽️",
        title: "Group conversations",
        description: "Dinner tables, social gatherings, team lunches. Multiple people, fast exchanges, overlapping threads. Captio AI captions whoever is speaking so you follow without losing the conversation.",
      },
      {
        icon: "👋",
        title: "Talking to strangers",
        description: "Asking for directions, chatting with a neighbor, meeting someone new. People who do not know to slow down or face you. Captio AI captions anyone who speaks near you — not just people you have already briefed.",
      },
      {
        icon: "☕",
        title: "Informal work moments",
        description: "Hallway chats, kitchen catch-ups, quick questions between meetings. The moments everyone else absorbs automatically. Captio AI keeps you in those conversations too.",
      },
      {
        icon: "📋",
        title: "Appointments and admin",
        description: "Doctors, dentists, government offices, bank branches. Fast speech, technical vocabulary, no repeats expected. Captio AI gives you a real-time transcript of everything said so you can follow and respond accurately.",
      },
      {
        icon: "🚉",
        title: "Getting around",
        description: "Transport staff, ticket offices, asking for help in unfamiliar places. Situations where you need to understand the first time. Captio AI covers you anywhere speech happens without warning.",
      },
    ],
    benefitsHeadline: "Built for conversations that don't wait",
    benefits: [
      {
        title: "Captions as they speak, not after",
        description: "Captio AI shows each word as it is spoken. You read what the person is saying while they are still saying it — not after they have finished and moved on.",
      },
      {
        title: "No lip reading needed",
        description: "You do not need to face the speaker or position yourself to see their mouth. Captio AI picks up speech from any direction — across a counter, at a table, in a busy street.",
      },
      {
        title: "Works through background noise",
        description: "Restaurants, pharmacies, busy streets, crowded waiting rooms. Captio AI separates speech from background noise so captions stay accurate where everyday conversations actually happen.",
      },
      {
        title: "Follows any conversation",
        description: "One person or six. Captio AI captions whoever is speaking at any moment — so you follow the thread at a dinner table or keep up with a counter exchange without losing track.",
      },
      {
        title: "Any accent, any pace",
        description: "People do not slow down or enunciate for you. Captio AI handles fast talkers, regional accents, and casual speech — the way people actually talk in real life.",
      },
      {
        title: "Any language, no setup",
        description: "When someone speaks a language you do not know, switch to Live Translator. They speak their language — you read in yours. No configuration needed. Works in 60+ languages.",
      },
    ],
    faqs: [
      { q: "Does Captio AI work in noisy environments?", a: "Yes. Captio AI is built for real-world noise, not just quiet rooms. It handles moderate background noise well — restaurants, streets, busy offices. Very loud environments (concerts, heavy machinery) may reduce accuracy, but for typical everyday settings the captions stay accurate." },
      { q: "Can I use Captio AI for conversations with strangers?", a: "Yes. Place your phone between yourself and the other person. They speak normally; you read the captions. Most people understand immediately and adapt naturally without any awkwardness." },
      { q: "Does it work for fast speakers?", a: "Yes. Captio AI handles natural conversational speed, including fast speakers. It is designed for real-world speech, not slow dictation — so it keeps up with the way people actually talk." },
      { q: "What if someone switches language mid-conversation?", a: "Switch to Live Translator mode. Live Translator detects the spoken language and translates into your chosen language in real time — so mid-conversation language switches are handled automatically without any manual adjustment." },
      { q: "How should I hold or position my phone?", a: "Point the microphone toward whoever is speaking. In a face-to-face conversation, place the phone flat on the table between you with the microphone facing the other person. In a group setting, place it in the centre of the group. You do not need to hold it — a flat surface works well." },
      { q: "Does it work for counter conversations — pharmacies, post offices, shops?", a: "Yes. Hold or place the phone near the counter, pointed toward the staff member. They speak at their normal pace; you read the captions. You do not need to explain anything to them or ask them to slow down." },
      { q: "Is the audio from my conversations stored anywhere?", a: "No. Captio AI processes audio in real time and discards it immediately. Nothing is stored on servers, nothing is shared, and nothing is used for any purpose beyond generating captions in the moment." },
      { q: "Does it work when people are speaking quietly?", a: "Quiet speech is captured as long as the phone is close enough to the speaker — within a metre typically works well. Very low whispers at distance may reduce accuracy, but normal quiet speech in a one-to-one conversation is handled accurately." },
      { q: "Can I use Captio AI for informal work moments — hallway chats, quick questions?", a: "Yes. These spontaneous conversations are exactly what Captio AI is designed for. Open the app and point it toward whoever is speaking. There is no setup required between conversations." },
      { q: "Does Captio AI need an internet connection?", a: "Yes. Captio AI requires an active internet connection — Wi-Fi or mobile data — to process speech. For outdoor conversations, a mobile data connection keeps it working wherever you are." },
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
    description: "Mishearing a question in an interview means answering wrong or asking for a repeat — either outcome affects how you come across. For deaf and hard of hearing people, the interview room is one of the highest-stakes environments where a missed word has direct consequences. Captio AI shows you every word the interviewer says so you can focus entirely on your answer.",
    howItHelps: [
      "Read the full question before you answer — nothing missed, nothing guessed",
      "Works in person, on video calls, and over the phone",
      "Discreet — runs quietly on your phone without drawing attention",
      "Audio is never recorded or stored — 100% private",
    ],
    featureHighlights: [
      {
        slug: "live-captions",
        title: "Read the question before you answer",
        bullets: [
          "Every word appears in real time as the interviewer speaks",
          "Works in person, on video calls, and on the phone",
          "Discreet — runs quietly on your phone",
          "No asking for repeats",
        ],
      },
      {
        slug: "live-translator",
        title: "For interviews in another language",
        bullets: [
          "Captions and translates in real time",
          "For international employers or roles abroad",
          "60+ languages, no setup",
          "Follow every question in the language you think in",
        ],
      },
      {
        slug: "audio-transcription",
        title: "Review the interview afterwards",
        bullets: [
          "Record and transcribe to revisit questions and your answers",
          "Useful for preparing for follow-up rounds",
          "Identify what you want to clarify in a second interview",
          "Works on any recording",
        ],
      },
      {
        slug: "ai-summary",
        title: "Key topics and questions extracted",
        bullets: [
          "Main themes and questions pulled from any interview transcript",
          "Useful for post-interview reflection and follow-up",
          "Organised into sections",
          "Works on any saved recording",
        ],
      },
    ],
    subUseCases: [
      {
        icon: "👔",
        title: "In-person interviews",
        description: "Across a desk or table, in an unfamiliar room, with an interviewer speaking at their normal pace. Place Captio AI on the table between you and read every question in real time without looking like you are struggling.",
      },
      {
        icon: "💻",
        title: "Video interviews",
        description: "Zoom, Teams, Google Meet. Put the call on speaker, point Captio AI toward the audio, and follow every question and follow-up in real time — regardless of which platform the interview is on.",
      },
      {
        icon: "📞",
        title: "Phone screens and initial calls",
        description: "The first round most employers run — no video, no lip reading, compressed audio. Captio AI captions the recruiter's voice in real time so you answer every question confidently.",
      },
      {
        icon: "👥",
        title: "Panel interviews",
        description: "Multiple interviewers, voices switching quickly, questions coming from different directions. Captio AI follows whoever is speaking so you know who asked what and can respond without hesitation.",
      },
      {
        icon: "🌍",
        title: "International and foreign-language interviews",
        description: "Interviewing for a role abroad or with a company that operates in another language. Live Translator captions the interview in your language so the language barrier does not become a barrier to the role.",
      },
      {
        icon: "🎯",
        title: "Assessment centres",
        description: "Group exercises, presentations, evaluator feedback. Multiple voices, fast-moving activities, evaluators who do not know to face you. Captio AI covers every spoken element of the day.",
      },
    ],
    benefitsHeadline: "Built for the room where a missed word has real consequences",
    benefits: [
      {
        title: "Read the full question before you answer",
        description: "Every word appears on screen as the interviewer speaks. You read the question completely before responding — nothing guessed, nothing reconstructed.",
      },
      {
        title: "Works in person and on any call format",
        description: "In-person interviews, video calls, phone screens. Place the phone on the table or point it toward the audio — Captio AI handles every format.",
      },
      {
        title: "Discreet by design",
        description: "The app runs quietly on your phone. Place it on the table or hold it naturally. No explanation needed, no drawing attention to the accommodation.",
      },
      {
        title: "No asking for repeats",
        description: "Asking an interviewer to repeat a question signals uncertainty. Captio AI means you never need to — you read it in real time and answer with confidence.",
      },
      {
        title: "Any language",
        description: "For international roles, multilingual panels, or interviews conducted in a second language. Live Translator captions and translates in real time so language is never the barrier.",
      },
      {
        title: "Private by default",
        description: "Interview conversations are sensitive. Captio AI processes audio in real time and discards it immediately — nothing is stored, nothing is shared.",
      },
    ],
    challenge: {
      headline: "The interview process was not designed with deaf and HoH candidates in mind",
      paragraphs: [
        "37% of deaf people have experienced discrimination during a job interview (Raliance, 2023). Fewer than 40% of people with a hearing disability work full time, compared to higher rates in the general population (U.S. Census Bureau). These numbers are not driven by a lack of qualifications — deaf and hard of hearing candidates frequently hold the same credentials as hearing peers. They are driven, in part, by what happens in the room during the interview itself.",
        "The interview format is built around speech — fast, unstructured, with no transcript, no repeats, and a dynamic that punishes any sign of confusion. Asking for a repeat is not neutral. It reads as distraction, or a failure to understand the question. Answering the wrong question because you caught part of it is worse. The hearing candidate next to you processed the same question with no effort. You spent cognitive bandwidth on following it. Neither the stakes nor the scoring system accounts for that difference.",
        "Requesting formal accommodations in advance creates its own risk. Research found that deaf job candidates who requested accommodations like sign language interpreters sometimes had their interviews cancelled suddenly (Deaf Job Wizard). Disclosing before the interview opens the door to bias. Not disclosing and struggling in the room produces a different problem. It is a dilemma the hiring process creates — not one the candidate should have to solve.",
        "Captio AI removes the dilemma. You do not need to request anything in advance, explain anything to the interviewer, or ask for a repeat. Place the phone on the table. Read every question as it is asked. Give your best answer. That is all the interview was ever supposed to be.",
      ],
    },
    faqs: [
      { q: "Should I tell the interviewer I am using Captio AI?", a: "That is your choice. Many people briefly mention it as an accessibility tool — most interviewers are supportive and adapt naturally. Others use it discreetly without disclosure. Both approaches are valid, and neither requires any setup from the interviewer." },
      { q: "Does Captio AI work for video interviews on Zoom or Teams?", a: "Yes. Put the call on speaker and point your phone's microphone toward the audio. Captions appear in real time as the interviewer speaks, regardless of which video platform is being used." },
      { q: "What if I miss a question mid-interview?", a: "Captio AI gives you the full caption of what was said, word by word, in real time. You can glance at it at any moment to confirm what you heard — without asking for a repeat." },
      { q: "Is using Captio AI in an interview allowed?", a: "Yes. Captio AI is an accessibility tool equivalent to any other hearing accommodation. In most jurisdictions, employers are legally required to make reasonable accommodations for deaf and hard of hearing candidates — this extends to the hiring process." },
      { q: "How do I set it up discreetly?", a: "Open the app before the interview starts and place your phone face-up on the table or desk between you and the interviewer. The phone can sit naturally — most people do not notice or comment on it." },
      { q: "Does it work for phone screens?", a: "Yes. Put the call on speaker, open Captio AI, and point the microphone toward the phone speaker. Captions appear in real time for whatever the recruiter says — phone screens are one of the hardest formats without captioning, and one of the most improved with it." },
      { q: "What about panel interviews with multiple interviewers?", a: "Captio AI follows whoever is speaking at any moment. In a panel, it tracks the active questioner. Place the phone on the table facing the panel — it handles voice switching without any manual adjustment." },
      { q: "Can I review the interview afterwards?", a: "Yes. Record the audio on your phone and upload it to Audio Transcription. You get a full written transcript of the interview — useful for preparing follow-up questions, identifying areas to address in a second round, or reviewing your own answers." },
      { q: "What if the interviewer speaks quickly or has a strong accent?", a: "Captio AI handles natural speech rates and regional accents. You do not need to ask the interviewer to slow down or enunciate for accurate captions." },
      { q: "Does it work for assessment centre group activities?", a: "Yes. In group exercises, place the phone on the table facing the most active participants. For evaluator briefings and feedback sessions, point it toward the evaluator. Captio AI captions whoever is speaking at any moment." },
    ],
    reviews: [
      { name: "David C.", flag: "🇬🇧", email: "david.c***@gmail.com", detail: "Hard of hearing, Birmingham", quote: "I used to dread phone interviews. With Captio AI I can read every word in real time. I got the job." },
      { name: "Hana K.", flag: "🇨🇿", email: "hana.k***@gmail.com", detail: "Hard of hearing, Prague", quote: "I told the interviewer I would be using a captioning app. She was completely fine with it. I followed every question and the interview went perfectly." },
      { name: "Marco B.", flag: "🇮🇹", email: "marco.b***@gmail.com", detail: "Progressive hearing loss, Milan", quote: "Fast formal Italian in an interview is hard to follow. Captio AI gave me every question clearly. I answered well because I actually heard what was asked." },
      { name: "Aoi S.", flag: "🇯🇵", email: "aoi.s***@gmail.com", detail: "Hard of hearing, Tokyo", quote: "Japanese panel interviews are structured but fast. Captio AI made sure I caught every question from every panel member. I went in prepared and came out confident." },
    ],
  },
  {
    slug: "phone-video-calls",
    label: "Phone & Video Calls",
    icon: "📱",
    tagline: "Follow every call. No more asking people to repeat.",
    description: "Phone and video calls remove every visual cue — no lip reading, no facial expression, just compressed audio with nothing to fall back on. For deaf and hard of hearing people, calls require more effort, more requests to repeat, and more guesswork than any in-person conversation. Captio AI captions whoever is speaking in real time so you can follow any call without interrupting.",
    howItHelps: [
      "Put the call on speaker and point your phone's microphone toward the audio",
      "Works with any phone, video call app, or device — no integration needed",
      "Handles compressed call audio and background noise",
      "60+ languages — for international and multilingual calls",
    ],
    featureHighlights: [
      {
        slug: "live-captions",
        title: "Follow the call in real time",
        bullets: [
          "Captions appear word by word as the other person speaks",
          "Works on any call — no app integration required",
          "Put the call on speaker and point the microphone toward it",
          "Handles compressed call audio accurately",
        ],
      },
      {
        slug: "live-translator",
        title: "International and foreign-language calls",
        bullets: [
          "They speak their language — you read in yours",
          "Translates in real time as they speak",
          "60+ languages, no setup",
          "For family abroad, international business, or travel",
        ],
      },
      {
        slug: "audio-transcription",
        title: "Transcribe any call recording",
        bullets: [
          "Record the call and upload for a complete written transcript",
          "Review instructions, information, and decisions after",
          "Organised by speaker",
          "Works on any call recording",
        ],
      },
      {
        slug: "ai-summary",
        title: "Key information extracted from any call",
        bullets: [
          "Important points pulled from any call transcript",
          "Useful for medical calls, customer service, and work calls",
          "Organised into clear sections",
          "Works on any saved recording",
        ],
      },
    ],
    subUseCases: [
      {
        icon: "👨‍👩‍👧",
        title: "Calls with family and friends",
        description: "Regular catch-ups with parents, siblings, and friends who do not know to slow down on a call. Captio AI captions them in real time so you follow the conversation without asking for repeats.",
      },
      {
        icon: "💼",
        title: "Work calls and conference calls",
        description: "One-on-ones with managers, team calls, client calls. Put the call on speaker, point Captio AI toward the audio, and follow every participant without losing the thread.",
      },
      {
        icon: "🏥",
        title: "Medical and healthcare calls",
        description: "GP callbacks, test results by phone, pharmacy queries, appointment confirmations. High-stakes calls where missing a word about a dosage or diagnosis has real consequences.",
      },
      {
        icon: "🏦",
        title: "Banks, utilities, and customer service",
        description: "Insurance companies, banks, energy providers, government offices. Automated menus, hold music, and fast-speaking agents. Captio AI captions whatever comes out of the speaker.",
      },
      {
        icon: "🌍",
        title: "International calls",
        description: "Family abroad, international colleagues, foreign customer service. Live Translator captions and translates in real time so language is never an additional barrier on top of everything else.",
      },
      {
        icon: "📹",
        title: "Video calls — FaceTime, WhatsApp, Zoom",
        description: "Any video call app, on any device. Captio AI does not need to integrate — it listens through the microphone. Put the call on speaker and read the captions alongside the video.",
      },
    ],
    benefitsHeadline: "Built for the calls you have been avoiding",
    benefits: [
      {
        title: "Captions as they speak",
        description: "Words appear on screen word by word while the other person is still talking. You read what they say at the same pace everyone else hears it — no delay, no reconstruction.",
      },
      {
        title: "Works on any call app",
        description: "Captio AI does not need to integrate with any platform. Put the call on speaker, point the microphone toward the audio, and read the captions. It works the same way for any app on any device.",
      },
      {
        title: "No more asking for repeats",
        description: "Every word is on screen as it is said. If you missed something, glance at the caption rather than interrupting the call — the full sentence is there.",
      },
      {
        title: "Handles call audio accurately",
        description: "Compressed phone audio is less clean than in-person speech. Captio AI is built for real-world audio conditions, including the reduced quality of standard phone and VoIP calls.",
      },
      {
        title: "Any language",
        description: "For calls with family abroad, international colleagues, or foreign-language customer service. Live Translator captions and translates in real time with no manual setup.",
      },
      {
        title: "Record and review after",
        description: "Record any call and upload it to Audio Transcription. Get a full written record of everything said — useful for medical instructions, work decisions, and anything worth having in writing.",
      },
    ],
    challenge: {
      headline: "The phone was designed for people who can hear it",
      paragraphs: [
        "55% of deaf respondents cite anxiety or frustration when relying on others for help with phone communications, and 83% of hard of hearing respondents report similar frustrations when trying to communicate with family or friends by phone (PR Newswire, 2025). These numbers describe a technology that billions of people use without thinking — and that a significant part of the population has learned to avoid.",
        "The phone removes everything that makes in-person speech accessible. No lip reading. No facial expression. No context from the environment. What remains is compressed audio, often with background noise on the other end, delivered through a small speaker with no visual backup. For a deaf or hard of hearing person, this is not just a harder version of a conversation. It is a different kind of task entirely — one that hearing people do not know they are better equipped for.",
        "The consequences of avoidance are not trivial. 20% of deaf and 24% of hard of hearing people surveyed reported serious concerns that communication barriers would prevent them from contacting healthcare personnel in an emergency (PR Newswire, 2025). The phone call that arranges a medical appointment, reports a side effect, or clarifies a prescription — these are not optional interactions. Avoidance has a cost.",
        "Captio AI is built to make those calls possible. Put the call on speaker. Point the microphone toward the audio. Read the captions in real time. No integration, no platform restrictions, no asking anyone to slow down. Every call — practical, personal, or urgent — now accessible.",
      ],
    },
    faqs: [
      { q: "How do I use Captio AI during a phone call?", a: "Put your call on speaker, open Captio AI, and point the phone's microphone toward the speaker. The app captions the other person's speech in real time as you both talk." },
      { q: "Does Captio AI work with Zoom, Teams, FaceTime, or WhatsApp?", a: "Yes. Captio AI works by listening through the microphone — it does not need to integrate with any app. Put the call on speaker or hold the phone near the audio output and read the captions alongside the call." },
      { q: "Does audio quality affect accuracy?", a: "Compressed call audio is less clean than in-person speech, which can reduce accuracy slightly. In typical phone and video call conditions, accuracy remains high. Very poor connections or heavy compression may reduce it further." },
      { q: "Can I use it for conference calls with multiple participants?", a: "Yes. Captio AI captions whoever is speaking at any moment. In a multi-participant call, it follows the active speaker. Simultaneous crosstalk follows the loudest voice — the same way human hearing works in the same situation." },
      { q: "Does it work for calls in another language?", a: "Yes. Use Live Translator. The other person speaks their language — you read the translation in real time. Works across 60+ languages with no manual setup between calls or language changes." },
      { q: "What about automated phone systems and menus?", a: "Yes. Captio AI captions automated voice systems the same way it captions human speech. Hold the phone near the speaker and read the options as they are announced." },
      { q: "Can I record and transcribe a call?", a: "Yes. Record the call audio on your phone and upload it to Audio Transcription. You get a complete written transcript — useful for medical instructions, customer service reference numbers, or any call you want a written record of." },
      { q: "Does it work for customer service calls?", a: "Yes. Banks, insurance companies, utility providers, government offices. Put the call on speaker and point Captio AI toward the audio. It captions fast-speaking agents and automated systems accurately." },
      { q: "What if I am making the call, not receiving it?", a: "The setup is the same — put the call on speaker, open Captio AI, and point the microphone toward the speaker output. You speak normally into the phone; Captio AI captions what the other person says back to you." },
      { q: "Does it work on video calls where I can also lip-read?", a: "Yes. You can use both simultaneously. Many people find captions useful even on video calls because the lip-reading demand is reduced — you read the caption rather than working to follow the video feed." },
    ],
    reviews: [
      { name: "Ruth T.", flag: "🇺🇸", email: "ruth.t***@gmail.com", detail: "Hard of hearing, Chicago", quote: "I avoided phone calls for years. Every call was exhausting and I always missed something important. Captio AI changed that. I can call anyone now." },
      { name: "Anders L.", flag: "🇸🇪", email: "anders.l***@gmail.com", detail: "Deaf, Gothenburg", quote: "Video calls with my family used to be the hardest part of my week. Captio AI gives me everything they say in real time. Now I look forward to them." },
      { name: "Sofia R.", flag: "🇵🇹", email: "sofia.r***@gmail.com", detail: "Hard of hearing, Lisbon", quote: "I used to ask my sister to make calls for me. Portuguese phone calls are fast and I missed too much. Now I make them myself." },
      { name: "Nour M.", flag: "🇱🇧", email: "nour.m***@gmail.com", detail: "Hard of hearing, Beirut", quote: "Calls in Arabic were always the worst — fast speech, no visual cues, nothing to fall back on. Captio AI made them manageable for the first time." },
    ],
  },
  {
    slug: "group-settings",
    label: "Group Settings",
    icon: "👥",
    tagline: "Keep up with the group. Never lose the thread.",
    description: "In group conversations, multiple people talk at once and the thread moves fast. For deaf and hard of hearing people, group settings are among the most tiring everyday environments — not because hearing is impossible, but because the sustained effort of following multiple voices across a noisy room compounds into exhaustion. Captio AI captions whoever is speaking so you follow without having to work to stay in.",
    howItHelps: [
      "Real-time captions of whoever is speaking at any moment",
      "Works for small groups and larger gatherings",
      "Place your phone in the centre of the group for best coverage",
      "60+ languages — for multilingual groups and gatherings",
    ],
    featureHighlights: [
      {
        slug: "live-captions",
        title: "Follow whoever is speaking",
        bullets: [
          "Captions the active voice at any moment",
          "Works at dinner tables, parties, and social gatherings",
          "Place the phone in the centre of the group",
          "Any accent, any pace",
        ],
      },
      {
        slug: "live-translator",
        title: "For multilingual groups",
        bullets: [
          "Each person speaks their own language",
          "You read in yours, in real time",
          "60+ languages, no switching",
          "For international families, mixed-language groups, travel",
        ],
      },
      {
        slug: "audio-transcription",
        title: "Transcribe any group conversation",
        bullets: [
          "Record and get the full conversation in writing",
          "Organised by speaker",
          "Review who said what after the fact",
          "Any group size, any language",
        ],
      },
      {
        slug: "ai-summary",
        title: "Key points from any group discussion",
        bullets: [
          "Decisions and takeaways extracted automatically",
          "Useful for group meetings and community discussions",
          "Organised into clear sections",
          "Works on any saved recording",
        ],
      },
    ],
    subUseCases: [
      {
        icon: "🍽️",
        title: "Family dinners",
        description: "Multiple relatives, fast exchanges, topics shifting without warning. The dinner table is where Dinner Table Syndrome lives — being physically present but left out of the conversation. Captio AI keeps you in it.",
      },
      {
        icon: "🎉",
        title: "Social gatherings and parties",
        description: "Background noise, groups forming and dissolving, people speaking from different directions. Captio AI captions whoever is nearest and loudest so you follow without tracking faces.",
      },
      {
        icon: "☕",
        title: "Friend catch-ups",
        description: "Casual conversation at a cafe, in someone's home, or out for a walk. The informal setting where no one thinks to make accommodations and the conversation moves at full speed.",
      },
      {
        icon: "🌍",
        title: "Multilingual groups",
        description: "Friends and family who switch between languages, international gatherings, mixed-language households. Live Translator handles multiple languages in a single session so language switching does not break the thread.",
      },
      {
        icon: "👥",
        title: "Community and club meetings",
        description: "Book clubs, sports teams, neighbourhood associations, religious gatherings. Group discussions with no official captioning and no protocol for accessibility. Captio AI covers them all.",
      },
      {
        icon: "🏠",
        title: "Shared living situations",
        description: "Flatmates, student houses, shared meals. The background hum of people living together — conversations in kitchens, across living rooms, with the TV on. Captio AI works in the environment as it is.",
      },
    ],
    benefitsHeadline: "Built to keep you in the conversation, not just in the room",
    benefits: [
      {
        title: "Captions whoever is speaking",
        description: "Captio AI follows the dominant voice at any moment — whoever is loudest in the microphone's direction. In a group conversation, this tracks the active speaker naturally.",
      },
      {
        title: "Works through background noise",
        description: "Restaurants, living rooms, parties, outdoor gatherings. Moderate background noise does not prevent accurate captions — Captio AI is built for real environments, not quiet rooms.",
      },
      {
        title: "Place it in the centre and forget it",
        description: "Put the phone on the table or in the middle of the group, microphone facing the conversation. No positioning it after every speaker change, no adjusting between voices.",
      },
      {
        title: "Less effort, less fatigue",
        description: "The cognitive load of following a group conversation by lip-reading and reconstructing speech is exhausting. Captio AI handles the following so you can direct your energy toward actually being in the conversation.",
      },
      {
        title: "60+ languages",
        description: "For multilingual families, mixed-language social groups, or gatherings where people switch between languages mid-conversation. No setup required between language changes.",
      },
      {
        title: "No setup between conversations",
        description: "Open the app and place the phone. No configuration per setting, no briefing the group, nothing to manage between conversations. It works for any group, in any situation.",
      },
    ],
    challenge: {
      headline: "Being in the room is not the same as being in the conversation",
      paragraphs: [
        "There is a named phenomenon in deaf and hard of hearing communities called Dinner Table Syndrome — the experience of being physically present at a family gathering while being entirely excluded from the conversation happening around you (Taylor & Francis, 2025). You sit at the same table as everyone else. You share the same meal. You are in the room. But the conversation moves too fast, the acoustics are too poor, and the people around you do not know what to do — so they keep talking to each other, and you keep watching.",
        "Group settings are uniquely exhausting for deaf and hard of hearing people because they combine every factor that makes following speech harder: background noise, multiple voices, unpredictable speaker switching, and the absence of any formal support. Research consistently finds that the cognitive load of listening in noisy, multi-speaker environments is significantly higher for people with hearing loss — and that this load directly leads to fatigue and withdrawal from social participation (PMC, 2024).",
        "The withdrawal is rational. If following a two-hour family dinner requires sustained concentration that leaves you exhausted, you start finding reasons not to go. If contributing to a group conversation means asking for repeats that disrupt the flow and mark you as different, you start nodding instead of engaging. The reduction in social participation is not passive — it is an active response to an environment that was not designed for you. Researchers link this pattern directly to increased social isolation and its downstream effects on mental health (PMC, 2023).",
        "Captio AI is built for the table. Place the phone in the centre, open the app, and follow every speaker in real time — without the effort, without the fatigue, without the gap between being present and being included.",
      ],
    },
    faqs: [
      { q: "Does Captio AI work when multiple people speak at once?", a: "Captio AI follows the dominant voice at any moment — whoever is loudest in the microphone's direction. In genuine simultaneous crosstalk it follows the loudest voice, which mirrors how human hearing works in the same situation." },
      { q: "Where should I place the phone in a group setting?", a: "Place it in the centre of the group with the microphone facing the most active part of the conversation. A small phone stand keeps it stable and angled without drawing attention. You can glance at it naturally between contributions." },
      { q: "Does it work at family dinners and social events?", a: "Yes. These are exactly the settings Captio AI is built for — informal group situations where no formal support is available and no accommodation has been arranged. The app works for any group in any environment." },
      { q: "What if the group is loud?", a: "Moderate background noise — a typical dinner table, a social gathering — is handled well. Very loud environments like nightclubs reduce accuracy. In a typical noisy social setting, captions remain accurate for nearby speakers." },
      { q: "What if people switch languages mid-conversation?", a: "Use Live Translator. It detects the spoken language in real time and translates into your chosen language — so mid-conversation language switches are handled automatically without any manual adjustment." },
      { q: "Does it work for larger group settings like community meetings?", a: "Yes. In a larger group discussion, place the phone on the table or hold it toward the most active speaker. Captio AI captions whoever is speaking — useful for book clubs, team events, community meetings, and any organised group discussion." },
      { q: "What if people move around during the gathering?", a: "Keep the phone with you or on a central surface. If the conversation moves, move the phone with it. For outdoor or moving settings, hold it toward whoever you want to follow at any given moment." },
      { q: "Does it work outdoors?", a: "Yes. Outdoor gatherings — barbecues, picnics, events in parks — are handled the same way. Wind noise at high levels may reduce accuracy, but typical outdoor social settings work well." },
      { q: "Can Captio AI tell me who is speaking?", a: "Captio AI captions the voice it is picking up — it does not identify individuals by name. In a seated group, placing the phone centrally and watching who is speaking alongside the captions makes it easy to follow speaker attribution." },
      { q: "Does it work for multilingual families where people mix languages?", a: "Yes. Use Live Translator mode, which detects and translates from multiple source languages in a single session. For a family where some members speak one language and others speak another, Captio AI translates in real time without any manual switching." },
    ],
    reviews: [
      { name: "Chloe B.", flag: "🇫🇷", email: "chloe.b***@gmail.com", detail: "Hard of hearing, Paris", quote: "French family dinners used to be two hours of nodding. I put Captio AI in the middle of the table now and follow everything." },
      { name: "Ivan S.", flag: "🇷🇺", email: "ivan.s***@gmail.com", detail: "Progressive hearing loss, Moscow", quote: "Russian family gatherings are loud and chaotic. Captio AI follows whoever is speaking so I stop losing the thread." },
      { name: "Ingrid H.", flag: "🇳🇴", email: "ingrid.h***@gmail.com", detail: "Hard of hearing, Oslo", quote: "Group settings used to be where I zoned out and waited to go home. Now I actually participate. It is a completely different experience." },
      { name: "Youssef A.", flag: "🇲🇦", email: "youssef.a***@gmail.com", detail: "Hard of hearing, Casablanca", quote: "Family gatherings in Moroccan Arabic move fast. Captio AI keeps up with everyone around the table. I stopped dreading them." },
    ],
  },
  {
    slug: "restaurants",
    label: "Restaurants & Cafes",
    icon: "🍽️",
    tagline: "Have a real conversation through the noise.",
    description: "Background noise in restaurants and cafes makes speech harder to follow even for people with full hearing. For deaf and hard of hearing people, the combination of ambient noise, distance across the table, and no reliable lip-reading cues makes restaurants one of the hardest everyday environments. Captio AI captions whoever is speaking to you in real time — so you follow the conversation without straining through the noise.",
    howItHelps: [
      "Captions whoever is speaking across the table in real time",
      "Place your phone between you and no adjustment needed",
      "Works without needing to face the speaker directly",
      "60+ languages — for restaurants anywhere in the world",
    ],
    featureHighlights: [
      {
        slug: "live-captions",
        title: "Follow the conversation through the noise",
        bullets: [
          "Captions the person across the table in real time",
          "Works through typical restaurant background noise",
          "Place the phone between you — no adjustment needed",
          "No lip reading, no facing the speaker",
        ],
      },
      {
        slug: "live-translator",
        title: "Restaurants abroad or with foreign speakers",
        bullets: [
          "They speak their language — you read in yours",
          "For waitstaff, companions, or travel dining",
          "60+ languages, no setup",
          "Translates in real time as they speak",
        ],
      },
      {
        slug: "audio-transcription",
        title: "Transcribe any recorded conversation",
        bullets: [
          "Record and get the full conversation in writing",
          "Review anything you missed after the meal",
          "Organised by speaker",
          "Any language, any format",
        ],
      },
      {
        slug: "ai-summary",
        title: "Key points from any conversation",
        bullets: [
          "Important points extracted from any recording",
          "Useful for business lunches and important catch-ups",
          "Organised into clear sections",
          "Works on any saved recording",
        ],
      },
    ],
    subUseCases: [
      {
        icon: "🍽️",
        title: "Dinner with friends",
        description: "A loud restaurant table, multiple conversations at once, everyone facing different directions. Place Captio AI between you and follow whoever you want without having to ask anyone to repeat or turn toward you.",
      },
      {
        icon: "💼",
        title: "Business lunches",
        description: "Professional conversations over food — where losing a sentence about a proposal or a decision has real consequences. Captio AI captions in real time so you follow the discussion accurately.",
      },
      {
        icon: "☕",
        title: "Cafe catch-ups",
        description: "Quieter than a restaurant but rarely quiet enough. Background music, espresso machines, other conversations. Captio AI handles the ambient noise and captions whoever you are talking to.",
      },
      {
        icon: "🌍",
        title: "Restaurants abroad",
        description: "Ordering, asking about dishes, chatting with locals. Live Translator captions and translates waitstaff and companions in real time — so the language barrier does not stack on top of the hearing one.",
      },
      {
        icon: "🎂",
        title: "Celebrations and group meals",
        description: "Birthdays, anniversaries, group dinners. Multiple people, elevated noise, topics switching fast. Place Captio AI at the table and follow whoever is speaking without losing the celebration.",
      },
      {
        icon: "❤️",
        title: "Dates and one-on-one meals",
        description: "A meal where conversation matters and asking for repeats changes the dynamic. Place the phone between you and read the conversation naturally — without drawing attention to the accommodation.",
      },
    ],
    benefitsHeadline: "Built for the table — however noisy the room",
    benefits: [
      {
        title: "Follows the person across the table",
        description: "Point the microphone toward the person speaking and Captio AI captions them through the background noise. You do not need to face them, watch their lips, or lean in.",
      },
      {
        title: "Works through restaurant noise",
        description: "Restaurant noise averages 80 dBA — well above comfortable conversation level. Captio AI is built for these real environments, not quiet controlled rooms.",
      },
      {
        title: "Place it and forget it",
        description: "Put the phone on the table between you and the other person, microphone facing them. You glance at it as needed. No adjusting between sentences, no managing the setup.",
      },
      {
        title: "No asking for repeats during the meal",
        description: "Every word appears in real time. If you missed something, the caption is there — you do not need to stop the conversation and ask anyone to say it again.",
      },
      {
        title: "Any language",
        description: "For restaurants abroad, multilingual dining companions, or waitstaff who speak a different language. Live Translator captions and translates in real time with no manual setup.",
      },
      {
        title: "Discreet",
        description: "A phone on a restaurant table is unremarkable. Captio AI runs quietly, the screen faces you, and most dining companions adapt naturally once they understand what it does.",
      },
    ],
    challenge: {
      headline: "Restaurants are the hardest room in everyday life",
      paragraphs: [
        "Restaurant noise was ranked the top complaint among all diners in a Zagat survey — and that is among people with full hearing (Zagat). The average restaurant noise level is 80 dBA, compared to around 60 dBA for a normal conversation. For deaf and hard of hearing people, this is not a nuisance. It is the difference between following a conversation and not following it. Research on the impacts of hearing loss on social dining found that people with hearing loss disengage from restaurant dining at significantly higher rates — not because they do not want to go, but because the environment makes participation too costly (ScienceDirect, 2024).",
        "The noise compounds itself. When background noise rises above comfortable conversation levels, speakers involuntarily raise their voices — a phenomenon called the Lombard Effect (Scientific Reports, 2022). As the room gets louder, everyone speaks louder, which makes the room louder still. For a hearing person, this is mildly annoying. For a deaf or hard of hearing person, it turns an already difficult environment into one where speech comprehension breaks down entirely.",
        "The social cost is real. Eating out is where friendships are maintained, relationships are built, and important conversations happen. When a deaf or hard of hearing person reduces how often they go out — or attends but follows less and contributes less — the consequences extend beyond the meal. Research consistently links reduced social participation in dining settings to broader patterns of social isolation and the mental health outcomes that follow (PMC, 2023).",
        "Captio AI is built for the table. Place the phone between you and whoever you are talking to, point the microphone toward them, and read the conversation in real time through any level of background noise. Every course, every conversation, fully accessible.",
      ],
    },
    faqs: [
      { q: "Does Captio AI work in noisy restaurants?", a: "Yes. Captio AI handles typical restaurant-level background noise well. It focuses on the nearest speaker — the person across the table — and captions through ambient noise. Very loud environments may reduce accuracy slightly, but typical restaurant settings are handled accurately." },
      { q: "How do I position the phone at a restaurant table?", a: "Place it between you and the person you are talking to, microphone facing them. A small phone stand keeps it stable and angled for easy reading. You can glance at the screen naturally without making the setup conspicuous." },
      { q: "Does it work when talking to waitstaff?", a: "Yes. Hold or place the phone near whoever is speaking — the waiter explaining specials, a barista taking your order. Captions appear in real time so you follow the exchange without asking for repeats." },
      { q: "What about ordering from menus or asking questions?", a: "The same setup works. Hold the phone toward the server as they describe dishes or answer questions. If you want to confirm an order or clarify an allergy, you can read exactly what they said before responding." },
      { q: "What if the restaurant is abroad and people speak another language?", a: "Use Live Translator. The waiter or companion speaks their language — you read the translation in real time. Works across 60+ languages with no manual setup or switching." },
      { q: "Does it work for a date or a one-on-one meal?", a: "Yes. Place the phone on the table between you and the other person. It runs quietly and most people adapt naturally. You do not need to explain it unless you want to — a phone on a restaurant table draws little attention." },
      { q: "What about group meals with multiple people at the table?", a: "For a group meal, place the phone in the centre of the table. Captio AI follows whoever is loudest in the microphone's direction — in a seated group this tracks whoever is speaking most actively. For a one-on-one, point it directly toward the other person." },
      { q: "Does it work for outdoor dining?", a: "Yes. Outdoor patios and terraces are handled well. Wind noise at high levels may reduce accuracy, but typical outdoor dining settings work accurately — often better than loud indoor restaurants." },
      { q: "Does it affect the dining experience for the other person?", a: "Minimally. A phone on the table is unremarkable. Most companions adapt naturally once they see what Captio AI does — many find it interesting. It does not require the other person to change how they speak." },
      { q: "What about cafe settings with background music?", a: "Background music at typical cafe volumes is handled well. Very loud music close to the speaker may reduce accuracy slightly, but standard cafe ambient noise — espresso machines, other conversations, moderate music — does not prevent accurate captions." },
    ],
    reviews: [
      { name: "Elena V.", flag: "🇮🇹", email: "elena.v***@gmail.com", detail: "Hard of hearing, Rome", quote: "Italian restaurants are loud and the conversations move fast. I put Captio AI between me and my friend and have a real conversation for the first time in years." },
      { name: "Thomas K.", flag: "🇩🇪", email: "thomas.k***@gmail.com", detail: "Deaf, Hamburg", quote: "Going out used to mean nodding along and pretending I had caught everything. Now I actually follow what is being said. Going out is enjoyable again." },
      { name: "Mei L.", flag: "🇨🇳", email: "mei.l***@gmail.com", detail: "Hard of hearing, Shanghai", quote: "Background noise used to cut me off from conversations completely. Captio AI focuses on whoever I am talking to. The restaurant noise is just background." },
      { name: "Pablo G.", flag: "🇲🇽", email: "pablo.g***@gmail.com", detail: "Hard of hearing, Mexico City", quote: "Fast Mexican Spanish at a loud table — Captio AI handles it. I finally enjoy going out again rather than finding reasons to stay home." },
    ],
  },
  {
    slug: "traveling",
    label: "Traveling",
    icon: "✈️",
    tagline: "Navigate confidently. In any language, in any country.",
    description: "Airports, train stations, hotels, and unfamiliar cities rely on spoken announcements and verbal exchanges for nearly every important update. For deaf and hard of hearing travelers, a missed gate change, a misheard customs instruction, or a lost direction has real consequences with no graceful way to recover. Captio AI captions speech in 60+ languages so you navigate confidently wherever you travel.",
    howItHelps: [
      "Real-time captions of announcements, directions, and conversations",
      "Live Translator covers 60+ languages — no language barrier on top of the hearing one",
      "Works in airports, stations, hotels, taxis, and tourist sites",
      "Works anywhere with a mobile data or Wi-Fi connection",
    ],
    featureHighlights: [
      {
        slug: "live-captions",
        title: "Captions any spoken exchange, anywhere",
        bullets: [
          "Airport staff, hotel receptionists, taxi drivers",
          "Real time, word by word, as they speak",
          "Works through travel noise and accents",
          "No setup — open the app and point it",
        ],
      },
      {
        slug: "live-translator",
        title: "No language barrier, anywhere in the world",
        bullets: [
          "They speak their language — you read in yours",
          "60+ languages, no manual switching",
          "For customs, hotels, restaurants, and local transport",
          "Translates in real time as they speak",
        ],
      },
      {
        slug: "audio-transcription",
        title: "Transcribe any recorded content",
        bullets: [
          "Record a tour guide, a briefing, an important exchange",
          "Upload and get the full transcript to review",
          "Any language, any format",
          "Useful for travel information you want in writing",
        ],
      },
      {
        slug: "ai-summary",
        title: "Key travel information extracted",
        bullets: [
          "Instructions, directions, and key details from any transcript",
          "Organised into clear sections",
          "Useful after complex hotel check-ins or guided briefings",
          "Works on any saved recording",
        ],
      },
    ],
    subUseCases: [
      {
        icon: "✈️",
        title: "Airports and boarding",
        description: "Gate changes, boarding calls, security instructions. All communicated by PA announcement. Captio AI captions announcements and staff in real time so you never miss an update or a boarding call.",
      },
      {
        icon: "🚂",
        title: "Train stations and public transport",
        description: "Platform announcements, ticket office conversations, bus drivers confirming stops. Captio AI captions whoever is speaking — at a counter, over a PA, or from the seat next to you.",
      },
      {
        icon: "🏨",
        title: "Hotels and check-in",
        description: "Reception staff explaining room details, key card instructions, local recommendations. Place Captio AI on the counter and read every word of the check-in conversation without asking for repeats.",
      },
      {
        icon: "🗺️",
        title: "Navigating and asking for help",
        description: "Asking locals for directions, following a guide, getting information from tourist information centres. Live Translator captions and translates in real time so you understand the first time.",
      },
      {
        icon: "🛃",
        title: "Customs and immigration",
        description: "Officers who speak quickly, ask specific questions, and do not repeat. One of the highest-stakes exchanges in any trip. Captio AI captions every question in real time so you answer accurately.",
      },
      {
        icon: "🎭",
        title: "Tours and activities",
        description: "Guided tours, museum audio guides, excursion briefings. Captio AI captions the guide in real time or transcribes any recorded content so you follow the full experience wherever it takes you.",
      },
    ],
    benefitsHeadline: "Built for a world that announces everything by sound",
    benefits: [
      {
        title: "Captions any spoken exchange in real time",
        description: "Airport staff, hotel receptionists, taxi drivers, tour guides. Hold the phone toward whoever is speaking and read the captions — in any setting, in any country.",
      },
      {
        title: "60+ languages — no language barrier",
        description: "Live Translator captions and translates in real time. They speak their language — you read in yours. For every country, every language, no manual setup between interactions.",
      },
      {
        title: "Works anywhere with a data connection",
        description: "Wi-Fi or mobile data. A local SIM or roaming plan keeps Captio AI running in any country — airports, hotels, rural areas, and everywhere in between.",
      },
      {
        title: "Handles travel environments",
        description: "Noisy airports, busy stations, echoing hotel lobbies. Captio AI is built for real environments — not quiet controlled rooms. It captions through the ambient noise of travel.",
      },
      {
        title: "Discreet in any public setting",
        description: "Hold the phone or place it near the speaker. Captio AI runs quietly and draws no attention — useful in customs, immigration, and any formal travel interaction where discretion matters.",
      },
      {
        title: "Private by default",
        description: "Travel conversations — customs declarations, hotel bookings, personal exchanges — are never stored or shared. Audio is processed in real time and discarded immediately.",
      },
    ],
    challenge: {
      headline: "Travel relies on sound for everything that matters most",
      paragraphs: [
        "When flights are delayed, gates change, or boarding begins, these updates are communicated through audio announcements — and deaf and hard of hearing travelers have no reliable way to receive them (Deaf Friendly Consulting). The consequences are concrete: missed flights, unexpected gate changes, security instructions that go unheard. Unlike most communication barriers, the ones in airports and transport hubs are time-sensitive. Missing the announcement means missing the flight.",
        "The language barrier adds another layer. Traveling abroad means relying on a foreign language for customs declarations, hotel check-ins, street directions, and emergency information — interactions that are already difficult without a hearing impairment. Congress passed the FAA Reauthorization Act of 2024 requiring enhanced audio accessibility at airports by 2028 — but that deadline is still years away, and the gap exists now, in every airport, in every country that has not addressed it (FAA, 2024).",
        "At customs and immigration, the stakes are among the highest of any travel interaction. Officers speak quickly, ask precise questions, and do not repeat themselves. Getting a question wrong — because you misheard it — is not a minor inconvenience. At a hotel counter or a taxi rank, instructions that come too fast to follow mean wrong rooms, wrong addresses, and wasted time. The travel environment was designed around the assumption that every traveler can hear the PA, the officer, and the driver.",
        "Captio AI is built for travel as it actually is. Captions appear as airport staff, customs officers, and hotel receptionists speak. Live Translator handles any language in real time. Every announcement, every instruction, every conversation — accessible, wherever you are.",
      ],
    },
    faqs: [
      { q: "Does Captio AI work in foreign countries where people speak a different language?", a: "Yes. Use Live Translator to caption and translate speech in real time. A customs officer, hotel receptionist, or local giving directions — they speak their language, you read in yours. Works across 60+ languages." },
      { q: "Does Captio AI work for airport announcements?", a: "Yes. Hold your phone near the nearest PA speaker or announcement screen audio output. Captions appear in real time. In very noisy terminals, positioning the phone close to the speaker gives the cleanest signal." },
      { q: "Does Captio AI need Wi-Fi or can it use mobile data?", a: "Captio AI works on any active internet connection — Wi-Fi or mobile data. A local SIM or international roaming plan keeps it running in any country, including transit areas and rural regions." },
      { q: "Does it work at customs and immigration?", a: "Yes. Hold the phone toward the customs or immigration officer as they speak. Captions appear in real time so you follow every question accurately. Use Live Translator if the officer speaks a different language." },
      { q: "What if I need to communicate with someone who speaks no common language?", a: "Use Live Translator: they speak their language, you read the translation in real time. You can also type your response and show them the screen — useful in situations where spoken communication is not possible." },
      { q: "Does it work in taxis, rideshares, and local transport?", a: "Yes. Hold the phone toward the driver or transport staff. Captio AI captions whatever is said — route confirmations, fare questions, local directions — in real time." },
      { q: "What about on the plane?", a: "Captio AI requires an internet connection. On flights without Wi-Fi, it cannot caption in real time. For flights with Wi-Fi, it works normally. For offline use, record audio and transcribe it after landing using Audio Transcription." },
      { q: "Does it work at train stations and on metros?", a: "Yes. Platform announcements, ticket counter conversations, staff instructions — point the phone toward the audio source. For PA announcements, hold it close to the nearest speaker for the clearest signal." },
      { q: "Does it work during guided tours?", a: "Yes. Hold the phone toward the tour guide and read the captions as they speak. For recorded audio guides, point the phone toward the audio output. For longer tours, use the recording and transcription features to get a full written record of the tour." },
      { q: "What about hotel check-in conversations?", a: "Yes. Place the phone on the counter pointed toward the receptionist. Captio AI captions every word — room assignments, key instructions, local recommendations — so you follow the full check-in without asking for repeats." },
    ],
    reviews: [
      { name: "Kenji M.", flag: "🇯🇵", email: "kenji.m***@gmail.com", detail: "Hard of hearing, traveling in Europe", quote: "I travel solo with hearing loss. Live Translator lets me navigate any country without a language barrier. I have not missed a single gate or announcement." },
      { name: "Sophie D.", flag: "🇫🇷", email: "sophie.d***@gmail.com", detail: "Deaf, traveling in Japan", quote: "Japan was the trip I had been putting off because of the language. Captio AI handled every airport announcement, hotel check-in, and restaurant order. It made the trip possible." },
      { name: "Carlos M.", flag: "🇧🇷", email: "carlos.m***@gmail.com", detail: "Hard of hearing, São Paulo", quote: "I used to panic at airports — gate changes announced by PA with nothing visual. Captio AI covers every announcement. I travel without the anxiety now." },
      { name: "Fatou S.", flag: "🇸🇳", email: "fatou.s***@gmail.com", detail: "Hard of hearing, Dakar", quote: "I traveled through four European countries without speaking any of the local languages. Live Translator was my guide for the whole trip." },
    ],
  },
  {
    slug: "conferences",
    label: "Conferences & Events",
    icon: "🎤",
    tagline: "Follow every speaker. From any seat.",
    description: "At conferences, speakers are far away, acoustics are often poor, and you cannot ask for a repeat in front of a crowd. For deaf and hard of hearing attendees, conferences are among the most inaccessible public environments — even venues with hearing loops cover only part of the space and leave Q&A sessions, networking, and breakouts uncovered. Captio AI gives you a live transcript of every speaker from any seat.",
    howItHelps: [
      "Live captions of every speaker — no loop system or captioning service required",
      "Works in conference halls, seminar rooms, and outdoor events",
      "Point toward the nearest speaker or PA output for best accuracy",
      "60+ languages — for international and multilingual conferences",
    ],
    featureHighlights: [
      {
        slug: "live-captions",
        title: "Follow every speaker from any seat",
        bullets: [
          "Point toward the PA or nearest speaker output",
          "Handles keynotes, panels, and Q&A sessions",
          "Works in large halls, seminar rooms, and outdoor venues",
          "No hearing loop or venue infrastructure required",
        ],
      },
      {
        slug: "live-translator",
        title: "International and multilingual conferences",
        bullets: [
          "Speakers present in any language — you read in yours",
          "60+ languages, no switching between sessions",
          "For global conferences, international panels, and foreign keynotes",
          "Translates in real time as each speaker talks",
        ],
      },
      {
        slug: "audio-transcription",
        title: "Full transcript of any session",
        bullets: [
          "Record any talk or session and get the complete written transcript",
          "Review content you missed or want to study after the event",
          "Organised by speaker",
          "Searchable, copyable, shareable",
        ],
      },
      {
        slug: "ai-summary",
        title: "Key takeaways from any session",
        bullets: [
          "Main points and insights extracted from any session transcript",
          "Useful for dense technical talks and keynotes",
          "Organised into clear sections",
          "Works on any saved conference recording",
        ],
      },
    ],
    subUseCases: [
      {
        icon: "🎤",
        title: "Keynotes and main stage talks",
        description: "Speakers far away, poor room acoustics, no way to ask for a repeat. Point Captio AI toward the nearest PA speaker and read every word from any seat in the venue.",
      },
      {
        icon: "🔬",
        title: "Academic and research conferences",
        description: "Dense technical content, fast-speaking presenters, unfamiliar terminology. Captio AI captions in real time and transcribes for later review — so you follow the argument and keep a record.",
      },
      {
        icon: "💼",
        title: "Industry and professional events",
        description: "Panel discussions, product launches, industry briefings. Content that directly affects your work. Captio AI ensures you follow every speaker and miss nothing professionally relevant.",
      },
      {
        icon: "📋",
        title: "Workshops and breakout sessions",
        description: "Smaller groups, interactive discussions, multiple voices. Place Captio AI on the table and follow every contribution — including the ones from the back of the room.",
      },
      {
        icon: "🤝",
        title: "Networking and informal sessions",
        description: "The hallway conversations, lunch breaks, and side discussions that often carry the most useful content. Captio AI works in these unstructured settings exactly as it does in the main hall.",
      },
      {
        icon: "🌍",
        title: "International and multilingual events",
        description: "Speakers presenting in different languages, panels that switch mid-session, networking with attendees from other countries. Live Translator handles any language combination in real time.",
      },
    ],
    benefitsHeadline: "Built for the room where you cannot ask anyone to repeat",
    benefits: [
      {
        title: "Live captions from any seat",
        description: "Point the phone toward the nearest PA output or speaker. Captio AI captions whoever is presenting in real time — from the front row or the back of a large conference hall.",
      },
      {
        title: "Works without venue infrastructure",
        description: "No hearing loop, no captioning service, no advance booking required. Captio AI works independently via microphone — whether or not the venue has provided any accessibility infrastructure.",
      },
      {
        title: "Covers what official captioning does not",
        description: "Official captioning, where it exists, typically covers the main stage only. Q&A sessions, workshops, breakouts, and networking are usually left uncaptioned. Captio AI covers all of it.",
      },
      {
        title: "Record and review after",
        description: "Record any session and upload it to Audio Transcription for a full written record. Use AI Summary to extract key takeaways — useful for dense technical content you want to process at your own pace.",
      },
      {
        title: "60+ languages",
        description: "For international conferences, foreign-language keynotes, or multilingual panels. Live Translator captions and translates in real time across 60+ languages with no manual switching between speakers.",
      },
      {
        title: "Works for networking too",
        description: "The conversations in hallways and at lunch matter as much as the sessions. Captio AI works in any setting — informal, noisy, unstructured — the same way it works in the main hall.",
      },
    ],
    challenge: {
      headline: "Most conferences are still inaccessible — and most attendees do not know it",
      paragraphs: [
        "Conferences and professional events rely almost entirely on speech for their content — keynotes, panels, Q&A, networking. For the 430 million people worldwide with disabling hearing loss (WHO), this represents a significant and largely unaddressed access gap. Research on deaf and hard of hearing inclusion in professional organisations found that even in fields that have made progress on accessibility, barriers persist — particularly around poor audio quality in conference rooms and the limitations of remote captioning services (PMC, 2021).",
        "Where captioning is provided, it typically covers the main programme only. Q&A sessions — where a single microphone is passed around a large room — frequently result in gaps. Breakout sessions, workshops, and networking are almost never covered. The parts of a conference that require the most active communication are the parts with the least accessibility infrastructure. Most organisers are not aware of this gap. Most attendees with hearing loss are (PMC, 2021).",
        "The professional consequences are real. Conferences are where ideas circulate, where collaborations form, where careers develop. A deaf or hard of hearing professional who attends a conference and misses half the content — because the room acoustics were poor, the PA was unclear, or the Q&A microphone was too far away — is not getting the same professional value from the same event. The registration fee was equal. The access was not.",
        "Captio AI is built to close that gap. Point the phone toward the PA output. Read every keynote, every panel, every Q&A answer in real time. Record any session and get the full transcript. Follow the networking conversations in the hallway. Every part of the conference, fully accessible — from any seat, in any language.",
      ],
    },
    faqs: [
      { q: "Does Captio AI work in large conference halls?", a: "Yes. In a venue with a PA system, point your phone's microphone toward the nearest speaker output. The PA audio gives a clear, consistent signal for accurate captions from any seat. In smaller rooms without PA, place the phone on your desk facing the front." },
      { q: "How do I position the phone during a conference session?", a: "Point it toward the nearest PA speaker or hold it in the direction of the presenter. A small stand keeps it stable. For workshops and breakouts, place it on the table in front of you facing the most active speaker." },
      { q: "Does it work for panel discussions with multiple speakers?", a: "Yes. Captio AI follows whoever is speaking — the dominant voice at any moment. In a panel, it transitions between panellists naturally. It handles the fast speaker switches typical of panel Q&As accurately." },
      { q: "Can I get a transcript of a session afterwards?", a: "Yes. Record the session audio on your phone and upload it to Audio Transcription. You get a full written transcript of the entire session — useful for revisiting dense technical content or sharing with colleagues." },
      { q: "Does it work for international conferences where speakers present in other languages?", a: "Yes. Use Live Translator. Speakers present in their language — you read in yours in real time. Switch between Live Captions for sessions in your language and Live Translator for foreign-language presentations without any manual setup." },
      { q: "Does it work for Q&A sessions where audience members ask questions?", a: "Yes, when the audience member has a microphone or is close enough to the phone. If audience questions are asked without amplification in a large room, accuracy depends on proximity. For the speaker's answers — which are typically amplified — captions are fully accurate." },
      { q: "Does Captio AI replace hearing loop systems?", a: "Captio AI works independently of any venue infrastructure — it does not require a hearing loop, a captioning service, or any advance arrangement. If a venue has a loop, that may provide clean direct audio. If it does not, Captio AI works via microphone alone." },
      { q: "Does it work for networking and informal conference conversations?", a: "Yes. For one-on-one or small group networking, hold the phone toward whoever is speaking. For noisy conference receptions and hallway conversations, it works the same way as in any group setting." },
      { q: "Does it work for outdoor events and stages?", a: "Yes. For outdoor events with PA systems, point the phone toward the nearest speaker output. For smaller outdoor settings, hold it toward the presenter. Wind noise at high levels may reduce accuracy but typical outdoor event conditions are handled well." },
      { q: "What about workshops where participants contribute from around the room?", a: "Place the phone on the table in front of you, facing the most active participants. Captio AI follows whoever is loudest in the microphone's direction. For facilitated discussions with a clear leader, point it toward the facilitator." },
    ],
    reviews: [
      { name: "Rachel F.", flag: "🇬🇧", email: "rachel.f***@gmail.com", detail: "Hard of hearing, London", quote: "I go to industry conferences regularly. Captio AI gives me better captions than most official captioning I have seen — and it covers the networking and breakouts that official captioning never does." },
      { name: "Henrik J.", flag: "🇩🇰", email: "henrik.j***@gmail.com", detail: "Deaf, Copenhagen", quote: "International conferences in English are now fully accessible to me. Captio AI captions every speaker, every panel, every Q&A — from any seat." },
      { name: "Aisha B.", flag: "🇿🇦", email: "aisha.b***@gmail.com", detail: "Hard of hearing, Cape Town", quote: "South African conferences sometimes provide SASL interpreters for the main stage. Captio AI covers everything else — and everything else is most of the conference." },
      { name: "Vera N.", flag: "🇷🇴", email: "vera.n***@gmail.com", detail: "Hard of hearing, Bucharest", quote: "I attended a multilingual conference last year with speakers in three languages. Live Translator followed every one of them. I followed every session." },
    ],
  },
  {
    slug: "tv-media",
    label: "TV & Media",
    icon: "📺",
    tagline: "Watch anything. Without depending on subtitles.",
    description: "Built-in subtitles are often wrong, delayed, or missing entirely — especially for live TV, streaming content in foreign languages, or user-generated content. For deaf and hard of hearing people, the quality of subtitle provision varies enormously and unpredictably across platforms and content types. Captio AI captions whatever is playing in real time, on any screen, regardless of whether subtitles exist.",
    howItHelps: [
      "Point your phone toward the TV, laptop, or device speaker",
      "Real-time captions for any content — live TV, streaming, YouTube",
      "No subtitle file needed — captions directly from the audio",
      "60+ languages — for content in any language",
    ],
    featureHighlights: [
      {
        slug: "live-captions",
        title: "Captions anything playing in real time",
        bullets: [
          "Point the phone toward the speaker and read along",
          "Works on any TV, laptop, tablet, or phone",
          "No subtitle file required — captions from the audio directly",
          "Faster than pre-generated subtitles for live content",
        ],
      },
      {
        slug: "live-translator",
        title: "Watch content in any language",
        bullets: [
          "Foreign films, foreign news, foreign YouTube — all translated in real time",
          "They speak their language — you read in yours",
          "60+ languages, no setup",
          "Works as content plays",
        ],
      },
      {
        slug: "audio-transcription",
        title: "Full transcript of any recording",
        bullets: [
          "Upload a recording and get the complete written transcript",
          "For lectures, podcasts, talks, or any long-form content",
          "Searchable and copyable",
          "Any language, any format",
        ],
      },
      {
        slug: "ai-summary",
        title: "Key points from any content",
        bullets: [
          "Main ideas and takeaways from any transcript",
          "Useful for news, documentaries, and long-form content",
          "Organised into clear sections",
          "Works on any saved recording",
        ],
      },
    ],
    subUseCases: [
      {
        icon: "📺",
        title: "Live TV — news, sport, events",
        description: "Pre-generated subtitles lag behind live content. Captio AI captions in real time so you read what is being said as it is said — not a sentence behind.",
      },
      {
        icon: "🎬",
        title: "Streaming content",
        description: "Netflix, Disney+, Apple TV, and every other platform — subtitles vary in quality, accuracy, and availability. Captio AI works as a consistent fallback for any content that fails to deliver.",
      },
      {
        icon: "📱",
        title: "YouTube and social media",
        description: "Auto-generated captions on YouTube are often inaccurate. Social media video rarely has any. Captio AI captions whatever is playing — on any platform, on any device.",
      },
      {
        icon: "🌍",
        title: "Foreign-language content",
        description: "A film in French, a documentary in Japanese, a news broadcast in Arabic. Live Translator captions and translates in real time as content plays — so language is never a barrier to watching.",
      },
      {
        icon: "🎭",
        title: "Cinema",
        description: "Not every showing has open captions. Captio AI gives you real-time captions at any cinema showing — hold the phone near the audio output and read along discreetly.",
      },
      {
        icon: "🎧",
        title: "Podcasts and audio content",
        description: "Most podcasts have no transcripts. Hold Captio AI near the audio output or upload a recording. Get the full content in writing — without depending on the creator to have provided it.",
      },
    ],
    benefitsHeadline: "Built for the content that subtitles fail",
    benefits: [
      {
        title: "Captions any content in real time",
        description: "Point the phone toward any speaker — TV, laptop, tablet, cinema screen. Captio AI captions whatever is playing, regardless of whether that platform provides subtitles.",
      },
      {
        title: "Faster than built-in subtitles for live content",
        description: "Pre-generated subtitles lag behind live TV by several seconds. Captio AI captions in real time — so you read what is being said as it is being said.",
      },
      {
        title: "Works on any screen or device",
        description: "No integration required. Point the phone toward the audio source — the same approach works for a large TV, a laptop screen, a cinema, or a phone held at arm's length.",
      },
      {
        title: "Any language, translated in real time",
        description: "For foreign-language content, switch to Live Translator. It translates as content plays — so a French film, a German documentary, or a Japanese series all become watchable.",
      },
      {
        title: "No subtitle file needed",
        description: "Captio AI captions from the audio directly. No subtitle file, no platform support, no creator requirement. If audio plays, Captio AI can caption it.",
      },
      {
        title: "More accurate than auto-generated captions",
        description: "The industry average for AI-generated subtitles is a 10–15% word error rate — roughly 1 in 10 words wrong (3Play Media). Captio AI is built for accuracy in real-world audio conditions.",
      },
    ],
    challenge: {
      headline: "Subtitles exist. That does not mean they work.",
      paragraphs: [
        "Research from the European Commission found that subtitles as currently provided on television are not sufficient to give hearing-impaired viewers full comprehension of content. One study found that only 2% of participants watching an animation with standard subtitles understood what it was about — compared to 65.5% of participants who received improved subtitles (EurekAlert). The problem is not the absence of subtitles. It is the quality of the ones that exist.",
        "The industry average for AI-generated transcription and subtitling is a 10–15% word error rate — meaning roughly 1 in 10 words is wrong (3Play Media). For hearing viewers watching with captions for preference, this is a minor inconvenience. For deaf and hard of hearing viewers who depend on captions to follow the content at all, a 10% error rate means a meaningful portion of every sentence is corrupted. The subtitle is there. It just does not say what was actually said.",
        "Live TV is worst of all. Pre-generated subtitles cannot exist for content that has not been produced yet — so live news, sport, and events rely on real-time automated subtitling that frequently lags by several seconds and degrades in accuracy during fast speech. For a deaf or hard of hearing viewer watching a live event, the subtitles describe what happened several seconds ago. For foreign-language content, social media video, and most user-generated content, subtitles are often absent entirely.",
        "Captio AI does not depend on the platform, the creator, or the subtitle system. Point the phone toward any audio source and read captions in real time — faster than live TV subtitles, more accurate than auto-generated captions, and available for any content on any screen.",
      ],
    },
    faqs: [
      { q: "How do I use Captio AI with my TV?", a: "Point your phone's microphone toward the TV's speakers. Captio AI captions whatever is playing in real time. Turning the TV volume up slightly gives the cleanest audio for accurate captions." },
      { q: "Does Captio AI work for live TV — news, sport, live events?", a: "Yes. Captio AI captions in real time — unlike pre-generated subtitles, which lag behind live content by several seconds. For news, sport, and live events, this is one of the most significant improvements over built-in subtitles." },
      { q: "Does it work for streaming platforms like Netflix, Disney+, or Apple TV?", a: "Yes. Point the phone toward the device speaker. Captio AI captions whatever is playing regardless of whether the platform provides subtitles and regardless of their quality." },
      { q: "Does it work for foreign-language content?", a: "Yes. Use Live Translator to caption and translate foreign-language content in real time. A French film, a Spanish news broadcast, a Japanese series — Captio AI translates as the content plays." },
      { q: "Can I use Captio AI in a cinema?", a: "Yes. Hold your phone near the audio output or rest it on your knee facing the screen's speakers. In a cinema with good sound, Captio AI produces accurate real-time captions. Dim the screen and hold it low to be considerate to others." },
      { q: "Does it work for YouTube and social media video?", a: "Yes. YouTube auto-captions are often inaccurate. Social media video rarely has any captions at all. Point Captio AI toward the device speaker and read accurate captions in real time for any video on any platform." },
      { q: "Does it work for podcasts and audio-only content?", a: "Yes. Hold the phone near the podcast audio output, or record the episode and upload it to Audio Transcription for a full written transcript. Either approach works — live captioning or post-transcription depending on your preference." },
      { q: "Does the TV volume affect accuracy?", a: "A moderate volume level gives the cleanest signal. Very low volume may reduce accuracy. Turning the volume up slightly when using Captio AI gives the best results — you do not need the sound for yourself, just a clean signal for the microphone." },
      { q: "Does it work on a laptop or tablet?", a: "Yes. The same approach works on any device. Point the phone's microphone toward the laptop or tablet speaker. Captio AI captions whatever is playing in real time." },
      { q: "How is Captio AI better than the built-in subtitles on my TV or streaming service?", a: "Built-in subtitles lag behind live content, are often inaccurate, and are absent for many content types. Captio AI captions in real time from the audio directly — no lag for live content, no dependence on platform subtitle quality, and available for any content regardless of whether subtitles exist." },
    ],
    reviews: [
      { name: "Jonathan W.", flag: "🇺🇸", email: "jonathan.w***@gmail.com", detail: "Hard of hearing since childhood, Boston", quote: "Netflix subtitles are often wrong or lag by several seconds. Captio AI gives me captions that match what is actually being said, in real time." },
      { name: "Emilie C.", flag: "🇫🇷", email: "emilie.c***@gmail.com", detail: "Hard of hearing, Lyon", quote: "French live news with Captio AI. The built-in subtitles were always several seconds behind. Captio AI is right there with what is being said." },
      { name: "Björn A.", flag: "🇸🇪", email: "bjorn.a***@gmail.com", detail: "Deaf, Stockholm", quote: "I use Captio AI for any content that does not have reliable subtitles. That covers most of what I watch — news, YouTube, anything live." },
      { name: "Hyun J.", flag: "🇰🇷", email: "hyun.j***@gmail.com", detail: "Hard of hearing, Seoul", quote: "Korean streaming has reasonable subtitles. For live news, YouTube, and foreign shows, Captio AI fills the gap completely." },
    ],
  },
  {
    slug: "deaf-hoh-communication",
    label: "Communicating with Deaf & HoH",
    icon: "🤟",
    tagline: "Make every conversation work — for both sides.",
    heroSubtitle: "For hearing people who want to communicate with a deaf or hard of hearing person.",
    headingLabel: "communicating with deaf & HoH",
    description: "You speak naturally. Captio AI makes sure the deaf or hard of hearing person next to you reads every word — in real time, without anyone having to adjust, slow down, or type anything out.",
    howItHelps: [
      "You speak naturally — no training or adjustment needed",
      "Your words appear on their screen as you say them",
      "Works at home, at work, in any social setting",
      "No sign language required from either side",
    ],
    featureHighlights: [
      {
        slug: "live-captions",
        title: "You speak. They read.",
        bullets: [
          "Your words appear on their screen word by word",
          "No sign language required from you",
          "Works at home, at work, anywhere",
          "Any accent, any pace",
        ],
      },
      {
        slug: "live-translator",
        title: "When language is also a barrier",
        bullets: [
          "You speak your language, they read in theirs",
          "Translates in real time as you speak",
          "60+ languages, no setup",
          "Handles mid-sentence switches",
        ],
      },
      {
        slug: "audio-transcription",
        title: "Save the conversation for them",
        bullets: [
          "Record and transcribe any exchange",
          "They can review everything at their own pace",
          "Organised by speaker",
          "Any length, any format",
        ],
      },
      {
        slug: "ai-summary",
        title: "Make sure nothing important was missed",
        bullets: [
          "Key points extracted from any transcript",
          "Useful after appointments, meetings, or important conversations",
          "Organised into clear sections",
          "Works on any saved recording",
        ],
      },
    ],
    subUseCases: [
      {
        icon: "👨‍👩‍👧",
        title: "Family conversations",
        description: "Dinners, catch-ups, family gatherings. You speak at your normal pace and your deaf or hard of hearing family member reads everything in real time — no need to slow down or repeat yourself.",
      },
      {
        icon: "💼",
        title: "As a hearing colleague",
        description: "Desk conversations, quick questions, hallway chats. The informal exchanges that make up most of a working day. You talk normally and Captio AI makes sure your deaf or hard of hearing colleague follows every word.",
      },
      {
        icon: "❤️",
        title: "Partners and relationships",
        description: "When your partner is deaf or hard of hearing and you are not. You speak naturally, they read. No more typing on phones between you, no more frustration on either side.",
      },
      {
        icon: "🏠",
        title: "Living together",
        description: "Everyday home life — questions across the room, conversations over the TV, morning exchanges. Captio AI covers the low-stakes moments that add up to connection over time.",
      },
      {
        icon: "🤝",
        title: "Introducing someone new",
        description: "When a deaf or hard of hearing person meets someone who has never communicated with them before. You set up Captio AI and the conversation starts without any awkward briefing.",
      },
      {
        icon: "👥",
        title: "Mixed group settings",
        description: "Groups where some people are deaf or hard of hearing and some are not. Captio AI captions whoever is speaking so every member of the group is fully included.",
      },
    ],
    benefitsHeadline: "You talk. They follow. No adjustment needed.",
    benefits: [
      {
        title: "You speak naturally",
        description: "No slowing down, no special phrasing, no training required. Captio AI handles everything — you just talk the way you always do.",
      },
      {
        title: "They read as you speak",
        description: "Your words appear on their screen word by word while you are still talking. Not a summary after — the full sentence, in real time.",
      },
      {
        title: "Works wherever you both are",
        description: "Living rooms, offices, restaurants, social gatherings. No venue setup, no special conditions. Captio AI works anywhere you have a conversation.",
      },
      {
        title: "No sign language from either side",
        description: "You do not need to learn anything new. Neither do they. Captio AI bridges the gap without requiring any change to how either of you communicates.",
      },
      {
        title: "Works with how you actually speak",
        description: "Fast, accented, casual. Captio AI handles real speech — not just slow, clear dictation. You do not need to perform clarity for it to work.",
      },
      {
        title: "Private by default",
        description: "Your conversations are never recorded, stored, or shared. Audio is processed in real time and discarded immediately — nothing is kept.",
      },
    ],
    challenge: {
      headline: "The adjustment burden always falls on the wrong side",
      paragraphs: [
        "Between 90 and 97% of deaf children are born to hearing parents with little or no experience of sign language — which means the communication gap starts at home, before anywhere else (BMC Public Health, 2025). The people closest to a deaf or hard of hearing person are often the least equipped to communicate with them. Not because they do not care. Because nobody showed them how.",
        "A 2025 survey found that 83% of hard of hearing respondents experienced frustration when trying to communicate with family or friends (PR Newswire, 2025). Family and friends — not strangers, not officials. The people trying hardest to connect are creating the most friction, without realising it. That gap does real damage to relationships over time.",
        "The adjustment almost always falls on the deaf or hard of hearing person. They ask for repeats. They position themselves to lip-read. They piece together what they missed and hope they got it right. Meanwhile, you speak normally, unaware that what felt like an easy conversation was, for them, a sustained act of effort. That asymmetry is the problem — and it is one you can fix.",
        "Captio AI is built to remove it. You speak naturally. The deaf or hard of hearing person next to you reads in real time. No training required, no adjustment needed, no burden placed on either side. A conversation that works for both of you — which is all it was ever supposed to be.",
      ],
    },
    faqs: [
      { q: "Does the hearing person need to do anything differently?", a: "No. The hearing person speaks naturally at their normal pace. They do not need to slow down, write things out, or face a particular direction. Captio AI captions their speech in real time so the deaf or hard of hearing person reads along." },
      { q: "Is Captio AI a replacement for sign language?", a: "No. Captio AI captions spoken speech in real time — it does not translate or teach sign language. It is a practical bridge for situations where a hearing person speaks and a deaf or hard of hearing person needs to read what was said, without requiring sign language from either side." },
      { q: "Does it work for family conversations?", a: "Yes. Family settings — dinners, catch-ups, gatherings — are where most deaf and hard of hearing people feel the communication gap most. Captio AI captions whoever is speaking so nothing gets missed, without requiring anyone to change how they communicate." },
      { q: "Can I use it with a deaf or hard of hearing colleague at work?", a: "Yes. Place the phone on the desk between you, pointed toward yourself as you speak. It handles desk-side questions, corridor conversations, and informal exchanges — the everyday workplace moments that are hardest to accommodate formally." },
      { q: "What if both people in the conversation are deaf or hard of hearing?", a: "If both people communicate through speech, each can use Captio AI on their own device to caption the other simultaneously. If both primarily use sign language, Captio AI is not the right tool for that conversation." },
      { q: "Do I need to tell the deaf or hard of hearing person I am using it?", a: "It is worth mentioning — they will need to look at the screen to read the captions. Most people find it immediately natural once they understand what it does. A brief explanation takes seconds and removes any awkwardness." },
      { q: "What if I speak quickly or have a strong accent?", a: "Captio AI handles natural speech, including fast speakers and regional accents. You do not need to slow down or enunciate for it to caption you accurately." },
      { q: "Can I use it on a phone or video call with a deaf or hard of hearing person?", a: "For calls, the deaf or hard of hearing person should use Captio AI on their end — they put the call on speaker and Captio AI captions your voice in real time. You do not need to do anything differently on your side." },
      { q: "Is it appropriate to use without telling the other person?", a: "Yes. Captio AI runs quietly on your phone and can be used discreetly. Audio is processed in real time and discarded immediately — nothing is recorded. Many people choose to mention it; others do not. Both are valid." },
      { q: "Does the conversation need to happen in a quiet room?", a: "No. Captio AI is designed for real environments — living rooms with background TV, busy workplaces, noisy social settings. Moderate background noise does not prevent accurate captioning." },
    ],
    reviews: [
      { name: "Tom A.", flag: "🇬🇧", email: "tom.a***@gmail.com", detail: "Hearing, partner is deaf, Manchester", quote: "My partner is deaf. Captio AI means I can just talk normally and she reads everything. No more typing on phones between us." },
      { name: "Claire D.", flag: "🇫🇷", email: "claire.d***@gmail.com", detail: "Hearing, mother of deaf son, Lyon", quote: "My son has been deaf since birth. Captio AI is the first thing that lets me just speak to him without both of us working around it." },
      { name: "Marcus R.", flag: "🇩🇪", email: "marcus.r***@gmail.com", detail: "Hearing, works with deaf colleague, Hamburg", quote: "My colleague is hard of hearing. I used to slow down and over-enunciate which felt patronising. Now I just talk normally and he reads along." },
      { name: "Sara J.", flag: "🇸🇪", email: "sara.j***@gmail.com", detail: "Hearing, best friend is hard of hearing, Stockholm", quote: "I set up Captio AI before we meet and forget it is even there. My friend gets everything. We finally just have normal conversations." },
    ],
  },
];

export function getUseCaseBySlug(slug: string): UseCase | undefined {
  return useCases.find((uc) => uc.slug === slug);
}
