import type { Meta, StoryObj } from '@storybook/react-vite'
import { FoundationPage, TokenName } from './FoundationPage'
import { formatValue, leaf, referenceOf, tokensIn } from '../../design-system/tokens'

const SCENES = [...new Set(tokensIn('scene').map((token) => token.path[1] ?? ''))]

function SceneCard({ name }: { name: string }) {
  return (
    <section
      aria-labelledby={`scene-${name}-title`}
      className={`scene-${name} relative grid gap-4 overflow-hidden rounded-card p-6`}
    >
      {/* Decorative shape: scene-shape is never used for text. */}
      <div
        aria-hidden="true"
        className="absolute -top-6 -right-6 size-24 rounded-pill bg-scene-shape"
      />
      <h2
        id={`scene-${name}-title`}
        className="relative text-eyebrow font-bold tracking-eyebrow uppercase"
      >
        <TokenName>scene-{name}</TokenName>
      </h2>
      <p className="relative text-h2 leading-snug font-black tracking-heading">
        Your top skill: <span className="text-scene-accent">interaction design</span>
      </p>
      <p className="relative max-w-prose text-body">
        Body text uses <TokenName>text-scene-fg</TokenName>; highlights use{' '}
        <span className="font-bold text-scene-accent">text-scene-accent</span>.
      </p>
      <p className="relative w-fit rounded-sm px-2 py-1 outline-(length:--border-focus) outline-offset-(length:--border-focus) outline-scene-focus outline-solid">
        Focus ring sample (<TokenName>outline-scene-focus</TokenName>)
      </p>
      <dl className="relative grid grid-cols-2 gap-x-4 gap-y-1 text-small sm:grid-cols-5">
        {tokensIn('scene', name).map((token) => (
          <div key={token.name}>
            <dt className="font-bold">{leaf(token)}</dt>
            <dd>
              {referenceOf(token)} · {formatValue(token)}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  )
}

const meta = {
  title: 'Foundations/Scenes',
  parameters: { layout: 'fullscreen' },
} satisfies Meta

export default meta

export const Scenes: StoryObj<typeof meta> = {
  render: () => (
    <FoundationPage
      title="Scenes"
      intro={
        <p>
          Each Wrapped-style section is a scene: a surface plus the text, accent, focus and shape
          colours allowed on it. Wrap a section in a <TokenName>scene-*</TokenName> class and style
          children with role utilities, never primitive colours.
        </p>
      }
    >
      <div className="grid gap-6 lg:grid-cols-2">
        {SCENES.map((name) => (
          <SceneCard key={name} name={name} />
        ))}
      </div>
    </FoundationPage>
  ),
}
