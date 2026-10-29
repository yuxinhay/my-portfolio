import { render, screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { expectNoAxeViolations } from '../../test/axe'
import { describeStoriesAxe } from '../../test/stories'
import { Footer } from './Footer'
import * as stories from './Footer.stories'

describe('Footer', () => {
  it('is the contentinfo landmark with the build line and a Storybook link', () => {
    render(<Footer />)
    const footer = screen.getByRole('contentinfo')
    expect(footer).toHaveTextContent(
      'Built with React, TypeScript, Vite and a token-driven design system.',
    )
    expect(within(footer).getByRole('link', { name: 'Browse the Storybook' })).toHaveAttribute(
      'href',
      `${import.meta.env.BASE_URL}storybook/`,
    )
  })

  it('renders the site contact links', () => {
    render(<Footer />)
    const contact = screen.getByRole('region', { name: 'Contact' })
    expect(within(contact).getByRole('link', { name: 'Email' })).toHaveAttribute(
      'href',
      'mailto:hay_yuxin@hotmail.com',
    )
    expect(within(contact).getByRole('link', { name: 'LinkedIn' })).toBeInTheDocument()
    expect(within(contact).getByRole('link', { name: 'Telegram' })).toBeInTheDocument()
  })

  it('renders no dead links while contact links are placeholders', () => {
    render(
      <Footer
        contact={[
          { label: 'Email', href: null },
          { label: 'GitHub', href: null },
        ]}
      />,
    )
    expect(screen.getByText('Contact links coming soon.')).toBeInTheDocument()
    expect(screen.getAllByRole('link')).toHaveLength(1)
  })

  it('renders only the contact links that have an href', () => {
    render(
      <Footer
        contact={[
          { label: 'Email', href: 'mailto:hello@example.com' },
          { label: 'LinkedIn', href: null },
        ]}
      />,
    )
    const contact = screen.getByRole('region', { name: 'Contact' })
    expect(within(contact).getByRole('link', { name: 'Email' })).toHaveAttribute(
      'href',
      'mailto:hello@example.com',
    )
    expect(within(contact).queryByRole('link', { name: 'LinkedIn' })).not.toBeInTheDocument()
    expect(screen.queryByText('Contact links coming soon.')).not.toBeInTheDocument()
  })

  it('has no axe violations', async () => {
    const { container } = render(<Footer />)
    await expectNoAxeViolations(container)
  })
})

describeStoriesAxe(stories)
