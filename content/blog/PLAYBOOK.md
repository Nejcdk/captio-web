# Captio AI blog playbook

This is the brief for whoever writes an article for captioai.app/blog, human or model. Read it in full before every run, together with `CAPTIO_FACTS.md` (what is true about Captio AI, including the Feature map), `REVIEW.md` (the check every article must pass), `DAILY.md` (the steps of a daily run) and `PLAN.md` (what the blog covers and why). The site-wide rules in the repo's `CLAUDE.md` apply too, especially the Copywriting Brief and the ban on fake reviews.

## 1. What the blog is for

People ask ChatGPT, Perplexity, Gemini, Claude and Google questions like "how many people are deaf", "best live caption app for my mum", "Captio AI vs Live Transcribe", "how do I follow my doctor with hearing loss". The blog exists so the best answer to those questions is on captioai.app, and the assistants cite it.

An article earns that by being the most useful, most trustworthy page for one question: it answers in the first lines, backs every number with a primary source, compares tools fairly, and adds something the other pages don't have.

Readers: deaf and hard of hearing people, and their families, teachers, employers and doctors. English, plain words, international (US and UK both matter; say which country a rule or number applies to).

## 2. Hard rules (an article that breaks one is not published)

1. **Every fact is true and checked.** Every number, date, price, law and product feature has a source you opened in this run. Numbers carry a citation marker `[n]`.
2. **Captio AI claims come only from `CAPTIO_FACTS.md`.** Nothing else about our app, not even plausible things.
3. **No invented people or social proof.** No quotes from "users", no reviews, ratings, testimonials, case studies, personas, user counts. Quotes only from published sources, attributed, under 25 words.
4. **Competitors: fair and verified.** Name them (allowed on the blog). Describe them from their own website, help pages or store listing, opened in this run. Say where they are better than Captio AI. No mockery, no guesses, no "fails to" without a source. Prices get "as of <Month YYYY>" and the country or currency.
5. **Never name Captio AI's speech-recognition or AI providers.** (General articles may mention companies like Google or Microsoft as products people use.)
6. **Always "Captio AI"**, never "Captio" alone. Feature names are capitalised: Live Captions, Live Translator, Audio Transcription, AI Summary.
7. **No medical or legal advice.** Explain what sources say and point to professionals and official pages. Say "legal information, not legal advice" on rights articles.
8. **Captio AI is for in-person speech.** Never present it as a phone-call or video-call captioning tool.
9. **Accessibility first.** Deaf and hard of hearing people are the readers, not "users" or "customers". Never describe Captio AI as just a transcription tool.
10. **No "·" anywhere**, no exclamation marks, no hype words (powerful, seamless, revolutionary, game-changing, cutting-edge, best-in-class, world-class, groundbreaking, unparalleled, supercharge, unlock, elevate, delve).

## 3. The article file

One file: `content/blog/posts/<slug>.md`. The slug is the main question in a few words, lowercase-hyphenated, no year, no stop-word clutter: `captio-ai-vs-live-transcribe`, `hearing-loss-statistics-us`, `what-is-cart-captioning`. Never change a slug once published.

```yaml
---
title: "Captio AI vs Google Live Transcribe: which is better for conversations?"   # 30–70 characters, the question people ask; may include the year for data and "best" articles
description: "…"            # 110–160 characters; a concrete summary with a number or a fact, not a teaser
category: comparisons       # comparisons | data | guides | explainers
published: 2026-10-22       # today, the day it goes live
updated: 2026-10-22         # change only when the content changes
author: nate
tags: [live transcribe, live captions, android, deaf]   # 3–6 real search phrases
answer: "…"                 # the Short answer box: 40–80 words, answers the title on its own (see 6.1)
keyFacts:                   # 2–4 numbers worth remembering, each with its source number
  - value: "120+"
    label: "languages and dialects in Live Transcribe"
    source: 2
faqs:                       # 4–8 follow-up questions people actually ask, answers 30–80 words, plain text
  - q: "Is Live Transcribe available on iPhone?"
    a: "…"
sources:                    # numbered in this order; cite as [1], [2] in the body
  - title: "Live Transcribe & Sound Notifications"
    publisher: "Google Play"
    url: "https://…"
    year: 2026
---
```

Body: Markdown. `##` and `###` headings, paragraphs, lists, tables, `>` quotes from sources. Write citations as `[n]` after the claim, before the full stop: `one in five people [1].` Internal links are relative: `[doctor's appointment](/use-cases/doctor-appointments)`. No images, no HTML, no H1 (the title is the H1).

What the page shows above the body: title, description, byline, the Short answer box, the key facts. Below it: a Captio AI box, the FAQ and the sources. So the body must not repeat the FAQ or end with a sources list.

## 4. Templates by category

Length: 1,000–1,800 words of body. Comparisons and "best" lists can go to 2,200. Long only when every section earns its place.

