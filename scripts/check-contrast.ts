// Fails if any scene's text or focus colour falls below WCAG AA contrast against its background.
//   fg, accent → 4.5:1 (WCAG 1.4.3, normal-size text)
//   focus      → 3:1   (focus indicator must stand out from its surface)
// `shape` is decorative and never carries text, so it is not checked.
import { loadTokens, valueOf } from './tokens.ts'

const MINIMUMS: Record<string, number> = { fg: 4.5, accent: 4.5, focus: 3 }

function luminance(hex: string): number {
  const channels = hex
    .replace('#', '')
    .slice(0, 6)
    .match(/../g)
    ?.map((c) => parseInt(c, 16) / 255)
  if (channels?.length !== 3) throw new Error(`Not a hex colour: ${hex}`)
  const [r, g, b] = channels.map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4))
  return 0.2126 * r! + 0.7152 * g! + 0.0722 * b!
}

function contrast(a: string, b: string): number {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x)
  return (hi! + 0.05) / (lo! + 0.05)
}

const scenes = Map.groupBy(
  (await loadTokens()).filter((t) => t.path[0] === 'scene'),
  (t) => t.path[1] ?? '',
)

let failures = 0
for (const [scene, tokens] of scenes) {
  const role = (name: string) => tokens.find((t) => t.path[2] === name)
  const bg = role('bg')
  if (!bg) throw new Error(`Scene "${scene}" has no bg token`)

  for (const [name, min] of Object.entries(MINIMUMS)) {
    const fg = role(name)
    if (!fg) throw new Error(`Scene "${scene}" has no ${name} token`)
    const ratio = contrast(valueOf(fg), valueOf(bg))
    const ok = ratio >= min
    if (!ok) failures++
    console.log(
      `${ok ? 'PASS' : 'FAIL'}  ${`${scene}.${name}`.padEnd(14)} ${valueOf(fg)} on ${valueOf(bg)}  ${ratio.toFixed(2)}:1 (min ${min}:1)`,
    )
  }
}

if (failures > 0) {
  console.error(`\n${failures} contrast pair(s) below WCAG AA.`)
  process.exit(1)
}
console.log('\nAll scene colour pairs meet WCAG AA.')
