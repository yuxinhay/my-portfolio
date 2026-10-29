import { render, screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { glance } from '../../content/glance'
import { expectNoAxeViolations } from '../../test/axe'
import { describeStoriesAxe } from '../../test/stories'
import { GlanceCard } from './GlanceCard'
import * as stories from './GlanceCard.stories'

const [hello, career, aiProduct, , realPeople, topSkills] = glance.cards

function renderCard(index: number) {
  const card = glance.cards[index]
  if (!card) throw new Error(`No card ${index}`)
  return render(<GlanceCard card={card} active />)
}

describe('GlanceCard', () => {
  it('opens with the name as a heading, the roles and the portrait', () => {
    if (hello?.kind !== 'hello') throw new Error('Card 1 is not the hello card')
    renderCard(0)
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('Yuxin Hay')
    expect(screen.getByRole('img', { name: 'Portrait of Yuxin Hay, smiling' })).toHaveAttribute(
      'decoding',
      'async',
    )
    expect(screen.getByText('UX Designer').closest('p')).toHaveTextContent(
      'UX Designer | , Product Manager',
    )
    expect(screen.getByText(hello.summary)).toBeInTheDocument()
  })

  it('reads the career title as one heading, with the final number', () => {
    if (career?.kind !== 'career') throw new Error('Card 2 is not the career card')
    renderCard(1)
    expect(screen.getByRole('heading', { level: 2 })).toHaveAccessibleName('3+ years at CPF Board')
    const steps = within(screen.getByRole('list')).getAllByRole('listitem')
    expect(steps.map((step) => step.textContent)).toEqual([
      '2023–24UX Designer',
      '2025–nowProduct Manager',
    ])
    expect(screen.getByText(/Designer/, { selector: 'p' })).toHaveTextContent(
      'Designer → to Product Manager',
    )
  })

  it('lists a funnel of numbers in order, each with its label', () => {
    renderCard(2)
    if (aiProduct?.kind !== 'stats') throw new Error('Card 3 is not a stats card')
    const list = screen.getByRole('list')
    expect(list.tagName).toBe('OL')
    expect(within(list).getAllByRole('listitem')).toHaveLength(3)
    expect(screen.getByText('flowCentral: agentic AI workflow platform')).toBeInTheDocument()
  })

  it('shows facts without a number as text', () => {
    if (realPeople?.kind !== 'stats') throw new Error('Card 5 is not a stats card')
    renderCard(4)
    expect(screen.getByRole('list').tagName).toBe('UL')
    expect(screen.getByText(/^Anti-scam measures/)).toBeInTheDocument()
  })

  it('numbers the top skills', () => {
    if (topSkills?.kind !== 'top') throw new Error('Card 6 is not the top card')
    renderCard(5)
    const items = within(screen.getByRole('list')).getAllByRole('listitem')
    expect(items.map((item) => item.textContent)).toEqual(topSkills.items)
    expect(screen.getByText(topSkills.footnote)).toBeInTheDocument()
  })

  it.each(glance.cards.map((card, index) => [card.id, index] as const))(
    '%s has no axe violations',
    async (_, index) => {
      const { container } = renderCard(index)
      await expectNoAxeViolations(container)
    },
  )
})

describeStoriesAxe(stories)
