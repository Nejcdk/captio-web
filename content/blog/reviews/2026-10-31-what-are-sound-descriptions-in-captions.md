# Review: What are sound descriptions in captions? SDH rules explained
Verdict: FAIL (round 1)
Date: 2026-10-31

## A. Truth
Sources opened with WebFetch on 2026-10-31. [n] = article source number.

| # | Claim | Source | Evidence (quote) | Verdict |
|---|---|---|---|---|
| 1 | Sound effects = "sounds other than music, narration, or dialogue"; captioned "if it is necessary for the understanding and/or enjoyment of the media" | [1] DCMP | same words on page | SUPPORTED |
| 2 | Brackets incl. source; source may be omitted if visible; lower case; off-screen italic | [1] | "in brackets, should include the source"; "may be omitted if it can be clearly seen onscreen"; "must be lowercased"; "Offscreen sound effects should be italicized, if italics are available" | SUPPORTED |
| 3 | Present tense only; participle for sustained, third person for abrupt; "Never use the past tense when describing sounds" | [1] | same | SUPPORTED |
| 4 | Background music under 5 s not captioned; avoid "beautiful", "melodic"; specific not vague words | [1] | "Do not caption background music with a duration under 5 seconds"; "Avoid subjective words, such as 'delightful,' 'beautiful,' or 'melodic'" | SUPPORTED |
| 5 | Background sound only when essential to the plot, "because a caption that fills the screen with sounds takes time away from the dialogue" | [1] | Page says "only when they are essential to the plot"; no reason given | PARTLY NOT FOUND: the rationale is the writer's, attributed to [1] |
| 6 | 47 CFR 79.1: nonverbal info incl. "the existence of music, sound effects, and audience reaction", "to the greatest extent possible" | [3] | same | SUPPORTED |
| 7 | Four standards accurate, synchronous, complete, appropriately placed; "begin to appear at the time that the corresponding speech or sounds begin" | [3] | same | SUPPORTED |
| 8 | ADA lists open, closed and real-time captioning (CART) | [8] | "open captioning, closed captioning, real-time captioning..." | SUPPORTED |
| 9 | Netflix: brackets for speaker IDs or sound effects; lower case except proper nouns; never italicise; describe sound not visual; plot-pertinent, always unless inferred by visuals | [2] | "Use brackets [ ] to enclose speaker IDs or sound effects"; "Use all lowercase, except for proper nouns"; "Never italicize..."; "Describe the sounds and audio as opposed to visual elements"; "unless inferred by the visuals" | SUPPORTED |
| 10 | Netflix tense: no rule found | [2] | "doesn't state a tense rule" | SUPPORTED |
| 11 | Netflix music row: "Lyrics enclosed in a music note (♪)" | [2] | Section I.15 says this | SUPPORTED but not like for like: the DCMP cell is about background music descriptions, the Netflix cell about lyrics. Misleading comparison |
| 12 | Google Live Caption: optional sound labels for laughter, applause, music; "Show sound labels" | [4] | "To show detected sounds, like laughter, applause, and music, tap Show sound labels." Same page also says "Live Caption doesn't work on music." | SUPPORTED, but the music caveat is omitted, a relevant weakness |
| 13 | Live Transcribe labels "Laughing", "Doorbell", "Music"; Settings > Additional settings > Show sound labels | [5] | "human sounds like 'Laughing'... doorbells and music"; "Additional settings, then Show sound labels" | SUPPORTED |
| 14 | Apple Live Captions = real-time on-device transcriptions of conversations; page does not mention sound descriptions | [6] | Read the whole page (both halves): no mention of sound labels with Live Captions | SUPPORTED |
| 15 | Sound Recognition notifies for 15 sounds | [6] | "recognizes 15 different sounds" | SUPPORTED |
| 16 | Captio AI 1.1.5: doorbell, alarm, crying baby, barking dog, laughter, music in captions, like [doorbell rings]; vibrate for alerts; Settings, Recognize sounds | [7] | "now show in your captions"; "[doorbell rings]"; "Alerts make your phone vibrate"; "Settings → Recognize sounds" | SUPPORTED, matches CAPTIO_FACTS recognize-sounds row (iPhone only) |
| 17 | Captio AI does not caption phone calls; for in-person speech | CAPTIO_FACTS line 11 | | SUPPORTED |
| 18 | Lecture FAQ: "Not by default" laughter/applause appears; "only captioned if the captioner or the tool includes it" | none | | UNCITED (opinion stated as fact) |
| 19 | Restaurants bullet: music and laughter "tell you why a table is loud or that a joke just landed" cited [7] | [7] | Release notes say nothing about restaurants or jokes | NOT FOUND (inference attributed to the source; also not in the facts file, which only lists the use case tag) |
| 20 | Everyday bullet: doorbell/alarm "explains why a conversation stopped" [7] | [7] | not in notes | NOT FOUND, same issue (mild) |
| 21 | "SDH stands for subtitles for the deaf and hard of hearing... add who is speaking and sounds" cited [2] | [2] | Netflix guide has an SDH section with speaker IDs and sound effects | SUPPORTED (definition itself is common knowledge) |
| 22 | "Google's pages are the better choice when you use Android" | [4][5][6] | Opinion/judgment, fair to competitors | OK |

