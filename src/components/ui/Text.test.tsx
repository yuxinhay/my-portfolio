import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { expectNoAxeViolations } from '../../test/axe'
import { describeStoriesAxe } from '../../test/stories'
import { TEXT_RECIPES } from './styles'
import { Text } from './Text'
import * as stories from './Text.stories'

describe('Text', () => {
  it('renders a paragraph in the body style by default', () => {
    render(<Text>Hello</Text>)
    const text = screen.getByText('Hello')
    expect(text.tagName).toBe('P')
    expect(text.className).toBe(TEXT_RECIPES.body)
  })

  it('renders a span with `as="span"`', () => {
    render(<Text as="span">Inline</Text>)
    expect(screen.getByText('Inline').tagName).toBe('SPAN')
  })

  it.each(['body', 'small', 'eyebrow'] as const)('applies the %s recipe', (variant) => {
    render(<Text variant={variant}>Sample</Text>)
    expect(screen.getByText('Sample').className).toBe(TEXT_RECIPES[variant])
  })

  it('uses the agreed body and small recipes', () => {
    expect(TEXT_RECIPES.body).toBe('text-body leading-normal font-regular')
    expect(TEXT_RECIPES.small).toBe('text-small leading-normal font-medium')
  })

  it('appends extra classes', () => {
    render(<Text className="max-w-prose">Sample</Text>)
    expect(screen.getByText('Sample')).toHaveClass('text-body', 'max-w-prose')
  })

  it('has no axe violations', async () => {
    const { container } = render(<Text variant="small">Sample</Text>)
    await expectNoAxeViolations(container)
  })
})

describeStoriesAxe(stories)
