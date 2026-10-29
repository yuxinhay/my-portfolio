import type { Meta, StoryObj } from '@storybook/react-vite'
import { HowIBuiltThis } from './HowIBuiltThis'

const meta = {
  title: 'Pages/HowIBuiltThis',
  component: HowIBuiltThis,
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof HowIBuiltThis>

export default meta
type Story = StoryObj<typeof meta>

/** The process write-up; plan steps, quality gates and ADRs are read from the repo docs. */
export const Default: Story = {}
