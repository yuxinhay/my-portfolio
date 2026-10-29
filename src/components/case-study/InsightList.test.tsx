import { render, screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { expectNoAxeViolations } from '../../test/axe'
import { describeStoriesAxe } from '../../test/stories'
import { InsightList } from './InsightList'
import * as stories from './InsightList.stories'

const insights = { heading: 'Insights from members', quotes: ['First quote.', 'Second quote.'] }

describe('InsightList', () => {
  it('renders a heading and a numbered list of quotes', () => {
    render(<InsightList insights={insights} />)
    expect(screen.getByRole('heading', { level: 4, name: 'Insights from members' })).toBeVisible()
    const items = within(screen.getByRole('list')).getAllByRole('listitem')
    expect(items).toHaveLength(2)
    expect(items[0]?.querySelector('blockquote')).toHaveTextContent('“First quote.”')
  })

  it('hides the visible "#n" badges from screen readers', () => {
    render(<InsightList insights={insights} />)
    expect(screen.getByText('#2')).toHaveAttribute('aria-hidden', 'true')
  })

  it('has no axe violations', async () => {
    const { container } = render(<InsightList insights={insights} />)
    await expectNoAxeViolations(container)
  })
})

describeStoriesAxe(stories)
