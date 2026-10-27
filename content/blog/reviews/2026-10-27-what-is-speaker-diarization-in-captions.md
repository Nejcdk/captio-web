# Review: What is speaker identification in captions, and how accurate is it?
Verdict: PASS (round 3, see bottom)
Date: 2026-10-27

## A. Truth
| # | Claim | Source | Evidence (quote) | Verdict |
|---|---|---|---|---|
| 1 | Standard: identify speaker with same info a hearing viewer has; "(speaker #1)" example | [1] DCMP | "identify the speaker using the same information a hearing viewer has"; example "(speaker #1)" "I'm happy." Footer (c) 2026 | SUPPORTED |
| 2 | Overlapped error 10.76% in DIHARD II dev set | [2] (full PDF read) | "The overall overlapped error is 10.76%" | SUPPORTED |
| 3 | "in specific domains such as meeting, restaurant and webvideo, the error is much higher" | [2] | same sentence, verbatim | SUPPORTED |
| 4 | Overlap detection recovered less than a tenth, cut DER 0.38% to 0.69% | [2] | "slightly reduces DERs by 0.38% in Track1 and 0.69% in Track2 ... recalled less than 1/10 of the overlapped speech" | SUPPORTED |
| 5 | DER = aggregate duration of three error types / total speech | [3] | "aggregate durations of all three types of errors divided by the total duration of speech" | SUPPORTED |
| 6 | Error type definitions (confusion, missed, false alarm) | [3] | "assigns a speech turn to the wrong speaker"; "two speakers talk on top of each other, and only one of them is detected"; "detects a speech turn when there is none" | SUPPORTED |
| 7 | 259 recordings, 9.3% overlap speech | [3] | "259 recordings", "9.3% of overlap speech" | SUPPORTED (but see fix 4) |
| 8 | CTS phone calls, 2 speakers, first system DER 16.22%, miss largest, traditional cannot handle overlap, 8.31% with separation | [4] (full PDF read) | "has 2 speakers in a session"; "DER of 16.22%"; "miss value ... largest part"; "traditional algorithm cannot well handle overlapped speech"; "DER of 8.31%" | SUPPORTED |
| 9 | Captio AI: Recognize voices on iPhone since 1.1.3, ~20 s, files, names instead of Speaker 2, on phone, needs Separate Speakers, free = you + 1 other, Plus more, asks who unknown speaker is, tap tag to fix, names in exports/AI actions | CAPTIO_FACTS voice-recognition row | matches line | SUPPORTED |
| 10 | Flag on speaker tags since 1.1.3; 60 languages | CAPTIO_FACTS language-flags, languages rows | matches | SUPPORTED |
| 11 | FAQ: "Whether saved voices work equally well in each language is not stated in the app's release notes" | none | FACTS does not mention release notes on this; odd meta-statement | NOT FOUND (reword) |
| 12 | Table: doctor's appointment "Turn-taking is easier to separate than overlap"; lecture "One main voice at a time" | none | no source, writer inference; blog:check warns on uncited row | UNCITED |
| 13 | Body: "Trust labels most when one person talks at a time and the voices differ" | none | plausible inference, not sourced | UNCITED (soften or source) |

