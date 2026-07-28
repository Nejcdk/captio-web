# Captio — Project Instructions for Claude Code

---
## ✅ THE SITE IS NOW LIVE AND INDEXABLE (as of 2026-07-28)

**Indexing was intentionally turned ON on 2026-07-28. Do NOT revert it.**

`public/robots.txt` now **allows all crawlers** (`Allow: /` + a `Sitemap:` line), and the Next.js metadata `robots` is set to `index: true, follow: true`. This was a deliberate go-live decision by the user — the site is finished (720/720 use-case × language variants, dialect second pass, full technical AEO) and is intentionally being indexed and marinated for AEO citation while the iOS app finishes App Store review.

**Do NOT re-add `Disallow: /` and do NOT set `noindex`.** Earlier versions of this file said the opposite (keep it blocked) — that guidance is obsolete. If you find robots.txt blocking or a noindex meta, that is a regression to fix, not to preserve. See [[project_golive_decisions]].

---

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

**Indexing is now ON (since 2026-07-28).** The full site was built first (720/720 variants, dialect pass, technical AEO), then indexing was enabled. Keep quality high on any new pages before shipping them, but the "do not index" phase is over.

---

## Development notes

- Build: `npm run build`
- Dev: `npm run dev`
- All dynamic routes use `generateStaticParams` to pre-render at build time
- Tailwind v4: config is in `globals.css` via `@theme inline`, no `tailwind.config.js`
- Site is live and indexable as of 2026-07-28; Google Search Console verified and sitemap submitted. Analytics: Vercel Web Analytics (cookieless, no consent banner) — see [[project_golive_decisions]]

**Dev server setup — read this before touching the server:**
The `dev` script in `package.json` is set to `next dev --turbopack`. **Always start the dev server with `npm run dev` and nothing else.** Never run `next dev` directly, never run `npx next start` unless serving a production build. Once running, HMR works normally — no restarts needed when editing files. If you ever see 500 errors, kill all node processes (`pkill -9 -f "next"`) and run `npm run dev` again.

**Critical: never add `serverExternalPackages` to `next.config.ts`.** The project runs Node.js 23 which has a built-in global `WebSocket` — server-side API routes do not need the `ws` npm package and must not use it.

## Use-case × language variant content — ongoing task

### What this is
`src/lib/useCaseLanguageData.ts` holds per-variant content for `/use-cases/[slug]/[language]` pages. Each variant makes that page unique and indexable. Without a variant, the page falls back to generic use-case content and will not rank.

**Page render order** (template at `src/app/use-cases/[slug]/[language]/page.tsx`):
1. Hero
2. Features (`uc.featureHighlights`)
3. Performance (`LanguageMetrics` — accuracy + latency, drawn from `languages.ts`)
4. Inline CTA
5. Sub-use-cases (`variant.subUseCases` or `uc.subUseCases`)
6. Inline CTA + mockup images
7. Benefits / "Why Captio AI" (`uc.benefits`)
8. Why language is hard (`variant.whyHardSection`)
9. Inline CTA
10. Challenge (`variant.challenge`)
11. Inline CTA
12. Privacy
13. Inline CTA
14. Languages grid
15. Reviews (`variant.reviews`)
16. Inline CTA
17. FAQ (`variant.faqs` + `uc.faqs`)
18. Final CTA

**Status as of 2026-07-26 — ALL USE-CASE × LANGUAGE VARIANTS COMPLETE (720/720).**
All 12 use cases now have variants for all 60 languages. `getUseCaseLanguageVariant` returns a real variant for every use-case × language pair; nothing falls back to generic content.
- `everyday-conversations`: **all 60 complete.**
- `meetings`: **all 60 complete.** (Chinese is the reference example.)
- `restaurants`: **all 60 complete.**
- `traveling`: **all 60 complete.**
- `conferences`: **all 60 complete.**
- `tv-media`: **all 60 complete.** Challenge sections use a distinct media-access research pool (subtitle/caption provision, broadcast-accessibility policy, dubbing/voice-over of foreign content) rather than professional-exclusion.
- `deaf-hoh-communication`: **all 60 complete.**
- `doctor-appointments`: **all 60 complete.** (Challenge pool = healthcare access / interpreter provision / disability policy.)
- `group-settings`: **all 60 complete.** (Challenge pool = social exclusion / "Dinner Table Syndrome" / loneliness.)
- `job-interviews`: **all 60 complete.**
- `lectures`: **all 60 complete.**
- `phone-video-calls`: **all 60 complete.** (Challenge pool = telecom/relay access. whyHard reframes barriers for audio-only + narrowband phone compression — the visual channel is gone entirely.)

