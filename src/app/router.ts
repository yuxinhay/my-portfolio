import { createBrowserRouter } from 'react-router'
import { withPrototypeViewTransitions } from '../prototype/motion/viewTransitions'
import { routes } from './routes'

// The site is served from a sub-path on GitHub Pages (Vite `base`), so routes are relative to it.
// Deep links work through dist/404.html, a copy of index.html (see ADR 0005).
// PROTOTYPE hook: page-transition options wrap navigate.
export const router = withPrototypeViewTransitions(
  createBrowserRouter(routes, { basename: import.meta.env.BASE_URL }),
)
