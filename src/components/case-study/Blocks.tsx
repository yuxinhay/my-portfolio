import type { Block } from '../../content/caseStudies'
import { Text } from '../ui/Text'
import { cx } from '../ui/styles'

export interface BlocksProps {
  blocks: readonly Block[]
  className?: string
}

/** Long-form text: paragraphs and bulleted lists at a readable measure. Renders nothing if empty. */
export function Blocks({ blocks, className }: BlocksProps) {
  if (blocks.length === 0) return null
  return (
    <div className={cx('grid max-w-prose gap-4', className)}>
      {blocks.map((block) =>
        typeof block === 'string' ? (
          <Text key={block}>{block}</Text>
        ) : (
          <ul key={block.list.join()} className="grid list-disc gap-1 pl-5">
            {block.list.map((item) => (
              <li key={item}>
                <Text as="span">{item}</Text>
              </li>
            ))}
          </ul>
        ),
      )}
    </div>
  )
}
