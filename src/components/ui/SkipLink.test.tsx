import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { expectNoAxeViolations } from '../../test/axe'
import { describeStoriesAxe } from '../../test/stories'
import { SkipLink } from './SkipLink'
import * as stories from './SkipLink.stories'

function Page() {
  return (
    <>
      <SkipLink />
      <nav aria-label="Main">
        <a href="#projects">Projects</a>
      </nav>
      <main id="main" tabIndex={-1}>
        Content
      </main>
    </>
  )
}

describe('SkipLink', () => {
  it('links to #main with a default label', () => {
    render(<SkipLink />)
    expect(screen.getByRole('link', { name: 'Skip to main content' })).toHaveAttribute(
      'href',
      '#main',
    )
  })

  it('is the first stop when tabbing, hidden until focused', async () => {
    const user = userEvent.setup()
    render(<Page />)
    const link = screen.getByRole('link', { name: 'Skip to main content' })
    expect(link).toHaveClass('sr-only', 'focus:not-sr-only', 'focus:bg-scene-fg')
    await user.tab()
    expect(link).toHaveFocus()
  })

  it('has no axe violations on a page with its target', async () => {
    const { container } = render(<Page />)
    await expectNoAxeViolations(container)
  })
})

describeStoriesAxe(stories)
