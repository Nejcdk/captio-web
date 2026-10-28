# Review: How to organize and share meeting transcripts in folders
Verdict: PASS (round 1)
Date: 2026-10-28

## A. Truth
| # | Claim | Source | Evidence (quote) | Verdict |
|---|---|---|---|---|
| 1 | Folders added in iPhone 1.1.3; release note quote | [1] App Store | "Folders: sort your recordings into folders and share a folder with friends." Version 1.1.3 | SUPPORTED |
| 2 | Folders tab, suggest folder and ask first, record/translate/upload into a folder | CAPTIO_FACTS (folders) | matches row `folders` | SUPPORTED |
| 3 | Shared folder: link or code, everyone sees all, only maker changes, leaving removes your recordings | CAPTIO_FACTS (shared-folders) | matches row | SUPPORTED |
| 4 | Others' recordings stay when you leave | implied by facts | not stated verbatim, consistent | OK (see note) |
| 5 | Federal law: one party's consent for in-person | [2] RCFP, [3] 18 USC 2511 | "Federal law falls under this one-party category for the recording of in-person conversations"; "(d) ... a party to the communication or where one of the parties ... has given prior consent" | SUPPORTED |
| 6 | About 11 states, 11 names listed | [2] | "About 11 states primarily have all-party consent": CA, DE, FL, IL, MD, MA, MI, MT, NH, PA, WA | SUPPORTED |
| 7 | MO and OR in-person; CT and NV phone | [2] | matches | SUPPORTED |
| 8 | Consent may be needed only where people expect privacy | [2] | "only require consent to an in-person conversation if ... reasonable expectation of privacy" | SUPPORTED |
| 9 | ADA "equally effective"; notetakers, real-time captioning | [4] | "equally effective as communication with people without disabilities"; "qualified notetaker", "real-time captioning" | SUPPORTED |
| 10 | Needs internet, records offline and transcribes on reconnect; synced to account; audio not stored; free 10 min/day; Plus removes limit; Android not confirmed | CAPTIO_FACTS | matching lines | SUPPORTED |
Sources: all four are primary/authoritative, no Wikipedia. Titles and publishers match. No fake social proof. No medical advice; legal info carries a "not legal advice" line.
Notes (non-blocking): Michigan's all-party rule has a caveat in the RCFP guide (third-party recordings) that the article leaves out. The FAQ phrase "so a lecture never lands in the wrong folder" is slightly absolute.

## B. Works
- blog:check: pass (1027 words, 7 sections, 4 sources, 7 FAQs, 10 internal links)
- build: pass (reported by caller)
- page checks: /blog/<slug> 200; h1 equals title; Short answer, FAQ text and sources in the HTML; JSON-LD has BlogPosting, FAQPage, BreadcrumbList; /blog, rss (2 hits), llms.txt, sitemap.xml list it; opengraph-image 200 image/png; all internal links return 200. Server stopped. No browser, so the 375 px check was not done.

## C. Value
| Criterion | Score | Evidence |
|---|---|---|
| Answers the question | 4 | Short answer gives the how-to and the consent rule in one quotable paragraph. |
| Information gain | 4 | Top results are tool-specific help pages (Tactiq, Fireflies, Read.ai); none pair shared transcripts with deaf/HoH access and the US consent map. |
| Trust | 5 | Primary sources, dated, limits stated, Android left unclaimed. |
| Specificity | 4 | Named states, statute, version number, exact rules. |
| Quotable structure | 4 | Question headings, situation table, FAQ. |
| Use cases and languages named | 4 | Meetings, lectures, conferences, doctor's appointments each covered; most FAQs name one. |
| Fit with the site | 4 | 10 internal links, no cannibalisation seen. |
| Reader value | 4 | Actionable for a deaf employee or student. |
Information gain: the all-party consent list combined with shared-folder access rules and the deaf employee/student angle.
Risk to the site: none.

## Required fixes
None. Optional: mention Michigan's caveat; soften "never lands in the wrong folder".
