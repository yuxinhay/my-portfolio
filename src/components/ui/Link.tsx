import type { ComponentPropsWithRef } from 'react'
import { FOCUS_RING, cx } from './styles'

export interface LinkProps extends ComponentPropsWithRef<'a'> {
  href: string
  /**
   * `always` for links in running text, so they never rely on colour alone. `interactive` only for
   * links that stand apart from text, like a card title: underlined on hover and press.
   */
  underline?: 'always' | 'interactive'
}

const UNDERLINE = {
  always: 'underline',
  interactive: 'hover:underline active:underline',
}

/** A text link in the scene's accent colour; hover thickens the underline. */
export function Link({ underline = 'always', className, children, ...props }: LinkProps) {
  return (
    <a
      className={cx(
        'rounded-sm font-semibold text-scene-accent hover:decoration-(length:--border-rule)',
        UNDERLINE[underline],
        FOCUS_RING,
        className,
      )}
      {...props}
    >
      {children}
    </a>
  )
}
