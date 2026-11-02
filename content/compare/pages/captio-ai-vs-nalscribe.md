---
title: "Captio AI vs NALscribe"
description: "Captio AI vs NALscribe, the free caption app from NAL, Australia's public hearing research lab: Android, offline mode, auto-erase, translation and price."
kind: versus
apps: [captio-ai, nalscribe]
rows: [freePlan, price, accessibilityFunding, platforms, deviceRequirements, offline, privacy, account, roomCaptions, display, saveTranscripts, export, languages, translation, speakerLabels, voiceNames, speakerDirection, soundAlerts, summaries, fileUpload]
published: 2026-11-02
updated: 2026-11-02
answer: "Pick NALscribe if you run a clinic, reception or enquiry counter, or just want free captions with no limit on an iPhone or iPad with a recent iOS: it works offline, NAL collects no data, and it can wipe the screen 20 seconds after speech stops. Pick Captio AI if you use Android, need to know who is talking (by name on iPhone), want everything translated as it is spoken, or want recordings kept with their audio and turned into summaries."
picks:
  - app: nalscribe
    text: "You are setting up a shared iPad at a counter or for appointments, want captions that cost nothing and run offline, or want an app from a public research body that collects no data."
  - app: captio-ai
    text: "You're on Android or your iPhone is stuck below iOS 26.6, you follow group conversations, you want every word translated live, or you want to keep and summarise what was said."
differences:
  - title: "Is NALscribe on Android in Australia?"
    text: "No. NAL says the ongoing fees Google and Microsoft charge for their speech-to-text keep NALscribe off Android and Windows, and a Google Play search in Australia finds nothing. Captio AI publishes on both the App Store and Google Play."
    sources: [nalscribe:platforms, captio-ai:platforms]
  - title: "Why is NALscribe free, and who pays for it?"
    text: "NAL, the research arm of Hearing Australia, builds it with Australian Government money, so every feature is free with unlimited minutes. Captio AI has no public funding behind it: once the 100 free credits a day run out, Captio AI Plus is US$14.99 monthly or US$79.99 yearly on the US App Store (October 2026), and there is no free trial."
    sources: [nalscribe:accessibilityFunding, nalscribe:freePlan, captio-ai:accessibilityFunding, captio-ai:freePlan, captio-ai:price]
  - title: "Does NALscribe work offline in a rural clinic with no signal?"
    text: "Yes, once that language has been downloaded, which needs internet and about 10 minutes the first time; NAL notes that online mode is a little more accurate. Captio AI's Live Captions need a network, so in a dead zone it records the appointment and produces the transcript when coverage returns."
    sources: [nalscribe:offline, captio-ai:offline]
  - title: "Can NALscribe translate a whole conversation?"
    text: "Not as it is spoken. You highlight words or phrases in the transcript and get a written and spoken translation, in 12 languages. Captio AI's Live Translator turns every sentence into the other language as people talk, across 60+ languages, and has a two-way mode for both sides of the desk."
    sources: [nalscribe:translation, captio-ai:translation, captio-ai:languages]
  - title: "Can NALscribe tell speakers apart in a family or team conversation?"
    text: "Not in the iPhone and iPad app. NAL's Apple Vision Pro prototype, NALscribe AR, placed each speaker's captions next to them, but NAL calls it a finished proof of concept and it isn't on the App Store. Captio AI marks each speaker from a single phone; Recognize Voices (iPhone) writes the names of people you've saved, and Speaker Direction, on an iPhone 16 or newer lying flat, grows a wave at the edge nearest the voice."
    sources: [nalscribe:s9, nalscribe:s11, captio-ai:speakerLabels, captio-ai:voiceNames, captio-ai:speakerDirection]
  - title: "What happens to the words when the session ends?"
    text: "With NALscribe you choose: auto-erase wipes the screen 20 or 60 seconds after speech stops and offers no Save, or you save the transcript on the device only. Online, audio goes to Apple's speech server, and NAL collects nothing. Captio AI files each session, audio included, in a library synced to your account, and promises never to train AI models on your content."
    sources: [nalscribe:saveTranscripts, nalscribe:privacy, captio-ai:saveTranscripts, captio-ai:privacy]
