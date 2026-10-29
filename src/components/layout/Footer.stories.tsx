import type { Meta, StoryObj } from '@storybook/react-vite'
import { Footer } from './Footer'

const meta = {
  title: 'Layout/Footer',
  component: Footer,
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof Footer>

export default meta
type Story = StoryObj<typeof meta>

/** The site's contact links from `src/content/site.ts`. */
export const Default: Story = {}

/** Before any contact link is provided: no dead links, just a note. */
export const LinksComingSoon: Story = {
  args: {
    contact: [
      { label: 'Email', href: null },
      { label: 'GitHub', href: null },
    ],
  },
}
