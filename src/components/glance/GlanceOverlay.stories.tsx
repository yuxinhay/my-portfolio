import type { Meta, StoryObj } from '@storybook/react-vite'
import { GlanceOverlay } from './GlanceOverlay'

/**
 * The At a glance dialog, open on each card. Use Next, Back, the dots, the arrow keys or a swipe
 * to move; Skip, Escape or "Explore my work" close it (reload the story to open it again).
 */
const meta = {
  title: 'Glance/GlanceOverlay',
  component: GlanceOverlay,
  parameters: { layout: 'fullscreen' },
  args: { onClose: () => {} },
} satisfies Meta<typeof GlanceOverlay>

export default meta
type Story = StoryObj<typeof meta>

export const Card1Hello: Story = {}
export const Card2Career: Story = { args: { initialIndex: 1 } }
export const Card3AiProduct: Story = { args: { initialIndex: 2 } }
export const Card4Innovation: Story = { args: { initialIndex: 3 } }
export const Card5RealPeople: Story = { args: { initialIndex: 4 } }
/** The last card: the main button reads "Explore my work" and closes the dialog. */
export const Card6TopSkills: Story = { args: { initialIndex: 5 } }
