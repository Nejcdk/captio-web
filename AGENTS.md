# Captio — Agent Instructions

## Project
Marketing website for Captio, an iOS accessibility app for deaf and hard of hearing people.
Stack: Next.js 16 (App Router) + Tailwind CSS v4. Hosted on Vercel at captioai.app.

## Goal
AEO (Answer Engine Optimization) — every page is designed to be cited by ChatGPT, Gemini, Perplexity, and Claude.

## Key rules for any agent working on this project

1. **Accessibility first** — Captio is an accessibility app. Always lead with deaf and hard of hearing users. Never describe it as just a "transcription tool."

2. **Language density on language pages** — On any `/[feature]/[useCase]/[language]` page, the target language must appear naturally in every section: hero, how-it-works steps, capability cards, use-case descriptions, FAQ, and CTA. Aim for 15–20 mentions per page.

3. **FAQ sections are mandatory** — Every page must have a FAQ section with questions specific to that page's exact combination. These drive LLM citations.

4. **Schema markup** — SoftwareApplication schema on every page. FAQPage schema wherever there's a FAQ. HowTo schema on how-it-works sections.

5. **Honest compare pages** — Compare pages must include a "where [Competitor] wins" section. LLMs trust honest comparisons and are more likely to cite them.

6. **No thin pages** — Pages that don't answer follow-up questions won't get cited by LLMs. Depth matters.

## Data sources
- Languages: `src/lib/languages.ts`
- Use cases: `src/lib/useCases.ts`
- Features: `src/lib/features.ts`

## Brand
- Primary color: `#1C49F5`
- Font: Plus Jakarta Sans
- Trust claim: audio processed in real time via Soniox, never stored, no data sold, no AI training
