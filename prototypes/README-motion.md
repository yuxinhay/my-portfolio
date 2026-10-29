<!--
  PROTOTYPE — throwaway. Lives on branch prototype/motion only; never merge to main, no PR.
  Question: which motion style suits "Career Wrapped" for each step-10 area (scroll reveals,
  count-up numbers, hover/press states, page transitions)?
  Plan: three options per area (option 1 is always "None (current)"), built into the real app with
  real content and scenes, switchable live from a floating PROTOTYPE panel.
  Run: npm run prototype:motion   then open http://localhost:5173/my-portfolio/
-->

# Motion prototype (step 10, phase A)

The real site, plus a floating **Prototype · Motion** panel in the bottom-right corner. Pick an
option per area and it applies at once; nothing reloads. Try it on:

- Home: `/my-portfolio/` (reveals, Achievements stats, project cards, nav)
- UX case study (media, no stats): `/my-portfolio/projects/adaptive-tables`
- PM case study (stats): `/my-portfolio/projects/flowcentral`

## How to switch

- The panel is a native form: Tab to it, arrow keys between radio options, Space toggles the
  checkbox. **Hide/Show** collapses it (remembered).
- Choices are saved in `localStorage` and written to the URL, so a link shares the combination,
  e.g. `/my-portfolio/?reveal=wipe&count=roll&hover=accent&page=wipe`. Add `&reduced=1` to share
  with reduced motion simulated.
- **Simulate reduced motion** behaves exactly like the OS setting (`prefers-reduced-motion:
reduce`), which also always wins when it is on.
- **Replay reveals** hides and replays the scroll reveals on the current page.
- **Reset** returns every area to None.

## Options and reduced-motion fallback

| Area             | Option             | What it does                                                                                                                                                                        | Under reduced motion                                                           |
| ---------------- | ------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------ |
| Scroll reveals   | None (current)     | Everything is simply there.                                                                                                                                                         | Same.                                                                          |
|                  | Fade-up            | Each block of a section (heading, paragraphs, list items, media) fades in and rises 1.5rem, `duration.slow`, `easing.out`, siblings staggered 60ms (max 6 steps). Once only.        | **None**: nothing is hidden or animated.                                       |
|                  | Wipe / clip reveal | A block in the scene's own colour shrinks upwards off each element, so it is uncovered bottom-up; headings are uncovered onto a solid accent bar that then slides off to the right. | **None**.                                                                      |
| Count-up numbers | None (current)     | Static numbers.                                                                                                                                                                     | Same.                                                                          |
|                  | Count-up           | Counts from 0 to the value over 1s (ease-out) when half on screen. Prefix/suffix (`$`, `+`, `weeks`) and thousands separators kept.                                                 | **None**: the final value only.                                                |
|                  | Odometer roll      | Each digit is a column that spins one full turn and lands on its digit, columns landing one after another with a slight overshoot (≤ ~1s).                                          | **None**.                                                                      |
| Hover and press  | None (current)     | Colour change on nav links and buttons, thicker underline on text links.                                                                                                            | Same.                                                                          |
|                  | Lift               | Project cards and buttons rise 0.375rem with a hard offset shadow in the scene's text colour; nav and pager links rise slightly. Press scales to 0.98 and drops the shadow.         | **Static**: the shadow appears instantly, no movement or scale.                |
|                  | Bold accent        | An accent bar grows across the top of project cards, → arrows nudge (cards, Next project; ← for Previous), nav links get an underline that grows, text-link underlines thicken.     | **Static**: bar, underline and arrows appear instantly, no growing or nudging. |
| Page transitions | None (current)     | Instant route change.                                                                                                                                                               | Same.                                                                          |
|                  | Crossfade          | View Transitions API root crossfade, `duration.base`. Feature-detected; browsers without it change pages instantly.                                                                 | **None** (no view transition is started).                                      |
|                  | Scene wipe         | The header stays still; the new page, led by its first scene's colour, wipes up over the old one, `duration.slow`.                                                                  | **None**.                                                                      |

Every hover style also applies to `:focus-visible` (for cards: when the card's link has focus).
Inline text links do not lift (moving text inside a sentence breaks the line); they keep the
current underline.

### Guarantees checked in Chromium and WebKit (Playwright, headless)

- Nothing is hidden unless JS ran **and** `IntersectionObserver` exists: reveals are keyed off a
  class that only the script adds. With `IntersectionObserver` removed, all content and final
  numbers show. (With JS disabled the page is empty, but that is the existing client-rendered app,
  not this prototype.)
- Content that is focused before it scrolls in is revealed at once; content already scrolled past
  (e.g. after a `#hash` jump) is revealed without animating.
- Screen readers get the final number only: the real value sits in a visually hidden span, the
  animated copy is `aria-hidden`, and an invisible copy of the final value reserves the width so
  nothing shifts.
- Focus moves to the new page's h1 after navigation, and Back restores the scroll position, under
  all three page-transition options.
- No console errors. Nothing loops, auto-advances or flashes; the longest motion is ~1s.

## Proposed tokens (prototype-local variables; `tokens/*.json` is unchanged)

| Proposed token     | Value                              | Used by                            |
| ------------------ | ---------------------------------- | ---------------------------------- |
| `duration.count`   | `1000ms`                           | Count-up length                    |
| `duration.stagger` | `60ms`                             | Delay between siblings in a reveal |
| `easing.overshoot` | `cubic-bezier(0.34, 1.4, 0.64, 1)` | Odometer landing                   |

Everything else uses the existing `duration.fast | base | slow` and `easing.out`.

## Recommendation (a suggestion; the owner decides)

- **Scroll reveals: Wipe** on the home page's Wrapped scenes, it is the most "Wrapped" of the
  three, but consider **Fade-up** for case studies, where long text reads better without a cover.
- **Count-up numbers: Count-up.** It reads as data being tallied; the odometer is more playful but
  busier, especially on `$7,000+`.
- **Hover and press: Bold accent.** It adds an affordance (bar, arrow) that is also visible for
  keyboard focus and in reduced motion, rather than only movement.
- **Page transitions: Crossfade.** Calm, cheap and nearly invisible when it fails; the scene wipe
  is striking but competes with a Wipe reveal on arrival.

## Where the code is

- `src/prototype/motion/` — settings store (localStorage + URL), panel, reveals, `StatValue`,
  router wrapper for view transitions, `motion.css`.
- Hooks into existing code (marked `PROTOTYPE`): `Layout` mounts the panel, `router.ts` wraps
  navigate, `WrappedSection` gets `data-proto-section`, stats render through `StatValue`, and
  `proto-*` marker classes on `Card` (projects), `Link`, `Button`, `Nav` and `ProjectPager`.
