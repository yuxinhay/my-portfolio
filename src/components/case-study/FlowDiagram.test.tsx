import { render, screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import type { Flow } from '../../content/caseStudies'
import { expectNoAxeViolations } from '../../test/axe'
import { describeStoriesAxe } from '../../test/stories'
import { FlowDiagram } from './FlowDiagram'
import * as stories from './FlowDiagram.stories'

const flow: Flow = {
  label: 'A flow',
  stages: [
    { title: 'Start', detail: 'First.' },
    {
      title: 'Split',
      branches: [
        { label: 'Lower priority', detail: 'Stops.' },
        { label: 'Higher priority', title: 'build', detail: 'Goes on.', continues: true },
      ],
    },
    { title: 'Finish', detail: 'Last.' },
  ],
}

describe('FlowDiagram', () => {
  it('renders the stages as a named ordered list, numbered in text', () => {
    render(<FlowDiagram flow={flow} />)
    const list = screen.getByRole('list', { name: 'A flow' })
    expect(list.tagName).toBe('OL')
    const stages = within(list)
      .getAllByRole('listitem')
      .filter((li) => li.parentElement === list)
    expect(stages.map((stage) => stage.querySelector('p')?.textContent)).toEqual([
      '1Start',
      '2Split',
      '3Finish',
    ])
  })

  it('nests the branches in their stage, labelled in text, saying which path continues', () => {
    render(<FlowDiagram flow={flow} />)
    const split = screen.getByText('Split').closest('li')
    const branches = within(split as HTMLElement).getByRole('list')
    expect(branches.tagName).toBe('UL')
    const [lower, higher] = within(branches).getAllByRole('listitem')
    expect(lower).toHaveTextContent('2a Lower priority')
    expect(lower).toHaveTextContent('Ends here')
    expect(higher).toHaveTextContent('2b Higher priority: build')
    expect(higher).toHaveTextContent('Continues to stage 3')
  })

  it('hides the connecting lines from screen readers', () => {
    const { container } = render(<FlowDiagram flow={flow} />)
    // One line into every stage after the first.
    expect(container.querySelectorAll('[aria-hidden="true"]')).toHaveLength(2)
  })

  it('has no axe violations', async () => {
    const { container } = render(<FlowDiagram flow={flow} />)
    await expectNoAxeViolations(container)
  })
})

describeStoriesAxe(stories)
