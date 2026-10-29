import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState, useSyncExternalStore } from 'react'
import { FoundationPage, FoundationSection, TokenName } from './FoundationPage'
import { formatValue, leaf, tokensIn } from '../../design-system/tokens'

const REDUCED_MOTION = '(prefers-reduced-motion: reduce)'

function usePrefersReducedMotion(): boolean {
  return useSyncExternalStore(
    (onChange) => {
      const query = window.matchMedia(REDUCED_MOTION)
      query.addEventListener('change', onChange)
      return () => query.removeEventListener('change', onChange)
    },
    () => window.matchMedia(REDUCED_MOTION).matches,
  )
}

const easing = tokensIn('easing')[0]

function MotionDemo() {
  const [moved, setMoved] = useState(false)
  const reduced = usePrefersReducedMotion()

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
          styles cut every transition and animation to an instant change, and nothing auto-plays.
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
    </FoundationPage>
  ),
}
