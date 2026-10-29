import { render, screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { certifications, featuredStats, moreStats } from '../../content/achievements'
import { expectNoAxeViolations } from '../../test/axe'
import { describeStoriesAxe } from '../../test/stories'
import { Achievements } from './Achievements'
import * as stories from './Achievements.stories'

describe('Achievements', () => {
  it('is a region named "Achievements"', () => {
    render(<Achievements />)
    expect(screen.getByRole('region', { name: 'Achievements' })).toHaveAttribute(
      'id',
      'achievements',
    )
  })

  it('reads each number and its label as one phrase', () => {
    render(<Achievements />)
    for (const { value, label } of [...featuredStats, ...moreStats]) {
      const paragraph = screen.getByText(label).closest('p')
      expect(paragraph).toHaveTextContent(`${value} ${label}`, { normalizeWhitespace: false })
    }
  })

  it('lists certifications under their h3, with years in <time>', () => {
    render(<Achievements />)
    const list = screen.getByRole('list', { name: 'Certifications and recognition' })
    const items = within(list).getAllByRole('listitem')
    expect(items).toHaveLength(certifications.length)
    expect(items[0]?.querySelector('time')).toHaveAttribute('datetime', '2025')
    expect(within(list).getByText('Certified ScrumMaster').closest('p')).toHaveTextContent(
      'Certified ScrumMaster, NUS-ISS (2024)',
    )
  })

  it('has no axe violations', async () => {
    const { container } = render(<Achievements />)
    await expectNoAxeViolations(container)
  })
})

describeStoriesAxe(stories)
