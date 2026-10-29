import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { expectNoAxeViolations } from '../../test/axe'
import { describeStoriesAxe } from '../../test/stories'
import { VisuallyHidden } from './VisuallyHidden'
import * as stories from './VisuallyHidden.stories'

describe('VisuallyHidden', () => {
  it('keeps text in the accessible name while hiding it visually', () => {
    render(
      <a href="#ds">
        Read more <VisuallyHidden>about the design system</VisuallyHidden>
      </a>,
    )
    expect(
      screen.getByRole('link', { name: 'Read more about the design system' }),
    ).toBeInTheDocument()
    expect(screen.getByText('about the design system', { exact: false })).toHaveClass('sr-only')
  })

  it('has no axe violations', async () => {
    const { container } = render(
      <button type="button">
        <VisuallyHidden>Close menu</VisuallyHidden>
      </button>,
    )
    await expectNoAxeViolations(container)
  })
})

describeStoriesAxe(stories)
