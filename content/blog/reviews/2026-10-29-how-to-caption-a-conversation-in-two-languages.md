# Review: How to follow a conversation that switches between languages
Verdict: FAIL (round 1)
Date: 2026-10-29

## A. Truth
| # | Claim | Source | Evidence (quote) | Verdict |
|---|---|---|---|---|
| 1 | 78.3% speak only English at home (age 5+, 2018-2022); 21.7% derived | [1] Census | "Over three-quarters (78.3%) of the nation age 5 and older spoke only English at home"; derivation disclosed in text | SUPPORTED |
| 2 | 61.1% of other-language speakers speak Spanish | [1] | "Among those that spoke a language other than English in 2018-2022, Spanish (61.1%)" | SUPPORTED |
| 3 | 61.0% of Spanish speakers spoke English "very well"; "roughly 4 in 10" below | [1] | "61.0% of Spanish speakers, 48.2% of Chinese speakers" | SUPPORTED (4 in 10 is our arithmetic, 39%) |
| 4 | Live Transcribe: primary + optional secondary language | [2] | "To set your primary language, tap Primary language"; secondary language optional | SUPPORTED |
| 5 | Switch by tapping the language at the bottom | [2] | "tap the language (such as English) at the bottom of your screen" | SUPPORTED |
| 6 | Preinstalled on Pixel and some other Android phones | [2] | "already installed on Pixel phones and select other Android phones" | SUPPORTED |
| 7 | Offline: several languages on Pixel and select devices, Android 12+ | [2] | "all Pixel devices that run on Android 12 or later, you can download multiple languages" | PARTLY: "select devices" not confirmed, page names Pixel; reword to "Pixel phones with Android 12 or later" |
| 8 | Code-switching = bilinguals alternating between languages; "not indicative either of the bilingual's inability to separate his languages or of a lack of proficiency" | [3] | exact quote found; definition reads "alternate effortlessly between their two languages" | SUPPORTED |
| 9 | Apple Live Captions "can even capture and caption live, in-person speech through the microphone in your device"; "may not be available in all regions or all languages"; no language list | [4] | quotes found, no list | SUPPORTED |
| 10 | Captio AI "each person sees the other side in their own language"; "60+ languages"; 1.1.3 flag release note | [5] App Store | all three found | SUPPORTED |
| 11 | Table: Captio AI platforms "iPhone and Android [5]" | [5] | App Store page does not mention Android (lists iPhone, iPad, Mac, Vision, Watch, TV) | NOT FOUND in [5]. Fact is in CAPTIO_FACTS (Google Play), but the citation is wrong |
| 12 | Answer box: Captio AI "supports speech that switches languages mid-sentence ... [5]" | [5] | App Store page does not address mid-sentence switching | NOT FOUND in [5]. In CAPTIO_FACTS (languages row) only; citation misleading, and the flag claim has no "iPhone" qualifier in the answer |
| 13 | FAQ 1: mid-sentence switching "in all 60 of its languages" | CAPTIO_FACTS | Fact says "60 languages, including speech that switches languages mid-sentence"; "in all 60" is stronger | Overreach, soften |
| 14 | Flags, tap to fix language, iPhone, 1.1.3 | CAPTIO_FACTS + [5] | matches language-flags row | SUPPORTED |
| 15 | Language hints, Separate Speakers, Words and names, word fix, widget (iPhone), offline recording, 100 free credits a day, internet needed for live | CAPTIO_FACTS | matching rows | SUPPORTED |
| 16 | "Add the corrected language to Language hints" after a fix | CAPTIO_FACTS | not stated as a step; a tip, harmless | UNCITED but advice, OK |
| 17 | "A phone in a pocket hears muffled speech" | none | common sense; search found only anecdotal forums | Acceptable common knowledge |

Sources: all five are primary or authoritative (Census, Google help, Cambridge UP, Apple, App Store). No Wikipedia. No fake social proof. No medical/legal advice (disclaimer present). Competitors (Google Live Transcribe, Apple): fair, says where Live Transcribe is better, nothing mocking. Table says "Not stated on the help page" where appropriate. No provider names. Dates "as of October 2026" present.

