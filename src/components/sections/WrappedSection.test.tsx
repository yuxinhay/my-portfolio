import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { expectNoAxeViolations } from '../../test/axe'
import { describeStoriesAxe } from '../../test/stories'
import { WrappedSection } from './WrappedSection'
import * as stories from './WrappedSection.stories'

describe('WrappedSection', () => {
  it('is a focusable region named by its h2, in the given scene', () => {
    render(
      <WrappedSection id="projects" scene="cobalt" title="Projects">
        <p>Content</p>
      </WrappedSection>,
    )
    const region = screen.getByRole('region', { name: 'Projects' })
    expect(region).toHaveAttribute('id', 'projects')
    expect(region).toHaveAttribute('tabindex', '-1')
    expect(region).toHaveClass('scene-cobalt')
    expect(screen.getByRole('heading', { level: 2, name: 'Projects' })).toHaveAttribute(
      'id',
      'projects-title',
    )
  })

  it('renders a programmatically focusable h1 at level 1', () => {
    render(<WrappedSection id="intro" scene="blush" level={1} title="Yuxin HAY" />)
    expect(screen.getByRole('heading', { level: 1, name: 'Yuxin HAY' })).toHaveAttribute(
      'tabindex',
      '-1',
    )
  })

  it('has no axe violations', async () => {
    const { container } = render(<WrappedSection id="x" scene="ink" title="Title" />)
    await expectNoAxeViolations(container)
  })
})

describeStoriesAxe(stories)
