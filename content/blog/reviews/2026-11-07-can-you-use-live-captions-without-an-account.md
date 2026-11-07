# Review: Can you use live captions without creating an account?
Verdict: FAIL (round 1)
Date: 2026-11-07

## A. Truth
| # | Claim | Source | Evidence (quote) | Verdict |
|---|---|---|---|---|
| 1 | Captio AI live captions, translation, uploads work without signing in, since 1.1.6 | [5] App Store | "No account needed: live captions, translation and file uploads work without signing in." (listed under 1.1.6) | SUPPORTED |
| 2 | 1.1.6 went live on 5 November 2026 | [5] | Store page shows only "1d ago" for 1.1.6, no absolute date. CAPTIO_FACTS says 2026-11-05. | SUPPORTED by FACTS only, date not on the cited page |
| 3 | Shared folders and Connectors need an account [5] (answer, body x2, FAQ, situations list, keyFacts neighbours) | [5] | Release notes do not say it. Page: "The release notes don't say whether either needs an account." The statement is true (captioai.app/connectors FAQ: "You need a Captio AI account (sign in with Apple or Google)"; captioai.app/folders FAQ: "Everyone in a shared folder needs a Captio AI account.") but is cited to the wrong source. | NOT FOUND in [5] (misattributed) |
| 4 | Connectors "read recordings synced to your account [5]" | [5] | Not in release notes; true per captioai.app/connectors | NOT FOUND in [5] |
| 5 | Live Caption processed on device, no mobile data or internet | [1] | "All captions are processed locally, never stored, and never leave your device." / "Live Caption doesn't use mobile data or an internet connection." | SUPPORTED |
| 6 | First use needs Wi-Fi for language pack | [1] | "you must connect to Wi-Fi to download the default language pack" | SUPPORTED |
| 7 | Turn on from volume controls (More, Live Caption) or Settings search | [1] | "Press the volume button... More... Live Caption"; "search for Live Caption in Settings" | SUPPORTED |
| 8 | No sign-in mentioned for Live Caption | [1] | No account text on page | SUPPORTED (absence) |
| 9 | Pixel 2/3 English; longer list on newer Pixel and selected phones | [1] | Pixel 2 and 3 English only; Pixel 6+ and selected phones longer list | SUPPORTED |
| 10 | "Live Caption captions sound playing on your phone" (no [n]) | [1] | "captions appear for speech in audio playing on your device"; also "videos, podcasts, phone calls, video calls, and audio messages" | UNCITED but supported; add [1]. Mentioning that it also captions phone calls would be more accurate. |
| 11 | Live Transcribe setup: open app, accept microphone permissions, no sign-in step | [2] | "Accept microphone permissions."; setup via system settings/Accessibility; no sign-in text | SUPPORTED. Note keyFacts "0 sign-in steps" is an absence claim, fine as worded. |
| 12 | Internet recommended unless offline language; offline on select devices with Android 12+ | [2] | "connected to the Internet unless you're using one of the offline languages"; Android 12 or later (Android 8 to 11: English only) | SUPPORTED |
| 13 | History up to three days, 24 h if history off | [2] | "up to three days"; "deleted after 24 hours" | SUPPORTED |
| 14 | Page does not state number of languages | [2] | Correct, not given | SUPPORTED |
| 15 | Apple Live Captions captions in-person speech via mic, on-device transcriptions | [3] | "capture and caption live, in-person speech through the microphone in your device"; "on-device-generated transcriptions" | SUPPORTED |
| 16 | Apple Account only for Live Listen second device | [3] | "signed in to the same Apple Account" (nearby iPhone/iPad) | SUPPORTED |
| 17 | Regions/languages may vary | [3] | "may not be available in all regions or all languages" | SUPPORTED |
| 18 | Apple's iPhone setup pages "did not load when this guide was written" | n/a | Reviewer also could not load support.apple.com/guide/iphone/... (nav only). Search results do not state an Apple Account requirement either. | Cannot confirm. The sentence is a writer-process note, not reader information. |
| 19 | Audio processed in real time, not stored on servers; asks before sending, "If you say no, nothing is sent" | [4] | Exact quotes found | SUPPORTED |
| 20 | Transcripts and summaries also in cloud linked to account after sign-in | [4] | "stored securely in our cloud, linked to your account" | SUPPORTED |
| 21 | Account collects name, email, account identifier; Apple or Google sign-in; delete in app | [4] | "we process your name, your email address, and an account identifier"; "at any time from within the app" | SUPPORTED |
| 22 | Recordings without account stay on phone; "if you sign in later, your recordings can sync" | [5]/FACTS | FACTS: "Recordings then stay on the phone". Sync-after-sign-in is not in FACTS or the notes. | NOT FOUND (sign-in-later sync is an inference; "a lost phone is a lost recording" too) |
| 23 | Free to download, 100 free credits a day (as of October 2026), Plus removes limit | FACTS | Matches Price section | SUPPORTED |
| 24 | Needs internet for live captions; records offline, transcribes on reconnect | FACTS | Matches "Where it runs" | SUPPORTED |
| 25 | 60 languages, speaker labels | FACTS | Match | SUPPORTED |
| 26 | Connectors work with Claude, ChatGPT, Gemini, Perplexity | FACTS | Match | SUPPORTED |
| 27 | Captio AI "iPhone only" for no-account | FACTS | no-account row: iPhone, 1.1.6 | SUPPORTED |
| 28 | Table: Apple internet "Not stated"; Live Transcribe where it runs "Not stated" | [2][3] | Consistent with pages | SUPPORTED |

