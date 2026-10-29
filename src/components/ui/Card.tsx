import type { ComponentPropsWithoutRef } from 'react'
import { cx } from './styles'
import type { SceneName } from './styles'

export interface CardProps extends ComponentPropsWithoutRef<'article'> {
  /** Use `article` for self-contained content, e.g. a project. Wrap in `li` for lists. */
  as?: 'article' | 'section' | 'div'
  /**
   * Gives the card its own scene, filled with that scene's surface. Without it the card is
   * outlined and inherits the scene around it.
   */
  scene?: SceneName
}

/** A rounded content container that works in every scene. */
export function Card({ as: Element = 'div', scene, className, ...props }: CardProps) {
  return (
    <Element
      className={cx(
        'grid content-start gap-4 rounded-card p-6',
        scene ? `scene-${scene}` : 'border-(length:--border-rule) border-scene-fg',
        className,
      )}
      {...props}
    />
  )
}
