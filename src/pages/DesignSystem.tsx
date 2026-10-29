import { useDocumentTitle } from '../components/layout/useDocumentTitle'
import { WrappedSection } from '../components/sections/WrappedSection'
import type * as ui from '../components/ui'
import { Card } from '../components/ui/Card'
import { Heading } from '../components/ui/Heading'
import { Link } from '../components/ui/Link'
import { Tag } from '../components/ui/Tag'
import { Text } from '../components/ui/Text'
import { SCENES, TEXT_RECIPES, cx } from '../components/ui/styles'
import type { SceneName, TextStep } from '../components/ui/styles'
import { contrastResult, formatRatio, scenes } from '../design-system/scenes'
import { formatValue, leaf, tokensIn } from '../design-system/tokens'

const STORYBOOK_URL = `${import.meta.env.BASE_URL}storybook/`

/** Inline code-style token or class name. */
function Code({ children }: { children: string }) {
  return <code className="font-semibold break-all">{children}</code>
}

function SceneCard({ scene }: { scene: SceneName }) {
  const summary = scenes.find((s) => s.name === scene)
  if (!summary) throw new Error(`No tokens for scene "${scene}"`)
  const titleId = `scene-${scene}-title`
  return (
    <Card as="section" scene={scene} aria-labelledby={titleId}>
      <Heading level={3} id={titleId}>
        <Code>{`scene-${scene}`}</Code>
      </Heading>
      <p className={TEXT_RECIPES.h2}>
        Text and <span className="text-scene-accent">accent</span>
      </p>
      <Text variant="small">Background: {summary.bg.reference}</Text>
      <dl className="grid gap-3">
        {summary.roles.map((role) => (
          <div key={role.role} className="grid gap-1 border-t-(length:--border-rule) pt-3">
            <dt className="font-bold">
              <Code>{role.role}</Code> · {role.reference}
            </dt>
            <dd>
              <Text variant="small" as="span">
                {formatRatio(role.ratio)} · {contrastResult(role)}
              </Text>
            </dd>
          </div>
        ))}
      </dl>
    </Card>
  )
}

const TYPE_SAMPLES: Record<TextStep, string> = {
  stat: '40+',
  display: 'Career Wrapped',
  h1: 'Design system',
  h2: 'Scenes',
  h3: 'Type scale',
  body: 'Body text sits at a readable measure.',
  small: 'Captions and supporting text.',
  eyebrow: 'Foundations',
}

function isTextStep(step: string): step is TextStep {
  return step in TEXT_RECIPES
}

function TypeScale() {
  return (
    <ul className="grid gap-8">
      {tokensIn('text').map((token) => {
        const step = leaf(token)
        if (!isTextStep(step)) throw new Error(`No recipe for text token ${token.name}`)
        return (
          <li key={token.name} className="grid gap-2 border-t-(length:--border-rule) pt-4">
            <Text variant="small">
              <Code>{`text-${step}`}</Code> · {formatValue(token)}
            </Text>
            <p className={cx(TEXT_RECIPES[step], 'break-words')}>{TYPE_SAMPLES[step]}</p>
          </li>
        )
      })}
    </ul>
  )
}

/** A token group as a description list: utility or variable name, then value. */
function TokenList({ group, name }: { group: string; name: (step: string) => string }) {
  return (
    <dl className="grid gap-2">
      {tokensIn(group).map((token) => (
        <div key={token.name} className="flex flex-wrap gap-x-3">
          <dt>
            <Code>{name(leaf(token))}</Code>
          </dt>
          <dd>{formatValue(token)}</dd>
        </div>
      ))}
    </dl>
  )
}

type Primitive = Exclude<keyof typeof ui, 'TEXT_RECIPES'>

// Typed against the primitives' barrel file, so a new primitive fails typecheck until it is listed.
const PRIMITIVES: Record<Primitive, string> = {
  Button: 'A native button for the current scene: primary (filled) or secondary (outlined).',
  Card: 'A rounded container: outlined in the scene around it, or filled as its own scene.',
  Heading: 'Its level follows the document outline; its size follows the type scale.',
  Link: 'An inline link in the scene’s accent colour, always underlined, so it never relies on colour alone.',
  SkipLink: 'The first tab stop on every page; it jumps to the main content.',
  Tag: 'A non-interactive label, such as a project status.',
  Text: 'Running text in the body, small or eyebrow step.',
  VisuallyHidden: 'Text for screen readers only, such as extra context for a terse link.',
}

const spacingBase = tokensIn('spacing', 'base')[0]
const checkedPairs = scenes.flatMap((scene) => scene.roles).filter((role) => role.minimum)

/**
 * A public tour of the design system behind the site. Every value is read from tokens/*.json, and
 * the contrast ratios use the same maths as the CI gate.
 */
