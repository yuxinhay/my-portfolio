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

  it('renders nothing for no blocks', () => {
    const { container } = render(<Blocks blocks={[]} />)
    expect(container).toBeEmptyDOMElement()
  })

  it('has no axe violations', async () => {
    const { container } = render(<Blocks blocks={['Text', { list: ['Item'] }]} />)
    await expectNoAxeViolations(container)
  })
})

describeStoriesAxe(stories)
