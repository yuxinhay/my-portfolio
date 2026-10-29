import type { Meta, StoryObj } from '@storybook/react-vite'
import { AllScenes } from '../../stories/AllScenes'
import { withMemoryRouter } from '../../stories/withMemoryRouter'
import { RouteLink } from './RouteLink'

const meta = {
  title: 'Layout/RouteLink',
  component: RouteLink,
  args: { to: '/design-system', children: 'See the design system' },
  decorators: [withMemoryRouter('/')],
  render: (args) => (
    <AllScenes>
      <RouteLink {...args} />
    </AllScenes>
  ),
} satisfies Meta<typeof RouteLink>

export default meta
type Story = StoryObj<typeof meta>

/** Looks exactly like the `Link` primitive; navigates client-side. */
export const Default: Story = {}
