# Daily run: one new article on captioai.app/blog

The scheduled job (a Claude cloud routine, every morning) follows these steps exactly. It publishes one new article per run, even if someone else published an article earlier the same day. If something fails and can't be fixed in the run, nothing is published; the log, the topic status and the email still go out.

Dates are Europe/Ljubljana dates: `TZ=Europe/Ljubljana date +%F`.

**Network in the cloud sandbox:** the shell can reach npm and GitHub, but not other websites (Apple, captioai.app, sources). Use WebFetch and WebSearch for anything on the web. The site builds offline (the font is in the repo).

The routine checks out two repositories: **captio-web** (this one; the run writes here) and **captio** (the app; read only, never commit to it). Find each by its files: captio-web has `content/blog/DAILY.md`, captio has `app.json` and `src/lib/shared.ts`.

## 0. Start clean
```bash
git fetch origin
git checkout -B blog-daily origin/main
npm ci
```
Read `content/blog/PLAYBOOK.md`, `CAPTIO_FACTS.md`, `REVIEW.md`, `plan.json`, the last 10 rows of `LOG.md`, and list `content/blog/posts/`.

## 1. Anything new in the app?
```bash
node scripts/blog-release-watch.mjs
```
- `SAME`: go on.
- `UNKNOWN` (the shell can't reach Apple): read `https://itunes.apple.com/lookup?id=6796617180&country=us` with WebFetch and compare its `version` with `appStore.version` in `content/blog/state.json`. Same: go on. Different: handle it as NEW below, using the WebFetch result for the release notes, and finish with `node scripts/blog-release-watch.mjs --set <version> <release date>`.
- `NEW`: a new App Store version is live. Before writing:
  1. Read its release notes (printed), the app repo's `CLAUDE.md`, and the app's commits since the last handled version (`git log` in the captio checkout; the old version's commit is the one that set its `"version"` in `app.json`).
  2. Update `CAPTIO_FACTS.md`: the "Live version" line; new rows in the Feature map (id, plain description, platforms, the new version in "Since", use cases it helps, page to link); changed rows (limits, prices, platforms); move anything that is now live out of "Not live yet". Only what the release notes or the live store listing confirm is live. If the code has something the notes don't mention, leave it out.
  3. For each new feature, add 2 or 3 topics to `topics.json` with `"priority": true` (they are written first, one per day): a how-to guide for the situation it solves (pillar `feature`), an explainer if people search the idea behind it, and a comparison or "best apps" topic if it changes how Captio AI compares.
  4. Find published articles the change affects (a comparison table row, a limit, a price, "doesn't do X"). Fix them in this run, bump their `updated` date, and list them in the log.
  5. `node scripts/blog-release-watch.mjs --save` (or `--set <version> <date>` after a WebFetch check).

## 2. Pick the topic
```bash
node scripts/blog-next-topic.mjs
```
It returns a priority topic if there is one, otherwise the first queued topic that fits today's slot in `plan.json` (Monday comparison, Tuesday use-case guide, Wednesday country data, Thursday feature guide, Friday explainer, Saturday "best apps" for a use case, Sunday hearing loss data).
- If an existing article already answers the same question, mark the topic `skipped` with the slug that covers it and run the script again.
- If fewer than 14 topics are queued, run `npm run blog:coverage`, then add 20 topics (PLAYBOOK section 10), gaps first.

## 3. Research and write
Follow PLAYBOOK sections 3 to 9. Write `content/blog/posts/<slug>.md` with `published` and `updated` set to today. Keep your research notes (each claim with its source quote) so you can fix review findings quickly, but don't give them to the reviewer.

**Sundays:** also refresh one older article. Pick the one with the oldest `updated` date (at least 60 days old), recheck its numbers, prices and links, fix what changed and bump `updated`. It goes through step 4 and the review like a new article.

## 4. Automatic checks
```bash
npm run blog:check -- <slug>     # fix every error, read every warning
npm run build
```
In the cloud the check can't open external links (it says so in one warning); the reviewer then opens every source and link with WebFetch.

## 5. Independent review
Start a fresh subagent as the reviewer. Give it only: the article path, the topic entry, and the instruction to follow `content/blog/REVIEW.md` using `PLAYBOOK.md` and `CAPTIO_FACTS.md`. It writes `content/blog/reviews/<date>-<slug>.md`.
- `PASS`: continue.
- `FAIL`: make the required fixes, run step 4 again, then a new review round with the same reviewer (it appends to the report). At most 3 rounds.
- Still `FAIL` after 3 rounds: delete the article file, mark the topic `blocked` with the reviewer's main reason, keep the report, and go to step 7 without publishing. If there is time, start again at step 2 with the next topic (once per run).

## 6. Publish
1. In `topics.json` set the topic to `published` with `slug` and `published` (remove `priority`).
2. Add the row to `LOG.md` (step 9).
3. Commit everything and push to main; Vercel deploys main automatically:
```bash
git add content/blog
git commit -m "Blog: <title>"
git push origin HEAD:main || (git pull --rebase origin main && npm run build && git push origin HEAD:main)
```

## 7. Confirm it's live
1. Vercel needs 2 to 4 minutes. Then open `https://captioai.app/blog/<slug>` with WebFetch (the shell can't reach the site); try again every few minutes for up to 15 min until it shows the title.
2. If it never appears, the deploy failed: `git revert --no-edit HEAD && git push origin HEAD:main`, note it in `LOG.md`, and say so in the email.
3. On the live page: the `<h1>`, the JSON-LD and the FAQ answers are in the HTML.

## 8. Tell search engines
Nothing to do: the GitHub Action `.github/workflows/blog-indexnow.yml` runs on every push that adds or changes an article, waits until the page is live, and pings IndexNow (Bing, which feeds ChatGPT search, and others) for the article, its category, `/blog` and `/llms.txt`. Google picks articles up from the sitemap. If you're working outside the sandbox with normal internet, `node scripts/indexnow.mjs <urls>` does the same by hand.

## 9. Log
`LOG.md` gets one row per run (published, blocked, skipped or nothing new), newest at the bottom:
`| date | slug or topic id | category | result | review rounds | note |`
The note says the information gain in a few words, or why nothing was published, plus anything Nejc should know (a new app version handled, articles updated, a fact in CAPTIO_FACTS.md that looks outdated, a source that keeps blocking, a deploy problem). Commit and push the log even when nothing was published.

## 10. Email Nejc
Send one email with the Gmail connector to the address given in the routine's prompt (never write that address into this repo).
- Subject when published: `Captio AI blog: <title>`
- Subject otherwise: `Captio AI blog: no article today (<short reason>)`
- Body, plain text, short:
  - the link to the article (`https://captioai.app/blog/<slug>`) and the link to the blog (`https://captioai.app/blog`)
  - one sentence: what the article answers and its information gain
  - review rounds and the verdict
  - articles updated, a new app version handled, or anything that needs Nejc (or "Nothing needs you today.")
No "·" in the email. If the Gmail connector isn't available, say so in the log and in the run's final message.

The run's final message is two lines: what was published (with the URL) or why not, and anything that needs Nejc.
