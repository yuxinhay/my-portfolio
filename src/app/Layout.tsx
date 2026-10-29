import { useEffect, useRef } from 'react'
import type { RefObject } from 'react'
import { Outlet, ScrollRestoration, useLocation } from 'react-router'
import { Footer } from '../components/layout/Footer'
import { Header } from '../components/layout/Header'
import { SkipLink } from '../components/ui/SkipLink'

/**
 * Moves focus after every navigation except the first page load: to the `#hash` target if there
 * is a focusable one, otherwise to the page's h1. Focusing the h1 makes screen readers announce the
 * new page, so there is no extra live region (it would announce the title twice). Scrolling is left
 * to `<ScrollRestoration>`: top of the page, saved position on back/forward, or the hash target.
 */
function useRouteFocus(main: RefObject<HTMLElement | null>) {
  // Compare the location object, not its key: native #hash navigations (e.g. the skip link) all
  // share the key "default", but every navigation creates a new location object.
  const location = useLocation()
  const previous = useRef(location)

  useEffect(() => {
    if (previous.current === location) return
    previous.current = location
    const { hash } = location
    const target = hash ? document.getElementById(decodeURIComponent(hash.slice(1))) : null
    target?.focus({ preventScroll: true })
    if (target && document.activeElement === target) return
    main.current?.querySelector<HTMLElement>('h1')?.focus({ preventScroll: true })
  }, [location, main])
}

/** The page shell for every route: skip link, header, main content and footer. */
export function Layout() {
  const main = useRef<HTMLElement>(null)
  useRouteFocus(main)

  return (
    <div className="scene-blush flex min-h-dvh flex-col">
      <SkipLink />
      <Header />
      <main id="main" ref={main} tabIndex={-1} className="flex-1 focus:outline-hidden">
        <Outlet />
      </main>
      <Footer />
      <ScrollRestoration />
    </div>
  )
}
