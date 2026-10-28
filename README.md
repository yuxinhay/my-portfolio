# my-portfolio

Portfolio site for a **UX designer + UI/frontend developer**. It shows projects, achievements and
skills, and the codebase itself demonstrates the process: a token-driven design system,
WCAG 2.0 AA accessibility, CI quality gates and an AI-assisted workflow.

[![CI](https://github.com/yuxinhay/my-portfolio/actions/workflows/ci.yml/badge.svg)](https://github.com/yuxinhay/my-portfolio/actions/workflows/ci.yml)
[![Deploy](https://github.com/yuxinhay/my-portfolio/actions/workflows/deploy.yml/badge.svg)](https://github.com/yuxinhay/my-portfolio/actions/workflows/deploy.yml)

Live site: https://yuxinhay.github.io/my-portfolio/

## Stack

React 19 · TypeScript (strict) · Vite · Tailwind CSS v4 + design tokens (planned) · Storybook (planned)

## Getting started

```sh
npm install
npm run dev
```

| Script              | What it does                                       |
| ------------------- | -------------------------------------------------- |
| `npm run dev`       | Start the dev server                               |
| `npm run build`     | Typecheck and build to `dist/`                     |
| `npm run preview`   | Preview the production build                       |
| `npm run lint`      | oxlint, including `jsx-a11y` rules (warnings fail) |
| `npm run typecheck` | TypeScript project check                           |
| `npm run format`    | Prettier                                           |

## Workflow

- Branch per issue (`feat/<issue>-<slug>`), PR into `main`, squash merge.
- Conventional Commits, enforced by commitlint on `commit-msg`.
- lint-staged runs oxlint + Prettier on `pre-commit`.

## Docs

- [Architecture decisions](docs/adr/)
- [AI-assisted workflow](docs/ai-workflow.md)
- [AI rules (CLAUDE.md)](CLAUDE.md)
