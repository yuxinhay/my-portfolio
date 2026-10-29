import layout from '../../../tokens/layout.json'

/** `"1000ms"` → `1000`. Motion durations are read from the tokens so CSS and JS cannot drift. */
function milliseconds(value: string): number {
  return Number.parseFloat(value)
}

/** How long a number counts up (`duration.count`). */
export const COUNT_DURATION = milliseconds(layout.duration.count.$value)

/** The media query for visitors who ask for less motion. */
export const REDUCED_MOTION = '(prefers-reduced-motion: reduce)'

/** True when the visitor asks for reduced motion. Missing `matchMedia` (jsdom) means no. */
export function prefersReducedMotion(): boolean {
  return window.matchMedia?.(REDUCED_MOTION).matches ?? false
}

/** True when content may be hidden until it scrolls in: the observer exists and motion is fine. */
export function canAnimateInView(): boolean {
  return typeof IntersectionObserver !== 'undefined' && !prefersReducedMotion()
}
