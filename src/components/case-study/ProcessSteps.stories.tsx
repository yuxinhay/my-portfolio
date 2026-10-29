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

/** Steps with text and media, as in the UX case studies (shown on the ink scene). */
export const WithMedia: Story = {
  args: { steps: studyFor('adaptive-tables').study.process.steps },
}

/** Text-only steps, as in the PM case studies. */
export const TextOnly: Story = {
  args: { steps: studyFor('made-in-cpf').study.process.steps },
}
