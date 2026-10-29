import type { ComponentPropsWithoutRef } from 'react'
import { TEXT_RECIPES, cx } from './styles'

export type TagVariant = 'outline' | 'solid'

export interface TagProps extends ComponentPropsWithoutRef<'span'> {
  variant?: TagVariant
}

const VARIANTS: Record<TagVariant, string> = {
  outline: 'text-scene-fg',
  solid: 'bg-scene-fg text-scene',
}

/** A non-interactive label, e.g. a skill or technology. Put groups of tags in a list. */
export function Tag({ variant = 'outline', className, ...props }: TagProps) {
  return (
    <span
      className={cx(
        'inline-flex items-center rounded-pill border-(length:--border-rule) border-scene-fg px-3 py-1',
        TEXT_RECIPES.small,
        VARIANTS[variant],
        className,
      )}
      {...props}
    />
  )
}