better:
  nalscribe:
    - text: "Unlimited minutes and every feature cost nothing, with nothing sold in the app; Captio AI caps its free tier at 100 free credits a day."
      sources: [nalscribe:freePlan, captio-ai:freePlan]
    - text: "Offline mode runs on the device once a language is downloaded, and then nothing is sent over the internet. Captio AI's Live Captions need a connection."
      sources: [nalscribe:offline, captio-ai:offline]
    - text: "Auto-erase clears the screen 20 or 60 seconds after speech stops, so the next customer at a counter never sees the last conversation. NAL trialled the app in hearing clinics across Australia."
      sources: [nalscribe:privacy, nalscribe:s5]
    - text: "No account is described, and the App Store privacy section says NAL collects no data from the app."
      sources: [nalscribe:account]
    - text: "It is set up for counters: very large captions, a dark background, a choice of microphone including Bluetooth or desk mics, and upside-down captions so the bottom microphone points at the talker."
      sources: [nalscribe:display, nalscribe:roomCaptions]
  captio-ai:
    - text: "It runs on Android and on iPhones from iOS 15.1. NALscribe is Apple-only and now needs iOS 26.6."
      sources: [captio-ai:platforms, captio-ai:deviceRequirements, nalscribe:platforms, nalscribe:deviceRequirements]
    - text: "At a barbecue or a team meeting it labels each speaker; Recognize Voices (iPhone) names the people you saved, and Speaker Direction (iPhone 16 and later) shows the side a voice comes from."
      sources: [captio-ai:speakerLabels, captio-ai:voiceNames, captio-ai:speakerDirection]
    - text: "Live Translator translates everything as it is spoken, in 60+ languages, with a two-way mode."
      sources: [captio-ai:translation, captio-ai:languages]
    - text: "Recordings keep their audio and sync to your account, you can upload audio or video files, and AI Summary turns a long appointment into key points and to-dos."
      sources: [captio-ai:saveTranscripts, captio-ai:fileUpload, captio-ai:summaries]
    - text: "In a waiting room, Recognize Sounds (iPhone and iPad) marks a phone ringing or a knock in the captions while Captio AI records, so the text shows more than speech. NALscribe's pages describe no sound alerts."
      sources: [captio-ai:soundAlerts]
situations:
  - icon: work
    title: "A reception or enquiry desk"
    pick: nalscribe
    text: "Put NALscribe on a counter iPad with large text and the 20-second auto-erase, and each customer sees only their own conversation. It is free and needs no account."
  - icon: doctor
    title: "An audiology or GP appointment"
    pick: both
    text: "NALscribe on the clinic's iPad was trialled in hearing clinics across Australia. Captio AI on your own phone keeps the appointment with its audio and an AI Summary to read later."
    link: /use-cases/doctor-appointments
  - icon: offline
    title: "No mobile coverage in the outback"
    pick: nalscribe
    text: "NALscribe captions on the device once the language is downloaded. Captio AI records and transcribes when you are back in range."
  - icon: meeting
    title: "A team meeting where several people talk"
    pick: captio-ai
    text: "Captio AI labels each speaker and, on iPhone, names colleagues you saved. NALscribe's app doesn't describe speaker labels."
    link: /use-cases/meetings
  - icon: android
    title: "A Samsung or other Android phone"
    pick: captio-ai
    text: "NALscribe has no Android app. Captio AI is on Google Play."
  - icon: glasses
    title: "Captions floating next to each speaker"
    pick: neither
    text: "NAL showed this on Apple Vision Pro with NALscribe AR, a finished research prototype that isn't on the App Store. Captio AI shows captions on a phone or iPad, and on iPhone 16 and later Speaker Direction marks the side a voice comes from."
faqs:
  - q: "Is NALscribe free, and could that change?"
    a: "Today every feature is free, with unlimited minutes and nothing to buy on the Australian App Store (November 2026). NAL's terms keep the right to charge or add advertising later. Captio AI has a free tier of 100 free credits a day and a paid Plus plan whose price differs by country."
  - q: "Who makes NALscribe?"
    a: "National Acoustic Laboratories (NAL), the research division of Hearing Australia, funded by the Australian Government Department of Health. Captio AI is not part of a government programme; organisations can arrange licences through captioai.app/organizations."
  - q: "Does NALscribe run on an older iPad at our clinic?"
    a: "Only if that iPad can update: the current version needs iOS 26.6 or later, although NAL's FAQ still names iOS 12.1. Captio AI asks for iOS 15.1 or later on iPhone and also runs on Android."
  - q: "Does NALscribe send conversations to the cloud?"
    a: "Online, NALscribe streams audio to Apple's speech recognition server and gets text back; offline, nothing leaves the device, and NAL keeps no audio and collects no data. Captio AI uses cloud speech recognition once you say yes; it keeps no audio on its servers, and it neither sells your content nor trains AI models on it."
  - q: "What is NALscribe's 20-second setting for at a reception counter?"
    a: "It clears all text 20 seconds after speech stops and offers no Save, so the next person can't read the last conversation; NAL recommends it for public counters. Captio AI is built for the opposite need: it keeps each session as a recording in a searchable library you can read and share later."
  - q: "Can NALscribe translate Mandarin into English at an appointment?"
    a: "Partly. Mandarin and English are both among its 12 translation languages, but you translate selected words or phrases, with a written and spoken result. Captio AI's Live Translator keeps translating the whole appointment, Mandarin to English and back, in its two-way mode."
  - q: "Can I download NALscribe AR for Apple Vision Pro?"
    a: "NAL describes NALscribe AR as a finished proof of concept, and it isn't among NAL's apps on the App Store (November 2026). Captio AI shows captions as text on a screen rather than placing them next to each speaker."
  - q: "Does NALscribe alert me to a doorbell or a smoke alarm?"
    a: "Sound alerts aren't part of NALscribe's described features. While Captio AI is recording on iPhone or iPad, Recognize Sounds slips labels like [knocking] or [doorbell rings] into the transcript, and alarm-type sounds such as a smoke alarm or a baby crying set the phone vibrating."
tags: [nalscribe, nalscribe app, nalscribe android, nalscribe alternative, nalscribe ar, captio ai vs nalscribe, national acoustic laboratories, live captions australia]
related: [captio-ai-vs-relay-live-transcribe, captio-ai-vs-apple-live-captions, captio-ai-vs-hearing-buddy]
---
