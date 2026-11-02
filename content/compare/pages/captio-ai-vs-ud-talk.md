---
title: "Captio AI vs UD Talk"
description: "Captio AI vs UD Talk (UDトーク): captions shared to an audience, the free version's rules for schools, voice data reuse, who is talking, offline use and price."
kind: versus
apps: [captio-ai, ud-talk]
rows: [groupConversations, roomCaptions, speakerLabels, voiceNames, speakerDirection, soundAlerts, customWords, humanCaptioners, privacy, freePlan, price, accessibilityFunding, languages, translation, offline, saveTranscripts, export, display, videoCalls, platforms]
published: 2026-11-02
updated: 2026-11-02
answer: "Pick UD Talk if you are the one speaking or organising, at a lecture, an event or a city office, and want captions on a projector, in browsers and on other people's phones, with your own word list and people correcting mistakes live. Pick Captio AI if you are the deaf or hard of hearing person holding the phone and nobody will speak into a device for you: it captions the whole room, writes saved names on people's lines (iPhone), points to the side of the table a voice is on (iPhone 16 and later), and notes a ringing doorbell in the text."
picks:
  - app: ud-talk
    text: "You run a lecture, an event or a meeting and want the captions on a projector, in any browser and on every phone in the room, with registered words and helpers fixing mistakes as they appear."
  - app: captio-ai
    text: "You are the listener, not the organiser: one phone on the table labels each speaker, swaps a label for a saved name on iPhone, shows where a voice sits on iPhone 16 and later, and marks a doorbell in the captions."
differences:
  - title: "Can UD Talk show captions to a whole audience?"
    text: "Yes, that is what it is built around. A talk can be published with a QR code so other phones join, opened in any browser without the app, shown full screen on a projector, or sent into Zoom. Captio AI has no audience mode: it captions the room for the person holding the phone, labels who is speaking, and doesn't stream those live captions to anyone else's phone."
    sources: [ud-talk:groupConversations, ud-talk:videoCalls, captio-ai:groupConversations]
  - title: "Can schools and city halls use the free version of UD Talk?"
    text: "No. UD Talk's terms bar government offices, local authorities, schools and public facilities from using the free version for their work, except for disaster prevention and evacuation shelters. They need a corporate plan, or the free App Introduction Program, which lists them publicly as users. A school or city office can try Captio AI on the same free plan as anyone else, 100 free credits a day, and buy licences for its deaf and hard of hearing staff or students, paid by invoice."
    sources: [ud-talk:freePlan, ud-talk:accessibilityFunding, captio-ai:freePlan, captio-ai:accessibilityFunding]
  - title: "Does the free UD Talk reuse what I say?"
    text: "Yes. In the free version, your voice and the text made from it are collected and reused to improve recognition; the Compact Plan and corporate plans discard voice data. Captio AI makes no such split between free and paid: under its privacy policy, its servers keep none of your audio, and nothing you record is used to train AI models."
    sources: [ud-talk:privacy, captio-ai:privacy]
  - title: "Does UD Talk know who is talking?"
    text: "When each person speaks into their own phone, yes: their lines carry the name set on that phone. Telling voices apart on one phone isn't described, and the developer suggests people say their name before speaking. Captio AI needs no introductions: one phone gives each speaker a label, Recognize Voices on iPhone replaces the label with the name of someone whose voice you saved, and Speaker Direction on iPhone 16 and later marks the side of the table the voice is on."
    sources: [ud-talk:speakerLabels, ud-talk:voiceNames, captio-ai:speakerLabels, captio-ai:voiceNames, captio-ai:speakerDirection]
  - title: "Can UD Talk caption offline on an Android phone?"
    text: "No, offline captions are iPhone only: there UD Talk can switch to the Apple On Device engine, and otherwise recognition and translation run on its servers. Captio AI's Live Captions need a connection on every phone; with no signal it records the conversation and writes the captions once the phone is online again."
    sources: [ud-talk:offline, captio-ai:offline]
  - title: "What does UD Talk's Compact Plan cost next to Captio AI Plus?"
    text: "The Compact Plan is ¥500 a month or ¥300 a week on the Japanese App Store (November 2026); corporate plans cost ¥117,600 to ¥888,000 a year before tax, plus a setup fee. Captio AI Plus is priced in dollars: US$14.99 for a month or US$79.99 for a full year on the US App Store as of October 2026, and there's no free trial; without it, Captio AI allows 100 free credits a day."
    sources: [ud-talk:price, captio-ai:freePlan, captio-ai:price]
better:
  ud-talk:
    - text: "Captions reach an audience: other phones join by QR code, anyone can read along in a browser without installing anything, and a projector or Zoom puts them on a big screen."
      sources: [ud-talk:groupConversations, ud-talk:videoCalls]
    - text: "Words and names can be registered in the app or on the web, and other people can fix mistakes live from their phones or a Mac or Windows computer."
      sources: [ud-talk:customWords, ud-talk:humanCaptioners]
    - text: "For an event, partner companies can run the captions with human editors and re-speakers."
      sources: [ud-talk:u27]
    - text: "The Compact Plan costs ¥500 a month or ¥300 a week on the Japanese App Store (November 2026), and the free version may be used commercially."
      sources: [ud-talk:price, ud-talk:u4]
    - text: "Reading aids made for Japanese: UD fonts, and kanji a child hasn't learned yet shown in hiragana by school grade."
      sources: [ud-talk:display]
  captio-ai:
    - text: "It is made for the person reading. One phone captions everyone at the table and labels each speaker, while UD Talk says it focuses on people who speak into it on purpose and points listeners who simply hold a phone to the iPhone's built-in Live Captions."
      sources: [captio-ai:groupConversations, captio-ai:speakerLabels, ud-talk:roomCaptions]
    - text: "Recognize Voices (iPhone) learns a person from about 20 seconds of talking and from then on writes their name on what they say, live and in saved recordings. With an iPhone 16 or later lying flat, Speaker Direction grows a wave on the edge of the captions toward whoever is talking."
      sources: [captio-ai:voiceNames, captio-ai:speakerDirection]
    - text: "Recognize Sounds (iPhone and iPad) puts a doorbell, a knock or a siren in grey brackets inside the captions and buzzes the phone for alarms. UD Talk's pages list no alerts for sounds."
      sources: [captio-ai:soundAlerts, ud-talk:soundAlerts]
    - text: "Summaries, to-dos and transcripts of audio and video files are part of the app; at UD Talk they are separate web tools."
      sources: [captio-ai:summaries, captio-ai:fileUpload, ud-talk:summaries, ud-talk:fileUpload]
