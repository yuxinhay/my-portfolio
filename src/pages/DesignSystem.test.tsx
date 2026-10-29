import { render, screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { SCENES } from '../components/ui/styles'
import { pageTitle } from '../content/site'
import { tokensIn } from '../design-system/tokens'
import { expectNoAxeViolations } from '../test/axe'
import { describeStoriesAxe } from '../test/stories'
import { DesignSystem } from './DesignSystem'
import * as stories from './DesignSystem.stories'

describe('DesignSystem', () => {
  it('has one h1 and sets the document title', () => {
    render(<DesignSystem />)
    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1)
    expect(document.title).toBe(pageTitle('Design system'))
  })

  it('lists all four scenes, each with its roles and contrast results', () => {
    render(<DesignSystem />)
    const section = screen.getByRole('region', { name: 'Scenes' })
    for (const scene of SCENES) {
      const card = within(section).getByRole('region', { name: `scene-${scene}` })
      expect(card).toHaveClass(`scene-${scene}`)
      expect(within(card).getAllByText(/Pass \(min/).length).toBe(3)
      expect(within(card).getByText(/Decorative, not checked/)).toBeInTheDocument()
    }
  })

  it('shows every text size token', () => {
    render(<DesignSystem />)
    const section = screen.getByRole('region', { name: 'Type' })
    for (const token of tokensIn('text')) {
      expect(within(section).getByText(`text-${token.path.at(-1)}`)).toBeInTheDocument()
    }
  })

  it('links to the Storybook under the base URL', () => {
    render(<DesignSystem />)
    for (const link of screen.getAllByRole('link', { name: /Storybook/ })) {
      expect(link).toHaveAttribute('href', `${import.meta.env.BASE_URL}storybook/`)
    }
  })

  it('has no axe violations', async () => {
    const { container } = render(<DesignSystem />)
    await expectNoAxeViolations(container)
  })
})

describeStoriesAxe(stories)
