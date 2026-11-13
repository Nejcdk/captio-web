# Review: Captions vs subtitles: what's the difference?
Verdict: FAIL (round 1)
Date: 2026-11-13

## A. Truth
| # | Claim | Source | Evidence (quote) | Verdict |
|---|---|---|---|---|
| 1 | Terms captions/subtitles mean the same thing in different regions | [1] W3C | "used for the same thing in different regions of the world" | SUPPORTED |
| 2 | Captions = text version of speech and non-speech audio needed to understand | [1] | "a text version of the speech and non-speech audio information needed to understand the content" | SUPPORTED |
| 3 | Open always displayed; closed can be hidden/shown | [1] | "closed captions that can be hidden or shown..." / "open captions that are always displayed and cannot be turned off" | SUPPORTED |
| 4 | Subtitles in other languages not directly an accessibility accommodation | [1] | "subtitles in other languages are not directly an accessibility accommodation" | SUPPORTED |
| 5 | US/Canada: subtitles for hearing viewers who don't understand language; CC for d/Deaf and HoH; captions convey all audio incl. sound effects and speaker ID | [3] 3Play | "Meant for hearing viewers who don't understand the spoken language"; CC "all audio information", sound effects, speaker IDs | SUPPORTED (vendor source, see fix 3) |
| 6 | UK: subtitles also covers captions | [3] | "In the UK, 'subtitles' covers both" | SUPPORTED |
| 7 | SDH definition, includes music and sound effects | [3] | "includes sound effects, music, and speaker identification" | SUPPORTED |
| 8 | Netflix SDH 42 characters per line, 2 lines max | [4] | 42 chars (section I.2), "Maximum two lines" (I.10) | SUPPORTED |
| 9 | Plot-pertinent sound effects always included unless visuals already show them | [4] | guide says "unless inferred by the visuals" | SUPPORTED, wording differs slightly (fix 2) |
| 10 | Speaker names in brackets only when speaker cannot be identified visually | [4] | "Only use speaker IDs or sound effects when they cannot be visually identified"; brackets required | SUPPORTED |
| 11 | FCC: 4 standards (accuracy, synchronicity, completeness, placement) | [2] 47 CFR 79.1 | all four quoted in 79.1(j) | SUPPORTED |
| 12 | Captions must match spoken words in original language | [2] | "match the spoken words ... in their original language" | SUPPORTED |
| 13 | Nonverbal info: speakers, music, sound effects, audience reaction, to the greatest extent possible | [2] | "nonverbal information that is not observable" with those examples | SUPPORTED |
| 14 | Coincide with spoken words; run beginning to end; not block faces | [2] | each quoted | SUPPORTED |
| 15 | Open captioning or subtitles in target language may be used in lieu of closed captioning | [2] | 79.1(e)(2) | SUPPORTED |
| 16 | DCMP: sound effects = "sounds other than music, narration, or dialogue"; speaker identity "vital for clarity" | [5] | both quoted | SUPPORTED |
| 17 | ADA lists real-time captioning among aids for deaf/hearing loss | [6] | listed, defined as CART | SUPPORTED |
| 18 | "A UK viewer who switches on subtitles ... may get text with sound descriptions; a US viewer ... dialogue only" | none directly | inference from [3] | UNCITED (fix 2) |
| 19 | "cinema screening with burned-in text is open; CC button is closed" | none | common knowledge, confirmed by search | OK |
| 20 | Pre-recorded captions timed to frame, edited; live text may contain mistakes | none | common knowledge, confirmed by search | OK |
| 21 | Captio AI claims (word by word, iPhone and Android; speaker labels; Live Translator next to original; Recognize sounds iPhone, [doorbell rings], can miss sounds, not always-on alarm) | CAPTIO_FACTS | rows live-captions, speaker-labels, live-translator, recognize-sounds match | SUPPORTED |

- No competitor claims beyond Netflix's public style guide (opened, verified). No fake social proof. No medical or legal advice.
- Sources: W3C, CFR, DCMP, ADA.gov, Netflix are primary. [3] 3Play Media is a captioning vendor, not an authority, and carries the load-bearing US/Canada/UK terminology claim.

## B. Works
- blog:check: pass (1316 words, 6 sources, 6 external links, 10 internal links, 2 images; warning "aim for 3 images")
- build: pass
- page checks (next start, port 3199): /blog/<slug> 200, one h1, Short answer present, JSON-LD has BlogPosting, FAQPage, BreadcrumbList; /blog, /blog/rss.xml, /llms.txt, /sitemap.xml list the article; sitemap lists the pictures; opengraph-image 200 image/png; all 10 internal links 200.
- Pictures: both webp files and share.png viewed. Picture 1 (Film night with Grandad: Grandad, Nora, Ellis tags, UK flags) fits the topic, made-up names, nothing cut off where it matters. Picture 2 (Asking at the station in Rome: English lines with Italian originals in grey) fits. Both show only real app features. Captions say "Sample content." Alt text problem: picture 2's alt says "Captio AI Live Translator showing...", but the screen is a saved recording's Captions tab, not the live translation screen. FAIL on alt accuracy (fix 1).
- Plagiarism: 5 sentences searched in quotes ("Some countries use the two words differently because of local habit", "Open and closed describe whether you can turn the text off, not what it says", "A cinema screening with burned-in text is open. A video where you tap a CC button is closed.", "Pre-recorded captions are written and checked before you watch, and live captions are made as people speak", plus the W3C-paraphrase sentence). No near-verbatim match found. PASS.
- Search checklist: answer-first, 6 sources, 6 external links, 10 internal links, tags appear in text. Pass.

