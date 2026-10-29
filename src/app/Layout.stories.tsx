import type { Meta, StoryObj } from '@storybook/react-vite'
import { AppAt } from '../stories/AppAt'

/**
 * The full page shell with every route. Links navigate inside the story. Press Tab to reveal the
 * skip link; narrow the canvas below 48rem for the mobile menu.
 */
const meta = {
  title: 'Layout/Layout',
  component: AppAt,
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof AppAt>

export default meta
type Story = StoryObj<typeof meta>

export const Home: Story = { args: { path: '/' } }

export const DesignSystem: Story = { args: { path: '/design-system' } }

export const HowIBuiltThis: Story = { args: { path: '/how-i-built-this' } }

export const ProjectDetail: Story = { args: { path: '/projects/flowcentral' } }

export const UnknownProject: Story = { args: { path: '/projects/no-such-project' } }

export const NotFound: Story = { args: { path: '/no-such-page' } }
