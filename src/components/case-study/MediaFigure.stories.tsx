import type { Meta, StoryObj } from '@storybook/react-vite'
import { firstVideo, imageWhere, studyFor } from './fixtures'
import { MediaFigure, MediaGroup } from './MediaFigure'

const meta = {
  title: 'CaseStudy/MediaFigure',
  component: MediaFigure,
  parameters: { layout: 'fullscreen' },
  decorators: [
    (Story) => (
      <div className="scene-blush grid gap-10 p-6">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof MediaFigure>

export default meta
type Story = StoryObj<typeof meta>

/** An image with alt text and a caption. It loads lazily and reserves its space. */
export const Image: Story = {
  args: { media: imageWhere((image) => !image.background && !image.fullSize) },
}

/** A drawing with light strokes on a transparent background sits on the ink scene. */
export const OnDarkSurface: Story = {
  args: { media: imageWhere((image) => image.background === 'dark') },
}

/** A diagram too detailed for the column width links to the full-size file. */
export const FullSizeLink: Story = {
  args: { media: imageWhere((image) => image.fullSize === true) },
}

/** A screen recording: native controls, no autoplay, and a text description of what happens. */
export const Video: Story = { args: { media: firstVideo() } }

/** Low and high fidelity side by side from `md` up. */
export const PairLayout: Story = {
  args: { media: firstVideo() },
  render: () => {
    const step = studyFor('preferred-bank-account').study.process.steps.find(
      (s) => s.mediaLayout === 'pair',
    )
    return <MediaGroup media={step?.media} layout="pair" />
  },
}

/** Phone-sized screens and videos, up to three per row. */
export const GridLayout: Story = {
  args: { media: firstVideo() },
  render: () => {
    const { solution } = studyFor('in-app-video-call').study
    return <MediaGroup media={solution?.media} layout="grid" />
  },
}

/** A desktop screen across three quarters beside a phone screen, at about the same height. */
export const DesktopMobileLayout: Story = {
  args: { media: firstVideo() },
  render: () => {
    const { problem } = studyFor('adaptive-tables').study
    return <MediaGroup media={problem.media} layout="desktop-mobile" />
  },
}
