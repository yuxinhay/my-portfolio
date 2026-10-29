import { useId, useRef } from 'react'
import type { ImageMedia, Media, MediaLayout, VideoMedia } from '../../content/caseStudies'
import { Link } from '../ui/Link'
import { Tag } from '../ui/Tag'
import { Text } from '../ui/Text'
import { cx } from '../ui/styles'
import { usePlayInView } from './usePlayInView'

// Light-stroke drawings sit on the ink scene so they stay visible on the blush page.
const SURFACE: Record<NonNullable<Media['background']>, string> = {
  dark: 'scene-ink rounded-card p-4',
  light: 'scene-blush rounded-card p-4',
}

// width/height attributes reserve the space (no layout shift); CSS lets the media shrink to fit.
const MEDIA = 'block h-auto max-w-full rounded-sm'

function Image({ media }: { media: ImageMedia }) {
  return (
    <img
      src={media.src}
      alt={media.alt}
      width={media.width}
      height={media.height}
      loading="lazy"
      decoding="async"
      className={MEDIA}
    />
  )
}

/**
 * A screen recording without sound, with native controls and no loop. Nothing loads until it
 * scrolls into view and starts playing (or the visitor presses play); under reduced motion it
 * waits for the visitor. The text description is the alternative for video-only content.
 */
function Video({ media, descriptionId }: { media: VideoMedia; descriptionId: string }) {
  const ref = useRef<HTMLVideoElement>(null)
  usePlayInView(ref)
  return (
    <video
      ref={ref}
      controls
      muted
      playsInline
      preload="none"
      poster={media.poster}
      width={media.width}
      height={media.height}
      aria-describedby={descriptionId}
      className={MEDIA}
    >
      <source src={media.src} type="video/mp4" />
      <Link href={media.src}>Download the video</Link>
    </video>
  )
}

export interface MediaFigureProps {
  media: Media
}

/** One image or video with its caption, as a `<figure>`. */
export function MediaFigure({ media }: MediaFigureProps) {
  const descriptionId = useId()
  return (
    <figure className="grid content-start justify-items-start gap-3">
      {media.kind === 'video' && media.label && <Tag variant="solid">{media.label}</Tag>}
      <div className={cx('max-w-full', media.background && SURFACE[media.background])}>
        {media.kind === 'image' ? (
          <Image media={media} />
        ) : (
          <Video media={media} descriptionId={descriptionId} />
        )}
      </div>
      <figcaption className="grid gap-2">
        <Text variant="small">
          {media.caption}
          {media.kind === 'image' && media.fullSize && (
            <>
              {' '}
              <Link href={media.src}>Open the full-size image</Link>
            </>
          )}
        </Text>
        {media.kind === 'video' && (
          <Text variant="small" id={descriptionId}>
            <span className="font-bold">What happens in the video:</span> {media.description}
          </Text>
        )}
      </figcaption>
    </figure>
  )
}

const LAYOUT: Record<MediaLayout, string> = {
  stack: 'grid gap-10',
  pair: 'grid gap-10 md:grid-cols-2',
  grid: 'grid gap-10 sm:grid-cols-2 lg:grid-cols-3',
}

export interface MediaGroupProps {
  media: readonly Media[] | undefined
  layout?: MediaLayout | undefined
}

/** A group of figures in one of the media layouts. Renders nothing if there is no media. */
export function MediaGroup({ media, layout = 'stack' }: MediaGroupProps) {
  if (!media || media.length === 0) return null
  return (
    <div className={LAYOUT[layout]}>
      {media.map((item) => (
        <MediaFigure key={item.src} media={item} />
      ))}
    </div>
  )
}
