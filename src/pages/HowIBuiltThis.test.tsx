import { render, screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { plainText } from '../content/markdown'
import { adrs, planSteps, qualityGates } from '../content/process'
import { pageTitle } from '../content/site'
import { expectNoAxeViolations } from '../test/axe'
import { describeStoriesAxe } from '../test/stories'
import { HowIBuiltThis } from './HowIBuiltThis'
import * as stories from './HowIBuiltThis.stories'

describe('HowIBuiltThis', () => {
  it('has one h1 and sets the document title', () => {
    render(<HowIBuiltThis />)
    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1)
    expect(document.title).toBe(pageTitle('How I built this'))
  })

  it('lists every plan step with its status and pull request link', () => {
    render(<HowIBuiltThis />)
    const section = screen.getByRole('region', { name: 'Plan, step by step' })
    const items = within(section).getAllByRole('listitem')
    expect(items).toHaveLength(planSteps.length)
    for (const [index, step] of planSteps.entries()) {
      const item = items[index]
      expect(item).toHaveTextContent(plainText(step.title))
      expect(item).toHaveTextContent(step.status)
      if (step.pr) {
        expect(
          within(item!).getByRole('link', {
            name: `Step ${step.number}: pull request ${step.pr.label}`,
          }),
        ).toHaveAttribute('href', step.pr.href)
      }
    }
  })

  it('links every ADR on GitHub', () => {
    render(<HowIBuiltThis />)
    const section = screen.getByRole('region', { name: 'Decisions' })
    const links = within(section).getAllByRole('link')
    expect(links.map((link) => link.getAttribute('href'))).toEqual(adrs.map((adr) => adr.href))
    for (const link of links) {
      expect(link.getAttribute('href')).toMatch(
        /^https:\/\/github\.com\/yuxinhay\/my-portfolio\/blob\/main\/docs\/adr\/\d{4}-.+\.md$/,
      )
    }
  })

  it('shows the quality gates from the plan in a table', () => {
    render(<HowIBuiltThis />)
    const table = screen.getByRole('table')
    expect(within(table).getAllByRole('row')).toHaveLength(qualityGates.length + 1)
  })

  it('has no axe violations', async () => {
    const { container } = render(<HowIBuiltThis />)
    await expectNoAxeViolations(container)
  })
})

describeStoriesAxe(stories)
