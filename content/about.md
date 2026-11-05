---
# The /about page (and /about.md). The facts themselves live in
# content/compare/apps/captio-ai.json, shared with the compare pages; this file
# says how to group them and adds what only this page has. Every claim about
# Captio AI follows content/blog/CAPTIO_FACTS.md. Sources are refs like the
# compare pages use: "innocaption:phoneCalls" (every source behind that fact)
# or "captio-ai:s3" (that one source). Loader and checks: src/lib/about.ts.
title: "About Captio AI"
description: "What Captio AI is, what it costs, what it doesn't do, who makes it, and when another app is the better choice. Every fact links to its source."
updated: 2026-11-04
answer: "Captio AI is a live captioning app for deaf and hard of hearing people, on iPhone, iPad and Android. It shows what people around you say as text while they are still talking, translates conversations live in 60+ languages, transcribes audio and video files, and turns transcripts into summaries. It is free to download with 100 free credits a day; Captio AI Plus costs US$14.99 a month or US$79.99 a year on the US App Store (October 2026). It doesn't caption phone or video calls. It is made in Slovenia by Nejc Dovžan Kukič."

# Every fact in captio-ai.json, each in one group (the build fails if one is left out).
groups:
  - title: "What it does"
    intro: "For conversations in the room: Captio AI captions the speech the phone's microphone picks up."
    rows: [roomCaptions, groupConversations, speakerLabels, voiceNames, speakerDirection, translation, soundAlerts, customWords, display, saveTranscripts, export, fileUpload, summaries]
  - title: "Where it runs"
    intro: "The phones it works on, the languages it captions, and what happens without a signal."
    rows: [platforms, deviceRequirements, languages, offline, account, availability]
  - title: "What it doesn't do"
    intro: "These jobs need another app or service. The next section says which."
    rows: [phoneCalls, videoCalls, mediaOnDevice, humanCaptioners, signLanguage]
  - title: "Price and privacy"
    intro: "What is free, what Captio AI Plus costs, and what happens to what is said."
    rows: [freePlan, price, accessibilityFunding, privacy]

# The jobs another app does better, each from that app's compare page.
otherApps:
  - title: "Captions for phone calls in the US"
    app: innocaption
    text: "InnoCaption captions phone calls, voicemail and 911 calls free and without limits for eligible US users, with a live stenographer if you want one. Captio AI doesn't caption calls."
    sources: [innocaption:phoneCalls, innocaption:freePlan, innocaption:humanCaptioners, captio-ai:phoneCalls]
  - title: "Free captions already on your iPhone"
    app: apple-live-captions
    text: "Apple's Live Captions is built into iPhone 11 and later, costs nothing, and also captions Phone and FaceTime calls and audio playing in any app."
    sources: [apple-live-captions:deviceRequirements, apple-live-captions:freePlan, apple-live-captions:phoneCalls, apple-live-captions:mediaOnDevice]
  - title: "Captions with no internet"
    app: live-transcribe
    text: "Live Transcribe captions without internet in downloaded languages on Android 12 or later, free and with no daily limit. Captio AI needs internet for live captions."
    sources: [live-transcribe:offline, live-transcribe:freePlan, captio-ai:offline]
  - title: "Sound alerts when you aren't captioning"
    app: live-transcribe
    text: "Sound Notifications, in the same app as Live Transcribe, alerts you to smoke alarms, a doorbell, a baby crying and more. Captio AI's Recognize Sounds listens only while Captio AI is recording, on iPhone and iPad."
    sources: [live-transcribe:soundAlerts, captio-ai:soundAlerts]
  - title: "A big group, each person on their own phone"
    app: ava
    text: "Up to 25 people can join an Ava conversation from their own phone, and you can add a human captioner or a remote ASL interpreter. Captio AI captions the table from one phone and has no human captioners."
    sources: [ava:groupConversations, ava:humanCaptioners, ava:signLanguage, captio-ai:groupConversations, captio-ai:humanCaptioners]
  - title: "Zoom, Teams and Meet calls"
    app: otter-ai
    text: "Otter's Notetaker joins Zoom, Google Meet and Teams calls by itself and transcribes them live. Captio AI doesn't caption video calls."
    sources: [otter-ai:videoCalls, captio-ai:videoCalls]
  - title: "Captions on glasses"
    app: xrai-glass
    text: "XRAI Glass can show captions on AR glasses, right in front of your eyes, so you can keep looking at the person. Captio AI shows captions on the phone or tablet screen."
    sources: [xrai-glass:s3, xrai-glass:s4, captio-ai:platforms]

