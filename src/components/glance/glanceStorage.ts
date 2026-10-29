/** localStorage key that records that the visitor has closed the intro once. No cookies. */
export const GLANCE_SEEN_KEY = 'my-portfolio:glance-seen'

/**
 * True if the visitor has closed the intro before. Storage that cannot be read (blocked, private
 * mode in some browsers) counts as seen, so a visitor who cannot be remembered is not shown the
 * intro on every visit.
 */
export function hasSeenGlance(): boolean {
  try {
    return window.localStorage.getItem(GLANCE_SEEN_KEY) !== null
  } catch {
    return true
  }
}

/** Remembers that the intro was closed. Does nothing if storage is unavailable. */
export function rememberGlanceSeen(): void {
  try {
    window.localStorage.setItem(GLANCE_SEEN_KEY, '1')
  } catch {
    // Not remembered; the intro stays closed for this page view anyway.
  }
}
