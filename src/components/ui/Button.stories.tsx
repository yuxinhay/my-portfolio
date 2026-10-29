import type { Meta, StoryObj } from '@storybook/react-vite'
import { AllScenes } from '../../stories/AllScenes'
import { Button } from './Button'

const meta = {
  title: 'UI/Button',
  component: Button,
  args: { children: 'View project' },
  render: (args) => (
    <AllScenes>
      <Button {...args} />
    </AllScenes>
  ),
} satisfies Meta<typeof Button>

export default meta
type Story = StoryObj<typeof meta>

export const Primary: Story = { args: { variant: 'primary' } }

export const Secondary: Story = { args: { variant: 'secondary' } }

export const Pair: Story = {
  render: () => (
    <AllScenes>
      <div className="flex flex-wrap gap-4">
        <Button>Download CV</Button>
        <Button variant="secondary">Get in touch</Button>
      </div>
    </AllScenes>
  ),
}
