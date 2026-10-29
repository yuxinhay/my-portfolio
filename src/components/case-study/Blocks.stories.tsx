import type { Meta, StoryObj } from '@storybook/react-vite'
import { AllScenes } from '../../stories/AllScenes'
import { Blocks } from './Blocks'
import { studyFor } from './fixtures'

const meta = {
  title: 'CaseStudy/Blocks',
  component: Blocks,
  render: (args) => (
    <AllScenes>
      <Blocks {...args} />
    </AllScenes>
  ),
} satisfies Meta<typeof Blocks>

export default meta
type Story = StoryObj<typeof meta>

/** Paragraphs at a readable measure. */
export const Paragraphs: Story = {
  args: { blocks: studyFor('adaptive-tables').study.problem.body },
}

/** A paragraph followed by a bulleted list. */
export const WithList: Story = {
  args: { blocks: studyFor('preferred-bank-account').study.problem.body },
}

/** Terms as cards; the featured one is filled and tagged, so the emphasis is also in text. */
export const Definitions: Story = {
  args: {
    blocks: studyFor('preferred-bank-account').study.problem.body.filter(
      (block) => typeof block === 'object' && 'definitions' in block,
    ),
  },
}
