// The engineering process, read from the repo docs at build time rather than copied: plan steps
// and quality gates from docs/plan.md, and the ADR list from docs/adr/. Updating a doc updates
// the "How I built this" page in the same PR.
import planMarkdown from '../../docs/plan.md?raw'
import { firstHeading, parseInline, plainText, tableUnder } from './markdown'
import type { Inline } from './markdown'

export const REPO_URL = 'https://github.com/yuxinhay/my-portfolio'

/** A file in the repo on GitHub, e.g. `docs/plan.md`. */
export function repoFileUrl(path: string): string {
  return `${REPO_URL}/blob/main/${path}`
}

export type StepStatus = 'Done' | 'Next' | 'To do'

export interface PlanStep {
  number: number
  title: Inline[]
  status: StepStatus
  /** The pull request that completed the step, if any. */
  pr?: { label: string; href: string }
}

export interface QualityGate {
  gate: Inline[]
  where: string
  /** "Live", or the plan step that adds it, e.g. "Step 9". */
  status: string
}

export interface Adr {
  /** e.g. "0002" */
  number: string
  /** The title without the "ADR 0002:" prefix. */
  title: Inline[]
  href: string
}

function isStepStatus(value: string): value is StepStatus {
  return value === 'Done' || value === 'Next' || value === 'To do'
}

export function parsePlanSteps(markdown: string): PlanStep[] {
  return tableUnder(markdown, 'Status').map(([number = '', title = '', status = '', pr = '']) => {
    const plainStatus = plainText(parseInline(status))
    if (!isStepStatus(plainStatus)) throw new Error(`Unknown status "${status}" for step ${number}`)
    const link = parseInline(pr).find((piece) => piece.kind === 'link')
    return {
      number: Number(number),
      title: parseInline(title),
      status: plainStatus,
      ...(link?.kind === 'link' && { pr: { label: link.text, href: link.href } }),
    }
  })
}

export function parseQualityGates(markdown: string): QualityGate[] {
  return tableUnder(markdown, 'Quality gates').map(([gate = '', where = '', status = '']) => ({
    gate: parseInline(gate),
    where,
    status,
  }))
}

/** ADRs from `{ path: markdown }`, ordered by number. */
export function parseAdrs(files: Record<string, string>): Adr[] {
  return Object.entries(files)
    .map(([path, markdown]) => {
      const file = path.split('/').at(-1) ?? path
      const heading = firstHeading(markdown).match(/^ADR (\d+): (.+)$/)
      if (!heading?.[1] || !heading[2]) throw new Error(`${file} has no "# ADR NNNN: title"`)
      return {
        number: heading[1],
        title: parseInline(heading[2]),
        href: repoFileUrl(`docs/adr/${file}`),
      }
    })
    .sort((a, b) => a.number.localeCompare(b.number))
}

const adrFiles = import.meta.glob<string>('../../docs/adr/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
})

export const planSteps: PlanStep[] = parsePlanSteps(planMarkdown)
export const qualityGates: QualityGate[] = parseQualityGates(planMarkdown)
export const adrs: Adr[] = parseAdrs(adrFiles)
