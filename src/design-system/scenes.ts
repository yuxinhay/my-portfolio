// Scene roles and their contrast against the scene background, derived from tokens/scene.json with
// the same maths as the CI contrast gate, so the ratios shown are the ones CI enforces.
import { contrast, MINIMUMS } from '../../scripts/contrast.ts'
import { formatValue, leaf, referenceOf, tokensIn } from './tokens'

export interface SceneRole {
  /** Role name: `fg`, `accent`, `focus` or `shape`. */
  role: string
  /** The primitive the role points at, e.g. `color.pink.700`. */
  reference: string | undefined
  /** Resolved hex value. */
  value: string
  /** Contrast against the scene background, e.g. 4.74 for 4.74:1. */
  ratio: number
  /** The WCAG minimum for the role, or `undefined` for decorative roles that are not checked. */
  minimum: number | undefined
}

export interface SceneSummary {
  name: string
  bg: { reference: string | undefined; value: string }
  /** Every role except `bg`, in token order. */
  roles: SceneRole[]
}

/** Scene names in token order. */
export const sceneNames: string[] = [...new Set(tokensIn('scene').map((t) => t.path[1] ?? ''))]

function summarise(name: string): SceneSummary {
  const tokens = tokensIn('scene', name)
  const bg = tokens.find((token) => leaf(token) === 'bg')
  if (!bg) throw new Error(`Scene "${name}" has no bg token`)
  const bgValue = formatValue(bg)
  return {
    name,
    bg: { reference: referenceOf(bg), value: bgValue },
    roles: tokens
      .filter((token) => token !== bg)
      .map((token) => ({
        role: leaf(token),
        reference: referenceOf(token),
        value: formatValue(token),
        ratio: contrast(formatValue(token), bgValue),
        minimum: MINIMUMS[leaf(token)],
      })),
  }
}

export const scenes: SceneSummary[] = sceneNames.map(summarise)

/** "Pass (min 4.5:1)", "Fail (min 3:1)" or "Decorative, not checked". */
export function contrastResult({ ratio, minimum }: SceneRole): string {
  if (minimum === undefined) return 'Decorative, not checked'
  return `${ratio >= minimum ? 'Pass' : 'Fail'} (min ${minimum}:1)`
}

/** A ratio as WCAG writes it, e.g. "4.74:1". */
export function formatRatio(ratio: number): string {
  return `${ratio.toFixed(2)}:1`
}
