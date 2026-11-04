# The daily social writer

The cloud routine "Captio AI daily social posts" follows this file every morning. It writes the next Instagram and Facebook posts, has each one checked by a separate reviewer, and pushes the ones that pass to `main`. It never publishes: the GitHub Action `.github/workflows/social-publish.yml` renders, checks and schedules one post a day in Zernio. To change what the writer does, change this file, not the routine.

**Network in the cloud sandbox:** the shell can reach npm and GitHub, but not other websites (captioai.app, sources). Open sources with WebFetch and WebSearch. `social-check` runs without `--online` here; the Action opens the pages later.

## 0. Before anything
- If this file is not on `main`, stop and say so: the setup isn't merged yet.
- Run `npm ci` once.
- Read in full: `content/social/README.md` (the rules), `content/blog/CAPTIO_FACTS.md` (the only source for claims about Captio AI), part A of `content/blog/REVIEW.md` (how claims are checked), and three posts in `content/social/posts/` as the model for tone and length.

## 1. How many to write
- Waiting posts = files in `content/social/posts/` whose id is not a key in `content/social/scheduled.json`.
- If 10 or more are waiting, write nothing: log "buffer full" and stop.
- Otherwise write up to 10 minus waiting, at most 6 in one run.
- `node scripts/social-pages.mjs --next 9` lists the next pages, in order. Take them from the top; skip one only if its source can't be read.

## 2. Where each page's content is
| Type | Source |
|---|---|
| home | `src/i18n/messages/en.json` (`home`) and `CAPTIO_FACTS.md` |
| feature (`/live-captions`, `/recognize-voices` …) | `src/app/<slug>/page.tsx`, `src/i18n/messages/en.json` (`featurePages`) |
| use-case | `src/lib/useCases.ts` |
| language (`/german` …) | `src/lib/languages.ts` |
| use-case-language (`/use-cases/<use case>/<language>`) | `src/lib/useCaseLanguageData.ts` (that entry's cards, challenge, citations, FAQs), plus `useCases.ts` and `languages.ts` |
| blog | `content/blog/posts/<slug>.md`, sources in its frontmatter |
| compare | `content/compare/pages/<slug>.md` and `content/compare/apps/*.json` (facts with sources and quotes) |
| organizations | `src/i18n/organizations/en.json` and the Organizations section of `CAPTIO_FACTS.md` |

## 3. Write each post
File `content/social/posts/<id>.json`, with the fields in the README. The id: `home` for `/`, `<use case>-<language>` for use case x language pages, otherwise the page's last path segment.

- **question:** what a deaf or hard of hearing person, or someone helping them, would type into Google or ask an AI about this page, at most 10 words. It is also the first slide, so it must be new: list every post's question first (`grep -h '"question"' content/social/posts/*.json`) and ask what THIS page answers that none of them does. `/live-captions` repeated the home post's "Is there a live captions app for deaf people?" on 3 Nov 2026, and Instagram showed the same post twice.
- **slides:** 2 slides, one idea each, at most 8 words, one `*highlight*`. Every slide must be true and fair when read alone in big type: "Your iPhone vibrates *while captions run.*", not "Your iPhone vibrates."
- **description:** 7 to 10 sentences, one per paragraph, 8 to 30 words each, every one standing alone when quoted (it names Captio AI or its subject and the situation, language or country; never opens with It, This, They, So, And, But or Then).
  - Sentence 1 or 2 answers the question directly.
  - One sentence says Captio AI is made for deaf and hard of hearing people, phrased fresh for this page, never copied from another post.
  - 2 or 3 facts from the page's own research, each with its source inside the sentence ("according to RNID", "a 2023 study in BMC Public Health").
  - What Captio AI does in this situation, only from `CAPTIO_FACTS.md`.
  - One honest limit: internet needed for live captions, captions can contain mistakes, iPhone only, doesn't replace an interpreter, alert sounds can be missed, whichever fits.
- **hashtags:** 3, letters and numbers only.

What the reviews of the first posts taught, so get these right the first time:
- A page's numbers and citations are leads, not proof. Open the primary source and match the population, year and scope exactly: the lectures page said "18% of deaf students graduate" when the source counts deaf adults; the German doctor page cited the wrong study for 11.1 million. If the source can't be found or opened, leave the fact out.
- Pages promise things posts can't: never "word for word", "every word", "never miss", "nothing misheard", accuracy percentages, "best" or "only".
- The calls use case has no posts, and no post mentions phone or video calls: Captio AI is for in-person speech.
- A health post says to confirm instructions with the doctor or pharmacist. A post that mentions saving or recording says to ask first ("With your doctor's OK", "Ask the lecturer before you record a lecture").
- iPhone-only features (Recognize voices, Recognize sounds, Speaker direction, captions with the screen locked, language flags, widgets, folders) say iPhone.
- Competitors: their facts from their own pages as recorded in `content/compare/apps`, careful wording ("lists no daily limit", not "has no daily limit"), and say where they are the better choice.
- Organizations: "any organization", never students, staff or a list of organization types. The pilot is a "free 30-day pilot", never a trial.
- Don't explain phonetics or grammar unless a source says it.

Then run `node scripts/social-check.mjs <ids>` and fix everything it reports.

## 4. Independent review
Start a fresh subagent that has not seen your notes, once for the whole batch, with this brief and the list of ids:

> You are an independent reviewer of Instagram and Facebook posts for Captio AI, a live captioning app for deaf and hard of hearing people. You did not write them. Find reasons not to publish; do not edit files. Read `content/social/README.md`, `content/blog/CAPTIO_FACTS.md` and part A of `content/blog/REVIEW.md`, then each post in `content/social/posts/<id>.json` and its source page's files. For every post: list each checkable claim; Captio AI claims must match a line in CAPTIO_FACTS.md (including iPhone only versus iPhone and Android); open the primary source of every other fact now and quote the supporting words (a page or article is a lead, not proof; match population, year and scope); read each slide alone in big type and fail it if it misleads; check the copy rules in the README. Report a table of id, PASS or FAIL, and for each FAIL the exact sentence or slide, what the source says, and the exact replacement wording. Under 600 words.

Apply the fixes, run `social-check` again, and send only the changed posts back to the same reviewer. At most 3 rounds. A post still failing after round 3: delete its file and add its page to `content/social/blocked.json` as `"<page>": "<one line why>"`.

## 5. Push
- Add only `content/social/posts/`, `content/social/blocked.json` and `content/social/LOG.md`. Never change other files: if a fact is missing from CAPTIO_FACTS.md or a page is wrong, leave the claim out and say so in the log.
- Commit as `Social: <n> posts (<ids>)`, then `git push origin HEAD:main || (git pull --rebase origin main && git push origin HEAD:main)`.
- Append one line to `LOG.md`: date, ids written, ids blocked and why, review rounds, anything Nejc should know.
- If nothing passed, still push the log line.

Never publish, schedule or call Zernio; never print or store a key.
