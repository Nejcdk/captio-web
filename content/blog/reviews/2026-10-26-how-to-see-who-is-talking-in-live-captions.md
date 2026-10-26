# Review: How to see who is talking in live captions
Verdict: PASS (round 2; round 1 was FAIL, see below)
Date: 2026-10-26

## A. Truth
| # | Claim | Source | Evidence (quote) | Verdict |
|---|---|---|---|---|
| 1 | Establishing who is speaking is vital for clarity | [1] DCMP | "Establishing the identity of both onscreen and offscreen speakers is vital for clarity." | SUPPORTED |
| 2 | Placement first; no name until introduced; name in parentheses on own line; unknown = "speaker #1" | [1] | all four points on the page, "(speaker #1)" | SUPPORTED |
| 3 | Everyone has trouble in groups, esp. when more than 1 person talks; ask 1 person at a time | [2] Alberta | "Everyone has trouble hearing in groups, especially when more than 1 person is talking at the same time." / "Ask that only 1 person talks at a time." | SUPPORTED |
| 4 | "everyone, not only a speech recognizer, has trouble" (Tips section) | [2] | Page says nothing about speech recognizers | NOT FOUND (FAIL) |
| 5 | Pixel Recorder: US English only, setting in Recorder, models stored temporarily, edits per paragraph | [3] | "work only in US English"; "stored temporarily on your device"; "apply to one paragraph at a time" | SUPPORTED |
| 6 | Live Transcribe help page: no speaker names; hold mic near speaker | [4] | Page has no speaker identification; "Hold your device microphone near the person or sound that you want to capture." | SUPPORTED |
| 7 | Captio AI 1.1.3, saved voices, names instead of Speaker 2, voices stay on phone | [5] App Store | What's New 1.1.3: voice recognition for frequent contacts, names instead of generic labels, "Voices stay on your phone." Matches FACTS row voice-recognition | SUPPORTED |
| 8 | Free plan: own voice + 1 other; Plus more; ~20 s; engine downloads once; Settings > Captions > Recognize voices; Separate Speakers on | FACTS | voice-recognition row | SUPPORTED |
| 9 | Audio processed in real time, not stored on servers; internet needed | FACTS | Privacy and line 17 | SUPPORTED |
| 10 | "a colleague's lines carry their name from the first sentence" (FAQ meetings, and meetings bullet implies it) | FACTS | No such line; FACTS only says captions show names. Live naming can start as "Speaker N" until the app is sure. Overclaim | NOT IN FACTS (FAIL) |
| 11 | "The name then applies to every line that speaker said in that recording" (doctor FAQ, "What if I did not save a voice") | FACTS | FACTS says only "Tap a speaker's tag in a saved recording to say who it is" | NOT IN FACTS (FAIL) |
| 12 | The app "keeps hearing a voice it does not know" and asks "Who's Speaker 2?" / "each answer helps it recognize that person next time" | FACTS | FACTS: "can also ask who an unknown speaker is, and every answer improves recognition" | SUPPORTED (the exact "Who's Speaker 2?" wording and the "later" in FAQ 2 are fine) |
| 13 | Table: Captioning Key "Broadcast and recorded media"; "The standard other tools are judged against" | [1] | Page is a captioning-quality guide; nobody judges Pixel or Captio AI against it. Editorial claim, no source | UNCITED / overclaim (FAIL) |
| 14 | "Put the phone on the table near the group, and in loud places keep it closer to the person" | none | [4] only says hold mic near the person; "on the table near the group" is uncited advice | UNCITED (FAIL) |
| 15 | Android availability unconfirmed, iPhone only | FACTS line 53 | OK | SUPPORTED |
| 16 | Competitors: Pixel Recorder and Live Transcribe confirmed on Google's own pages; fair, says where Google/CART better; "as seen October 2026" | [3][4] | Fair wording, no mocking | SUPPORTED |

Sources: all are primary (DCMP, Government of Alberta, Google help, App Store). Years of 2026 for DCMP and Alberta pages are unverified (neither page shows a date); either drop `year` accuracy claims or use "accessed 2026". No fake social proof. No medical or legal advice.

## B. Works
- blog:check: pass (1039 words, 5 sources, 7 FAQs, 5 internal links)
- build: pass (existing build used; next start served it)
- page checks: /blog/<slug> 200, one h1; JSON-LD has BlogPosting, FAQPage, BreadcrumbList; listed in /blog, rss.xml, llms.txt, sitemap.xml; opengraph-image 200 image/png; internal links /use-cases/group-settings, meetings, everyday-conversations, doctor-appointments, /blog/what-is-cart-captioning all 200. Server killed afterwards. Browser width check not run (no browser).
- Topic links: the topic lists /live-captions but the article never links to it (/live-captions itself returns 200).

## C. Value
| Criterion | Score | Evidence |
|---|---|---|
| Answers the question | 4 | Short answer names the standard, the label rule and the 1.1.3 feature; a bit long to quote alone |
| Information gain | 3 | Table of Captio AI / Pixel Recorder / Live Transcribe / standard is useful and the Pixel "US English only" point is new, but it covers few tools (no Apple Live Captions, Otter, Microsoft Teams/Zoom etc.), no language contrast, little beyond the product's own feature |
| Trust | 4 | Primary sources; but claims 4, 10, 11, 13, 14 weaken it |
| Specificity | 4 | 20 seconds, free plan 1 other person, version 1.1.3, US English only |
| Quotable structure | 4 | Question headings, answer-first, table, FAQ; "Which use cases" heading is not phrased as a question |
| Use cases and languages named | 3 | Four use cases named; only 3 of 7 FAQs name a use case; no language or country named anywhere except Pixel US English |
| Fit with the site | 3 | Good topic, 5 internal links, but /live-captions missing; no overlap found with other articles |
| Reader value | 4 | Clear setup steps and honest limits section |
Average 3.6 (needs 4). Information gain: 3 (needs 4).
Risk to the site: none beyond the unsupported claims above; not thin or duplicate.

