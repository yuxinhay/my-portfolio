import type { Meta, StoryObj } from '@storybook/react-vite'
import { AllScenes } from '../../stories/AllScenes'
import { Card } from './Card'
import { Heading } from './Heading'
import { Link } from './Link'
import { SCENES } from './styles'
import { Tag } from './Tag'
import { Text } from './Text'

const meta = {
  title: 'UI/Card',
  component: Card,
} satisfies Meta<typeof Card>

export default meta
type Story = StoryObj<typeof meta>

/** Without `scene`, the card is outlined and takes the colours of the scene around it. */
export const Outlined: Story = {
  render: () => (
    <AllScenes>
      {(scene) => (
        <Card as="article" aria-labelledby={`card-${scene}-title`}>
          <Text variant="eyebrow">Project</Text>
          <Heading level={3} id={`card-${scene}-title`}>
            Design system for four teams
          </Heading>
          <Text>Tokens, components and docs that cut UI review time in half.</Text>
          <ul className="flex flex-wrap gap-2">
            <li>
              <Tag>React</Tag>
            </li>
            <li>
              <Tag>Design tokens</Tag>
            </li>
          </ul>
          <Link href="#case-study">Read the case study</Link>
        </Card>
      )}
    </AllScenes>
  ),
}

/** With `scene`, the card becomes its own scene, e.g. Wrapped-style stat cards. */
export const OwnScene: Story = {
  render: () => (
    <ul className="scene-blush grid gap-4 p-6 md:grid-cols-2">
      {SCENES.map((scene) => (
        <li key={scene} className="grid">
          <Card scene={scene}>
            <Text variant="eyebrow">Projects shipped</Text>
            <p className="text-stat leading-tight font-black tracking-display">12</p>
            <Text variant="small">scene-{scene}</Text>
          </Card>
        </li>
      ))}
    </ul>
  ),
}
