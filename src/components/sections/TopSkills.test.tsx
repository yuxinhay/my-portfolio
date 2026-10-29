import { render, screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { skillGroups, topSkills } from '../../content/skills'
import { expectNoAxeViolations } from '../../test/axe'
import { describeStoriesAxe } from '../../test/stories'
import { TopSkills } from './TopSkills'
import * as stories from './TopSkills.stories'

describe('TopSkills', () => {
  it('is a region named "Top skills"', () => {
    render(<TopSkills />)
    expect(screen.getByRole('region', { name: 'Top skills' })).toHaveAttribute('id', 'skills')
  })

  it('lists the headline skills in order', () => {
    render(<TopSkills />)
    const top = screen.getByRole('list', { name: 'Headline skills' })
    expect(top.tagName).toBe('OL')
    expect(
      within(top)
        .getAllByRole('listitem')
        .map((item) => item.textContent),
    ).toEqual(topSkills)
  })

  it('renders every skill in a list named by its group h3', () => {
    render(<TopSkills />)
    for (const group of skillGroups) {
      expect(screen.getByRole('heading', { level: 3, name: group.title })).toBeInTheDocument()
      const list = screen.getByRole('list', { name: group.title })
      expect(within(list).getAllByRole('listitem')).toHaveLength(group.skills.length)
    }
    expect(
      screen.getByText('Figma (advanced prototyping: conditional logic, variables)'),
    ).toBeInTheDocument()
  })

  it('omits the headline list when there are no top skills', () => {
    render(<TopSkills top={[]} />)
    expect(screen.queryByRole('list', { name: 'Headline skills' })).not.toBeInTheDocument()
  })

  it('has no axe violations', async () => {
    const { container } = render(<TopSkills />)
    await expectNoAxeViolations(container)
  })
})

describeStoriesAxe(stories)
