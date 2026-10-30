import type { Meta, StoryObj } from '@storybook/react-vite'
import { studyFor } from './fixtures'
import { ProcessSteps } from './ProcessSteps'

const meta = {
  title: 'CaseStudy/ProcessSteps',
  component: ProcessSteps,
  parameters: { layout: 'fullscreen' },
  decorators: [
    (Story) => (
      <div className="scene-ink p-6">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ProcessSteps>

export default meta
type Story = StoryObj<typeof meta>

/** Numbered steps with text and media, as in the UX case studies (shown on the ink scene). */
export const WithMedia: Story = {
  args: { steps: studyFor('adaptive-tables').study.process.steps },
}

/** Unnumbered, text-only areas of work, as in the PM case studies. */
export const Unnumbered: Story = {
  args: { steps: studyFor('made-in-cpf').study.process.steps, numbered: false },
}

/** Unnumbered areas with a flow diagram (the FAST operating model), from flowCentral. */
export const UnnumberedWithFlow: Story = {
  args: { steps: studyFor('flowcentral').study.process.steps, numbered: false },
}
