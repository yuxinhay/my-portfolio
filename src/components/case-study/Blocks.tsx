import type { Block } from '../../content/caseStudies'
import { Text } from '../ui/Text'
import { TEXT_RECIPES, cx } from '../ui/styles'

export interface BlocksProps {
  blocks: readonly Block[]
  className?: string
}

/**
 * Long-form text, as wide as the media: paragraphs, bulleted lists and description lists of terms.
 * Renders nothing if empty.
 */
export function Blocks({ blocks, className }: BlocksProps) {
  if (blocks.length === 0) return null
  return (
    <div className={cx('grid gap-4', className)}>
      {blocks.map((block) => {
        if (typeof block === 'string') return <Text key={block}>{block}</Text>
        if ('list' in block) {
          return (
            <ul key={block.list.join()} className="grid list-disc gap-1 pl-5">
              {block.list.map((item) => (
                <li key={item}>
                  <Text as="span">{item}</Text>
                </li>
              ))}
            </ul>
          )
        }
        return (
          <dl
            key={block.definitions.map((d) => d.term).join()}
            className="grid gap-4 md:grid-cols-2"
          >
            {block.definitions.map(({ term, detail }) => (
              <div
                key={term}
                className="grid content-start gap-1 border-t-(length:--border-rule) border-scene-fg pt-3"
              >
                <dt className={TEXT_RECIPES.h3}>{term}</dt>
                <dd>
                  <Text as="span">{detail}</Text>
                </dd>
              </div>
            ))}
          </dl>
        )
      })}
    </div>
  )
}
