import { act, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { pageTitle, site } from '../content/site'
import { expectNoAxeViolations } from '../test/axe'
import { renderApp } from '../test/router'
import { describeStoriesAxe } from '../test/stories'
import * as stories from './Layout.stories'

// The home page's h1 is the owner's name; its document title follows the "Work" nav item.
const ROUTES = [
  { path: '/', h1: site.name, title: 'Work' },
  {
    path: '/projects/flowcentral',
    h1: 'flowCentral: agentic AI workflow platform',
    title: 'flowCentral: agentic AI workflow platform',
  },
  { path: '/projects/no-such-project', h1: 'Page not found', title: 'Page not found' },
  { path: '/design-system', h1: 'Design system', title: 'Design system' },
  { path: '/how-i-built-this', h1: 'How I built this', title: 'How I built this' },
  { path: '/no-such-page', h1: 'Page not found', title: 'Page not found' },
]

describe('Layout and routes', () => {
  it.each(ROUTES)('$path renders "$h1" in the shell', async ({ path, h1, title }) => {
    const { container } = renderApp(path)
    expect(screen.getByRole('banner')).toBeInTheDocument()
    expect(screen.getByRole('navigation', { name: 'Primary' })).toBeInTheDocument()
    expect(screen.getByRole('main')).toHaveAttribute('id', 'main')
    expect(screen.getByRole('contentinfo')).toBeInTheDocument()
    const headings = screen.getAllByRole('heading', { level: 1 })
    expect(headings).toHaveLength(1)
    expect(headings[0]).toHaveTextContent(h1)
    expect(document.title).toBe(pageTitle(title))
    await expectNoAxeViolations(container)
  })

  it('makes the skip link the first tab stop, targeting main', async () => {
    const user = userEvent.setup()
    renderApp('/')
    await user.tab()
    const skip = screen.getByRole('link', { name: 'Skip to main content' })
    expect(skip).toHaveFocus()
    expect(skip).toHaveAttribute('href', '#main')
    expect(screen.getByRole('main')).toHaveAttribute('tabindex', '-1')
  })

  it('does not move focus on the first page load', () => {
    renderApp('/design-system')
    expect(document.body).toHaveFocus()
  })

  it('moves focus to the new h1 and updates the title after navigation', async () => {
    const user = userEvent.setup()
    renderApp('/')
    const nav = screen.getByRole('navigation', { name: 'Primary' })
    await user.click(within(nav).getByRole('link', { name: 'Design system' }))
    expect(screen.getByRole('heading', { level: 1, name: 'Design system' })).toHaveFocus()
    expect(document.title).toBe(pageTitle('Design system'))
    expect(within(nav).getByRole('link', { name: 'Design system' })).toHaveAttribute(
      'aria-current',
      'page',
    )
  })

  it('moves focus on back navigation too', async () => {
    const user = userEvent.setup()
    const { router } = renderApp('/')
    await user.click(screen.getByRole('link', { name: 'How I built this' }))
    await act(() => router.navigate(-1))
    expect(screen.getByRole('heading', { level: 1, name: site.name })).toHaveFocus()
  })

  it('focuses a focusable #hash target instead of the h1', async () => {
    const { router } = renderApp('/design-system')
    await act(() => router.navigate('/#main'))
    expect(screen.getByRole('main')).toHaveFocus()
  })

  it('focuses a home section when navigating to its #hash', async () => {
    const { router } = renderApp('/design-system')
    await act(() => router.navigate('/#projects'))
    expect(screen.getByRole('region', { name: 'Projects' })).toHaveFocus()
  })

  it('opens a project from its card and links back to the projects section', async () => {
    const user = userEvent.setup()
    renderApp('/')
    const projects = screen.getByRole('region', { name: 'Projects' })
    await user.click(within(projects).getByRole('link', { name: /^flowCentral/ }))
    expect(
      screen.getByRole('heading', { level: 1, name: 'flowCentral: agentic AI workflow platform' }),
    ).toHaveFocus()
    expect(screen.getByRole('region', { name: 'How I managed it' })).toBeInTheDocument()
    await user.click(screen.getByRole('link', { name: 'Back to all projects' }))
    expect(screen.getByRole('region', { name: 'Projects' })).toHaveFocus()
  })

  it('closes the mobile menu after navigating and focuses the new h1', async () => {
    const user = userEvent.setup()
    renderApp('/')
    const toggle = screen.getByRole('button', { name: 'Menu' })
    await user.click(toggle)
    expect(toggle).toHaveAttribute('aria-expanded', 'true')
    await user.click(screen.getByRole('link', { name: 'How I built this' }))
    expect(toggle).toHaveAttribute('aria-expanded', 'false')
    expect(screen.getByRole('heading', { level: 1, name: 'How I built this' })).toHaveFocus()
  })

  it('links from the not-found page back home', async () => {
    const user = userEvent.setup()
    renderApp('/missing')
    await user.click(screen.getByRole('link', { name: 'Go to the home page' }))
    expect(screen.getByRole('heading', { level: 1, name: site.name })).toHaveFocus()
  })
})

describeStoriesAxe(stories)
