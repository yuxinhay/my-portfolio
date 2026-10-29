import type { Meta, StoryObj } from '@storybook/react-vite'
import { GlanceOverlay } from './GlanceOverlay'

/**
 * The At a glance dialog, open on each card. Skip floats above the card's top right; Back, the
 * dots and Next share one row below it (on card 1 Back keeps its place, hidden). Use Next, Back,
 * the dots, the arrow keys or a swipe to move; Skip, Escape or "Explore my work" close it (reload
 * the story to open it again).
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

/**
 * The automatic first-visit opening: the backdrop, a beat (`duration.celebrate`), then the card
 * pops with one burst of confetti. With reduced motion turned on in the OS there is no confetti
 * and no pause: the dialog appears at once (reload the story to compare).
 */
export const FirstVisitConfetti: Story = { args: { celebrate: true } }

/** A replay: the normal pop entrance, no pause and no confetti. */
export const Replay: Story = { args: { celebrate: false } }
