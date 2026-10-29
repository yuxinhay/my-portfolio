import { screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { projects } from '../../content/projects'
import { expectNoAxeViolations } from '../../test/axe'
import { renderWithRouter } from '../../test/router'
import { describeStoriesAxe } from '../../test/stories'
import { ProjectPager } from './ProjectPager'
import * as stories from './ProjectPager.stories'

const [first, second, third] = projects

describe('ProjectPager', () => {
  it('links to the previous and next project and back to all projects', () => {
    renderWithRouter(<ProjectPager slug={second?.slug ?? ''} />)
    const nav = screen.getByRole('navigation', { name: 'Projects' })
    expect(
      within(nav).getByRole('link', { name: `Previous project: ${first?.title}` }),
    ).toHaveAttribute('href', `/projects/${first?.slug}`)
    expect(
      within(nav).getByRole('link', { name: `Next project: ${third?.title}` }),
    ).toHaveAttribute('href', `/projects/${third?.slug}`)
    expect(within(nav).getByRole('link', { name: 'Back to all projects' })).toHaveAttribute(
      'href',
      '/#projects',
    )
  })

  it('has no previous link on the first project', () => {
    renderWithRouter(<ProjectPager slug={first?.slug ?? ''} />)
    expect(screen.queryByRole('link', { name: /^Previous project/ })).not.toBeInTheDocument()
    expect(screen.getByRole('link', { name: /^Next project/ })).toBeInTheDocument()
  })

  it('has no axe violations', async () => {
    const { container } = renderWithRouter(<ProjectPager slug={second?.slug ?? ''} />)
    await expectNoAxeViolations(container)
  })
})

describeStoriesAxe(stories)