**Comparisons** (`X vs Y`, `best … apps`)
1. Two or three sentences: who should pick which, straight away.
2. `## <X> vs <Y> at a glance`: a table, one row per thing people compare (platforms, languages, live captions in a room, translation, speaker labels, saved transcripts, offline, price as of month/year, free plan). Cells are facts, not adjectives. Cite in the cells.
3. One `##` per real difference, phrased as the question ("Which one works on iPhone?"), with the answer first.
4. `## Where <competitor> is the better choice`: honest, specific.
5. `## Which one should you use?`: by situation (a lecture, a dinner, a doctor, travelling abroad).
For "best" lists: a "How we compared them" paragraph (what was checked, the date), then one `###` per app with best-for, what it does, limits, price; Captio AI is not automatically first; order by fit for the article's question.

**Data** (`statistics`, `how many`)
1. The headline number with its source in the first sentence.
2. `## The numbers at a glance`: a table with measure, number, source.
3. Sections that break it down (by age, country, severity, over time), each opening with the number.
4. `## What the numbers mean in daily life`: where captions and other access fit.
Prefer the newest primary data (WHO, GBD/Lancet, national statistics offices, health agencies, national deaf associations). Say the year each number refers to. If sources disagree, show both and explain why (different definitions or years).

**Guides** (`how to …`)
1. One paragraph: the situation and the outcome the reader wants.
2. Steps or sections in the order the reader lives them (before, during, after). Numbered lists for steps.
3. Country-specific rights in their own section with official sources (US: ADA.gov, EEOC, JAN, HHS; UK: gov.uk, NHS England, EHRC; EU: eur-lex).
4. Where Captio AI helps, once, in the step where it fits.

**Explainers** (`what is …`)
1. The definition in the first two sentences, quotable on its own.
2. How it works, who uses it, examples, how it compares with related things (a small table often helps), common misconceptions.
3. Where to learn more (official bodies).

## 5. Research protocol

1. Read the topic entry in `topics.json` (query, angle, links) and search the query yourself. Open the top 5 results and note what they cover, what they miss, which numbers they use and how old those are. Your article must add something none of them has (see 6.3).
2. Find primary sources for every number. A blog or news article quoting a statistic is a lead, not a source: follow it to the report, paper or official page and cite that. Never cite Wikipedia, content farms, AI-written listicles, or a competitor's blog for facts about anything but itself.
3. For each fact, keep the exact supporting sentence from the source (you need it for the review). If a page can't be opened, find another source or drop the claim.
4. Competitors: open their official site, pricing page, help centre and store listing in this run. Note the date. If the information isn't public, say "not stated on their website" rather than guessing.
5. Prefer sources from the last five years; older is fine for definitions or the most recent available survey (say the year).

## 6. How to get cited by ChatGPT, Perplexity, Gemini, Claude and Google

Answer engines search, read a few pages, and quote the passages that answer the question most directly and most credibly. Write passages they can lift.

**6.1 Answer first.** The `answer` field and the first paragraph each answer the title on their own, with the key number or verdict, in 40–80 words. No "In this article we will". Someone who reads only that box should have the answer.

**6.2 Self-contained sections.** Each `##` heading is a question people ask (look at "People also ask", Reddit threads, the FAQ of the top results). The first sentence under it answers it completely, naming the subject ("Live Transcribe is only available on Android", not "It is only available on Android"). Assistants quote paragraphs out of context.

**6.3 Information gain.** Every article needs at least one thing that isn't on the pages already ranking: a table that puts scattered numbers side by side, a country breakdown nobody compiled, a fair comparison on criteria that matter to deaf people (speaker labels, in-room use, display settings), the current price and limits checked today, an honest "where it falls short". Write it down in the review notes as "information gain: …".

**6.4 Specific and dated.** Exact numbers with their year and source, named places and laws, "as of October 2026". Vague claims are not cited.

**6.5 Tables.** Comparisons and data need at least one table. Short cells, one fact each.

**6.6 Entities spelled out.** Full names on first mention: "the World Health Organization (WHO)", "Google Live Transcribe", "the Americans with Disabilities Act (ADA)". Describe Captio AI the same way every time: "Captio AI, a live captioning app for deaf and hard of hearing people".

**6.7 FAQ = the follow-up questions.** The questions someone asks next after the main answer. Each answer stands alone and repeats the subject.

**6.8 Fresh, honest dates.** `updated` changes only with real content changes. Year in the title only for data and "best" articles, and then it must be the current year.

**6.9 Fairness.** Assistants prefer balanced sources. An article that admits where Captio AI is not the best choice is more likely to be cited, and more likely to be cited when Captio AI is the right choice.

