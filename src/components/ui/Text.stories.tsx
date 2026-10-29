import type { Meta, StoryObj } from '@storybook/react-vite'
import { AllScenes } from '../../stories/AllScenes'
import { Text } from './Text'

const meta = {
  title: 'UI/Text',
  component: Text,
  args: { children: 'Shipped a design system used by four product teams.' },
  render: (args) => (
    <AllScenes>
      <Text {...args} />
    </AllScenes>
  ),
} satisfies Meta<typeof Text>

export default meta
type Story = StoryObj<typeof meta>

export const Body: Story = { args: { variant: 'body' } }

export const Small: Story = {
  args: { variant: 'small', children: 'Built with React, TypeScript and design tokens.' },
}

export const Eyebrow: Story = { args: { variant: 'eyebrow', children: 'Your career path' } }

export const Inline: Story = {
  render: () => (
    <AllScenes>
      <Text>
        Body text with an inline{' '}
        <Text as="span" variant="small">
          small span
        </Text>{' '}
        and an <strong className="text-scene-accent">accent highlight</strong>.
      </Text>
    </AllScenes>
  ),
}
