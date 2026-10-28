# Pre-publish review

Nothing is pushed until this review says **PASS**. It answers three questions: is everything true, does everything work, and will this article genuinely help the site in search and in AI answers.

The review is done by a **separate reviewer** (in the daily job: a fresh subagent that did not write the article and has not seen the writer's notes). The reviewer's job is to find reasons not to publish. When in doubt, FAIL with a concrete fix. The reviewer may not edit the article; the writer fixes, then the reviewer checks again. At most 3 review rounds; still failing means the topic is marked `blocked` and nothing is published for it.

Inputs the reviewer gets: the article file path, the topic entry from `topics.json`, and these files: `PLAYBOOK.md`, `CAPTIO_FACTS.md`, this file. Nothing else from the writer.

## A. Is everything true?

1. **Claims inventory.** List every checkable claim in the article: every number, date, percentage, price, product feature, law or rule, name of an organisation's finding, and every statement about Captio AI. Include the `answer`, `keyFacts`, `faqs`, tables and the body.
2. **Check each claim against its source, now.** Open the cited source (WebFetch or a browser). Find the passage that supports the claim and copy the key words into the report. Verdicts:
   - `SUPPORTED`: the source says it (rounding is fine if it doesn't change the meaning; "nearly 2.5 billion" for 2.45 billion is fine).
   - `NOT FOUND`: the source doesn't say it. FAIL.
   - `CONTRADICTED`: the source says something else. FAIL.
   - `UNREACHABLE`: the page blocks automated access. Try the same document elsewhere (DOI landing page, PubMed, Europe PMC, the publisher's PDF, the Wayback Machine). If it can't be confirmed anywhere, FAIL for that claim.
   - `UNCITED`: a fact with no `[n]`. FAIL unless it's common knowledge that needs no source (e.g. "the iPhone is made by Apple").
3. **Captio AI claims** must match a line in `CAPTIO_FACTS.md`. Anything else is FAIL, however plausible.
4. **Competitor claims** must be confirmed on the competitor's own website, help centre or store listing in this review, not only in the writer's source. Prices need "as of <Month YYYY>" and a currency or country. Check that the article says where the competitor does better, and that nothing is unfair or mocking. Ask: would the competitor's lawyer find a false or misleading sentence?
5. **Sources themselves:** each is the primary or most authoritative source available (official body, peer-reviewed paper, national statistics office, the company itself for its own product). No Wikipedia, no content farms, no AI listicles. Years are correct. Titles and publishers in the `sources` list match the pages.
6. **No fabricated social proof** (reviews, quotes from "users", ratings, user counts, personas). FAIL on sight.
7. **No medical or legal advice**, only information with sources and a pointer to professionals.

## B. Does everything work?

1. `npm run blog:check -- <slug>` passes with no errors (it checks format, length, citations, banned words, internal and external links).
2. `npm run build` passes.
3. Serve the build (`npx next start -p 3199`) and fetch `/blog/<slug>`:
   - HTTP 200, the title is the `<h1>`, the Short answer, FAQ answers and sources are in the HTML.
   - The JSON-LD parses and contains `BlogPosting`, `FAQPage` and `BreadcrumbList`.
   - `/blog`, `/blog/rss.xml`, `/llms.txt` and `/sitemap.xml` list the new article.
   - `/blog/<slug>/opengraph-image` returns a PNG.
   - Every internal link in the article returns 200 on the local server.
4. If a browser is available: open the article at 375 px wide and 1280 px wide; no horizontal scroll, tables scroll inside their box, nothing overlaps.

5. **Images and alt text:** at least 1 image, aim for 3. Open each image file (Read it): it is a real image (product screenshot or a chart from cited data), it matches the topic, the alt text says what it actually shows, and demo data is captioned as sample content. FAIL on stock people photos, invented UI, or alt text that is empty, generic ("image of app") or wrong.
6. **Plagiarism check:** take 5 distinctive sentences from the body and search each in quotation marks (WebSearch). Any near-verbatim match on another page is a FAIL (quotes under 25 words with attribution and citation are fine). Record the 5 sentences and the result in the report.
7. **Search checklist (PLAYBOOK section 12):** answer-first, at least 4 cited sources and 4 external links, 3 to 10 internal links, tags appear in the text, meta tags in range, JSON-LD parses (BlogPosting, FAQPage, BreadcrumbList).

## C. Will it genuinely help (SEO and GEO)?

Search the topic's `query` (and one natural variant) now. Open the top 5 results and, where possible, ask an AI search engine the question. Then score the article 1–5 on each line, with one sentence of evidence each:

| Criterion | What a 5 looks like |
|---|---|
| Answers the question | The Short answer and first paragraph fully answer the title, with the key number or verdict, and would make sense quoted alone. |
| Information gain | It contains something none of the top 5 results has: a compiled table, newer numbers, a country breakdown, criteria that matter to deaf people, today's prices and limits, an honest weakness. Name it. |
| Trust | Primary sources, dated numbers, the competitor's own pages, fair to competitors, no hype. |
| Specificity | Concrete numbers, places, laws, situations. No paragraph that could be on any site. |
| Quotable structure | Question headings, each section opens with a complete answer naming its subject, at least one useful table where the template asks for it, FAQ covers the real follow-up questions. |
| Use cases and languages named | Every key sentence names the use case, country or language it answers for; each use case the article touches has its own section or table row; at least half of the FAQs name one (PLAYBOOK 6.10). |
| Fit with the site | One clear query, not already answered by another article (no cannibalisation), 3–8 relevant internal links, leads naturally to a Captio AI use case without forcing it. |
| Reader value | A deaf or hard of hearing reader, or their family, would be glad they found it and could act on it. |

**PASS needs:** every check in A and B passed (including images, plagiarism and the search checklist), no score below 3, Information gain at least 4, and an average of at least 4. Otherwise FAIL with the exact changes that would raise the scores.

Also say, in one line, whether publishing this article could hurt the site (thin, duplicate, misleading, off-brand). If yes, FAIL.

## Report

Save the review as `content/blog/reviews/<published date>-<slug>.md` (it is not published on the site):

```markdown
# Review: <title>
Verdict: PASS | FAIL (round n)
Date: <YYYY-MM-DD>

## A. Truth
| # | Claim | Source | Evidence (quote) | Verdict |
...
## B. Works
- blog:check: pass
- build: pass
- page checks: ...
## C. Value
| Criterion | Score | Evidence |
...
Information gain: <one line>
Risk to the site: <none | ...>
## Required fixes (if FAIL)
1. ...
```

The daily job publishes only when the latest round says `Verdict: PASS`.
