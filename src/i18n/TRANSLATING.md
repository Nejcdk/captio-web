# Translating the home page, the feature pages and /organizations

`messages/en.json` is the source for `/`, `/live-captions`, `/live-translator`,
`/audio-transcription` and `/ai-summary`. Each language in `locales.ts` has its
own `messages/<code>.json` with exactly the same keys and list lengths, served
at `/<code>` and `/<code>/<feature>`. Every other page on the site stays English.

After changing `en.json`, update every language file the same way, then run:

```bash
node scripts/i18n-check.mjs
```

It fails on a missing or extra key, a list of the wrong length, an empty text,
"Captio AI" dropped or shortened, a hero title without its two `[phrases]`, or a
middle dot. It warns about text still in English.

## How to write a translation

Write it the way a native copywriter in that country would have written the
page first, not word for word. The English voice: calm, plain, concrete, talking
to one person ("you"), no hype, no exclamation marks.

- **People.** The readers are deaf and hard of hearing people. Use the words that
  community uses for itself in that language ("gehörlose und schwerhörige
  Menschen", "personas sordas"); never outdated words like "deaf-mute"
  ("taubstumm", "sordomudo"). "HoH" is an English abbreviation: write it out or
  use the language's own short form if there is one.
- **Search words.** Titles and descriptions (`meta`) are what Google and AI
  chatbots show. Use the words people in that country type when they look for
  this: live captions / subtitles, speech to text, transcription app, translator.
  Keep titles under about 60 characters, descriptions under about 155.
- **Brand.** `Captio AI` exactly as written, never translated, transliterated,
  shortened to "Captio" or given an ending glued to it (use the language's normal
  workaround: "Captio AI:ta" in Finnish is fine, "Captio AIs" in German is not).
  `Plus`, `iPhone`, `iPad`, `iOS`, `Android`, `App Store`, `Google Play`, `Apple`,
  `Product Hunt` and file formats (MP3, MP4, M4A, WAV) stay as they are.
- **Feature names** (`common.featureNames`): Live Captions, Live Translator, Audio
  Transcription, AI Summary. Translate them into what people call these things in
  that language, the same way the app does where it has the term, and use the
  same words everywhere in the file (feature cards, FAQs, footer).
- **Address.** The same form the app uses in that language (informal where the
  language has a natural informal app register: du, tu, tú, ты…). Never mix.
- **Hero title** (`home.heroTitle`): two phrases are underlined, marked with
  `[square brackets]`: the equivalents of "live captions" and "productivity
  tool". Keep exactly two bracketed phrases.
- **Labels** shown in capitals on the page (`featuresLabel`, `faqLabel`, feature
  names on the cards) are uppercased by the page itself: write them normally.
- **Keep** every fact, number and example: 60+ languages, "57 other languages",
  iOS 16, the dialect examples (Australian English, Swiss German…), the emoji in
  `home.eyebrow` and the arrow at the end of `footer.productHunt`. Add nothing.
- **Punctuation.** The language's own quotation marks and punctuation. Never "·".
- Empty strings in English (`featuresSubtitle` on three feature pages) stay empty.

## /organizations and /o/<code>

`organizations/en.json` is the source for `/organizations` (and its pilot form)
and for `/o/<code>`, the page people join an organization's pilot through.
Same rules as above, plus:

- **Register.** Everything addressed to the organization (every section but
  `join`) uses the polite address customary in business letters to
  institutions (Sie, vous, usted…). `join` speaks to the person who will use
  the app: the app's own register.
- **Placeholders.** Keep every `{org}`, `{email}`, `{date}`… exactly; the
  checker fails on a missing or extra one. `form.errors.server`: `{code}`
  becomes " (ABC123)" with its own space, so it goes right after the word.
- **Hero title** (`hero.title`): exactly one `[phrase]`, the equivalent of
  "speak".
- **Any organization**: never "students" or "staff".
- Prices stay as written (£89, €99, $109); which one is shown big comes from
  the language (`orgCurrency` in `src/i18n/organizations.ts`).

The emails these organizations get are in the app repo
(`supabase/functions/_shared/org-email-locales/<code>.json`, checked by its
`check.mjs`); a copy change on the page usually needs the same change there.
