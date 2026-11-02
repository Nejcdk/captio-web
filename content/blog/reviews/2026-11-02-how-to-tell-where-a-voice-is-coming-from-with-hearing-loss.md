# Review: How to tell which side a voice is coming from at a busy table
Date: 2026-11-02

## A. Truth
| # | Claim | Source | Evidence (quote) | Verdict |
|---|---|---|---|---|
| 1 | 2020 JASA study, 8 normal-hearing + 15 bilateral sensorineural | [1] PMC7058429 | "8 listeners with normal hearing and 15 with bilateral sensorineural hearing loss" | SUPPORTED |
| 2 | HL listeners "were less accurate at locating the target" | [1] | abstract: "listeners with hearing loss were less accurate at locating the target" | SUPPORTED |
| 3 | More front-back confusions; less accurate in multitalker than quiet | [1] | HI averaged over 35% front-back vs about 3-25% NH; "less accurate in the multitalker background than in quiet" | SUPPORTED ("larger errors" for HI group is a mild extension, acceptable) |
| 4 | 2017 Ear and Hearing: UHL impairs localization "at a minimum"; extent "not fully appreciated by others" | [2] PMC5321788 | "At a minimum, unilateral hearing loss (UHL) impairs sound localization ability"; "the extent of the difficulty has not been fully appreciated by others" | SUPPORTED |
| 5 | UHL localized better on hearing side | [2] | "particularly for stimuli presented on the NH/open side" | SUPPORTED |
| 6 | Alberta: everyone has trouble in groups, esp. >1 person talking; more effort in groups | [3] | "Everyone has trouble hearing in groups, especially when more than 1 person is talking at the same time." / "It takes more effort to listen in groups." | SUPPORTED |
| 7 | Sit across from guests; avoid kitchen, lounge, front door; go when less busy; ask 1 person at a time | [3] | "sit across from your guests rather than beside them"; "Avoid seats near the kitchen, lounge, or front door"; "go during less busy times"; "Ask that only one person talk at a time" | SUPPORTED |
| 8 | Apple iPhone 16 specs list Spatial Audio recording | [4] | "Spatial Audio and stereo recording" (Video Recording section) | SUPPORTED |
| 9 | 1.1.4 release notes: "on iPhone 16 and later, waves at the edge of the captions show where the voice is coming from" | [5] App Store | exact text found in 1.1.4 notes | SUPPORTED |
| 10 | iPhone 16+ and iOS 26+, flat on table, battery, on by default, Settings > Captions, not on iPad/Android, only while words written, tag colour | CAPTIO_FACTS speaker-direction row; [6] page; app mockup notice | all match the Feature map row | SUPPORTED |
| 11 | Saved voices give names on tags | CAPTIO_FACTS voice-recognition | "captions then show their names instead of Speaker 2" | SUPPORTED |
| 12 | 100 free credits a day; Plus removes the daily limit; needs internet for live captions; Speaker 1/2 labels | CAPTIO_FACTS | lines 17, 34, 61, 62 | SUPPORTED |

No competitor claims, no prices, no fake social proof, no medical or legal advice (study caveat and "not a diagnosis" present). Sources are primary (PMC papers, government health page, Apple, the app's own store listing and page). No Wikipedia. Minor: "iOS 26 or later" in setup step 1 is cited [5], but the release notes do not say iOS 26 (it comes from CAPTIO_FACTS); not a false claim.

## B. Works
- blog:check: pass (1173 words, 6 sources, 8 FAQs, 7 internal links, 6 external). Warnings: answer is 82 words (aim 40-80); 2 images (aim 3).
- build: pass.
- page checks (next start, port 3199): /blog/<slug> 200, one h1, Short answer present, BlogPosting + FAQPage + BreadcrumbList in JSON-LD; listed in /blog, /blog/rss.xml, /llms.txt, /sitemap.xml; opengraph-image returns 200 image/png; all internal links (3 blog posts, /live-captions, 3 use cases) and both images return 200.
- Images: SD_mockup_1.png (real app screenshot in a phone frame: captions with Speaker 1, wave on the left edge, Speaker direction notice with Turn off) and SD_mockup_2.png (two speakers, wave on the left edge). Alt text matches what they show, both captioned "Sample content". PASS. A third image, public/SD_mockup_3.png, exists and is unused.
- Plagiarism: searched "at a minimum, unilateral hearing loss impairs sound localization" (matches only the cited paper abstract, a short attributed quote: fine); "you hear that someone spoke but not where to look" (no match); "Speaker direction does not tell you the exact position of a voice" (no match). Other distinctive sentences ("Speaker direction answers where, and saved voices answer who"; "It shows the side a voice comes from, not a map of the room") are original product wording with no match in the SERP set. No near-verbatim copies.
- Search checklist: answer-first yes, 6 sources / 6 external links, 7 internal links, tags appear in text, JSON-LD parses. PASS.

## C. Value
SERP check ("hearing loss locate sound direction group conversation captions"): results are patents, research prototypes (GlassEar CHI 2015, Tsukuba LED wearable, Google SpeechCompass) and UCSF seating advice; no consumer how-to combining localization research, seating habits and a shipping captions feature.

| Criterion | Score | Evidence |
|---|---|---|
| Answers the question | 4 | Short answer gives three-part fix, the 2020 finding and the iPhone 16 limit; quotable alone, but 82 words. |
| Information gain | 4 | Only page pairing cited localization studies and government seating advice with a shipping direction-in-captions feature, with honest limits (iPhone 16+, not iPad/Android, battery, side not position). |
| Trust | 5 | Primary sources verified, quotes exact, study limits stated, no hype, release notes quoted. |
| Specificity | 4 | Study sizes, front-back confusions, named features, settings path, 3-row situation table. |
| Quotable structure | 4 | Question headings, answer-first sections, table, 8 FAQs. |
| Use cases and languages named | 4 | Group settings, restaurants, meetings each have a table row and FAQs; 5 of 8 FAQs name a setting. No languages (none required). |
| Fit with the site | 5 | Distinct from the "who is talking" article (which it links), 7 relevant internal links, natural lead to use cases. |
| Reader value | 4 | Practical seating tips plus a clear yes/no on whether their phone works. |

Average 4.25; none below 3. Information gain: a localization-research plus seating-advice plus real iPhone feature guide with its limits stated.
Risk to the site: none.

## Suggested non-blocking tweaks
1. Trim the `answer` by about 3 words to 80 or fewer.
2. Add SD_mockup_3.png (with accurate alt text, sample content) as a third image.
3. Move the "iOS 26 or later" attribution out of the [5] citation in step 1.

Verdict: PASS
