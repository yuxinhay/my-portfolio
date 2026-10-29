import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { expectNoAxeViolations } from '../../test/axe'
import { describeStoriesAxe } from '../../test/stories'
import { Blocks } from './Blocks'
import * as stories from './Blocks.stories'

describe('Blocks', () => {
  it('renders strings as paragraphs and lists as bulleted lists', () => {
    const { container } = render(<Blocks blocks={['One.', { list: ['A', 'B'] }, 'Two.']} />)
    expect(container.querySelectorAll('p')).toHaveLength(2)
    expect(screen.getAllByRole('listitem').map((item) => item.textContent)).toEqual(['A', 'B'])
  })

  it('renders definitions as a description list', () => {
    const { container } = render(
      <Blocks blocks={[{ definitions: [{ term: 'A', detail: 'Alpha' }] }]} />,
    )
    expect(container.querySelector('dt')).toHaveTextContent('A')
    expect(container.querySelector('dd')).toHaveTextContent('Alpha')
  })

  it('shows a tag and fills the card of a featured term', () => {
    const { container } = render(
      <Blocks
        blocks={[
          {
            definitions: [
              { term: 'A', detail: 'Alpha', tag: 'Sole designer', featured: true },
              { term: 'B', detail: 'Beta', tag: 'Co-designer' },
            ],
          },
        ]}
      />,
    )
    const [featured, plain] = container.querySelectorAll('dl > div')
    expect(featured).toHaveClass('scene-pink')
    expect(featured).toHaveTextContent('Sole designer')
    expect(plain).toHaveClass('bg-scene-surface')
    expect(plain).not.toHaveClass('scene-pink')
    expect(plain).toHaveTextContent('Co-designer')
  })

  it('renders nothing for no blocks', () => {
    const { container } = render(<Blocks blocks={[]} />)
    expect(container).toBeEmptyDOMElement()
  })

  it('has no axe violations', async () => {
    const { container } = render(
      <Blocks
        blocks={[
          'Text',
          { list: ['Item'] },
          { definitions: [{ term: 'A', detail: 'Alpha', tag: 'Sole designer', featured: true }] },
        ]}
      />,
    )
    await expectNoAxeViolations(container)
  })
})

describeStoriesAxe(stories)
