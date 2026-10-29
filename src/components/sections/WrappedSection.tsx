import type { ReactNode } from 'react'
import { Heading } from '../ui/Heading'
import { cx } from '../ui/styles'
import type { SceneName } from '../ui/styles'

export interface WrappedSectionProps {
  /** Hash target, e.g. `projects` for `/#projects`. The heading gets `${id}-title`. */
  id: string
  scene: SceneName
  title: ReactNode
  /**
   * Heading level: 2 for every section except the page intro, which holds the page's only h1.
   * The h1 takes programmatic focus so the layout can move focus to it after navigation.
   */
  level?: 1 | 2
  children?: ReactNode
  className?: string
}

/**
 * One full-bleed Wrapped scene on the home page: a `<section>` named by its heading. It takes
 * programmatic focus, so a `/#id` link moves keyboard users to it, not just the viewport.
 */
export function WrappedSection({
  id,
  scene,
  title,
  level = 2,
  children,
  className,
}: WrappedSectionProps) {
  const titleId = `${id}-title`
  return (
    <section
      id={id}
      aria-labelledby={titleId}
      tabIndex={-1}
      className={cx(`scene-${scene}`, 'focus:outline-hidden')}
    >
      <div className={cx('mx-auto grid max-w-5xl gap-10 px-6 py-16 md:py-24', className)}>
        <Heading
          level={level}
          size="display"
          id={titleId}
          {...(level === 1 && { tabIndex: -1, className: 'focus:outline-hidden' })}
        >
          {title}
        </Heading>
        {children}
      </div>
    </section>
  )
}
