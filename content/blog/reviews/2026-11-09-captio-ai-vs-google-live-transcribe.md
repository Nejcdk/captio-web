# Review: Captio AI vs Google Live Transcribe: which is better?
Verdict: FAIL (round 1)
Date: 2026-11-09

## A. Truth
| # | Claim | Source | Evidence (quote) | Verdict |
|---|---|---|---|---|
| 1 | Live Transcribe is Android only; works "using just your Android phone" | [2] Play listing (fetched with curl, hl=en_US) | "...among people who are deaf and hard of hearing, using just your Android phone." | SUPPORTED |
| 2 | Android 12 or later | [2] | "Requirements: • Android 12 and up" | SUPPORTED |
| 3 | Over 80 languages and dialects | [2] | "Get transcriptions in real-time in over 80 languages and dialects. Add custom words..." | SUPPORTED |
| 4 | Price 0 USD on Google Play (US) | [2] | JSON-LD offer price "0", priceCurrency "USD"; data-is-free="true" | SUPPORTED |
| 5 | Not saved by default; save for 3 days | [2], [1] | "Choose to save transcriptions for 3 days... By default, transcriptions are not saved." / [1] "transcription history in Live Transcribe for up to three days" | SUPPORTED |
| 6 | Offline languages; stay connected otherwise | [1] | "Make sure that you're connected to the Internet unless you're using one of the offline languages." | SUPPORTED |
| 7 | Secondary language, custom words, "Export all stored transcription" | [1] | "To set a secondary language, tap Secondary language..."; "Add custom words"; "Export all stored transcription" | SUPPORTED |
| 8 | "Already installed on Pixel and select other Android phones" | [1] | "Live Transcribe is already installed on Pixel phones and select other Android phones." | SUPPORTED. But the article also says "built into many Android phones" (overstated, see fixes) |
| 9 | Hold microphone near the person | [1] | "Hold your device microphone near the person or sound that you want to capture." | SUPPORTED |
| 10 | Sound Notifications list, vibrate/flash, "always checks", audio stays on device | [3] | "your phone always checks for sounds you want notifications about"; smoke/fire alarms, sirens, baby crying, dog barking, knocking, doorbells, appliance beeping, landline ringing, running water; "All the audio your device hears stays on your device." | SUPPORTED |
| 11 | Cloud ASR gives greater accuracy (2019) | [4] | "Relying on cloud ASR provides us greater accuracy." | SUPPORTED |
| 12 | Speaker separation listed as possible future improvement | [4] | "include on-device recognition, speaker-separation, and speech enhancement" | SUPPORTED |
| 13 | No speaker labels / translation described in [1][2] | [1][2] | [1]: speaker labels not found ("Show sound labels" is for sounds). Translation: only ASL-to-English sign-to-text, no spoken-language translation | SUPPORTED, but see omission fix (sign-to-text) |
| 14 | US App Store "live transcribe" search returns Live Transcribe by Mighty Fine Apps LLC, not Google | [5] | iTunes API now: first result "Live Transcribe \| Mighty Fine Apps LLC"; Google Translate by Google is the only Google result | SUPPORTED (absence claim, sound) |
| 15 | Captio AI on iPhone, free, Plus US$14.99/month and US$79.99/year | [6] | "Free, with in-app purchases", "$14.99", "$79.99"; also FACTS | SUPPORTED |
| 16 | "60 languages for captions and translation" (keyFact, table, FAQ, "against 60") cited to [6] | [6] | Listing shows 45 languages in its language list; "Translate conversations in real time across 60+ languages." | CONTRADICTED by the cited source for captions (45 listed); FACTS says "60+ languages" for captions and translation. Source and claim do not match |
| 17 | Table "iPhone and Android [6]" | [6] | The App Store page does not mention Android | NOT FOUND in [6] (true per FACTS, wrong citation) |
| 18 | "Captio AI is on ... Google Play" | none | FACTS line 15 supports it | UNCITED (no external source for the competitor-facing reader; add the Play link or a source) |
| 19 | Other Captio AI claims (speaker labels renamable, Recognize voices iPhone, Recognize sounds iPhone, screen locked iPhone only, Android pauses on leaving app, records offline, 3 free summaries, 100 free credits, library, uploads, not for phone calls, no interpreter replacement) | CAPTIO_FACTS.md | Each matches a FACTS row | SUPPORTED |
| 20 | "Recognize sounds ... makes the phone vibrate for alerts" / "[doorbell rings]" | FACTS row recognize-sounds | matches | SUPPORTED |
| 21 | "Live Translator ... switched on with a Translate toggle" | image LT_mockup_1.png | The screenshot shows a "Translate" switch on | SUPPORTED |

Other A checks: no fake social proof; no medical or legal advice; no speech-provider name; competitor tone is fair and says where Google wins (five bullet points). Sources are primary (Google, Apple, Google Research). Source 7 is the site's own compare page (ok, labelled).

## B. Works
- blog:check: pass (1492 words, 7 sources, 8 FAQs, 9 internal links, 7 external, 2 images). Warning: only 2 images (aim for 3).
- build: pass (built already; `next start -p 3199` served it).
- page checks: /blog/<slug> 200; h1 equals title; JSON-LD has BlogPosting, FAQPage, BreadcrumbList; listed in /blog, /blog/rss.xml, /llms.txt, /sitemap.xml; /opengraph-image returns image/png 200; all 9 internal links (use cases, /recognize-voices, /live-translator, /compare/captio-ai-vs-live-transcribe) and both images return 200. Browser width test not run (no browser).
- Images: both are real Captio AI screenshots and the alt text matches what they show, both captioned "sample content". Problem: the library screenshot (LC_mockup_1.png, saved recordings list) sits at the end of the doorbell / smoke alarm section, where it illustrates nothing. The Live Translator image sits inside a paragraph, splitting it (sentence "The Live Transcribe pages cited here..." starts after the image).
- Plagiarism (5 distinctive sentences searched in quotes): "a single stream of text without names is hard to follow", "an iPhone user looking for Google's app will not find it", "Live Transcribe is better when you only need captions in the moment", "The two are not rivals for everyone", "Captio AI vs Live Transcribe" title query. No near-verbatim match found for any. PASS.
- Search checklist: answer-first, 7 sources, 7 external links, 9 internal links OK. Tags appear in the text (live transcribe iphone, android live captions appear only loosely; "live captions app deaf" ok). Meta lengths pass blog:check.

