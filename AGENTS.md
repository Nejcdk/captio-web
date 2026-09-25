# Captio — Agent Instructions

**`CLAUDE.md` is the authoritative project guide.** Read it before changing anything. This file is a short summary for other agents.

## Project
Marketing website for Captio AI, an iOS accessibility app for deaf and hard of hearing people (Live Captions, Live Translator, Audio Transcription, AI Summary; 60+ languages).
Stack: Next.js 16 (App Router) + Tailwind CSS v4. Hosted on Vercel at captioai.app; pushing to `main` deploys.

## Goal
SEO + AEO (Answer Engine Optimization): the site is the app's main acquisition channel, and every page is built to be cited by ChatGPT, Gemini, Perplexity, and Claude. The site is live and indexed — never re-block `robots.txt` or add `noindex`.

## Routes (all statically generated from data files)
- `/` homepage, `/[language]` (60), `/use-cases/[slug]` (12), `/use-cases/[slug]/[language]` (720)
- Feature pages: `/live-captions`, `/live-translator`, `/audio-transcription`, `/ai-summary`
- `/privacy`, `/terms`
- `/demo`, `/pricing`, `/support` no longer exist; they redirect (see `next.config.ts`).

## Key rules
1. **Accessibility first** — always lead with deaf and hard of hearing users. Never describe Captio as just a "transcription tool."
2. **FAQ sections are mandatory** and must be specific to the page's exact language × use case combination.
3. **Schema markup** — built in `src/lib/schema.ts`: SoftwareApplication on every page, FAQPage wherever there is a FAQ, BreadcrumbList on nested pages.
4. **No thin pages** — pages that don't answer follow-up questions won't get cited. Don't ship placeholder pages.
5. **Titles** — the root layout appends ` | Captio AI`; don't include the brand in page-level titles.
6. **Never name the speech-recognition provider** outside the Privacy Policy.

## Data sources
- Languages: `src/lib/languages.ts`
- Use cases: `src/lib/useCases.ts`
- Use case × language variants: `src/lib/useCaseLanguageData.ts`
- Features: `src/lib/features.ts`

## Brand
- Primary color: `#1C49F5`
- Font: Plus Jakarta Sans
- Trust claim: audio processed in real time, never stored, no data sold, no AI training