The use-case batch task below is **finished**. No further variants remain to write. Verify counts any time with:
`grep -oE 'useCaseSlug: "[a-z-]+"' src/lib/useCaseLanguageData.ts | sort | uniq -c` (expect 60 for each of the 12 use cases).

### The use-case batch task
Write variants for all 60 languages per use case, in batches of 10. **Wait for user approval between batches.** Chinese (everyday-conversations) is the reference example — read it in `useCaseLanguageData.ts` before writing anything.

**Language order (all 60, in sequence):**
English, Chinese, Hindi, Spanish, Arabic, Bengali, Portuguese, Russian, Urdu, Indonesian, German, Japanese, Swahili, Marathi, Telugu, Turkish, Vietnamese, Korean, French, Italian, Tamil, Persian, Punjabi, Gujarati, Thai, Polish, Ukrainian, Malay, Malayalam, Kannada, Tagalog, Azerbaijani, Dutch, Romanian, Kazakh, Czech, Hungarian, Greek, Swedish, Hebrew, Bulgarian, Serbian, Danish, Albanian, Afrikaans, Belarusian, Finnish, Slovak, Croatian, Norwegian, Catalan, Lithuanian, Bosnian, Galician, Macedonian, Slovenian, Latvian, Estonian, Welsh, Basque

**Batch order:**
1. English, Chinese, Hindi, Spanish, Arabic, Bengali, Portuguese, Russian, Urdu, Indonesian
2. German, Japanese, Swahili, Marathi, Telugu, Turkish, Vietnamese, Korean, French, Italian
3. Tamil, Persian, Punjabi, Gujarati, Thai, Polish, Ukrainian, Malay, Malayalam, Kannada
4. Tagalog, Azerbaijani, Dutch, Romanian, Kazakh, Czech, Hungarian, Greek, Swedish, Hebrew
5. Bulgarian, Serbian, Danish, Albanian, Afrikaans, Belarusian, Finnish, Slovak, Croatian, Norwegian
6. Catalan, Lithuanian, Bosnian, Galician, Macedonian, Slovenian, Latvian, Estonian, Welsh, Basque

### What each variant must contain
Every variant is a `UseCaseLanguageVariant` object. Fields and rules per section:

**Every field is specific to BOTH the use case AND the language.** Nothing carries over from a different use case. A German × doctor-appointments variant shares zero content with a German × everyday-conversations variant — different settings, different barriers, different challenge framing, different reviews, different FAQs, different hero title.

```typescript
{
  useCaseSlug: "[use-case-slug]",
  languageSlug: "xxx",
  heroTitle: "...",               // use-case + language specific — see below
  // heroDescription: omit — let the meta description fall back to default
  whyHardSection: { ... },        // see below
  subUseCases: SubUseCase[],      // 6 entries — see below
  challenge: { ... },             // see below — most important section
  reviews: Review[],              // 4 quotes — see below
  faqs: { q: string; a: string }[], // 8–10 questions — see below
}
```

### heroTitle rules
The hero title names the use case and the language together. It must follow the copywriting brief — outcome-led, concrete, no hype adjectives. It should answer the question a deaf or HoH person would actually search for this exact use case × language combination.
- Good: "Follow any German doctor's appointment, word for word." / "Never miss a word in a Hindi lecture."
- Bad: "Powerful transcription for German." / "AI captions for everyday conversations in Spanish."
The title changes completely between use cases — a doctor-appointments title sounds nothing like a lectures title.

### heroDescription — do not write, ever
`heroDescription` is optional and only used for the SEO meta description. The site is not yet submitted to Google Search Console and we do not want it crawled. Do not write `heroDescription` in any variant. Meta tags will be handled as a separate task when the site is ready to index.

