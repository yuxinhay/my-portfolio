import { screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { projects } from '../../content/projects'
import { expectNoAxeViolations } from '../../test/axe'
import { renderWithRouter } from '../../test/router'
import { describeStoriesAxe } from '../../test/stories'
import { Projects } from './Projects'
import * as stories from './Projects.stories'

describe('Projects', () => {
  it('renders one article per project, named by its title', () => {
    renderWithRouter(<Projects />)
    const region = screen.getByRole('region', { name: 'Projects' })
    expect(region).toHaveAttribute('id', 'projects')
    expect(within(region).getAllByRole('article')).toHaveLength(projects.length)
  })

  it('links each title, and only the title, to /projects/:slug', () => {
    renderWithRouter(<Projects />)
    const links = screen.getAllByRole('link')
    expect(links).toHaveLength(projects.length)
    for (const { slug, title } of projects) {
      expect(screen.getByRole('link', { name: title })).toHaveAttribute('href', `/projects/${slug}`)
    }
  })

  it('underlines each title only on hover and press', () => {
    renderWithRouter(<Projects />)
    for (const link of screen.getAllByRole('link')) {
      expect(link).not.toHaveClass('underline')
      expect(link).toHaveClass('hover:underline', 'active:underline')
    }
  })

  it('labels the status in text, including the concept', () => {
    renderWithRouter(<Projects />)
    const concept = screen.getByRole('article', {
      name: 'Bringing the service centre closer: in-app video call',
    })
    expect(within(concept).getByText('Concept')).toBeInTheDocument()
  })

  it('has no axe violations', async () => {
    const { container } = renderWithRouter(<Projects />)
    await expectNoAxeViolations(container)
  })
})

describeStoriesAxe(stories)
