import { screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { pageTitle, site } from '../content/site'
import { expectNoAxeViolations } from '../test/axe'
import { renderApp } from '../test/router'

describe('Home', () => {
  it('renders the Wrapped sections in order, each named by its heading', () => {
    const { container } = renderApp('/')
    const sections = [...container.querySelectorAll('main > section')]
    expect(sections.map((section) => section.id)).toEqual([
      'intro',
      'skills',
      'career',
      'projects',
      'achievements',
    ])
    const names = [site.name, 'Top skills', 'Career path', 'Projects', 'Achievements']
    expect(sections).toEqual(names.map((name) => screen.getByRole('region', { name })))
  })

  it('has one h1, in the intro, and an h2 for every other section', () => {
    renderApp('/')
    const h1s = screen.getAllByRole('heading', { level: 1 })
    expect(h1s).toHaveLength(1)
    expect(h1s[0]?.closest('section')).toHaveAttribute('id', 'intro')
    expect(
      screen
        .getAllByRole('heading', { level: 2 })
        .map((heading) => heading.textContent)
        // The footer's Contact heading follows the sections.
        .slice(0, 4),
    ).toEqual(['Top skills', 'Career path', 'Projects', 'Achievements'])
  })

  it('sets the document title after the "Work" nav item', () => {
    renderApp('/')
    expect(document.title).toBe(pageTitle('Work'))
  })

  it('has no axe violations', async () => {
    const { container } = renderApp('/')
    await expectNoAxeViolations(container)
  })
})
