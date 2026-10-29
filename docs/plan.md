# Plan: portfolio harness

The living plan and task tracker for this repo. Update the **Status** table in the same PR that
completes or changes a step. Reasons for big decisions live in [ADRs](adr/).

## Goal

A resume portfolio for a hybrid **UX designer + UI/frontend developer** role that shows projects,
achievements and skills. The site _and the way it is built_ are the evidence:

- A real design system (tokens → consistent type and colour), documented in Storybook
- Mobile-responsive layouts and WCAG 2.0 AA compliance, **enforced** by automated checks
- React + TypeScript, deployed to GitHub Pages
- A visible engineering process: PRs, CI gates, Conventional Commits, ADRs
- Deliberate, documented use of AI in development

**Concept: "Career Wrapped".** Inspired by Spotify Wrapped (concept only, not its palette): bold
full-bleed sections in strong colour pairs, giant numbers and tight headlines, showing skills and
career path at a glance. The page is a scrolling story; nothing auto-advances.

## Status

| #   | Step                                                                                     | Status   | PR                                                    |
| --- | ---------------------------------------------------------------------------------------- | -------- | ----------------------------------------------------- |
| 1   | Scaffold: Vite + React + TS, oxlint, Prettier, Husky, commitlint, `CLAUDE.md`, ADR 0001  | Done     | [#1](https://github.com/yuxinhay/my-portfolio/pull/1) |
| 2   | CI + deploy to GitHub Pages; PR/issue templates; repo settings                           | Done     | [#2](https://github.com/yuxinhay/my-portfolio/pull/2) |
| 3   | Design tokens → Tailwind, scenes, contrast + token-usage gates, ADR 0002                 | Done     | [#3](https://github.com/yuxinhay/my-portfolio/pull/3) |
| 4   | Storybook: Foundations (scenes, colour, type, spacing, motion), a11y addon, `/storybook` | Done     |                                                       |
| 5   | UI primitives with stories, unit tests and axe tests                                     | **Next** |                                                       |
| 6   | Layout shell: header/nav, mobile menu, footer, skip link, routing + focus management     | To do    |                                                       |
| 7   | Content model + Wrapped sections: Intro, Top skills, Career path, Projects, Achievements | To do    |                                                       |
| 8   | Project case-study pages, `/design-system` and `/how-i-built-this` pages                 | To do    |                                                       |
| 9   | Playwright + axe e2e, Lighthouse CI budgets, release-please, README polish               | To do    |                                                       |

## Decisions so far

| Area          | Decision                                                                                                        | Record                                         |
| ------------- | --------------------------------------------------------------------------------------------------------------- | ---------------------------------------------- |
| Stack         | Vite + React 19 + TypeScript (strict, `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`), npm, Node ≥ 24 | [ADR 0001](adr/0001-vite-react-typescript.md)  |
| Linting       | **oxlint** instead of ESLint: Vite default, built-in `jsx-a11y` rules                                           | [ADR 0001](adr/0001-vite-react-typescript.md)  |
| Styling       | Tailwind CSS v4 generated from DTCG tokens via Style Dictionary; Tailwind defaults reset                        | [ADR 0002](adr/0002-tailwind-design-tokens.md) |
| Colour        | Theme D **"Bubblegum Bold"**: blush, hot pink, cobalt, ink. `pink.600` darkened to `#CC0F4C` to pass AA         | [ADR 0002](adr/0002-tailwind-design-tokens.md) |
| Typography    | **Inter only**, self-hosted; weight 900 + tight tracking for display                                            | [ADR 0002](adr/0002-tailwind-design-tokens.md) |
| Theming       | Wrapped-style **scenes** (`scene-blush/pink/cobalt/ink`) replace a light/dark toggle                            | [ADR 0002](adr/0002-tailwind-design-tokens.md) |
| Design source | Code only; **no Figma**. Theme and type chosen from prototypes on branch `prototype/wrapped-themes`             | [ADR 0002](adr/0002-tailwind-design-tokens.md) |
| Hosting       | GitHub Pages via Actions at `https://yuxinhay.github.io/my-portfolio/`; repo is **public**                      | This plan                                      |
| Git workflow  | `main` protected: PR + both CI checks required, linear history, **squash merge only**, branches auto-deleted    | This plan                                      |
| Storybook     | Storybook 10 (React + Vite); Foundations stories read `tokens/*.json`; built in CI, published at `/storybook/`  | [ADR 0003](adr/0003-storybook-foundations.md)  |
| Task tracking | **This file** is the tracker; GitHub Issues/Milestones not used for now                                         | This plan                                      |

## Repo layout (target)

```
my-portfolio/
├─ .github/            workflows (ci.yml, deploy.yml), PR + issue templates
├─ .claude/            settings.json (permissions, hooks), hooks/, skills/ (planned)
├─ CLAUDE.md           rules for AI assistants
├─ docs/               plan.md (this), adr/, ai-workflow.md, accessibility.md (planned)
├─ tokens/             DTCG JSON: color, scene, typography, layout        ← source of truth
├─ scripts/            build-tokens.ts, check-contrast.ts, contrast.ts, check-token-usage.ts
├─ prototypes/         only on branch prototype/wrapped-themes, never on main
├─ src/
│  ├─ styles/          tokens.css (generated), via index.css
│  ├─ components/ui/   primitives: Button, Link, Heading, Text, Card, Tag, SkipLink, VisuallyHidden
│  ├─ components/sections/  Wrapped sections: Intro, TopSkills, CareerPath, Projects, Achievements
│  ├─ stories/         Storybook Foundations (scenes, colour, type, layout, motion)
│  ├─ content/         typed data: projects.ts, achievements.ts, skills.ts, career.ts
│  ├─ pages/           Home, ProjectDetail (case study), DesignSystem, HowIBuiltThis
│  └─ app/             router, layout
├─ e2e/                Playwright specs incl. axe scans per route
└─ .storybook/         main.ts, preview.ts (loads index.css, a11y addon)
```

## Quality gates

| Gate                         | Where                     | Status |
| ---------------------------- | ------------------------- | ------ |
| oxlint + `jsx-a11y`          | pre-commit, CI, AI hook   | Live   |
| Prettier                     | pre-commit, CI            | Live   |
| Conventional Commits         | commit-msg hook, PR title | Live   |
| Typecheck + build            | CI                        | Live   |
| Tokens up to date            | CI                        | Live   |
| Scene contrast ≥ AA          | CI, AI hook               | Live   |
| Token-only styling           | CI, AI hook               | Live   |
| Storybook a11y addon         | Storybook; built in CI    | Live   |
| Unit tests + axe (Vitest)    | CI                        | Step 5 |
| Playwright + axe, 320px/200% | CI                        | Step 9 |
| Lighthouse CI (a11y = 100)   | CI                        | Step 9 |

## Accessibility (WCAG 2.0 AA) commitments

- Semantic landmarks, one `h1` per page, skip link, visible focus ring that follows the scene (≥ 3:1)
- Every scene's text and accent colours ≥ 4.5:1 against its background (checked in CI)
- `prefers-reduced-motion` respected; Wrapped reveals are motion-optional; nothing auto-advances
- Route changes move focus to the main heading and announce the page title
- Images need `alt`; no colour-only meaning (skill levels always have a text label)
- Reflow at 320px and 200% zoom without loss of content
- Manual keyboard-only and VoiceOver checks per PR (PR template), logged in `docs/accessibility.md`

## AI-assisted development

- `CLAUDE.md` sets the rules; `.claude/settings.json` pre-approves safe commands and denies
  force-pushes and pushes to `main`.
- Hooks: oxlint after every AI edit of TS/TSX; token build + checks after every token edit.
- Planned project skills: `new-component` (component + story + test + axe) and `a11y-audit`.
- AI-assisted commits carry a `Co-Authored-By` trailer; each PR has an "AI assistance" section.
- [`docs/ai-workflow.md`](ai-workflow.md) logs where AI helped and where I decided.

## Verification (definition of done for the whole project)

- `npm run lint`, `tokens:check`, `typecheck`, `build`, tests and e2e all pass locally and in CI
- Site live at `https://yuxinhay.github.io/my-portfolio/`, Storybook at `/my-portfolio/storybook/`
- Lighthouse a11y 100 on mobile; manual keyboard and VoiceOver passes logged
- Layout checked at 320 / 768 / 1280px and 200% zoom