Other A checks:
- Sources: DCMP, Netflix, Google, Apple, ADA.gov and the App Store listing are primary. [3] is Cornell LII, a respected mirror, not the official text. Preferred: eCFR or ecfr.gov/govinfo. Not a fail, but should be swapped if easy.
- No fabricated social proof. No medical/legal advice (ADA statement is sourced; the smoke alarm line points to dedicated devices). Competitors treated fairly, with where they are better. No prices.
- Netflix "Partner Help Center" is correct. All source years 2026 are plausible.

## B. Works
- blog:check: pass (1405 words, 8 sources, 6 FAQs, 9 internal links, 8 external, 1 image). Warning: only 1 image (aim 3).
- build: .next present and served (npx next start -p 3199). Not rerun by me.
- Page checks: /blog/<slug> 200; h1 equals title; Short answer present; JSON-LD parses and has BlogPosting, FAQPage, BreadcrumbList (plus Question x6). /blog, /blog/rss.xml, /llms.txt, /sitemap.xml all list the slug. opengraph-image returns 200 image/png. All 9 internal links return 200 (/live-captions, 5 use-case pages, 2 blog articles, /RS_mockup_1.png). `<title>` is "...| Captio AI", meta description length in range.
- Browser check at 375/1280 px: not done (no browser available). Three tables, one 4-column wide: reflow not verified.
- Image: /RS_mockup_1.png is a real app mockup (iPhone captions: "Are we still going to the market tomorrow morning? [doorbell rings]", Speaker 2 "Wait, was that the door?"). Alt text matches what it shows, caption says "Sample content". PASS for accuracy. But only 1 image, and it is the same mockup as the sibling doorbell article (not checked beyond title; assumed).
- Plagiarism (5 sentences searched in quotes; first search was on the opening sentence): "Sound descriptions are the short notes inside captions that tell you what you cannot hear"; "A sound description gives that cue to a deaf viewer in the same moment"; "tells you the sound is happening now and you may want to look up"; "takes time away from the dialogue" + "essential to the plot"; and the topic query itself. No near-verbatim match found. PASS.
- Search checklist (PLAYBOOK 12): answer-first yes; 8 sources and 8 external links yes; 9 internal links yes; JSON-LD yes; question headings yes. Item 6.10 (FAQs naming a use case/language/country) FAILS, see C.

## C. Value
Search run on the query: top results are vendor SDH pages (Sonix, Happy Scribe, Matesub, Kapwing, VoiceBox, Lingual, videocaptions.ai, Wikipedia). All explain SDH generically; none compare DCMP vs Netflix vs FCC in a table or cover live apps' sound labels.

