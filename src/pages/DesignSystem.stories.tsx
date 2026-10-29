import type { Meta, StoryObj } from '@storybook/react-vite'
import { DesignSystem } from './DesignSystem'

const meta = {
  title: 'Pages/DesignSystem',
  component: DesignSystem,
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof DesignSystem>

export default meta
type Story = StoryObj<typeof meta>

/** The public tour of the design system: scenes, type, spacing, components and quality gates. */
export const Default: Story = {}
