import type { Insights } from '../../content/caseStudies'
import { Heading } from '../ui/Heading'
import { TEXT_RECIPES, cx } from '../ui/styles'

export interface InsightListProps {
  insights: Insights
  /** Heading level, one below the step heading it sits under. */
  level?: 3 | 4
}

/** A decorative dashed rule that grows to fill the space beside the heading. */
function DashedRule() {
  return (
    <span
      aria-hidden="true"
      className="grow border-t-(length:--border-rule) border-dashed border-scene-fg"
    />
  )
}

/**
 * Research or feedback quotes as a numbered list. The heading sits between dashed rules, as in the
 * Figma release pages, and uses the eyebrow style so it reads as a label, not as another quote.
 * The "#1" badges repeat the list numbering for sighted readers, so they are hidden from screen
 * readers, which announce the list position.
 */
export function InsightList({ insights, level = 4 }: InsightListProps) {
  return (
    <div className="grid gap-6">
      <div className="flex items-center gap-4">
        <DashedRule />
        <Heading level={level} size="eyebrow" className="text-center text-scene-accent">
          {insights.heading}
        </Heading>
        <DashedRule />
      </div>
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
