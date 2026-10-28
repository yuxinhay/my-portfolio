# ADR 0001: Vite + React + TypeScript, with oxlint

- Status: Accepted
- Date: 2026-10-28

## Context

The portfolio is a static site hosted on GitHub Pages. It must show production-grade frontend
practice: type safety, fast feedback, accessibility checks, and a maintainable component model.

## Decision

- **Vite** as the build tool: fast dev server, first-class React + TS template, simple static
  output for GitHub Pages (`base: '/my-portfolio/'`).
- **React 19 + TypeScript** in strict mode, plus `noUncheckedIndexedAccess` and
  `exactOptionalPropertyTypes` to catch edge cases in content data and component props.
- **oxlint** instead of ESLint: it is the Vite template default, runs in milliseconds, and ships
  the `jsx-a11y` rules natively, so accessibility linting needs no extra plugin setup.
- **Prettier** for formatting, **Husky + lint-staged** on pre-commit, **commitlint** for
  Conventional Commits.

## Consequences

- No SSR. SEO relies on static meta tags, which is acceptable for a portfolio.
- Some ESLint-only plugins (e.g. Tailwind class linting) are unavailable. Token-only styling is
  enforced through the Tailwind theme and review instead (see ADR 0002 when written).
