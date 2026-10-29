import type { Meta, StoryObj } from '@storybook/react-vite'
import { TEXT_RECIPES } from '../../components/ui/styles'
import type { TextStep } from '../../components/ui/styles'
import { FoundationPage, FoundationSection, TokenName } from './FoundationPage'
import { formatValue, leaf, tokensIn } from './tokens'

const SAMPLES: Record<TextStep, string> = {
  stat: '12',
  display: 'Career Wrapped',
  h1: 'UX designer & UI developer',
  h2: 'Your top skills',
  h3: 'Interaction design',
  body: 'Shipped a design system used by four product teams.',
  small: 'Built with React, TypeScript and design tokens.',
  eyebrow: 'Your career path',
}

function isTextStep(step: string): step is TextStep {
  return step in TEXT_RECIPES
}

function TypeScaleList() {
  return (
    <ul className="grid gap-8">
      {tokensIn('text').map((token) => {
        const step = leaf(token)
        if (!isTextStep(step)) throw new Error(`No recipe for text token ${token.name}`)
        return (
          <li
            key={token.name}
            className="grid gap-2 border-b-(length:--border-rule) border-scene-fg pb-6"
          >
            <p className="text-small">
              <TokenName>{TEXT_RECIPES[step]}</TokenName> · {formatValue(token)}
              {token.description && ` · ${token.description}`}
            </p>
            <p className={`${TEXT_RECIPES[step]} break-words`}>{SAMPLES[step]}</p>
          </li>
        )
      })}
    </ul>
  )
}

/** Smaller token groups (weight, leading, tracking) shown as a table with a live sample. */
interface TokenTableProps {
  group: string[]
  cssPrefix: string
  property: 'fontWeight' | 'lineHeight' | 'letterSpacing'
}

function TokenTable({ group, cssPrefix, property }: TokenTableProps) {
  return (
    <table className="w-full border-collapse text-left text-small">
      <thead>
        <tr className="border-b-(length:--border-rule) border-scene-fg">
          <th scope="col" className="py-2 pr-4">
            Token
          </th>
          <th scope="col" className="py-2 pr-4">
            Value
          </th>
          <th scope="col" className="py-2">
            Sample
          </th>
        </tr>
      </thead>
      <tbody>
        {tokensIn(...group).map((token) => {
          const cssVar = `--${cssPrefix}-${leaf(token)}`
          return (
            <tr key={token.name} className="border-b-(length:--border-rule) border-scene-fg">
              <th scope="row" className="py-2 pr-4 font-regular">
                <TokenName>{cssVar}</TokenName>
              </th>
              <td className="py-2 pr-4">{formatValue(token)}</td>
              <td className="py-2 text-body">
                {/* Table cells ignore max-width, so the narrow measure lives on the paragraph. */}
                <p className="max-w-3xs" style={{ [property]: `var(${cssVar})` }}>
                  {property === 'lineHeight'
                    ? 'Two lines of sample text to show the line height between them.'
                    : 'Career Wrapped'}
                </p>
              </td>
            </tr>
          )
        })}
      </tbody>
    </table>
  )
}

const meta = {
  title: 'Foundations/Typography',
  parameters: { layout: 'fullscreen' },
} satisfies Meta

export default meta

export const TypeScale: StoryObj<typeof meta> = {
  render: () => (
    <FoundationPage
      title="Typography"
      intro={
        <p>
          Inter only ({formatValue(tokensIn('font', 'family', 'sans')[0]!)}). Sizes are fluid and
          rem-based, so they scale with the viewport and stay readable at 200% zoom.
        </p>
      }
    >
      <FoundationSection title="Type scale">
        <TypeScaleList />
      </FoundationSection>
      <FoundationSection title="Weight">
        <TokenTable group={['font', 'weight']} cssPrefix="font-weight" property="fontWeight" />
      </FoundationSection>
      <FoundationSection title="Leading">
        <TokenTable group={['leading']} cssPrefix="leading" property="lineHeight" />
      </FoundationSection>
      <FoundationSection title="Tracking">
        <TokenTable group={['tracking']} cssPrefix="tracking" property="letterSpacing" />
      </FoundationSection>
    </FoundationPage>
  ),
}
