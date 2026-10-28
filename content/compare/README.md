# Compare section (captioai.app/compare)

Pages that put caption and accessibility apps for deaf and hard of hearing people side by side. Every table cell links to the page it came from. The goal is the same as the blog's: be the page Google, ChatGPT, Perplexity and Gemini trust and quote for "X vs Y", "X alternatives" and "best app for …" questions. That only works if every fact is checkable and the page is fair.

Code: `src/lib/compare.ts` (loader, validation, citations), `src/components/compare/CompareParts.tsx` (tables, cards), `src/app/compare/page.tsx` (hub), `src/app/compare/[slug]/page.tsx` (one comparison), `src/lib/compareSchema.ts` (JSON-LD). A broken file fails the build on purpose. Check before publishing: `npm run compare:check` (add `-- --links` to test every source URL).

## Files

```
content/compare/
  apps/<slug>.json     one app, every fact with its sources (the research)
  pages/<slug>.md      one comparison page
  index.md             the hub: short answer, one table per group, FAQs
```

### An app (`apps/<slug>.json`)
Every app has every row in `ROWS` (`src/lib/compare.ts`). Each fact:

```json
{ "status": "yes | no | partial | not_stated", "text": "short cell", "detail": "one or two sentences", "sources": ["s1"] }
```

- `text` is what the table shows: a fact, never an adjective ("80+ languages", "US$16.99/month", "No"). Max ~60 characters.
- `detail` shows under the cell on head-to-head pages. Plain words.
- `sources` are ids from the app's `sources` list. Every fact except `not_stated` needs one.
- `strengths` and `limits`: 2–4 each, one sentence, sourced. Limits are facts ("Android only"), not opinions.
- `sources[]`: `title`, `publisher`, `url`, `type` (official, help, pricing, privacy, store, press), `opened` (did we read it ourselves), `checked` (date we read it), `quotes` (the exact supporting sentence, kept so anyone can re-check; not shown on the page).
- `captio-ai.json` is written from `content/blog/CAPTIO_FACTS.md`, with the same rules and its limits included. Update both together.
- `icon`: the app's own icon from its store listing (App Store, or Google Play for Android-only apps), saved as a 192px PNG in `public/compare/icons/<slug>.png` by `node scripts/compare-icons.mjs` (new apps only; `--all` fetches every icon again, e.g. after an app changes its icon). Features built into the phone have no listing and keep a letter tile. The icon shows on the hero cards, both tables, the comparison cards and the share image.

### A page (`pages/<slug>.md`)
Frontmatter only, no Markdown body: the page is a landing page built from these blocks, in this order (hero with the verdict and one card per app, the side-by-side table, key differences, where each one wins, situations, how we compare, FAQ, download, more comparisons, sources). Reference: `pages/captio-ai-vs-live-transcribe.md`.

```yaml
---
title: "Captio AI vs Google Live Transcribe"     # no brand suffix, the layout adds " | Captio AI"
description: "…"                                # 140–160 characters, the meta description
kind: versus                                    # versus | roundup | alternatives
apps: [captio-ai, live-transcribe]
rows: [platforms, roomCaptions, languages, …]   # 14–18 keys of ROWS, in the order to show
published: 2026-10-28
updated: 2026-10-28
answer: "…"                                     # 2–3 sentences, who should pick which
picks:                                          # "Pick it if" on each app's hero card
  - { app: live-transcribe, text: "…" }
differences:                                    # 4–6 cards, the question people ask + the answer
  - { title: "Does Live Transcribe work on iPhone?", text: "No. …", sources: [live-transcribe:platforms, captio-ai:platforms] }
better:                                         # "Where X is the better choice", 3–5 points per app
  live-transcribe:
    - { text: "It costs nothing and has no daily limit.", sources: [live-transcribe:freePlan] }
  captio-ai: [ … ]
situations:                                     # 5–6 "which one for this situation" cards
  - { icon: doctor, title: "…", pick: live-transcribe, text: "…", link: /use-cases/doctor-appointments }
faqs:
  - { q: "…", a: "…" }
tags: [ … ]
related: [captio-ai-vs-ava]
draft: false
---
```

Sources are refs, never footnote numbers: `live-transcribe:offline` = every source behind that app's "offline" fact, `live-transcribe:s3` = that one source. The page shows them by name ("Google Play listing", "Use Live Transcribe (Google)"); a table fact opens to show its detail and sources. A source can carry a `label` when the automatic name reads badly.

Situation icons: doctor, dinner, meeting, lecture, travel, home, phone, offline, translate, iphone, android, work, glasses, money, video. `pick` is an app slug, `both` or `neither`.

### The landing page (`index.md`)
`groups` (each a section of comparison cards; an app shows when its `captio-ai-vs-<app>` page exists), `overview` (one at-a-glance table: apps, rows), `answer`, `faqs`.

## Page types and how to write them

**versus** (`captio-ai-vs-<app>`): Captio AI and one other app. The other app's "better" points are the most important part of the page: say clearly where it wins. `answer` says who should pick which, straight away. Difference titles are the questions people type ("Does Ava work offline?"), answered in the first words. FAQs: 6–8, at least half name a situation, a language or a country, and every answer says what Captio AI does on that question (Nejc, 2026-10-28; `compare:check` fails without it).

**alternatives** / **roundup**: for later (e.g. "Live Transcribe for iPhone", "apps that caption in-person conversations"); same blocks, more apps.

## Rules (these keep Google and AI answer engines on our side)

1. **Every cell sourced, from the company's own pages**, opened by us: website, pricing, help centre, privacy policy, App Store or Google Play listing; for Apple and Google built-ins, support.apple.com and support.google.com. Press only when nothing official says it. Never Wikipedia, listicles, or one competitor's blog about another.
2. **Never guess.** Not on their website = `not_stated`, shown as "Not stated".
3. **Fair.** Every versus page says where the other app is better (`better`, checked by `compare:check`). Their strengths go in the table and the cards. No mockery, no "fails to", no "best", "most accurate" or "only" claims about Captio AI.
4. **Dated.** Prices with currency, country and month ("US$16.99/month, US App Store, October 2026"). Re-check an app before editing a page that shows it, and at least every 90 days; `npm run compare:check` lists stale sources.
5. **No ratings, reviews, testimonials or user counts**, ours or theirs, and no `aggregateRating`/`Review` schema. Store ratings change daily and would be ours to keep true.
6. **Disclosed.** Every page says Captio AI made it, how facts were checked, and has the contact address for corrections (the template adds this).
7. **No fake first-hand testing.** Don't write "we tested" unless someone did, on a named device and date. Real tests (screenshots, a timed conversation) are the strongest thing a page can add: say what was done.
8. **Captio AI is not a phone-call or video-call service.** On pages about call-captioning apps, say plainly that they do a different job.
9. Never name Captio AI's speech-recognition or AI providers. The Soniox app is compared as an app like any other (its page and the hub may name it), but no page says or hints what Captio AI's captions run on, and none compares the two on accuracy.
10. Always "Captio AI", never "Captio". Feature names capitalised: Live Captions, Live Translator, Audio Transcription, AI Summary.

## Adding a page
1. Make sure every app on it has a file in `apps/` checked within 90 days (or re-check it). For a new app, run `node scripts/compare-icons.mjs` to add its icon.
2. Write `pages/<slug>.md` as above. `npm run compare:check -- <slug>`; the dev server shows the page at /compare/<slug>.
3. `npm run build` (the loader validates every citation).
4. After it's live: `node scripts/indexnow.mjs https://captioai.app/compare/<slug>`.
