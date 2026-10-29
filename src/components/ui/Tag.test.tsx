import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { expectNoAxeViolations } from '../../test/axe'
import { describeStoriesAxe } from '../../test/stories'
import { Tag } from './Tag'
import * as stories from './Tag.stories'

describe('Tag', () => {
  it('renders non-interactive text', () => {
    render(<Tag>React</Tag>)
    const tag = screen.getByText('React')
    expect(tag.tagName).toBe('SPAN')
    expect(tag).not.toHaveAttribute('tabindex')
  })

  it('is outlined by default and filled when solid', () => {
    render(
      <>
        <Tag>Outline</Tag>
        <Tag variant="solid">Solid</Tag>
      </>,
    )
    expect(screen.getByText('Outline')).toHaveClass('border-scene-fg', 'text-scene-fg')
    expect(screen.getByText('Solid')).toHaveClass('bg-scene-fg', 'text-scene')
  })

  it('has no axe violations in a list', async () => {
    const { container } = render(
      <ul>
        <li>
          <Tag>React</Tag>
        </li>
      </ul>,
    )
    await expectNoAxeViolations(container)
  })
})

describeStoriesAxe(stories)