Sources: [1],[3] authoritative for their purpose ([3] is a vendor's benchmark, acceptable for DER definitions only). [2],[4] are arXiv challenge-team papers, not the challenge organisers; acceptable but the article should say they are single-team system reports (it does for [4] partly). Titles/publishers/years match. No social proof, no medical advice, no competitor claims.

## B. Works
- blog:check: pass (1 warning: uncited table row, see claim 12)
- build: pass
- page checks (next start, port 3199): /blog/<slug> 200; h1 = title; BlogPosting, FAQPage, BreadcrumbList present; listed in /blog, rss.xml, /llms.txt, /sitemap.xml; opengraph-image 200 image/png; all internal links (4 use cases, everyday-conversations, the how-to-see-who-is-talking article) 200; /live-captions linked.
- browser width checks: not run (no browser).

## C. Value
(Web search of the query not run in this environment; scores are from reading the article against the angle.)
| Criterion | Score | Evidence |
|---|---|---|
| Answers the question | 3 | Short answer defines the two levels well, but the title asks "how accurate is it" and no overall DER figure for typical systems is given, only an overlap sub-error |
| Information gain | 3 | Diarization vs known-voice framing for deaf readers is useful, but numbers come from 2020 and 2021 challenge papers, and the one setting table has no figures |
| Trust | 4 | Verbatim-checkable quotes, primary papers |
| Specificity | 3 | Two rows of the situation table say "no figure"; filler |
| Quotable structure | 4 | Question headings, DER table, FAQ |
| Use cases and languages named | 4 | Five of six FAQs name a use case; language only in the last FAQ |
| Fit with the site | 4 | Links to the sibling article and feature; slight overlap with it, article cross-links |
| Reader value | 3 | Explains labels but gives little to act on beyond "check the words" |
Average about 3.5 (needs 4).
Information gain: 3, needs 4. Add real accuracy numbers (see fixes).
Risk to the site: low (not misleading), but thin on the headline "how accurate" promise.

## Required fixes (if FAIL)
1. Deliver on "how accurate": add current, sourced DER figures for modern diarization systems (for example the DER results on the pyannoteAI benchmark page [3] or a recent peer-reviewed or challenge-organiser paper, e.g. the DIHARD III overview), dated, with what dataset they come from. Add a short table. This is what raises Information gain to 4.
2. Situation table: remove or source the "Turn-taking is easier..." (doctor) and "One main voice at a time" (lecture) rows' claims; "no figure" rows add nothing. Either find a sourced figure per setting (e.g. per-domain DER from the DIHARD overview) or drop those rows and keep meeting and restaurant. This also clears the blog:check warning.
3. Soften or source the body sentence "Trust speaker labels most when one person talks at a time and the voices differ."
4. "How common is overlap?" presents 9.3% from one vendor's 259-recording set as if general. Say plainly that it is that benchmark's dataset, or replace with a general source.
5. FAQ on languages: delete the "not stated in the app's release notes" clause; say only what CAPTIO_FACTS supports (voice recognition on iPhone since 1.1.3; 60 languages for captions) and that language coverage of voice matching is not documented.
6. Clarity: the answer says overlap "accounted for 10.76%"; the paper says "overlapped error is 10.76%". Reword to "the overlapped-speech error was 10.76%". Same in description.
7. Mention that [2] and [4] are individual teams' system reports, not the challenge organisers' own overview.

---

# Round 2
Verdict: FAIL (round 2) - two small fixes, then PASS expected
Date: 2026-10-27

## A. Truth (new/changed claims)
| # | Claim | Source | Evidence | Verdict |
|---|---|---|---|---|
| 14 | Own system 19.8% all languages; others 31.3% to 39.2% | [5] Table 1 | pyannote API 19.8%, Speechmatics 31.3%, Deepgram 39.1%, AssemblyAI 39.2% | SUPPORTED |
| 15 | Per-type DER: audiobooks 4.2, CTS 10.3, clinical 19.8, meeting 44.6, web video 44.9, restaurant 54.4 | [5] domain tables | all six match pyannote Live-1 column; it is the lowest in every domain | SUPPORTED |
| 16 | "English" label on all six rows | [5] | audiobooks/CTS/clinical are in the table the post ties to the English set; meeting/web video/restaurant are in a table not labelled by language ("inference", per page) | WEAK, hedge |
| 17 | Published October 2026; 11 DIHARD III types | [5] | dated 26 Oct 2026; 11 domains listed | SUPPORTED |
| 18 | "Clinical recordings, the closest match to a doctor's appointment" | [5] | the page only describes the domain as "clinical interviews"; nothing says doctor's appointments | NOT FOUND (inference stated as fact) |
| 19 | Organisers say web video "remains far from solved" | [6] Ryant et al., abstract | "for many domains (e.g., web video) ... the problem remains far from solved" | SUPPORTED (title/publisher OK; arXiv v3 2021) |
| 20 | Vendor caveat, streaming, source [5] is a vendor test | [5] | stated in article; test is real-time output | SUPPORTED |
Round 1 fixes 3-7 and the language FAQ rewording are done. No unsupported Captio AI claims.

## B. Works
- blog:check: pass, no warnings (1136 words, 6 sources, 10 internal links). Source [5] URL returns 200. Round 1 build and page checks stand; I did not rebuild after the edit, so the coordinator must run `npm run build` once more before publishing.

## C. Value
Web search of the query was not possible in this environment (no search tool reachable); scores are from reading.
| Criterion | Score | Evidence |
|---|---|---|
| Answers the question | 4 | Short answer now gives a range, 4.2% to 54.4%, and the two-level split |
| Information gain | 4 | Per-setting DER table (audiobooks to restaurants) from a 26 Oct 2026 test, framed for deaf readers |
| Trust | 4 | Verified numbers, vendor caveat stated |
| Specificity | 4 | Concrete DER per setting |
| Quotable structure | 4 | Question headings, two tables, FAQ |
| Use cases and languages named | 4 | Doctor, meeting, restaurant, dinner, lecture named |
| Fit with the site | 4 | Links to sibling article, feature page |
| Reader value | 4 | Tells reader where to doubt labels |
Average 4.0. Risk to the site: low.

## Required fixes
1. Clinical = doctor's appointment: reword to what the source says. Say DIHARD's "clinical" type is clinical interviews, and that a real doctor's appointment may differ. Fix the body paragraph, the situation table row ("Doctor's appointment (clinical recordings)") and the following "trust most in clinical-style settings" sentence so none claims the figure applies to appointments directly.
2. The situation table has two "Team meeting" rows (one duplicates the other). Merge into one row, for example "DER 44.6% in the same test [5]; interruptions create overlap, a main error source [2]".
3. Optional: state once that these figures are for pyannoteAI's and others' streaming systems, not for Captio AI, and soften "English" in the table heading to "DIHARD III, English set as labelled by pyannoteAI" or drop the word for the three unlabelled rows.

---

# Round 3
Verdict: PASS (round 3)
Date: 2026-10-27

- Fix 1 done: body says "DIHARD's clinical interviews, which are not the same as a real doctor's appointment"; situation table row says "No figure for appointments"; trust sentence hedged "though a real appointment may differ". Matches source [5] ("clinical interviews").
- Fix 2 done: one Team meeting row (44.6% [5] plus overlap [2]).
- Hedge done: "English" dropped from table heading; vendor-not-Captio sentence added; vendor-test caveat kept.
- blog:check passes with no warnings (1147 words, 6 sources, 10 internal links). Coordinator reports build passed; page checks from round 1 unchanged (no new internal link targets beyond /use-cases/restaurants, which exists in the site's 12 use cases; verify 200 in the final build).
- Scores unchanged from round 2 (average 4.0, Information gain 4). Risk to the site: none.
- Non-blocking suggestion: "two-person interview" in the trust sentence is not stated by the source; "an interview" is enough.
