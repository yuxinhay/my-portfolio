import type { ComponentPropsWithRef } from 'react'
import { TEXT_RECIPES, cx } from './styles'
import type { TextStep } from './styles'

export type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6
export type HeadingSize = Extract<TextStep, 'display' | 'h1' | 'h2' | 'h3' | 'eyebrow'>

export interface HeadingProps extends ComponentPropsWithRef<'h1'> {
  /** Document outline level: renders `h1` to `h6`. */
  level: HeadingLevel
  /** Visual size, independent of the level. Defaults to the matching step (h4–h6 use h3). */
  size?: HeadingSize
}

const DEFAULT_SIZE: Record<HeadingLevel, HeadingSize> = {
  1: 'h1',
  2: 'h2',
  3: 'h3',
  4: 'h3',
  5: 'h3',
  6: 'h3',
}

/** A heading whose element follows the outline and whose look follows the type scale. */
export function Heading({ level, size = DEFAULT_SIZE[level], className, ...props }: HeadingProps) {
  const Element = `h${level}` as const
  return <Element className={cx(TEXT_RECIPES[size], className)} {...props} />
}