situations:
  - icon: lecture
    title: "Giving a lecture with captions on the screen behind you"
    pick: ud-talk
    text: "Speak into UD Talk with your word list ready, and the captions go to the projector, to students' phones by QR code and to any browser."
    link: /use-cases/lectures
  - icon: work
    title: "A city hall or school that wants captions for staff and visitors"
    pick: ud-talk
    text: "UD Talk has corporate plans with support, and a free App Introduction Program for public bodies; its free version can't be used for their work. Captio AI also offers licences for organisations, paid by invoice."
  - icon: meeting
    title: "An office meeting you want minutes of"
    pick: both
    text: "With UD Talk, each person speaks into their own phone and their name goes on their lines, ready to export. With Captio AI, one phone in the middle labels the speakers, names saved voices on iPhone, and afterwards writes the summary and the to-do list."
    link: /use-cases/meetings
  - icon: video
    title: "A Zoom webinar"
    pick: ud-talk
    text: "UD Talk sends captions into the Zoom meeting with each speaker's name. Captio AI doesn't caption video calls."
  - icon: dinner
    title: "Following family and friends at a busy table"
    pick: captio-ai
    text: "UD Talk works best when people speak into it on purpose, and at a family table nobody will. Captio AI listens from one phone in the middle, puts saved names on people's lines on iPhone, and adds a direction wave on iPhone 16 and later."
    link: /use-cases/group-settings
  - icon: offline
    title: "An evacuation shelter after an earthquake"
    pick: ud-talk
    text: "UD Talk's terms let local authorities use the free version at evacuation shelters, and on iPhone the Apple On Device engine works with no signal. Captio AI would only record there and add the captions later."
faqs:
  - q: "Is UD Talk free for personal and business use?"
    a: "Yes for both, and the free version may even be used commercially; only government offices, local authorities and schools are barred from using it for their work. The trade-off is that it reuses your voice data, and support is the online manual alone. Captio AI's free plan works differently: 100 free credits a day of captions, 3 AI summaries in total, and Captio AI Plus when you need more."
  - q: "Can a Japanese university caption classes with the free UD Talk?"
    a: "No. The terms bar schools from using the free version for teaching, so a university needs the education plan (¥216,000 a year before tax, plus setup) or the App Introduction Program. UD Talk's own advice is that the teacher speaks into it and students read along. Captio AI works from the student's side: their own phone captions the lecturer, and the recording can be summarised afterwards."
  - q: "Does UD Talk caption English, Chinese or Korean?"
    a: "Yes. Japanese uses the AmiVoice engine; in the free version other languages use the phone's own speech recognition, and translation uses Google Translate. A language list from 2020 has 173 language and region settings. Captio AI handles all three among its 60+ languages and can translate between them and Japanese live; its Japanese captions use kanji, hiragana and katakana."
  - q: "Does UD Talk save the audio with the transcript?"
    a: "On iPhone, yes: the audio is kept with the talk and plays back next to the text. On Android it keeps text logs. Logs can be emailed or shared with their times. Captio AI saves every recording with its audio, on iPhone and Android, synced to your account."
  - q: "Can UD Talk put captions into a Zoom meeting?"
    a: "Yes. One device set up with Zoom's caption token sends the captions into the meeting, with each phone's speaker name. Captio AI doesn't caption Zoom or other video calls; it captions the people in the room around you."
  - q: "Does UD Talk work in a disaster with no signal?"
    a: "On iPhone, switch to the Apple On Device engine and it captions offline; its terms also let local authorities use the free version at evacuation shelters. In a shelter without signal, Captio AI can only record, and it turns the recording into text once the phone finds a network again."
  - q: "Can UD Talk tell family members apart at the dinner table?"
    a: "Only if each person speaks into their own phone, which puts that phone's name on their lines. Captio AI tells them apart from a single phone in the middle of the table: Dad and your sister get their own labels, or their names once you've saved their voices on iPhone, and on iPhone 16 and later a wave points toward whoever is talking."
  - q: "Will UD Talk tell me the doorbell is ringing?"
    a: "UD Talk's pages don't describe sound alerts. If Captio AI is recording on an iPhone or iPad when the bell goes, Recognize Sounds writes [doorbell rings] into the captions at that moment and vibrates the phone three times; with the screen locked, a notification appears too."
tags: [UD Talk, UDトーク, UD Talk alternative, UDトーク 代わり, UDトーク アプリ, captio ai vs ud talk, 字幕配信, 聴覚障害 字幕 アプリ]
related: [captio-ai-vs-koetora, captio-ai-vs-vosual, captio-ai-vs-apple-live-captions]
draft: false
---