### Feature cards — do not change
The `featureHighlights` array lives on the use case object in `useCases.ts`, not in the variant. It is use-case specific already. Do not modify it.

### existingSolutions rules (Compare section on use-case × language pages)
**Purpose:** show what deaf and hard of hearing people in the language's country currently have access to — and make Captio AI's advantage visible by contrast.

- **Exactly 4 cards per variant.** No more, no fewer.
- **No competitor company names.** Cards must name publicly available services, government-regulated infrastructure, or generic technology categories — never a competing app or brand. Good: "Relay UK", "Hearing loop", "BSL interpreter", "Built-in device captions". Bad: "Apple Live Captions", "Google Live Transcribe", "Otter.ai".
- **Real named services where they exist.** Use the actual name of the national relay service, the public interpreter scheme, or the government infrastructure — not vague generics like "phone relay".
- **Each card has:** `name`, `icon`, `description` (1–2 short sentences), `limitation` (1 sentence, specific), `captioAdvantage` (1 sentence, direct).
- **Limitation must be specific**, not vague. "Phone calls only" not "has limitations". "Requires hearing aid with telecoil" not "not accessible to everyone".
- **Do not name Captio AI inside the limitation.** The Captio AI advantage lives in `captioAdvantage` only.
- **Research required.** Search for the country's national relay service, interpreter provision, and public infrastructure before writing. English (UK) is the reference example in `useCaseLanguageData.ts`.

Typical card categories (pick 4 that fit the country and use case):
- National relay/phone service (most countries have one)
- Sign language interpreter provision (public funding scheme)
- Hearing loop / induction loop infrastructure
- Built-in device captions (generic OS-level auto-captions, no brand name)
- Real-time remote captioning service (if a publicly funded one exists)
- Emergency/public service accessibility schemes

### subUseCases rules
**Purpose:** capture a broad audience. These are recognisable everyday settings — not hyper-specific cultural moments that only readers who already know that culture will recognise.

6 entries, each with `icon`, `title`, `description`.
- **Titles:** plain English, broad, relatable to anyone. No local language terms, no foreign words, no specific place names.
  - Wrong: `"Pijaca (outdoor market)"`, `"Çayxana (teahouse)"`, `"Sagardotegi gathering"`, `"S-tog and metro"`
  - Right: `"Outdoor market"`, `"Traditional teahouse"`, `"Cider house gathering"`, `"Public transport"`
- **Descriptions:** can carry light cultural flavour, but the setting itself must be recognisable. "A busy outdoor market where vendors call out prices" — anyone understands this. "The čaršija where you haggle in Ijekavian" — only insiders do.
- **Use case relevance:** settings must fit the use case (e.g. for everyday-conversations: corner shop, family dinner, local pub, public transport, pharmacy, neighbourhood gathering). They don't all have to be language-specific — some will naturally apply to many languages.
- **Do not research for this section.** Draw on general knowledge of the use case + a light sense of the language's geography. The subUseCases are the least important section for AEO — they exist to orient the reader, not to earn citations.

### whyHardSection rules
**Purpose:** explain why THIS language is specifically hard to understand for a deaf or hard of hearing person. This is the most language-specific section on the page.

- **Primary driver: language specificity.** Cards are rooted in the language's actual phonology, prosody, dialectal diversity, script, register gap, or code-switching patterns. These are things unique to this language that a deaf/HoH person would actually notice.
- **Secondary tint: use case context.** Cards are not identical across all 12 use cases for the same language — the use case provides a light situational frame for the barrier. For everyday-conversations, the barrier manifests at a market stall or family table. For doctor-appointments, the same barrier manifests in a clinical consultation. The barrier itself doesn't change — where it's felt shifts.
- **5 cards maximum**
- **Research before writing** — use a separate search from the challenge section: `"[language] deaf lip reading"`, `"[language] dialects comprehension"`, `"[language] phonology hard of hearing"`, `"[language] speech fast casual"`. Focus on linguistic and phonological sources, not population statistics.
- Tags name the specific barrier concisely (e.g. "Tonal collapse", "Dialect gap", "Fast casual speech", "Consonant mutations") — not generic categories.
- Each card describes a real barrier felt in a real situation — not an abstract linguistic fact. Write from the deaf/HoH user's perspective.
- No citations needed here.
- **Never copy the Chinese cards verbatim.** Every language has its own barriers.

