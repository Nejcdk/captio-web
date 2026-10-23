# Review: What is CART captioning? How it works and what it costs
Verdict: FAIL (round 1)
Date: 2026-10-23

Method note: WebFetch cannot open pages in this sandbox (ENOTFOUND on askjan.org and ncdhhs.gov). Every verdict below is SEARCH-BASED: WebSearch against the cited page or publisher, quoting what the search returned. Nothing was opened directly. Claims I could not confirm are failed, per REVIEW.md.

## A. Truth
| # | Claim (where) | Source | Evidence (search-based) | Verdict |
|---|---|---|---|---|
| 1 | Remote CART $125/hr, 1-hr minimum, business hours | [3] Maine Simply Captions sheet | "$125 per hour remote captioning with a one-hour minimum during business hours" | SUPPORTED |
| 2 | On-site $150/hr, 2-hr minimum, plus negotiated travel | [3] | "$150 per hour onsite captioning with a two-hour minimum plus negotiated travel expenses" | SUPPORTED |
| 3 | Remote outside business hours $135; on-site $160 | [3] | "$135 remote and $160 onsite" | SUPPORTED |
| 4 | Booked less than a week ahead adds 10% | [3] | "Events booked less than a week ahead carry a 10% increase" | SUPPORTED |
| 5 | Remote CART $130/hr on a second Maine sheet | [4] AST BP54 | "Hourly Rate: Business hours 8:00-5:00 ... $130" | SUPPORTED. Caveat: the sheet says "valid till December 31, 2026" but the master agreement shows expiry 06/30/25, and the Simply Captions sheet carries a 11/2016 form revision and no effective date. "As of 2026" and `year: 2026` for [3] are not confirmed. |
| 6 | Programme goal 98.5% verbatim at 180 to 200 wpm (keyFact, source 5) | [5] Anoka Tech | "98.5 percent verbatim accuracy", "variable speeds of 180-200 wpm" | SUPPORTED |
| 7 | Rutgers: certified CART specialists up to 260 wpm at 98% accuracy and above | [6] | "certified to type up to 260 words per minute with 98% accuracy and above" | SUPPORTED |
| 8 | Massachusetts: CART more accurate and consistent; automatic captions work best at very close distances or when everyone has their own mic | [7] | "more accurate and consistent captioning"; "ASR tends to work best in very close distances or when everyone is using their own microphone" | SUPPORTED |
| 9 | CART is used by people wanting an alternative to sign language interpreting or assistive listening devices | [2] NC DHHS | The NC DSDHH document says CART suits people "who cannot hear well enough with hearing assistive technology" and some who also use ASL. The exact "alternative to sign language interpreting or to assistive listening devices" wording came back only from a University of Washington video, not NC. | NOT FOUND on [2] |
| 10 | "Audio reaches the captioner on site, by phone, or through Zoom" and "typing on a stenotype machine, with software turning keystrokes into words" cited to [2] | [2] | NC text describes "stenography equipment connected to a computer". Phone line comes from the JAN newsletter / NCRA text, Zoom from Dartmouth. Not shown on NC. | NOT FOUND on [2] (right facts, wrong citation) |
| 11 | Text can appear on your monitor, be projected for a room, or be added to video as captions; delivered on site or remotely; "within moments" | [1] JAN | The URL given returns vendor-style text (Realtime Ready Captions, on-site and remote). Monitor/projection/video-caption wording not found. JAN's actual CART article is askjan.org/publications/consultants-corner/vol01iss07.cfm (NCRA wording: "computer monitor or other display"). | NOT FOUND on [1] as cited |
| 12 | JAN: also helps visual learners, non-native English speakers, people with cognitive or learning disabilities | [1] | JAN's article says users are mainly hearing-impaired or "learning English as a second language". Visual learners and cognitive or learning disabilities: not found. | NOT FOUND (partly) |
| 13 | "JAN tells readers to check vendor sites for pricing" | [1] | JAN lists vendors; no pricing statement found. | NOT FOUND |
| 14 | Captioning is an auxiliary aid or service under the ADA (answer-adjacent text, FAQ, "When should you use CART") | [1] | Supported by Nebraska commission brochure and the ADA, not shown on the cited JAN page. | NOT FOUND on [1]; cite the ADA / ADA.gov or DOJ instead |
| 15 | FAQ: "older name was computer-aided transcription services, which became known as real-time captioning, or CART, according to the National Association of the Deaf" | none (no NAD source in `sources`) | Searched; the phrase "computer-aided transcription services" was not found in any NAD result, and NAD is not cited. | UNCITED, NOT FOUND. Remove or source it. |
| 16 | CART "usually trained in court reporting" / "usually a stenographer from court reporting" (answer, intro, "Who provides CART") | [1] in intro only; none in `answer` | Plausible (NCRA, Anoka programme) but not tied to a citation in the answer box. | UNCITED in `answer` |
| 17 | "The same transcript can usually be saved afterwards" | none | Maine sheet lists a transcript fee ($4 a minute), but the claim is uncited. | UNCITED |
| 18 | Table: CART "Needs booking in advance: Yes" | none | JAN newsletter says CART "usually needs to be scheduled in advance"; not cited. | UNCITED |
| 19 | Table: CART best in "Rooms with several speakers, technical content" | none | Massachusetts says CART copes when the speaker is far from a mic or no mic. "Several speakers, technical content" is not in [7]. | UNCITED / unsupported |
| 20 | "Automatic captions cost far less" | none | No source. | UNCITED |
| 21 | Typical settings: court hearings, workplace meetings, public events | none | Common knowledge, acceptable. [lectures]/[conferences] links fine. | OK |
| 22 | Captio AI: captions in-person speech via phone microphone; needs internet; free plan 10 minutes of live captions a day; free to start; sits beside CART, not in place | CAPTIO_FACTS.md | Lines 10, 17, 53; "does not replace interpreters or legal accommodations" matches line 69. No banned claims (no accuracy %, no "best"). | SUPPORTED |
| 23 | Sources are primary / authoritative | all | Government, university and state sources; no Wikipedia. Maine contract sheets are one state's rates and the article says so. | OK. `year: 2026` on [3] and [4] is unverified. |
| 24 | Social proof, medical or legal advice | n/a | None fabricated. Legal line says "not legal advice". | OK |
| 25 | Competitor claims | n/a | No competitors named. Simply Captions and Automatic Sync appear only as price-sheet titles; "Simply Captions price sheet" is a vendor name in `sources`, fair as a title. | OK |

