import type { Meta, StoryObj } from '@storybook/react-vite'
import { withMemoryRouter } from '../../stories/withMemoryRouter'
import { CaseStudy } from './CaseStudy'
import { studyFor } from './fixtures'

const meta = {
  title: 'CaseStudy/CaseStudy',
  component: CaseStudy,
  parameters: { layout: 'fullscreen' },
  decorators: [withMemoryRouter()],
} satisfies Meta<typeof CaseStudy>

export default meta
type Story = StoryObj<typeof meta>

/** UX, shipped: flow charts, low- to high-fidelity pairs and a rollout section. */
export const PreferredBankAccount: Story = { args: studyFor('preferred-bank-account') }

/** UX, shipped: sketches on the ink surface, a prototype video and lessons. */
export const AdaptiveTables: Story = { args: studyFor('adaptive-tables') }

/** UX, concept: research, prioritisation and a prototype with three videos. */
export const InAppVideoCall: Story = { args: studyFor('in-app-video-call') }

/** PM: how the product was managed, ending in numbers. No media. */
export const FlowCentral: Story = { args: studyFor('flowcentral') }

/** Programme management: how the programme was run, ending in numbers. No media. */
export const MadeInCpf: Story = { args: studyFor('made-in-cpf') }
