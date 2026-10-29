import type { Meta, StoryObj } from '@storybook/react-vite'
import { Intro } from './Intro'

const meta = {
  title: 'Sections/Intro',
  component: Intro,
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof Intro>

export default meta
type Story = StoryObj<typeof meta>

/** The opening scene with the content from `src/content/intro.ts`. Holds the page's h1. */
export const Default: Story = {}
