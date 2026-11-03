# Captio AI on Instagram and Facebook

One carousel for every English page on captioai.app, covering every feature, use case and language, for deaf and hard of hearing people first, so that search engines and AI answers find Captio AI. This repo is public: nothing secret goes here.

## How a machine reads a post
Instagram and Facebook block GPTBot, ClaudeBot, PerplexityBot and every bot they don't list in robots.txt; Google and Bing are allowed. Posts reach AI answers through search indexes, as text only. So the description does the work, and the slides are for people:
- The slides carry one idea each. Every fact is in the description.
- The description opens with the question, as people type it.
- Every sentence stands alone when quoted: it names Captio AI or its subject, and the situation.
- Facts carry their source inside the sentence.

## A post
One file in `posts/`, for one page.

| Field | What it is |
|---|---|
| `id` | Same as the file name |
| `pageType` | `home`, `feature`, `use-case`, `language`, `use-case-language`, `blog`, `compare` or `organizations` |
| `page` | The page's path on captioai.app |
| `question` | The first slide and the first line of the description, 10 words at most |
| `slides` | 1 to 3 slides, 8 words at most; `*words*` show in blue |
| `description` | The caption, one sentence per paragraph |
| `hashtags` | 3 |

The renderer adds the end card, the alt text and the page link.

## Rules
- Never paste page text. Rewrite it under these rules: the pages mention calls and make promises like "word for word" that posts can't. The research sections are the most useful part of a page and differ most between pages; the FAQs repeat.
- Claims about the app come only from `content/blog/CAPTIO_FACTS.md`. Other facts come from a primary source, opened and read: a page's own numbers and citations are leads, not proof, and some don't match their sources. A separate reviewer checks every claim before a post goes out, the same way as the blog (`REVIEW.md` part A). A claim that can't be verified is dropped.
- Every description says Captio AI is made for deaf and hard of hearing people.
- Always "Captio AI". In-person speech only, never calls or online meetings. "100 free credits a day", never minutes. No trial. No provider names. No "best". No health advice. Captio AI is one tool among others and doesn't replace interpreters or captioners.
- A post about an iPhone-only feature says iPhone.
- Captions can be wrong: a health post says to confirm instructions with the doctor or pharmacist, a post about recording says to ask first (the check enforces it), and a post about alert sounds says they can be missed.
- Comparison posts say where the other app is the better choice, and their facts come from that app's own pages (`content/compare/apps`).
- Design: white, Google Sans (`assets/fonts`, Open Font License), one idea per slide, one blue highlight (`#1C49F5`), a small wordmark. No owl, numbers, labels or decoration.
- No two posts alike: under 10% of a post's five-word phrases may appear in any other post.

## Pages
`pages.json` lists every English page that gets a post (779 when it was made), in posting order, with the post that covers it. `npm run social:pages` refreshes it from the live sitemap and prints what's left; `-- --next 5` names the next pages to write. Left out: the phone and video calls use case (Captio AI is for in-person speech), translated pages (posts are English only), legal pages and hubs.

Order: home, features, use cases and Organizations, then the blog, the 60 language pages, the YouTube series' 10 languages across all use cases, the other 50 languages, and the comparisons last. Use case x language pages are interleaved so two posts in a row never share a use case or a language. A page that appears later, like a new blog article, goes to the front.

## Every day
1. 03:00 UTC, the cloud routine "Captio AI daily social posts" follows `DAILY.md`: writes the next posts from `pages.json` (keeping about 10 waiting), has a separate reviewer check them, and pushes the ones that pass to `main`.
2. Five times a day (06:15, 10:15, 14:15, 18:15 and 22:15 UTC, because GitHub starts scheduled runs late or skips them), the GitHub Action `social-publish` refreshes `pages.json` from the sitemap, records what earlier posts did (`sync`: published with links, or failed), then renders, checks and schedules today's posts in Zernio and commits `pages.json` and `scheduled.json`.

`pace.json` sets the slots (UTC): one post a day at 16:00, on Instagram and Facebook alike (Nejc 2026-11-03). If every run before the slot was late or missing, the first run after it schedules the day's post 15 minutes ahead, so no day is skipped. A failed post is reported by one run, not every run. `"paused": true` stops all scheduling; posts already scheduled stay in Zernio until deleted. Before scheduling, the Action asks Zernio for every caption it holds, so a post is never sent twice even if `scheduled.json` were lost. A failed post is never resent automatically, because Instagram often publishes one that reported a failure: the run fails, GitHub emails the owner, and a person decides. `LOG.md` has one line per writer run; `blocked.json` lists pages the writer gave up on after three review rounds.

## Publishing
Zernio publishes to Instagram and the Facebook Page. `scripts/social-zernio.mjs` uploads a rendered post's images with their alt text and sets its caption. It has no "publish now": a post is either a draft or scheduled at least 10 minutes ahead, and `scheduled.json` stops one being scheduled twice. Zernio's validator checks every post against each platform's rules before it is sent. The same post sent twice within 24 hours returns the first one. The key is `ZERNIO_API_KEY`, in `.env.local` on a Mac, which git ignores.

## Commands
```bash
npm run social:render
npm run social:check
npm run social:zernio -- accounts
npm run social:zernio -- validate
npm run social:zernio -- plan
npm run social:zernio -- next --dry
npm run social:zernio -- sync
npm run social:zernio -- draft spanish-live-captions
npm run social:zernio -- schedule spanish-live-captions 2026-11-05T09:00:00Z
npm run social:zernio -- status <zernio id>
npm run social:zernio -- delete <zernio id>
```

`npm run social:render` writes the images and `post.json` (caption, alt text per image) to `out/`, which git ignores, and `sheet.jpg`, every post's slides and description on one page. A slide whose text doesn't fit stops the run. `npm run social:check` applies the rules above; add `-- --online` to open each page.
