import type { Meta, StoryObj } from '@storybook/react-vite'
import { Footer } from './Footer'

const meta = {
  title: 'Layout/Footer',
  component: Footer,
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof Footer>

export default meta
type Story = StoryObj<typeof meta>

/** Contact links are placeholders until provided, so none are rendered. */
export const Default: Story = {}

/** Example data only, to show the layout once contact links exist. */
export const WithContactLinks: Story = {
  args: {
    contact: [
      { label: 'Email', href: 'mailto:hello@example.com' },
      { label: 'LinkedIn', href: 'https://www.linkedin.com/' },
      { label: 'GitHub', href: 'https://github.com/' },
    ],
  },
}
