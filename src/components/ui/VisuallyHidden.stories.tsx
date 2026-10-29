import type { Meta, StoryObj } from '@storybook/react-vite'
import { AllScenes } from '../../stories/AllScenes'
import { Link } from './Link'
import { Text } from './Text'
import { VisuallyHidden } from './VisuallyHidden'

const meta = {
  title: 'UI/VisuallyHidden',
  component: VisuallyHidden,
} satisfies Meta<typeof VisuallyHidden>

export default meta
type Story = StoryObj<typeof meta>

/** The link reads "Read more about the design system" to screen readers, "Read more" on screen. */
export const ExtraLinkContext: Story = {
  render: () => (
    <AllScenes>
      <Text>Design system for four teams.</Text>
      <Link href="#design-system">
        Read more <VisuallyHidden>about the design system</VisuallyHidden>
      </Link>
    </AllScenes>
  ),
}
