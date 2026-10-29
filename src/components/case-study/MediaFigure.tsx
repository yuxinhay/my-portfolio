import { useId, useRef } from 'react'
import type { CSSProperties } from 'react'
import type {
  DeviceFrame,
  ImageMedia,
  Media,
  MediaLayout,
  VideoMedia,
} from '../../content/caseStudies'
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
function Video({
  media,
  descriptionId,
  className = MEDIA,
  style,
}: {
  media: VideoMedia
  descriptionId: string
  className?: string
  style?: CSSProperties
}) {
  const ref = useRef<HTMLVideoElement>(null)
  usePlayInView(ref)
  return (
    <video
      ref={ref}
      style={style}
      controls
      muted
      playsInline
      preload="none"
      poster={media.poster}
      width={media.frame?.screen.width ?? media.width}
      height={media.frame?.screen.height ?? media.height}
      aria-describedby={descriptionId}
      className={className}
    >
      <source src={media.src} type="video/mp4" />
      <Link href={media.src}>Download the video</Link>
    </video>
  )
}

// FOCUS_RING, applied when anything inside (the video or its controls) has focus. Written out in
// full because Tailwind only generates class names it can see in the source.
const FOCUS_WITHIN_RING =
  'focus-within:outline-(length:--border-focus) focus-within:outline-offset-(length:--border-focus) focus-within:outline-scene-focus focus-within:outline-solid'

const percent = (part: number, whole: number) => `${(part / whole) * 100}%`

/**
 * A video shown in the screen of its device frame. The frame image sets the size; the video is
 * placed over the screen hole by percentages of the frame, so the two scale together. The video's
 * own focus ring would land on the black bezel, so the whole device shows the ring instead.
 */
function FramedVideo({
  media,
  frame,
  descriptionId,
}: {
  media: VideoMedia
  frame: DeviceFrame
  descriptionId: string
}) {
  const { x, y, width, height } = frame.screen
  return (
    <div className={cx('relative max-w-full rounded-card', FOCUS_WITHIN_RING)}>
      <img
        src={frame.src}
        alt=""
        width={media.width}
        height={media.height}
        loading="lazy"
        decoding="async"
        className="block h-auto max-w-full"
      />
      <Video
        media={media}
        descriptionId={descriptionId}
        className="absolute block focus-visible:outline-hidden"
        style={{
          left: percent(x, media.width),
          top: percent(y, media.height),
          width: percent(width, media.width),
          height: percent(height, media.height),
        }}
      />
    </div>
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
        ) : media.frame ? (
          <FramedVideo media={media} frame={media.frame} descriptionId={descriptionId} />
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
  'desktop-mobile': 'grid gap-10 md:grid-cols-4 md:*:first:col-span-3',
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
