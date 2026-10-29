import type { ComponentPropsWithRef } from 'react'
import { FOCUS_RING, cx } from './styles'

export interface LinkProps extends ComponentPropsWithRef<'a'> {
  href: string
}

/**
 * An inline text link in the scene's accent colour. It is always underlined, so it never relies on
 * colour alone; hover thickens the underline.
 */
export function Link({ className, children, ...props }: LinkProps) {
  return (
    <a
      className={cx(
        'proto-link rounded-sm font-semibold text-scene-accent underline hover:decoration-(length:--border-rule)',
        FOCUS_RING,
        className,
      )}
      {...props}
    >
      {children}
    </a>
  )
}
