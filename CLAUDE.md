# CLAUDE.md

Rules for AI assistants working in this repo. Humans: see `docs/ai-workflow.md` for the why.

## Project

Personal portfolio for a hybrid **UX designer + UI/frontend developer** role. The codebase itself is
part of the portfolio: process, quality and accessibility matter as much as the visible site.

- Stack: React 19, TypeScript (strict), Vite, Tailwind CSS v4 driven by design tokens, Storybook.
- Hosted on GitHub Pages at `/my-portfolio/` (Vite `base`). Never hardcode root-relative URLs; use
  `import.meta.env.BASE_URL` or router links.
- Package manager: npm. Node >= 24.

## Commands

- `npm run dev` / `npm run build` / `npm run preview`
- `npm run lint` (oxlint, warnings fail) · `npm run typecheck` · `npm run format`
- `npm run tokens:build` (regenerate `src/styles/tokens.css`)
- `npm run tokens:check` (AA contrast of every scene, and token-only usage)

All of lint, tokens:check, typecheck and build must pass before a change is considered done.

## Design system

- Source of truth: `tokens/*.json` (DTCG). `src/styles/tokens.css` is generated; never edit it.
- Colour theme "Bubblegum Bold" (blush, hot pink, cobalt, ink). Typography: Inter only.
- Sections are **scenes**: wrap them in `scene-blush | scene-pink | scene-cobalt | scene-ink` and
  style children with role utilities: `bg-scene`, `text-scene-fg`, `text-scene-accent`,
  `bg-scene-shape` (decorative only), `bg-scene-surface` (panel fill), `outline-scene-focus`.
  Never use primitive colours (`text-pink-300`) directly in components.
- Type utilities: `text-stat | text-display | text-h1 | text-h2 | text-h3 | text-body | text-small |
text-eyebrow`, with `tracking-display | tracking-heading | tracking-eyebrow`, `font-black` for display.
- See `docs/adr/0002-tailwind-design-tokens.md` for the reasoning.

## Code rules

- **Styling uses design tokens only.** No hex values, px literals or Tailwind arbitrary values
  (`text-[#123]`, `mt-[13px]`) in components; `scripts/check-token-usage.ts` enforces this. Add a
  token instead.
- **Accessibility is a requirement (WCAG 2.0 AA)**, not polish:
  - Semantic HTML first; ARIA only when no native element fits.
  - Every interactive element is keyboard operable with a visible focus state.
  - Text contrast >= 4.5:1 (>= 3:1 for large text and UI boundaries).
  - Images require meaningful `alt` (or `alt=""` if decorative). No colour-only meaning.
  - Respect `prefers-reduced-motion`.
- Every new UI component ships with: a Storybook story, a unit test, and an axe assertion.
- Prefer small, typed, presentational components. Content lives in `src/content/` as typed data.
- No `any`. Use `import type` for type-only imports.

## Plan and progress

- `docs/plan.md` is the roadmap and task tracker. Read it at the start of a task to find the
  current step.
- Every PR that completes or changes a step updates the Status table (and the Decisions table if a
  decision changed) in the same PR.

## Git workflow

- Never commit to `main` directly. Branch `feat/<step>-<slug>`, `fix/…`, `docs/…`, `chore/…`.
- Conventional Commits (enforced by commitlint): `feat(ui): add Button component`.
- AI-assisted commits keep the `Co-Authored-By` trailer. PRs fill in the "AI assistance" section.
- Record significant technical decisions as an ADR in `docs/adr/`.
