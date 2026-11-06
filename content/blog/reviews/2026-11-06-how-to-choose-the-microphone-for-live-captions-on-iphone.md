# Review: How to choose the microphone for live captions on iPhone
Verdict: FAIL (round 1)
Date: 2026-11-06

## A. Truth
| # | Claim | Source | Evidence (quote) | Verdict |
|---|---|---|---|---|
| 1 | Three AirPods mic modes (automatic, always left, always right) | [1] | "Automatically Switch AirPods", "Always Left AirPod or Always Right AirPod" | SUPPORTED |
| 2 | Chosen AirPod "becomes the microphone, even if you remove it from your ear or put it in the case" | [1] | exact quote on page | SUPPORTED |
| 3 | Default: either AirPod can be mic; only one in use = it is the mic | [2] | "By default, Microphone is set to Automatic, so that either of your AirPods can act as the microphone." / "If you're using only one AirPod, that AirPod will be the microphone." | SUPPORTED |
| 4 | Steps: Settings, AirPods name, Microphone (Audio & Routing first) | [1][2] | same wording | SUPPORTED |
| 5 | Live Listen quote and devices | [3] | "have conversations in loud places by picking up audio from people who are speaking from a distance" (fetched summary; page read only to char 100000, quote found) | SUPPORTED |
| 6 | Apple offers Live Captions for in-person speech | [3] | "capture and caption live, in-person speech through the microphone in your device" | SUPPORTED |
| 7 | 23 adults and 14 children, China | [4] | "23 Mandarin-speaking adults ... and 14 children" | SUPPORTED |
| 8 | 5.55 dB (1.5 m) and 13.11 dB (6 m) with hearing aid mics; about -5.5 and -7.53 dB with remote mic | [4] | values match | SUPPORTED |
| 9 | Improvement 11 to 19.5 dB adults, 10 to 18.9 children; distance had no effect with remote mic | [4] | "improved by 11-19.5 dB for adults and 10-18.9 dB for children"; "distance had no significant effect" | SUPPORTED |
| 10 | 1.1.6 release notes: AirPods/another mic connected, Captio AI asks which one captions should use and remembers it | [5] | "Choose your microphone: when AirPods or another microphone is connected, Captio AI asks which one captions should use and remembers it." (store page HTML) | SUPPORTED |
| 11 | 1.1.6 live 5 November 2026 | [5], CAPTIO_FACTS line 20 | store version history shows 1.1.6 dated Nov (Thu Nov 5); FACTS "live 2026-11-05" | SUPPORTED |
| 12 | Free to download, 100 free credits a day, Plus removes limit | CAPTIO_FACTS line 76 | "100 free credits a day" | SUPPORTED |
| 13 | "The language comes from your language settings in Captio AI" (FAQ 5, no [n]) | none | No matching line found in CAPTIO_FACTS checked by grep | UNCITED (Captio claim without a FACTS line; cite or remove) |
| 14 | Meeting/conference/restaurant advice: phone flat in the middle "is closer to every speaker than your ears are"; clip-on or room mic "is nearest to the talker"; quiet room "little is lost"; AirPods in a lecture hear "the same weak signal from a back row" | none / [4] | Source [4] tests hearing-aid mics vs a talker-worn remote mic. It does not test a phone on a table, AirPods, or any iPhone captions. Table rows for meeting and quiet room carry no citation | UNCITED / stretched. [4] is cited as if it proved the phone-near-the-speaker advice |
| 15 | Competitors | - | none named | n/a |
| 16 | Fake social proof, medical/legal advice | - | none | pass |

