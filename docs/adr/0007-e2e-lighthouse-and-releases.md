# ADR 0007: Playwright + axe e2e, Lighthouse CI budgets and release-please

- Status: Accepted
- Date: 2026-10-29

## Context

Plan step 9 closes the gaps ADR 0004 left open: unit tests run in jsdom, which has no layout, so
colour contrast in context, reflow at 320px and 200% zoom, real keyboard focus, media loading under
the `/my-portfolio/` base path and the video behaviour from ADR 0006 were only checked by hand in
headless Chrome. The plan also asks for Lighthouse budgets with accessibility at 100, and for
versioned releases. The site is static on GitHub Pages; `main` is protected and requires CI checks.

## Options

- **E2E runner**: Playwright (`@playwright/test` + `@axe-core/playwright`), Cypress, or Storybook's
  browser-mode tests. Playwright runs Chromium, WebKit and Firefox from one API, emulates viewport,
  device scale and `prefers-reduced-motion` per test, and starts the preview server itself. Storybook
  browser tests see components, not routed pages with real deep links.
- **Browsers in CI**: Chromium only, or Chromium + WebKit + Firefox.
- **Lighthouse reports**: LHCI `temporary-public-storage` (public links, kept a few days), an LHCI
  server, or the `filesystem` target kept as a CI artifact.
- **Releases**: none, release-please, or semantic-release.

## Decision

- **Playwright + axe against the production build.** `npm run test:e2e` builds, then Playwright's
  `webServer` starts `vite preview` on its own port (4317, never reusing a running server) under
  `/my-portfolio/`. The route list derives the case studies from `src/content/projects.ts`.
- **Per route** (home, every case study, `/design-system`, `/how-i-built-this`, an unknown path), in
  three projects: desktop 1280×800, mobile 320×640, and 200% zoom. Each test scrolls the page so
  lazy media loads, then asserts: axe with the `wcag2a` and `wcag2aa` tags finds 0 violations;
  exactly one h1; `scrollWidth <= clientWidth`; no console errors, exceptions, failed requests or
  HTTP errors; every image, poster and video source is under the base path and returns 200.
- **200% zoom is emulated** as a 640×400 CSS viewport with `deviceScaleFactor: 2`, which is what
  zooming a 1280×800 window to 200% does to layout, media queries and rem-based type. It does not
  cover text-only zoom or a user's minimum font size; those stay in the manual checks
  (`docs/accessibility.md`).
- **Behaviour**: the skip link is the first Tab stop and moves focus to `main`; at 320px the menu
  opens and closes by keyboard and Escape returns focus to the toggle; client-side navigation (and
  back) focuses the new h1, the first load does not (ADR 0005); a case study loads from a deep link;
  `dist/404.html` equals `dist/index.html` (read from disk, since `vite preview` falls back to
  `index.html` instead); with reduced motion no case-study video plays when scrolled into view; with
  normal motion videos have no `autoplay` attribute and keep `controls`.
- **One allowance**: a video's range request cancelled by the browser (`net::ERR_ABORTED` on a media
  request, when a video leaves the screen and stops buffering) is not a failure. Every video source
  is still requested separately and must return 200. No axe rules are disabled.
- **Chromium only in CI.** It is the engine behind Chrome and Edge, one engine means one cached
  browser download and a suite that runs in about half a minute locally, and axe's rules do not
  depend on the engine. WebKit can be added locally with `E2E_WEBKIT=1`; it is not run in CI.
- **No screenshot or visual-regression tests**: font rendering differs across operating systems, so
  they are flaky without a pinned rendering environment; visual review stays with the owner.
- **Lighthouse CI** (`@lhci/cli`, `lighthouserc.cjs`) on the built site under `vite preview`
  (port 4318): home, one UX case study (`adaptive-tables`, the most media above the fold), one PM
  case study (`flowcentral`), `/design-system` and `/how-i-built-this`, with the mobile preset and
  then the desktop preset (`LIGHTHOUSE_FORM_FACTOR=desktop`), three runs per URL.
