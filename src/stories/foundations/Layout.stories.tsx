import type { Meta, StoryObj } from '@storybook/react-vite'
import { FoundationPage, FoundationSection, TokenName } from './FoundationPage'
import { formatValue, leaf, tokensIn } from './tokens'

const spacingBase = tokensIn('spacing', 'base')[0]
if (!spacingBase) throw new Error('Missing spacing.base token')
const [, baseAmount = '0', baseUnit = ''] = formatValue(spacingBase).match(/^([\d.]+)(\D+)$/) ?? []

// Sample of Tailwind's spacing multipliers; every step is `n × spacing.base`.
const SPACING_STEPS = [1, 2, 3, 4, 6, 8, 12, 16, 24]

function Spacing() {
  return (
    <ul className="grid gap-3">
      {SPACING_STEPS.map((step) => (
        <li key={step} className="grid grid-cols-3 items-center gap-4 text-small sm:grid-cols-4">
          <TokenName>p-{step}</TokenName>
          <span>
            {Number(baseAmount) * step}
            {baseUnit}
          </span>
          <div
            aria-hidden="true"
            className="h-4 bg-scene-fg sm:col-span-2"
            style={{ inlineSize: `calc(var(--spacing) * ${step})` }}
          />
        </li>
      ))}
    </ul>
  )
}

function Radius() {
  return (
    <ul className="flex flex-wrap gap-6">
      {tokensIn('radius').map((token) => (
        <li key={token.name} className="grid justify-items-start gap-2 text-small">
          <div
            aria-hidden="true"
            className="size-24 bg-scene-fg"
            style={{ borderRadius: `var(--radius-${leaf(token)})` }}
          />
          <TokenName>rounded-{leaf(token)}</TokenName>
          <span>{formatValue(token)}</span>
        </li>
      ))}
    </ul>
  )
}

function Border() {
  return (
    <ul className="grid gap-6">
      {tokensIn('border').map((token) => (
        <li key={token.name} className="grid gap-2 text-small">
          {/* Preflight makes every border solid with zero width; the token sets the width. */}
          <div
            aria-hidden="true"
            className="border-scene-fg"
            style={{ borderBlockStartWidth: `var(--border-${leaf(token)})` }}
          />
          <p>
            <TokenName>--border-{leaf(token)}</TokenName> · {formatValue(token)}
            {token.description && ` · ${token.description}`}
          </p>
        </li>
      ))}
    </ul>
  )
}

function Breakpoints() {
  return (
    <dl className="grid grid-cols-2 gap-x-4 gap-y-1 text-small sm:w-fit">
      {tokensIn('breakpoint').map((token) => (
        <div key={token.name} className="contents">
          <dt>
            <TokenName>{leaf(token)}:</TokenName>
          </dt>
          <dd>min-width {formatValue(token)}</dd>
        </div>
      ))}
    </dl>
  )
}

const meta = {
  title: 'Foundations/Layout',
  parameters: { layout: 'fullscreen' },
} satisfies Meta

export default meta

export const Layout: StoryObj<typeof meta> = {
  render: () => (
    <FoundationPage
      title="Spacing and shape"
      intro={
        <p>
          One spacing base drives Tailwind’s whole spacing scale: <TokenName>--spacing</TokenName> ={' '}
          {formatValue(spacingBase)}, so{' '}
          <span className="whitespace-nowrap">
            <TokenName>p-4</TokenName>
          </span>{' '}
          is 4 × that.
        </p>
      }
    >
      <FoundationSection title="Spacing">
        <Spacing />
      </FoundationSection>
      <FoundationSection title="Radius">
        <Radius />
      </FoundationSection>
      <FoundationSection title="Border">
        <Border />
      </FoundationSection>
      <FoundationSection title="Breakpoints">
        <Breakpoints />
      </FoundationSection>
    </FoundationPage>
  ),
}
