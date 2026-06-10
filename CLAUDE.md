# Captio — Project Instructions for Claude Code

## What this project is
Marketing website for **Captio**, an iOS live captioning app for deaf and hard of hearing people.
- Domain: captioai.app
- Goal: AEO (Answer Engine Optimization) — get cited by ChatGPT, Gemini, Perplexity, Claude
- Stack: Next.js 16 (App Router) + Tailwind CSS v4 + Vercel

## The app being marketed
Four features:
- **Live Captions** — real-time speech to text via microphone
- **Live Translator** — real-time translation
- **Audio Transcription** — upload audio/video files, get transcript
- **AI Summary** — structured summary from any transcript

Primary users: deaf and hard of hearing people. iOS only. 60+ languages.
Brand color: `#1C49F5`. Font: Plus Jakarta Sans (closest public substitute for Google Sans).

---

## Site structure

```
/                              → Homepage
/[language]                    → Language page, e.g. /german, /chinese (60 pages, static)
/pricing                       → Pricing page
/privacy                       → Privacy policy
/terms                         → Terms of service
/support                       → Support page
/live-captions                 → Feature page
/live-translator               → Feature page
/audio-transcription           → Feature page
/ai-summary                    → Feature page
/use-cases/[slug]              → Use case page (planned, not yet built)
/use-cases/[slug]/[language]   → Use case × language page (planned, not yet built)
```

**Next.js constraint:** All depth-2 dynamic segments must share the same param name. We use `[language]` for language routes and `[slug]` for use case routes.

---

## Data files

### `src/lib/languages.ts`
60 languages. Each entry has:
- `language` — display name (e.g. "German")
- `languageSlug` — URL slug (e.g. "german")
- `flag` — emoji flag
- `countries` — comma-separated string
- `speakerCount` — string (e.g. "135 million")
- `dialectNote` — one-line dialect summary, used in hero subtitle and feature bullets
- `languageFAQ` — single FAQ question string (legacy, kept for compatibility)
- `dialectCards?` — array of `{ name, description }` — renders as cards in the dialect section. **Add for all languages.** Without this, the page falls back to just showing `dialectNote` as a paragraph (thin content).
- `languageFAQs?` — array of `{ q, a }` — language-specific FAQs rendered before base FAQs. **Add for all languages.**

**All 60 languages now have `dialectCards` and `languageFAQs` — first pass complete.** We are now doing a second pass to fix dialect accuracy using web research. Do NOT write or rewrite dialect cards from memory — always web search first.

**Dialect card writing rules (second pass):**
- Use **WebSearch** before writing any language's dialect cards — search for "[language name] dialects" and "[language name] dialect groups" to get the real names and groupings
- Card names use the **local name + "dialect"** format: "Gorenjska dialect", "Kansai dialect", "Québécois dialect" — not translated English names like "Upper Carniola dialect group"
- 4–6 cards per language covering the major official dialect groups, not invented or memory-guessed varieties
- Slovenian is the corrected reference example — it was fixed after a native speaker caught errors in the first pass
- Work in batches of 10, web research first for all 10 before writing

### `src/lib/features.ts`
4 feature slugs: live-captions, live-translator, audio-transcription, ai-summary

---

## Page templates

### Language page (`/[language]`, e.g. `/chinese`)
Single template at `src/app/[language]/page.tsx`. Driven entirely by data from `languages.ts`.

Section order:
1. **Hero** — language name in brand-blue bg pill (`bg-brand text-white rounded-[10px]`), "live captions" and "productivity tool" underlined with brand color. Subtitle uses `lang.dialectNote`.
2. **Features** — 4 brand-blue cards. Titles and bullets reference the language. `lang.dialectNote` appears as one bullet per card.
3. **Use Cases** — 12 cards. Descriptions use `lang.language` naturally. Links go to `/use-cases/[slug]/[lang.languageSlug]` (404 until those pages are built).
4. **Languages grid** — all 60 languages as links. Current language highlighted in brand blue.
5. **Dialect & accent support** — renders `lang.dialectCards` as a 2-col grid of cards. Falls back to `lang.dialectNote` paragraph if no cards. **This is the unique AEO content per page.**
6. **Inline CTA** — App Store button
7. **Privacy** — same as homepage, two cards mention `lang.language` naturally
8. **Reviews** — `ReviewCarousel` component, same as homepage
9. **Inline CTA** — App Store button
10. **FAQ** — `lang.languageFAQs` first, then `baseFaqs`. Header is just "Frequently asked questions" — do NOT add language name here.
11. **CTA** — "Start captioning in [language]"
12. **Footer**

**Critical:** Don't add the language name where it makes the copy illogical. "Frequently asked questions about Chinese" sounds like a FAQ about the Chinese language, not about Captio AI. "Real Chinese moments" is nonsensical. Rule: the language name describes the speech/audio being processed, not the topic or subject matter.

