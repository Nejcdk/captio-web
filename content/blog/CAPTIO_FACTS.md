# Captio AI fact sheet (the only source for claims about our own app)

Every sentence a blog article says about Captio AI must be backed by a line in this file. If a claim isn't here, don't make it. If something here looks out of date, don't guess: flag it in the run log so Nejc can update this file.

Last checked: 2026-10-29 (App Store release notes of 1.1.4 and app source at its release commit a6d32fd of Nejcdk/captio; Google Play listing last checked 2026-10-21).

## What it is
- Name: always **Captio AI** (never "Captio" alone). Plan name: **Captio AI Plus**.
- A live captioning app for deaf and hard of hearing people. Positioning: accessibility first, never "just a transcription tool".
- Made for **in-person speech** picked up by the phone's microphone: conversations, doctor's appointments, pharmacy and shop counters, lectures, meetings, dinners and group settings, church, travel, interviews in person.
- **Not** a phone-call or video-call captioning service. Never present it as one, never compare it as one. For phone calls, point readers to relay and call-captioning services instead.

## Where it runs
- iPhone: App Store, https://apps.apple.com/app/captio-ai/id6796617180 (iOS 15.1 or later; also listed for iPad, Apple silicon Macs and Apple Vision).
- Android: Google Play, https://play.google.com/store/apps/details?id=com.captio.app (released October 2026).
- iPhone only: captions keep running with the screen locked, Lock Screen and Dynamic Island Live Activity, Home Screen widgets. Android: captions pause when you leave the app.
- Needs an internet connection for live captions and translation. Without internet it can still **record**, and the recording is transcribed automatically when the phone reconnects.

## Live version
- App Store: **1.1.4** (live 2026-10-28; 1.1.3 went live 2026-10-23). The daily run's new-version check (`scripts/blog-release-watch.mjs`) updates this line and the feature map when a new version goes live.
- Only features in a live store version may be written about. Merged but unreleased work (see "Not live yet") never appears in an article.

## Feature map
Each row is one thing the app does for the reader. `id` is used in `topics.json` (`covers.features`) and by `npm run blog:coverage`. `Page` is the website page to link when there is one. Capitalise the four main features as proper nouns: Live Captions, Live Translator, Audio Transcription, AI Summary.

