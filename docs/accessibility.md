# Accessibility

The site targets **WCAG 2.0 AA**, treated as a requirement rather than polish (see `CLAUDE.md` and
the commitments in [plan.md](plan.md#accessibility-wcag-20-aa-commitments)). This page lists which
commitments are checked automatically, where, and what still needs a person.

## Commitments and how they are checked

| Commitment                                                                                                | Automated check                                                                                                                                                                                                                                                                 | Manual check                                                       |
| --------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------ |
| Text and accent colours ≥ 4.5:1, focus ring ≥ 3:1, in every scene                                         | `npm run tokens:check` (every scene role pair, CI); axe `color-contrast` on every page in a real browser (e2e, CI); Lighthouse a11y (CI)                                                                                                                                        | Spot-check new visuals, e.g. text over media                       |
| Styling only through tokens, so the checked pairs are the ones used                                       | `scripts/check-token-usage.ts` (CI, AI hook)                                                                                                                                                                                                                                    | —                                                                  |
| Semantic HTML, landmarks, labelled controls, valid ARIA, alt text present                                 | oxlint `jsx-a11y` (pre-commit, CI); axe in jsdom for every component and story (Vitest, CI); axe WCAG 2.0 A/AA on every route (e2e, CI)                                                                                                                                         | Alt text and captions say something meaningful                     |
| Exactly one h1 per page                                                                                   | Vitest layout tests; e2e on every route                                                                                                                                                                                                                                         | —                                                                  |
| Skip link is the first Tab stop and moves focus to main                                                   | Vitest layout tests; e2e                                                                                                                                                                                                                                                        | Keyboard-only pass                                                 |
| Every control keyboard operable with a visible focus state                                                | e2e: mobile menu by keyboard, Escape returns focus to the toggle                                                                                                                                                                                                                | Keyboard-only pass over every changed page                         |
| Route changes move focus to the new h1, not on first load (ADR 0005)                                      | Vitest layout tests; e2e (client-side and back navigation)                                                                                                                                                                                                                      | VoiceOver announces the new page                                   |
| Reflow at 320px and 200% zoom without loss of content                                                     | e2e at 320px and emulated 200% zoom: no horizontal overflow, axe clean                                                                                                                                                                                                          | Real browser zoom and text-only zoom                               |
| `prefers-reduced-motion` respected; nothing auto-advances                                                 | Vitest (`usePlayInView`, reveals, `StatValue`, the intro with fake timers); e2e: no case-study video plays, no reveal hides content, no page transition starts and the intro's cards swap without animation under reduced motion; videos have no `autoplay` and keep `controls` | Check new motion with reduced motion on and off                    |
| Content is never hidden without a way to show it (scroll reveals)                                         | Vitest: nothing is marked without IntersectionObserver or under reduced motion, focus reveals at once; e2e: with IntersectionObserver removed every section is visible                                                                                                          | Scroll and Tab through a page with motion on                       |
| Numbers that count up are read as their final value                                                       | Vitest: the animated copy is `aria-hidden`, a visually hidden final value is read; e2e: the accessibility tree has only final values                                                                                                                                            | VoiceOver reads a stat once, with its label                        |
| The At a glance intro is a modal dialog: named, focus contained, Escape closes it, focus returns sensibly | Vitest: keyboard (arrows, Escape), dots, last-card button, focus return, first-visit logic, axe on every card; e2e: axe on every card at 1280px, 320px and 200% zoom, Tab never reaches the page, no overflow, replay                                                           | VoiceOver announces the dialog and "Card 2 of 6"; swipe on a phone |
| No colour-only meaning                                                                                    | — (partly: current page is underlined, project status is a text label, covered by component tests)                                                                                                                                                                              | Review every new visual                                            |
| Media loads under the `/my-portfolio/` base path; videos have descriptions                                | e2e: every image, poster and video source returns 200; Vitest content tests                                                                                                                                                                                                     | Descriptions match the video                                       |
| Screen reader experience                                                                                  | —                                                                                                                                                                                                                                                                               | VoiceOver spot-check of new or changed parts                       |

Lighthouse CI asserts an accessibility score of 100 (mobile and desktop) on the home page, two case
studies, `/design-system` and `/how-i-built-this`. Lighthouse's accessibility audits are axe rules,
so this mostly overlaps with the e2e scan; it is kept as an independent, widely known measure.

Automated checks find only part of the WCAG failures. A clean run means no known issue of the kinds
the tools can detect, not that a page is accessible; the manual checks below cover the rest.

## Motion and the At a glance intro

- **Motion** (ADR 0008): sections fade up as they scroll in, numbers count up, buttons and cards
  lift on hover and keyboard focus, and pages crossfade. Every movement runs only without
  `prefers-reduced-motion: reduce`; under it, content is simply shown, numbers show their final
  values, hover keeps its shadow and colour without moving, and pages change instantly. Content is
  hidden only after the script has checked that it can reveal it (IntersectionObserver), and
  focusing hidden content reveals it at once. Nothing loops or advances by itself, and the longest
  motion is about one second.
- **The intro** is a native modal `<dialog>` named "Yuxin Hay at a glance", opened once per browser
  session on the home page (a reload keeps it closed, a new tab shows it again) and from "Replay
  intro". The page behind is inert, dimmed and blurred.
  Focus starts on Next and stays in the dialog; Escape or Skip closes it. Each card is a group
  announced as "Card N of 6", and a polite live region repeats that when the card changes. Dots are
  buttons ("Go to card 3 of 6"), the current one marked with `aria-current` and a wider, filled
  shape, not colour alone. Left and Right arrows and a swipe change the card; nothing advances by
  itself. The current card scrolls and takes focus when its content is taller than the screen
  (320px, 200% zoom). Closing returns focus to the page h1, or to the Replay button after a replay
  closed with Skip or Escape.
- **Tests and the intro**: unit tests start as returning visitors (the shared setup marks the intro
  as seen) and e2e specs do the same through `e2e/fixtures.ts`, so the intro does not cover the
  pages they test; the intro's own tests opt out (`glanceSeen: false`). Lighthouse audits a first
  visit, with the intro open on the home page.

## How 200% zoom is emulated

Zooming a 1280×800 browser window to 200% halves the CSS viewport to 640×400 and draws every CSS
pixel with two device pixels. The e2e project `zoom-200` does exactly that: `viewport` 640×400 and
`deviceScaleFactor: 2` in `playwright.config.ts`. Layout, media queries and rem-based type respond
as they do to real zoom. It does not cover text-only zoom or a minimum font size set in the browser,
so those are part of the manual checks.

## Running the checks

```sh
npm run test        # Vitest + axe in jsdom (components, stories, layout)
npm run test:e2e    # build, then Playwright + axe on every route at 1280px, 320px and 200% zoom
npm run lhci        # build, then Lighthouse CI (mobile and desktop)
npm run tokens:check
```

## Manual checks

The PR template asks for a keyboard-only pass, a VoiceOver spot-check and a reduced-motion check on
every PR that changes the UI. Log them here. Only checks a person actually did belong in this table.

| Date | PR  | Checks (keyboard, VoiceOver, zoom, reduced motion, …) | Result and follow-ups |
| ---- | --- | ----------------------------------------------------- | --------------------- |
|      |     |                                                       |                       |
