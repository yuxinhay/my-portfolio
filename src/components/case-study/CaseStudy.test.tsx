import { screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { caseStudies } from '../../content/caseStudies'
import { expectNoAxeViolations } from '../../test/axe'
import { renderWithRouter } from '../../test/router'
import { describeStoriesAxe } from '../../test/stories'
import { CaseStudy } from './CaseStudy'
import * as stories from './CaseStudy.stories'
import { studyFor } from './fixtures'

describe('CaseStudy', () => {
  it.each(caseStudies.map((study) => study.slug))('%s: one h1, then an h2 per section', (slug) => {
    const { project, study } = studyFor(slug)
    renderWithRouter(<CaseStudy project={project} study={study} />)
    expect(screen.getAllByRole('heading', { level: 1 }).map((h) => h.textContent)).toEqual([
      project.title,
    ])
    const sections = [study.problem, study.process, study.solution, study.outcome, study.lessons]
    expect(screen.getAllByRole('heading', { level: 2 }).map((h) => h.textContent)).toEqual(
      sections.flatMap((section) => (section ? [section.heading] : [])),
    )
  })

  it('renders outcome numbers as one phrase each', () => {
    const { project, study } = studyFor('flowcentral')
    renderWithRouter(<CaseStudy project={project} study={study} />)
    const outcome = screen.getByRole('region', { name: 'In numbers' })
    expect(within(outcome).getByText('40+').parentElement).toHaveTextContent(
      '40+ use-case submissions assessed',
    )
  })

  it('has no axe violations', async () => {
    const { container } = renderWithRouter(<CaseStudy {...studyFor('in-app-video-call')} />)
    await expectNoAxeViolations(container)
  })
})

describeStoriesAxe(stories)