## C. Value
Queries searched: "difference between captions and subtitles" (top results: 3Play, SBS, UCL, Rev, GoTranscript, Maestra).
| Criterion | Score | Evidence |
|---|---|---|
| Answers the question | 5 | Short answer and opening paragraph give the audience and content split and the regional caveat. |
| Information gain | 4 | Top results explain the split; this adds FCC 79.1 standards, Netflix SDH limits and DCMP side by side, plus a four-case "which do you need" list and the live-vs-recorded gap with an honest limit of live apps. |
| Trust | 4 | W3C, CFR, ADA, Netflix, DCMP primary; weakened by relying on a vendor for the regional claim and one uncited inference. |
| Specificity | 4 | 42 characters, 4 standards, named rule sections; some sections general. |
| Quotable structure | 4 | Question headings, comparison table, FAQ; section 2 opens with a reason but not a complete answer naming the UK/US split. |
| Use cases and languages named | 4 | TV, lectures, Italy/Spain/Germany travel, family, doctor; 5 of 6 FAQs name a country or setting. |
| Fit with the site | 3 | Overlaps with `what-are-sound-descriptions-in-captions` (same tag "SDH subtitles", same FCC/DCMP/Netflix sources, same SDH section); links to it, but cannibalisation risk on the SDH query. |
| Reader value | 4 | A deaf reader gets a clear decision list. |
Average 4.0. Information gain: the FCC/Netflix/DCMP rules compared in one place plus the four-case chooser, which the top results lack.
Risk to the site: low; not thin or misleading, but the SDH section duplicates the sibling article's ground.

## Required fixes (round 1)
1. Picture 2 alt text: replace "Captio AI Live Translator showing an Italian railway station answer translated into English with the Italian original below" with wording that matches the screen, e.g. "Captio AI saved recording 'Asking at the station in Rome' with English lines and the Italian original in grey below each". The sentence beside it ("Live Translator shows a translation next to the original captions") can stay. Also make sure the picture's caption does not imply it is the live screen.
2. Cite or soften the sentence in "Why do some countries use the two words differently?": "A UK viewer who switches on subtitles ... may get text with sound descriptions. A US viewer ... may get dialogue only." Add [3] to the US half and rephrase the UK half as "can" with [3], or delete it. Also change the Netflix wording in the SDH section and FAQ to the guide's own: "unless inferred by the visuals" (or quote it).
3. Back the US/Canada vs UK terminology (the claim the answer box rests on) with a second, non-vendor source: add an authoritative source (for example a UK broadcaster, Ofcom or university accessibility page) as source [7] and cite it next to [3] in the Short answer and the UK FAQ.
4. Reduce overlap with the sound-descriptions article: shorten the "What does SDH mean?" section to 2-3 sentences that link to `/blog/what-are-sound-descriptions-in-captions` for the Netflix rules, and drop "SDH subtitles" from `tags` or replace it with a distinct tag (e.g. "open captions vs closed captions" is already there; use "subtitles vs closed captions"), so the two articles do not compete for the same query.
5. Optional, from the check warning: a third picture of the same scene set (e.g. the lecture or Actions view is not needed) is not required; no action needed if fixes 1-4 are done.

---

# Round 2
Verdict: FAIL (round 2)
Date: 2026-11-13

Re-checked the edited article.
- Fix 1 (picture 2 alt and caption): done. Alt now "saved recording ... English lines and the Italian original in grey below each"; caption "A saved translated recording". Matches the screen. OK.
- Fix 2: done. Uncited UK/US inference removed; Netflix wording is "unless inferred by the visuals" in the FAQ (verified against the guide, section I.16). OK.
- Fix 3: accepted. No second source was found; the regional-terms claim now cites W3C [1] (non-vendor) beside 3Play [3] in the section, the UK FAQ and the Short answer's first half. The US/Canada half still rests on 3Play alone; acceptable as a described vendor position ("3Play Media says ...").
- Fix 4: done. SDH section is short and links to the sound-descriptions article; tag "SDH subtitles" replaced by "subtitles vs closed captions". OK.
- blog:check passes but now warns "11 internal links (aim for 3-8)". The search checklist (REVIEW B.7, PLAYBOOK section 12) allows 3 to 10. The link to /blog/what-are-sound-descriptions-in-captions was added in the SDH section while the later FCC/DCMP paragraph still links to it too, which pushed the count to 11.
- Other round 1 results unchanged (claims, plagiarism, build, page, JSON-LD, images). Scores unchanged, average 4.0, Fit with the site now 4 (overlap reduced).

## Required fixes (round 2)
1. Bring internal links to 10 or fewer: link /blog/what-are-sound-descriptions-in-captions once only (keep the SDH-section link, and in the "What do the rules require for captions on US television?" section, delete the second link or turn it into plain text). Nothing else needs to change; then the article is PASS.

---

# Round 3
Verdict: PASS
Date: 2026-11-13

Confirmed: the sound-descriptions link now appears once (SDH section); the DCMP paragraph has no link. `npm run blog:check` passes with 10 internal links (within 3 to 10); the only warning left is "aim for 3 images", which is advisory (2 article pictures meet the minimum). The round 2 edits changed no claims or sources, so the A, B and C results stand: all claims SUPPORTED, plagiarism clear, pictures and alt text correct, average score 4.0, Information gain 4, no score below 3. Risk to the site: none.
