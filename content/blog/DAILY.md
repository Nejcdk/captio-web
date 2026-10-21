# Daily run: one new article on captioai.app/blog

The scheduled job follows these steps exactly, once a day. It publishes at most one new article per run. If anything below fails and can't be fixed in the run, nothing is pushed except the log and the topic status.

Dates are Europe/Ljubljana dates (`TZ=Europe/Ljubljana date +%F`).

## 1. Start clean
```bash
git fetch origin
git checkout -B blog-daily origin/main
npm ci            # only if node_modules is missing or package-lock.json changed
```
Read `content/blog/PLAYBOOK.md`, `CAPTIO_FACTS.md`, `REVIEW.md`, the end of `LOG.md`, and `topics.json`. List `content/blog/posts/`.

## 2. Pick the topic
- The first entry in `topics.json` with `"status": "queued"`.
- If an existing article already answers the same question, mark the topic `skipped` with the slug that covers it, and take the next one.
- If fewer than 14 topics are queued, add 20 new ones first (PLAYBOOK section 10).

## 3. Research and write
Follow PLAYBOOK sections 3 to 9. Write `content/blog/posts/<slug>.md` with `published` and `updated` set to today. Keep your research notes (claims with source quotes) to fix review findings quickly, but don't give them to the reviewer.

If the research turns up an outdated number, price or broken source in an older article, fix it too (PLAYBOOK section 11).

## 4. Automatic checks
```bash
npm run blog:check -- <slug>     # fix every error; read every warning
npm run build
```

## 5. Independent review
Start a fresh subagent as the reviewer. Give it only: the article path, the topic entry, and the instruction to follow `content/blog/REVIEW.md` using `PLAYBOOK.md` and `CAPTIO_FACTS.md`. It writes `content/blog/reviews/<date>-<slug>.md`.
- `PASS`: continue.
- `FAIL`: make the required fixes, run step 4 again, then a new review round (the reviewer appends to the same report). At most 3 rounds.
- Still `FAIL` after 3 rounds: delete the article file, mark the topic `blocked` with the reviewer's main reason, keep the report, and go to step 7 without publishing. If there is time, start again at step 2 with the next topic (once per run).

## 6. Publish
1. In `topics.json` set the topic to `published` with `slug` and `published`.
2. Add a line to `LOG.md`.
3. Commit everything (the article, the review report, topics.json, LOG.md, any updated older articles) and push to main:
```bash
git add content/blog
git commit -m "Blog: <title>"
git push origin HEAD:main || (git pull --rebase origin main && npm run build && git push origin HEAD:main)
```
Vercel deploys main automatically.

## 7. Confirm it's live
1. Poll `https://captioai.app/blog/<slug>` every 30 s for up to 15 min until it returns 200 and contains the title.
2. If it never appears, check the deploy: `gh api repos/Nejcdk/captio-web/commits/$(git rev-parse HEAD)/status --jq .state`. If the deploy failed, `git revert --no-edit HEAD && git push origin HEAD:main`, note it in `LOG.md`, and stop.
3. On the live page: the `<h1>`, the JSON-LD and the FAQ answers are in the HTML.

## 8. Tell search engines
```bash
node scripts/indexnow.mjs \
  https://captioai.app/blog/<slug> \
  https://captioai.app/blog \
  https://captioai.app/blog/category/<category> \
  https://captioai.app/llms.txt
```
Add the URLs of any older articles you updated. Google picks the article up from the sitemap; no ping needed.

## 9. Log
`LOG.md` gets one row per run (published, blocked or skipped), newest at the bottom:
`| date | slug or topic id | category | result | review rounds | note |`
The note says the information gain in a few words, or why it didn't publish, and anything Nejc should know (a fact in CAPTIO_FACTS.md that looked outdated, a source that keeps blocking, a deploy problem). Commit and push the log even when nothing was published.

The run's final message is two lines: what was published (with the URL) or why not, and anything that needs Nejc.
