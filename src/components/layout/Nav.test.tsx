import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router'
import { describe, expect, it, vi } from 'vitest'
import { expectNoAxeViolations } from '../../test/axe'
import { renderWithRouter } from '../../test/router'
import { describeStoriesAxe } from '../../test/stories'
import { Nav } from './Nav'
import * as stories from './Nav.stories'

describe('Nav', () => {
  it('is a navigation landmark named "Primary" with the site links', () => {
    renderWithRouter(<Nav />)
    const nav = screen.getByRole('navigation', { name: 'Primary' })
    expect(nav).toContainElement(screen.getByRole('link', { name: 'Work' }))
    expect(screen.getByRole('link', { name: 'Design system' })).toHaveAttribute(
      'href',
      '/design-system',
    )
    expect(screen.getByRole('link', { name: 'How I built this' })).toBeInTheDocument()
  })

  it('marks only the current page with aria-current, plus a non-colour underline', () => {
    renderWithRouter(<Nav />, '/design-system')
    const current = screen.getByRole('link', { name: 'Design system' })
    expect(current).toHaveAttribute('aria-current', 'page')
    expect(current).toHaveClass('underline')
    expect(screen.getByRole('link', { name: 'Work' })).not.toHaveAttribute('aria-current')
  })

  it('marks "Work" current on the home page only', () => {
    renderWithRouter(<Nav />, '/')
    expect(screen.getByRole('link', { name: 'Work' })).toHaveAttribute('aria-current', 'page')
  })

  it('includes the router basename in hrefs', () => {
    render(
      <MemoryRouter basename="/my-portfolio" initialEntries={['/my-portfolio/']}>
        <Nav />
      </MemoryRouter>,
    )
    expect(screen.getByRole('link', { name: 'How I built this' })).toHaveAttribute(
      'href',
      '/my-portfolio/how-i-built-this',
    )
  })

  it('calls onNavigate when a link is followed', async () => {
    const user = userEvent.setup()
    const onNavigate = vi.fn()
    renderWithRouter(<Nav onNavigate={onNavigate} />)
    await user.click(screen.getByRole('link', { name: 'Design system' }))
    expect(onNavigate).toHaveBeenCalledOnce()
  })

  it('has no axe violations', async () => {
    const { container } = renderWithRouter(<Nav />)
    await expectNoAxeViolations(container)
  })
})

describeStoriesAxe(stories)
