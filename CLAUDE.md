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
/                                           → Homepage
/language                                   → All languages overview
/privacy                                    → Privacy policy
/terms                                      → Terms of service
/support                                    → Support page
/pricing                                    → Pricing page
/compare/[competitor]                       → Compare page (dynamic, server-rendered)
/live-captions                              → Feature page
/live-captions/[useCase]                    → Feature for use case (static)
/live-captions/[useCase]/[language]         → Feature for use case in language (static)
/live-translator/...                        → Same structure
/audio-transcription/...                    → Same structure
/ai-summary/...                             → Same structure
```

## Data files
- `src/lib/languages.ts` — 29 languages with slug, countries, speakerCount, dialectNote, languageFAQ
- `src/lib/useCases.ts` — 7 use case slugs: face-to-face, group-settings, meetings, lectures, doctor-appointments, traveling, tv-media
- `src/lib/features.ts` — 4 feature slugs: live-captions, live-translator, audio-transcription, ai-summary

## Page templates

### Feature targeted page (/live-captions/meetings and /live-captions/meetings/german)
- header
- hero — "Live Captions for [Use Case]" or "Live Captions for [Use Case] in [Language]"
- how it works — 3 steps, each mentioning [Language] naturally if language page
- capabilities — 5 static cards + 1 [Language]-specific card (language pages only)
- use-cases — on language pages links go to /[feature]/[other-use-case]/[language]
- languages — on language pages: highlight [Language] with countries + speakers + dialect note, rest of grid below
- testimonials
- faq — 3 static questions + 2-3 [Language]-specific questions (language pages only)
- cta — "Start captioning in [Language]" on language pages
- footer

### Compare page (/compare/otter-ai)
- header
- hero — "Captio vs [Competitor]"
- verdict / TL;DR — 2-3 sentences who wins and for whom
- comparison table — feature-by-feature grid
- where Captio wins — 3-4 points
- where [Competitor] wins — 2-3 honest points (required for LLM trust)
- who should choose which
- faq
- cta + download button
- footer

---

## Critical content rules

**Language pages:** [Language] must appear in every section's copy naturally — not just the headline. Every step description, every capability card, every use case description, the CTA. Aim for 15–20 mentions per page.

**FAQ sections:** Every page needs one. FAQ answers long-tail AEO queries. Questions must be specific to that page's combination (feature + use case + language). Each FAQ needs FAQPage schema.

**Compare pages:** Must include honest "where competitor wins" section. LLMs trust and cite honest comparisons.

**Positioning:** Always lead with deaf and hard of hearing users. This is an accessibility app first. Never describe it as just a "transcription tool."

**Schema markup:** Every page needs SoftwareApplication schema. FAQ pages need FAQPage schema. How-it-works sections need HowTo schema.

**Trust:** Captio processes audio in real time via Soniox. Conversations never stored on servers. No data sold. No AI training on user data.

---

## AEO strategy (how this site wins in LLMs)

LLMs use RAG — they search, then summarize citations. To get cited:
1. **Answer all follow-up questions** on every page, not just the headline question
2. **FAQ sections are mandatory** — they capture the long-tail questions LLMs answer
3. **Depth over breadth** — a thin page won't get cited even if it ranks
4. **The programmatic route structure is the moat** — /live-captions/meetings/german answers questions with no dedicated page anywhere else on the internet

Every page should answer: the main question, all sub-questions, dialect/accent specifics, accessibility use cases for that exact combination.

---

## Development notes

- Build: `npm run build` — generates 853 static pages
- Dev: `npm run dev`
- All dynamic routes use `generateStaticParams` to pre-render at build time
- `/compare/[competitor]` is the only server-rendered route (no static params yet)
- Tailwind v4: config is in `globals.css` via `@theme inline`, no `tailwind.config.js`
