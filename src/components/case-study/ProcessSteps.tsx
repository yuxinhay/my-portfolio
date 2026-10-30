import type { ProcessStep } from '../../content/caseStudies'
import { Heading } from '../ui/Heading'
import { Text } from '../ui/Text'
import { Blocks } from './Blocks'
import { InsightList } from './InsightList'
import { MediaGroup } from './MediaFigure'

export interface ProcessStepsProps {
  steps: readonly ProcessStep[]
  /** `false` for areas of work in no particular order: an unordered list without step numbers. */
  numbered?: boolean
}

/**
 * The process as a list: each step has an h3, its text, any insights, its media and any text that
 * explains the media. Numbered steps are an ordered list with a "Step 1" label each.
 */
export function ProcessSteps({ steps, numbered = true }: ProcessStepsProps) {
  const List = numbered ? 'ol' : 'ul'
  return (
    <List className="grid gap-16">
      {steps.map(({ title, body, insights, media, mediaLayout, afterMedia }, index) => (
        <li key={title} className="grid gap-6 border-t-(length:--border-rule) border-scene-fg pt-6">
          <div className="grid gap-2">
            {numbered && (
              <Text variant="eyebrow" className="text-scene-accent">
                Step {index + 1}
              </Text>
            )}
            <Heading level={3} size="h2">
              {title}
            </Heading>
          </div>
          <Blocks blocks={body} />
          {insights && <InsightList insights={insights} />}
          <MediaGroup media={media} layout={mediaLayout} />
          {afterMedia && <Blocks blocks={afterMedia} />}
        </li>
      ))}
    </List>
  )
}
