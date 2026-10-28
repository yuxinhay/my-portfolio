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

All of lint, typecheck and build must pass before a change is considered done.

## Code rules

- **Styling uses design tokens only.** No hex values, px literals or Tailwind arbitrary values
  (`text-[#123]`, `mt-[13px]`) in components. Add a token instead.
- **Accessibility is a requirement (WCAG 2.0 AA)**, not polish:
  - Semantic HTML first; ARIA only when no native element fits.
  - Every interactive element is keyboard operable with a visible focus state.
  - Text contrast >= 4.5:1 (>= 3:1 for large text and UI boundaries).
  - Images require meaningful `alt` (or `alt=""` if decorative). No colour-only meaning.
  - Respect `prefers-reduced-motion`.
- Every new UI component ships with: a Storybook story, a unit test, and an axe assertion.
- Prefer small, typed, presentational components. Content lives in `src/content/` as typed data.
- No `any`. Use `import type` for type-only imports.

## Git workflow

- Never commit to `main` directly. Branch `feat/<issue>-<slug>`, `fix/…`, `docs/…`, `chore/…`.
- Conventional Commits (enforced by commitlint): `feat(ui): add Button component`.
- AI-assisted commits keep the `Co-Authored-By` trailer. PRs fill in the "AI assistance" section.
- Record significant technical decisions as an ADR in `docs/adr/`.
