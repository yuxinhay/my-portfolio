import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { expectNoAxeViolations } from '../../test/axe'
import { describeStoriesAxe } from '../../test/stories'
import { Link } from './Link'
import * as stories from './Link.stories'

describe('Link', () => {
  it('renders an anchor with the given href', () => {
    render(<Link href="/projects">Projects</Link>)
    expect(screen.getByRole('link', { name: 'Projects' })).toHaveAttribute('href', '/projects')
  })

  it('is underlined, so it does not rely on colour alone', () => {
    render(<Link href="#a">A</Link>)
    expect(screen.getByRole('link')).toHaveClass('underline', 'text-scene-accent')
  })

  it('is reachable with the keyboard and shows the scene focus ring', async () => {
    const user = userEvent.setup()
    render(<Link href="#a">A</Link>)
    await user.tab()
    const link = screen.getByRole('link')
    expect(link).toHaveFocus()
    expect(link).toHaveClass('focus-visible:outline-scene-focus')
  })

  it('passes through anchor attributes', () => {
    render(
      <Link href="https://example.com" rel="noreferrer" target="_blank">
        External
      </Link>,
    )
    expect(screen.getByRole('link')).toHaveAttribute('rel', 'noreferrer')
  })

  it('has no axe violations', async () => {
    const { container } = render(<Link href="#a">Read the case study</Link>)
    await expectNoAxeViolations(container)
  })
})

describeStoriesAxe(stories)
