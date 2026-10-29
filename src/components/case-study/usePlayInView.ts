import { useEffect } from 'react'
import type { RefObject } from 'react'

const REDUCED_MOTION = '(prefers-reduced-motion: reduce)'

/** Share of the video that must be on screen before it plays. */
export const PLAY_THRESHOLD = 0.6

/**
 * Plays a muted video when it scrolls into view and pauses it when it leaves. It never starts
 * under `prefers-reduced-motion: reduce`, and once the visitor pauses it, it stays paused. A video
 * that has ended starts again from the beginning the next time it comes into view. The native
 * controls stay available throughout (WCAG 2.2.2).
 */
export function usePlayInView(ref: RefObject<HTMLVideoElement | null>): void {
  useEffect(() => {
    const video = ref.current
    if (!video || typeof IntersectionObserver === 'undefined') return
    if (window.matchMedia?.(REDUCED_MOTION).matches) return

    let pausedByVisitor = false
    let pausing = false
    const onPause = () => {
      if (!pausing && !video.ended) pausedByVisitor = true
      pausing = false
    }
    const onPlay = () => {
      pausedByVisitor = false
    }
    video.addEventListener('pause', onPause)
    video.addEventListener('play', onPlay)

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          if (pausedByVisitor) return
          if (video.ended) video.currentTime = 0
          video.muted = true
          // play() rejects if the browser blocks it; the poster and controls remain.
          video.play()?.catch(() => {})
        } else if (!video.paused) {
          pausing = true
          video.pause()
        }
      },
      { threshold: PLAY_THRESHOLD },
    )
    observer.observe(video)
    return () => {
      observer.disconnect()
      video.removeEventListener('pause', onPause)
      video.removeEventListener('play', onPlay)
    }
  }, [ref])
}