### "Why Captio AI" section — do not change
This section is generic and already correct. Leave it untouched.

### Performance — accuracy and latency
- **Position on page:** rendered immediately after the Features section (before the first inline CTA). This is a fixed part of the template — not a variant field.
- **Latency card:** identical for every language — do not change
- **Accuracy card:** the `wer` (word error rate) and `useCer` values come from `languages.ts` for each language. These are already set per language. Do not invent or change these values.

### challenge rules — most important section
**Purpose:** earn citations and build LLM trust. This section presents numbers and facts from an ethical/social angle — the human cost of exclusion at scale. It draws from a completely separate research pool from the whyHardSection.

**Structure:** exactly 3 paragraphs + a closing sentence mentioning Captio AI + citations array.

The 3 paragraphs have no fixed internal structure — content is driven by the research. Every challenge section should read differently from the others. Follow the data, not a template. The only constraints:
- Exactly 3 paragraphs
- Every number must have a real source
- No phonology or linguistics — that belongs in whyHardSection
- **Final sentence:** Captio AI + how it addresses this, referencing a specific everyday setting for this language
- **Citations:** always include real URLs. Min 3. Sources: government disability surveys, WHO, academic papers (PubMed, PMC, Frontiers in Public Health), NGO/disability org reports. Never cite Wikipedia. Prefer 2020–2025.

**Research process — mandatory, run separately from whyHardSection research:**
1. `"deaf [country] population" OR "hearing loss [country] prevalence statistics"`
2. `"[country] sign language recognition" OR "[country] hearing disability policy"`
3. `"deaf [country] social exclusion" OR "hard of hearing [country] daily barriers report"`
4. WHO Global Hearing Report data for the region, or GBD hearing loss study (PMC7960691)

These searches are about population, policy, and social exclusion — not about phonology or linguistics. The data found here must not duplicate what is in the whyHardSection. If the whyHardSection describes tonal collapse at the market stall, the challenge section cites how many people in that country are navigating daily life without hearing — not why the language is hard to lip-read.

Record real numbers and sources. Write from facts, not inference.

### Privacy section — do not change
Generic and correct for all pages.

### Languages section — adapt language only
The section structure is the same. The language referenced in copy adapts to the current language.

### reviews rules
4 reviews per variant. Must be specific to **both the use case AND the language**:
- A plausible local name from a country where this language is spoken
- Country flag emoji for that country
- A realistic email (name.x***@gmail.com format)
- A specific detail: city, hearing condition, context relevant to the use case
- A quote that names a real setting in that language's culture relevant to the use case AND a specific communication barrier — not generic praise

### faqs rules
8–10 questions. Must be specific to **both the language AND the use case**. Avoid any question that could appear unchanged on a different language page.
Good pattern (from Chinese, everyday-conversations): "Does Captio AI handle the tones in fast casual Mandarin speech?" / "Does it work for multigenerational conversations where different family members speak different varieties?"
Bad: "Does Captio AI work well?" / "Is it accurate?" / "What languages does it support?"

### Quality gate before submitting a batch
- **subUseCases:** Are the titles plain English that anyone would recognise? Could a reader who knows nothing about this language's culture still picture the setting? → if not, broaden the title and simplify the description.
- **whyHardSection:** Is each card rooted in a real linguistic/phonological/dialectal barrier specific to this language? Does it have a light use-case tint — enough that these cards would read differently on a doctor-appointments page for the same language? → if cards could appear unchanged on any language page, rewrite.
- **challenge:** Is the data different from what's in whyHardSection — population stats and policy gaps, not phonology? Does every cited URL actually exist and point to the right source? Does the section end with a Captio AI sentence? → fix any of these that are missing.
- Are the reviews from the right countries for this language, with plausible local names? → check.
- Do the FAQs answer what a deaf person in that country would actually search for this use case? → rewrite if generic.

---

---
## ✅ INDEXING IS ON (since 2026-07-28)

