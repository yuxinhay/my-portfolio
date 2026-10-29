import { canAnimateInView } from './motion'

/** Marks a container whose children fade up as they scroll in (see `startReveals`). */
export const REVEAL_GROUP = 'data-reveal-group'

/** Later siblings wait one more `duration.stagger` each, up to this many steps. */
export const MAX_STAGGER = 6

/** A group's children; a list with several items reveals item by item instead. */
function targetsIn(group: Element): Element[] {
  return [...group.children].flatMap((child) =>
    (child instanceof HTMLUListElement || child instanceof HTMLOListElement) &&
    child.children.length > 1
      ? [...child.children]
      : [child],
  )
}

/**
 * Fade-up scroll reveals for every `[data-reveal-group]` under `root`. Each target is hidden until
 * it scrolls into view, then fades in with a small rise, once (the CSS is in `index.css`).
 *
 * Progressive enhancement: nothing is hidden unless this runs, an IntersectionObserver exists and
 * the visitor has not asked for reduced motion; it then marks `<html data-motion>`, and the CSS
 * only hides targets under that mark (and only while motion is allowed). Content that is focused
 * before it scrolls in, or that is already above the viewport (a `#hash` jump, Back), is shown at
 * once. Returns a cleanup that shows everything again.
 */
export function startReveals(root: Element): () => void {
  if (!canAnimateInView()) return () => {}
  document.documentElement.dataset['motion'] = ''

  const targets = [...root.querySelectorAll(`[${REVEAL_GROUP}]`)].flatMap((group) =>
    targetsIn(group).map((target, index) => {
      if (target instanceof HTMLElement || target instanceof SVGElement) {
        target.style.setProperty('--reveal-step', String(Math.min(index, MAX_STAGGER)))
      }
      target.setAttribute('data-reveal', '')
      return target
    }),
  )

  const reveal = (target: Element) => {
    target.setAttribute('data-revealed', '')
    observer.unobserve(target)
  }
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting || entry.boundingClientRect.bottom <= 0) reveal(entry.target)
      }
    },
    { rootMargin: '0px 0px -10% 0px' },
  )
  targets.forEach((target) => observer.observe(target))

  // Keyboard users can tab into content before it scrolls in; show it at once.
  const onFocusIn = (event: FocusEvent) => {
    const target = event.target instanceof Element ? event.target.closest('[data-reveal]') : null
    if (target) reveal(target)
  }
  document.addEventListener('focusin', onFocusIn)

  return () => {
    observer.disconnect()
    document.removeEventListener('focusin', onFocusIn)
    for (const target of targets) {
      target.removeAttribute('data-reveal')
      target.removeAttribute('data-revealed')
    }
  }
}
