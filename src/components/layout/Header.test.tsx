import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { expectNoAxeViolations } from '../../test/axe'
import { renderWithRouter } from '../../test/router'
import { describeStoriesAxe } from '../../test/stories'
import { Header } from './Header'
import * as stories from './Header.stories'

function setup(path = '/') {
  const user = userEvent.setup()
  renderWithRouter(<Header />, path)
  const toggle = screen.getByRole('button', { name: 'Menu' })
  const nav = screen.getByRole('navigation', { name: 'Primary' })
  return { user, toggle, nav }
}

describe('Header', () => {
  it('links the site name to the home page', () => {
    renderWithRouter(<Header />, '/design-system')
    expect(screen.getByRole('link', { name: 'Your Name' })).toHaveAttribute('href', '/')
  })

  it('has a native menu toggle that controls the navigation, collapsed by default', () => {
    const { toggle, nav } = setup()
    expect(toggle).toHaveAttribute('type', 'button')
    expect(toggle).toHaveAttribute('aria-expanded', 'false')
    expect(toggle).toHaveAttribute('aria-controls', nav.id)
    // Hidden below `md` only; from `md` up the toggle is hidden and the links always show.
    expect(nav).toHaveClass('hidden', 'md:block')
    expect(toggle).toHaveClass('md:hidden')
  })

  it('opens and closes the menu with the toggle', async () => {
    const { user, toggle, nav } = setup()
    await user.click(toggle)
    expect(toggle).toHaveAttribute('aria-expanded', 'true')
    expect(nav).toHaveClass('block')
    expect(nav).not.toHaveClass('hidden')
    await user.click(toggle)
    expect(toggle).toHaveAttribute('aria-expanded', 'false')
    expect(nav).toHaveClass('hidden')
  })

  it('works by keyboard: Enter opens, Escape closes and returns focus to the toggle', async () => {
    const { user, toggle } = setup()
    await user.tab()
    await user.tab()
    expect(toggle).toHaveFocus()
    await user.keyboard('{Enter}')
    expect(toggle).toHaveAttribute('aria-expanded', 'true')
    await user.tab()
    expect(screen.getByRole('link', { name: 'Work' })).toHaveFocus()
    await user.keyboard('{Escape}')
    expect(toggle).toHaveAttribute('aria-expanded', 'false')
    expect(toggle).toHaveFocus()
  })

  it('closes the menu when a link is followed', async () => {
    const { user, toggle } = setup()
    await user.click(toggle)
    await user.click(screen.getByRole('link', { name: 'Design system' }))
    expect(toggle).toHaveAttribute('aria-expanded', 'false')
  })

  it('has no axe violations, open or closed', async () => {
    const { user, toggle } = setup()
    await expectNoAxeViolations(document.body)
    await user.click(toggle)
    await expectNoAxeViolations(document.body)
  })
})

describeStoriesAxe(stories)
