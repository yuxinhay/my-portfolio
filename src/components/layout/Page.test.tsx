import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { expectNoAxeViolations } from '../../test/axe'
import { describeStoriesAxe } from '../../test/stories'
import { Page } from './Page'
import * as stories from './Page.stories'

describe('Page', () => {
  it('renders one h1 that can take programmatic focus only', () => {
    render(<Page title="Design system">Content</Page>)
    const headings = screen.getAllByRole('heading', { level: 1 })
    expect(headings).toHaveLength(1)
    expect(headings[0]).toHaveTextContent('Design system')
    expect(headings[0]).toHaveAttribute('tabindex', '-1')
  })

  it('sets the document title to "<Page> · <site name>"', () => {
    const { rerender } = render(<Page title="Design system" />)
    expect(document.title).toBe('Design system · Your Name')
    rerender(<Page title="How I built this" />)
    expect(document.title).toBe('How I built this · Your Name')
  })

  it('has no axe violations', async () => {
    const { container } = render(<Page title="Design system">Content</Page>)
    await expectNoAxeViolations(container)
  })
})

describeStoriesAxe(stories)
