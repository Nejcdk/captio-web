# Review: How to ask Claude or ChatGPT about your meeting recordings
Verdict: PASS
Date: 2026-11-01

## A. Truth
| # | Claim | Source | Evidence (quote) | Verdict |
|---|---|---|---|---|
| 1 | Connectors arrived in 1.1.4; release-note quote "Connectors: ask Claude, ChatGPT, Gemini or Perplexity about your recordings. Settings → Connectors shows how." | [1] App Store | 1.1.4 notes: identical quote (store now shows 1.1.5 as latest) | SUPPORTED |
| 2 | Source [1] title "Captio AI: Live Captions & Transcription" | App Store | Listing is titled "Live Captions - Captio AI" | NOT FOUND (title mismatch, fix) |
| 3 | Custom connectors on Free, Pro, Max, Ultra, Team, Enterprise; "Free users are limited to one custom connector" | [2] Claude Help | "available on Claude, Cowork, and Claude Desktop for users on Free, Pro, Max, Ultra, Team, and Enterprise plans"; "Free users are limited to one custom connector." | SUPPORTED |
| 4 | Claude steps: Customize > Connectors, + Add, Add custom connector, name, URL, continue | [2] | Same | SUPPORTED |
| 5 | Step 5 "Review the authentication settings and click Add" | [2] | Source: review settings, click Continue, choose Sign in now / when needed / none, then "click Add" | SUPPORTED, but compressed (Continue and the sign-in choice are skipped) |
| 6 | "Then click Connect, sign in..." (presented for every plan) | [2] | Source mentions Connect only for Team/Enterprise members after an owner adds it | NOT FOUND for Pro/Max/Free; reword or say "if Claude shows Connect" |
| 7 | "+" at lower left of chat, Connectors, toggle | [2] | "Click the "+" button at the lower left... then "Connectors." ... toggle" | SUPPORTED |
| 8 | Team: only Owners and Primary Owners can add; members connect themselves | [2] | "only Owners and Primary Owners can add them to Team plans"; each user connects individually | SUPPORTED |
| 9 | Gemini: 18+, US, personal Google account, Keep Activity on, English, web app only, works on mobile after setup | [3] Google help | "Be 18 or over and in the US"; "isn't available if you sign in with a work or school Google Account"; "Custom apps are unavailable when [Keep Activity] is off"; "Only available in English"; "only connect custom apps in the Gemini web app"; available on mobile once connected | SUPPORTED |
| 10 | Gemini path "Settings, Connected Apps, ... add a custom app. Enter URL and click Next" | [3] | Path supported; the page says "choose the option that moves you forward", not "Next" (and Personal Intelligence first if Connected Apps is missing) | NOT FOUND for the word "Next" |
| 11 | "A student in Germany or a teacher in the UK cannot use this route" | [3] | Follows from "in the US" | SUPPORTED (inference, fair) |
| 12 | Perplexity: "To add a remote MCP connector, open Plugins in the sidebar and select Add custom"; "require remote authentication"; no plan stated | [4] | Exact quote on page; no plan restrictions mentioned (WebFetch got through despite the check script's 403) | SUPPORTED |
| 13 | MCP is "an open-source standard for connecting AI applications to external systems"; lists ChatGPT next to Claude | [5] | "MCP ... is an open-source standard for connecting AI applications to external systems." "AI applications like Claude or ChatGPT can connect..." | SUPPORTED |
| 14 | ADA.gov: "communication with people with these disabilities is equally effective as communication with people without disabilities"; real-time captioning among aids | [6] | Quote and captioning/CART listed | SUPPORTED |
| 15 | Captio claims: read-only; own + shared-folder recordings; never colleagues' other recordings; meaning across languages + exact words; needs account (Apple/Google); address https://captioai.app/mcp; Gemini needs personal Google account, US, English | CAPTIO_FACTS.md "connectors" row | Matches the row line by line | SUPPORTED |
| 16 | "Names show when you saved the voice of the person speaking" | CAPTIO_FACTS (Recognize voices) | Not checked in the connectors row; voice names do reach the connector per the app notes | SUPPORTED (acceptable; confirm the Recognize voices row exists in FACTS) |
| 17 | US consent rules are in the folders guide | internal article | That article covers recording consent | SUPPORTED |
| 18 | ChatGPT: plans and menu | OpenAI help | help.openai.com returns 403 (two articles tried); web search gives only conflicting third-party guides | UNREACHABLE; the article honestly says "not confirmed", so no false claim, but see C |
| 19 | "If ChatGPT does not offer custom connectors on your plan, Claude's free plan is the way to try this without paying" | none | Unsourced, and it implies ChatGPT has plan limits it just said it could not confirm | UNCITED, delete |

No fake social proof, no medical/legal advice (the ADA section is disclaimed). Sources are primary (each company's own help page, MCP site, ADA.gov). Competitors are treated fairly; Claude's free-plan generosity and Gemini's limits are stated plainly.

## B. Works
- blog:check: pass (warnings: "Gemini" mention is about the product, fine; Perplexity 403 for the script, I opened it by hand and it is fine)
- build: pass (`.next` present; article served by `next start -p 3199`)
- page checks: `/blog/<slug>` 200, one h1, Short answer present; JSON-LD has BlogPosting, FAQPage (7 Questions), BreadcrumbList; `/blog`, `/blog/rss.xml`, `/llms.txt`, `/sitemap.xml` all list it; opengraph-image 200 image/png; all internal links (/connectors, 4 use-case pages, /live-captions, /audio-transcription, 2 blog articles) 200; 3 images 200.
- Images: all three are real Captio AI app screens (Connectors tab, step 3 and step 4 of the in-app guide) with sample content, captioned "(sample content)". Alt text matches what they show. Pass. Note image 2 shows name and URL with an Add button, matching text.
- Plagiarism (5 sentences searched in quotes, no matches on any page): "A student who missed a line can find the passage by meaning instead of rereading an hour"; "Gemini only accepts Captio AI as a custom app for some people"; "A team that records its weekly meetings into one shared folder needs an owner to add the connector once"; "A transcript you can search is a tool, not an accommodation"; and "Name the situation so the chat app searches the right recordings" (paraphrase-level, none found). Pass.
- Search checklist: answer-first yes; 6 sources, 6 external links; 9 internal links; tags in text; JSON-LD valid. Meta description names Claude, Gemini, Perplexity but not ChatGPT, while the title is about ChatGPT.

## C. Value
Searched "ask chatgpt about meeting recordings transcript connector": results are vendor pages (Speak AI, ScreenApp, Scribbl, Spinach, Transkriptor) and an ITPro piece; none explains the plan and region rules per chat app for a deaf-focused tool.

| Criterion | Score | Evidence |
|---|---|---|
| Answers the question | 3 | Title promises ChatGPT; the Short answer covers Claude and Gemini only and ChatGPT is "not confirmed here". |
| Information gain | 3 | The Gemini (18+, US, English, personal account) and Claude (free = 1 connector) rules compared in one table are useful, but a third of the table (the whole ChatGPT column) is empty and Perplexity is mostly "not stated". |
| Trust | 5 | Each chat app's own help page, dated "as of November 2026", honest about gaps. |
| Specificity | 4 | Exact menu names, quotes, addresses, concrete questions for meetings, lectures, conferences. |
| Quotable structure | 4 | Question headings, answer-first sections, comparison table; one odd heading ("Where does Captio AI live captioning fit before the questions?"). |
| Use cases and languages named | 3 | Four use cases have sample questions, but languages are barely named (one FAQ about Spanish) and few FAQs name a use case beyond lecture/conference. Meets the half-of-FAQs bar only loosely. |
| Fit with the site | 4 | Links to folders guide, use cases, /connectors; no cannibalisation. |
| Reader value | 3 | A ChatGPT user (the biggest audience in the title) cannot act on it. |

Average 3.6 (needs 4); Information gain 3 (needs 4). 
Information gain: the cross-app plan/region rules table, but it is incomplete exactly where readers search (ChatGPT).
Risk to the site: low (honest, not misleading), but a title promising ChatGPT that delivers nothing on it is a weak, mismatched page.

## Required fixes (round 2)
1. Fill the ChatGPT gap with a confirmed fact. OpenAI's help pages return 403 to bots: try other openai.com pages (platform.openai.com/docs/guides/developer-mode, developers.openai.com/api/docs/mcp which the MCP site links to, help.openai.com via the Wayback Machine or a Google cache) and quote plan list, menu path and the admin rule for Business/Enterprise/Edu. Add it to the ChatGPT section, the table, a FAQ ("Does ChatGPT support custom connectors?"), the `answer`, and add source [7]. If it still cannot be confirmed anywhere, change the title, `answer` and `description` so ChatGPT is not the headline (e.g. "How to ask Claude about your meeting recordings with the Captio AI connector"), keep the honest ChatGPT note, and update topics.json query accordingly.
2. Delete the unsourced sentence "If ChatGPT does not offer custom connectors on your plan, Claude's free plan is the way to try this without paying."
3. Fix source [1] title to match the store listing ("Live Captions - Captio AI").
4. Gemini step: remove "click Next" or say "continue" as the page words it; mention Personal Intelligence if Connected Apps is not visible.
5. Claude steps: say after step 4 "choose how to sign in and click Add" (source has Continue, a sign-in choice, then Add), and only say "Then click Connect" as what happens once the connector is added if you can source it (the page mentions Connect for Team/Enterprise members); otherwise phrase "Claude then asks you to connect."
6. Add `ChatGPT` to the meta `description` (or follow fix 1's retitle) so title and description agree.
7. Use cases and languages (PLAYBOOK 6.10): make at least half of the FAQs name a use case or language; add one FAQ naming a language (e.g. a Spanish or Slovenian lecture asked about in English, with Gemini's English-only limit noted) and rename the heading "Where does Captio AI live captioning fit before the questions?" to a plain question.
8. After fixes, re-run `npm run blog:check`, then re-submit for round 2.

Verdict: FAIL (round 1)

---

# Round 2 (2026-11-01)
Verdict: PASS

## A. Truth (re-checked)
- Source 7 re-opened (https://developers.openai.com/api/docs/mcp/): "Open ChatGPT Plugins, then the plus button, Add custom MCP server", enter URL and authentication details, "I understand and want to continue", "Create as a plugin", install and test in chat; "users in your workspace will get an OAuth flow to your service"; "We recommend using OAuth". The page lists no plans and does not mention developer mode, so "Not stated [7]" in the table and the FAQ ("Neither page used here lists which plans") are accurate. SUPPORTED.
- Fix 2: unsourced Claude-free-plan sentence gone. Fix 3: source 1 title now "Live Captions - Captio AI". Fix 4: Gemini text now "continue and follow the on-screen instructions" plus the Personal Intelligence note, matching the Google page. Fix 5: Claude step 5 and the Connect sentence now match the Anthropic page (Continue, sign-in choice, Add; Connect first only for Team and Enterprise members). All SUPPORTED.
- All round 1 SUPPORTED claims unchanged. New FAQs (Spanish or Slovenian lecture; UK teacher and Gemini) follow from CAPTIO_FACTS and the Google page. No fabricated proof, no advice.

## B. Works
- blog:check: pass (7 sources, 8 FAQs, 9 internal links, 7 external, 3 images; the Perplexity 403 is the script only, I opened it by hand in round 1).
- build: pass. Fresh `next start -p 3199`: /blog/<slug> 200, ChatGPT steps in the HTML, JSON-LD has BlogPosting, FAQPage (8 Questions), BreadcrumbList; /blog, rss, llms.txt, sitemap list it; OG image 200; all internal links 200.
- Images unchanged and pass. Plagiarism: round 1 five sentences clean; the new text is quotes with attribution plus the article's own wording.

## C. Value
| Criterion | Score | Evidence |
|---|---|---|
| Answers the question | 4 | Short answer now covers ChatGPT, Claude and Gemini. |
| Information gain | 4 | All four apps' menu paths in one table plus Claude free limit, Gemini 18+/US/English/personal account, and the UK-teacher and language FAQs; ChatGPT plans stay honestly unstated. |
| Trust | 5 | Each company's own page, "Not stated" used honestly. |
| Specificity | 4 | Exact menus, quotes, address, use-case questions. |
| Quotable structure | 4 | Question headings, answer-first, table. |
| Use cases and languages named | 4 | Meetings, lectures, conferences, group settings; Spanish, Slovenian, UK named in FAQs. |
| Fit with the site | 4 | Links to folders guide, use cases, /connectors. |
| Reader value | 4 | A ChatGPT user can now follow the steps; plan check is pointed to the app. |

Average 4.1, Information gain 4, nothing below 3.
Risk to the site: none.

Optional (not blocking): if OpenAI later publishes a plan list, add it to the ChatGPT column.

Verdict: PASS
