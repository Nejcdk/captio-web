---
title: "Captio AI vs Koetora"
description: "Captio AI vs Koetora (こえとら): running captions or one turn at a time, a free app built on NICT research, offline use, typed text read aloud, and English."
kind: versus
apps: [captio-ai, koetora]
rows: [roomCaptions, groupConversations, speakerLabels, voiceNames, speakerDirection, soundAlerts, offline, freePlan, price, accessibilityFunding, account, privacy, languages, translation, saveTranscripts, fileUpload, summaries, display, platforms, availability]
published: 2026-11-02
updated: 2026-11-02
answer: "Pick Koetora if you want a free, publicly backed replacement for writing notes back and forth: short turns, your typed words or saved phrases read aloud for the hearing person, and it works offline on supported phones. Pick Captio AI if the conversation won't wait for turns: it captions everyone as they talk, shows who said what (saved names on iPhone, the speaker's side of the table on iPhone 16 and later), notes sounds like a doorbell in the text, and keeps a recording you can summarise."
picks:
  - app: koetora
    text: "You want a free tool for one-to-one exchanges at a counter, a station or a shop: speak or type one turn, show a saved phrase, and let the app say it aloud, even with no signal."
  - app: captio-ai
    text: "You need running captions of everyone in the room, with names on iPhone, sounds like a doorbell written in, a recording you keep, and captions or translation beyond Japanese."
differences:
  - title: "Does Koetora caption a whole conversation?"
    text: "No, it works one turn at a time: tap, speak for up to about 20 seconds, and that turn appears as one message. Captio AI captions continuously while people talk, labels each speaker, and keeps recording with the iPhone screen locked."
    sources: [koetora:roomCaptions, captio-ai:roomCaptions, captio-ai:speakerLabels, captio-ai:s10]
  - title: "Is Koetora really free?"
    text: "Yes. Koetora has no paid plan: telecom companies sponsor it, and you pay only your own mobile data. Captio AI works with a daily allowance instead, 100 free credits a day. Unlimited use takes Captio AI Plus, US$14.99 monthly or US$79.99 yearly (US App Store prices, October 2026), which has no free trial."
    sources: [koetora:freePlan, koetora:price, koetora:accessibilityFunding, captio-ai:freePlan, captio-ai:price]
  - title: "Will Koetora work offline on an older Android phone?"
    text: "Not below Android 10, which Koetora no longer supports at all. On Android 10 or later with at least 1 GB of memory, and on iPhone or iPad with iOS 13 or later, speech recognition and the synthesized voice work without signal, and only the map needs a connection. Captio AI's Live Captions need a connection; without one it records now and writes the captions when you're back online."
    sources: [koetora:offline, koetora:deviceRequirements, captio-ai:offline]
  - title: "Can Koetora speak for me?"
    text: "Yes. What you type, or a phrase you saved, is read aloud in a male or female voice, and the other person can answer by voice, text, a drawing, a map or a ready-made choice. Captio AI is built for the other direction: it turns what the people around you say into captions."
    sources: [koetora:k6, koetora:k13, koetora:k14, captio-ai:roomCaptions]
  - title: "Can Koetora help with an English-speaking visitor?"
    text: "Not in the same app: Koetora is Japanese, its English version KoeTra is a separate iPhone app, and translation isn't described. Captio AI's Live Translator has a two-way mode where each of you reads the other in your own language, across 60+ languages, and its Japanese captions use kanji, hiragana and katakana."
    sources: [koetora:languages, captio-ai:translation, captio-ai:languages, captio-ai:s19]
better:
  koetora:
    - text: "It is free for everyone, with no plan to choose and nothing to buy inside the app; telecom sponsors pay for it."
      sources: [koetora:freePlan, koetora:price, koetora:accessibilityFunding]
    - text: "Speech recognition and the synthesized voice work offline on supported phones, and FEAT reminded people of this after the 2024 Noto earthquake."
      sources: [koetora:offline]
    - text: "It talks back for you: typed text and saved phrases are read aloud, and the other person can reply by picking a ready-made answer, so neither side has to type much."
      sources: [koetora:k6, koetora:k13, koetora:k14]
    - text: "Ready-made phrasebooks for trains and buses, taxis, airports, hotels, shops, schools and the workplace download straight into the app."
      sources: [koetora:k16]
    - text: "It comes from NICT, a Japanese government research institute, and its expansion was announced by the Ministry of Internal Affairs and Communications."
      sources: [koetora:k18]
  captio-ai:
    - text: "Captions keep flowing through a whole conversation, from one phone, with every speaker labelled; nobody waits for a turn or passes the phone around."
      sources: [captio-ai:roomCaptions, captio-ai:groupConversations, koetora:roomCaptions]
    - text: "In a group, names matter: Recognize Voices (iPhone) needs about 20 seconds of someone talking, then labels their lines with their name from then on, and Speaker Direction (iPhone 16 and later) adds a wave toward the person speaking."
      sources: [captio-ai:voiceNames, captio-ai:speakerDirection]
    - text: "Koetora vibrates only when it reads your own text aloud. Captio AI's Recognize Sounds (iPhone and iPad) also listens to the room: a knock, a siren or a baby crying is written into the captions, and alarms buzz the phone."
      sources: [captio-ai:soundAlerts, koetora:soundAlerts]
    - text: "Each recording is kept with its audio and synced, can become a summary with to-dos, and audio or video files can be transcribed too."
      sources: [captio-ai:saveTranscripts, captio-ai:summaries, captio-ai:fileUpload]
    - text: "Captions and live translation cover 60+ languages, where Koetora's app is Japanese and English needs a separate app."
      sources: [captio-ai:languages, captio-ai:translation, koetora:languages]