`public/robots.txt` allows all crawlers and references the sitemap. The site is intentionally live and indexable. Do not re-block it. (This section previously said indexing was blocked — that is no longer true.)

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

---

## Complete playbook: how to write a use-case × language page

This is the authoritative reference for writing `UseCaseLanguageVariant` objects in `src/lib/useCaseLanguageData.ts`. Follow this exactly. Every section has a different purpose, a different research source, and a different audience goal. Do not mix them.

---

### Step 0 — before writing anything

1. Read the existing Chinese (everyday-conversations) variant in `useCaseLanguageData.ts` — it is the reference example.
2. Note the use case you are writing for. The use case determines the situational context across every section.
3. Note the language and its primary countries. These determine the cultural grounding.
4. Run the three separate research passes described below — one per section. Do not reuse data across sections.

---

### Section 1 — `heroTitle`

**Purpose:** tell the reader immediately what this page answers.
**Rule:** outcome-led, concrete, specific to this use case + language combination. Reads like a statement a deaf or HoH person would search for.
- Good: `"Follow any German doctor's appointment, word for word."` / `"Never miss a word in a Hindi lecture."`
- Bad: `"AI captions for everyday conversations in Spanish."` / `"Powerful transcription for German."`
- The title must sound completely different from the same language's title on a different use case page.

**Do not write `heroDescription` — ever.** It will be handled separately when the site is ready to index.

---

### Section 2 — `subUseCases` (6 entries)

**Purpose:** orient the reader by showing recognisable settings where this use case applies. Capture the broadest possible audience.

**What it is NOT:** a list of hyper-specific cultural moments that only insiders recognise. It is NOT the place for deep language or country specificity.

**Research:** none needed. Draw on general knowledge of the use case + broad awareness of the language's geography.

**Rules:**
- 6 entries, each with `icon`, `title`, `description`
- **Titles** must be plain English that anyone would immediately understand — "Family dinner", "Corner shop", "Public transport", "Doctor's appointment". No foreign words, no local place names, no cultural terms in the title.
- **Descriptions** can carry one sentence of light cultural flavour — enough to feel grounded, not so specific that only people from that country relate.
- Settings must fit the use case. For everyday-conversations: corner shop, family meal, public transport, market, pharmacy, neighbourhood gathering. For doctor-appointments: GP visit, specialist appointment, pharmacy consultation, emergency room, telehealth call, post-appointment conversation.
- Some entries will naturally be similar across many languages — that is fine. The point is recognition, not uniqueness.

**Self-check:** Read each title. Would a person who knows nothing about this language or country immediately picture the setting? If yes, it's right. If no, simplify.

---

### Section 3 — `whyHardSection`

**Purpose:** explain why THIS SPECIFIC LANGUAGE is hard for a deaf or hard of hearing person to follow. This is the most language-specific section on the entire page.

**What it is NOT:** a generic list of communication barriers that could apply to any language. It is NOT primarily about the use case.

**Research pass (separate from challenge):**
Search specifically for linguistic and phonological sources:
- `"[language] lip reading difficulty"` or `"[language] deaf comprehension"`
- `"[language] dialects"` — to understand the dialect landscape a deaf person navigates
- `"[language] fast casual speech"` or `"[language] phonology"` — to find what drops, reduces, or merges in natural speech
- Any language-specific angle: tonal languages, consonant mutations, script complexity, code-switching, register gaps

**Rules:**
- **Primary driver: language specificity.** Every card must be rooted in something real about this language's phonology, prosody, dialects, script, speed, or code-switching. If the same card could appear on a different language's page unchanged, it is wrong.
- **Secondary tint: use case context.** The use case provides the situational frame for where the barrier is felt — not the substance of the barrier. The same linguistic barrier is described differently across use cases:
  - everyday-conversations: "...at the market stall or family table"
  - doctor-appointments: "...in a clinical consultation or at the pharmacy counter"
  - lectures: "...in a lecture hall or seminar"
  This tint is light. It is there so the cards are not copy-paste identical across all 12 use cases for the same language. The barrier itself does not change — the situation shifts.
- **5 cards maximum**
- Tags name the specific barrier concisely: "Tonal collapse", "Dialect gap", "Consonant mutations", "Fast casual speech", "Code-switching", "Script complexity". Not generic categories like "Phonology" or "Communication".
- Write from the deaf/HoH user's perspective. Describe what they experience, not what a linguist observes.
- No citations needed.

