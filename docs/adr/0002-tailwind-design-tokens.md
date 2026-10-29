# ADR 0002: Design tokens drive Tailwind; Wrapped-style "scenes"; theme D + Inter

- Status: Accepted
- Date: 2026-10-28

## Context

The portfolio has to show UX and UI skill, so its visual language must be systematic, not ad hoc.
The concept is a "Career Wrapped": bold, full-bleed sections in strong colour pairs, giant numbers
and tight headlines, showing skills and career path at a glance. It must also meet WCAG 2.0 AA.

## Decision

- **Tokens are the single source of truth**: `tokens/*.json` in the W3C DTCG format.
  `scripts/build-tokens.ts` (Style Dictionary) generates `src/styles/tokens.css` as Tailwind v4
  `@theme` variables. Tailwind's default palette, fonts, radii and breakpoints are reset, so the only
  utilities that exist are ones backed by tokens.
- **Two token layers**: primitives (`color.pink.600`) and semantic **scenes**. A scene is one
  Wrapped-style section, with `bg`, `fg`, `accent`, `focus` and `shape` roles, plus `surface`
  (a panel fill inside the scene, added in step 8; CI checks the text roles on it too). Components use
  role utilities (`bg-scene`, `text-scene-accent`) and a `.scene-*` class picks the colours, so one
  component works in every scene.
- **Scenes replace light/dark mode.** The page alternates light and dark scenes by design, so there
  is no separate theme toggle.
- **Colour theme D, "Bubblegum Bold"**: blush, hot pink, cobalt and ink. Chosen from four
  side-by-side prototypes (branch `prototype/wrapped-themes`, `prototypes/wrapped-themes.html`).
- **Typography: Inter only**, self-hosted via `@fontsource-variable/inter`. Weight 900 with tight
  tracking for display text, 400–700 for body. Chosen over Archivo, Bricolage Grotesque and Space
  Grotesk pairings (`prototypes/wrapped-type.html` on the same branch).

## Enforcement

- `scripts/check-contrast.ts` fails CI if any scene's `fg` or `accent` is below 4.5:1, or `focus`
  below 3:1, against its `bg`. Its first run caught blush-on-hot-pink at 4.45:1, so `pink.600` was
  darkened from `#D4104F` to `#CC0F4C` (now 4.74:1).
- `scripts/check-token-usage.ts` fails CI on hex colours or Tailwind arbitrary values in `src/`.
- CI regenerates `tokens.css` and fails if the committed file is out of date.
- A Claude Code hook runs the same token checks whenever the AI edits `tokens/*.json`.

## Consequences

- New colours or sizes need a token change first, which is deliberate friction.
- Decorative primitives (`pink.500`, `cobalt.400`, `ink.800`) are documented as never-text. The
  contrast check only covers scene text roles, so review must catch misuse elsewhere.
