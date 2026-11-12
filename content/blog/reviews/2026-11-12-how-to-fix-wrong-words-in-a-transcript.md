Verdict: PASS

# Review: How to fix wrong words in a transcript
Date: 2026-11-12

## A. Truth
| # | Claim | Source | Evidence (quote) | Verdict |
|---|---|---|---|---|
| 1 | Avg WER 0.35 black vs 0.19 white speakers, five commercial systems | [1] PMC7149386 | "an average word error rate (WER) of 0.35 for black speakers compared with 0.19 for white speakers" | SUPPORTED |
| 2 | Systems from Amazon, Apple, Google, IBM, Microsoft; keyFact "all five made more errors for black speakers" | [1] | five systems from those companies listed; the paper reports the gap across the systems | SUPPORTED |
| 3 | Authors traced gap to acoustic models | [1] | "the racial disparities we see arise primarily from a performance gap in the acoustic models" | SUPPORTED |
| 4 | Common words repeat in training data; surname/place/component may appear rarely; recognizer prefers familiar phrase | [3] Speech Tech Mag (Sept 8, 2026) | "Common words appear repeatedly in training data"; "a surname, indigenous nation, specialist component, or local place name might appear rarely or not at all"; "the recognizer has strong statistical reasons to prefer what it has seen before" | SUPPORTED |
| 5 | FCC: captions match spoken words, in order, no substituting words for proper names and places; applies to TV | [2] Cornell LII 47 CFR 79.1 | "match the spoken words" in "the order spoken, without substituting words for proper names and places" | SUPPORTED |
| 6 | 3Play calls 99% the industry standard; ASR not good enough to remove humans | [4] 3Play (2021) | "99% accuracy is the industry standard for caption quality." / "ASR is good, but not good enough to remove humans from the process." | SUPPORTED. keyFact label says 3Play "says automatic captions alone do not reach" 99%: the source says ASR is not good enough to remove humans, not that it fails to reach 99%. Slight overreach, reword. |
| 7 | YouTube: editing automatic captions generates a new caption track; Duplicate and edit | [5] YouTube Help | "a new caption track that includes your revisions will be generated"; step "Duplicate and edit" | SUPPORTED |
| 8 | Live Captions page: run any recording through again for a cleaner transcript; Words and names = names, medical terms, specialist words | [6] captioai.app/live-captions | "Run any recording through again after the fact for a cleaner transcript"; "Add names, medical terms, or specialist words you hear often." | SUPPORTED |
| 9 | Audio Transcription page: retranscribe a file for a second pass | [7] | "You can also retranscribe a file for a second pass if needed." | SUPPORTED |
| 10 | Underlined uncertain words; long-press corrects everywhere in the recording; add to Words and names | CAPTIO_FACTS word-fix row | matches | SUPPORTED |
| 11 | Language flag on a tag, set right language, write again; iPhone only | CAPTIO_FACTS language-flags | matches | SUPPORTED |
| 12 | Speaker 1/2 renaming; Recognize voices on iPhone, tap tag | CAPTIO_FACTS speaker-labels, voice-recognition | matches | SUPPORTED |
| 13 | Step 4 "Save, then scan the transcript" | none | CAPTIO_FACTS says nothing about a Save step in the word fix | NOT FOUND (FAIL) |
| 14 | "Add names to Words and names, then re-transcribe" implies re-transcribe uses the Words and names list ("for example after you added a name list or set the right language") | none | CAPTIO_FACTS and pages never say re-transcribe uses the list | NOT FOUND (FAIL) |
| 15 | "Fix the transcript before you make a Summary ... those results are built from the transcript" | none in FACTS | plausible, not in FACTS; the AI Summary row says "From any transcript" | Weak. Reword to what FACTS says or drop the causal claim. |
| 16 | "A fix there [YouTube] changes that one caption track and nothing else" | none | YouTube page does not say this | UNCITED (FAIL) |
| 17 | "If a transcript of your own voice ... has more mistakes ... the cause is the technology" | [1] | Study covers black vs white speakers in US interviews only; extending to "your parent's voice or your child's voice" is a generalization | Overreach, soften |
| 18 | Key points picture caption "made from the lecture after the words were checked" | scene | The scene shows no checking or fixing | Misleading caption, fix |

Competitor claims: only YouTube and 3Play, both fair, no prices. No fake social proof. No medical advice beyond "confirm in writing". Sources are primary or authoritative (3Play and Speech Tech Mag are vendor/trade sources, flagged in text for 3Play: fine). No Wikipedia.

