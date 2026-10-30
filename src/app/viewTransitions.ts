import type { DataRouter } from 'react-router'
import { prefersReducedMotion } from '../components/motion/motion'

/** True when the browser has the View Transitions API and the visitor has not asked for less motion. */
export function canCrossfade(): boolean {
  return typeof document.startViewTransition === 'function' && !prefersReducedMotion()
}

/**
 * Crossfades between pages. Every in-app navigation (links, `navigate()`) goes through
 * `router.navigate`, so wrapping it turns on React Router's `viewTransition` option for the whole
 * site in one place. It is decided per navigation, so turning on reduced motion takes effect at
 * once; without the API, pages change instantly. History navigations (Back, Forward) are left to
 * React Router, and the CSS stops any transition under reduced motion. The crossfade itself is
 * styled in `index.css` (`duration.base`).
 */
export function withViewTransitions(router: DataRouter): DataRouter {
  const navigate = router.navigate.bind(router)
  router.navigate = ((to: Parameters<DataRouter['navigate']>[0], options?: object) => {
    if (typeof to === 'number') return navigate(to)
    return navigate(to, { ...options, viewTransition: canCrossfade() })
  }) as DataRouter['navigate']
  return router
}