situations:
  - icon: travel
    title: "Asking for help at a station or a taxi rank"
    pick: koetora
    text: "Pick a sentence from Koetora's trains-and-buses or taxi phrasebook and it is read aloud; the staff answer by voice and you read their reply."
    link: /use-cases/traveling
  - icon: money
    title: "A quick question at a bank or shop counter"
    pick: koetora
    text: "Short questions and answers are what Koetora is made for, and it costs nothing. For the business side, FEAT makes a separate app for counters, SpeechCanvas."
  - icon: doctor
    title: "A doctor explains a diagnosis at length"
    pick: captio-ai
    text: "A long explanation doesn't fit into 20-second turns. Captio AI follows the doctor sentence by sentence, and afterwards you can replay the audio and pull out the to-dos."
    link: /use-cases/doctor-appointments
  - icon: home
    title: "Family talking over each other at home"
    pick: captio-ai
    text: "Nobody has to wait for the phone: Captio AI captions everyone from the middle of the table, names saved voices on iPhone, and marks the doorbell when it rings."
    link: /use-cases/everyday-conversations
  - icon: phone
    title: "Keeping in touch with a friend in another city"
    pick: koetora
    text: "Koetora's internet chat connects registered users, up to 10 in a room, by voice input, typing or saved phrases. Captio AI doesn't caption phone or video calls."
  - icon: translate
    title: "A conversation in English or Chinese"
    pick: captio-ai
    text: "Koetora is Japanese, with English only in its separate KoeTra app. Captio AI captions and translates 60+ languages live, Chinese and English included."
    link: /chinese
faqs:
  - q: "Who makes Koetora, and is it a government app?"
    a: "FEAT Limited, a Tokyo company, makes it from speech research by NICT, a Japanese government research institute. NICT released it in June 2013 and transferred it to FEAT in January 2015; telecom companies sponsor it so individuals use it for free. Captio AI is an independent app from Slovenia with a free plan and a paid Captio AI Plus subscription."
  - q: "Can a hospital or city office in Japan use Koetora at its counter?"
    a: "Koetora's terms cover personal use; an organisation needs FEAT's permission, and FEAT makes a separate app, SpeechCanvas, for counters. Anyone can use Captio AI on the free plan, and organisations can get licences for their deaf and hard of hearing people, paid by invoice."
  - q: "How long can I speak into Koetora at once?"
    a: "About 20 seconds per turn; then recording stops by itself. Typed messages can be up to 250 characters. Captio AI doesn't work in turns: it captions while people keep talking, even with the iPhone screen locked."
  - q: "Does Koetora work after an earthquake with no signal?"
    a: "Yes, on supported phones speech recognition and the synthesized voice work offline, and only the map needs a connection; FEAT suggests downloading it in advance. Captio AI can't caption live without a network; it saves the audio and fills in the text once the connection comes back."
  - q: "Does Koetora keep my conversations on its servers?"
    a: "Its privacy policy says spoken words, text, drawings and locations are not recorded on its servers; usage history, device information and chat account details are. The Japanese App Store privacy label lists audio data and precise location as collected. Captio AI also processes speech in the cloud, after you agree; its servers don't store the audio, and your recordings never go into training AI models."
  - q: "Is there an English version of Koetora?"
    a: "Yes, KoeTra, a separate iPhone app from the same company. Captio AI captions and translates 60+ languages in one app, on iPhone and Android."
  - q: "Can Koetora alert me when the doorbell rings at home?"
    a: "No such alert is described; its vibration setting only marks when your own text is being read aloud. Captio AI notices a doorbell while it is recording captions on iPhone or iPad, not as an always-on alarm; then it marks the ring in the text, vibrates three times, and sends a notification if the screen is locked."
  - q: "Does Koetora show who is speaking in a group?"
    a: "On one phone, telling speakers apart isn't described; in a chat, each person uses their own phone. Captio AI is built for exactly that: one phone gives each voice its own label, saved voices show by name on iPhone, and on iPhone 16 and later Speaker Direction marks where that person sits."
tags: [Koetora, こえとら, KoeTra, Koetora alternative, こえとら 代わり, captio ai vs koetora, 筆談 アプリ, NICT]
related: [captio-ai-vs-ud-talk, captio-ai-vs-vosual, captio-ai-vs-google-translate]
draft: false
---
