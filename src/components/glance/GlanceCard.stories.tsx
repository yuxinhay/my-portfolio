import type { Meta, StoryObj } from '@storybook/react-vite'
import { glance } from '../../content/glance'
import type { GlanceCard as GlanceCardContent } from '../../content/glance'
import { GlanceCard } from './GlanceCard'

function card(id: string): GlanceCardContent {
  const found = glance.cards.find((c) => c.id === id)
  if (!found) throw new Error(`No card "${id}"`)
  return found
}

/**
 * The content of each At a glance card, outside the dialog, in the scene it uses there. `active`
 * starts the count-up of its numbers.
 */
const meta = {
  title: 'Glance/GlanceCard',
  component: GlanceCard,
  parameters: { layout: 'fullscreen' },
  args: { card: card('hello'), active: true },
  render: (args) => (
    <div className={`scene-${args.card.scene} p-6 sm:p-10`}>
      <GlanceCard {...args} />
    </div>
  ),
} satisfies Meta<typeof GlanceCard>

export default meta
type Story = StoryObj<typeof meta>

export const Hello: Story = {}
export const Career: Story = { args: { card: card('career') } }
export const AiProduct: Story = { args: { card: card('ai-product') } }
export const Innovation: Story = { args: { card: card('innovation') } }
export const RealPeople: Story = { args: { card: card('real-people') } }
export const TopSkills: Story = { args: { card: card('top-skills') } }
