// Reads the DTCG token files directly, so the Foundations stories document the source of truth
// rather than a copy of it. Style Dictionary is Node-only; this resolves `{a.b}` references itself.
import color from '../../../tokens/color.json'
import layout from '../../../tokens/layout.json'
import scene from '../../../tokens/scene.json'
import typography from '../../../tokens/typography.json'

export type TokenValue = string | number | readonly (string | number)[]

export interface Token {
  /** Dot path, e.g. `color.pink.700`. */
  name: string
  path: string[]
  /** Value as written, e.g. `{color.pink.700}`. */
  original: TokenValue
  /** Value with references resolved to the primitive it points at. */
  value: TokenValue
  description: string | undefined
}

type TokenTree = { [key: string]: unknown }

function isTree(node: unknown): node is TokenTree {
  return typeof node === 'object' && node !== null && !Array.isArray(node)
}

function flatten(node: TokenTree, path: string[]): Omit<Token, 'value'>[] {
  if ('$value' in node) {
    const description = node.$description
    return [
      {
        name: path.join('.'),
        path,
        original: node.$value as TokenValue,
        description: typeof description === 'string' ? description : undefined,
      },
    ]
  }
  return Object.entries(node).flatMap(([key, child]) =>
    key.startsWith('$') || !isTree(child) ? [] : flatten(child, [...path, key]),
  )
}

const raw = [color, layout, scene, typography].flatMap((file) => flatten(file, []))
const byName = new Map(raw.map((token) => [token.name, token]))

function resolve(value: TokenValue): TokenValue {
  const ref = typeof value === 'string' ? value.match(/^\{(.+)\}$/)?.[1] : undefined
  if (!ref) return value
  const target = byName.get(ref)
  if (!target) throw new Error(`Unknown token reference {${ref}}`)
  return resolve(target.original)
}

export const tokens: Token[] = raw.map((token) => ({ ...token, value: resolve(token.original) }))

/** Tokens under a path prefix, e.g. `tokensIn('color')` or `tokensIn('scene', 'pink')`. */
export function tokensIn(...prefix: string[]): Token[] {
  return tokens.filter((token) => prefix.every((part, i) => token.path[i] === part))
}

/** The last path segment, e.g. `700` for `color.pink.700`. */
export function leaf(token: Token): string {
  return token.path.at(-1) ?? token.name
}

/** Human-readable value: font stacks joined, cubic-bezier arrays as CSS. */
export function formatValue(token: Token): string {
  const { value } = token
  if (!Array.isArray(value)) return String(value)
  return token.path[0] === 'easing' ? `cubic-bezier(${value.join(', ')})` : value.join(', ')
}

/** The reference a token was defined with, e.g. `color.pink.700`, if it is an alias. */
export function referenceOf(token: Token): string | undefined {
  return typeof token.original === 'string' ? token.original.match(/^\{(.+)\}$/)?.[1] : undefined
}
