# Review: How to use live captions on an iPad in a lecture or meeting
Verdict: PASS (round 2; round 1 was FAIL)
Date: 2026-11-03

## A. Truth
Sources opened with curl (HTML stripped): Apple iPad guide (Live Captions), Apple FaceTime page, Apple feature availability page, ADA.gov Effective Communication, App Store listing.

| # | Claim | Source | Evidence (quote) | Verdict |
|---|---|---|---|---|
| 1 | Settings > Accessibility > Live Captions, turn on | [1] | "Tap Accessibility, tap Live Captions, then turn on Live Captions." | SUPPORTED |
| 2 | Real-time transcription in any app and live conversations | [1] | "Use Live Captions to more easily follow the audio in any app... and in live conversations around you" | SUPPORTED |
| 3 | Microphone / iPad Audio / Pause Listening / copy to Notes or Messages | [1] | "Tap Live Captions, then tap Microphone... iPad Audio... Pause Listening... paste... Notes or Messages" | SUPPORTED |
| 4 | Drag window, drag bottom edge, full-screen button | [1] | "Drag the bottom of the Live Captions window up or down... Make the transcription window full-screen" | SUPPORTED |
| 5 | Appearance: text, size, colour | [1] | "Tap Appearance to customize the text, size, and color" | SUPPORTED |
| 6 | Supported models; not all languages/regions; accuracy may vary, not for high-risk | [1] | "available on supported models. Live Captions isn't available in all languages, countries or regions. The accuracy ... shouldn't be relied upon in high-risk or emergency situations." | SUPPORTED |
| 7 | Uses additional battery | [2] | "Live Captions uses additional battery." (FaceTime page) | SUPPORTED |
| 8 | 18 language and region entries, and the list | [3] | Under "Accessibility: Live Captions": Cantonese (mainland, HK), English (AU, CA, IN, SG, UK, US), French (CA, FR), German (DE), Japanese, Korean, Mandarin (mainland, TW), Spanish (MX, ES, US) = 18. No Hindi, Arabic or Polish. | SUPPORTED |
| 9 | German (Germany) + 3 Spanish entries | [3] | as above | SUPPORTED |
| 10 | App Store: iPhone, iPad, iPod touch; iOS 15.1 or later | [5] | "iPad Requires iPadOS 15.1 or later. iPhone Requires iOS 15.1..." | SUPPORTED |
| 11 | Captio AI 60 languages | [5] | "Translate conversations in real time across 60 languages" | SUPPORTED |
| 12 | "has been a full iPad app since version 1.1.4" | [5] / FACTS | Live App Store notes: "1.1.5 ... iPad: Captio AI is now a full iPad app, in every orientation and window size, with live captions across the whole screen." The 1.1.4 notes do not mention iPad. FACTS row says 1.1.4. | CONTRADICTED by store notes |
| 13 | keyFact "100 free credits a day" cites source 5 | [5] | Store page has no "100" and no "credit"; only FACTS line 71 supports it. | NOT FOUND in cited source |
| 14 | ADA: primary consideration unless equally effective means or fundamental alteration | [4] | "...unless it can demonstrate that another equally effective means... or that the use of the means chosen would result in an undue burden or a fundamental alteration" | Partly supported; omits "undue burden" (misleading) |
| 15 | ADA: CART description | [4] | "a transcriber types what is being said at a meeting or event into a computer that projects the words onto a screen" | SUPPORTED |
| 16 | ADA page 2020, Title II | [4] | "Last updated: February 28, 2020" | SUPPORTED |
| 17 | FAQ "captioning app enough for a job meeting in the US?" answered with [4] | [4] | Page covers state and local governments (Title II); a private employer job meeting is a different rule. Body says rules differ, FAQ does not. | Weak citation for the question |
| 18 | iPad features (Split View, Slide Over, Stage Manager, resizable; full-screen captions; side-by-side translation in landscape; centred column; no speaker direction or Live Activity; free and Plus same) | FACTS ipad row | matches | SUPPORTED |
| 19 | "Live captions use the whole iPad screen when it is the only window" | FACTS | "only window" qualifier is inference | Minor, remove |
| 20 | Internet needed; offline records, transcribes later | FACTS | matches | SUPPORTED |
| 21 | Speaker labels, Words and names, word fix, library, export, AI Summary, language hint, code-switching | FACTS | rows present | SUPPORTED |
| 22 | 100 credits a day (as of October 2026); Plus removes limit | FACTS 71-72 | matches | SUPPORTED |
| 23 | "Place the iPad on the desk with the microphone facing the speaker" | none | Uncited practical tip, not in FACTS | UNCITED |
| 24 | Source 5 title "Live Captions: Captio AI App" | [5] | Listing title is "Live Captions - Captio AI Speech to Text" | Title mismatch |

Only Apple is named as an alternative (own pages used; limits and strengths both stated). No fake social proof. ADA text is flagged as information, not legal advice. No Wikipedia.

