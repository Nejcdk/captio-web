# Review: How to see a doorbell, alarm or crying baby in live captions
Verdict: FAIL (round 1)
Date: 2026-10-30

## A. Truth
| # | Claim | Source | Evidence (quote) | Verdict |
|---|---|---|---|---|
| 1 | 1.1.5 shows doorbell, alarm, crying baby, barking dog, laughter or music in captions like [doorbell rings]; alerts vibrate; Settings, Recognize sounds | [1] App Store | "Recognize sounds: a doorbell, an alarm, a crying baby, a barking dog, laughter or music now show in your captions like [doorbell rings]. Alerts make your phone vibrate. Change it in Settings → Recognize sounds." | SUPPORTED |
| 2 | keyFact "5 sounds ... doorbell, alarm, crying baby, barking dog, laughter or music" and body "name five sounds" | [1] | The notes list six items (laughter and music are two sounds). The article's own table lists six. Count contradicts itself. | FAIL (fix) |
| 3 | FAQ 7: "Can I turn sound captions off? Yes." | [1], CAPTIO_FACTS | Notes only say "Change it in Settings → Recognize sounds". FACTS says "Change it in Settings, Recognize sounds." Nothing about turning off. | NOT FOUND (FAIL) |
| 4 | Captio AI is "the better fit" when following a conversation; "Captio AI is the better fit" | FACTS "No best/only claims" | Situation-scoped, but it is a superiority claim with no source for the app's behaviour. Soften. | Minor, fix |
| 5 | Apple "15 different sounds" | [2] | "This feature recognizes 15 different sounds." | SUPPORTED |
| 6 | Apple examples sirens, horns, crying babies | [2] | "Your iPhone will listen for and detect sirens and horns and even the sound of a crying baby." | SUPPORTED |
| 7 | Apple notification, custom sounds, "listens for certain sounds", on-device | [2] | "Sound Recognition listens for certain sounds and uses on-device intelligence to notify you"; "train your device to listen for ... electronic sounds that are unique to your environment" | SUPPORTED |
| 8 | Apple: don't rely where harmed or in emergencies | [2] footnote 19 | "Don't rely on Sound Recognition in circumstances where you may be harmed or injured, in high-risk or emergency situations" | SUPPORTED |
| 9 | Apple: not in all regions/languages, "points to its availability list for Sound and Name Recognition" | [2] | "Some features ... may not be available in all regions or all languages", directs to feature availability pages. "Sound and Name Recognition" wording not confirmed. | SUPPORTED (wording loose) |
| 10 | Android sounds list; vibrate or camera flash; Pixel preinstalled; Live Transcribe & Notifications app; always listening / battery; place phone mid-room, uncovered | [3] | "Smoke and fire alarms, sirens, baby crying, dog barking, knocking, doorbells, appliance beeping, landline ringing, running water"; "always listening"; "put the phone in the middle of the room" | SUPPORTED |
| 11 | 2007 Bruck and Thomas, Victoria University: 3100 Hz failed to wake 43% (mild to moderately severe loss); strobe 27%; 520 Hz square wave 92% at 75 dBA, 100% at 95 dBA | [4] | Same figures confirmed on the page. | SUPPORTED |
| 12 | Captio AI does not caption phone calls | FACTS | Line in "What it is". | SUPPORTED |
| 13 | iPhone only; Android not confirmed | FACTS | Feature map: iPhone, 1.1.5. | SUPPORTED |

Source quality: [1] to [3] are the companies' own pages. [4] is a trade-magazine report of the Bruck and Thomas study, not the paper itself; acceptable but a primary link (the paper or Victoria University) would be better. I did not verify that the page title matches the `sources` title exactly. No fake social proof, no medical advice (safety paragraph defers to the fire service). No competitor lawyer risk found; Apple and Google are quoted fairly and the article says where they are better.

## B. Works
- blog:check: pass (976 words, 4 sources, 7 FAQs, 4 internal links, 4 external, 1 image; warning: aim for 3 images).
- build: pass.
- page checks on `next start -p 3199`: article 200; h1 is the title; Short answer present; JSON-LD parses and contains BlogPosting, FAQPage, BreadcrumbList; /blog, /blog/rss.xml, /llms.txt, /sitemap.xml all list the slug; opengraph-image returns image/png 200; /live-captions, /use-cases/everyday-conversations, group-settings, restaurants and /LC_mockup_2.png all 200. Browser width check not done (no browser available).
- Image: `/LC_mockup_2.png` is a real Captio AI screenshot, but it shows ordinary speech captions ("Hey, do you hear me?") and no sound caption, so it does not illustrate the article's subject. Alt text is accurate and captioned as sample content. Only 1 image (aim 3).
- Plagiarism: searched 5 distinctive sentences in quotes (doorbell/family sentence, "Use the tool that matches the moment...", "A phone alert cannot replace a smoke alarm made for...", "Apple and Google are better when...", "you have three kinds of tools..."). No near-verbatim matches. PASS.
- Search checklist: answer-first yes, 4 sources, 4 external links, 4 internal links, tags appear in text, JSON-LD ok.

