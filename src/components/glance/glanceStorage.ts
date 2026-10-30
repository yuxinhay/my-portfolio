/**
 * sessionStorage key that records that the intro was closed in this tab. It lasts until the tab
 * is closed, so a reload keeps the intro shut and a new tab or a later visit shows it again. No
 * cookies.
 */
export const GLANCE_SEEN_KEY = 'my-portfolio:glance-seen'

/**
 * True if the intro was closed earlier in this tab's session. Storage that cannot be read
 * (blocked, private mode in some browsers) counts as seen, so a visitor who cannot be remembered
 * is not shown the intro on every page load.
 */
export function hasSeenGlance(): boolean {
  try {
    return window.sessionStorage.getItem(GLANCE_SEEN_KEY) !== null
  } catch {
    return true
  }
}

/** Remembers for this tab's session that the intro was closed. Does nothing without storage. */
export function rememberGlanceSeen(): void {
  try {
    window.sessionStorage.setItem(GLANCE_SEEN_KEY, '1')
  } catch {
    // Not remembered; the intro stays closed for this page view anyway.
  }
}
