import { Fragment } from 'react'
import type { ReactNode } from 'react'
import { useDocumentTitle } from '../components/layout/useDocumentTitle'
import { WrappedSection } from '../components/sections/WrappedSection'
import { Heading } from '../components/ui/Heading'
import { Link } from '../components/ui/Link'
import { Tag } from '../components/ui/Tag'
import { Text } from '../components/ui/Text'
import { VisuallyHidden } from '../components/ui/VisuallyHidden'
import { TEXT_RECIPES } from '../components/ui/styles'
import type { Inline } from '../content/markdown'
import { REPO_URL, adrs, planSteps, qualityGates, repoFileUrl } from '../content/process'

/** Inline Markdown pieces from the docs: text, `code` and links (as text inside another link). */
function InlineText({ pieces, links = true }: { pieces: readonly Inline[]; links?: boolean }) {
  return pieces.map((piece, index) => (
    <Fragment key={index}>
      {piece.kind === 'code' ? (
        <code className="font-semibold">{piece.text}</code>
      ) : piece.kind === 'link' && links ? (
        <Link href={piece.href}>{piece.text}</Link>
      ) : (
        piece.text
      )}
    </Fragment>
  ))
}

/** A bulleted list of short facts at a readable measure. */
function FactList({ items }: { items: readonly ReactNode[] }) {
  return (
    <ul className="grid max-w-prose list-disc gap-2 pl-5">
      {items.map((item, index) => (
        <li key={index}>
          <Text as="span">{item}</Text>
        </li>
      ))}
    </ul>
  )
}

const STACK = [
  'React 19 and TypeScript in strict mode',
  'Vite, with React Router for real paths on GitHub Pages',
  'Tailwind CSS v4, generated from design tokens with Style Dictionary',
  'Inter, self-hosted',
  'Storybook with the accessibility addon',
  'Vitest, Testing Library and axe-core',
  'oxlint (with jsx-a11y rules), Prettier, Husky, lint-staged and commitlint',
  'GitHub Actions for CI, and deployment to GitHub Pages',
]

/**
 * The engineering and AI-assisted process behind the site. Plan steps, quality gates and ADRs are
 * read from docs/plan.md and docs/adr/ at build time, so this page follows the docs.
 */
