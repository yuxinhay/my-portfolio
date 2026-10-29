# ADR 0008: Motion as progressive enhancement, View Transitions, and a native `<dialog>` intro

- Status: Accepted
- Date: 2026-10-29

## Context

Plan step 10 adds motion to the "Career Wrapped" site: scroll reveals, count-up numbers, hover and
press states and page transitions. The owner chose one option per area from a throwaway prototype
(branch `prototype/motion`): **Fade-up** reveals, **Count-up** numbers, **Lift** hover and press,
**Crossfade** page transitions. The owner also designed an "At a glance" intro: six Wrapped-style
cards in a modal carousel over the home page on a first visit.

Constraints: WCAG 2.0 AA (ADR 0002 contrast gate, keyboard, focus, reduced motion, nothing
auto-advances), the focus management after navigation from ADR 0005, token-only styling, a
client-rendered app on GitHub Pages, and the Lighthouse budgets from ADR 0007.

## Options

- **Motion library** (Framer Motion, GSAP) or **CSS transitions plus a little DOM code**. The
  chosen effects are one-shot transitions of `opacity`, `translate`, `scale` and `box-shadow`, which
  CSS does natively, from the duration and easing tokens; a library adds 30–60 KB of JavaScript.
- **Reveals**: hide content in CSS for everyone and show it from script, or hide it only after
  script has run. The first hides the page whenever the script fails or the browser lacks
  IntersectionObserver.
- **Page transitions**: a React transition wrapper around the routes, or the browser's View
  Transitions API, which React Router 8 supports per navigation (`viewTransition: true`).
- **Overlay**: a custom modal (`role="dialog"`, own focus trap, `inert` on the page), or the native
  `<dialog>` element with `showModal()`.

## Decision

- **No motion library.** CSS transitions in `src/index.css` and Tailwind utilities, driven by the
  tokens; small modules in `src/components/motion/` for the parts that need script.
- **Every movement is opt-in.** Movement only runs under `prefers-reduced-motion: no-preference`
  (`motion-safe:` utilities, a media query, or a `matchMedia` check in script), and the existing
  base rule still cuts any stray transition to an instant change under `reduce`.
- **Reveals are progressive enhancement** (`startReveals`, run per page from `Layout` in a layout
  effect). Script marks the children of every `[data-reveal-group]` (sections after the first;
  lists item by item, each sibling `duration.stagger` later, at most six steps) and
  `<html data-motion>`, but only when IntersectionObserver exists and motion is allowed. The CSS
  hides only marked targets under that mark, so without script, without the observer or with
  reduced motion everything is simply shown. Each target fades in and rises once (`duration.slow`,
  `easing.out`). The page's first section, with the h1, never hides, so it is the first paint and
  the LCP. Targets that get keyboard focus, or that are already above the viewport after a `#hash`
  jump or Back, are shown at once.
- **Count-up numbers** (`StatValue`). A value that is exactly one number (`40+`, `$7,000+`,
  `10 weeks`) counts from 0 over `duration.count`, eased, when half on screen, or each time an
  overlay card becomes current. Prefix, suffix and thousands separators are kept; anything else
  (`1–2 weeks`) is shown as it is. Screen readers only get the final value: it sits in a visually
  hidden span, the animated copy is `aria-hidden`, and an invisible copy of the final value holds
  the width so nothing shifts. Under reduced motion, or without the observer, the plain value is
  rendered.
