import type { Meta, StoryObj } from '@storybook/react-vite'
import { AllScenes } from '../../stories/AllScenes'
import { Tag } from './Tag'

const SKILLS = ['Interaction design', 'React', 'TypeScript', 'Accessibility']

const meta = {
  title: 'UI/Tag',
  component: Tag,
  args: { children: 'Interaction design' },
  render: (args) => (
    <AllScenes>
      <Tag {...args} />
    </AllScenes>
  ),
} satisfies Meta<typeof Tag>

export default meta
type Story = StoryObj<typeof meta>

export const Outline: Story = { args: { variant: 'outline' } }

export const Solid: Story = { args: { variant: 'solid' } }

/** Groups of tags are a list, so screen readers announce the count. */
export const List: Story = {
  render: () => (
    <AllScenes>
      <ul aria-label="Skills" className="flex flex-wrap gap-2">
        {SKILLS.map((skill, i) => (
          <li key={skill}>
            <Tag variant={i === 0 ? 'solid' : 'outline'}>{skill}</Tag>
          </li>
        ))}
      </ul>
    </AllScenes>
  ),
}