## Required fixes (if FAIL)
1. Remove "everyone, not only a speech recognizer," in the tips section; say only that people have trouble in groups when more than 1 talks at once [2].
2. Remove "from the first sentence" (meetings FAQ and any similar wording); say lines carry the person's name once the app recognizes the voice.
3. Remove "The name then applies to every line that speaker said in that recording" (doctor FAQ and the "What if I did not save a voice" section) or first add it to CAPTIO_FACTS.md with the source (1.1.3 app behaviour); otherwise say only "tap a speaker's tag in a saved recording and say who it is".
4. In the table, drop "The standard other tools are judged against" and "Broadcast and recorded media" or reword to what [1] says (a guide to caption quality for media).
5. Cite or remove the "phone on the table near the group / closer in loud places" advice; if kept, cite [4] for "hold the microphone near the person you want to capture".
6. Add a link to /live-captions (topic requires it) in the Captio AI setup section.
7. Raise information gain to 4 and use-case/language coverage: add at least 2 more tools to the table, each verified on the maker's own page this review round (for example Apple's Live Captions and one meeting app or Otter-type tool; state where each does better), and add a sentence/row contrasting Pixel's US-English-only labels with Captio AI's 60 languages (FACTS languages row, but only if saved voices' language support is not claimed). Make at least 4 of 7 FAQs name a use case, and add one FAQ naming a language or code-switching case supported by FACTS (language row).
8. Make the "Which use cases does this help?" heading a question (for example "Which situations does saving a voice help with?").
9. Check the `year` of sources 1 and 2 against the pages (no dates shown) and use the access year if no publication year exists.

Verdict: FAIL (round 1)

---

# Round 2
Date: 2026-10-26

## A. Truth (changes only; round 1 SUPPORTED claims unchanged)
| # | Claim | Source | Evidence | Verdict |
|---|---|---|---|---|
| R1 | Speech-recognizer wording, "first sentence", "every line" claims, "judged against", uncited mic advice | - | All removed or now cited to [2]/[4]; FAQ wording now matches CAPTIO_FACTS | FIXED |
| R2 | Apple Live Captions: on device, in-person speech via microphone, may not be available in all regions or languages; page does not say whether it names speakers | [6] apple.com/accessibility/hearing | "real-time, on-device-generated transcriptions of conversations"; "capture and caption live, in-person speech through the microphone in your device"; "Some features, applications, and services may not be available in all regions or all languages." No mention of speaker names (first 100k of 144k chars read) | SUPPORTED (the article says "Live Captions may not be available"; Apple's wording is the general "Some features"; minor, see notes) |
| R3 | Teams: people can choose not to be identified in captions; accuracy drops with distance from mic | [7] | "People can choose not to be identified in captions." / "As your distance from the mic increases, captions may become less accurate." | SUPPORTED |
| R4 | Captio AI: 60 languages incl. mid-sentence switching; language flag on speaker tags since 1.1.3; names also in exports and AI actions; Settings > Captions > Recognize voices; ~20 s | CAPTIO_FACTS rows languages, language-flags, voice-recognition; repo CLAUDE.md for the app | All match; article honestly says saved-voice language coverage is not stated | SUPPORTED |
| R5 | "Apple Live Captions is better if you want captions built into the phone with nothing to install" | [6] | "on-device-generated" supported; "nothing to install" is common knowledge for a built-in feature | OK |

Competitor fairness: the article says where Apple, Pixel Recorder and Live Transcribe are better or silent, and states "not described/stated" rather than "does not", which is accurate. No fake social proof, no medical or legal advice.

## B. Works
- blog:check: pass (1195 words, 7 sources, 8 FAQs, 6 internal links)
- build: pass per coordinator (existing build served)
- page checks: /blog/<slug> 200; JSON-LD has BlogPosting, FAQPage, BreadcrumbList; listed in /blog, rss.xml, llms.txt, sitemap.xml; opengraph-image 200; /live-captions, 4 use-case pages and /blog/what-is-cart-captioning all 200. Server killed. No browser for the width check.

## C. Value
| Criterion | Score | Evidence |
|---|---|---|
| Answers the question | 4 | Short answer gives the standard, the label rule, and the 1.1.3 feature |
| Information gain | 4 | Side-by-side table of 6 tools checked on the makers' own pages, Pixel US-English-only limit vs 60 languages, "where each is better" lines, honest note that saved-voice language coverage is unstated |
| Trust | 4 | Primary sources, dated "October 2026", hedged where sources are silent |
| Specificity | 4 | 20 seconds, version 1.1.3, free plan 1 other person, US English only |
| Quotable structure | 4 | Question headings, answer-first, table, 8 FAQs |
| Use cases and languages named | 4 | 4 use cases with own bullets; 6 of 8 FAQs name a use case or language (dinner, team meeting, lecture/dinner, doctor, Spanish/English dinner, meetings) |
| Fit with the site | 4 | /live-captions and 4 use cases and CART article linked (6 links); no overlap found |
| Reader value | 4 | Setup steps and an honest "not the best choice" section |
Average 4.0. Information gain 4.
Risk to the site: none.

## Notes (not blocking, fix if convenient)
- Change "Live Captions may not be available in all regions or languages" to "Apple says some features may not be available in all regions or languages [6]".
- Sources 1 and 2 show no publication date; `year: 2026` is an access year.

Verdict: PASS