export function HowIBuiltThis() {
  useDocumentTitle('How I built this')
  return (
    <>
      <WrappedSection id="overview" scene="ink" level={1} title="How I built this">
        <div className="grid max-w-prose gap-4">
          <p className={TEXT_RECIPES.h3}>
            This site is part of my portfolio, and so is the way it is built: a design system,
            accessibility checks that run on every change, a visible engineering process and a
            deliberate use of AI.
          </p>
          <Text>
            <Link href={REPO_URL}>The code is public on GitHub</Link>.
          </Text>
        </div>
      </WrappedSection>

      <WrappedSection id="stack" scene="blush" title="Stack">
        <FactList items={STACK} />
      </WrappedSection>

      <WrappedSection id="plan" scene="cobalt" title="Plan, step by step">
        <Text className="max-w-prose">
          The work follows a written plan,{' '}
          <Link href={repoFileUrl('docs/plan.md')}>docs/plan.md</Link>, which is also the task
          tracker. Each step is one branch and one pull request, and the pull request updates the
          plan’s status table. This list is read from that table.
        </Text>
        <ol className="grid gap-4">
          {planSteps.map(({ number, title, status, pr }) => (
            <li
              key={number}
              className="grid gap-2 border-t-(length:--border-rule) border-scene-fg pt-4 md:grid-cols-6 md:gap-6"
            >
              <Text variant="eyebrow" className="text-scene-accent">
                Step {number}
              </Text>
              <Text className="md:col-span-4">
                <InlineText pieces={title} />
              </Text>
              <p className="flex flex-wrap items-center gap-3 md:justify-end">
                <Tag variant={status === 'Done' ? 'solid' : 'outline'}>{status}</Tag>
                {pr && (
                  <Link href={pr.href}>
                    <VisuallyHidden>Step {number}: pull request</VisuallyHidden> {pr.label}
                  </Link>
                )}
              </p>
            </li>
          ))}
        </ol>
      </WrappedSection>

      <WrappedSection id="decisions" scene="blush" title="Decisions">
        <Text className="max-w-prose">
          Significant technical decisions are recorded as architecture decision records (ADRs): the
          context, the options and the consequences.
        </Text>
        <ul className="grid gap-3">
          {adrs.map(({ number, title, href }) => (
            <li key={number} className="grid gap-1 border-t-(length:--border-rule) pt-3">
              <Text variant="eyebrow" className="text-scene-accent">
                ADR {number}
              </Text>
              <Text>
                <Link href={href}>
                  <InlineText pieces={title} links={false} />
                </Link>
              </Text>
            </li>
          ))}
        </ul>
      </WrappedSection>

      <WrappedSection id="quality" scene="ink" title="Quality gates">
        <Text className="max-w-prose">
          The same checks run whoever wrote the code. The main branch is protected: every change is
          a pull request that needs both CI checks to pass, history is linear and pull requests are
          squash-merged. Commit messages and pull request titles follow Conventional Commits,
          checked by commitlint.
        </Text>
        <table className="w-full max-w-3xl border-collapse text-left">
          <caption className="pb-2 text-left">
            <Text as="span">Gates from the plan, where they run and whether they are live.</Text>
          </caption>
          <thead>
            <tr className="border-b-(length:--border-rule) border-scene-fg">
              <th scope="col" className="py-2 pr-4">
                Gate
              </th>
              <th scope="col" className="py-2 pr-4">
                Where
              </th>
              <th scope="col" className="py-2">
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {qualityGates.map(({ gate, where, status }, index) => (
              <tr key={index} className="border-b-(length:--border-rule) border-scene-fg">
                <th scope="row" className="py-2 pr-4 align-top font-regular">
                  <InlineText pieces={gate} />
                </th>
                <td className="py-2 pr-4 align-top">{where}</td>
                <td className="py-2 align-top">{status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </WrappedSection>

      <WrappedSection id="accessibility" scene="pink" title="Accessibility">
        <Text className="max-w-prose">
          The target is WCAG 2.0 AA, treated as a requirement rather than polish.
        </Text>
        <FactList
          items={[
            'Semantic HTML first: landmarks, one h1 per page and a skip link.',
            'A visible focus ring in every scene, at least 3:1 against its background.',
            'Text and accent colours at least 4.5:1 in every scene, checked in CI.',
            'After a route change, focus moves to the new page’s heading.',
            'Meaningful alt text, text descriptions for videos, and no meaning carried by colour alone.',
            'Layouts reflow at 320px and 200% zoom. Prototype videos play only while on screen, can be paused, and stay still with reduced motion.',
            'Each pull request includes a keyboard-only and screen reader checklist.',
          ]}
        />
      </WrappedSection>

      <WrappedSection id="ai" scene="blush" title="How I use AI">
        <Text className="max-w-prose">
          I build the site with Claude Code as a pair programmer, with written rules, automated
          guardrails and my own review.
        </Text>
        <div className="grid gap-10 md:grid-cols-2">
          <div className="grid content-start gap-3">
            <Heading level={3}>Rules and guardrails</Heading>
            <FactList
              items={[
                <>
                  <Link href={repoFileUrl('CLAUDE.md')}>CLAUDE.md</Link> sets the rules the AI
                  follows: token-only styling, WCAG AA, tests for every component and the commit
                  style.
                </>,
                'Project settings pre-approve safe commands and deny force-pushes and direct pushes to main.',
                'Hooks run the linter after every AI edit of TypeScript, and rebuild and check the tokens after every token edit, so the AI fixes its own mistakes straight away.',
                'AI never merges. Every change goes through a pull request that CI must pass and I review.',
              ]}
            />
          </div>
          <div className="grid content-start gap-3">
            <Heading level={3}>Who does what</Heading>
            <FactList
              items={[
                'An orchestrating agent supervises one worker agent per plan step, and each worker delivers one pull request.',
                'Design decisions are mine. For example, I chose the colour theme and Inter from side-by-side prototypes the AI built.',
                'AI-assisted commits carry a Co-Authored-By trailer, and every pull request has an "AI assistance" section.',
                <>
                  <Link href={repoFileUrl('docs/ai-workflow.md')}>docs/ai-workflow.md</Link> logs
                  where AI helped and where I decided.
                </>,
              ]}
            />
          </div>
        </div>
      </WrappedSection>
    </>
  )
}
