import type { Meta, StoryObj } from '@storybook/react-vite'
import { withMemoryRouter } from '../../stories/withMemoryRouter'
import { Nav } from './Nav'

const meta = {
  title: 'Layout/Nav',
  component: Nav,
  decorators: [
    (Story) => (
      <div className="scene-blush p-6">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Nav>

export default meta
type Story = StoryObj<typeof meta>

/** On the home page "Work" is current: underlined and `aria-current="page"`. */
export const Default: Story = { decorators: [withMemoryRouter('/')] }

export const OnDesignSystem: Story = { decorators: [withMemoryRouter('/design-system')] }
