# Review: How to follow a doctor's appointment when you are hard of hearing
Verdict: FAIL (round 1)
Date: 2026-11-10

## A. Truth
| # | Claim | Source | Evidence (quote) | Verdict |
|---|---|---|---|---|
| 1 | ADA aims for communication "equally effective" | [1] ADA.gov | "equally effective as communication with people without disabilities" (page last updated Feb 28, 2020) | SUPPORTED |
| 2 | Real-time captioning (CART) listed aid; particularly useful for people not using sign language | [1] | "particularly useful for people who are deaf or have hearing loss but do not use sign language" | SUPPORTED |
| 3 | Doctor's office: interpreter generally needed for sign language user | [1] | "an interpreter generally will be needed" | SUPPORTED |
| 4 | State/local government give primary consideration; businesses encouraged to consult | [1] | "encouraged to consult with the person with a disability" | SUPPORTED |
| 5 | Aids and services at no cost to patient, per HLAA | [2] (local PDF) | "Services and aids you use for your visit, will be at no cost to you, your family, or your caregiver." | SUPPORTED |
| 6 | Tell receptionist hard of hearing/deaf; needs; office manager name | [2] | "Ask for the name of the office manager in case you need help getting the services you need." | SUPPORTED |
| 7 | Booking checklist (online forms, repeat date/time, email confirmation, text number if late, captioned phone takes longer) | [2] | all five lines present | SUPPORTED |
| 8 | CAP becomes part of medical record; can email/fax ahead | [2] | "should be filled out and become part of your medical record"; "email or fax your CAP" | SUPPORTED |
| 9 | Ask questions, repeat back, treatment plan/medicines in writing, contact name | [2] | all present | SUPPORTED |
| 10 | Ototoxic medicine question; cochlear implant before MRI; staff find you / vibrating pager | [2] | present | SUPPORTED |
| 11 | NHS and adult social care services "have to follow" the AIS | [3] Devon Partnership NHS Trust | "a national standard that all NHS and adult social care services have to follow" | SUPPORTED (but see source quality, fix 2) |
| 12 | Six steps: identify, record, flag, share, meet, review | [3] | six steps listed | SUPPORTED |
| 13 | "A deaf patient in England can ask for a BSL interpreter" (FAQ) | [3] | page only lists a BSL interpreter as an example of support someone might need; says nothing about a right to ask | OVERSTATED, soften |
| 14 | "Staff see a flag on your record at every visit" (table) | [3] | page says needs are flagged; "at every visit" not stated | NOT FOUND, soften |
| 15 | Over 5% / 430 million need rehabilitation; nearly 2.5 billion by 2050; hard of hearing communicate through spoken language, benefit from devices and captioning | [4] WHO, 3 March 2026 | "Over 5% of the world's population – or 430 million people – require rehabilitation to address their disabling hearing loss"; "nearly 2.5 billion people are projected to have some degree of hearing loss" | SUPPORTED |
| 16 | "Names of conditions, drugs or the clinic's staff are the words most likely to be misheard by a person and by captions" | none | a search found sources on misheard drug names and numbers, none ranking condition names or staff names | UNCITED (FAIL) |
| 17 | "the three moments where information gets lost: the booking call, the consulting room and the walk home" | none | no source | UNCITED, rephrase as framing ("three moments to plan for") or cite |
| 18 | Captio AI: live captions from phone mic, word by word; Separate Speakers labels Speaker 1/2; Words and names; underlined uncertain words; needs internet; 3 free summaries; 100 free credits a day; export as text/link/PDF/email; summary types; Plus removes limit; not phone-call captioning; no interpreter replacement | CAPTIO_FACTS.md rows (live-captions, speaker-labels, words-and-names, word-fix, ai-summary, export, free plan) | all match lines in CAPTIO_FACTS.md | SUPPORTED by facts file |
| 19 | Source [5] cited for those Captio claims | [5] App Store listing (opened: "Live Captions - Captio AI", 1.1.7) | listing shows live captions, free use, summaries; it does NOT show Words and names, underlined words, Separate Speakers, internet requirement, export formats, "3 AI summaries", "100 free credits" | MISMATCH, see fix 3 |
| 20 | Competitor claims | none | no competitor named | n/a |
| 21 | Social proof | none | none present | PASS |
| 22 | Medical/legal advice | disclaimers present, advice sourced, pointer to professionals | | PASS |