# Apps and products with similar names that people mix up with Captio AI.
# url = that product's own page; quote = the words on it that say what it is.
similarNames:
  - name: "Captions"
    by: "captions.ai"
    what: "An AI video generator and editor."
    url: "https://captions.ai/"
    quote: "Captions is an AI video generator and editor that makes it easy to go from idea to ready-to-share content."
    checked: 2026-11-04
  - name: "Captio: AI Captions, Subtitles"
    what: "An app that adds captions, translations and dubbing to short videos for TikTok, Instagram Reels and YouTube Shorts."
    url: "https://apps.apple.com/us/app/captio-ai-captions-subtitles/id6755599794"
    quote: "Captio transforms any video into scroll-stopping content with AI-powered captions, translations, and dubbing."
    checked: 2026-11-04
  - name: "captions.ai: caption generator"
    by: "Tiny Leo Co., Ltd"
    what: "An app that writes captions for the photos you post on social media."
    url: "https://apps.apple.com/us/app/captions-ai-caption-generator/id6499187142"
    quote: "Elevate your photos with perfectly crafted captions using captions.ai, the ultimate AI-powered caption generator."
    checked: 2026-11-04
  - name: "Emburse Captio"
    by: "Emburse"
    what: "Travel and expense management software for companies."
    url: "https://www.emburse.com/products/captio"
    quote: "Emburse Captio offers you an app and web platform to request and automate your trips and expenses"
    checked: 2026-11-04

maker:
  text: "Captio AI is made in Slovenia by Nejc Dovžan Kukič, a sole proprietor, who is also the data controller named in its privacy policy. Accounts and saved transcripts are stored in the EU, in Frankfurt; audio is processed in real time and not kept on Captio AI's servers."
  sources: [captio-ai:s3, captio-ai:s9]

faqs:
  - q: "What is Captio AI?"
    a: "Captio AI is a live captioning app for deaf and hard of hearing people, on iPhone, iPad and Android. It shows what people around you say as text while they are still talking, translates conversations live, transcribes audio and video files, and turns transcripts into summaries, key points and to-dos, in 60+ languages."
  - q: "Is Captio AI free?"
    a: "Captio AI is free to download. The free plan gives 100 free credits a day for live captions or transcription, and 3 AI summaries in total. Captio AI Plus removes both limits."
  - q: "How much does Captio AI Plus cost?"
    a: "On the US App Store, as of October 2026, Captio AI Plus costs US$14.99 a month or US$79.99 a year. There is no free trial, and prices differ by country. An organization can buy yearly licenses per person by invoice: US$109, €99 or £89 per person per year for 1 to 19 people, less from 20 people, with a free 30-day pilot for up to 5 people."
  - q: "Who makes Captio AI?"
    a: "Captio AI is made in Slovenia by Nejc Dovžan Kukič, a sole proprietor, who is also the data controller named in its privacy policy. You can write to hello@captioai.app."
  - q: "Is Captio AI the same app as Captions, Captio or captions.ai?"
    a: "No. Captio AI is a live captioning app for deaf and hard of hearing people. It is not related to Captions (captions.ai), an AI video editor; to the apps Captio: AI Captions, Subtitles and captions.ai: caption generator, which make captions for social media videos and photos; or to Emburse Captio, travel and expense software."
  - q: "Does Captio AI caption phone calls?"
    a: "No. Captio AI captions the speech the phone's microphone picks up, for conversations in the room. It doesn't caption phone calls, video calls or audio playing on the phone. In the US, call-caption services such as InnoCaption caption phone calls free for eligible users, and Apple's Live Captions on iPhone captions Phone and FaceTime calls."
  - q: "Does Captio AI work without internet?"
    a: "Live captions and translation need an internet connection. Without one, Captio AI keeps recording and transcribes the recording automatically when the phone is back online."
  - q: "Does Captio AI store my conversations?"
    a: "Audio is processed in real time and isn't stored on Captio AI's servers. Transcripts and summaries are kept on your phone and, if you sign in with Apple or Google, synced to your account, which is stored in the EU. Content is never sold, never shared for advertising and never used to train AI models."
  - q: "Which languages does Captio AI caption?"
    a: "Captio AI captions and translates 60+ languages, including speech that switches languages mid-sentence. Each language has its own page about the regional varieties and accents it handles, for example captioai.app/german."
  - q: "Does Captio AI work on Android?"
    a: "Yes. Captio AI has been on Google Play since October 2026. On Android, captions pause when you leave the app, and Speaker Direction and Recognize Sounds aren't available; Recognize Voices and folders are listed as iPhone features."
  - q: "Does Captio AI replace a captioner or an interpreter?"
    a: "No. Its captions are automatic, with no person checking them, and it doesn't do sign language. Where a perfect record is needed, or someone prefers sign language, a human captioner (CART) or an interpreter is the right choice. Captio AI is one tool among them."
---