**Self-check:** Could any of these cards appear unchanged on a different language's page? → rewrite. Does each card describe something specific to this language that a deaf person would actually notice? → if not, research more.

---

### Section 4 — `challenge`

**Purpose:** earn citations and build LLM trust. Present the human cost of hearing loss at scale, with real numbers. This is the section that gets quoted.

**What it is NOT:** a repeat of the linguistic barriers from whyHardSection. The challenge section never discusses phonology, dialects, or lip-reading difficulty. It is about people, numbers, and the gap between policy and daily life.

**Research pass (completely separate from whyHardSection):**
Search for social, ethical, and demographic sources:
1. `"deaf [country] population" OR "hearing loss [country] prevalence statistics"`
2. `"[country] sign language recognition" OR "[country] hearing disability policy"`
3. `"deaf [country] social exclusion" OR "hard of hearing [country] disability report"`
4. WHO Global Hearing Report / GBD 2019 hearing loss study (PMC7960691) for regional anchoring

These searches are about population, policy, and exclusion — not about the language itself.

**Structure:** exactly 3 paragraphs + 1 closing sentence + citations array.

The 3 paragraphs have no fixed internal structure — their content is driven entirely by what the research finds. The goal is that every challenge section reads differently: different angles, different facts, different human situations. A challenge section that covers population → policy → trends is fine. So is one that covers a specific policy failure → a personal/social dimension → a demographic trend. So is one that opens with a striking statistic and spends all three paragraphs unpacking its implications. Follow the data, not a template.

The only hard constraints are:
- Exactly 3 paragraphs — no more, no fewer
- Every claim that involves a number must have a real source behind it
- The section must never duplicate content from `whyHardSection` — no phonology, no linguistics, no lip-reading difficulty
- **Closing sentence:** Captio AI + how it addresses this, referencing a specific setting from the language's daily life

**Citations:** always include real URLs. Minimum 3. Sources: government disability surveys, WHO, PubMed/PMC academic papers, NGO/disability organisation reports. Never cite Wikipedia. Prefer 2020–2025. Every URL must be real and findable — verify before including.

**Self-check:** Does this section contain any phonological or linguistic content? → move it to whyHardSection or delete it. Does every citation URL actually resolve? → check. Are the numbers real and sourced? → verify.

---

### Section 5 — `reviews` (4 entries)

**Purpose:** social proof that is specific enough to feel real.

**Rules:**
- 4 reviews
- Each review: plausible local name from a country where this language is spoken, correct country flag emoji, realistic email (`name.x***@gmail.com`), specific detail (city, hearing condition), quote
- The quote must name a real setting relevant to this use case in this language's culture AND describe a specific communication barrier that Captio AI resolved — not generic praise
- Reviews must differ from each other — different cities, different settings, different barriers

---

### Section 6 — `faqs` (8–10 entries)

**Purpose:** capture long-tail search queries. Answer what a deaf or HoH person in this language's country would actually search.

**Rules:**
- 8–10 questions
- Every question must be specific to both this language AND this use case — no question should be transferable unchanged to a different language's page
- Good pattern: "Does Captio AI handle the tones in fast casual Mandarin?" / "Does it handle Mallorcan Catalan?" / "Does it work for Welsh–English code-switching in a pub?"
- Bad: "Does Captio AI work well?" / "What languages are supported?" / "Is it accurate?"
- Questions should cover: dialect/accent handling, specific settings of the use case in this language's culture, code-switching if relevant, script/display questions if relevant

---

### The three research passes — summary

| Section | Research focus | Sources |
|---|---|---|
| `whyHardSection` | Language phonology, dialects, lip-reading difficulty | Linguistic sources, phonology papers, deaf community language resources |
| `challenge` | Population stats, disability policy, social exclusion | Government surveys, WHO, PMC/PubMed, NGO disability reports |
| `subUseCases` | None needed | General knowledge of the use case + the language's geography |

**These three research pools must not overlap.** If you find yourself using the same fact in whyHardSection and challenge, you are mixing sources. Separate them.

