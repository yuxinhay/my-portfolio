import { createBrowserRouter } from 'react-router'
import { routes } from './routes'

// The site is served from a sub-path on GitHub Pages (Vite `base`), so routes are relative to it.
// Deep links work through dist/404.html, a copy of index.html (see ADR 0005).
export const router = createBrowserRouter(routes, { basename: import.meta.env.BASE_URL })