**6.10 Name the use case and the language in the sentence (Nejc, 2026-10-23).** The point of GEO is that for every question someone can ask, one sentence on the site answers it directly. The website does this: `/use-cases/meetings/german` answers "captions for German meetings" in its own sentences. Blog articles must do the same. The most important words in a sentence are the use case, the language or country, and the person ("a deaf student in a lecture", "a Spanish speaker at a doctor's appointment"), not "it" or "this".
- Before writing, list the questions a reader could ask about the topic crossed with the site's use cases (`plan.json` `blogUseCases`) and languages or countries (`src/lib/languages.ts`). For each one that the sources can support, write one sentence that answers it on its own, naming both. Example: "CART is used in lectures and conferences in the US, where ADA.gov lists real-time captioning among the auxiliary aids" is quotable; "It is used in many settings" is not.
- Give every use case the article touches its own `##` section or a table row (lectures, conferences, doctor's appointments, meetings, job interviews, restaurants, travelling, group settings, TV and media, everyday conversations), with the answer first and the use case in the first words. A "Which use cases and countries does this apply to?" table is often the best passage in the article.
- For data, rights and price topics, name the country in every sentence that has a number (US, UK, EU, Slovenia, Germany...) and add a row per country the sources cover. For tool comparisons, name the language: "Does Live Transcribe caption German?" gets a sentence naming German.
- Link each such sentence to the matching use case page or language page (`/use-cases/lectures`, `/use-cases/lectures/german`, `/german`).
- Never pad with facts the sources do not support. If a use case or language cannot be supported by an opened source, leave it out. Naming them is for precision, not for keyword stuffing.
- FAQs: at least half of the questions name a use case or a language or country ("Is CART available for doctor's appointments in the UK?").

## 7. SEO basics

- One main question per article (the `query` in `topics.json`). Don't write a second article for the same question; update the first one instead. Search `content/blog/posts` before starting.
- The title is the question in the reader's words. The description includes a concrete fact.
- Use the query and its natural variants in the title, the first paragraph and one or two headings. Never stuff it.
- 3 to 8 internal links: the topic's `links`, the matching feature page (`/live-captions`, `/live-translator`, `/audio-transcription`, `/ai-summary`), the matching use case (`/use-cases/<slug>`), a language page when a language comes up (`/german`, `/use-cases/lectures/german`), and earlier blog articles on related questions (`/blog/<slug>`). Link text says where it goes.
- Use cases on the site: everyday-conversations, meetings, restaurants, traveling, conferences, tv-media, deaf-hoh-communication, doctor-appointments, group-settings, job-interviews, lectures, phone-video-calls (don't link that one from blog articles: phone calls are not a Captio AI use case for the blog).

## 8. Captio AI in an article

- Mention it where it genuinely helps the reader, usually once or twice in the body, always tied to a concrete situation ("put your phone on the table during the appointment").
- Never open the article with Captio AI, except in comparisons that are about it.
- In comparisons, Captio AI is described exactly like a competitor: facts from `CAPTIO_FACTS.md`, limits included (internet needed for live captions, free plan 10 minutes a day, Android has no locked-screen captions).
- The page already shows a download box; don't add "download now" calls in the text.

## 9. Style

Follow the Copywriting Brief in the repo's `CLAUDE.md`: concrete before abstract, calm, "you", short words, varied sentence length, active voice. For the blog also:
- Sentence-case headings, as questions where it fits.
- Numbers as digits ("5 tips", "34 million"); spell out a number only at the start of a sentence.
- British or American spelling consistently within an article (prefer the spelling of the country the article is about; otherwise American).
- No filler: "it's important to note", "in today's world", "whether you're … or …", "let's dive in", "in conclusion", "navigating", "landscape", "journey".
- Lists use plain Markdown `-`; the site draws them as blue bars.

## 10. Topics

The plan is in `PLAN.md` and `plan.json`; the queue is `topics.json`. `scripts/blog-next-topic.mjs` picks each day's topic (priority topics first, then today's weekday slot). Mark a topic `published` (with `slug` and `published`) after it goes live, `blocked` (with `reason`) if it fails review three times, or `skipped` (with `reason`) if it duplicates an existing article.

Every topic has:
- `category`: the format (comparisons, data, guides, explainers).
- `pillar`: what it's about. `use-case` (one of the website's use cases in `plan.json` `blogUseCases`), `feature` (a row of the Feature map in `CAPTIO_FACTS.md`), `language` (a country or language from `src/lib/languages.ts`), or `basics` (hearing loss facts, rights, terms).
- `covers`: the feature ids, use-case slugs and language slugs it serves. `npm run blog:coverage` counts these.

When fewer than 14 topics are queued, run `npm run blog:coverage` and add 20 new topics at the end:
- gaps first (anything below its target in `plan.json`), then keep each weekday slot stocked for at least 3 more weeks;
- each topic is a question deaf or hard of hearing people (or the people around them) ask, found in search suggestions, "People also ask", Reddit (r/deaf, r/HardOfHearing, r/audiology), deaf organisations' FAQs, or the follow-up questions in our own FAQs;
- it can be answered with primary sources, leads naturally to a use case or feature page, and isn't already covered (check slugs and titles);
- it doesn't duplicate the website's landing pages: "live captions in German" is `/german`, "live captions for meetings" is `/use-cases/meetings`. Blog topics answer the questions around those pages (how to, rights, numbers, comparisons) and link into them.

New app features enter through the new-version check (DAILY.md step 1) as `priority` topics. Never queue a topic about a feature in "Not live yet".

## 11. Updating articles

If you notice during research that an older article has a number that changed, a price that changed or a broken source, fix it in the same run, bump its `updated` date, and say so in the run log. Never change a published fact without a new source.