Source quality: [1], [2], [4] are primary/authoritative. [3] is one local NHS trust's page (no date shown; the year 2026 is just a footer copyright) for a rule set by NHS England. The NHS England AIS page (could not be opened with WebFetch here) is the authoritative source and should be used. [2] year 2024 could not be verified from the PDF text (no date on the pages read).

## B. Works
- blog:check: pass (1550 words, 7 sections, 5 sources, 7 FAQs, 3 internal links, 5 external, 2 images). Warnings: slug 65 characters, 2 images (aim for 3).
- build: .next present; the build is stated to pass; `next start -p 3199` served it.
- Page checks (local server): article 200, title is the h1, BlogPosting + FAQPage + BreadcrumbList present in JSON-LD. /blog, /blog/rss.xml, /llms.txt, /sitemap.xml all list the slug. opengraph-image returns image/png. Internal links /use-cases/doctor-appointments, /ai-summary, /live-captions return 200; both images return 200. No browser available, so the 375/1280 px check was not done.
- Images: LC_mockup_2.png is a real Captio AI screenshot with Speaker 1 / Speaker 2 labels; alt text matches and is captioned "Sample content". AS_mockup_1.png is a real saved-transcript screen ("Matrix Row Column", Captions/Summary tabs); alt matches and the caption says it is a lecture, not a medical visit. OK. Only 2 images (aim 3, not a fail).
- Plagiarism (5 sentences searched in quotes, WebSearch): "Writing it once means you do not explain it at every visit", "the booking call, the consulting room and the walk home", "A summary is a memory aid, not a medical record", "rely on writing, not memory", "Names of conditions, drugs or the clinic's staff are the words most likely to be misheard". No near-verbatim matches. PASS.
- Search checklist: answer-first yes; 5 sources, 5 external links; 3 internal links (min 3, ok); meta in range per blog:check.

## C. Value
Searched "how to understand my doctor with hearing loss": top results are familydoctor.org, Hearing Health Matters, UCSF EARS, SignHealth, CaptiTel, Arizona LWHL, mostly patient-advocacy tip lists.
| Criterion | Score | Evidence |
|---|---|---|
| Answers the question | 4 | Short answer gives the plan (tell practice, written plan, writing, repeat back) and quotes alone, but the phone-captions sentence is vague. |
| Information gain | 3 | The US ADA + England AIS comparison table and the HLAA checklist are useful, but most tips match what top results already say; no new data, no country breakdown beyond two countries, and the unsourced "words most likely misheard" claim is the only original angle. |
| Trust | 3 | Primary sources for ADA/HLAA/WHO, but the England rule rests on one trust page, the Captio claims cite a source that does not contain them, and two claims are uncited. |
| Specificity | 4 | Concrete steps, named standard, named plan (CAP), specific situations table. |
| Quotable structure | 4 | Question headings, answer-first sections, two tables, 7 FAQs. The "How many people does this affect?" section is filler for this query. |
| Use cases and languages named | 3 | Doctor appointments, GP, specialist, pharmacy named, but only US and England are covered, and the FAQs mostly name the use case, not a country or language. |
| Fit with the site | 4 | Links /use-cases/doctor-appointments, /ai-summary and /live-captions naturally; no overlap spotted with other reviewed articles. |
| Reader value | 4 | A hard of hearing reader could act on the checklist today. |
Average: 3.6 (needs 4). Information gain: 3 (needs 4).
Risk to the site: low, but the uncited claim and mismatched citations lower trust; not misleading beyond that.

