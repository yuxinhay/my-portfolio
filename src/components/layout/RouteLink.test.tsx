import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router'
import { describe, expect, it } from 'vitest'
import { expectNoAxeViolations } from '../../test/axe'
import { renderWithRouter } from '../../test/router'
import { describeStoriesAxe } from '../../test/stories'
import { RouteLink } from './RouteLink'
import * as stories from './RouteLink.stories'

describe('RouteLink', () => {
  it('looks like the Link primitive', () => {
    renderWithRouter(<RouteLink to="/design-system">Design system</RouteLink>)
    expect(screen.getByRole('link')).toHaveClass('underline', 'text-scene-accent')
  })

  it('resolves the href against the router basename', () => {
    render(
      <MemoryRouter basename="/my-portfolio" initialEntries={['/my-portfolio/']}>
        <RouteLink to="/design-system">Design system</RouteLink>
      </MemoryRouter>,
    )
    expect(screen.getByRole('link')).toHaveAttribute('href', '/my-portfolio/design-system')
  })

  it('navigates client-side when clicked', async () => {
    const user = userEvent.setup()
    render(
      <MemoryRouter>
        <Routes>
          <Route path="/" element={<RouteLink to="/next">Next</RouteLink>} />
          <Route path="/next" element={<p>Next page</p>} />
        </Routes>
      </MemoryRouter>,
    )
    await user.click(screen.getByRole('link', { name: 'Next' }))
    expect(screen.getByText('Next page')).toBeInTheDocument()
  })

  it('has no axe violations', async () => {
    const { container } = renderWithRouter(<RouteLink to="/">Home</RouteLink>)
    await expectNoAxeViolations(container)
  })
})

describeStoriesAxe(stories)
