// Enforces "design tokens only" in source files (oxlint has no Tailwind plugin to do this).
//   - no hex colours outside the generated token file
//   - no Tailwind arbitrary values like `mt-[13px]` or `text-[#123]`
// Token references via Tailwind's variable shorthand, e.g. `border-(--border-rule)`, are allowed.
import { readFile } from 'node:fs/promises'
import { glob } from 'node:fs/promises'

const GENERATED = 'src/styles/tokens.css'
const RULES = [
  { name: 'hex colour', pattern: /#[0-9a-fA-F]{3,8}\b/g },
  { name: 'Tailwind arbitrary value', pattern: /\b[\w-]+-\[[^\]\s]+\]/g },
]

let violations = 0
for await (const file of glob(['src/**/*.{ts,tsx,css}', '.storybook/**/*.{ts,tsx,css}'])) {
  if (file === GENERATED) continue
  const lines = (await readFile(file, 'utf8')).split('\n')
  lines.forEach((line, i) => {
    for (const { name, pattern } of RULES) {
      for (const match of line.matchAll(pattern)) {
        violations++
        console.error(`${file}:${i + 1}  ${name} "${match[0]}". Use a design token instead.`)
      }
    }
  })
}

if (violations > 0) {
  console.error(`\n${violations} off-system value(s). Add or reuse a token in tokens/*.json.`)
  process.exit(1)
}
console.log('Token usage check passed: no hex colours or arbitrary values in src/ or .storybook/.')
