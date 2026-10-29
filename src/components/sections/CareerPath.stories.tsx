import type { Meta, StoryObj } from '@storybook/react-vite'
import { CareerPath } from './CareerPath'

const meta = {
  title: 'Sections/CareerPath',
  component: CareerPath,
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof CareerPath>

export default meta
type Story = StoryObj<typeof meta>

/** Work and education, newest first, from `src/content/career.ts`. */
export const Default: Story = {}