- **Assertions** (all `error`): accessibility = 100. Performance ≥ 90, best practices ≥ 95 and SEO
  ≥ 95, a few points under the scores measured when the thresholds were set (below). Transfer-size
  ceilings per page: JS 180 KB, CSS 20 KB, fonts 80 KB, images 600 KB, total 900 KB. Lazy media
  below the fold is not loaded by Lighthouse, so it is not counted.
- **Reports are a CI artifact** (`filesystem` target, kept 14 days), not public storage: nothing
  leaves GitHub, and the scores are visible in the job log.
- **release-please** (`googleapis/release-please-action`, manifest config, `release-type: node`,
  `bump-minor-pre-major`, starting from `0.0.0`) runs on every push to `main`. It keeps a release PR
  open that bumps `package.json` and writes `CHANGELOG.md` from Conventional Commits; merging it tags
  the release. While the version is below 1.0.0, a `feat` bumps the minor version, so the first
  release is `0.1.0`. `CHANGELOG.md` is generated, so Prettier ignores it.

### Measured scores (local, 2026-10-29, Chromium 156)

| Page                        | Mobile perf / a11y / BP / SEO | Desktop perf / a11y / BP / SEO |
| --------------------------- | ----------------------------- | ------------------------------ |
| Home                        | 98 / 100 / 100 / 100          | 94 / 100 / 100 / 100           |
| Case study: adaptive tables | 96 / 100 / 100 / 100          | 100 / 100 / 100 / 100          |
| Case study: flowCentral     | 98 / 100 / 100 / 100          | 100 / 100 / 100 / 100          |
| Design system               | 93 / 100 / 100 / 100          | 100 / 100 / 100 / 100          |
| How I built this            | 98 / 100 / 100 / 100          | 100 / 100 / 100 / 100          |

Transfer sizes: JS 129 KB, CSS 6 KB and fonts 47 KB on every page; images 345–366 KB on the
adaptive-tables case study and none above the fold elsewhere; total 186–552 KB. The lowest scores
come from layout shift (CLS 0.13 on mobile `/design-system`, 0.155 on desktop home); improving them
is app work for a later step, not part of this one.

### release-please and the protected `main`

The default `GITHUB_TOKEN` cannot open the release PR while "Allow GitHub Actions to create and
approve pull requests" is off, and PRs it opens do not trigger workflows, so the required CI checks
would never run on them. The workflow uses `secrets.RELEASE_PLEASE_TOKEN` when it exists and falls
back to the default token. The owner chooses one of:

1. **Fine-grained personal access token** (recommended): repository `yuxinhay/my-portfolio` only,
   permissions Contents: read and write, Pull requests: read and write. Save it as the Actions
   secret `RELEASE_PLEASE_TOKEN`. Release PRs then run CI like any other PR.
2. **Enable "Allow GitHub Actions to create and approve pull requests"** (Settings → Actions →
   General → Workflow permissions). No secret, but CI does not start on the release PR by itself;
   it has to be triggered, e.g. by closing and reopening the PR or pushing to its branch.

## Consequences

- Every PR runs two new CI jobs, "E2E (Playwright + axe)" and "Lighthouse CI", in parallel with
  "Lint, typecheck & build". They become required checks only when the owner adds them to branch
  protection.
- Colour contrast is now checked in a real browser on every page, on top of the token-level gate.
- The deep-link 404 status on GitHub Pages (ADR 0005) is not exercised by Lighthouse, because
  `vite preview` answers deep links with 200; SEO on deployed case-study URLs may score lower than
  measured here.
- Performance thresholds are a floor against regressions, not a target; they are revisited when the
  motion work in step 10 changes the pages.
- release-please cannot be tested until it runs on `main`; the config was checked against its JSON
  schema.