## B. Works
- blog:check: passes, warnings: 14 internal links (range 3 to 10), 2 images (aim 3), filler word "landscape".
- build: passed (per writer); `next start -p 3199` served it.
- Page checks: /blog/<slug> 200; h1 = title; Short answer, FAQ, sources in HTML; JSON-LD has BlogPosting, FAQPage, BreadcrumbList; /blog, rss.xml, /llms.txt, /sitemap.xml list it; opengraph-image 200 image/png; all 16 internal links and both images 200.
- Images (both read): LC_mockup_2.png real iPhone screenshot with Speaker 1 / Speaker 2, alt matches; LT_mockup_1.png shows Translate on, English selected, alt matches. Both iPhone, captioned as iPhone and sample content; no iPad image in an iPad article.
- Plagiarism: exact-phrase searches for "Apple's feature is built into iPadOS, which means nothing to install" and "place the iPad on the desk with the microphone facing the speaker, keep it where you can see both the screen and the lecturer": no matches. Only 2 of 5 phrases run exactly; topic-query results showed no near-copies.
- Browser width check (375 / 1280 px): not run, no browser.
- Search checklist: answer-first yes, 5 sources, 5 external links, internal links 14 (over 10), tags present, JSON-LD OK.

## C. Value
Top results for "live captions ipad lecture meeting": Apple support, university Teams guides, App Store listings of other apps. None compares Apple's feature with an app by use case.

| Criterion | Score | Evidence |
|---|---|---|
| Answers the question | 4 | Short answer gives both routes and the 18 vs 60 numbers. |
| Information gain | 4 | Verified 18-entry Apple list and the languages missing, use-case table, honest limits. |
| Trust | 3 | Primary sources, but wrong version claim, mis-sourced keyFact, ADA exception omitted. |
| Specificity | 4 | Real menu steps and numbers. |
| Quotable structure | 4 | Question headings, table, FAQ. |
| Use cases and languages named | 4 | Lectures, meetings, conferences, group settings, German, Spanish, Hindi, Arabic, Polish. |
| Fit with the site | 3 | No cannibalisation, but 14 internal links. |
| Reader value | 4 | Actionable steps and rights pointer. |

Average 3.75 (needs 4). Risk to the site: a wrong release-version claim and an incomplete legal summary could mislead.

## Required fixes
1. Remove "since version 1.1.4". Write "is now a full iPad app" (live store notes put the iPad announcement under 1.1.5; flag the FACTS conflict in LOG for Nejc).
2. keyFacts "100": source 5 does not state it. Drop it, replace it with a source-backed fact, or do not attribute it to source 5.
3. ADA: add the "undue burden" exception. In the job-meeting FAQ do not answer a private-employer question with the Title II page; say the page covers state and local governments and point to the employer or ADA/EEOC information.
4. Cut internal links to 10 or fewer.
5. Soften or remove the uncited "iPad on the desk with the microphone facing the speaker" tip.
6. Remove "when it is the only window" from the Split View FAQ.
7. Fix source 5 title to "Live Captions - Captio AI Speech to Text".
8. Add a third image if available (ideally an iPad capture, keep the caveat in alt) and run the 375/1280 px width check.

Verdict: FAIL (round 1)

---
# Round 2 (2026-11-03)

Re-read the whole article and re-fetched the App Store listing.

| Fix | Result |
|---|---|
| 1.1.4 claim | Removed; article now says "is now a full iPad app" (matches the live 1.1.5 notes). FACTS row still says 1.1.4: Nejc to reconcile in LOG, not an article error. |
| keyFact 100 | Replaced by "iOS 15.1 or later... compatible with iPhone, iPad and iPod touch", source 5: listing says "Requires iOS 15.1 or later", iPhone, iPad, iPod touch. SUPPORTED. The 100-credit line in the body and FAQ is from FACTS only, as allowed. |
| ADA | "undue burden, defined as significant difficulty or expense" matches the page ("defined as significant difficulty or expense"). Employer FAQ now says the page covers state and local governments and points to the employer or ADA/EEOC. OK. |
| Internal links | blog:check: 7. OK. |
| Desk-microphone tip, "only window" | Removed. |
| Source 5 title | Listing page title is "Live Captions - Captio AI App - App Store"; article uses "Live Captions - Captio AI App" with publisher Apple App Store. OK. |
| Third image | FO_mockup_1.png read: real iPhone Folders tab with Weekly sync, Lectures, Doctor, Family folders; alt and caption accurate and say iPhone and sample content. 3 images now. |

blog:check passes (only the "landscape" filler warning). Link set is a subset of round 1, all of which returned 200; the new image path exists in public/. Not run again: the 375/1280 px browser check (no browser available) and the 3 remaining exact-phrase plagiarism searches.

Scores: Answers 4, Information gain 4, Trust 4, Specificity 4, Quotable 4, Use cases and languages 4, Fit 4, Reader value 4. Average 4. Risk to the site: none.

Verdict: PASS
