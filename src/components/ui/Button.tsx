import type { ComponentPropsWithRef } from 'react'
import { FOCUS_RING, LIFT, cx } from './styles'

export type ButtonVariant = 'primary' | 'secondary'

export interface ButtonProps extends ComponentPropsWithRef<'button'> {
  /** `primary` is filled in the scene's text colour; `secondary` is outlined. */
  variant?: ButtonVariant
}

// Both variants keep a border, so the button stays visible in forced-colours mode.
const VARIANTS: Record<ButtonVariant, string> = {
  primary: 'border-scene-fg bg-scene-fg text-scene hover:border-scene-accent hover:bg-scene-accent',
  secondary: 'border-scene-fg text-scene-fg hover:border-scene-accent hover:text-scene-accent',
}

/**
 * A native button styled for the current scene. Defaults to `type="button"`. Hover and keyboard
 * focus lift it with a hard shadow; pressing it presses it down (`LIFT`).
 */
export function Button({ variant = 'primary', type = 'button', className, ...props }: ButtonProps) {
  return (
    <button
      type={type}
      className={cx(
        'inline-flex cursor-pointer items-center justify-center gap-2 rounded-pill border-(length:--border-rule) px-6 py-3 text-body leading-normal font-bold',
        VARIANTS[variant],
        LIFT,
        FOCUS_RING,
        className,
      )}
      {...props}
    />
  )
}