| id | Feature | What it does for the reader | Platforms | Since | Use cases it helps | Page |
|---|---|---|---|---|---|---|
| live-captions | Live Captions | Speech in the room appears as text word by word while the person is still talking; latency well under a second. | iPhone, Android | ≤1.1.2 | all | /live-captions |
| live-translator | Live Translator | Live translation of speech into another language, shown next to the original captions. | iPhone, Android | ≤1.1.2 | traveling, everyday-conversations, meetings, doctor-appointments, conferences | /live-translator |
| audio-transcription | Audio Transcription | Upload an audio or video file (from Files or Photos) and get a transcript. | iPhone, Android | ≤1.1.2 | lectures, meetings, conferences, tv-media | /audio-transcription |
| ai-summary | AI Summary and actions | From any transcript: Summary, Key points, Detailed notes, To-dos, Questions and answers, or a Follow-up message. Free plan: 3 summaries in total. | iPhone, Android | ≤1.1.2 | meetings, lectures, doctor-appointments, conferences, job-interviews | /ai-actions |
| languages | 60+ languages | Captions and translation in 60 languages, including speech that switches languages mid-sentence. | iPhone, Android | ≤1.1.2 | all | / |
| language-hint | Language hint | Tell the app which language to expect so it starts tuned in from the first word. | iPhone, Android | ≤1.1.2 | traveling, everyday-conversations | /live-captions |
| speaker-labels | Speaker labels | Separates speakers (Speaker 1, Speaker 2) and lets you rename them after the recording. | iPhone, Android | ≤1.1.2 | meetings, group-settings, conferences, doctor-appointments | /live-captions |
| words-and-names | Words and names | Add names, medical terms or specialist words so they are recognised. | iPhone, Android | ≤1.1.2 | doctor-appointments, lectures, meetings, job-interviews | /live-captions |
| word-fix | Fix a word everywhere | Uncertain words are underlined; long-press any word to correct it everywhere in the recording, and add it to Words and names. | iPhone, Android | ≤1.1.2 | lectures, meetings, doctor-appointments | /live-captions |
| retranscribe | Re-transcribe | Run a saved recording through again for a cleaner transcript. | iPhone, Android | ≤1.1.2 | lectures, meetings, conferences | /audio-transcription |
| display-settings | Caption display | Text size, colours and contrast can be adjusted. | iPhone, Android | ≤1.1.2 | everyday-conversations, group-settings, tv-media | /live-captions |
| locked-screen | Captions with the screen locked | Recording and captions keep running with the screen locked; Lock Screen and Dynamic Island show a timer with pause and resume. | iPhone only | ≤1.1.2 | lectures, conferences, meetings | /widgets |
| widgets | Home Screen widgets | Start Live Captions or translation from a widget. | iPhone only | ≤1.1.2 | everyday-conversations, doctor-appointments, restaurants | /widgets |
| video-upload | Video transcription | Pick a video from Photos; only its sound is extracted on the phone and sent, the picture never leaves the device. | iPhone, Android | ≤1.1.2 | tv-media, lectures, conferences | /audio-transcription |
| offline-recording | Record without internet | Without a connection the app still records, and the recording is transcribed automatically when the phone reconnects. | iPhone, Android | ≤1.1.2 | traveling, lectures, conferences | /audio-transcription |
| export | Export and share | Share a transcript or summary as plain text, a link, a PDF, an email, or a ready prompt to paste into an AI chat. | iPhone, Android | ≤1.1.2 | meetings, lectures, doctor-appointments | /export |
| library | Saved recordings and search | Recordings are saved with their audio in a searchable library, synced to your account. | iPhone, Android | ≤1.1.2 | lectures, meetings | /audio-transcription |
| voice-recognition | Recognize voices | Save the voices of people you talk to often (record about 20 seconds of their talking, or choose a file); captions then show their names instead of "Speaker 2", live and in saved recordings. Voices are made and kept on the phone. The app can also ask who an unknown speaker is, and every answer improves recognition. Free plan: your own voice plus 1 other person; Plus: more people. Found in Settings under Captions, Recognize voices; it works with Separate Speakers turned on. Saving a voice needs about 20 seconds of actual speech; the voice engine downloads once on first use. Tap a speaker's tag in a saved recording to say who it is. Names also show in exports and AI actions. | iPhone | 1.1.3 | group-settings, meetings, everyday-conversations, doctor-appointments | /recognize-voices |
| language-flags | Language flags on speaker tags | Every speaker tag shows the flag of the language being spoken, live and in recordings. Tap the flag in a saved recording to set the right language and write it again. | iPhone | 1.1.3 | traveling, group-settings, conferences | /live-captions |
| folders | Folders | Sort saved recordings into folders (a grid on the Folders tab). When a recording is saved the app can suggest a folder and asks first; nothing moves without your yes. A folder can record, translate or upload straight into itself. | iPhone | 1.1.3 | lectures, meetings, conferences | /folders |
| shared-folders | Shared folders | Invite people to a folder with a link or code; everyone in it sees every recording in it and can add their own. Only the person who made a recording can change it. Leaving a folder takes your recordings out of it. | iPhone | 1.1.3 | meetings, group-settings, conferences, lectures | /folders |
| ipad | iPad app | A full iPad app in every orientation and window size (Split View, Slide Over, Stage Manager, resizable windows). Live captions fill the whole iPad screen; translation shows the two panes side by side in landscape. Every other screen keeps the phone design in a centred column. Speaker direction and the Live Activity are not on iPad. Free and Plus work the same as on iPhone. | iPad | 1.1.4 | lectures, meetings, conferences, group-settings | /live-captions |
| connectors | Connectors (Claude, ChatGPT, Gemini, Perplexity) | Add Captio AI to a chat app and ask it about your recordings: your own and every recording in the shared folders you are in, with who said what and when. It finds where something was discussed by meaning, across languages, and finds exact words. Read-only. Needs a Captio AI account (sign in with Apple or Google) because it reads what is synced to your account. Settings, Connectors shows the steps for each chat app; the address to add is https://captioai.app/mcp. Each chat app has its own plan and region rules (for example Gemini's custom apps need a personal Google account, US, English) and may change its menus. | iPhone, Android (setup guide in the app; works from the chat app) | 1.1.4 | meetings, lectures, conferences, group-settings | /connectors |
| speaker-direction | Speaker direction | While captions run, waves at the edge of the captions screen show which side the current voice comes from, in the speaker's tag colour, so you know where to look at a busy table. Works on iPhone 16 and later (iOS 26 or later) with the phone's own microphones; works best flat on the table; uses more battery; on by default and can be turned off in Settings, Captions. Not on iPad or Android. | iPhone 16 and later | 1.1.4 | group-settings, restaurants, meetings | /speaker-direction |
| hourly-save | All-day recording in shared folders | Recording into a shared folder saves every hour and carries on in a new recording, so a long day is not one huge file. Personal recordings save only when you stop. Saved recordings take up less space on iPhone (stored compressed). | iPhone | 1.1.4 | meetings, conferences | /folders |

"Since" is the first live version known to have the feature; everything already in 1.1.2 is marked ≤1.1.2. New rows get the exact version from the release that brought them. Never write "new in version X" unless the release notes say so.

## Not live yet (never write about these until a live version has them)
- Anything in the app's code that the 1.1.4 release notes do not mention (for example Recognize Sounds, which is in the code but not in the 1.1.4 notes). Android availability of the 1.1.3 features is not confirmed: write "iPhone" only.

## Price (state "as of October 2026" and the store when you mention it)
- Free to download. Free plan: **100 free credits a day** for live captions or transcription, and 3 free AI summaries in total. Always write "100 free credits a day"; never describe the free plan in minutes (Nejc, 2026-10-28).
- Captio AI Plus removes the daily limit and the summary limit.
- App Store, US prices: Monthly US$14.99, Yearly US$79.99. No free trial: the 3-day trial offers were removed on 2026-10-21, so never mention a trial. Prices differ by country.
- Don't state Android prices.

## Privacy (from https://captioai.app/privacy)
- The app asks before any audio or text is sent for processing; if you say no, nothing is sent.
- Audio is processed in real time and is not stored on Captio AI's servers.
- Transcripts and summaries are stored on the device and synced to your account so you can use them on another device.
- Content is never sold, never shared for advertising, never used to train AI models.
- **Never name the speech-recognition or AI providers** in an article (business rule). Say "third-party speech recognition" if it ever matters.

## What not to claim
- No accuracy percentages for Captio AI unless they come from the website's language pages (the accuracy card on `/use-cases/<use-case>/<language>`), and then link that page.
- No user counts, ratings, reviews, testimonials or quotes from users. None exist that we may use.
- No "best", "most accurate" or "only" claims about Captio AI. Let the comparison table speak.
- No medical claims: Captio AI doesn't treat, diagnose or replace hearing care, interpreters or legal accommodations. It is one tool among them.
- No sign-language features (it doesn't do sign language), no offline live captions, no phone-call captions, no Apple Watch app.