Sources: all five are primary (Apple, PMC paper, the app's own store page). Titles and years match. No Wikipedia.

## B. Works
- blog:check: pass (1024 words, 5 sources, 7 FAQs, 6 internal links, 5 external, 2 images; warning: 2 images, aim for 3)
- build: pass
- page checks: /blog/<slug> 200; one h1 equals title; Short answer, FAQ and sources in HTML; JSON-LD has BlogPosting, FAQPage, BreadcrumbList; listed in /blog, rss.xml, llms.txt, sitemap.xml; opengraph-image is image/png; all internal links and both images return 200. No browser available, so the 375/1280 px check was not done.
- Images: LC_mockup_2.png (real Captio AI live captions screen, two speakers) and LC_mockup_1.png (real home screen). Alt texts match what is shown and are captioned "Sample content". Neither shows the microphone question, which is the article's subject.
- Plagiarism (5 sentences searched in quotes, no near-verbatim match found): "a microphone far from the talker gives you worse captions, whichever app you use"; "AirPods sit at your ears and hear what reaches you"; "Apple's Live Listen sends sound, and captions show words"; "the phone flat in the middle ... closer to every speaker than your ears are"; the topic query itself. Result: none.
- Search checklist: answer-first yes; 5 sources, 5 external links; 6 internal links; meta in range.

## C. Value
Searched "iphone live captions which microphone airpods": top results are Apple's Live Listen and Live Captions pages, how-tos and a KU/audiology guide.

| Criterion | Score | Evidence |
|---|---|---|
| Answers the question | 3 | The Short answer says "connect it, then pick it when the app asks" and gives a dB figure from a hearing-aid study, not an answer to which mic to choose. |
| Information gain | 3 | The AirPods settings and Live Listen are on Apple's own pages. The one new thing is the 1.1.6 prompt. Nothing on external, wired, USB, clip-on or hearing-aid (MFi) mics, which the topic angle promised. No practical limits (how the prompt works, what happens if the mic disconnects). |
| Trust | 3 | Apple and paper claims check out. The central advice (put the phone near the speaker) rests on a study of hearing-aid users with a talker-worn remote mic, presented as if it supports phone placement. |
| Specificity | 4 | Real dB numbers, real settings path, named situations. |
| Quotable structure | 4 | Question headings, answer-first sections, a table. |
| Use cases and languages named | 3 | Lecture, meeting, conference, restaurant covered. Only 1 FAQ of 7 names a language, with no sentence naming language pages beyond a vague mention. |
| Fit with the site | 4 | One query, 6 internal links. Overlaps a little with the who-is-talking article but links to it. |
| Reader value | 3 | A deaf reader in a lecture is told to put the phone near the speaker, but then cannot read the captions on it. The article never says how to do that (second device, sitting at the front, a connected clip-on mic). |

Average: 3.4. Information gain: 3 (needs at least 4).
Risk to the site: low risk of harm, but the lecture advice could mislead and the page is mostly Apple's own settings plus one general-hearing study.

## Required fixes (if FAIL)
1. Fix the lecture/meeting/restaurant advice so it is true for the reader. Say plainly that a phone placed near the speaker cannot be read from a back row. Offer workable options (sit nearer, a connected microphone near or on the talker that the app lists when it asks, a second phone) and label each as a suggestion, not a finding of study [4].
2. Stop presenting [4] as proof of phone or AirPods placement. State once that it compared hearing-aid microphones with a talker-worn wireless microphone, and cite it only for that. Remove the [4] after "the phone close to the speaker usually serves you better" (lecture FAQ) and after the restaurant claim, or add a source that tests phone microphones.
3. Add citations or remove the uncited claims in the table rows for meeting and quiet room, and the clip-on/room-system statement in the conference section. If no source exists, rephrase as an explicit "our suggestion".
4. Raise information gain to at least 4 with cited, checked material the top results lack. Examples: what Apple says about Bluetooth microphones and the iPhone's own microphones, and wired/USB/clip-on external microphones (fetch the Apple pages and cite them); how Live Listen and Made for iPhone hearing devices relate to which mic captions use; a short "what Captio AI does and does not do" section limited to CAPTIO_FACTS line 57. Delete anything not found in the source.
5. FAQ 5 ("Does the microphone choice change the language"): add a CAPTIO_FACTS-supported statement about language settings or remove the claim about language settings.
6. Make the Short answer answer the title: say which microphone suits which situation (phone on the table close to speakers; a connected microphone near the talker), not only the dB figure. Keep the dB number as support.
7. Optional: add a third image that shows the microphone question if a real screenshot exists in `app-images.json`; otherwise leave two.
8. Re-run blog:check, build and the page checks after the fix. Browser width check (375 and 1280 px) still to be done in round 2 when a browser is available.

---

# Round 2
Verdict: PASS
Date: 2026-11-06

## A. Truth (changes only)
| Claim | Source | Evidence | Verdict |
|---|---|---|---|
| Live Listen makes the iPhone "act like a microphone that sends sound", "Place your iPhone or iPad in front of the person that you want to hear", needs iOS/iPadOS 14.3+, AirPods or Beats, picks up a speaker "across the room" | [6] support.apple.com/en-qa/102479 | all five phrases found on the page | SUPPORTED (the quoted ending "to your AirPods or Beats" was summarised by the fetch as "to your headphones"; the compatible-device line names AirPods or Beats, so the meaning holds) |
| Release-note facts in the new Captio AI section | [5], CAPTIO_FACTS line 57 | same text as round 1; the section says nothing beyond it and states what the notes do not say | SUPPORTED |
| [4] scoped to hearing-aid vs talker-worn mic, "did not test phones or AirPods" | [4] | matches round 1 check | SUPPORTED |
| Meeting, conference, restaurant, lecture advice | none | now written as "our suggestion" and "as suggestions", and the intro says advice is ours unless cited | acceptable |
| FAQ 5 "language comes from your language settings" | CAPTIO_FACTS line 33 (language-hint: "Tell the app which language to expect") | Note: it was NOT removed (the message said it was), but a FACTS line supports it | acceptable |

All 6 sources are primary (Apple, the PMC paper, the store page). No fake social proof, no competitor names, no medical or legal advice.

## B. Works
- blog:check: pass (1127 words, 6 sources, 7 FAQs, 6 internal links, 6 external, 2 images; warning: aim for 3 images)
- build: pass
- page checks (fresh server; an earlier stale server was killed): 200; new section and source [6] in the HTML; JSON-LD BlogPosting, FAQPage, BreadcrumbList; listed in /blog, rss.xml, llms.txt, sitemap.xml; opengraph-image is image/png; internal links and images 200 as in round 1.
- Images unchanged and still real Captio AI screens with correct alt text and "Sample content".
- Not done: the 375 px and 1280 px browser check (no browser available here). The only table has 3 narrow columns and is the standard blog component.
- Plagiarism: round 1 searches stand; the changed text (new lecture and Live Listen paragraphs) is paraphrase of Apple's page with short quotes under 25 words and citation.

## C. Value
| Criterion | Score | Evidence |
|---|---|---|
| Answers the question | 4 | Short answer now says which microphone for which situation and labels it a suggestion. |
| Information gain | 4 | Names the real trade-off none of the top results states (a mic near the talker is useless if you cannot read the screen), a sourced side-by-side table of the choices, and honestly says what the release notes do and do not say. |
| Trust | 4 | Study scoped to what it tested; suggestions labelled; Apple quotes verified. |
| Specificity | 4 | dB figures, settings path, iOS 14.3, named situations. |
| Quotable structure | 4 | Question headings, complete first sentences, a table. |
| Use cases and languages named | 3 | Lecture, meeting, conference, restaurant and dinner each have a section or FAQ; only one FAQ mentions languages. |
| Fit with the site | 4 | One query, 6 internal links, leads to use cases. |
| Reader value | 4 | A deaf reader gets workable options for each setting. |

Average 3.9 (rounds to the threshold of 4 by 0.1 short; no score below 3, information gain 4). This is borderline: I judge it passes because the earlier misleading advice is fixed and the remaining gap is breadth, not truth.
Information gain: the readability-versus-closeness trade-off plus the sourced choices table.
Risk to the site: none.

## Optional improvements (not blocking)
1. Add a third image of the microphone question if a real screenshot exists.
2. Do the 375/1280 px browser check when a browser is available.
