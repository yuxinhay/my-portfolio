import type { Meta, StoryObj } from '@storybook/react-vite'
import { Achievements } from './Achievements'

const meta = {
  title: 'Sections/Achievements',
  component: Achievements,
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof Achievements>

export default meta
type Story = StoryObj<typeof meta>

/** Wrapped numbers and certifications from `src/content/achievements.ts`. */
export const Default: Story = {}
