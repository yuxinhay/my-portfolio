# ADR 0003: Storybook documents the tokens it reads; built in CI, published at `/storybook/`

- Status: Accepted
- Date: 2026-10-29

## Context

The design system needs a browsable reference (plan step 4) that cannot drift from
`tokens/*.json`, follows the same accessibility and token-only rules as the app, and is published
next to the site on GitHub Pages.

## Decision

- **Storybook 10 with `@storybook/react-vite`**, reusing the app's `vite.config.ts` (React +
  Tailwind plugins). `.storybook/preview.ts` loads `src/index.css` and Inter, so stories render with
  the real design system.
- **Foundations stories read the DTCG files directly.** `src/stories/foundations/tokens.ts` imports
  `tokens/*.json` and resolves `{a.b}` references itself (Style Dictionary is Node-only). Lists of
  swatches, scenes, sizes and durations come from that data, so a new token shows up without
  touching the stories. Rendering uses the generated CSS variables (`var(--color-pink-300)`) or
  role utilities, never copied values.
- **One contrast implementation.** The WCAG maths moved to `scripts/contrast.ts` (pure, no Node
  APIs). The CI gate (`check-contrast.ts`) and the Colour story both import it, so the ratios shown
  in Storybook are the ones CI enforces.
- **Never-text primitives are derived, not hand-listed.** A primitive is marked decorative when
  scenes only ever use it as `shape`.
- **a11y addon fails on violations**: `parameters.a11y.test = 'error'`.
- **Built in CI and deployed with the site.** The "Lint, typecheck & build" job runs
  `build-storybook`, so a broken story fails the PR. The deploy workflow builds the site into
  `dist/` and Storybook into `dist/storybook/`, served at `/my-portfolio/storybook/`.
- **Relative asset URLs.** The app's Vite `base` is `/my-portfolio/`; Storybook overrides it to
  `./` in `viteFinal`, so the same build works locally and one level deeper on Pages.
- The token-usage check now also covers `.storybook/`.

## Consequences

- The Typography story keeps a literal utility "recipe" per text step, because Tailwind only
  generates class names it can see in source. It is typed against the token keys, so adding a text
  token fails typecheck until the story covers it.
- axe runs in the Storybook a11y panel only; an automated axe run over all stories in CI arrives
  with the Vitest setup in step 5.
- CI takes a few seconds longer for the Storybook build.
