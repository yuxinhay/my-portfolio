import type { Meta, StoryObj } from '@storybook/react-vite'
import type { Flow } from '../../content/caseStudies'
import { studyFor } from './fixtures'
import { FlowDiagram } from './FlowDiagram'

/** The FAST operating model from the flowCentral case study. */
function fastFlow(): Flow {
  for (const step of studyFor('flowcentral').study.process.steps) {
    for (const block of step.body)
      if (typeof block === 'object' && 'flow' in block) return block.flow
  }
  throw new Error('No flow in the flowCentral case study')
}

const meta = {
  title: 'CaseStudy/FlowDiagram',
  component: FlowDiagram,
  parameters: { layout: 'fullscreen' },
  decorators: [
    (Story) => (
      <div className="scene-ink p-6">
        <div className="mx-auto max-w-5xl">
          <Story />
        </div>
      </div>
    ),
  ],
  args: { flow: fastFlow() },
} satisfies Meta<typeof FlowDiagram>

export default meta
type Story = StoryObj<typeof meta>

/** The FAST operating model on the ink scene, as in the flowCentral case study. */
export const Default: Story = {}
