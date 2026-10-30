import type { ComponentPropsWithoutRef } from 'react'
import { NavLink } from 'react-router'
import { site } from '../../content/site'
import type { NavItem } from '../../content/site'
import { FOCUS_RING, LINK_LIFT, cx } from '../ui/styles'

export interface NavProps extends ComponentPropsWithoutRef<'nav'> {
  items?: readonly NavItem[]
  /** Called when a link is followed, e.g. to close the mobile menu. */
  onNavigate?: () => void
}

// LINK_LIFT also transitions the colour change and makes the link an inline block.
const LINK = cx(
  'rounded-sm py-2 font-bold text-scene-fg hover:text-scene-accent',
  LINK_LIFT,
  FOCUS_RING,
)

// The current page is underlined as well as announced, so it never relies on colour alone.
const CURRENT = 'underline decoration-(length:--border-focus)'

/**
 * The primary navigation: a vertical list on small screens, a row from `md` up. React Router's
 * `NavLink` marks the current page with `aria-current="page"`.
 */
export function Nav({ items = site.nav, onNavigate, className, ...props }: NavProps) {
  return (
    <nav aria-label="Primary" className={className} {...props}>
      <ul className="grid gap-1 md:flex md:gap-6">
        {items.map(({ label, to }) => (
          <li key={to}>
            <NavLink
              to={to}
              end={to === '/'}
              onClick={onNavigate}
              className={({ isActive }) => cx(LINK, isActive && CURRENT)}
            >
              {label}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  )
}
