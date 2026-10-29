# ADR 0005: React Router with real paths; deep links on GitHub Pages via a copied `404.html`

- Status: Accepted
- Date: 2026-10-29

## Context

Plan step 6 adds client-side routes (`/`, `/projects/:slug`, `/design-system`, `/how-i-built-this`
and a not-found page). The site is static on GitHub Pages under `/my-portfolio/`, which has no
server rewrites: a request for `/my-portfolio/design-system` finds no file and gets Pages' 404
page. Deep links and reloads must still work, and route changes must be accessible (focus, title).

## Options

- **Hash routing** (`/my-portfolio/#/design-system`). Works anywhere, but the fragment is taken by
  the router, so in-page anchors (the skip link's `#main`, `/#projects`) clash with routes, and
  URLs look less clean.
- **`404.html` redirect trick** (spa-github-pages): 404.html rewrites the path into a query string
  and redirects to index.html, which restores it with `history.replaceState`. Final response is
  200, but it needs two inline scripts, causes a redirect on every deep link and briefly shows the
  mangled URL.
- **`404.html` as a copy of `index.html`.** Pages serves it for any unknown path with the original
  URL intact; the app boots and the router renders that URL. No redirect, no scripts, but the
  first response for a deep link has HTTP status 404.

## Decision

- **React Router 8 (data mode)**: `createBrowserRouter` with `basename: import.meta.env.BASE_URL`,
  so no URL in the app is root-relative. Routes live in `src/app/routes.tsx` and are shared by
  the browser router, tests and stories (memory routers).
- **Copy `index.html` to `404.html` at build time**, with a small Vite plugin in `vite.config.ts`
  (`apply: 'build'`). Unknown paths fall through to the router's `*` route, so a real 404 shows the
  app's own not-found page inside the layout.
- **Focus and titles on navigation** (WCAG 2.4.3, 4.1.3 intent): each page renders one h1 with
  `tabIndex={-1}` and sets `document.title` to `"<Page> · <site name>"`. After every navigation
  except the first load, the layout focuses the `#hash` target if it is focusable, otherwise the
  h1. Screen readers announce the focused h1, so there is no extra live region (it would announce
  the page twice). `<ScrollRestoration>` scrolls to the top, to the hash target, or restores the
  position on back/forward; it never animates, so reduced motion needs nothing extra.

## Consequences

- Deep links return HTTP 404 before the app renders. Browsers and users do not notice; crawlers
  may skip those URLs, which is acceptable for a portfolio whose entry point is the home page.
  Lighthouse's SEO "HTTP status code" audit may flag deep links in step 9; the a11y budget is
  unaffected.
- `vite preview` and the dev server use an index.html fallback rather than 404.html, so they do
  not exercise this path; the deep-link behaviour was verified against a static server that
  mimics Pages.
- Native hash navigations share React Router's location key, so the focus logic compares location
  objects rather than keys.
