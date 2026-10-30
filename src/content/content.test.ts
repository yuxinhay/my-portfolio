import { describe, expect, it } from 'vitest'
import { certifications, featuredStats, moreStats } from './achievements'
import { career } from './career'
import { caseStudies } from './caseStudies'
import { glance, yearSpan } from './glance'
import { intro } from './intro'
import { formatIsoDate } from './period'
import { adrs, planSteps, qualityGates } from './process'
import { findProject, projects } from './projects'
import { site } from './site'
import { skillGroups, topSkills } from './skills'

const unique = (values: string[]) => expect(new Set(values).size).toBe(values.length)

// The content is typed, so shape errors fail typecheck; these tests cover the rules types cannot.
describe('content', () => {
  it('formats ISO dates for display', () => {
    expect(formatIsoDate('2025-01')).toBe('Jan 2025')
    expect(formatIsoDate('2024-12')).toBe('Dec 2024')
    expect(formatIsoDate('2019')).toBe('2019')
  })

  it('lists the career path newest first, with valid periods', () => {
    const starts = career.map((entry) => entry.period.start)
    expect(starts).toEqual([...starts].sort().reverse())
    for (const { period } of career) {
      if (period.end !== null) expect(period.end >= period.start).toBe(true)
    }
  })

  it('gives every project a unique, URL-safe slug that findProject resolves', () => {
    const slugs = projects.map((project) => project.slug)
    expect(new Set(slugs).size).toBe(slugs.length)
    for (const slug of slugs) {
      expect(slug).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/)
      expect(findProject(slug)?.slug).toBe(slug)
    }
    expect(findProject('no-such-project')).toBeUndefined()
  })

  it('only highlights skills that are in a group', () => {
    const names = skillGroups.flatMap((group) => group.skills.map((skill) => skill.name))
    expect(new Set(names).size).toBe(names.length)
    for (const name of topSkills) expect(names).toContain(name)
  })

  it('uses unique ids and labels, which double as React keys and heading ids', () => {
    unique(career.map((entry) => entry.id))
    unique(skillGroups.map((group) => group.id))
    unique([...featuredStats, ...moreStats].map((stat) => stat.label))
    unique(certifications.map((certification) => certification.name))
  })

  it('never publishes internal names or phone numbers', () => {
    const text = JSON.stringify([
      site,
      intro,
      career,
      projects,
      caseStudies,
      planSteps,
      qualityGates,
      adrs,
      skillGroups,
      featuredStats,
      moreStats,
      certifications,
      glance,
    ])
    expect(text).not.toMatch(/agent ?central|\bCMM\b/i)
    // No international phone numbers ("+" then a digit; "40+" style counts are fine).
    expect(text).not.toMatch(/\+\d/)
  })

  it('shows the At a glance cards in the agreed scenes, with numbers from the achievements', () => {
    expect(glance.cards.map((card) => card.scene)).toEqual([
      'blush',
      'pink',
      'cobalt',
      'ink',
      'blush',
      'cobalt',
    ])
    unique(glance.cards.map((card) => card.id))
    const values = [...featuredStats, ...moreStats].map((stat) => stat.value)
    for (const card of glance.cards) {
      const stats = card.kind === 'career' ? [card.stat] : card.kind === 'stats' ? card.items : []
      for (const stat of stats) if ('value' in stat) expect(values).toContain(stat.value)
    }
    const top = glance.cards.find((card) => card.kind === 'top')
    expect(top?.items).toEqual(topSkills)
  })

  it('writes periods as years for the At a glance timeline', () => {
    expect(yearSpan({ start: '2023-01', end: '2024-12' })).toBe('2023–24')
    expect(yearSpan({ start: '2025-01', end: null })).toBe('2025–now')
    expect(yearSpan({ start: '2017', end: '2017' })).toBe('2017')
  })
})
