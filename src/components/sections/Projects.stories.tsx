import type { Meta, StoryObj } from '@storybook/react-vite'
import { withMemoryRouter } from '../../stories/withMemoryRouter'
import { Projects } from './Projects'

const meta = {
  title: 'Sections/Projects',
  component: Projects,
  parameters: { layout: 'fullscreen' },
  decorators: [withMemoryRouter()],
} satisfies Meta<typeof Projects>

export default meta
type Story = StoryObj<typeof meta>

/** Project cards from `src/content/projects.ts`; each title links to its project page. */
export const Default: Story = {}
