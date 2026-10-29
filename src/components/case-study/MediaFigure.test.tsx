import { render, screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { expectNoAxeViolations } from '../../test/axe'
import { describeStoriesAxe } from '../../test/stories'
import { firstVideo, imageWhere } from './fixtures'
import { MediaFigure, MediaGroup } from './MediaFigure'
import * as stories from './MediaFigure.stories'

describe('MediaFigure', () => {
  it('renders an image in a figure with its caption, with size and lazy loading', () => {
    const image = imageWhere((m) => !m.background && !m.fullSize)
    render(<MediaFigure media={image} />)
    const figure = screen.getByRole('figure')
    expect(within(figure).getByText(image.caption).closest('figcaption')).toBeInTheDocument()
    const img = within(figure).getByRole('img', { name: image.alt })
    expect(img).toHaveAttribute('src', image.src)
    expect(img).toHaveAttribute('width', String(image.width))
    expect(img).toHaveAttribute('height', String(image.height))
    expect(img).toHaveAttribute('loading', 'lazy')
    expect(img).toHaveAttribute('decoding', 'async')
  })

  it('puts dark-background drawings on the ink scene', () => {
    const image = imageWhere((m) => m.background === 'dark')
    render(<MediaFigure media={image} />)
    expect(screen.getByRole('img').parentElement).toHaveClass('scene-ink')
  })

  it('links detailed diagrams to the full-size file', () => {
    const image = imageWhere((m) => m.fullSize === true)
    render(<MediaFigure media={image} />)
    expect(screen.getByRole('link', { name: 'Open the full-size image' })).toHaveAttribute(
      'href',
      image.src,
    )
  })

  it('renders a video with controls, no autoplay attribute or loop, and a linked text description', () => {
    const video = firstVideo()
    const { container } = render(<MediaFigure media={video} />)
    const element = container.querySelector('video')
    expect(element).not.toBeNull()
    expect(element).toHaveAttribute('controls')
    expect(element).toHaveAttribute('preload', 'none')
    expect(element).toHaveAttribute('poster', video.poster)
    expect(element).not.toHaveAttribute('autoplay')
    expect(element).not.toHaveAttribute('loop')
    expect(element?.muted).toBe(true)
    expect(element?.querySelector('source')).toHaveAttribute('src', video.src)
    const description = screen.getByText(video.description, { exact: false })
    expect(element).toHaveAttribute('aria-describedby', description.id)
  })

  it('shows the video label above the video', () => {
    const video = firstVideo()
    const { container } = render(<MediaFigure media={video} />)
    const label = screen.getByText('Prototype video')
    expect(label.compareDocumentPosition(container.querySelector('video')!)).toBe(
      Node.DOCUMENT_POSITION_FOLLOWING,
    )
  })

  it('shows a framed video in its device screen, with the ring on the device', () => {
    const video = firstVideo()
    if (!video.frame) throw new Error('Expected a framed video')
    const { container } = render(<MediaFigure media={video} />)
    const frame = container.querySelector('img')
    expect(frame).toHaveAttribute('src', video.frame.src)
    expect(frame).toHaveAttribute('alt', '')
    const element = container.querySelector('video')
    expect(element).toHaveAttribute('width', String(video.frame.screen.width))
    expect(element?.style.left).toBe(`${(video.frame.screen.x / video.width) * 100}%`)
    expect(element?.parentElement).toHaveClass('focus-within:outline-solid')
  })

  it('gives the desktop screen three of four columns beside the phone screen', () => {
    const { container } = render(
      <MediaGroup
        media={[
          imageWhere((m) => m.background === undefined),
          imageWhere((m) => m.background === 'dark'),
        ]}
        layout="desktop-mobile"
      />,
    )
    expect(container.firstElementChild).toHaveClass('md:grid-cols-4', 'md:*:first:col-span-3')
    expect(screen.getAllByRole('figure')).toHaveLength(2)
  })

  it('renders nothing for an empty group', () => {
    const { container } = render(<MediaGroup media={[]} />)
    expect(container).toBeEmptyDOMElement()
  })

  it('has no axe violations', async () => {
    const { container } = render(
      <MediaGroup media={[imageWhere((m) => m.fullSize === true), firstVideo()]} layout="pair" />,
    )
    await expectNoAxeViolations(container)
  })
})

describeStoriesAxe(stories)
