// WCAG 2.x contrast maths, shared by the CI contrast gate and the Storybook colour docs.
// Pure functions only (no Node APIs), so it also runs in the browser.

/** Minimum contrast per scene role against the scene background. `shape` is decorative and unchecked. */
export const MINIMUMS: Record<string, number> = { fg: 4.5, accent: 4.5, display: 4.5, focus: 3 }

export function luminance(hex: string): number {
  const channels = hex
    .replace('#', '')
    .slice(0, 6)
    .match(/../g)
    ?.map((c) => parseInt(c, 16) / 255)
  if (channels?.length !== 3) throw new Error(`Not a hex colour: ${hex}`)
  const [r, g, b] = channels.map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4))
  return 0.2126 * r! + 0.7152 * g! + 0.0722 * b!
}

export function contrast(a: string, b: string): number {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x)
  return (hi! + 0.05) / (lo! + 0.05)
}