| Criterion | Score | Evidence |
|---|---|---|
| Answers the question | 4 | Short answer and opening define the term with the FCC rule and DCMP test; does not say outright what SDH differs from closed captions (US vs UK terminology) which the top results cover. |
| Information gain | 4 | The DCMP vs Netflix table and the live-app table (Captio, Live Caption, Live Transcribe, Apple) with the honest "not stated" cells are not in the top results. Weakened by the apples-to-oranges music row and the omitted Live Caption music caveat. |
| Trust | 4 | Primary sources, quotes check out; deductions for rationale attributed to DCMP (claim 5), inferences cited to the release notes (19, 20) and the Cornell mirror. |
| Specificity | 4 | Concrete rules, numbers (5 seconds, 15 sounds, 4 standards). |
| Quotable structure | 4 | Question headings, tables, FAQ. Missing the "SDH vs closed captions vs subtitles" follow-up question that people actually search. |
| Use cases and languages named | 2 | Only 2 of 6 FAQs name a use case (lecture/conference; family dinner/restaurant). The rule is at least half (PLAYBOOK 6.10, REVIEW C). No language or country other than the US appears; 4 of 6 FAQs and the body sections on rules are generic. TV and media is covered only as a bullet. |
| Fit with the site | 3 | Internal links good (9), but the closing paragraphs overlap the existing doorbell article (same release-notes facts, same mockup) and the page leans on the same [7] facts; only the SDH rules angle is new. Needs sharper differentiation. |
| Reader value | 4 | A deaf reader learns what to expect and which app shows sounds. |

Average 3.6 (below 4). Fit and use-case scores are under the bar; no score below 3 other than use-case coverage (2).

Information gain: the side-by-side DCMP/Netflix style table plus an honest live-captioning-app comparison of sound labels, citing each vendor's own page.
Risk to the site: low, but with unsupported attributions (claims 5, 19, 20) and partial cannibalisation of the 2026-10-30 doorbell article it should not publish as is.

## Required fixes (round 2)
1. FAQs: make at least 3 of 6 (better 4 of 6 or add FAQs to reach 8) name a use case, language or country. Examples: "Do closed captions for US TV shows describe sounds as well as subtitles do on UK streaming?"; "Is an SDH track what a deaf person watching Netflix in English in the UK should look for?"; "Do captions in a doctor's appointment..." (only if sourced). Rewrite the three generic ones (SDH, tense, Apple) so they name TV and media, a country or a setting.
2. Claim 5: delete "because a caption that fills the screen with sounds takes time away from the dialogue" or present it as the writer's reading, not DCMP's [1].
3. Claims 19 and 20: remove the [7] citations from the restaurants and everyday bullets, or reword to what the release notes say ("a doorbell, an alarm... now show in your captions") and put the setting inference in plain words without a footnote. The lecture/conference sentence "only captioned if the captioner or the tool includes it" needs a source or should be softened ("depends on the captioner or the tool").
4. Live Caption: add the sourced caveat that Google's page says "Live Caption doesn't work on music", so the music label claim is not overstated for Android.
5. Music row of the DCMP/Netflix table: compare like with like or relabel the row ("Music lyrics vs background music") and say Netflix's guide gives no background-music-length rule in the sections reviewed.
6. Add a short section or FAQ answering "SDH vs closed captions vs subtitles" (US vs UK wording) with a source, since that is the core of the query and the top results cover it.
7. Differentiate from /blog/how-to-see-a-doorbell-alarm-or-crying-baby-in-live-captions: link to it once early and trim repeated app detail, or the pair will cannibalise each other.
8. Add at least one more image (aim for 3), for example a chart or table graphic from the cited rules or a second real app capture; not a stock photo. Do not reuse the same mockup if the sibling article uses it.
9. Swap [3] to eCFR/govinfo if available (primary text), keeping the same quotes.
10. A browser check at 375 px for the three tables could not be done here; confirm tables scroll inside their boxes.

