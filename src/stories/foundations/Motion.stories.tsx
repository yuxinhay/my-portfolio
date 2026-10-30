import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { FoundationPage, FoundationSection, TokenName } from './FoundationPage'
import { StatValue } from '../../components/motion/StatValue'
import { useReducedMotion } from '../../components/motion/useReducedMotion'
import { Button } from '../../components/ui/Button'
import { TEXT_RECIPES, cx } from '../../components/ui/styles'
import { formatValue, leaf, tokensIn } from '../../design-system/tokens'

const easing = tokensIn('easing').find((token) => leaf(token) === 'out')
const scrim = tokensIn('color', 'scrim')[0]

function MotionDemo() {
  const [moved, setMoved] = useState(false)
  const reduced = useReducedMotion()

  return (
    <div className="grid gap-6">
      <p className="max-w-prose text-body">
        {reduced
          ? 'Your system asks for reduced motion, so the boxes jump to their new position without animating.'
          : 'Each box moves with its duration token and the shared easing. With reduced motion turned on in your system settings, they jump instead.'}
      </p>
      <button
        type="button"
        aria-pressed={moved}
        onClick={() => setMoved((value) => !value)}
        className="w-fit cursor-pointer rounded-pill bg-scene-fg px-6 py-3 font-bold text-scene"
      >
        Move boxes
      </button>
      <ul className="grid gap-4">
        {tokensIn('duration').map((token) => (
          <li key={token.name} className="grid gap-2 text-small">
            <p>
              <TokenName>--duration-{leaf(token)}</TokenName> · {formatValue(token)}
            </p>
            <div
              aria-hidden="true"
              className="size-8 rounded-sm bg-scene-accent"
              style={{
                transform: moved ? 'translateX(calc(var(--spacing) * 40))' : 'none',
                transitionProperty: 'transform',
                transitionDuration: `var(--duration-${leaf(token)})`,
                ...(easing && { transitionTimingFunction: `var(--ease-${leaf(easing)})` }),
              }}
            />
          </li>
        ))}
      </ul>
    </div>
  )
}

/** Replays a count-up (`duration.count`) on demand; reduced motion shows the final value. */
function CountDemo() {
  const [run, setRun] = useState(0)
  return (
    <div className="grid justify-items-start gap-4">
      <p className="scene-cobalt rounded-card px-6 py-4">
        <StatValue
          key={run}
          value="$7,000+"
          active
          className={cx(TEXT_RECIPES.display, 'text-scene-accent')}
        />
      </p>
      <Button variant="secondary" onClick={() => setRun((value) => value + 1)}>
        Count again
      </Button>
    </div>
  )
}

/** Replays the At a glance entrance: a card pops out with `--ease-overshoot`. */
function PopDemo() {
  const [run, setRun] = useState(0)
  return (
    <div className="grid justify-items-start gap-4">
      <p className="max-w-prose text-body">
        The At a glance card grows from 60% to full size over <TokenName>--duration-slow</TokenName>
        , slightly past it and back. Under reduced motion it simply appears.
      </p>
      <div
        key={run}
        aria-hidden="true"
        className="scene-pink size-24 rounded-card bg-scene motion-safe:animate-glance-pop"
      />
      <Button variant="secondary" onClick={() => setRun((value) => value + 1)}>
        Pop again
      </Button>
    </div>
  )
}

/** The blur and scrim behind a modal dialog, over a sample of the page. */
function BackdropDemo() {
  return (
    <div className="relative grid overflow-hidden rounded-card">
      <p aria-hidden="true" className="scene-pink p-6 text-display leading-tight font-black">
        Page behind
      </p>
      <div className="absolute inset-0 bg-scrim backdrop-blur-overlay" />
    </div>
  )
}

const meta = {
  title: 'Foundations/Motion',
  parameters: { layout: 'fullscreen' },
} satisfies Meta

export default meta

export const Motion: StoryObj<typeof meta> = {
  render: () => (
    <FoundationPage
      title="Motion"
      intro={
        <p>
          Motion is optional: under <TokenName>prefers-reduced-motion: reduce</TokenName> the base
          styles cut every transition and animation to an instant change, and nothing auto-plays. On
          the site, sections fade up as they scroll in (each sibling{' '}
          <TokenName>--duration-stagger</TokenName> later), numbers count up over{' '}
          <TokenName>--duration-count</TokenName>, buttons and cards lift on hover and focus, and
          pages crossfade over <TokenName>--duration-base</TokenName> (ADR 0008).
        </p>
      }
    >
      <FoundationSection title="Easing">
        <ul className="grid gap-1 text-small">
          {tokensIn('easing').map((token) => (
            <li key={token.name}>
              <TokenName>--ease-{leaf(token)}</TokenName> · {formatValue(token)}
            </li>
          ))}
        </ul>
      </FoundationSection>
      <FoundationSection title="Duration">
        <MotionDemo />
      </FoundationSection>
      <FoundationSection title="Pop">
        <PopDemo />
      </FoundationSection>
      <FoundationSection title="Count-up">
        <CountDemo />
      </FoundationSection>
      <FoundationSection title="Lift">
        <p className="max-w-prose text-body">
          Hover or Tab to a button: it rises with a hard shadow in the scene’s text colour, and
          presses down when clicked. Under a button filled in that colour the shadow is hollow (the
          scene background, edged in the text colour), so it never reads as the button growing.
          Under reduced motion the shadow appears without the movement.
        </p>
        <div className="flex flex-wrap gap-4">
          <Button>Lift me</Button>
          <Button variant="secondary">Lift me</Button>
          <Button variant="ghost">Lift me</Button>
        </div>
      </FoundationSection>
      <FoundationSection title="Backdrop">
        <ul className="grid gap-1 text-small">
          {tokensIn('blur').map((token) => (
            <li key={token.name}>
              <TokenName>--blur-{leaf(token)}</TokenName> · {formatValue(token)}
            </li>
          ))}
          {scrim && (
            <li>
              <TokenName>--color-scrim</TokenName> · {formatValue(scrim)}
            </li>
          )}
        </ul>
        <BackdropDemo />
      </FoundationSection>
    </FoundationPage>
  ),
}
