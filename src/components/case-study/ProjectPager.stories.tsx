import type { Meta, StoryObj } from '@storybook/react-vite'
import { projects } from '../../content/projects'
import { withMemoryRouter } from '../../stories/withMemoryRouter'
import { ProjectPager } from './ProjectPager'

const meta = {
  title: 'CaseStudy/ProjectPager',
  component: ProjectPager,
  parameters: { layout: 'fullscreen' },
  decorators: [withMemoryRouter()],
} satisfies Meta<typeof ProjectPager>

export default meta
type Story = StoryObj<typeof meta>

/** The first project has only a next link, kept on the right. */
export const First: Story = { args: { slug: projects[0]?.slug ?? '' } }

/** A middle project links both ways. */
export const Middle: Story = { args: { slug: projects[2]?.slug ?? '' } }

/** The last project has only a previous link; the list does not wrap around. */
export const Last: Story = { args: { slug: projects.at(-1)?.slug ?? '' } }
