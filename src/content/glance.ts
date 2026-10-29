// The "At a glance" intro: six Wrapped-style cards shown over the home page on a first visit.
// Numbers, skills, years and titles are looked up in the content they come from, so the cards
// cannot drift from the rest of the site; only the card wording lives here.
import portrait from '../assets/glance/yuxin-portrait.webp'
import type { SceneName } from '../components/ui/styles'
import { certifications, featuredStats, moreStats } from './achievements'
import type { Stat } from './achievements'
import { career } from './career'
import { intro } from './intro'
import type { IsoDate, Period } from './period'
import { findProject } from './projects'
import { topSkills } from './skills'

export interface GlanceImage {
  src: string
  alt: string
  width: number
  height: number
}

export interface GlanceTimelineStep {
  role: string
  /** e.g. "2023–24" or "2025–now". */
  years: string
}

interface GlanceCardBase {
  /** Stable id, used as the React key. */
  id: string
  scene: SceneName
}

/** Card 1: who, with the portrait. */
export interface GlanceHelloCard extends GlanceCardBase {
  kind: 'hello'
  eyebrow: readonly string[]
  name: string
  summary: string
  portrait: GlanceImage
}

/** Card 2: the big number in the title, then the path between two roles. */
export interface GlanceCareerCard extends GlanceCardBase {
  kind: 'career'
  stat: Stat
  location: string
  path: readonly [from: string, to: string]
  timeline: readonly GlanceTimelineStep[]
}

/** Cards 3–5: a title and up to three numbers, or facts without a number. */
export interface GlanceStatsCard extends GlanceCardBase {
  kind: 'stats'
  title: string
  eyebrow?: string
  /** `ordered`: each number leads to the next, like a funnel. */
  ordered?: boolean
  items: readonly (Stat | { fact: string })[]
  footnote?: string
}

/** Card 6: a numbered top list. */
export interface GlanceTopCard extends GlanceCardBase {
  kind: 'top'
  title: string
  items: readonly string[]
  footnote: string
}

export type GlanceCard = GlanceHelloCard | GlanceCareerCard | GlanceStatsCard | GlanceTopCard

export interface Glance {
  /** The dialog's accessible name. */
  label: string
  cards: readonly GlanceCard[]
}

/** The value of the stat with this label in `achievements.ts`; throws if it is missing. */
function statValue(label: string): string {
  const stat = [...featuredStats, ...moreStats].find((s) => s.label === label)
  if (!stat) throw new Error(`No stat labelled "${label}"`)
  return stat.value
}

function careerPeriod(id: string): Period {
  const entry = career.find((e) => e.id === id)
  if (!entry) throw new Error(`No career entry "${id}"`)
  return entry.period
}

const year = (date: IsoDate) => date.slice(0, 4)

/** A period as years: `2023-01`–`2024-12` → "2023–24", open-ended → "2025–now". */
export function yearSpan({ start, end }: Period): string {
  if (end === null) return `${year(start)}–now`
  if (year(end) === year(start)) return year(start)
  return `${year(start)}–${year(end).slice(2)}`
}

function certification(name: string): string {
  const found = certifications.find((c) => c.name === name)
  if (!found) throw new Error(`No certification "${name}"`)
  return `${found.name} ${found.year}`
}

function projectTitle(slug: string): string {
  const project = findProject(slug)
  if (!project) throw new Error(`No project "${slug}"`)
  return project.title
}

export const glance: Glance = {
  label: 'Yuxin Hay at a glance',
  cards: [
    {
      id: 'hello',
      kind: 'hello',
      scene: 'blush',
      eyebrow: intro.headline,
      name: 'Yuxin Hay',
      summary:
        'From accessible design systems to agentic AI, I design and manage products that work for everyone.',
      portrait: { src: portrait, alt: 'Portrait of Yuxin Hay, smiling', width: 800, height: 900 },
    },
    {
      id: 'career',
      kind: 'career',
      scene: 'pink',
      stat: { value: statValue('years at CPF Board'), label: 'years at CPF Board' },
      location: intro.location,
      path: ['Designer', 'Product Manager'],
      timeline: [
        { role: 'UX Designer', years: yearSpan(careerPeriod('cpf-ux')) },
        { role: 'Product Manager', years: yearSpan(careerPeriod('cpf-pm')) },
      ],
    },
    {
      id: 'ai-product',
      kind: 'stats',
      scene: 'cobalt',
      title: 'Managed an AI product',
      ordered: true,
      items: [
        { value: statValue('AI use-case submissions assessed'), label: 'AI use cases assessed' },
        {
          value: statValue('use cases across 14 departments'),
          label: 'pipelined across 14 departments',
        },
        { value: statValue('flagship AI use cases'), label: 'flagship' },
      ],
      footnote: projectTitle('flowcentral'),
    },
    {
      id: 'innovation',
      kind: 'stats',
      scene: 'ink',
      title: 'Grew innovation across the organisation',
      eyebrow: 'Made-in-CPF',
      items: [
        { value: statValue('officers in 7 cross-functional teams'), label: 'officers in 7 teams' },
        {
          value: statValue('Made-in-CPF, redesigned from 7 months'),
          label: 'redesigned from 7 months',
        },
        {
          value: statValue('challenge submissions, narrowed to 7 challenges'),
          label: 'challenges narrowed to 7',
        },
      ],
    },
    {
      id: 'real-people',
      kind: 'stats',
      scene: 'blush',
      title: 'Designing for real people',
      items: [
        { fact: 'Anti-scam measures for every CPF member, recognised in local media' },
        {
          value: statValue('UX case studies: 2 shipped, 1 concept'),
          label: 'UX case studies: 2 shipped, 1 concept',
        },
        {
          value: statValue('saved on an accessibility audit at Cialfo'),
          label: 'saved on an accessibility audit (Cialfo)',
        },
      ],
    },
    {
      id: 'top-skills',
      kind: 'top',
      scene: 'cobalt',
      title: 'Top skills',
      items: topSkills,
      footnote: [
        certification('CPFB Excellence Award'),
        certification('Certified Scrum Product Owner'),
      ].join(' · '),
    },
  ],
}
