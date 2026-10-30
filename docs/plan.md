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

| #   | Step                                                                                                                                                                              | Status | PR                                                      |
| --- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------ | ------------------------------------------------------- |
| 1   | Scaffold: Vite + React + TS, oxlint, Prettier, Husky, commitlint, `CLAUDE.md`, ADR 0001                                                                                           | Done   | [#1](https://github.com/yuxinhay/my-portfolio/pull/1)   |
| 2   | CI + deploy to GitHub Pages; PR/issue templates; repo settings                                                                                                                    | Done   | [#2](https://github.com/yuxinhay/my-portfolio/pull/2)   |
| 3   | Design tokens → Tailwind, scenes, contrast + token-usage gates, ADR 0002                                                                                                          | Done   | [#3](https://github.com/yuxinhay/my-portfolio/pull/3)   |
| 4   | Storybook: Foundations (scenes, colour, type, spacing, motion), a11y addon, `/storybook`                                                                                          | Done   | [#5](https://github.com/yuxinhay/my-portfolio/pull/5)   |
| 5   | UI primitives with stories, unit tests and axe tests                                                                                                                              | Done   | [#6](https://github.com/yuxinhay/my-portfolio/pull/6)   |
| 6   | Layout shell: header/nav, mobile menu, footer, skip link, routing + focus management                                                                                              | Done   | [#7](https://github.com/yuxinhay/my-portfolio/pull/7)   |
| 7   | Content model + Wrapped sections: Intro, Top skills, Career path, Projects, Achievements                                                                                          | Done   | [#9](https://github.com/yuxinhay/my-portfolio/pull/9)   |
| 8   | Project case-study pages, `/design-system` and `/how-i-built-this` pages                                                                                                          | Done   | [#10](https://github.com/yuxinhay/my-portfolio/pull/10) |
| 9   | Playwright + axe e2e, Lighthouse CI budgets, release-please, README polish                                                                                                        | Done   | [#11](https://github.com/yuxinhay/my-portfolio/pull/11) |
| 10  | Motion and visual polish: scroll reveals, count-up numbers, hover/press states, page transitions, motion tokens (all prefers-reduced-motion safe; owner reviews prototypes first) | Done   | [#12](https://github.com/yuxinhay/my-portfolio/pull/12) |

## Decisions so far

| Area          | Decision                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               | Record                                                      |
| ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------- |
| Stack         | Vite + React 19 + TypeScript (strict, `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`), npm, Node ≥ 24                                                                                                                                                                                                                                                                                                                                                                                        | [ADR 0001](adr/0001-vite-react-typescript.md)               |
| Linting       | **oxlint** instead of ESLint: Vite default, built-in `jsx-a11y` rules                                                                                                                                                                                                                                                                                                                                                                                                                                  | [ADR 0001](adr/0001-vite-react-typescript.md)               |
| Styling       | Tailwind CSS v4 generated from DTCG tokens via Style Dictionary; Tailwind defaults reset                                                                                                                                                                                                                                                                                                                                                                                                               | [ADR 0002](adr/0002-tailwind-design-tokens.md)              |
| Colour        | Theme D **"Bubblegum Bold"**: blush, hot pink, cobalt, ink. `pink.600` darkened to `#CC0F4C` to pass AA                                                                                                                                                                                                                                                                                                                                                                                                | [ADR 0002](adr/0002-tailwind-design-tokens.md)              |
| Colour        | Ink scene text is **blush**, not `pink.300` (owner's choice, step 8 review); `pink.300` stays the ink focus ring                                                                                                                                                                                                                                                                                                                                                                                       | This plan                                                   |
| Colour        | Scenes gain a **`surface`** role for borderless panels (white on blush); CI checks every text role on it (step 8 review)                                                                                                                                                                                                                                                                                                                                                                               | [ADR 0002](adr/0002-tailwind-design-tokens.md)              |
| Typography    | **Inter only**, self-hosted; weight 900 + tight tracking for display                                                                                                                                                                                                                                                                                                                                                                                                                                   | [ADR 0002](adr/0002-tailwind-design-tokens.md)              |
| Theming       | Wrapped-style **scenes** (`scene-blush/pink/cobalt/ink`) replace a light/dark toggle                                                                                                                                                                                                                                                                                                                                                                                                                   | [ADR 0002](adr/0002-tailwind-design-tokens.md)              |
| Design source | Code only; **no Figma**. Theme and type chosen from prototypes on branch `prototype/wrapped-themes`                                                                                                                                                                                                                                                                                                                                                                                                    | [ADR 0002](adr/0002-tailwind-design-tokens.md)              |
| Hosting       | GitHub Pages via Actions at `https://yuxinhay.github.io/my-portfolio/`; repo is **public**                                                                                                                                                                                                                                                                                                                                                                                                             | This plan                                                   |
| Git workflow  | `main` protected: PR + both CI checks required, linear history, **squash merge only**, branches auto-deleted                                                                                                                                                                                                                                                                                                                                                                                           | This plan                                                   |
| Storybook     | Storybook 10 (React + Vite); Foundations stories read `tokens/*.json`; built in CI, published at `/storybook/`                                                                                                                                                                                                                                                                                                                                                                                         | [ADR 0003](adr/0003-storybook-foundations.md)               |
| Testing       | Vitest + Testing Library + axe-core in jsdom; every story is axe-tested; contrast stays a token gate                                                                                                                                                                                                                                                                                                                                                                                                   | [ADR 0004](adr/0004-vitest-testing-library-axe.md)          |
| Typography    | Shared text recipes in `src/components/ui/styles.ts`; small text is `font-medium` (reviewed in a prototype)                                                                                                                                                                                                                                                                                                                                                                                            | This plan                                                   |
| Routing       | React Router 8 (data mode), real paths with `basename` from Vite `BASE_URL`; routes shared by app, tests, stories                                                                                                                                                                                                                                                                                                                                                                                      | [ADR 0005](adr/0005-routing-and-github-pages-deep-links.md) |
| Deep links    | `404.html` is a build-time copy of `index.html`, so GitHub Pages boots the app on any path (no hash routing)                                                                                                                                                                                                                                                                                                                                                                                           | [ADR 0005](adr/0005-routing-and-github-pages-deep-links.md) |
| Route a11y    | Focus moves to the page h1 (or a focusable `#hash` target) after navigation, not on first load; no live region                                                                                                                                                                                                                                                                                                                                                                                         | [ADR 0005](adr/0005-routing-and-github-pages-deep-links.md) |
| Task tracking | **This file** is the tracker; GitHub Issues/Milestones not used for now                                                                                                                                                                                                                                                                                                                                                                                                                                | This plan                                                   |
| Content       | Typed, readonly data in `src/content/`; rules types cannot express (order, unique slugs, banned terms) are tests                                                                                                                                                                                                                                                                                                                                                                                       | This plan                                                   |
| Skills        | Skills are listed in groups **without proficiency levels** (owner's choice)                                                                                                                                                                                                                                                                                                                                                                                                                            | This plan                                                   |
| Case studies  | Typed case-study content in `src/content/caseStudies.ts`, one per project; full-bleed scenes with an h2 per section                                                                                                                                                                                                                                                                                                                                                                                    | This plan                                                   |
| Media         | Images as **WebP** (max 1600px), videos as **H.264 MP4** without audio, all metadata stripped; imported through Vite                                                                                                                                                                                                                                                                                                                                                                                   | [ADR 0006](adr/0006-case-study-media.md)                    |
| Media a11y    | Alt text for every image, flow charts summarised in captions; prototype videos play muted when scrolled into view (owner's choice), pause off screen, never under reduced motion, keep controls and a text description                                                                                                                                                                                                                                                                                 | [ADR 0006](adr/0006-case-study-media.md)                    |
| Process page  | `/how-i-built-this` reads plan steps, quality gates and ADRs from `docs/` at build time, so it cannot drift                                                                                                                                                                                                                                                                                                                                                                                            | This plan                                                   |
| Design page   | `/design-system` reads `tokens/*.json`; contrast ratios use the CI gate's maths (`src/design-system/`)                                                                                                                                                                                                                                                                                                                                                                                                 | [ADR 0003](adr/0003-storybook-foundations.md)               |
| E2E           | Playwright + `@axe-core/playwright` on the production build under `/my-portfolio/`: every route at 1280px, 320px and emulated 200% zoom, plus keyboard, focus, deep-link and video behaviour; Chromium only in CI; no screenshot tests                                                                                                                                                                                                                                                                 | [ADR 0007](adr/0007-e2e-lighthouse-and-releases.md)         |
| Lighthouse    | LHCI on five pages, mobile and desktop: accessibility 100, performance ≥ 90, best practices and SEO ≥ 95 (set under measured scores), per-page size budgets; reports kept as CI artifacts                                                                                                                                                                                                                                                                                                              | [ADR 0007](adr/0007-e2e-lighthouse-and-releases.md)         |
| Releases      | release-please (manifest, `release-type: node`, `bump-minor-pre-major`) keeps a release PR on `main`; first release `0.1.0`. Needs a `RELEASE_PLEASE_TOKEN` secret or the Actions PR setting (owner)                                                                                                                                                                                                                                                                                                   | [ADR 0007](adr/0007-e2e-lighthouse-and-releases.md)         |
| Motion        | From the `prototype/motion` review: **Fade-up** reveals, **Count-up** numbers, **Lift** hover/press, **Crossfade** pages (View Transitions); CSS only; nothing hidden without JS; reduced motion: no movement                                                                                                                                                                                                                                                                                          | [ADR 0008](adr/0008-motion-and-at-a-glance-intro.md)        |
| Intro         | **At a glance** overlay (owner's design): six narrow 9:16 Wrapped story cards in a native modal `<dialog>` once per browser session on home (sessionStorage; third owner review), smaller faded neighbours both sides, pop-out entrance, sliding, never auto-advancing; "Replay intro" on home. Second owner review: card 1 after the owner's mockup (no text over the photo), one symmetric Back · dots · Next row on the scrim, ghost Skip above the card, confetti on the automatic first open only | [ADR 0008](adr/0008-motion-and-at-a-glance-intro.md)        |
| Content       | Home headline is **"UX Designer \| Product Manager"** (owner's choice, step 10), replacing "Product Manager \| UX/UI & Design Systems"                                                                                                                                                                                                                                                                                                                                                                 | This plan                                                   |
| Case studies  | PM case studies (flowCentral, Made-in-CPF) show "How I managed it" as **unnumbered** areas of work (`process.numbered: false`); UX case studies keep numbered steps                                                                                                                                                                                                                                                                                                                                    | This plan                                                   |
| Case studies  | flowCentral's FAST operating model is a **flow diagram** in semantic HTML (a `flow` block: ordered list of stage cards, nested list for the stage-3 branch, decorative lines `aria-hidden`); owner chose the stacked-cards layout over a timeline rail                                                                                                                                                                                                                                                 | This plan                                                   |
| Tokens        | New `duration.count` (1000ms), `duration.stagger` (60ms), `blur.overlay` (0.5rem), `color.scrim` (ink.900 at 70%), `easing.overshoot`, `duration.celebrate` (500ms), `duration.confetti` (1800ms), scene role `display` (blush: pink.600); the Lift shadow reuses `--spacing` and the scene colours (hollow under filled buttons)                                                                                                                                                                      | [ADR 0008](adr/0008-motion-and-at-a-glance-intro.md)        |

## Repo layout (target)

```
my-portfolio/
├─ .github/            workflows (ci.yml, deploy.yml, release-please.yml), PR + issue templates
├─ .claude/            settings.json (permissions, hooks), hooks/, skills/ (planned)
├─ CLAUDE.md           rules for AI assistants
├─ docs/               plan.md (this), adr/, ai-workflow.md, accessibility.md
├─ tokens/             DTCG JSON: color, scene, typography, layout        ← source of truth
├─ scripts/            build-tokens.ts, check-contrast.ts, contrast.ts, check-token-usage.ts
├─ prototypes/         only on branch prototype/wrapped-themes, never on main
├─ src/
│  ├─ styles/          tokens.css (generated), via index.css
│  ├─ components/ui/   primitives: Button, Link, Heading, Text, Card, Tag, SkipLink, VisuallyHidden
│  ├─ components/layout/    shell: Header, Nav (mobile menu), Footer, Page, RouteLink
│  ├─ components/sections/  Wrapped sections: Intro, TopSkills, CareerPath, Projects, Achievements
│  ├─ components/case-study/ case-study sections, media figures, process steps, flow diagram, project pager
│  ├─ components/motion/    scroll reveals, count-up StatValue, reduced-motion helpers
│  ├─ components/glance/    "At a glance" intro: dialog carousel, cards, first-visit logic
│  ├─ design-system/   token reader and scene contrast, shared by Storybook and /design-system
│  ├─ assets/          case-study images (WebP) and videos (MP4), the intro portrait
│  ├─ stories/         Storybook Foundations (scenes, colour, type, layout, motion)
│  ├─ content/         typed data: site, intro, skills, career, projects, achievements, period, glance
│  ├─ pages/           Home, ProjectDetail (case study), DesignSystem, HowIBuiltThis
│  └─ app/             routes, router (view transitions), Layout (focus management, reveals)
├─ e2e/                Playwright specs incl. axe scans per route and per intro card (playwright.config.ts)
├─ lighthouserc.cjs    Lighthouse CI pages, presets, score and size budgets
├─ release-please-config.json, .release-please-manifest.json   release PRs, CHANGELOG.md
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
| Unit tests + axe (Vitest)    | CI                        | Live   |
| Playwright + axe, 320px/200% | CI (E2E job)              | Live   |
| Lighthouse CI (a11y = 100)   | CI (Lighthouse CI job)    | Live   |

## Accessibility (WCAG 2.0 AA) commitments

- Semantic landmarks, one `h1` per page, skip link, visible focus ring that follows the scene (≥ 3:1)
- Every scene's text and accent colours ≥ 4.5:1 against its background (checked in CI)
- `prefers-reduced-motion` respected; Wrapped reveals are motion-optional; nothing auto-advances
- Route changes move focus to the main heading and announce the page title
- Images need `alt`; no colour-only meaning (skills are listed without proficiency levels; project
  status is a text label)
- Reflow at 320px and 200% zoom without loss of content
- Manual keyboard-only and VoiceOver checks per PR (PR template), logged in
  [`docs/accessibility.md`](accessibility.md), which also maps each commitment to its checks

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