## Required fixes (if FAIL)
1. Remove or properly source "Names of conditions, drugs or the clinic's staff are the words most likely to be misheard by a person and by captions" (e.g. cite a study on misheard drug names, or reword to something HLAA or the facts file supports, such as "unusual names are where captions are most likely to slip, so confirm drug names and doses in writing"). Also reword "the three moments where information gets lost" as framing, not a fact.
2. Replace or add the NHS England Accessible Information Standard page as source [3] (the authoritative owner of the rule); keep the Devon trust page only as an example if wanted. Soften: remove "A deaf patient in England can ask for a BSL interpreter" (the page only lists it as an example of support) and "Staff see a flag on your record at every visit" (say "your needs are flagged on your record").
3. Source [5] (App Store listing) does not contain most of the app claims. Either cite the app's own feature pages (/live-captions, /ai-summary, /export, /ai-actions) for those claims as the Captio facts source, or restrict [5] to what the listing shows (live captions, free to use, summaries, version 1.1.7). Every Captio claim must still match CAPTIO_FACTS.md.
4. Raise Information gain to at least 4: add something none of the top results has, for example a third country or region row (e.g. Canada or Australia, from official sources), a compiled "what to say" script (one-line wording for booking call and consulting room) drawn from cited HLAA material, or a table of what each country's official body says about who pays/chooses the aid. Drop or shrink the generic WHO section unless it is tied to doctor visits.
5. Verify the HLAA PDF's year (2024) from the document or hearingloss.org page, or change it to the date actually shown.
6. Optional: add a third image (aim 3) and shorten the 65-character slug warning if it can still be changed.

Verdict: FAIL (round 1). Fix items 1 to 4 (and 5) and resubmit for round 2.

---

# Round 2
Verdict: FAIL (round 2), one small fix left
Date: 2026-11-10

## What was re-checked
- Fix 1 (unsourced "most likely to be misheard" claim): resolved. The article now says "Unfamiliar condition and drug names are easy to get wrong when you only hear them once, as our suggestion", clearly labelled as opinion. "Three moments" is now framing. PASS.
- Fix 2 (BSL / flag overstatements): resolved. FAQ says the "example of communication support is a British Sign Language interpreter"; table says "Your needs are flagged for staff involved in your care [3]". Both match the Devon page. The AIS source itself is NOT fixed, see below.
- Fix 3 (Captio source mismatch): resolved. I opened all three pages now:
  - [5] captioai.app/live-captions: "Live Captions requires an internet connection to process speech in real time" (no offline mode); "labels each speaker separately so you always know who said what"; "Add names, medical terms, or specialist words you hear often"; "free to start". SUPPORTED.
  - [6] captioai.app/ai-actions: "Summary, Key points, Detailed notes, To-dos, Q&A or Follow-up message"; "The free plan includes 3 AI results in total". SUPPORTED.
  - [7] captioai.app/export: "Captions or summary, as Text, Link, PDF, Email or a prompt for your AI chat". SUPPORTED.
  All statements still match CAPTIO_FACTS.md; the dropped claims (100 credits, underlined words, Separate Speakers) are gone. The "Live captions on your phone" FAQ does not name Words and names under [5] incorrectly. PASS.
- Fix 5 (HLAA year): `pdfinfo` shows CreationDate 25 Jan 2024 (ModDate 2 Jun 2026). 2024 acceptable. PASS.
- Fix 4 (information gain): the new "What can you say, word for word?" section gives four ready scripts (phone, reception, room, end) labelled "our wording", each built on HLAA items [2] (email confirmation, vibrating pager or come and find you, writing down plan and medicines, contact by text or email). Every script element traces to HLAA's list; none of the top results (familydoctor.org, Hearing Health Matters, UCSF, SignHealth) offers a script per moment plus a US/England rights table. Information gain 4. PASS.
- Plagiarism: the new scripts are original wording built on HLAA's list; earlier 5-sentence search stands. PASS.
- blog:check: pass (1658 words, 8 sections, 7 sources, 7 FAQs, 3 internal links, 7 external, 2 images; warnings only for slug length and image count).
- Not re-run: build and page checks from round 1 (all passed), since only the Markdown body and source list changed; the new sources are external links that blog:check passes. The 375/1280 px browser check was still not possible (no browser).

