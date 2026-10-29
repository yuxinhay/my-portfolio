import { describe, expect, it } from 'vitest'
import { SCENES } from '../components/ui/styles'
import { contrastResult, formatRatio, sceneNames, scenes } from './scenes'
import { formatValue, tokensIn } from './tokens'

const valueOf = (...path: string[]) => formatValue(tokensIn(...path)[0]!)

describe('scenes', () => {
  it('summarises every scene in the tokens, matching the typed scene list', () => {
    expect(sceneNames).toEqual([...SCENES])
    expect(scenes.map((scene) => scene.name)).toEqual(sceneNames)
  })

  it('resolves each role to its primitive and computes its contrast', () => {
    const blush = scenes.find((scene) => scene.name === 'blush')
    expect(blush?.bg).toEqual({ reference: 'color.blush', value: valueOf('color', 'blush') })
    expect(blush?.roles.map((role) => role.role)).toEqual([
      'fg',
      'accent',
      'focus',
      'shape',
      'surface',
    ])
    const accent = blush?.roles.find((role) => role.role === 'accent')
    expect(accent).toMatchObject({
      reference: 'color.pink.700',
      value: valueOf('color', 'pink', '700'),
      minimum: 4.5,
    })
    expect(accent?.ratio).toBeCloseTo(5.58, 2)
  })

  it('checks text and focus roles, and leaves shape and surface unchecked against bg', () => {
    for (const { roles } of scenes) {
      for (const role of roles) {
        if (role.role === 'shape' || role.role === 'surface') expect(role.minimum).toBeUndefined()
        else expect(role.ratio).toBeGreaterThanOrEqual(role.minimum ?? Infinity)
      }
    }
  })

  it('formats ratios and results', () => {
    expect(formatRatio(4.738)).toBe('4.74:1')
    const role = { role: 'fg', reference: undefined, value: '' }
    expect(contrastResult({ ...role, ratio: 5, minimum: 4.5 })).toBe('Pass (min 4.5:1)')
    expect(contrastResult({ ...role, ratio: 2, minimum: 3 })).toBe('Fail (min 3:1)')
    expect(contrastResult({ ...role, ratio: 1.2, minimum: undefined })).toBe(
      'Decorative, not checked',
    )
    expect(contrastResult({ ...role, role: 'surface', ratio: 1.1, minimum: undefined })).toBe(
      'Panel fill: text on it is checked',
    )
  })
})
