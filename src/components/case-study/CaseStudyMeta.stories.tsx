import type { Meta, StoryObj } from '@storybook/react-vite'
import { AllScenes } from '../../stories/AllScenes'
import { CaseStudyMeta } from './CaseStudyMeta'
import { studyFor } from './fixtures'

const pba = studyFor('preferred-bank-account')
const flowCentral = studyFor('flowcentral')

const meta = {
  title: 'CaseStudy/CaseStudyMeta',
  component: CaseStudyMeta,
  render: (args) => (
    <AllScenes>
      <CaseStudyMeta {...args} />
    </AllScenes>
  ),
} satisfies Meta<typeof CaseStudyMeta>

export default meta
type Story = StoryObj<typeof meta>

/** Role, when and status, with a note on the team. */
export const WithStatus: Story = {
  args: { project: pba.project, overview: pba.study.overview },
}

/** Projects without a status (the PM work) leave it out. */
export const WithoutStatus: Story = {
  args: { project: flowCentral.project, overview: flowCentral.study.overview },
}
