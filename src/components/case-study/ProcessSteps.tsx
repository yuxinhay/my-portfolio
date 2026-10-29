import type { ProcessStep } from '../../content/caseStudies'
import { Heading } from '../ui/Heading'
import { Text } from '../ui/Text'
import { Blocks } from './Blocks'
import { InsightList } from './InsightList'
import { MediaGroup } from './MediaFigure'

export interface ProcessStepsProps {
  steps: readonly ProcessStep[]
}

/** The process as an ordered list: each step has an h3, its text, any insights and its media. */
export function ProcessSteps({ steps }: ProcessStepsProps) {
  return (
    <ol className="grid gap-16">
      {steps.map(({ title, body, insights, media, mediaLayout }, index) => (
        <li key={title} className="grid gap-6 border-t-(length:--border-rule) border-scene-fg pt-6">
          <div className="grid gap-2">
            <Text variant="eyebrow" className="text-scene-accent">
              Step {index + 1}
            </Text>
            <Heading level={3} size="h2">
              {title}
            </Heading>
          </div>
          <Blocks blocks={body} />
          {insights && <InsightList insights={insights} />}
          <MediaGroup media={media} layout={mediaLayout} />
        </li>
      ))}
    </ol>
  )
}
