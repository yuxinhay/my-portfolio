import type { Meta, StoryObj } from '@storybook/react-vite'
import { Text } from '../ui/Text'
import { SCENES } from '../ui/styles'
import { WrappedSection } from './WrappedSection'

const meta = {
  title: 'Sections/WrappedSection',
  component: WrappedSection,
  parameters: { layout: 'fullscreen' },
  args: { id: 'example', scene: 'blush', title: 'Section title' },
} satisfies Meta<typeof WrappedSection>

export default meta
type Story = StoryObj<typeof meta>

/** The shell every home section uses: a full-bleed scene named by its h2. */
export const Default: Story = {
  args: { children: <Text className="max-w-prose">Section content goes here.</Text> },
}

/** The same shell in each scene. */
export const EveryScene: Story = {
  render: () => (
    <>
      {SCENES.map((scene) => (
        <WrappedSection key={scene} id={`scene-${scene}-example`} scene={scene} title={scene}>
          <Text>scene-{scene}</Text>
        </WrappedSection>
      ))}
    </>
  ),
}