## B. Works
- blog:check: passes, with warnings: only 2 images used (aim 3), 15 internal links (aim 3-8).
- build: pass (no errors).
- Local server: /blog/<slug> 200; h1 is the title; BlogPosting, FAQPage, BreadcrumbList present; /blog, rss.xml, llms.txt, sitemap.xml list the article; sitemap lists 2 pictures; opengraph-image returns 200 image/png; every internal link returns 200; title and meta description in range (description 191 chars incl. tag markup).
- Search checklist: FAIL on internal links, 15 against the PLAYBOOK 3-10 range (the same use-case links repeated 3 times each in the body plus the table).
- Pictures: captions picture shows a biology lecture with Prof. Okafor and Priya, amylase in the text, UK flags, made-up names, nothing cut off except the intentional scroll edge. Key-points picture matches the scene. Alt text names Captio AI and says what is shown; captions end "Sample content." OK. BUT: the central subject of the article (underlined uncertain words, long-press correction card, Words and names) is not shown in any picture. The third scene shot (lectures folder) is generated but unused and off-topic. Share image fine.
- Plagiarism check (5 sentences searched in quotes; no match found on any page for any):
  1. "A hearing person who reads a surname as two unrelated words can fix it from the sound." none
  2. "Fix the transcript before you make a Summary, Key points or To-dos from it" none (only generic similar advice)
  3. "One correction replaces all of them." none
  4. "The errors are also not spread evenly." none (generic; no verbatim page)
  5. "Fix errors in this order: wrong numbers and drug names first, then names of people and places" none
  Result: PASS.

## C. Value
Query searched: "fix mistakes in transcript". Top results: Descript, Choppity, gotranscript checklist, Capsule, Reduct, Coloop. They are tool help pages and a checklist (fix names and numbers first, whole-word search and replace).

| Criterion | Score | Evidence |
|---|---|---|
| Answers the question | 4 | Short answer and first paragraph give an order (names, numbers, specialist words) and the Captio AI steps. |
| Information gain | 3 | The priority table and the fix-then-teach-then-re-transcribe order are useful, but gotranscript already gives names-and-numbers-first, and the PNAS and FCC material does not help someone fix a word. No screenshot of the actual fix flow, no deaf-specific criteria beyond one paragraph. |
| Trust | 4 | All cited facts verified; fair to YouTube/3Play. Minus the unsupported claims listed above. |
| Specificity | 3 | Examples are generic ("15 vs 50 milligrams", "there/their"); the Captio AI steps lack detail (what the card looks like, what happens to a word with several meanings). |
| Quotable structure | 4 | Question headings, answer-first sections, two tables, 7 FAQs. |
| Use cases and languages named | 4 | Lectures, meetings, doctor's appointments in text, FAQs and table; most FAQs name one. Languages barely appear. |
| Fit with the site | 3 | Tied to the cluster, but 15 internal links with the same three repeated is link-stuffing; two sections (YouTube, FCC TV rule) drift from the query "fix mistakes in transcript". |
| Reader value | 3 | A deaf reader gets the steps, but the stats on racial disparity and the TV rule pad the article more than they help them act. |

Average 3.5. Information gain 3 (needs 4). Both below the bar.
Information gain: priority-order table plus a tie to the app's real word-fix flow, but not enough that no top-5 result has it.
Risk to the site: low (not thin, not duplicate, not misleading beyond the unsupported claims), but it is generic as written.

## Required fixes (if FAIL)
1. Step 4 of the numbered list: remove "Save," or replace with exactly what CAPTIO_FACTS supports ("the correction applies everywhere that word appears in the recording"). Do not invent a Save step.
2. Section "When is it better to re-transcribe": remove "after you added a name list" and the plan "1. Add the missing names to Words and names, 2. Re-transcribe" unless CAPTIO_FACTS (or the app owner) confirms re-transcribe uses Words and names. If not confirmed, say Words and names helps "your later conversations" [6] and re-transcribe is a separate option for when many words are wrong (for example wrong language).
3. Remove or source "A fix there changes that one caption track and nothing else" (YouTube section).
4. Soften "the cause is the technology" and "your parent's voice or your child's voice": limit it to what the study found (US speakers, black vs white) or drop the extension.
5. keyFact for [4]: do not say 3Play says automatic captions "do not reach" 99%; say 3Play calls 99% the industry standard and says ASR is "not good enough to remove humans from the process".
6. Cut internal links to 3-10. Link each use case once in the body (doctor-appointments, lectures, meetings, everyday-conversations once each) and keep the table links only if the body ones are removed; drop repeated /use-cases/lectures, /meetings and /doctor-appointments links in "How do you fix..." and "How do you teach..." sections.
7. Raise information gain to at least 4: add something not in the top 5 results. Suggested: (a) a short, concrete worked example of the app flow on the sample lecture (e.g. "amylase" heard as another word six times, fixed once, then Key points made from the corrected text), using only behaviour in CAPTIO_FACTS; (b) a table of which fix to use by situation that includes what each costs the reader (time, free vs Plus: word fix and re-transcribe are in FACTS; do not claim limits not listed); (c) a section on why this is more than a convenience for deaf and hard of hearing readers when the transcript is the only record (keep it, expand with a source if any).
8. Add a picture that shows the topic: scene shot of the recording with the uncertain word underlined and/or the correction card, only if the preview renderer really draws them (otherwise do not invent UI); use the generated lectures-folder picture only if a sentence in the article makes it relevant, or leave it out. Make the picture alt and caption say what is actually shown.
9. Change the caption of the key-points picture so it does not claim the words "were checked" (the picture shows only the key points), e.g. "Key points made from the lecture transcript. Sample content."
10. Trim the off-topic weight: shorten the PNAS paragraph and the FCC TV paragraph, or move them into the FAQ only; the body should spend its words on finding, fixing and teaching words. Replace "Wrong filler words can wait" and the "there/their" row with an example a deaf reader would actually meet (e.g. a place name or a course term).
11. Re-run `npm run blog:check`, `npm run build` and the local checks after the changes; aim for 3 images in the article body and no blog:check warnings.

