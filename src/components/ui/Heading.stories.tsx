import type { Meta, StoryObj } from '@storybook/react-vite'
import { AllScenes } from '../../stories/AllScenes'
import { Heading } from './Heading'

const meta = {
  title: 'UI/Heading',
  component: Heading,
  args: { level: 2, children: 'Your top skills' },
  render: (args) => (
    <AllScenes>
      <Heading {...args} />
    </AllScenes>
  ),
} satisfies Meta<typeof Heading>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

/** Each level with its default size. h4–h6 share the h3 size. */
export const Levels: Story = {
  render: () => (
    <AllScenes>
      <Heading level={1}>UX designer &amp; UI developer</Heading>
      <Heading level={2}>Your top skills</Heading>
      <Heading level={3}>Interaction design</Heading>
      <Heading level={4}>Level 4</Heading>
      <Heading level={5}>Level 5</Heading>
      <Heading level={6}>Level 6</Heading>
    </AllScenes>
  ),
}

/** The level follows the document outline; `size` sets the look. */
export const SizeIndependentOfLevel: Story = {
  render: () => (
    <AllScenes>
      <Heading level={1} size="display">
        Career <span className="text-scene-accent">Wrapped</span>
      </Heading>
      <Heading level={2} size="eyebrow">
        Your career path
      </Heading>
    </AllScenes>
  ),
}
