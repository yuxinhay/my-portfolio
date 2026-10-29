// A minimal reader for the repo's own Markdown docs: table rows under a heading, and inline code,
// links and bold. Enough for docs/plan.md and docs/adr/*.md; not a general Markdown parser.

/** One piece of inline text. Bold markers are dropped; the page applies its own emphasis. */
export type Inline =
  | { kind: 'text'; text: string }
  | { kind: 'code'; text: string }
  | { kind: 'link'; text: string; href: string }

const INLINE = /`([^`]+)`|\[([^\]]+)\]\(([^)\s]+)\)/g

/** Splits a Markdown string into text, `code` and [link](href) pieces. */
export function parseInline(markdown: string): Inline[] {
  const source = markdown.replaceAll('**', '')
  const pieces: Inline[] = []
  let last = 0
  for (const match of source.matchAll(INLINE)) {
    if (match.index > last) pieces.push({ kind: 'text', text: source.slice(last, match.index) })
    const [, code, label, href] = match
    if (code !== undefined) pieces.push({ kind: 'code', text: code })
    else if (label !== undefined && href !== undefined)
      pieces.push({ kind: 'link', text: label, href })
    last = match.index + match[0].length
  }
  if (last < source.length) pieces.push({ kind: 'text', text: source.slice(last) })
  return pieces
}

/** Inline pieces as plain text, e.g. for an accessible name or a test. */
export function plainText(pieces: readonly Inline[]): string {
  return pieces.map((piece) => piece.text).join('')
}

/**
 * The body rows of the first table under `## heading`, as trimmed cell strings. Throws if the
 * heading or table is missing, so a renamed section fails the build instead of rendering nothing.
 */
export function tableUnder(markdown: string, heading: string): string[][] {
  const lines = markdown.split('\n')
  const start = lines.findIndex((line) => line.trim() === `## ${heading}`)
  if (start === -1) throw new Error(`No "## ${heading}" section`)
  const rows: string[][] = []
  for (const line of lines.slice(start + 1)) {
    if (line.startsWith('## ')) break
    if (!line.startsWith('|')) {
      if (rows.length > 0) break
      continue
    }
    rows.push(
      line
        .slice(1, line.trimEnd().endsWith('|') ? line.trimEnd().length - 1 : undefined)
        .split('|')
        .map((cell) => cell.trim()),
    )
  }
  // Drop the header row and the |---| separator.
  const body = rows.slice(2)
  if (body.length === 0) throw new Error(`No table rows under "## ${heading}"`)
  return body
}

/** The text of the first `# ` heading. */
export function firstHeading(markdown: string): string {
  const line = markdown.split('\n').find((l) => l.startsWith('# '))
  if (!line) throw new Error('No top-level heading')
  return line.slice(2).trim()
}