### Homepage (`/`)
Same structure as language pages but without the dialect section or language-specific copy. Language chips in the grid are `<Link>` elements pointing to `/[slug]`.

---

## Critical content rules

**Language name placement:** Use `lang.language` where it naturally describes the speech or audio. Good: "Follow any Chinese conversation." Bad: "real Chinese moments", "Frequently asked questions about Chinese."

**Dialect section is the unique AEO content:** This is what differentiates each language page from a simple find-replace. Every language needs `dialectCards` with genuine information about regional varieties, scripts, and code-switching patterns. This is what gets cited by LLMs.

**FAQ sections are mandatory:** Every page needs one. FAQ answers long-tail AEO queries. Language pages: language-specific `languageFAQs` come first, base FAQs after. Each FAQ needs FAQPage schema.

**Positioning:** Always lead with deaf and hard of hearing users. This is an accessibility app first. Never describe it as just a "transcription tool."

**Schema markup:** Every page needs SoftwareApplication schema. FAQ pages need FAQPage schema.

**Privacy:** Captio AI processes audio in real time. Conversations are never stored on servers. No data sold. No AI training on user data. **Never mention the name of the speech recognition provider — this is a business secret.**

---

## AEO strategy (how this site wins in LLMs)

LLMs use RAG — they search, then summarize citations. To get cited:
1. **Answer all follow-up questions** on every page, not just the headline question
2. **FAQ sections are mandatory** — they capture the long-tail questions LLMs answer
3. **Depth over breadth** — a thin page won't get cited even if it ranks
4. **Information gain** — say something nobody else has said. The dialect cards (e.g. "Does Captio AI support Cantonese?") are on no other page anywhere on the internet.
5. **The programmatic route structure is the moat** — `/use-cases/meetings/german` will answer questions with no dedicated page anywhere else on the internet

Every page should answer: the main question, all sub-questions, dialect/accent specifics, accessibility use cases for that exact combination.

**Do not index until all pages have real content.** Submit to Google Search Console only once the full site is built. Thin or stub pages indexed early create a thin-content penalty that takes months to recover from.

---

## Development notes

- Build: `npm run build`
- Dev: `npm run dev`
- All dynamic routes use `generateStaticParams` to pre-render at build time
- Tailwind v4: config is in `globals.css` via `@theme inline`, no `tailwind.config.js`
- No indexing has been done yet — site is live on Vercel but not submitted to Google Search Console

**Dev server setup — read this before touching the server:**
Turbopack's persistent cache corrupts between sessions and causes 500 errors on every route. The `dev` script in `package.json` is set to `rm -rf .next && next dev --turbopack` — this wipes the cache on every start and fixes it. **Always start the dev server with `npm run dev` and nothing else.** Never run `next dev` directly, never run `npx next start` unless serving a production build. Once running, HMR works normally — no restarts needed when editing files. If you ever see 500 errors or "routes-manifest.json not found", just kill all node processes (`pkill -9 -f "next"`) and run `npm run dev` again.

## Use-case × language variant content — ongoing task

### What this is
`src/lib/useCaseLanguageData.ts` holds per-variant content for `/use-cases/[slug]/[language]` pages. Each variant makes that page unique and indexable. Without a variant, the page falls back to generic use-case content and will not rank.

**Status as of 2026-06-10:**
- `everyday-conversations` use case: **Chinese complete.** 59 languages remaining.
- All other use cases (meetings, doctor-appointments, lectures, etc.): not yet started.
- Do not start other use cases until everyday-conversations is complete for all 60 languages.

### The everyday-conversations batch task
Write variants for all 60 languages, in batches of 10. **Wait for user approval between batches.** Chinese is the reference example — read it in `useCaseLanguageData.ts` before writing anything.

**Batch order:**
1. ~~Chinese~~ ✓
2. English, Hindi, Spanish, Arabic, Bengali, Portuguese, Russian, Urdu, Indonesian, German
3. Japanese, Swahili, Marathi, Telugu, Turkish, Vietnamese, Korean, French, Italian, Tamil
4. Persian, Punjabi, Gujarati, Thai, Polish, Ukrainian, Malay, Malayalam, Kannada, Tagalog
5. Azerbaijani, Dutch, Romanian, Kazakh, Czech, Hungarian, Greek, Swedish, Hebrew, Bulgarian
6. Serbian, Danish, Albanian, Afrikaans, Belarusian, Finnish, Slovak, Croatian, Norwegian, Catalan
7. Lithuanian, Bosnian, Galician, Macedonian, Slovenian, Latvian, Estonian, Welsh, Basque (9 remaining)

### What each variant must contain
Every variant is a `UseCaseLanguageVariant` object with these fields:

