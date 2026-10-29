import type { Meta, StoryObj } from '@storybook/react-vite'
import { Text } from '../ui/Text'
import { Page } from './Page'

const meta = {
  title: 'Layout/Page',
  component: Page,
  parameters: { layout: 'fullscreen' },
  args: {
    title: 'Design system',
    children: <Text>Page content goes here, below the page's only h1.</Text>,
  },
  decorators: [
    (Story) => (
      <div className="scene-blush">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Page>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
