import type { Meta, StoryObj } from '@storybook/react-vite'
import { contrast, MINIMUMS } from '../../../scripts/contrast.ts'
import { FoundationPage, FoundationSection, TokenName } from './FoundationPage'
import { formatValue, leaf, referenceOf, tokensIn } from './tokens'

const sceneTokens = tokensIn('scene')
const sceneNames = [...new Set(sceneTokens.map((token) => token.path[1] ?? ''))]

/** Primitives that scenes only ever use as `shape`: decorative, never text. */
const decorativeOnly = new Set(
  tokensIn('color')
    .map((token) => token.name)
    .filter((name) => {
      const roles = sceneTokens.filter((t) => referenceOf(t) === name).map(leaf)
      return roles.length > 0 && roles.every((role) => role === 'shape')
    }),
)

function Primitives() {
  return (
    <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {tokensIn('color').map((token) => {
        const cssVar = `--color-${token.path.slice(1).join('-')}`
        return (
          <li key={token.name} className="flex gap-4">
            <div
              aria-hidden="true"
              className="size-16 shrink-0 rounded-sm border-(length:--border-rule) border-scene-fg"
              style={{ backgroundColor: `var(${cssVar})` }}
            />
            <div className="min-w-0 text-small break-words">
              <p className="text-body font-bold">{token.name}</p>
              <p>
                {formatValue(token)} · <TokenName>{cssVar}</TokenName>
              </p>
              {decorativeOnly.has(token.name) && (
                <p className="font-bold">Scenes use it only as a decorative shape: never text</p>
              )}
              {token.description && <p>{token.description}</p>}
            </div>
          </li>
        )
      })}
    </ul>
  )
}

/** The role rendered inside its real scene: text for text roles, a ring for focus, a dot for shape. */
function RoleSample({ scene, role }: { scene: string; role: string }) {
  return (
    <span className={`scene-${scene} inline-flex rounded-sm px-2 py-1 font-black`}>
      {role === 'focus' ? (
        <span
          aria-hidden="true"
          className="inline-block size-4 rounded-sm outline-(length:--border-focus) outline-scene-focus outline-solid"
        />
      ) : role === 'shape' ? (
        <span aria-hidden="true" className="inline-block size-4 rounded-pill bg-scene-shape" />
      ) : (
        <span style={{ color: `var(--scene-${role})` }}>Aa</span>
      )}
    </span>
  )
}

// One row group per scene and the colour reference under the role, so the table reflows at
// 320px instead of needing a horizontal scroll area.
function RolePairs() {
  return (
    <table className="w-full border-collapse text-left text-small">
      <caption className="pb-2 text-left text-body">
        Contrast of each scene role against the scene background (WCAG 2.0 AA). Computed from the
        tokens with the same maths as the CI contrast gate.
      </caption>
      <thead>
        <tr className="border-b-(length:--border-rule) border-scene-fg">
          <th scope="col" className="py-2 pr-4">
            Role
          </th>
          <th scope="col" className="py-2 pr-4">
            Ratio
          </th>
          <th scope="col" className="py-2">
            Result
          </th>
        </tr>
      </thead>
      {sceneNames.map((scene) => {
        const roles = tokensIn('scene', scene)
        const bg = roles.find((token) => leaf(token) === 'bg')
        if (!bg) throw new Error(`Scene "${scene}" has no bg token`)
        return (
          <tbody key={scene}>
            <tr>
              <th scope="rowgroup" colSpan={3} className="pt-6 pb-2 text-body">
                scene-{scene} <span className="font-regular">(bg {referenceOf(bg)})</span>
              </th>
            </tr>
            {roles
              .filter((token) => token !== bg)
              .map((token) => {
                const role = leaf(token)
                const min = MINIMUMS[role]
                const ratio = contrast(formatValue(token), formatValue(bg))
                const result =
                  min === undefined
                    ? 'Decorative, not checked'
                    : `${ratio >= min ? 'Pass' : 'Fail'} (min ${min}:1)`
                return (
                  <tr key={token.name} className="border-b-(length:--border-rule) border-scene-fg">
                    <th scope="row" className="py-2 pr-4 align-top font-regular">
                      <div className="flex flex-wrap items-center gap-2">
                        <RoleSample scene={scene} role={role} />
                        <TokenName>{role}</TokenName>
                      </div>
                      <div className="mt-1 break-all">{referenceOf(token)}</div>
                    </th>
                    <td className="py-2 pr-4 align-top">{ratio.toFixed(2)}:1</td>
                    <td className="py-2 align-top font-bold">{result}</td>
                  </tr>
                )
              })}
          </tbody>
        )
      })}
    </table>
  )
}

const meta = {
  title: 'Foundations/Colour',
  parameters: { layout: 'fullscreen' },
} satisfies Meta

export default meta

export const Colour: StoryObj<typeof meta> = {
  render: () => (
    <FoundationPage
      title="Colour"
      intro={
        <p>
          Theme “Bubblegum Bold”. Components never use primitives directly: they use scene roles
          (see Scenes). Primitives are listed here for reference.
        </p>
      }
    >
      <FoundationSection title="Primitives">
        <Primitives />
      </FoundationSection>
      <FoundationSection title="Scene role contrast">
        <RolePairs />
      </FoundationSection>
    </FoundationPage>
  ),
}