export function DesignSystem() {
  useDocumentTitle('Design system')
  return (
    <>
      <WrappedSection id="overview" scene="cobalt" level={1} title="Design system">
        <div className="grid max-w-prose gap-4">
          <p className={TEXT_RECIPES.h3}>
            Every colour, size and space on this site comes from one set of design tokens.
          </p>
          <Text>
            The tokens live in <Code>tokens/*.json</Code> (W3C design token format). Style
            Dictionary turns them into the Tailwind CSS theme, and Tailwind’s own palette, fonts and
            radii are switched off, so only token-backed utilities exist. The colours, ratios, type
            and spacing on this page are read from the same files.
          </Text>
          <Text>
            <Link href={STORYBOOK_URL}>Browse the components in Storybook</Link>
          </Text>
        </div>
      </WrappedSection>

      <WrappedSection id="scenes" scene="blush" title="Scenes">
        <Text className="max-w-prose">
          Each full-bleed section is a scene: a background with the text, accent, focus and
          decorative shape colours allowed on it. Components use role utilities such as{' '}
          <Code>text-scene-accent</Code>, never raw colours, so one component works in all four
          scenes. Ratios are each role’s contrast against the scene background.
        </Text>
        <div className="grid gap-6 md:grid-cols-2">
          {SCENES.map((scene) => (
            <SceneCard key={scene} scene={scene} />
          ))}
        </div>
      </WrappedSection>

      <WrappedSection id="type" scene="ink" title="Type">
        <Text className="max-w-prose">
          Inter only, self-hosted. Weight 900 with tight tracking for display text. Sizes are fluid
          and rem-based, so they scale with the viewport and stay readable at 200% zoom.
        </Text>
        <TypeScale />
      </WrappedSection>

      <WrappedSection id="layout" scene="blush" title="Spacing and shape">
        {spacingBase && (
          <Text className="max-w-prose">
            One base unit drives the whole spacing scale: <Code>--spacing</Code> is{' '}
            {formatValue(spacingBase)}, and every spacing utility is a multiple of it, so{' '}
            <Code>p-4</Code> is 4 × {formatValue(spacingBase)}.
          </Text>
        )}
        <div className="grid gap-10 sm:grid-cols-3">
          <div className="grid content-start gap-3">
            <Heading level={3}>Radius</Heading>
            <TokenList group="radius" name={(step) => `rounded-${step}`} />
          </div>
          <div className="grid content-start gap-3">
            <Heading level={3}>Border</Heading>
            <TokenList group="border" name={(step) => `--border-${step}`} />
          </div>
          <div className="grid content-start gap-3">
            <Heading level={3}>Breakpoints</Heading>
            <TokenList group="breakpoint" name={(step) => `${step}:`} />
          </div>
        </div>
      </WrappedSection>

      <WrappedSection id="components" scene="pink" title="Components">
        <Text className="max-w-prose">
          Small, typed, presentational primitives. Each one ships with a Storybook story, a unit
          test and an automated accessibility (axe) test.
        </Text>
        <ul className="grid gap-6 md:grid-cols-2">
          {Object.entries(PRIMITIVES).map(([name, description]) => (
            <li
              key={name}
              className="grid content-start gap-1 border-t-(length:--border-rule) pt-4"
            >
              <Heading level={3}>
                <Code>{name}</Code>
              </Heading>
              <Text>{description}</Text>
            </li>
          ))}
        </ul>
        <div className="grid gap-2">
          <Text variant="eyebrow">Tags, as used for project status</Text>
          <ul className="flex flex-wrap gap-2">
            <li>
              <Tag variant="solid">Shipped</Tag>
            </li>
            <li>
              <Tag>Concept</Tag>
            </li>
          </ul>
        </div>
      </WrappedSection>

      <WrappedSection id="quality" scene="ink" title="Quality gates">
        <ul className="grid max-w-prose list-disc gap-3 pl-5">
          <li>
            <Text as="span">
              <span className="font-bold">Contrast:</span> CI checks {checkedPairs.length} scene
              colour pairs against WCAG AA: at least 4.5:1 for text and accent, 3:1 for the focus
              ring. A failing pair fails the build.
            </Text>
          </li>
          <li>
            <Text as="span">
              <span className="font-bold">Token-only styling:</span> a script fails CI on hex
              colours or Tailwind arbitrary values in the source. A new value needs a token first.
            </Text>
          </li>
          <li>
            <Text as="span">
              <span className="font-bold">Accessibility tests:</span> every story and route is
              rendered and checked with axe in the unit tests, and the Storybook accessibility panel
              fails on violations.
            </Text>
          </li>
        </ul>
        <Text>
          <Link href={STORYBOOK_URL}>Open the Storybook</Link>
        </Text>
      </WrappedSection>
    </>
  )
}