## B. Works
- blog:check: pass (1491 words, 8 sections, 5 sources, 7 FAQs, 8 internal links, 5 external, 2 images; warning: 2 images, aim for 3)
- build: pass (already built, served from .next)
- page checks: /blog/<slug> 200; h1 equals title; Short answer present; JSON-LD parses with BlogPosting, FAQPage, BreadcrumbList; article is listed in /blog, /blog/rss.xml, /llms.txt, /sitemap.xml; opengraph-image 200 image/png; all 8 internal links and both images return 200. Description is 150 chars, title 60. Browser width check not run (no browser).
- Images: LC_mockup_2.png is a real product screenshot (Speaker 1 / Speaker 2, sample text), captioned "sample content". It does NOT show language flags, while step 4 and the surrounding text talk about flags; the alt text does not claim flags, so it is accurate but weak for this topic. LT_mockup_1.png is a real screenshot showing the Translate switch on and English selected; alt matches. Neither shows a mixed-language moment. Only 2 images (aim 3, not required).
- Plagiarism (5 sentences searched in quotes, WebSearch): "A phone in a pocket hears muffled speech" no match; "captions should follow people, not correct them" no match; "a deaf or hard of hearing person at the table loses the thread twice" no match; "the switch is normal speech, not an error to be smoothed over" no match; "Captioning a mixed English and Spanish conversation takes three things" (phrase not found in the search results above beyond the same pattern) no match. PASS.
- Search checklist: answer-first yes, 5 sources and 5 external links, 8 internal links, tags appear in text, meta in range. PASS.

## C. Value
Search run: "live captions two languages mixed conversation deaf bilingual Spanish English captions app". Results were vendor listings (Hearo, MirrorCaption, JotMe, Soniox's own app page) and one news item on Live Transcribe; none is a deaf-focused guide comparing set-up for mixed English and Spanish, none cites Census numbers or the code-switching research. (Top-5 pages were not all opened; AI search engine not available.)

| Criterion | Score | Evidence |
|---|---|---|
| Answers the question | 4 | Short answer and first paragraph answer it; answer box lacks "iPhone" for flags and cites [5] for something [5] does not say |
| Information gain | 4 | Compiled side-by-side of what each tool states on its own page, US Census context, honest "not stated" cells and where Live Transcribe is better |
| Trust | 4 | Primary sources, dated, fair; docked for the two mis-attributed citations |
| Specificity | 4 | Concrete numbers, English/Spanish, settings named, step list |
| Quotable structure | 4 | Question headings, answer-first sections, two tables, 7 FAQs |
| Use cases and languages named | 4 | Group settings, everyday conversations, travel, lectures/meetings in table; Spanish pages linked; most FAQs name Spanish/English/travel |
| Fit with the site | 4 | Distinct from the speaker-labels articles; 8 relevant internal links |
| Reader value | 4 | A bilingual family could act on it |

Average 4.0, minimum 4. Information gain: a fair, source-by-source side-by-side for mixed-language captioning including the honest "Not stated" and Live Transcribe's real advantages.
Risk to the site: low once the citation issues are fixed (a citation that does not support its claim would undermine the trust signal the blog depends on).

## Required fixes (if FAIL)
1. Table row "Platforms": remove "[5]" from "iPhone and Android" (the App Store page does not mention Android), or cite the Google Play listing as a new opened source; do not cite the App Store for Android.
2. `answer` field: it cites [5] for mid-sentence switching and flags, but [5] only supports the flag/fix release note. Move the citation so it sits only after the flag claim, add "on iPhone" to the flag and re-write claims, and leave the mid-sentence claim uncited or attribute it to Captio AI's own fact sheet in wording (not a footnote to the store page). Check the table row "Two languages" (no cite, fine) is consistent.
3. FAQ 1: change "in all 60 of its languages" to "among its 60 languages" (the fact sheet does not say every language does it).
4. Offline cell for Live Transcribe: reword to "Several languages can be downloaded on Pixel phones with Android 12 or later" (the page names Pixel, "select devices" is not confirmed).
5. Recommended, not blocking: replace or add an image that shows language flags or a mixed-language moment if one exists in `public/`; otherwise rephrase step 4 so it does not point readers at the first screenshot for flags. Aim for 3 images.

Verdict: FAIL (round 1)

---

# Round 2
Verdict: PASS
Date: 2026-10-29

- blog:check: pass (1493 words, 5 sources, 7 FAQs, 8 internal links; only the "2 images, aim for 3" warning).
- Fix 1 verified: Platforms cell now "iPhone and Android" with no [5]; the claim is backed by CAPTIO_FACTS (App Store and Google Play).
- Fix 2 verified: the answer now cites [5] only after "On iPhone it adds a flag ... fix a recording's language afterwards"; the 1.1.3 release note is on the App Store page ([5], SUPPORTED in round 1). The mid-sentence claim is uncited and matches CAPTIO_FACTS.
- Fix 3 verified, but the FAQ 1 wording is now clumsy: "among its supported cases, among its 60 languages". Not a truth problem.
- Fix 4 verified: "Pixel phones with Android 12 or later" matches Google's page.
- Fix 5 verified: step 4 now says "On iPhone from version 1.1.3" before the flag; no longer sends readers to a screenshot for flags. Text and image consistent.
- Nothing else changed; round 1 checks (sources, page checks, plagiarism, scores 4/4/4/4/4/4/4/4) stand. Risk to the site: none.

Non-blocking: reword FAQ 1 to "Captio AI lists speech that switches languages mid-sentence among its 60 languages, including English and Spanish." Optionally add a third image.
