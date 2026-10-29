import type { To } from 'react-router'
import { useHref, useLinkClickHandler } from 'react-router'
import { Link } from '../ui/Link'
import type { LinkProps } from '../ui/Link'

export interface RouteLinkProps extends Omit<LinkProps, 'href'> {
  /** A route path, resolved against the router basename like a React Router `<Link>`. */
  to: To
}

/**
 * The `Link` primitive for in-app routes: same look, but the href includes the basename and a
 * click navigates client-side instead of reloading the page.
 */
export function RouteLink({ to, onClick, target, ...props }: RouteLinkProps) {
  const href = useHref(to)
  const handleClick = useLinkClickHandler(to, target === undefined ? {} : { target })
  return (
    <Link
      href={href}
      target={target}
      onClick={(event) => {
        onClick?.(event)
        if (!event.defaultPrevented) handleClick(event)
      }}
      {...props}
    />
  )
}