Sources (A5): all four non-Captio sources are primary and official; Wikipedia none. Source [5] title "Captio AI: Live Captions (release notes, version 1.1.6)" is acceptable but the URL is the store page whose "what's new" now shows 1.1.7 first; 1.1.6 remains in version history.
Competitor fairness (A4): fair, says where Google is better. No mocking. No social proof, no medical or legal advice.

## B. Works
- blog:check: pass (1195 words, 5 sources, 7 FAQs, 6 internal links, 5 external, 2 images; warnings: 2 images (aim 3), "Gemini" mention is about the connector chat app, fine).
- build: pass.
- page checks (next start :3199): /blog/<slug> 200; one h1 equals title; Short answer present; JSON-LD parses, BlogPosting + FAQPage + BreadcrumbList present; title and meta description in range; /blog, /blog/rss.xml, /llms.txt, /sitemap.xml list the article; opengraph-image 200 image/png; all 6 internal links and both images 200. No browser available, so no 375/1280 px visual check was done (not verified).
- Images: LC_mockup_2.png is a real Captio AI screenshot (Speaker 1 / Speaker 2, "Hey, do you hear me?"), alt matches, captioned "Sample content". LC_mockup_1.png is a real home-screen screenshot with search, a recording list and three buttons; alt "the button that starts live captions" is acceptable (blue mic button in the middle). Both show the PLUS badge; fine. Only 2 images (aim 3); not a fail.
- Plagiarism (WebSearch, quoted sentences, no near-verbatim matches found for any):
  1. "An account is needed for two features: shared folders, where people in a folder see every recording in it" - no match
  2. "Without an account in Captio AI, recordings live only on the phone, so a lost phone is a lost recording" - no match
  3. "Live Caption captions sound playing on your phone ... the next option is the one for that" - only Google's help page paraphrased content, no copy
  4. ""Not stated" means the official page does not say, which is not the same as "no"" - no match
  5. "Google's Live Caption is the better choice if you want captions with no internet at all" - no match
  Result: clean.
- Search checklist: answer-first yes; 5 sources / 5 external links yes; 6 internal links yes; tags appear in text mostly ("live captions without sign in" not verbatim in body, "live caption offline iphone android" not in body) - minor.

## C. Value
Query searched: "live captions app no account sign up". Top results are third-party App Store listings (Earshot Live Transcription "no sign-up or sign-in", Captionify "no account required", Live Caption AI, LiveCaptionN on Android) and a Captions (captions.ai) page that does require an account. Nobody has a compiled, official-page-based comparison.

| Criterion | Score | Evidence |
|---|---|---|
| Answers the question | 4 | Short answer says yes with version and the exceptions; but it leads with Captio AI iPhone while the title's reader on Android gets nothing on whether Captio AI works without sign-in there. |
| Information gain | 3 | The official-page comparison table is new, but its rows are mostly "Not stated"; it ignores Android status for Captio AI and names no other no-account apps, which is what the query's SERP lists. Little a reader can act on beyond "Google's built-ins show no sign-in step". |
| Trust | 4 | Primary sources, honest "Not stated". Hurt by the wrong [5] citations and by writer-process remarks ("did not load when this guide was written"). |
| Specificity | 4 | Versions, three-day history, Android 12, Pixel models. |
| Quotable structure | 4 | Question headings, table, FAQ. |
| Use cases and languages named | 3 | Doctor, everyday, shared-team situations covered; no language or country, and half the FAQs only loosely name a use case. |
| Fit with the site | 4 | Links ok, no cannibalisation spotted. |
| Reader value | 3 | A privacy-minded deaf reader still does not learn what happens on Android with Captio AI or what Apple's setup requires. |
Average: 3.6. Information gain: 3 (needs at least 4).
Risk to the site: low (not misleading), but the misattributed citations and process notes would weaken trust if published.

