import type { Meta, StoryObj } from '@storybook/react-vite'
import { AllScenes } from '../../stories/AllScenes'
import { Link } from './Link'
import { Text } from './Text'

const meta = {
  title: 'UI/Link',
  component: Link,
  args: { href: '#case-study', children: 'Read the case study' },
  render: (args) => (
    <AllScenes>
      <Link {...args} />
    </AllScenes>
  ),
} satisfies Meta<typeof Link>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const InText: Story = {
  render: (args) => (
    <AllScenes>
      <Text className="max-w-prose">
        Shipped a design system used by four product teams. <Link {...args} /> for the process.
      </Text>
      <Text variant="small">
        Small text with a <Link href="#source">link to the source</Link>.
      </Text>
    </AllScenes>
  ),
}
