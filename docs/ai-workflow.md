# AI-assisted development workflow

This project is built with Claude Code as a pair programmer. The aim is to show AI used
**deliberately and safely**: with clear rules, automated guardrails and human review.

## How AI is set up in this repo

| Piece                                | Purpose                                                                                                   |
| ------------------------------------ | --------------------------------------------------------------------------------------------------------- |
| `CLAUDE.md`                          | Project rules the AI must follow: token-only styling, WCAG AA rules, commit style.                        |
| `.claude/settings.json`              | Pre-approved safe commands; force-push and direct pushes to `main` are denied.                            |
| `.claude/hooks/check-edited-file.sh` | Runs oxlint after every AI edit and feeds failures back, so the AI fixes its own lint errors immediately. |
| `.claude/skills/` (planned)          | Repeatable workflows, e.g. scaffolding a component with story + tests, running an a11y audit.             |

## Guardrails

1. AI never merges. Every change goes through a PR that CI must pass and a human reviews.
2. CI runs the same checks regardless of who wrote the code (lint, types, tests, axe, Lighthouse).
3. AI-assisted commits carry a `Co-Authored-By` trailer; PRs describe what the AI did and what was
   changed by hand.

## Where AI helped vs. where I decided

Log notable examples here as the project grows (e.g. design decisions I made, AI suggestions I
rejected and why).

- 2026-10-28: Planned the harness with AI. I chose Tailwind + tokens, Storybook, GitHub Pages,
  and kept Figma out of scope.
- 2026-10-28: AI built side-by-side prototypes of four Wrapped-style colour themes and four type
  pairings (branch `prototype/wrapped-themes`). I chose theme D (Bubblegum Bold) and Inter only.
- 2026-10-28: The AI-written contrast gate failed its first run (blush accent on hot pink, 4.45:1).
  We darkened `pink.600` slightly instead of dropping the accent; recorded in ADR 0002.
- 2026-10-29: AI set up Storybook and Foundations stories that read the token JSON directly, and
  moved the contrast maths into one module shared with the CI gate. A headless axe run over the
  built stories caught three issues before review (duplicate landmark names, a non-focusable scroll
  area and 320px overflow on the colour table), fixed by restructuring rather than suppressing.
  AI proposed the per-step type recipes from existing usage; they are flagged for my review.
- 2026-10-29: I reviewed the h1, h3, body and small type recipes side by side in an HTML prototype
  and chose `font-medium` for small text; the other recipes stayed as proposed.
- 2026-10-29: AI built the eight UI primitives (step 5) with stories, Vitest unit tests and axe
  tests, and moved the type recipes into one module shared by the components and the Typography
  story. The visual choices it made with existing tokens are listed in the PR for my review.
- 2026-10-29: AI built the routed layout shell (step 6): header, mobile menu, footer, page stubs
  and focus management on navigation, and chose the GitHub Pages deep-link strategy (ADR 0005). A
  headless Chrome run against a Pages-like server caught a focus bug unit tests missed (native
  `#hash` navigations share a router key) and a header that shrink-wrapped instead of spanning the
  page. Personal details are placeholders until I provide them; visual choices are listed in the PR
  for my review.
- 2026-10-29: AI built the typed content model and the five Wrapped home sections (step 7) from
  content I approved, with no invented facts or numbers. A content test guards the order, slugs
  and terms that must never be published. Headless Chrome confirmed axe 0 violations and no
  overflow at 1280px, 320px and 200% zoom. Visual choices (scene per section, featured numbers,
  headline skills) are listed in the PR for my review.
- 2026-10-29: AI built the five case studies, `/design-system` and `/how-i-built-this` (step 8)
  from content I approved. An orchestrating agent supervised one worker agent for the step. The
  worker converted my vetted screenshots and recordings to WebP and MP4 with metadata stripped
  (ADR 0006) and wrote alt text, captions and video descriptions. Headless Chrome confirmed axe 0
  violations, no 404s under `/my-portfolio/`, no autoplay and no overflow at 1280px and 320px. The
  process page reads `docs/plan.md` and the ADRs directly. Layout and wording choices are listed
  in the PR for my review.
- 2026-10-29: I reviewed the step 8 pages and asked for changes in the same PR: case-study text
  and on every page as wide as the media, ink-scene text in blush instead of pink, device frames
  kept and cut along the device edge (videos play inside a transparent frame image), quotes from
  member interviews and colleague feedback, user stories, layout reasoning and feature descriptions
  added from my Figma pages, prototype videos labelled and
  playing when scrolled into view (still
  paused under reduced motion), screenshots that repeated the videos removed, the PBA rollout and
  outcome sections removed, and the settings card shown beside its withdrawal-form miniature.
- 2026-10-29: AI added the step 9 quality gates (ADR 0007): Playwright + axe on every route at
  1280px, 320px and emulated 200% zoom, keyboard, focus and video behaviour tests, Lighthouse CI
  with accessibility at 100 and score floors set from measured scores, and release-please. The
  checks found no defects in the app, so no app code changed. The first e2e run had silently
  tested a stale build from another worktree left on Vite's default preview port; the suite now
  starts its own server on a dedicated port and fails if that port is taken. Release-please needs
  a token or a repo setting I choose (ADR 0007), and manual accessibility checks are mine to log
  in `docs/accessibility.md`.
- 2026-10-29: AI built a throwaway motion prototype with three options per area (branch
  `prototype/motion`); I chose Fade-up reveals, Count-up numbers, Lift hover and press and a
  Crossfade between pages, and designed the "At a glance" intro overlay and its six cards. AI then
  built step 10 in production code (ADR 0008): CSS-only motion as progressive enhancement, a
  native `<dialog>` carousel, four new tokens, and unit, axe and e2e tests for every card at
  1280px, 320px and 200% zoom, with and without reduced motion. Screenshots in headless Chrome
  caught card layouts that overflowed at 1280px and 320px before review. I changed the home
  headline to "UX Designer | Product Manager" and provided the portrait, which AI converted to
  WebP with metadata stripped (ADR 0006). Small visual choices are listed in the PR for my review.
- 2026-10-30: I gave the flowCentral updates (the FAST operating model, enablement e-primer and
  workshops, 3 senior-management presentations, 10+ use cases completed and handed over, no
  transition area) and decided the PM case studies are not numbered. AI updated the content,
  stats and At a glance card, added a typed `flow` block and an unnumbered process option, and
  built two layouts for the FAST flow diagram; I chose the stacked cards over a timeline rail.
- 2026-10-30: I simplified my current career entry to "Product Manager" with two highlights, and
  gave the Made-in-CPF updates: the Season 5 redesign came from Season 4 feedback (duration and
  protected time), the skills criteria were removed to lower the barrier to entry, and why and how
  I vibe-coded openMIC, with an overview image I cleared for publishing. AI rewrote the content as
  feedback → action cards and converted the image to WebP (ADR 0006).