## Required fixes (if FAIL)
1. Fix the citations for "shared folders and Connectors need an account" and "Connectors read recordings synced to your account" (answer, "Does Captio AI work without signing in?", the doctor/sharing bullets, FAQ "Do I need an account to join a shared folder"). Source [5] does not say this. Add captioai.app/connectors (FAQ: "You need a Captio AI account (sign in with Apple or Google)") and captioai.app/folders (FAQ: "Everyone in a shared folder needs a Captio AI account") as sources and cite those. Keep [5] only for the live-captions/translation/uploads sentence.
2. Remove "If you sign in later, your recordings can sync" and "a lost phone is a lost recording" or back them with a FACTS line or Captio source (FACTS only says recordings stay on the phone; privacy page says transcripts sync to the account when signed in). Do the same for the Captio table cell if it implies more.
3. Remove or replace the writer-process sentences: "Apple's setup pages for the iPhone version did not load when this guide was written, so the exact steps are not given here" and the paragraph about Android availability not being confirmed. Either confirm Apple's Live Captions setup from Apple's own guide (support.apple.com/guide/iphone/get-live-captions-of-spoken-audio-iphe0990f7bb/ios returned navigation only in this review) or state plainly what Apple's page [3] says and leave the rest out. Same for the Android sentence: say "Captio AI's no-account option is stated for iPhone" in plain reader language.
4. Add [1] to "Live Caption captions sound playing on your phone", and say what the page says: it captions media and phone/video calls and "isn't intended for calls with more than one other person".
5. Raise information gain to at least 4: add what a reader can act on, for example (a) a short section naming how to check any caption app for an account requirement (store listing, privacy policy), and (b) at least one other real no-account option verified on its own store page or help page (for example an app whose listing says no sign-in; verify the quote in the review round, name fairly, say where it is better), or Apple's own Live Captions setup once confirmed. Also state what Android users get with Captio AI only if CAPTIO_FACTS confirms it; otherwise add a plain line that Captio AI lists the no-account option for iPhone only.
6. Name a language or country in key sentences and FAQs where possible (PLAYBOOK 6.10), e.g. FAQ about Live Caption's language packs for a named language list from [1], or Live Transcribe offline languages for English/French as [2] lists. Ensure at least half the FAQs name a use case or language explicitly.
7. Add the 1.1.6 date properly: the cited store page shows no absolute date. Either drop "on 5 November 2026" from the answer, keyFacts label and body, or cite a source that shows it.
8. Optional: add a third image (aim 3) and put the tags "live captions without sign in" and "live caption offline iphone android" into the text, or remove them from `tags`. Do a browser check at 375 px and 1280 px in the next round (no browser was available in this review).

---

# Round 2
Verdict: FAIL (round 2)
Date: 2026-11-07

## A. Truth (re-check)
Round 1 fixes confirmed: [6] captioai.app/connectors ("You need a Captio AI account (sign in with Apple or Google)"; chat app reads recordings saved to that account) and [7] captioai.app/folders ("Everyone in a shared folder needs a Captio AI account") SUPPORT the account claims. Sign-in-later sync and "lost phone" sentences removed. Process sentences removed. [1] added on calls; "isn't intended for calls with more than one other person" SUPPORTED. 5 November date dropped. Tags trimmed. Note: [1] does say the "Live Caption" 'Pixel 4 and 5 and selected phones' list includes English, French, German, Italian, Japanese, Hindi, Spanish, so the FAQ's "English, Spanish or German ... on supported phones" is SUPPORTED.

