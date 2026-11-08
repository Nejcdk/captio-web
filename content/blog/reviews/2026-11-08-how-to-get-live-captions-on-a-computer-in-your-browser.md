# Review: How to get live captions on a computer for a meeting or lecture
Verdict: FAIL (round 1)
Date: 2026-11-08

## A. Truth
Sources opened with WebFetch on 2026-11-08 (Microsoft, Apple, Google, App Store). Captio claims checked against CAPTIO_FACTS.md.

| # | Claim | Source | Evidence (quote) | Verdict |
|---|---|---|---|---|
| 1 | Windows 11 version 22H2 or later | [1] | "Live captions is available in Windows 11, version 22H2 and later." | SUPPORTED |
| 2 | Settings > Accessibility > Captions; quick settings; Win+Ctrl+L | [1] | "Go to Settings > Accessibility > Captions and turn on the Live captions toggle."; "Windows key+Ctrl+L" | SUPPORTED |
| 3 | Include microphone audio is in Preferences and off by default | [1] | "Include microphone audio ... When you turn on live captions, this functionality is off by default." | SUPPORTED |
| 4 | Audio, voice data and captions never leave the device | [1] | "Audio, voice data, and captions never leave your device and are not shared to the cloud or with Microsoft." | SUPPORTED |
| 5 | Language list (Chinese, Danish, English variants, French, German, Italian, Japanese, Korean, Portuguese, Spanish) | [1] | Page lists exactly these (21 entries) | SUPPORTED |
| 6 | "Until you switch it on, the captions follow the sound your computer plays" | [1] | Source: "pays attention to the default sound output device"; "Sound audio will be prioritized over microphone audio." | SUPPORTED, but see fix 4: the article leaves out the priority rule, which matters for a room |
| 7 | Mac: only Apple silicon | [2] | "Live Captions is available only on Mac computers with Apple silicon." | SUPPORTED |
| 8 | System Settings > Accessibility > Live Captions, Microphone icon | [2] | Steps and microphone icon in Live Captions window confirmed | SUPPORTED |
| 9 | Mac "caption people speaking near the Mac"; "the default view is for audio the Mac plays" | [2] | Page says "sound picked up by the computer's microphone (such as during an in-person conversation)" and "By default, Live Captions transcribes audio from all apps". "near the Mac" does not appear; the page does not say the default source is Mac audio | NOT FOUND (default-source claim) |
| 10 | Not available in all languages, countries or regions; audio processed on device | [2] | "not available in all languages, countries, or regions"; "Audio is processed on device." | SUPPORTED |
| 11 | Accuracy may vary, not for high-risk or emergency | [2] | "The accuracy of Live Captions may vary and should not be relied upon in high-risk or emergency situations." | SUPPORTED |
| 12 | Chrome captions "videos, podcasts, games, live streams, video calls, or other audio media" | [3] | Exact quote | SUPPORTED |
| 13 | Chrome: processed locally, never stored, never leave device | [3] | "All audio and captions are processed locally, are never stored, and never leave your device." | SUPPORTED |
| 14 | Chrome: "English is the default; other languages download as language packs" | [3] | Page only says "Add languages ... automatically download language packs". No statement that English is the default | NOT FOUND (English default) |
| 15 | Chrome page "does not say it captions a microphone" | [3] | Page does not mention a microphone | SUPPORTED (but the Short answer's "not the room" turns silence into a claim, see fix 6) |
| 16 | Chrome on Windows, Mac or Linux | [3] | Windows, Mac, Linux, Chromebook | SUPPORTED |
| 17 | 1.1.7: open captioai.app/app on any computer, same account, find it in Settings | [4] | "Captio AI on the web: open captioai.app/app on any computer and sign in with the same account." "You'll find it in Settings." | SUPPORTED, matches FACTS web-app row |
| 18 | Notes do not list web features | [4] | Nothing else about the web in the notes | SUPPORTED |
| 19 | Captio AI: 60 languages, 100 free credits a day (as of October 2026), Plus removes the limit, needs internet, asks before audio is sent, audio not stored on servers | FACTS | All present in CAPTIO_FACTS.md | SUPPORTED |
| 20 | Live Captions page: speech appears word by word on the phone, phone's microphone near the speaker | FACTS / site | Consistent with the feature page; no number or new feature claimed | SUPPORTED |
| 21 | "Windows 11 Live captions and Mac Live Captions are better than any app when you want captions of everything the computer plays and speech around it with no sign-up" | none | Absolute "better than any app" claim, uncited, unfair to every other app | UNCITED / unfair |
| 22 | Image alt: "Captio AI meeting transcript on iPhone with speakers separated, useful beside a laptop in a meeting" | image file | The file shows a hand holding an iPhone with live captions (Speaker 1 / Speaker 2), not a transcript, and no meeting or laptop | WRONG ALT (FAIL) |
| 23 | Image alt 1: "...a phone placed near the speaker" | image file | The image is a plain screenshot of Live Captions in a phone frame; no speaker or placement is shown | Inaccurate alt |

Sources: Microsoft, Apple, Google and Apple App Store are all primary. Titles, publishers and years match. No Wikipedia, no fake social proof, no medical or legal advice. No competitor claims (no competitors named), so there is no fairness issue there. No provider names.

## B. Works
- blog:check: pass (1177 words, 4 sources, 8 FAQs, 7 internal links, 4 external, 2 images). Warnings: only 2 images (aim 3); title overlaps with /blog/live-captions-on-ipad-for-lectures-and-meetings.
- build: pass.
- page checks (next start, port 3199): /blog/<slug> 200; h1 is the title; Short answer, FAQ and sources in the HTML; JSON-LD parses with BlogPosting, FAQPage, BreadcrumbList; listed in /blog, /blog/rss.xml, /llms.txt, /sitemap.xml; opengraph-image 200 image/png; all 9 internal links and both images return 200. Meta description 156 characters or fewer, in range. No browser available, so the 375/1280 px layout check was not run.
- Images: both are real Captio AI mockups (not stock, not invented UI). Alt text fails as listed in 22 and 23.
- Plagiarism: searched in quotation marks: (1) "A laptop can caption a meeting or a lecture without any extra software"; (2) "The microphone step matters for a deaf or hard of hearing person in a meeting room"; (3) a Windows+Ctrl+L sentence; (4) the Chrome "useful trait for lectures that are recorded" wording; (5) "Where the built-in options are the better choice". Results: no near-verbatim match on any other page. PASS.
- Search checklist: answer-first yes; 4 sources and 4 external links yes; 7 internal links yes; tags appear in the text yes; JSON-LD yes.

## C. Value
Searched "live captions in browser on computer for deaf". Top results: Chrome Live Caption articles (MacRumors, TechSpot), Windows 11 live captions guides (HearingTracker "3 ways to caption almost everything on your windows computer", geekrewind), browser tools such as Web Captioner and Timbrica, Ava and SpeakSee for Windows.

| Criterion | Score | Evidence |
|---|---|---|
| Answers the question | 4 | The Short answer gives the Windows and Mac steps and the Chrome limit, but "not the room" for Chrome is stated as fact when Google is merely silent. |
| Information gain | 3 | The table of mic support, requirement and where audio is processed is useful, but results already cover Windows and Chrome. The topic angle named "browser tools" and the article covers none, and it omits Microsoft's "Sound audio will be prioritized over microphone audio", the one fact that decides whether Windows works in a room. |
| Trust | 4 | Primary sources, honest "not stated" for the web version. Loses a point for the unsupported English default, the "default view" claim and "better than any app". |
| Specificity | 4 | Versions, shortcut, language list, concrete settings. |
| Quotable structure | 4 | Question headings, answer-first sections, table, 8 FAQs. |
| Use cases and languages named | 4 | Meetings, lectures, doctor, interview, group and German/Spanish named; FAQs mostly name a use case or language. |
| Fit with the site | 3 | Close to the iPad article's question (title overlap warning); the web section is thin and the title drops "browser" from the topic, so it may not match the target query. |
| Reader value | 3 | A reader on Windows is told to turn on the mic but not that sound output outranks it, which can leave the room silent in a Teams meeting. Browser-based options are not mentioned. |

Average 3.6 (needs at least 4). Information gain 3 (needs at least 4).
Information gain: the mic-support comparison table is the only new element; it needs the Windows sound-over-microphone priority and a browser-tools row to clear 4.
Risk to the site: low. Nothing misleading is stated about Captio AI, but an incorrect image alt and unsupported claims about Apple and Google pages would be on a public page.

## Required fixes (if FAIL)
1. Fix the alt text of `/app/captio-ai-live-captions-at-work.webp`. It shows a hand holding an iPhone with live captions, two speakers. Suggested: "A hand holding an iPhone that shows Captio AI Live Captions with two speakers, sample content." Remove "meeting transcript" and "beside a laptop".
2. Fix the alt text of `/app/captio-ai-live-captions-iphone.webp`: remove "a phone placed near the speaker". Suggested: "Captio AI Live Captions on iPhone showing two speakers' words as they are spoken, sample content."
3. Mac section (and FAQ 2 if needed): delete "the default view is for audio the Mac plays" and "people speaking near the Mac". Use Apple's words: you can switch between the Mac's audio output and "the sound picked up by the computer's microphone (such as during an in-person conversation)" with the microphone icon; "By default, Live Captions transcribes audio from all apps."
4. Chrome section: delete "English is the default" (not on Google's page). Keep "other languages download as language packs".
5. Windows section: add Microsoft's statement that live captions follow the default sound output device in Settings > System > Sound and that "Sound audio will be prioritized over microphone audio" [1]. Say what this means for a meeting room (a call playing through the speakers can crowd out the person across the table) and add it to the Windows row or the FAQ. This is the fix that raises Information gain and Reader value.
6. Soften the Short answer: "Chrome's Live Caption describes captioning audio from media, not the room" becomes "Chrome's Live Caption page describes audio media and does not mention a microphone [3]".
7. Replace "are better than any app" in the last section with a sourced, narrower statement, for example: "are free parts of the system, caption what the computer plays and (with the microphone on) the room, and process audio on the device [1][2]".
8. Cover the angle "browser tools": add a short section or table row on browser-based captioning tools. Only use tools whose own pages you open in the next round (for example Web Captioner or Timbrica), say where they are better or worse, and cite their own pages (add sources and external links). If none can be verified, add an honest line that no browser tool was verified and retitle so the title does not suggest otherwise. Information gain must reach 4.
9. Add a third image if one fits the topic with a correct alt (for example a different real Live Captions mockup), or accept the checker warning. Optional.
10. Differentiate from `live-captions-on-ipad-for-lectures-and-meetings`: make the first paragraph name the computer, laptop and desktop (Windows, Mac) so the two queries stay separate. Optional but recommended.

---

# Round 2
Verdict: FAIL (round 2)
Date: 2026-11-08

Round 1 fixes 1 to 7 are done and verified against the sources and the image files. Fix 8 (browser tools) is only half done. Two claims in the new section have no support in the cited page, so A fails on a small number of items.

## A. Truth (changes only)
| # | Claim | Source | Evidence (quote) | Verdict |
|---|---|---|---|---|
| 24 | Windows: default sound output device; "Sound audio will be prioritized over microphone audio"; virtual-meeting example, captions show the remote participant instead of you | [1] | "Live captions pays attention to the default sound output device configured in Settings > System > Sound."; "if you are in a virtual meeting where a remote meeting participant is speaking and you speak over each other, the captions for the remote meeting participant will be shown instead of your own." | SUPPORTED |
| 25 | "with a headset you may need to change the default device"; "In a hybrid meeting ... people in the room can disappear from the captions" | [1] | Not on the page; these are the writer's inferences, written as Microsoft's detail ("Two more details from Microsoft's page") | NOT FOUND as stated (mark as inference) |
| 26 | Mac: switch between audio output and the microphone; "by default Live Captions transcribes audio from all apps" | [2] | "By default, Live Captions transcribes audio from all apps."; microphone "such as during an in-person conversation" | SUPPORTED |
| 27 | Chrome: no microphone mention; other languages download as language packs | [3] | "Add languages ... automatically download language packs." | SUPPORTED |
| 28 | Web Captioner "has sunset" and the author open sourced it in 2023 | [5] | Heading "Web Captioner has sunset. Thank you for your support!"; "in 2023" | SUPPORTED |
| 29 | Web Captioner is "a browser speech-to-text tool that people used for live captions" | [5] | The page does not describe what it was, and does not mention a browser or captions | NOT FOUND |
| 30 | "Chrome's Live Caption is the browser feature that is maintained" | none | No source; Google's page does not say it | UNCITED |
| 31 | Source [5] year 2026 | [5] | The only date on the page is 2023 | WRONG YEAR |
| 32 | Web Captioner "has shut down" (answer, section) | [5] | Page says "sunset" and that the author no longer maintains it; it does not say the site is offline. The project's GitHub README (github.com/curtgrimes/webcaptioner) says it was shut down and published as source on 31 October 2023 (found by search; not opened as a full page) | Partly supported; use the author's own wording or add the GitHub page as a source |

Images: both alts are now accurate (hand holding an iPhone with live captions, two speakers; Live Captions screen). Samples are captioned "sample content". Still only 2 images (warning, not a fail).

## B. Works
- blog:check: pass. Warnings: answer is 83 words (aim 40 to 80); 2 images.
- build: pass.
- page checks (fresh server on port 3199): /blog/<slug> 200, h1 is the new title, the Web Captioner section and source are in the HTML, JSON-LD has BlogPosting, FAQPage and BreadcrumbList, article is in /blog, rss, /llms.txt and /sitemap.xml, OG image is a PNG, all 7 internal links return 200. (Note: a stale server from round 1 served the old title once; ignore that.) No browser available, so the 375 and 1280 px check was not run.
- Plagiarism: the round 1 search stands; the new section's sentences are the writer's own. A search on Web Captioner's sunset returned only the project's own pages and forum posts; no copied text.

## C. Value
| Criterion | Score | Evidence |
|---|---|---|
| Answers the question | 4 | Short answer gives the Windows and Mac steps and the Chrome limit with correct wording. |
| Information gain | 4 | The Windows rule that sound audio outranks the microphone, with Microsoft's own example, is missing from most guides; the mic-support table adds to it. The browser section is thin (only a closed tool). |
| Trust | 4 | Primary sources and honest "not stated"; loses a point for the two unsupported Web Captioner statements and the wrong year. |
| Specificity | 4 | Versions, shortcut, settings path, language list. |
| Quotable structure | 4 | Question headings, table, 8 FAQs. |
| Use cases and languages named | 4 | Meetings, hybrid meetings, lecture, doctor, interview, German, Spanish. |
| Fit with the site | 4 | The title now covers Windows, Mac and browser; the iPad overlap warning is gone. |
| Reader value | 4 | A Windows user now learns the sound-priority trap and the phone backup. |

Average 4.0. Risk to the site: low once the two unsupported claims are fixed.

## Required fixes (round 2)
1. Web Captioner sentence: remove "a browser speech-to-text tool that people used for live captions" or support it. Either say only what [5] says ("Web Captioner, a captioning tool by Curt Grimes, has sunset: its page says ... and that the author open sourced it in 2023"), or add the project's GitHub page (https://github.com/curtgrimes/webcaptioner) as source [6], open it first, and quote what it says it is. If you say "shut down", use wording the source gives ("sunset", "no longer maintained") or cite the GitHub page.
2. Remove "Chrome's Live Caption is the browser feature that is maintained" or replace it with "Chrome's Live Caption has a current Google help page [3]".
3. Source [5] `year`: change 2026 to 2023 (the date the page gives), or drop the year if the schema allows.
4. Windows paragraph: the headset advice and the hybrid-meeting consequence are your inferences. Rewrite so the Microsoft facts stay attributed [1] and the inferences are plainly yours, for example "so with a headset, check which device is the default in Settings, System, Sound" and "In a hybrid meeting this could mean ...", and do not call them "details from Microsoft's page".
5. Trim the `answer` to 80 words or fewer (it is 83) while keeping the Windows, Mac, Chrome and Captio AI pieces.
6. Optional: add a third image with a correct alt.

---

# Round 3
Verdict: PASS
Date: 2026-11-08

Round 2 fixes 1 to 5 checked against the sources.

## A. Truth (changes only)
| # | Claim | Source | Evidence (quote) | Verdict |
|---|---|---|---|---|
| 33 | Microsoft says you might need to change the default device for audio to be picked up | [1] | "You might need to change your default device for audio to be picked up by live captions." | SUPPORTED |
| 34 | Hybrid-meeting consequence | none | Now written as "My reading, not Microsoft's ... could ... check it in a test call" | OK, marked as inference |
| 35 | Web Captioner "is no longer offered": "Web Captioner has sunset"; author open sourced it in 2023 | [5] | "Web Captioner has sunset. Thank you for your support!"; "While I no longer maintain it, the Web Captioner source code is available on GitHub." Page calls it "A speech-to-text app written with Vue." | SUPPORTED |
| 36 | "speech-to-text tool built for the browser" | [5] | "built for the browser" is not stated on the page (name and Vue suggest a web app). Minor descriptive wording, not a fact that changes the meaning | Acceptable; optional: drop "built for the browser" |
| 37 | "Chrome's Live Caption has a current Google help page" | [3] | The page exists and was opened today | SUPPORTED |
| 38 | Source [5] year 2023 | [5] | "in 2023" | SUPPORTED |

## B. Works
- blog:check: pass, answer length warning gone; only the 2-images warning remains.
- build: pass. Fresh server: /blog/<slug> 200, JSON-LD has BlogPosting, FAQPage, BreadcrumbList, listed in /blog, rss, /llms.txt and /sitemap.xml, OG image PNG. Internal links unchanged since round 2 (all 200).
- Images and alts unchanged and correct. Plagiarism result unchanged (pass). The 375/1280 px check was not run (no browser available).

## C. Value
Scores unchanged from round 2: all criteria 4, Information gain 4, average 4.0, no score below 3. Risk to the site: none found.

## Optional (not required)
- Drop "built for the browser" from the Web Captioner sentence.
- Add a third image with a correct alt.