---

### Batch process

1. Choose a batch of 10 languages
2. For each language, run the whyHardSection research pass (linguistic sources)
3. For each language, run the challenge research pass (population/policy sources)
4. Write all 10 variants
5. Run the quality gate on every variant before submitting
6. Submit the batch and wait for user approval before starting the next batch

---
## ✅ FINAL NOTE: THE SITE IS LIVE AND INDEXED (since 2026-07-28)

`public/robots.txt` allows crawling and references `sitemap.xml`; pages are `index: true`. Google Search Console is verified and the sitemap has been submitted. Do not re-block indexing. When editing content, remember real users and crawlers now see the live site — no more "thin page" risk since content is complete, but keep quality high on any new pages before they ship.

---

## Final and only correct protocol to writing the use-case × language specific pages

This is the definitive reference for every use-case × language page. Follow this exactly. Every section has a different purpose, a different source of data, and different rules.

---

### Hero

- **Heading:** the h1 is **hardcoded** in the page template as `[Language] live captions and productivity tool for [use case]`. You do not write a custom hero heading. There is no `heroTitle` field rendered on screen — the field exists in the type and is stored, but the template never reads it.
- **Subheading:** identical on every page — "For deaf and hard of hearing people." Hardcoded. Do not change it.
- **`heroDescription` (optional):** if written, it replaces the fallback text inside the `SoftwareApplication` schema.org JSON-LD block (`<script type="application/ld+json">`). It does **not** go into the HTML `<meta name="description">` tag — that is hardcoded separately. LLM crawlers (GPTBot, PerplexityBot) parse structured data, so this field is AEO-relevant. Do not write it yet — it will be handled as a separate pass when the site is ready to index.

---

### Features

- The 4 feature cards are identical to the ones on the normal use case page.
- Do not modify them. They live on the use case object (`uc.featureHighlights`) and render the same for every language.
- No per-language or per-variant changes here.

---

### Use Cases

- The number of cards is the same as on the normal use case page (6 cards for every use case).
- The **heading of each card** (title + icon) stays exactly the same as on the normal use case page.
- The **description text** inside each card must be different for each language — rewritten with light country-specific flavour (real places, real cultural settings, real daily situations for that country).
- No web search needed. Use general knowledge of the country and the use case.
- Keep approximately the same length as the original descriptions on the use case page.
- These are stored as `useCaseDescriptions: string[]` on the variant — 6 strings in the same order as `uc.subUseCases`.
- **Do NOT write `subUseCases` on the variant.** The `subUseCases` field exists in the type but the page template never reads it from the variant — it always uses `uc.subUseCases` (from the use case object) for icons and titles. The Chinese reference example incorrectly has `subUseCases` on the variant; those objects are silently ignored. Only `useCaseDescriptions` is rendered.

---

### Performance

- **Latency card:** identical for every language on every page. Do not change it.
- **Accuracy card:** adjusted per language. The WER (word error rate) and `useCer` values come from `languages.ts` for each language. These are already set. Do not invent or change the numbers — just make sure the card references the correct language.

---

### Why Captio AI

- Generic section. Identical on every page.
- Lives on the use case object (`uc.benefits`). Do not modify it per language.

---

### Why [Language] is Hard

**Web search required.**

- This section explains why THIS specific language is hard for a deaf or hard of hearing person to follow.
- The focus is entirely on the **language** — its phonology, dialects, prosody, script, code-switching patterns, lip-reading difficulty.
- The use case provides a light situational tint (e.g. "in a meeting room" vs "at the market stall") but is not the primary driver. The same linguistic barriers exist across use cases — only the setting shifts slightly.
- Research specifically: `"[language] lip reading difficulty"`, `"[language] dialects comprehension"`, `"[language] fast casual speech"`, `"[language] phonology hard of hearing"`.
- 5 cards maximum. Each card has a short tag naming the specific barrier (e.g. "Tonal collapse", "Dialect gap", "Fast casual speech") and a description written from the deaf/HoH user's perspective.
- Never copy cards verbatim from another language. Every language has its own barriers.
- No citations needed here.
- **`whyHardSection.headline`** exists in the type and is stored but is **never rendered** — the page template hardcodes "Why [Language] is hard to understand". Write only `cards`; do not spend time on the headline.