## B. Works
- blog:check: pass (853 words, 7 sources, 6 FAQs, 4 internal links; external links not checked, no internet).
- build: pass (stated by the caller; not rerun here).
- page checks (served page, JSON-LD, sitemap, OG image, 375 px): not performed, as the caller allowed. Internal links in the article: /use-cases/lectures, /use-cases/conferences, /live-captions, /blog/hearing-loss-statistics-us. The last file exists in `content/blog/posts/`.
- FAQ count is 6, below the playbook's usual spread; the FAQ with the NAD claim is the one that fails A.

## C. Value
| Criterion | Score | Evidence |
|---|---|---|
| Answers the question | 4 | The answer box defines CART and gives the price, and would read well quoted alone. It carries an uncited "usually court reporting" clause. |
| Information gain | 4 | The compiled Maine rate table (business and after hours, minimums, 10% short-notice surcharge) from primary public price sheets, plus a "what to ask a provider" list. Search results for the query mostly give vendor ranges without a dated primary sheet. |
| Trust | 2 | Strong where the Maine, Anoka, Rutgers and Massachusetts sources are used. Several claims are attached to sources that do not carry them ([1], [2]), one attribution (NAD) has no source, and a few table cells are uncited. |
| Specificity | 4 | Dollar figures, minimums, wpm and accuracy targets. |
| Quotable structure | 4 | Question headings, two tables, FAQ. Each section opens with a complete answer. |
| Fit with the site | 4 | Matches the topic entry; no cannibalisation among the three existing posts; links to lectures, conferences, Live Captions and the US statistics post. |
| Reader value | 4 | A deaf person or family gets real rates and booking questions. The US-only pricing is stated plainly. |

Average 3.7 (needs 4), Trust below 3, so the value gate fails as well.
Information gain: a dated, primary-source rate card (Maine contract sheets) with minimums and surcharges, which the usual top results lack.
Risk to the site: moderate while citations misattribute; fixable. Nothing thin, duplicate or off-brand.

## Required fixes
1. FAQ "What does CART stand for?": delete the National Association of the Deaf sentence ("older name was computer-aided transcription services ...") or replace it with a sourced fact. Searches found no NAD wording to match. Safe replacement: "CART stands for Communication Access Realtime Translation" with no history claim, or cite a source that states the history (the NC DHHS or JAN pages).
2. Claim "used by people who want an alternative to sign language interpreting or assistive listening devices [2]": rewrite to what NC DHHS says (an appropriate accommodation for many people with hearing loss who cannot hear well enough with hearing assistive technology, including some who also use ASL), or cite the source that says the "alternative" wording.
3. "How does CART work?": move the stenotype / phone line / Zoom statement off [2]. Cite a page that says it: the JAN newsletter (askjan.org/publications/consultants-corner/vol01iss07.cfm, NCRA wording) for stenotype, monitor display and phone listening, and Dartmouth or similar for Zoom. Add those to `sources`.
4. Replace or re-point source [1]. The cited URL (/products/Communication-Access-Realtime-Translation-CART.cfm) returned vendor text, not the claims. Either use JAN's consultants-corner article or re-verify the cited page in a browser, and then limit the [1] claims to what it says. Remove "visual learners" and "cognitive or learning disabilities" unless a page that says it is cited (JAN's article says "learning English as a second language"). Remove "JAN tells readers to check vendor sites for pricing"; JAN lists vendors but no such statement was found.
5. ADA auxiliary aid statement (intro-adjacent text, FAQ "Who pays for CART?", last section): cite the ADA itself (ADA.gov or the DOJ effective communication guidance) as a new source rather than [1].
6. Add a citation, or cut, each of: "usually trained in court reporting" in the `answer` box, "same transcript can usually be saved afterwards", "Needs booking in advance: Yes", "Rooms with several speakers, technical content" (not in [7]; change to what Massachusetts says: works when the speaker is far from a microphone or has none), and "Automatic captions cost far less".
7. Dating: the Simply Captions sheet has no effective date (form revision 11/2016) and the AST BP54 master agreement shows an expiry of 06/30/25 while the sheet says valid to 2026-12-31. Say "price sheets listed on Maine's procurement site in October 2026" instead of implying contract year 2026, and set `year` to the retrieval year only if the reviewer or writer confirms in a browser. Optionally add that rates may have changed since.
8. Optional: add one or two FAQs on notice and booking (JAN: CART usually has to be scheduled in advance) once cited, to reach 8.

Re-review after fixes: items 1 to 6 are the blockers; item 7 is a dating-accuracy blocker.