Verdict: FAIL (round 1)

---

# Round 2
Date: 2026-10-31

## A. Truth (changes and re-checks)
| # | Claim | Source | Evidence (quote) | Verdict |
|---|---|---|---|---|
| R2-1 | Subtitles "are designed for hearing users"; SDH adds "speaker tags, sound effects and other elements outside of speech" | [9] Verbit | same words on the page | SUPPORTED |
| R2-2 | Closed captions typically white text on black background; plain subtitles cover only spoken words | [9] | "typically formatted as white text on a black background"; subtitles "only cover spoken text" | SUPPORTED. "which sets them apart from SDH" is the writer's reading, framed as a vendor view; acceptable |
| R2-3 | "In the US, TV rules use the term closed captioning" | [3] | rule title "Closed captioning of video programming" | SUPPORTED (Verbit says nothing on regional terms; the sentence is not attributed to it) |
| R2-4 | [9] labelled as a vendor explanation, not a standard | n/a | stated in the article | OK |
| R2-5 | DCMP "takes time away from dialogue" rationale | [1] | removed; remaining text quotes "only when they are essential to the plot" | FIXED |
| R2-6 | Table: lyrics, DCMP "Caption lyrics verbatim" | [1] | "If music contains lyrics, caption the lyrics verbatim." | SUPPORTED |
| R2-7 | Table: background music, Netflix "Not covered in the sections reviewed" | [2] | no background-music rule found | OK, honest |
| R2-8 | Live Caption "doesn't work on music" | [4] | "Live Caption doesn't work on music." | FIXED |
| R2-9 | Use-case bullets now state only what [7] says; lecture sentence says sources do not say | [7], [8] | release notes list the sounds; ADA.gov lists CART with no mention of laughter | FIXED |
| R2-10 | All other round 1 claims | | text unchanged | SUPPORTED |

Source [3] stays the Cornell LII mirror; quotes match; accepted.

## B. Works
- blog:check: pass (1521 words, 9 sources, 7 FAQs, 9 internal links, 9 external, 1 image). Warning only: 1 image.
- Fresh server (a stale round 1 server had to be restarted): page 200, includes the Verbit section and source; BlogPosting, FAQPage, BreadcrumbList present; listed in /blog, rss.xml, llms.txt, sitemap.xml; opengraph-image 200; /live-captions and the 6 use-case links 200 (blog links unchanged from round 1).
- Image: unchanged, accurate alt text, sample content captioned. 1 image meets the minimum; the aim of 3 is not met (accepted).
- Plagiarism: round 1 no match; new section is paraphrase with short attributed quotes.
- Not done: browser check at 375/1280 px (no browser available).

## C. Value
| Criterion | Score | Evidence |
|---|---|---|
| Answers the question | 5 | Short answer plus the new SDH vs closed captions vs subtitles section cover the core of the query. |
| Information gain | 4 | Like-for-like DCMP vs Netflix table and the live-app sound label table with "not stated" cells. |
| Trust | 4 | Primary sources, vendor source labelled, Cornell mirror for the CFR. |
| Specificity | 4 | 5 seconds, 15 sounds, 4 standards, named settings. |
| Quotable structure | 5 | Question headings, 2 tables, 7 FAQs. |
| Use cases and languages named | 4 | 7 of 7 FAQs name a use case, country or setting; each touched use case has a bullet. |
| Fit with the site | 4 | One clear query; partial overlap with the 2026-10-30 doorbell article (rules vs how-to), cross-linked; accepted. |
| Reader value | 4 | Rules, term differences and which apps show sounds, with honest limits. |

Average 4.25, no score below 4, Information gain 4.
Risk to the site: none beyond the accepted partial overlap.

## Required fixes
None blocking. Optional later: swap [3] to eCFR, add 1 to 2 more images.

Verdict: PASS
