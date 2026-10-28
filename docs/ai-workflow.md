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
