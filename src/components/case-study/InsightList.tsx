import type { Insights } from '../../content/caseStudies'
import { Heading } from '../ui/Heading'
import { TEXT_RECIPES, cx } from '../ui/styles'

export interface InsightListProps {
  insights: Insights
  /** Heading level, one below the step heading it sits under. */
  level?: 3 | 4
}

/**
 * Research or feedback quotes as a numbered list. The "#1" badges repeat the list numbering for
 * sighted readers, so they are hidden from screen readers, which announce the list position.
 */
export function InsightList({ insights, level = 4 }: InsightListProps) {
  return (
    <div className="grid gap-4">
      <Heading level={level} size="h3">
        {insights.heading}
      </Heading>
      <ol className="grid gap-4">
        {insights.quotes.map((quote, index) => (
          <li key={quote} className="flex items-start gap-4">
            <span
              aria-hidden="true"
              className="shrink-0 rounded-sm bg-scene-fg px-2 py-1 font-black text-scene"
            >
              #{index + 1}
            </span>
            <blockquote className={cx(TEXT_RECIPES.h3, 'pt-1')}>
              <p>“{quote}”</p>
            </blockquote>
          </li>
        ))}
      </ol>
    </div>
  )
}