```typescript
{
  useCaseSlug: "everyday-conversations",
  languageSlug: "xxx",
  heroDescription: string,        // 1–2 sentences, everyday conversations + this language
  whyHardSection: { ... },        // see below
  subUseCases: SubUseCase[],      // 6 entries, culturally specific to this language
  challenge: { ... },             // see below
  reviews: Review[],              // 4 realistic quotes
  faqs: FAQ[],                    // 8–10 questions
}
```

### whyHardSection rules
- **5 cards maximum**
- Each card answers: *"Why is THIS everyday conversation setting hard in THIS language?"* — not "Why is this language hard in general"
- Tags must name a specific everyday setting or barrier (e.g. "Counter interactions", "Family settings", "No formal support") — not generic linguistic categories
- The Chinese example cards are: Counter interactions, Family settings, Casual register, No formal support, Code-switching
- Cards for other languages should differ based on what makes that language + everyday life specifically hard. A tonal language (Thai, Vietnamese) will emphasise lip-reading impossibility. An RTL language (Arabic, Hebrew, Urdu) may emphasise script/direction. A postcolonial multilingual context (Swahili, Tagalog) will emphasise code-switching and colonial language dominance.
- **Never copy the Chinese cards verbatim.** Reframe for the language's actual context.

### challenge rules
- **Exactly 3 paragraphs**
- Focus on the HUMAN and SOCIETAL story — scale, exclusion from daily life, lack of infrastructure. NOT the linguistic mechanics (those belong in whyHardSection).
- Must include real statistics: deaf/HoH population size, infrastructure gaps, accessibility data
- Para 1: population scale + what exclusion looks like in this culture's daily life specifically
- Para 2: lack of systemic support for everyday (not institutional) settings
- Para 3: trend data — growing prevalence, widening gap
- **Always include `citations` array** with real URLs found via WebSearch. Min 3 citations per variant.
- Citation sources: government disability surveys, WHO data, academic papers (PubMed, PMC, Frontiers), NGO reports (ILO, UN). Never cite Wikipedia as a primary source.

### Research process (mandatory — do not skip)
For each batch of 10, **search the web before writing a single word**. Searches to run per language:
1. `"[language] deaf population" OR "hearing loss [country] statistics"`
2. `"deaf [nationality] everyday life barriers" OR "hard of hearing [country] accessibility"`
3. `"[language] sign language recognition" OR "[country] disability act hearing"`
4. Any language-specific challenge (e.g. `"tonal language lip reading"` for Thai/Vietnamese)

Record the real numbers and sources. Write from facts, not from inference.

### subUseCases rules
6 entries, each with `icon`, `title`, `description`. Must reflect real everyday settings in that language's primary countries — not generic settings copy-pasted from Chinese. Examples of what to vary:
- Arabic: souks, Friday prayers, family gatherings that are gender-separated, government ministries
- Hindi: chai stall conversations, auto-rickshaw directions, railway station announcements, joint family dinners
- Spanish: mercados, terrazas, family Sunday lunches, corner shops
- Russian: marshrutka conversations, dacha weekends, queuing culture, government offices

### reviews rules
4 reviews per variant. Each must have:
- A plausible local name for that country
- Country flag emoji
- A realistic email (name.x***@gmail.com format)
- A specific detail (city, condition, context)
- A quote that names a real everyday setting and a specific linguistic challenge — not generic praise

### faqs rules
8–10 questions. Must be specific to BOTH the language AND everyday conversations. Avoid questions that could appear on any other page unchanged. Good examples (Chinese):
- "Does Captio AI handle the tones in fast casual Mandarin speech?"
- "Does it work for multigenerational conversations where family members speak different varieties?"
- Bad: "Does Captio AI work well?" / "Is it accurate?"

### Quality gate before submitting a batch
Run the "feels fake" checklist from the Copywriting Brief on every variant. Specifically:
- Could the heroDescription work for any language? → rewrite
- Do the whyHardSection cards all just say "this language is hard"? → add the everyday context
- Does the challenge section cite real statistics or is it vague? → find real numbers
- Are the subUseCases generic (pharmacy, family dinner) or culturally specific (souk, terrace, dacha)? → make them specific
- Do the FAQs answer questions a real deaf person in that country would actually search for? → rewrite if not

---

## Git / deployment

Deploys via GitHub → Vercel auto-deploy on push to `main`.

**Known past issue — slow git push (fixed 2026-06-08):** A previous session added `http.postBuffer = 524288000` to `~/.gitconfig` (a 500MB HTTP buffer, intended to fix a "connection hung up" error). This made every push take 10+ minutes. It was removed. If pushes become slow again, check `~/.gitconfig` for a `postBuffer` entry under `[http]` and remove it.

---

## Copywriting Brief

Instructions for writing website copy. The goal is to apply underlying craft to Captio's product. Follow these as working rules. Where a rule says "avoid," treat it as a hard constraint, not a suggestion.

