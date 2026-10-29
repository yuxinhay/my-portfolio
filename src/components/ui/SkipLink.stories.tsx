import type { Meta, StoryObj } from '@storybook/react-vite'
import { AllScenes } from '../../stories/AllScenes'
import { SkipLink } from './SkipLink'
import { Text } from './Text'

const meta = {
  title: 'UI/SkipLink',
  component: SkipLink,
} satisfies Meta<typeof SkipLink>

export default meta
type Story = StoryObj<typeof meta>

/** Press Tab inside the canvas to reveal the link; it stays hidden until focused. */
export const Default: Story = {
  render: () => (
    <AllScenes>
      {(scene) => (
        <>
          <SkipLink href={`#content-${scene}`}>Skip to {scene} content</SkipLink>
          <Text id={`content-${scene}`} tabIndex={-1}>
            Target content for the {scene} scene. Tab to the skip link, then press Enter.
          </Text>
        </>
      )}
    </AllScenes>
  ),
}

/** Focuses the first skip link on load, to review the revealed look and focus ring. */
export const Focused: Story = {
  ...Default,
  play: ({ canvasElement }) => {
    canvasElement.querySelector('a')?.focus()
  },
}
