import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { describeStoriesAxe } from '../../test/stories'
import { expectNoAxeViolations } from '../../test/axe'
import { Button } from './Button'
import * as stories from './Button.stories'

describe('Button', () => {
  it('renders a native button that defaults to type="button"', () => {
    render(<Button>Save</Button>)
    expect(screen.getByRole('button', { name: 'Save' })).toHaveAttribute('type', 'button')
  })

  it('keeps an explicit type', () => {
    render(<Button type="submit">Send</Button>)
    expect(screen.getByRole('button', { name: 'Send' })).toHaveAttribute('type', 'submit')
  })

  it('is keyboard operable with Enter and Space', async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()
    render(<Button onClick={onClick}>Save</Button>)
    await user.tab()
    expect(screen.getByRole('button')).toHaveFocus()
    await user.keyboard('{Enter}')
    await user.keyboard(' ')
    expect(onClick).toHaveBeenCalledTimes(2)
  })

  it('uses scene role utilities and the scene focus ring', () => {
    render(<Button variant="secondary">Save</Button>)
    const button = screen.getByRole('button')
    expect(button).toHaveClass(
      'text-scene-fg',
      'border-scene-fg',
      'focus-visible:outline-scene-focus',
    )
    expect(button).toHaveClass('motion-reduce:transition-none')
  })

  it('gives a primary button a hollow lift shadow, which contrasts with its fill', () => {
    render(
      <>
        <Button>Save</Button>
        <Button variant="secondary">Cancel</Button>
      </>,
    )
    expect(screen.getByRole('button', { name: 'Save' })).toHaveClass(
      'lift-hollow',
      'hover:shadow-lift',
    )
    expect(screen.getByRole('button', { name: 'Cancel' })).not.toHaveClass('lift-hollow')
  })

  it("keeps a ghost button's text at full strength", () => {
    render(<Button variant="ghost">Skip</Button>)
    expect(screen.getByRole('button')).toHaveClass('text-scene-fg', 'bg-scene-fg/10')
  })

  it('has no axe violations', async () => {
    const { container } = render(<Button>Save</Button>)
    await expectNoAxeViolations(container)
  })
})

describeStoriesAxe(stories)
