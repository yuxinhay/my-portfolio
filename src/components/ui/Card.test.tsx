import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { expectNoAxeViolations } from '../../test/axe'
import { describeStoriesAxe } from '../../test/stories'
import { Card } from './Card'
import * as stories from './Card.stories'

describe('Card', () => {
  it('renders a div by default', () => {
    render(<Card data-testid="card">Content</Card>)
    expect(screen.getByTestId('card').tagName).toBe('DIV')
  })

  it('renders an article with `as="article"`', () => {
    render(
      <Card as="article" aria-label="Project">
        Content
      </Card>,
    )
    expect(screen.getByRole('article', { name: 'Project' })).toBeInTheDocument()
  })

  it('is outlined in the surrounding scene without `scene`', () => {
    render(<Card data-testid="card">Content</Card>)
    expect(screen.getByTestId('card')).toHaveClass('border-scene-fg', 'rounded-card')
  })

  it('becomes its own scene with `scene`', () => {
    render(
      <Card data-testid="card" scene="cobalt">
        Content
      </Card>,
    )
    const card = screen.getByTestId('card')
    expect(card).toHaveClass('scene-cobalt')
    expect(card).not.toHaveClass('border-scene-fg')
  })

  it('has no axe violations', async () => {
    const { container } = render(
      <Card as="section" aria-label="Stats" scene="ink">
        <p>12 projects</p>
      </Card>,
    )
    await expectNoAxeViolations(container)
  })
})

describeStoriesAxe(stories)