---

# Round 2 (2026-11-12)
Verdict: FAIL (round 2), two small fixes left

## Round 1 fixes checked
- 1 Save step: removed. OK. 2 re-transcribe/name-list link: removed, re-transcribe now a separate option. OK. 3 YouTube sentence: removed. OK. 4 study generalisation: limited to US speakers; the FAQ answer now starts "Not in every study", which is awkward (see below). 5 3Play keyFact: reworded, supported. OK. 6 internal links: 10 (blog:check no warnings). OK. 8/9 pictures: 3 pictures, all in the body and all three in the sitemap; the lectures-folder picture shows a Lectures folder with the biology lecture, a seminar and a tutorial (matches scene and the text about folders and search; Search field is visible). Captions fixed ("Key points made from the lecture transcript. Sample content."). Accepted: no underline/correction-card picture because the renderer cannot draw it. 10 filler row: replaced by place name row. OK.
- Claims re-checked against FACTS: key points/summary/to-dos "from any transcript" (ai-summary row), folders and searchable library (folders, library rows), language flag re-write (language-flags, iPhone), Words and names [6]. Sources unchanged and still SUPPORTED (round 1 evidence).

## B. Works (round 2)
- blog:check: pass, no warnings (1438 words, 10 internal links, 7 external, 3 images). build: pass. Server: 200, h1 = title, BlogPosting + FAQPage + BreadcrumbList present, listed in /blog, rss.xml, llms.txt, sitemap.xml (3 pictures), all internal links 200.

## C. Value (round 2)
| Criterion | Score | Evidence |
|---|---|---|
| Answers the question | 4 | Short answer and first paragraph give the order and the app steps. |
| Information gain | 4 | Cost-of-a-mistake priority table, deaf-reader framing (transcript as the only record), worked flow on a saved lecture, cost column per situation: not in the tool help pages that top the results. |
| Trust | 4 | Sources verified, no overreach left except the "few seconds" line below. |
| Specificity | 3 | The worked example is hypothetical and vague ("one line shows a different word"); "A few seconds per word" is an unsourced timing claim about the app. |
| Quotable structure | 4 | Question headings, answer-first, two tables, 7 FAQs. |
| Use cases and languages named | 4 | Lectures, meetings, doctor's appointments, everyday conversations each have a row; FAQs name them. |
| Fit with the site | 4 | Links cut to 10, off-topic material trimmed. |
| Reader value | 4 | Clear steps and priorities for a deaf student or employee. |
Average 3.875, below the 4 needed because of Specificity 3.
Risk to the site: none.

## Required fixes (round 2)
1. Table "Which fix fits which situation", column "What it costs you": remove "A few seconds per word" and "A few seconds, then fewer misses next time". The time is not in CAPTIO_FACTS. Use "One long-press per word" and "One long-press, then the word is on your list" instead.
2. Make the worked example concrete: replace "one line shows a different word" with a specific illustrative mishearing, labelled as an example (for instance: "Say one line reads 'a mile ace' instead of 'amylase'"), so the flow shows exactly what the reader will see and fix. Optionally reword the last FAQ answer ("Not in every study") to "Yes, error rates can differ by speaker. A 2020 PNAS study of US speakers found ...".

---

# Round 3 (2026-11-12)
Verdict: PASS

- Fix 1: the cost cells now read "One long-press per word" and "One long-press, then the word is on your list"; no timing claims remain (grep for "few seconds" finds nothing).
- Fix 2: the worked example now shows one line reading "a mile ace" instead of "amylase", labelled "an illustrative mishearing". The last FAQ answer starts "Yes, error rates can differ by speaker" and keeps the US-speakers limit, with [1] supporting the numbers (round 1 evidence).
- blog:check passes with no warnings (1442 words, 10 internal links, 7 external, 3 images); build passes; /blog/<slug> returns 200 on the local server; the rest of the round 2 page checks are unchanged.
- Scores: Answers 4, Information gain 4, Trust 4, Specificity 4, Quotable 4, Use cases 4, Fit 4, Reader value 4. Average 4.0, no score below 3, Information gain 4.
- Risk to the site: none.
