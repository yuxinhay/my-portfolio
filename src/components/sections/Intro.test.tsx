import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { intro } from '../../content/intro'
import { site } from '../../content/site'
import { expectNoAxeViolations } from '../../test/axe'
import { describeStoriesAxe } from '../../test/stories'
import { Intro } from './Intro'
import * as stories from './Intro.stories'

describe('Intro', () => {
  it("is named by the page's only h1, the owner's name", () => {
    render(<Intro />)
    expect(screen.getByRole('region', { name: site.name })).toHaveAttribute('id', 'intro')
    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1)
  })

  it('reads the headline without the decorative bar', () => {
    render(<Intro />)
    const headline = screen.getByText('UX Designer').closest('p')
    expect(headline).toHaveTextContent('UX Designer | , Product Manager')
    expect(screen.getByText('|')).toHaveAttribute('aria-hidden', 'true')
  })

  it('renders the tagline, profile and location', () => {
    render(<Intro />)
    expect(screen.getByText(intro.tagline)).toBeInTheDocument()
    for (const paragraph of intro.profile) expect(screen.getByText(paragraph)).toBeInTheDocument()
    expect(screen.getByText('Based in Singapore')).toBeInTheDocument()
  })

  it('has no axe violations', async () => {
    const { container } = render(<Intro />)
    await expectNoAxeViolations(container)
  })
})

describeStoriesAxe(stories)
