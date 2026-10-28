// Shared token loader: resolves tokens/*.json (DTCG) with Style Dictionary.
import StyleDictionary from 'style-dictionary'
import type { TransformedToken } from 'style-dictionary/types'

export const TOKEN_SOURCE = ['tokens/**/*.json']

export function createDictionary(): StyleDictionary {
  return new StyleDictionary({
    source: TOKEN_SOURCE,
    usesDtcg: true,
    log: { verbosity: 'silent' },
    platforms: {
      css: {
        transforms: ['name/kebab', 'color/hex', 'fontFamily/css', 'cubicBezier/css'],
      },
    },
  })
}

export async function loadTokens(): Promise<TransformedToken[]> {
  const { allTokens } = await createDictionary().getPlatformTokens('css')
  return allTokens
}

/** Token value after transforms. DTCG tokens keep it in `$value`. */
export function valueOf(token: TransformedToken): string {
  return String(token.$value ?? token.value)
}
