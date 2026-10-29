import type { Meta, StoryObj } from '@storybook/react-vite'
import { AllScenes } from '../../stories/AllScenes'
import { studyFor } from './fixtures'
import { InsightList } from './InsightList'

const members = studyFor('in-app-video-call').study.process.steps.find((s) => s.insights)?.insights
const colleagues = studyFor('adaptive-tables').study.process.steps.find((s) => s.insights)?.insights
if (!members || !colleagues) throw new Error('Missing insights in the case studies')

const meta = {
  title: 'CaseStudy/InsightList',
  component: InsightList,
  render: (args) => (
    <AllScenes>
      <InsightList {...args} />
    </AllScenes>
  ),
} satisfies Meta<typeof InsightList>

export default meta
type Story = StoryObj<typeof meta>

/** Quotes from member interviews (in-app video call). */
export const FromMembers: Story = { args: { insights: members } }

/** Feedback from colleagues on the frozen-column guidelines (adaptive tables). */
export const FromColleagues: Story = { args: { insights: colleagues } }