### 0. The one rule above all others

**Concrete before abstract. Always.**

Never make a claim without grounding it in something a reader can picture, count, or recognize from their own life — a real place, a real number, a real moment of friction. The fastest way copy starts to feel fake is stacking abstract praise ("powerful," "seamless," "intelligent," "next-generation") with nothing underneath it.

- Weak: *"Powerful transcription that works seamlessly everywhere."*
- Strong: *"Captions what the person behind the counter is saying, so you can run errands without bringing someone along to interpret."*

If a sentence could appear on any competitor's site unchanged, it's too abstract. Rewrite it until it could only be about Captio AI, in the user's actual day.

### 1. Voice and tone

- **Calm and declarative, never hyped.** State what the product does as plain fact. No exclamation marks. No "revolutionary," "amazing," "game-changing," "effortless."
- **Talk to one person.** Use "you" and "your" constantly. Write as if speaking to a single reader about their own situation.
- **Confident, not boastful.** Confidence comes from specificity, not from adjectives. "Native-speaker accuracy across 60+ languages" is confident *because* it's specific.
- **Empathetic without melodrama.** When naming a problem, name it precisely and move on to the fix. Don't dwell, don't pity, don't oversell the emotion.

### 2. Sentence-level techniques

Four named patterns to reach for. Mix them; don't let any one dominate.

**A. Scene-list, then payoff.** Open with a fragment of concrete nouns that sets a scene, then deliver the benefit in a full sentence.
> *"Pharmacies, post offices, grocery stores, government offices. Captio AI captions what the person behind the counter is saying in real time."*

**B. Feature → "so" → outcome.** Link what it does to what the reader gets, using "so" or "so you can."
> *"Labels each speaker separately so you always know who is talking."*

**C. Contrast by negation.** Define the win by what it *isn't*. The "X, not Y" shape is everywhere and it's powerful.
> *"You read what someone is saying while they are still saying it, not after they have finished."*
> *"Part of the conversation, not watching it happen around you."*

**D. Confident fragments.** Short, punchy non-sentences for emphasis and rhythm.
> *"No note-taking needed."* / *"No setup, no switching modes."*

**Rhythm rule:** vary length deliberately. A long explanatory sentence should be followed by a short one that lands the point. Bullets usually come in threes or fours and run parallel in grammar.

### 3. Vocabulary

**Use:**
- Plain, everyday words a 12-year-old knows.
- Strong capability verbs: *capture, follow, handle, navigate, contribute, understand, surface, isolate, keep up.*
- Physical and sensory language: *point your phone, word by word, across the room, on the go.*
- Functional adjectives only, when they carry information: *accurate, real-time, instant, searchable, low-latency.*

**Avoid:**
- Hype adjectives: *powerful, seamless, cutting-edge, innovative, robust, world-class, best-in-class.*
- Empty intensifiers: *truly, incredibly, simply, just amazing.*
- Jargon — unless it's a credibility moment (e.g. a benchmark metric), in which case define it in one line.

### 4. Page architecture

- **Headlines are outcomes, not descriptions.** Lead with what the reader gets, not what the product is.
  > *"Turn speech into understanding."* — not *"An AI transcription app."*
- **Use a tight, repeatable feature-block template:**
  1. A short benefit headline (3–6 words).
  2. One sentence of elaboration.
  3. Three or four parallel proof bullets.
- **Make Captio AI the active subject.** "Captio AI captions...", "Captio AI keeps up with it." It does things *for* the user — almost a character.
- **Capitalize feature names as proper nouns:** Live Captions, Live Translator, Audio Transcription, AI Summary.

### 5. Writing use cases

**Formula:** *For [specific person] who [specific desire], without [specific friction].*

Rules:
- Name a **concrete persona** (students, healthcare professionals, travelers), never "users" or "teams."
- Each use case is a **micro-story**: a real setting → the friction in it → the resolution.
- Lead with the setting in concrete nouns (*"Dinner tables, team meetings, social gatherings."*).
- End on the human payoff, not the feature.

### 6. Calls to action

- **Short and verb-first:** *Start Free, Download, Get started free, Explore [Feature].*
- **Always attach a risk-reducer near the CTA:** *"Free to start."* / *"Private by default."*
- Repeat the main CTA at the top and bottom of the page.

### 7. The "feels fake" checklist — run before finalizing

Reject any line that fails these:
- Could this sentence be about a competitor's product unchanged? → too generic, rewrite.
- Does it contain a hype adjective with no fact behind it? → cut the adjective or add the fact.
- Does a claim lack a concrete anchor (place, number, named moment)? → add one.
- Is the product the passive object instead of the active subject? → flip it.
- Is a use case described with an abstract segment ("businesses") instead of a real person doing a real task? → make it concrete.
- Three exclamation marks or more on the page? → delete them all.
