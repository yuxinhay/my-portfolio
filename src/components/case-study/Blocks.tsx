import type { Block } from '../../content/caseStudies'
import { Tag } from '../ui/Tag'
import { Text } from '../ui/Text'
import { TEXT_RECIPES, cx } from '../ui/styles'

export interface BlocksProps {
  blocks: readonly Block[]
  className?: string
}

/**
 * Long-form text, as wide as the media: paragraphs, bulleted lists and description lists of terms,
 * one card per term, filled with the scene's surface. A featured term fills its card with the pink
 * scene instead; its tag says why in text, so the emphasis does not rely on colour. Renders nothing
 * if empty.
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
            {block.definitions.map(({ term, detail, tag, featured }) => (
              <div
                key={term}
                className={cx(
                  'grid content-start gap-3 rounded-card p-6',
                  featured ? 'scene-pink' : 'bg-scene-surface',
                )}
              >
                <dt className={TEXT_RECIPES.h3}>{term}</dt>
                {tag && (
                  <dd>
                    <Tag variant={featured ? 'solid' : 'outline'}>{tag}</Tag>
                  </dd>
                )}
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
