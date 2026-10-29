import { describe, expect, it } from 'vitest'
import { certifications, featuredStats, moreStats } from './achievements'
import { career } from './career'
import { caseStudies } from './caseStudies'
import { intro } from './intro'
import { formatIsoDate } from './period'
import { adrs, planSteps, qualityGates } from './process'
import { findProject, projects } from './projects'
import { site } from './site'
import { skillGroups, topSkills } from './skills'

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
    const unique = (values: string[]) => expect(new Set(values).size).toBe(values.length)
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
    ])
    expect(text).not.toMatch(/agent ?central|\bCMM\b/i)
    // No international phone numbers ("+" then a digit; "40+" style counts are fine).
    expect(text).not.toMatch(/\+\d/)
  })
})
