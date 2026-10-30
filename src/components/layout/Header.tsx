import { useEffect, useId, useRef, useState } from 'react'
import { Link as RouterLink, useLocation } from 'react-router'
import { logo } from '../../content/brand'
import { site } from '../../content/site'
import { Button } from '../ui/Button'
import { FOCUS_RING, TEXT_RECIPES, cx } from '../ui/styles'
import { Nav } from './Nav'

/**
 * Site header: home link and primary navigation. Below `md` the navigation is a non-modal
 * disclosure behind a native toggle button; it opens in the page flow, so nothing is covered and
 * no focus trap is needed. Escape closes it and returns focus to the toggle.
 */
export function Header() {
  const { pathname } = useLocation()
  // The menu stays open only on the page it was opened on, so any navigation closes it.
  const [openOn, setOpenOn] = useState<string | null>(null)
  const open = openOn === pathname
  const headerRef = useRef<HTMLElement>(null)
  const toggleRef = useRef<HTMLButtonElement>(null)
  const navId = useId()

  useEffect(() => {
    if (!open) return
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key !== 'Escape') return
      setOpenOn(null)
      // Only pull focus back if it was in the menu; Escape elsewhere just closes it.
      const focused = document.activeElement
      if (focused === document.body || headerRef.current?.contains(focused)) {
        toggleRef.current?.focus()
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [open])

  return (
    <header
      ref={headerRef}
      className="mx-auto flex w-full max-w-5xl flex-wrap items-center justify-between gap-x-6 gap-y-2 px-6 py-4"
    >
      {/* The logo is two lines of the h3 step tall (`h-logo-header`, 2lh), so it scales with it. */}
      <RouterLink to="/" className={cx('rounded-sm', TEXT_RECIPES.h3, FOCUS_RING)}>
        <img
          src={logo.src}
          alt={site.name}
          width={logo.width}
          height={logo.height}
          className="block h-logo-header w-auto"
        />
      </RouterLink>
      <Button
        ref={toggleRef}
        variant="secondary"
        aria-expanded={open}
        aria-controls={navId}
        className="md:hidden"
        onClick={() => setOpenOn(open ? null : pathname)}
      >
        Menu
      </Button>
      <Nav
        id={navId}
        className={cx(open ? 'block' : 'hidden', 'basis-full md:block md:basis-auto')}
        onNavigate={() => setOpenOn(null)}
      />
    </header>
  )
}
