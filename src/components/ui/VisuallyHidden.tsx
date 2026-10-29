import type { ComponentPropsWithoutRef } from 'react'
import { cx } from './styles'

export type VisuallyHiddenProps = ComponentPropsWithoutRef<'span'>

/**
 * Text for screen readers only, e.g. extra context for an icon or a terse link. Uses the standard
 * `sr-only` pattern (clipped, 1px, absolutely positioned), so it stays in the accessibility tree.
 */
export function VisuallyHidden({ className, ...props }: VisuallyHiddenProps) {
  return <span className={cx('sr-only', className)} {...props} />
}
