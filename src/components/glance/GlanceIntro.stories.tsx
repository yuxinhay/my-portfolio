import type { Meta, StoryObj } from '@storybook/react-vite'
import { withMemoryRouter } from '../../stories/withMemoryRouter'
import { GLANCE_SEEN_KEY } from './glanceStorage'
import { GlanceIntro } from './GlanceIntro'

/**
 * The Replay button and the intro it opens, as on the home page. The intro opens by itself only on
 * a visitor's first visit; "First visit" forgets that this browser has seen it.
 */
const meta = {
  title: 'Glance/GlanceIntro',
  component: GlanceIntro,
  decorators: [
    (Story) => (
      <div className="scene-blush p-6">
        <Story />
      </div>
    ),
    withMemoryRouter('/'),
  ],
} satisfies Meta<typeof GlanceIntro>

export default meta
type Story = StoryObj<typeof meta>

/** A returning visitor: only the Replay button. */
export const ReturningVisitor: Story = {
  decorators: [
    (Story) => {
      localStorage.setItem(GLANCE_SEEN_KEY, '1')
      return <Story />
    },
  ],
}

export const FirstVisit: Story = {
  decorators: [
    (Story) => {
      localStorage.removeItem(GLANCE_SEEN_KEY)
      return <Story />
    },
  ],
}
