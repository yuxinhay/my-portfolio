import { createBrowserRouter } from 'react-router'
import { routes } from './routes'
import { withViewTransitions } from './viewTransitions'

// The site is served from a sub-path on GitHub Pages (Vite `base`), so routes are relative to it.
// Deep links work through dist/404.html, a copy of index.html (see ADR 0005). Pages crossfade
// where the browser supports view transitions (see ADR 0008).
export const router = withViewTransitions(
  createBrowserRouter(routes, { basename: import.meta.env.BASE_URL }),
)
