# Blog plan

What the Captio AI blog writes about, in what order, and how new app features get in. The data behind it: `plan.json` (rhythm, targets), `topics.json` (the queue), the Feature map in `CAPTIO_FACTS.md`. Check where it stands with `npm run blog:coverage`.

## Four pillars, taken from the website

| Pillar | Source | What gets written | Target |
|---|---|---|---|
| Use cases | the website's use cases (`src/lib/useCases.ts`), without phone and video calls | for each: a how-to guide for the situation, a "best apps or options" comparison, and a rights or data article | 3+ articles per use case |
| Features | the Feature map in `CAPTIO_FACTS.md` (Live Captions, Live Translator, Audio Transcription, AI Summary, speaker labels, words and names, video transcription, locked-screen captions, export...) | for each: a how-to for the problem it solves; explainers and comparisons where people search the idea | 1+ how-to per feature |
| Languages and countries | the website's 60 languages (`src/lib/languages.ts`), 25 priority languages in `plan.json` | country numbers (hearing loss, sign language, rights), and language-specific problems (Swiss German, Arabic dialects, Hindi and English mixed, tonal languages) | 1+ article per priority language |
| Hearing loss basics | WHO data, laws, terms | the numbers and definitions every other article links to | ongoing |

The blog never repeats the website's landing pages ("live captions in German" is `/german`). It answers the questions around them and links into them.

## Four formats, one per day

| Day | Format | Pillar |
|---|---|---|
| Monday | comparison: Captio AI vs another tool, or tools side by side | any |
| Tuesday | guide: getting through a situation | use case |
| Wednesday | data: a country or language | language |
| Thursday | guide: doing something with a feature (new features go first) | feature |
| Friday | explainer: a term, a right, a technology | any |
| Saturday | comparison: best apps or options for one use case | use case |
| Sunday | data: hearing loss numbers, plus a refresh of one older article | basics |

## How a new feature reaches the blog

1. A feature ships in the app and is described in the app repo's `CLAUDE.md`.
2. When a new App Store version goes live, the daily run sees it (`scripts/blog-release-watch.mjs`), reads the release notes and the app repo, and updates the Feature map in `CAPTIO_FACTS.md`.
3. It queues 2 or 3 priority articles about the new feature (written first, one a day) and updates older articles the change affects (comparison tables, limits, prices).
4. The coverage report then counts the new feature like every other one.

Only features in a live store version are written about; merged but unreleased work stays in "Not live yet".
