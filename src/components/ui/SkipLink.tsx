import type { ComponentPropsWithoutRef } from 'react'
import { FOCUS_RING, cx } from './styles'

export interface SkipLinkProps extends ComponentPropsWithoutRef<'a'> {
  /** In-page target. Give that element `tabIndex={-1}` so focus moves to it. */
  href?: `#${string}`
}

/**
 * The first focusable element on a page: hidden until focused, then shown at the top left so
 * keyboard users can jump past repeated navigation.
 */
export function SkipLink({
  href = '#main',
  children = 'Skip to main content',
  className,
  ...props
}: SkipLinkProps) {
  return (
    <a
      href={href}
      className={cx(
        'sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-10 focus:rounded-sm focus:bg-scene-fg focus:px-4 focus:py-2 focus:font-bold focus:text-scene',
        FOCUS_RING,
        className,
      )}
      {...props}
    >
      {children}
    </a>
  )
}
