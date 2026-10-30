import { useEffect, useState } from 'react'
import type { RefObject } from 'react'

/** Share of an element that must be on screen to count as seen. */
export const IN_VIEW_THRESHOLD = 0.5

/**
 * True once the element has been at least half on screen, and from then on. `enabled: false`
 * skips the observer (and stays false), e.g. when nothing will animate.
 */
export function useInViewOnce(ref: RefObject<Element | null>, enabled = true): boolean {
  const [seen, setSeen] = useState(false)
  useEffect(() => {
    const element = ref.current
    if (!enabled || seen || !element || typeof IntersectionObserver === 'undefined') return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return
        observer.disconnect()
        setSeen(true)
      },
      { threshold: IN_VIEW_THRESHOLD },
    )
    observer.observe(element)
    return () => observer.disconnect()
  }, [ref, enabled, seen])
  return seen
}
