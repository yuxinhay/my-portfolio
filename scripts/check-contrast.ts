// Fails if any scene's text or focus colour falls below WCAG AA contrast against its background.
//   fg, accent → 4.5:1 (WCAG 1.4.3, normal-size text)
//   focus      → 3:1   (focus indicator must stand out from its surface)
// `shape` is decorative and never carries text, so it is not checked.
import { contrast, MINIMUMS } from './contrast.ts'
import { loadTokens, valueOf } from './tokens.ts'

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
