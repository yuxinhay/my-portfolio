import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { expectNoAxeViolations } from '../../test/axe'
import { describeStoriesAxe } from '../../test/stories'
import { CaseStudyMeta } from './CaseStudyMeta'
import * as stories from './CaseStudyMeta.stories'
import { studyFor } from './fixtures'

function terms(container: HTMLElement) {
  return [...container.querySelectorAll('dt')].map((dt) => [
    dt.textContent,
    dt.nextElementSibling?.textContent,
  ])
}

describe('CaseStudyMeta', () => {
  it('lists role, when and status as text, and the team note', () => {
    const { project, study } = studyFor('in-app-video-call')
    const { container } = render(<CaseStudyMeta project={project} overview={study.overview} />)
    expect(terms(container)).toEqual([
      ['Role', 'Sole designer'],
      ['When', '2023'],
      ['Status', 'Concept'],
    ])
    expect(screen.getByText(/I was the only designer/)).toBeInTheDocument()
  })

  it('leaves out the status when a project has none', () => {
    const { project, study } = studyFor('flowcentral')
    const { container } = render(<CaseStudyMeta project={project} overview={study.overview} />)
    expect(terms(container).map(([term]) => term)).toEqual(['Role', 'When'])
  })

  it('has no axe violations', async () => {
    const { project, study } = studyFor('adaptive-tables')
    const { container } = render(<CaseStudyMeta project={project} overview={study.overview} />)
    await expectNoAxeViolations(container)
  })
})

describeStoriesAxe(stories)
