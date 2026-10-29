// PROTOTYPE: page transitions. Every in-app navigation goes through `router.navigate`, so wrapping
// it turns React Router's View Transitions option on for the whole site from one place. React
// Router feature-detects `document.startViewTransition` and navigates without one if it is missing.
import type { createBrowserRouter } from 'react-router'
import { getMotionSettings, isReducedMotion } from './settings'

type Router = ReturnType<typeof createBrowserRouter>

export function withPrototypeViewTransitions(router: Router): Router {
  const navigate = router.navigate.bind(router)
  router.navigate = ((to: Parameters<Router['navigate']>[0], options?: object) => {
    if (typeof to === 'number') return navigate(to)
    const viewTransition = getMotionSettings().page !== 'none' && !isReducedMotion()
    return navigate(to, { ...options, viewTransition })
  }) as Router['navigate']
  return router
}
