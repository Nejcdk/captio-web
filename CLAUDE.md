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
