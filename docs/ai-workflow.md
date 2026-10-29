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