## Re-scored
| Criterion | Score |
|---|---|
| Answers the question | 4 |
| Information gain | 4 |
| Trust | 3 (see fix below) |
| Specificity | 4 |
| Quotable structure | 4 |
| Use cases and languages named | 3 |
| Fit with the site | 4 |
| Reader value | 5 |
Average 3.9. Needs 4 and no score below 3: Trust and Use cases/languages are held down by the one remaining source issue and by covering only the US and England.
Risk to the site: low.

## Required fix (the only one left)
1. Source [3] is still a single Devon NHS trust page with no date (the year 2026 is only its footer copyright). REVIEW.md A5 requires the most authoritative source available, and one exists: NHS England's own Accessible Information Standard page, https://www.england.nhs.uk/accessible-information-standard/about-the-standard/ (it appeared in search results; WebFetch of england.nhs.uk would not return its text here, so the coordinator must open it). A search summary of NHS England's wording confirms the standard is issued under section 250 of the Health and Social Care Act 2012 and covers all NHS and publicly funded adult social care providers in England, with the same six actions (identify, record, flag, share, meet, review). Swap [3] to that NHS England page (title "About the standard", publisher NHS England, year per the page), check the quoted wording matches the six steps and that it uses "BSL interpreter" / "d/Deaf" wording; if it does not, drop those two sentences and the "BSL" mention in the FAQ. Then the keyFacts label "as one NHS trust describes it" becomes "as NHS England describes it".
If the coordinator cannot open the NHS England page either, the alternative is to keep the Devon page but say plainly in the text that it is one NHS trust's description and drop "national standard that all NHS ... have to follow" as a flat statement. The cleaner route is the swap.

Verdict: FAIL (round 2). With fix 1 applied and verified against the NHS England page, this should be PASS in round 3.

---

# Round 3
Verdict: PASS (round 3)
Date: 2026-11-10

## Re-check
- blog:check: pass (1685 words, 8 sections, 7 sources, 7 FAQs, 3 internal links, 7 external, 2 images; warnings only: slug length, image count).
- NHS England's page (england.nhs.uk/accessible-information-standard/about-the-standard/): I also could not open it (WebFetch empty, curl returned 0 bytes).
- Independent confirmation of [3] elsewhere (REVIEW.md A.2 allows another route for an unreachable source): I opened RNID's page for healthcare professionals (rnid.org.uk/employers-and-professionals/healthcare-professionals/accessible-information-standard/). It says "In England, all providers of NHS or publicly funded adult social care services must meet the AIS's legal requirements" and lists the same six steps: Identify, Record, Flag, Share, Meet, Review (Flag = confidential details made highly visible or linked to an electronic alert so staff act on them). This supports the article's scope sentence, the six steps and the "flagged for staff" wording. A web search summary also attributes the standard to NHS England under section 250 of the Health and Social Care Act 2012.
- New sentence ("The standard is published by NHS England, and this description comes from a trust that follows it, so check NHS England's own page for the full wording"): true, and it attributes honestly. keyFacts label says "as one NHS trust describes it". The wording is acceptable.
- Remaining Devon-trust-only points (BSL interpreter as the example, d/Deaf named) are attributed to the trust page and checked against it in round 1; they are not stated as law. Acceptable.
- Everything else from rounds 1 and 2 stands (A claims supported, Captio claims match CAPTIO_FACTS.md and the three captioai.app pages, no social proof, no medical or legal advice, plagiarism clear, images valid, page checks passed in round 1).

## Scores
Answers the question 4, Information gain 4, Trust 4 (every claim traces to a source or is labelled "our suggestion"; [3] attributed honestly), Specificity 4, Quotable structure 4, Use cases and languages named 3, Fit with the site 4, Reader value 5. Average 4.0, minimum 3, information gain 4.
Risk to the site: none found.

## Optional (not required)
- Add RNID's AIS page as a source in a later update (it names scope and the six steps and is a deaf charity readers trust).
- Add a third image; shorten the 65-character slug if it can still be changed.
- Later: replace [3] with NHS England's page once it can be opened.

Verdict: PASS
