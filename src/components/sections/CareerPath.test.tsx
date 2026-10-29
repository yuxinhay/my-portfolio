import { render, screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { career } from '../../content/career'
import { expectNoAxeViolations } from '../../test/axe'
import { describeStoriesAxe } from '../../test/stories'
import { CareerPath } from './CareerPath'
import * as stories from './CareerPath.stories'

describe('CareerPath', () => {
  it('is an ordered list of every entry, newest first, each with an h3 role', () => {
    render(<CareerPath />)
    const region = screen.getByRole('region', { name: 'Career path' })
    const list = within(region).getAllByRole('list')[0]
    expect(list?.tagName).toBe('OL')
    const roles = within(region)
      .getAllByRole('heading', { level: 3 })
      .map((heading) => heading.textContent)
    expect(roles).toEqual(career.map((entry) => entry.role))
  })

  it('marks dates up with <time>', () => {
    const { container } = render(<CareerPath />)
    const first = container.querySelector('li')
    expect(first).toHaveTextContent('Jan 2025 – present')
    expect(first?.querySelector('time')).toHaveAttribute('datetime', '2025-01')
    expect(screen.getByText('Jan 2023').closest('p')).toHaveTextContent('Jan 2023 – Dec 2024')
    // A single-year entry renders one date, not a range.
    const frank = screen.getByRole('heading', { name: 'Solution Developer' }).closest('li')
    expect(frank?.querySelectorAll('time')).toHaveLength(1)
  })

  it('labels education in text', () => {
    render(<CareerPath />)
    const nus = screen.getByRole('heading', { name: /^Bachelor of Computing/ }).closest('li')
    expect(nus).toHaveTextContent('2019 – 2023 · Education')
  })

  it('has no axe violations', async () => {
    const { container } = render(<CareerPath />)
    await expectNoAxeViolations(container)
  })
})

describeStoriesAxe(stories)
