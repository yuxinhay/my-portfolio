import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { expectNoAxeViolations } from '../../test/axe'
import { describeStoriesAxe } from '../../test/stories'
import { Heading } from './Heading'
import type { HeadingLevel } from './Heading'
import * as stories from './Heading.stories'
import { TEXT_RECIPES } from './styles'

const LEVELS: HeadingLevel[] = [1, 2, 3, 4, 5, 6]

describe('Heading', () => {
  it.each(LEVELS)('level %i renders an h%i element', (level) => {
    render(<Heading level={level}>Title</Heading>)
    expect(screen.getByRole('heading', { level, name: 'Title' }).tagName).toBe(`H${level}`)
  })

  it('defaults the size to the level, and h4–h6 to h3', () => {
    render(
      <>
        <Heading level={1}>One</Heading>
        <Heading level={5}>Five</Heading>
      </>,
    )
    expect(screen.getByRole('heading', { level: 1 })).toHaveClass('text-h1', 'font-black')
    expect(screen.getByRole('heading', { level: 5 })).toHaveClass('text-h3', 'font-bold')
  })

  it('takes a visual size independent of the level', () => {
    render(
      <Heading level={2} size="display">
        Career Wrapped
      </Heading>,
    )
    const heading = screen.getByRole('heading', { level: 2 })
    expect(heading.className).toContain(TEXT_RECIPES.display)
  })

  it('uses the agreed h1 and h3 recipes', () => {
    expect(TEXT_RECIPES.h1).toBe('text-h1 leading-snug font-black tracking-heading')
    expect(TEXT_RECIPES.h3).toBe('text-h3 leading-snug font-bold tracking-heading')
  })

  it('has no axe violations', async () => {
    const { container } = render(<Heading level={1}>Title</Heading>)
    await expectNoAxeViolations(container)
  })
})

describeStoriesAxe(stories)
