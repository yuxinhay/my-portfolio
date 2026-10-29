import type { Meta, StoryObj } from '@storybook/react-vite'
import { TopSkills } from './TopSkills'

const meta = {
  title: 'Sections/TopSkills',
  component: TopSkills,
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof TopSkills>

export default meta
type Story = StoryObj<typeof meta>

/** Headline skills, then every skill by group, from `src/content/skills.ts`. No levels. */
export const Default: Story = {}

/** Without headline skills, only the grouped lists show. */
export const GroupsOnly: Story = { args: { top: [] } }