## C. Value
Query searched: "captio ai vs live transcribe" plus "live transcribe vs ava". Top results are vendor pages (Ava, livetranscribe.app, aiindigo, Similarweb). None mention Captio AI.
| Criterion | Score | Evidence |
|---|---|---|
| Answers the question | 5 | Short answer gives a verdict by phone and need, quotable alone. |
| Information gain | 4 | Dated Google-sourced table (3-day history, 80+ languages, Android 12+, 0 USD), the App Store absence check, an honest "where Google wins" list; no top result has this. |
| Trust | 4 | Primary sources, dated, fair. Loses a point for the source [6] mismatches and the "many Android phones" overstatement. |
| Specificity | 4 | Concrete numbers and situations; clinic basement, family dinner, shop assistant. |
| Quotable structure | 5 | Question headings, answer-first sections, table, 8 FAQs. |
| Use cases and languages named | 4 | Doctor, group, lecture, meeting, travel, conference linked; 5 of 8 FAQs name a use case or language. Everyday conversations covered in the table only. |
| Fit with the site | 4 | Links to the compare page; overlap with /compare/captio-ai-vs-live-transcribe is acknowledged and the page points to it, low cannibalisation risk. |
| Reader value | 4 | A deaf reader on iPhone or Android can decide quickly. Omits sign-to-text (see fixes). |
Information gain: the compiled, dated, Google-sourced side-by-side with an App Store absence check and Sound Notifications comparison that no result for the query has.
Risk to the site: low after fixes; the only risk is a competitor-facing mis-citation (languages) and an overstated "built into many Android phones".

## Required fixes (if FAIL)
1. Language count versus source [6]. The App Store listing [6] shows 45 languages for the app and "60+" only for translation. The article states "60 languages for captions and translation" (keyFact `source: 6`, table row, "against 60 for Captio AI"). Make the claim match FACTS ("60+ languages", the row in FACTS line 32) and cite a source that says it, or word it as "translation across 60+ languages [6]" and drop the caption-count comparison against Google's 80+ (or cite the Captio AI compare/about page, which follows FACTS). Do not leave a number whose own cited page says 45. Also change "against 60 for Captio AI" accordingly.
2. Table cell "iPhone and Android [6]" and the sentence "Captio AI is on the App Store [6] and on Google Play": [6] does not mention Android. Remove [6] from the Android claim and cite the Google Play listing (https://play.google.com/store/apps/details?id=com.captio.app) in sources, or state it without a footnote only if FACTS-only claims are allowed for Captio AI by the playbook.
3. "Built into many Android phones" (the at-a-glance paragraph) is not what [1] says. Use Google's wording: already installed on Pixel and select other Android phones.
4. Fairness omission: Live Transcribe's own help page [1] offers sign-to-text (ASL translated into English text via the camera). The article says "no translation between spoken languages", which is accurate, but a deaf reader should be told this exists. Add one line (table row or in "Where Google Live Transcribe is the better choice") with [1], and note Captio AI does no sign language.
5. Move the library screenshot (LC_mockup_1.png) out of the doorbell section into the lecture/meeting section, and put the Live Translator image on its own paragraph so the sentence is not split. Add a third relevant image if available (for example captions or Recognize sounds on the iPhone, from `src/lib/app-images.json`), with sample-content captions and alt text that says what it shows.
6. Optional but recommended: name everyday conversations explicitly (the topic's use case) in a sentence or FAQ, and add a language to one more FAQ so at least half of the FAQs name a use case or language (currently met; keep it after edits).

---

# Round 2
Verdict: PASS (round 2)
Date: 2026-11-09

Re-checked the edited article against round 1 fixes.
1. Languages: body, table, FAQ and Google-wins bullet now say "60+" (FACTS line 32), no longer cited to [6]; the 60-language keyFact was removed. FIXED.
2. Android: "iPhone and Android" has no [6]; "Google Play (released October 2026)" matches FACTS line 15 and the Play URL in captio-ai.json. FIXED.
3. Preinstall wording now "already installed on Pixel and select other Android phones [1]". FIXED.
4. Sign-to-text bullet added with [1]. Evidence: "Your front camera will capture your signs and show the translation on your screen." Matches "through the front camera". SUPPORTED.
5. Images: library screenshot moved to lecture section, translator image has its own paragraph, third image LC_mockup_2 added. Read it: real Captio AI screenshot showing Speaker 1 / Speaker 2 labels over a two-person exchange; alt text matches; captioned sample content. blog:check: pass, 3 images, no warnings. Page and image return 200 on the local server.
6. Everyday conversations named in "Which one should you use?". FIXED.

New text checked: "counted differently, so check your own language in both" is a fair hedge. No new unsourced facts.

Remaining (non-blocking, do before or at publish):
- Frontmatter `description` still says "60 languages"; change to "60+ languages" to match the body.
- Information gain 4, average about 4.3; no score below 3. Risk to the site: none.
