import type { Meta, StoryObj } from '@storybook/react-vite'
import { withMemoryRouter } from '../../stories/withMemoryRouter'
import { Header } from './Header'

const meta = {
  title: 'Layout/Header',
  component: Header,
  parameters: { layout: 'fullscreen' },
  decorators: [
    (Story) => (
      <div className="scene-blush">
        <Story />
      </div>
    ),
    withMemoryRouter('/'),
  ],
} satisfies Meta<typeof Header>

export default meta
type Story = StoryObj<typeof meta>

/** Narrow the canvas below 48rem (`md`) to see the Menu toggle replace the inline links. */
export const Default: Story = {}

/** The mobile menu opened by its toggle. Only visible below `md`; press Escape to close it. */
export const MenuOpen: Story = {
  play: ({ canvasElement }) => {
    canvasElement.querySelector<HTMLButtonElement>('button[aria-expanded]')?.click()
  },
}
