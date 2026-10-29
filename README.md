# my-portfolio

Portfolio site for a **UX designer + UI/frontend developer**. It shows projects, achievements and
skills, and the codebase itself demonstrates the process: a token-driven design system,
WCAG 2.0 AA accessibility, CI quality gates and an AI-assisted workflow.

[![CI](https://github.com/yuxinhay/my-portfolio/actions/workflows/ci.yml/badge.svg)](https://github.com/yuxinhay/my-portfolio/actions/workflows/ci.yml)
[![Deploy](https://github.com/yuxinhay/my-portfolio/actions/workflows/deploy.yml/badge.svg)](https://github.com/yuxinhay/my-portfolio/actions/workflows/deploy.yml)

Live site: https://yuxinhay.github.io/my-portfolio/ · Storybook: https://yuxinhay.github.io/my-portfolio/storybook/

## Stack

React 19 · TypeScript (strict) · Vite · React Router · Tailwind CSS v4 driven by design tokens (Style Dictionary) · Inter · Storybook with the a11y addon · Vitest + Testing Library + axe-core

## Getting started

```sh
npm install
npm run dev
```

| Script                    | What it does                                                   |
| ------------------------- | -------------------------------------------------------------- |
| `npm run dev`             | Start the dev server                                           |
| `npm run build`           | Typecheck and build to `dist/`                                 |
| `npm run preview`         | Preview the production build                                   |
| `npm run lint`            | oxlint, including `jsx-a11y` rules (warnings fail)             |
| `npm run typecheck`       | TypeScript project check                                       |
| `npm run format`          | Prettier                                                       |
| `npm run tokens:build`    | Generate `src/styles/tokens.css` from `tokens/*.json`          |
| `npm run tokens:check`    | WCAG AA contrast check of every scene + token-only usage check |
| `npm run test`            | Unit and axe tests (Vitest, Testing Library, axe-core)         |
| `npm run storybook`       | Storybook dev server (Foundations stories, a11y panel)         |
| `npm run build-storybook` | Build Storybook to `storybook-static/`                         |

## Workflow

- Work follows the steps in [docs/plan.md](docs/plan.md), which also tracks status.
- Branch per step (`feat/<step>-<slug>`), PR into `main`, squash merge.
- Conventional Commits, enforced by commitlint on `commit-msg`.
- lint-staged runs oxlint + Prettier on `pre-commit`.

## Docs

- [Plan and status](docs/plan.md)
- [Architecture decisions](docs/adr/), incl. [design tokens](docs/adr/0002-tailwind-design-tokens.md),
  [Storybook](docs/adr/0003-storybook-foundations.md), [testing](docs/adr/0004-vitest-testing-library-axe.md)
  [routing on GitHub Pages](docs/adr/0005-routing-and-github-pages-deep-links.md) and
  [case-study media](docs/adr/0006-case-study-media.md)
- [AI-assisted workflow](docs/ai-workflow.md)
- [AI rules (CLAUDE.md)](CLAUDE.md)
