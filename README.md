# my-portfolio

Portfolio site for a **UX designer + UI/frontend developer**. It shows projects, case studies,
achievements and skills as a scrolling "Career Wrapped" story. The codebase itself demonstrates the
process: a token-driven design system, WCAG 2.0 AA accessibility enforced in CI, a visible
engineering process and an AI-assisted workflow.

[![CI](https://github.com/yuxinhay/my-portfolio/actions/workflows/ci.yml/badge.svg)](https://github.com/yuxinhay/my-portfolio/actions/workflows/ci.yml)
[![Deploy](https://github.com/yuxinhay/my-portfolio/actions/workflows/deploy.yml/badge.svg)](https://github.com/yuxinhay/my-portfolio/actions/workflows/deploy.yml)

- Live site: https://yuxinhay.github.io/my-portfolio/
- Storybook: https://yuxinhay.github.io/my-portfolio/storybook/
- How the site is built (on the site): https://yuxinhay.github.io/my-portfolio/how-i-built-this
- Design system (on the site): https://yuxinhay.github.io/my-portfolio/design-system

## Stack

React 19 · TypeScript (strict) · Vite · React Router · Tailwind CSS v4 driven by design tokens
(Style Dictionary) · Inter · Storybook with the a11y addon · Vitest + Testing Library + axe-core ·
Playwright + axe · Lighthouse CI · GitHub Actions and GitHub Pages

## Getting started

Requires Node 24 or later.

```sh
npm install
npm run dev
```

| Script                    | What it does                                                   |
| ------------------------- | -------------------------------------------------------------- |
| `npm run dev`             | Start the dev server                                           |
| `npm run build`           | Generate tokens, typecheck and build to `dist/`                |
| `npm run preview`         | Serve the production build under `/my-portfolio/`              |
| `npm run lint`            | oxlint, including `jsx-a11y` rules (warnings fail)             |
| `npm run typecheck`       | TypeScript project check                                       |
| `npm run format`          | Prettier (`format:check` in CI)                                |
| `npm run tokens:build`    | Generate `src/styles/tokens.css` from `tokens/*.json`          |
| `npm run tokens:check`    | WCAG AA contrast check of every scene + token-only usage check |
| `npm run test`            | Unit and axe tests (Vitest, Testing Library, axe-core)         |
| `npm run test:e2e`        | Build, then Playwright + axe end-to-end tests on every route   |
| `npm run lhci`            | Build, then Lighthouse CI with the mobile and desktop presets  |
| `npm run storybook`       | Storybook dev server (Foundations and component stories, a11y) |
| `npm run build-storybook` | Build Storybook to `storybook-static/`                         |

## Quality gates

Every pull request runs these checks; `main` is protected and only takes squash-merged PRs.

| Gate                              | What it checks                                                                                                                                                                                 | Where                         |
| --------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------- |
| oxlint + `jsx-a11y`               | Code and JSX accessibility rules, warnings fail                                                                                                                                                | pre-commit, CI, AI hook       |
| Prettier                          | Formatting                                                                                                                                                                                     | pre-commit, CI                |
| Conventional Commits              | Commit messages and PR titles                                                                                                                                                                  | commit-msg hook, CI           |
| Tokens                            | Generated CSS is up to date; every scene meets WCAG AA contrast; styling uses tokens only                                                                                                      | CI, AI hook                   |
| Typecheck, build, Storybook build | Strict TypeScript; the site and Storybook build                                                                                                                                                | CI                            |
| Unit tests + axe (Vitest)         | Components, stories, layout and content, with axe on every story                                                                                                                               | CI                            |
| E2E (Playwright + axe)            | Every route at 1280px, 320px and 200% zoom: 0 axe WCAG 2.0 A/AA violations, one h1, no overflow, no console errors or failed requests; keyboard, focus, deep-link and reduced-motion behaviour | CI ("E2E (Playwright + axe)") |
| Lighthouse CI                     | Five pages, mobile and desktop: accessibility 100, performance ≥ 90, best practices and SEO ≥ 95, page-weight budgets                                                                          | CI ("Lighthouse CI")          |

What is automated and what is checked by hand is listed in
[docs/accessibility.md](docs/accessibility.md).

## Running e2e and Lighthouse locally

```sh
npx playwright install chromium   # once, or after updating Playwright
npm run test:e2e                  # builds, starts vite preview on port 4317, runs every spec
npx playwright test --project=mobile-320   # one viewport; projects: desktop, mobile-320, zoom-200
E2E_WEBKIT=1 npx playwright test           # add WebKit (needs `npx playwright install webkit`)
```

Every spec starts as a returning visitor, so the "At a glance" intro does not cover the home page:
`e2e/fixtures.ts` marks it as seen in sessionStorage before the page loads. `e2e/glance.spec.ts`
opts out with `test.use({ glanceSeen: false })` to test a first visit.

Lighthouse CI needs Chrome. If it is not installed, point it at Playwright's Chromium:

```sh
CHROME_PATH="$(node -e "console.log(require('@playwright/test').chromium.executablePath())")" npm run lhci
```

Reports are written to `.lighthouseci/reports/{mobile,desktop}/`. In CI the Playwright report (on
failure) and the Lighthouse reports are uploaded as workflow artifacts. Thresholds and the scores
they were set from are in [ADR 0007](docs/adr/0007-e2e-lighthouse-and-releases.md).

## Project structure

```
.github/        CI, deploy and release-please workflows; PR and issue templates
.claude/        AI assistant settings and hooks
docs/           plan and status, ADRs, accessibility, AI workflow
tokens/         design tokens (DTCG JSON), the source of truth for colour, type and layout
scripts/        token build, contrast and token-usage checks
src/
  components/   ui primitives, layout shell, home sections, case-study blocks, motion, intro
  content/      typed content: site, projects, case studies, skills, career, achievements
  pages/        Home, ProjectDetail, DesignSystem, HowIBuiltThis, NotFound
  app/          routes, router, Layout (focus management)
  design-system/ token reader and contrast maths shared with Storybook
  stories/      Storybook Foundations
e2e/            Playwright + axe specs (playwright.config.ts)
lighthouserc.cjs  Lighthouse CI pages and budgets
```

## Workflow

- Work follows the steps in [docs/plan.md](docs/plan.md), which also tracks status.
- Branch per step (`feat/<step>-<slug>`), PR into `main`, squash merge.
- Conventional Commits, enforced by commitlint on `commit-msg` and on PR titles.
- lint-staged runs oxlint + Prettier on `pre-commit`.

## Releases

[release-please](https://github.com/googleapis/release-please) runs on every push to `main`. It
keeps a release PR open that bumps the version in `package.json` and updates `CHANGELOG.md` from
the Conventional Commits merged since the last release; merging that PR creates the tag and GitHub
release. Below 1.0.0 a `feat` bumps the minor version, so the first release is `0.1.0`.

The release PR must pass CI like any other PR. The owner enables this once, with either:

1. a fine-grained personal access token for this repository only (Contents and Pull requests: read
   and write), saved as the Actions secret `RELEASE_PLEASE_TOKEN` (recommended: CI then runs on the
   release PR), or
2. Settings → Actions → General → "Allow GitHub Actions to create and approve pull requests". PRs
   opened with the default token do not trigger CI, so the checks have to be started by hand.

Details in [ADR 0007](docs/adr/0007-e2e-lighthouse-and-releases.md).

## Docs

- [Plan and status](docs/plan.md)
- [Accessibility: commitments, automated and manual checks](docs/accessibility.md)
- [Architecture decisions](docs/adr/), incl. [design tokens](docs/adr/0002-tailwind-design-tokens.md),
  [Storybook](docs/adr/0003-storybook-foundations.md),
  [unit testing](docs/adr/0004-vitest-testing-library-axe.md),
  [routing on GitHub Pages](docs/adr/0005-routing-and-github-pages-deep-links.md),
  [case-study media](docs/adr/0006-case-study-media.md) and
  [e2e, Lighthouse and releases](docs/adr/0007-e2e-lighthouse-and-releases.md)
- [AI-assisted workflow](docs/ai-workflow.md)
- [AI rules (CLAUDE.md)](CLAUDE.md)
