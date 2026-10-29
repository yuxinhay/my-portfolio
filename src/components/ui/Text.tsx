import type { ComponentPropsWithoutRef } from 'react'
import { TEXT_RECIPES, cx } from './styles'
import type { TextStep } from './styles'

export type TextVariant = Extract<TextStep, 'body' | 'small' | 'eyebrow'>

export interface TextProps extends ComponentPropsWithoutRef<'p'> {
  variant?: TextVariant
  /** `p` for a paragraph, `span` for inline text. */
  as?: 'p' | 'span'
}

/** Running text in one of the body type steps. */
export function Text({ variant = 'body', as: Element = 'p', className, ...props }: TextProps) {
  return <Element className={cx(TEXT_RECIPES[variant], className)} {...props} />
}