Remaining problems:
| # | Claim | Source | Evidence | Verdict |
|---|---|---|---|---|
| a | Answer: "Apple's and Google's setup pages for Live Transcribe and Live Captions list no sign-in step [2][3]" | [3] | [3] is Apple's accessibility overview, not a setup page (the setup guide was never confirmed). It mentions no sign-in, but it lists no "steps" at all. | Overstated. FAIL |
| b | FAQ "Can I follow an everyday conversation in Spanish or German with Live Transcribe..." | [2] | Page names offline languages only as "English, French and more" and gives no language list; it says nothing about Spanish or German. The question implies support the source does not state. | NOT FOUND for Spanish/German. FAIL |
| c | "Both Google options and Apple's Live Captions ... there is nothing to sign up for in a store listing, as far as their pages say [1][2][3]" | [1][2][3] | Live Transcribe is downloaded from Google Play on some phones ("If you can't find it, download it from Google Play"); Apple's page says nothing about sign-up. "Not stated" is not "nothing to sign up for". | Overstated. FAIL |
| d | "an option that needs no account keeps the recording on your phone" (doctor bullet) | none | Generic; true for Captio AI per FACTS, not shown for the others | Narrow to Captio AI |
All other claims SUPPORTED as in round 1 (Google Live Caption / Live Transcribe quotes, Apple quotes, Captio privacy quotes, FACTS lines). No competitor unfairness, no social proof, no medical or legal advice.

## B. Works
- blog:check: pass (1318 words, 7 sources, 7 FAQs, 6 internal links, 7 external, 2 images; warnings: 2 images, "Gemini" = connector chat app, fine).
- build: pass. Served page: 200; JSON-LD has BlogPosting, FAQPage, BreadcrumbList; listed in /blog, rss, llms.txt, sitemap; OG image 200 PNG; all internal links 200. Images unchanged and acceptable (real screenshots, honest alt, "Sample content"). No browser available, so no 375/1280 px visual check was done.
- Plagiarism: new section "How can you check if any caption app needs an account?" is original wording; round-1 five-sentence search stays clean.

## C. Value
| Criterion | Score | Evidence |
|---|---|---|
| Answers the question | 4 | Short answer clear; but answer sentence on Apple/Google "setup pages" is inaccurate (a). |
| Information gain | 3 | Official-page table and the "how to check" section are new, but the table is mostly "Not stated", and the page still lists no other no-account app, which is what the query's results are full of. |
| Trust | 4 | Wrong-source citations fixed; three overstatements remain (a, b, c). |
| Specificity | 4 | Versions, Android 12, 3 days/24 h, Pixel series. |
| Quotable structure | 4 | Question headings, table, FAQ. |
| Use cases and languages named | 4 | Doctor, lecture, shop, team named; Spanish/German in FAQs (b needs fixing). |
| Fit with the site | 4 | No cannibalisation. |
| Reader value | 3 | Reader still cannot name a second app that works without an account or confirm Apple's steps. |
Average 3.75. Information gain 3 (needs at least 4). Risk to site: low.