---

### The Challenge

**Web search required.**

- This section is about the **human cost** — population numbers, policy gaps, social exclusion data.
- Focus: ethical point of view, feelings, and hard numbers. Not phonology. Not linguistics.
- Research separately from the Why Hard section: `"deaf [country] population statistics"`, `"[country] hearing loss prevalence"`, `"[country] sign language recognition policy"`, `"deaf [country] social exclusion report"`, WHO Global Hearing Report data.
- Structure: exactly 3 paragraphs + 1 closing sentence that mentions Captio AI in a specific everyday setting for this language.
- Every number must have a real source behind it.
- **Citations are mandatory** — real URLs at the bottom of the section. Minimum 3. Sources: government disability surveys, WHO, PubMed/PMC academic papers, NGO disability reports. Never Wikipedia. Prefer 2020–2025.
- Do not duplicate content from the Why Hard section. If Why Hard describes tonal collapse at the market stall, Challenge cites how many people in that country navigate daily life without hearing — not why the language is hard to lip-read.

---

### Privacy

- Generic. Identical on every page.
- Do not modify it per language or per use case.

---

### Languages

- Same section structure on every page.
- The language chips link to the same use case for each language (e.g. `/use-cases/meetings/[slug]`).
- Any copy referencing a language in this section adapts naturally to the current language but the structure does not change.

---

### Reviews

- 4 reviews per variant.
- Must be specific to **both the use case AND the language**.
- Each review: plausible local name from a country where this language is spoken, correct country flag emoji, realistic email (`name.x***@gmail.com`), specific detail (city, hearing condition).
- The quote must name a real setting relevant to this use case in this language's culture AND describe a specific communication barrier that Captio AI resolved. Not generic praise.
- Reviews must differ from each other — different cities, different settings, different barriers.

---

### FAQ

- 8–10 questions per variant.
- Mix of three types: some questions about the **app itself** (accuracy, noise handling, how to use it), some about the specific **use case** (meetings, doctor appointments, etc.), some about the specific **language** (dialect support, code-switching, script display).
- Every question must be specific enough that it could not appear unchanged on a different language's page.
- Good pattern: "Does Captio AI handle the tones in fast casual Mandarin during a meeting?" / "Does it work for Arabic-English code-switching in a GCC office?" / "Can it keep up with fast carioca Portuguese in a stand-up?"
- Bad: "Does it work well?" / "What languages are supported?" / "Is it accurate?"

---

### Field reference — what is actually rendered

Use this table before writing any variant. Fields marked "stored only" exist in the TypeScript type and are saved to the data file, but the page template never reads them.

| Field | Rendered? | Where |
|---|---|---|
| `heroTitle` | **Stored only** | Type exists, page template never reads it — h1 is hardcoded |
| `heroDescription` | Yes (schema.org) | Goes into `SoftwareApplication` JSON-LD, not `<meta>` tag |
| `useCaseDescriptions` | Yes | Description text inside each Use Cases card |
| `subUseCases` (on variant) | **Stored only** | Page always uses `uc.subUseCases` for icons/titles — do not write |
| `whyHardSection.cards` | Yes | Why Hard section |
| `whyHardSection.headline` | **Stored only** | Page hardcodes "Why [Language] is hard to understand" |
| `existingSolutions` | **Not implemented** | Defined in type, never rendered — do not write |
| `challenge.headline` | Yes | Challenge section heading |
| `challenge.paragraphs` | Yes | Challenge section body (first 3 only) |
| `challenge.citations` | Yes | Challenge section footnotes |
| `reviews` | Yes | Reviews carousel |
| `faqs` | Yes | FAQ accordion |

---

### Research discipline — critical

Three completely separate research pools. Never mix them.

| Section | What to research | Sources |
|---|---|---|
| Why Hard | Language phonology, dialects, lip-reading difficulty | Linguistic sources, phonology papers, deaf community language resources |
| Challenge | Population stats, disability policy, social exclusion | Government surveys, WHO, PMC/PubMed, NGO disability reports |
| Use Cases | None needed | General knowledge of the use case + the language's geography |


