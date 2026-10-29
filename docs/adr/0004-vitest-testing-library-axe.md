# ADR 0004: Unit and axe tests with Vitest, Testing Library and axe-core in jsdom

- Status: Accepted
- Date: 2026-10-29

## Context

Plan step 5 adds UI primitives, and CLAUDE.md requires every component to ship with a unit test and
an axe assertion. ADR 0003 promised an automated axe run over the stories in CI. The tests must run
fast in CI and pass the project's strict typecheck.

## Options

- **Vitest + Testing Library + axe-core in jsdom.** Same Vite pipeline as the app, fast, no browser
  download in CI. jsdom has no layout, so axe cannot measure colour contrast there.
- **Storybook `addon-vitest` (browser mode, Playwright).** Runs every story in a real browser, so
  axe checks contrast too. Needs Playwright browsers in CI and is slower; browser e2e is planned for
  step 9 anyway.

## Decision

- **Vitest (jsdom) + `@testing-library/react` + `user-event` + `jest-dom` matchers**, run with
  `npm run test` (single run) and as a "Unit tests" step in the "Lint, typecheck & build" CI job.
- **axe-core directly**, through one helper (`src/test/axe.ts`) that prints each violation, rather
  than `vitest-axe`, which is unmaintained. It mirrors the Storybook a11y addon: every rule except
  `region` (a component on its own has no page landmarks).
- **Stories are tested too.** Each component test calls `describeStoriesAxe()`, which renders every
  story with `composeStories` and runs axe on it, so the stories reviewers see are the ones CI checks.
- Globals stay off: tests import from `vitest` explicitly, so test files typecheck like any source.

## Consequences

- Colour contrast is not checked by the unit tests. It stays enforced at the token level by
  `npm run tokens:check` (every scene role pair), and components only use scene role utilities.
- A real-browser axe pass (contrast, focus, 320px reflow) arrives with Playwright in step 9; until
  then the Storybook a11y panel covers it during review.