- **Lift** (`LIFT`, `CARD_LIFT`, `LINK_LIFT` in `src/components/ui/styles.ts`). Buttons and project
  cards rise `0.375rem` with a hard offset shadow in the scene's text colour (`shadow-lift`, built
  from `--spacing` and `--scene-fg`, so it shows on every scene and needs no new colour); nav and
  pager links rise slightly without a shadow. Press scales to 0.98. `:focus-visible` (for cards:
  the card's link) gets the same state as hover, and the focus ring stays. Under reduced motion the
  shadow and colour still change, without movement. Inline text links do not lift.
- **Crossfade with the View Transitions API.** `withViewTransitions` wraps `router.navigate`, so
  every in-app navigation passes `viewTransition: canCrossfade()`: true only when
  `document.startViewTransition` exists and motion is allowed, decided per navigation. Browsers
  without the API change pages instantly. The CSS sets the root crossfade to `duration.base` and
  stops any transition under reduced motion. ADR 0005's focus management and
  `<ScrollRestoration>` are unchanged; reveals hide targets in a layout effect, before the new page
  is captured.
- **The intro is a native modal `<dialog>`** (`GlanceOverlay`), opened with `showModal()`: the
  browser contains focus, makes the page inert and handles the top layer. Its name is "Yuxin Hay at
  a glance". `::backdrop` dims the page with `color.scrim` and blurs it with `blur.overlay`; a
  browser without `backdrop-filter` gets a solid ink scrim. The page does not scroll while it is
  open (`:root:has(dialog:modal)`).
  - Six cards in a row that slides (`translate`, `duration.slow`, `easing.out`); from `md` a card is
    80% wide, so the next one peeks in. Only the current card is perceivable (`inert`,
    `aria-hidden`); it is a group with `aria-roledescription="slide"` and the name "Card 2 of 6",
    and a polite live region repeats that name when the card changes. The current card is a tab
    stop, because it scrolls when its content is taller than a small or zoomed screen.
  - Controls: Skip; dots as buttons ("Go to card 3 of 6", the current one `aria-current` and wider,
    so it does not rely on colour); Back except on card 1; Next, which reads "Explore my work" on
    the last card and closes the intro. Left and Right arrows move between cards, Escape skips, and
    a horizontal touch or pen swipe of 48px or more moves one card. Nothing advances by itself.
    Focus starts on Next; if Back disappears while focused, focus moves to Next.
  - It opens by itself only when a visit starts on the home page (React Router's first location,
    key `default`) and the visitor has never closed it, remembered in localStorage
    (`my-portfolio:glance-seen`, no cookies). Storage that cannot be read counts as seen. "Replay
    intro" in the home intro section reopens it. Closing moves focus to the page h1, except a replay
    closed with Skip or Escape, which returns focus to the Replay button.
  - Under reduced motion the cards swap at once, numbers show their final values and nothing
    animates; the blur is never animated.
- **Card content is typed data** (`src/content/glance.ts`) that looks up numbers, skills, years,
  certifications and the flowCentral title in the existing content, so the cards cannot drift from
  the rest of the site. The portrait is a WebP under ADR 0006 (800×900, cropped from the original,
  quality 80, no EXIF, XMP, ICC or IPTC data; 47 KB).
- **Tests.** Unit tests cover count-up parsing and formatting, `StatValue` (screen readers get the
  final value, reduced motion, controlled runs), reveals (no observer, reduced motion, stagger cap,
  focus, cleanup), view transitions, and the overlay (keyboard, dots, swipe, last card, Escape, focus
  return, first-visit logic, no auto-advance with fake timers, axe on every card and under reduced
  motion). E2E specs seed the "seen" flag for every existing spec through a fixture
  (`e2e/fixtures.ts`); `glance.spec.ts` tests a first visit: axe and overflow on every card at
  1280px, 320px and 200% zoom, the keyboard flow, Escape, replay, reduced motion and the other
  routes. `motion.spec.ts` checks reveals with and without IntersectionObserver, crossfades with
  focus on the h1, and count-up values in the accessibility tree.
- **Lighthouse audits the first visit**, with the intro open over the home page: it is what a new
  visitor (and a fresh Lighthouse profile) sees, so its accessibility and its cost on performance
  are measured rather than hidden. The other four pages are unaffected by the intro.

### Measured scores (local LHCI, 2026-10-29, home audited with the intro open)

| Page                        | Mobile perf / a11y / BP / SEO | Desktop perf / a11y / BP / SEO |
| --------------------------- | ----------------------------- | ------------------------------ |
| Home                        | 96 / 100 / 100 / 100          | 100 / 100 / 100 / 100          |
| Case study: adaptive tables | 95 / 100 / 100 / 100          | 100 / 100 / 100 / 100          |
| Case study: flowCentral     | 98 / 100 / 100 / 100          | 100 / 100 / 100 / 100          |
| Design system               | 97 / 100 / 100 / 100          | 100 / 100 / 100 / 100          |
| How I built this            | 97 / 100 / 100 / 100          | 100 / 100 / 100 / 100          |

Every ADR 0007 threshold and size budget holds, so none changed. CLS was 0.033 at most
(ADR 0007 measured 0.155 on desktop home); the cause was not investigated. The machine was heavily loaded during the run; CI's numbers are the reference.

## Consequences

- No new runtime dependency. The app's JavaScript transfer grows from 129 KB to 137 KB (motion
  code, the overlay and its cards); the portrait adds 47 KB, loaded only when the intro opens.
- New tokens: `duration.count` (1000ms), `duration.stagger` (60ms), `blur.overlay` (0.5rem) and
  `color.scrim` (ink.900 at 70%). `--blur-*` joins the Tailwind namespaces reset in
  `scripts/build-tokens.ts`.
- Content below the fold is hidden until it scrolls in, so anything that reads the page without
  scrolling (Lighthouse, a screenshot) sees those sections at opacity 0; axe skips them, and the
  e2e suite scrolls through every page and waits for transitions before scanning.
- Browsers without the View Transitions API change pages instantly, with focus handled the same
  way.
- jsdom has no `<dialog>` methods, so the unit-test setup adds minimal `showModal` and `close`;
  focus containment and inertness are covered by the e2e tests in Chromium.
- A visitor who closes the intro in one browser sees it again in another, or after clearing site
  data; this is intended.