## C. Value
Search "deaf doorbell alert phone captions sounds": top results are vendor buyer's guides (Bellman, RNID, specialneeds.com, apps like Sound Alert and Earzz). None cover sounds written inside live captions.

| Criterion | Score | Evidence |
|---|---|---|
| Answers the question | 4 | Short answer names the feature, version and the smoke-alarm limit; quotable alone. |
| Information gain | 4 | Side-by-side of Captio AI, Apple and Android from their own pages, plus the 43% / 27% / 92% smoke-alarm figures and an honest "not confirmed" section. Captio AI's side is thin because the notes are thin. |
| Trust | 4 | Primary pages, honest limits; docked for the unsupported "Yes" and the sound count. |
| Specificity | 3 | Good numbers on the alarm study; the use-case sections are generic (restaurant: "music appears as a sound"). |
| Quotable structure | 4 | Question headings, two tables, FAQ. |
| Use cases and languages named | 3 | Three use cases linked; FAQs mostly name a setting, none a language or country except the Android UK/US one; the UK/US FAQ does not give UK/US specifics. |
| Fit with the site | 4 | New query, no other article covers it, 4 relevant internal links. |
| Reader value | 4 | A deaf reader gets a clear "phone is not a smoke alarm" message and a comparison. |

Average about 3.75, below the 4 needed. Information gain: 4 (the three-way comparison and alarm-study numbers; no top-5 result has them).
Risk to the site: low, but the uncited "Yes" and the mismatched count are misleading as written.

## Required fixes (FAIL)
1. FAQ "Can I turn sound captions off in Captio AI?": remove "Yes". Say only that the release notes say you change it in Settings under Recognize sounds and do not say whether sounds can be switched off. Better: retitle to "Where do I change sound captions in Captio AI?".
2. Fix the sound count. Either say "six sounds" (doorbell, alarm, crying baby, barking dog, laughter, music) in keyFacts (value and label) and in "What is not confirmed yet", or drop the number. Make it match the table.
3. Replace "Captio AI is the better fit..." (the compare paragraph) with situation wording that is not a superiority claim, for example "Captio AI is built for the moment you are already following a conversation...".
4. Improve the image: use a real screenshot that shows a sound caption such as [doorbell rings] if one can be supplied (do not invent UI), or remove the claim that the image supports the feature. Aim for 2 to 3 relevant images; the single speech-only mockup does not match the topic.
5. Raise Specificity and the use-case/language score: make the restaurant and lecture lines concrete without new claims about the app, and add a UK or US specific point in the Android FAQ (for example availability of the Live Transcribe & Notifications app) only if the Google page states it; otherwise rename that FAQ to drop "in the UK or US".
6. Recommended: cite the Bruck and Thomas paper or Victoria University page as an additional primary source for [4], and confirm the `sources` title of [4] matches the page.

---

# Round 2
Verdict: PASS (round 2)
Date: 2026-10-30

Re-checked the revised article against round 1 fixes:
1. FAQ retitled "Where do I change sound captions in Captio AI?"; no "Yes"; matches the notes ("Change it in Settings → Recognize sounds"). Fixed.
2. keyFacts "6 sounds" and "six sounds" in the last section; table lists six; matches the release notes. Fixed.
3. "Captio AI puts the sound in the same place as the words, which suits you when..." is no longer a superiority claim. Fixed.
4. Image: still only /LC_mockup_2.png (real screenshot, speech only). Caption now says honestly that it shows speech only; alt text is accurate. No invented UI. Accepted, because no real sound-caption screenshot exists. Advisory: add one when the app team supplies it.
5. Android FAQ no longer mentions UK/US; lecture, meeting, restaurant lines are concrete and make no new app claims beyond "laughter and music show" (supported by [1]). Fixed.
6. Source [4]: page headline is "Current Smoke Alarms Unable to Wake Millions of Hard of Hearing", The Hearing Review, 13 August 2007. Matches the listed title; the parenthetical author note is the writer's addition and the figures were verified in round 1. Acceptable.

Checks: blog:check passes (1048 words, 6 internal links, 4 external, 1 image warning only). Round 1 build, server, JSON-LD, plagiarism and claim checks still apply; the changes were text-only. New internal links /use-cases/lectures and /use-cases/meetings exist as use-case pages.

Scores: answers the question 4, information gain 4, trust 4, specificity 4, quotable structure 4, use cases and languages named 4, fit 4, reader value 4. Average 4. Risk to the site: none.

Required fixes: none. Advisory only: add a real sound-caption screenshot and a primary link for the 2007 study when available.