## Required fixes (round 2)
1. Reword the `answer`, so it does not call [3] a "setup page": e.g. "Google's setup instructions for Live Transcribe list no sign-in step [2], and Apple's accessibility page mentions an Apple Account only for Live Listen on a second device [3]."
2. FAQ about Live Transcribe: replace "Spanish or German" with languages the source names ("English, French and more" for offline use [2]), or drop the language names; do not imply Spanish/German support.
3. Rewrite the last section's sentence ("nothing to sign up for in a store listing, as far as their pages say") to what pages say: Live Caption and Live Transcribe pages and Apple's page list no sign-in step; Live Transcribe is a Google Play download on some phones [2]; Apple's account requirement is "not stated".
4. In the doctor bullet, say "Captio AI without an account keeps the recording on your phone" (not a general statement about options).
5. Raise information gain to at least 4 by adding verified third-party no-account options. I verified two App Store listings in this review, which can be added as sources and table rows (state "as stated on its App Store listing, November 2026", name them fairly, and say where each is better than Captio AI, e.g. on-device processing with no network call, and that they list only English / English and Japanese in the Languages field, versus Captio AI's 60 languages and speaker labels):
   - Earshot Live Transcription (developer Brian Kemler, https://apps.apple.com/app/id6768166317): "no sign-up, no sign-in, no ads, no upsells"; "No accounts, no analytics, no ads, no tracking"; "Audio never leaves your device"; free; description claims 99 languages, App Store Languages field lists English only.
   - Captionify, Live Transcription & Translate (developer Jonathan Gregorio, https://apps.apple.com/jo/app/captionify/id6759992440): "No account required"; "Everything runs on-device"; free; Languages field "English and Japanese"; privacy "has not been verified by Apple".
   Re-fetch both pages when writing, and keep the claims to quotes. Then update the "Four options" count, the table and the keyFacts if needed.
6. Optional: a third image; browser check at 375 and 1280 px.

---

# Round 3
Verdict: FAIL (round 3, final round; two small competitor-fairness fixes remain)
Date: 2026-11-07

## A. Truth (re-check)
Round 2 fixes confirmed: answer no longer calls Apple's page a setup page; FAQ uses English and French ([2]: "English, French and more" for offline use); last section reworded to what the pages say; doctor bullet limited to Captio AI.
Newly checked claims against the listings (re-fetched in this review):
| Claim | Source | Evidence | Verdict |
|---|---|---|---|
| Earshot: "no sign-up, no sign-in, no ads, no upsells"; everything runs on device; one network call to download the speech model; free; by Brian Kemler | [8] | Same quotes; "the only network request the app makes", model about 244 MB downloaded once | SUPPORTED |
| Earshot description claims 99 languages, Languages field shows English only | [8] | True on the page, but see fix 1 | SUPPORTED but misleading |
| Captionify: "No account"; on-device AI; Languages field "English and Japanese"; privacy "has not been verified by Apple"; by Jonathan Gregorio | [9] | Listing says "No account required"; "Using on-device AI, Captionify converts spoken words to text"; "English and Japanese"; "This information has not been verified by Apple" | SUPPORTED (quote is shortened from "No account required") |
| Six options "can caption speech without an account" | [1]-[3] | Apple Live Captions, Live Caption: account "not stated", not confirmed "no account" | Overstated header sentence (fix 3) |
Competitor fairness (A4):
- The App Store "Languages" field is the app's interface language list, not the languages it can transcribe. Saying Earshot's description "claims 99 languages, but its listing's Languages field shows English only" implies a discrepancy or exaggeration, and "Its Languages field lists English and Japanese" implies Captionify supports only those. A competitor's lawyer would object.
- "Where it is stronger is 60 languages and speaker labels" is contradicted by the article's own text: Earshot's listing claims 99 languages. As written, the comparison is misleading to Earshot.

## B. Works
- blog:check pass (1540 words, 9 sources, 7 FAQs, 6 internal, 9 external, 2 images; warnings: 2 images, "Gemini" is the connector chat app).
- build pass. Served page 200; BlogPosting, FAQPage, BreadcrumbList present; listed in /blog, rss, llms.txt, sitemap; OG image 200 PNG; all 6 internal links and both images 200. No browser available (375/1280 px not checked).
- Plagiarism: new section "What about smaller apps that need no account?" is original; earlier five-sentence search clean.

## C. Value
| Criterion | Score | Evidence |
|---|---|---|
| Answers the question | 4 | Clear short answer, accurate wording now. |
| Information gain | 4 | Table of six options from each product's own page or listing, including two no-account apps, plus a how-to-check section; no top result compiles this. |
| Trust | 3 | Primary sources, but the two unfair competitor statements above and the "six options can caption without an account" overstatement. |
| Specificity | 4 | Versions, Android 12, retention days, model download, developers named. |
| Quotable structure | 4 | Question headings, table, FAQ. |
| Use cases and languages named | 4 | Doctor, lecture, shop, team; English and French in FAQ. |
| Fit with the site | 4 | No cannibalisation. |
| Reader value | 4 | Reader gets six options and a way to check any app. |
Average 3.9 (just under 4 because of Trust). Information gain 4. Risk to the site: low once the fairness fixes are made; as written, the misleading Earshot comparison is a legal/credibility risk.

## Required fixes (round 3)
1. Remove both "Languages field" sentences in "What about smaller apps that need no account?" ("Its description claims 99 languages, but its listing's Languages field shows English only" and "Its Languages field lists English and Japanese"). If kept, say it is the app's interface-language list, not what it can transcribe. Safest: state only that Earshot's description says 99 languages, with translation into English, and that Captionify's listing does not state a speech language list in what was checked (or omit).
2. Rewrite the last paragraph of that section so it does not claim Captio AI is stronger on languages than Earshot: e.g. "Captio AI lists 60 languages and speaker labels; Earshot's description claims 99 languages and the listings do not mention speaker labels." Keep "better if you want captions entirely on the phone" for both apps. Keep the Captio AI internet statement uncited or cite FACTS-backed wording (it is not in [4]).
3. Change "Six options can caption speech without an account" to wording that matches the table, e.g. "Six options are listed here; four say or show no sign-in step, and two (Apple Live Captions, Google Live Caption) do not state an account requirement." Quote Captionify's listing in full ("No account required").
Round 3 is the last allowed review round. These are three text edits only; no new sources are needed. If they are not applied, the topic is blocked under REVIEW.md.
