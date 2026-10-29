import { describe, expect, it } from 'vitest'
import { firstHeading, parseInline, plainText, tableUnder } from './markdown'
import { adrs, parseAdrs, parsePlanSteps, planSteps, qualityGates, repoFileUrl } from './process'

const PLAN = `# Plan

## Status

| #   | Step                     | Status   | PR                                         |
| --- | ------------------------ | -------- | ------------------------------------------ |
| 1   | Scaffold, \`CLAUDE.md\`  | Done     | [#1](https://github.com/o/r/pull/1)        |
| 2   | Pages                    | **Next** |                                            |

Text after the table.

## Other
`

describe('markdown', () => {
  it('splits inline code and links, and drops bold markers', () => {
    expect(parseInline('Read **the** `plan` at [docs](https://x.test/a).')).toEqual([
      { kind: 'text', text: 'Read the ' },
      { kind: 'code', text: 'plan' },
      { kind: 'text', text: ' at ' },
      { kind: 'link', text: 'docs', href: 'https://x.test/a' },
      { kind: 'text', text: '.' },
    ])
    expect(plainText(parseInline('`a` b'))).toBe('a b')
  })

  it('reads the body rows of the table under a heading', () => {
    expect(tableUnder(PLAN, 'Status')).toEqual([
      ['1', 'Scaffold, `CLAUDE.md`', 'Done', '[#1](https://github.com/o/r/pull/1)'],
      ['2', 'Pages', '**Next**', ''],
    ])
    expect(() => tableUnder(PLAN, 'Missing')).toThrow('No "## Missing" section')
    expect(() => tableUnder(PLAN, 'Other')).toThrow('No table rows')
  })

  it('reads the first top-level heading', () => {
    expect(firstHeading('intro\n# ADR 0001: Title\n# Second')).toBe('ADR 0001: Title')
  })
})

describe('process', () => {
  it('parses plan steps with status and PR link', () => {
    expect(parsePlanSteps(PLAN)).toEqual([
      {
        number: 1,
        title: [
          { kind: 'text', text: 'Scaffold, ' },
          { kind: 'code', text: 'CLAUDE.md' },
        ],
        status: 'Done',
        pr: { label: '#1', href: 'https://github.com/o/r/pull/1' },
      },
      { number: 2, title: [{ kind: 'text', text: 'Pages' }], status: 'Next' },
    ])
  })

  it('rejects an unknown step status', () => {
    expect(() => parsePlanSteps(PLAN.replace('Done', 'Maybe'))).toThrow('Unknown status')
  })

  it('parses ADR titles and links them on GitHub, in number order', () => {
    expect(
      parseAdrs({
        '../../docs/adr/0002-b.md': '# ADR 0002: Use `b`\n',
        '../../docs/adr/0001-a.md': '# ADR 0001: A\n',
      }),
    ).toEqual([
      {
        number: '0001',
        title: [{ kind: 'text', text: 'A' }],
        href: repoFileUrl('docs/adr/0001-a.md'),
      },
      {
        number: '0002',
        title: [
          { kind: 'text', text: 'Use ' },
          { kind: 'code', text: 'b' },
        ],
        href: 'https://github.com/yuxinhay/my-portfolio/blob/main/docs/adr/0002-b.md',
      },
    ])
    expect(() => parseAdrs({ 'x.md': '# Not an ADR' })).toThrow('x.md has no')
  })

  it('reads the real plan and ADRs', () => {
    expect(planSteps.map((step) => step.number)).toEqual(planSteps.map((_, i) => i + 1))
    // At most one step is next; none once every step is done.
    expect(planSteps.filter((step) => step.status === 'Next').length).toBeLessThanOrEqual(1)
    for (const step of planSteps.filter((s) => s.status === 'Done')) {
      expect(step.pr?.href).toMatch(/^https:\/\/github\.com\/yuxinhay\/my-portfolio\/pull\/\d+$/)
    }
    expect(qualityGates.length).toBeGreaterThan(5)
    expect(adrs.map((adr) => adr.number)).toEqual(
      adrs.map((_, i) => String(i + 1).padStart(4, '0')),
    )
  })
})
