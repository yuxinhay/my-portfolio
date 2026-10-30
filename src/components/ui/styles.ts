import type scene from '../../../tokens/scene.json'
import type typography from '../../../tokens/typography.json'

export type TextStep = Exclude<keyof (typeof typography)['text'], `$${string}`>
export type SceneName = Exclude<keyof (typeof scene)['scene'], `$${string}`>

export const SCENES: readonly SceneName[] = ['blush', 'pink', 'cobalt', 'ink']

/**
 * Utility recipe per text step: the single source for components and the Typography story.
 * Class names must be literal for Tailwind to generate them; typing the keys as TextStep makes a
 * new text token fail typecheck until it has a recipe.
 */
export const TEXT_RECIPES: Record<TextStep, string> = {
  stat: 'text-stat leading-tight font-black tracking-display',
  display: 'text-display leading-tight font-black tracking-display',
  h1: 'text-h1 leading-snug font-black tracking-heading',
  h2: 'text-h2 leading-snug font-black tracking-heading',
  h3: 'text-h3 leading-snug font-bold tracking-heading',
  body: 'text-body leading-normal font-regular',
  small: 'text-small leading-normal font-medium',
  eyebrow: 'text-eyebrow font-bold tracking-eyebrow uppercase',
}

/** Visible focus ring in the scene's focus colour (>= 3:1 against every scene, checked in CI). */
export const FOCUS_RING =
  'focus-visible:outline-(length:--border-focus) focus-visible:outline-offset-(length:--border-focus) focus-visible:outline-scene-focus focus-visible:outline-solid'

/**
 * Lift for buttons: on hover and keyboard focus the element rises with a hard offset shadow in the
 * scene's text colour (`shadow-lift`, index.css); pressing it scales it down and drops the shadow.
 * An element filled in the text colour adds `lift-hollow`, so its shadow is a slab of the scene
 * background edged in the text colour, never the colour of the fill above it. Under reduced motion
 * the shadow still appears, without the movement.
 */
export const LIFT =
  'transition duration-(--duration-fast) ease-out hover:shadow-lift focus-visible:shadow-lift active:shadow-none motion-safe:hover:-translate-y-1.5 motion-safe:focus-visible:-translate-y-1.5 motion-safe:active:translate-y-0 motion-safe:active:scale-98 motion-reduce:transition-none'

/**
 * Lift for a card whose link covers it: the same states as `LIFT`, driven by the link inside
 * (`has-focus-visible`, `has-active`), so keyboard focus looks like hover.
 */
export const CARD_LIFT =
  'transition duration-(--duration-fast) ease-out hover:shadow-lift has-focus-visible:shadow-lift has-active:shadow-none motion-safe:hover:-translate-y-1.5 motion-safe:has-focus-visible:-translate-y-1.5 motion-safe:has-active:translate-y-0 motion-safe:has-active:scale-98 motion-reduce:transition-none'

/**
 * Lift for navigation and pager links: a small rise on hover and focus, a press on click, no
 * shadow (a shadow under a line of text reads as an underline). None of it under reduced motion.
 */
export const LINK_LIFT =
  'inline-block transition duration-(--duration-fast) ease-out motion-safe:hover:-translate-y-0.5 motion-safe:focus-visible:-translate-y-0.5 motion-safe:active:translate-y-0 motion-safe:active:scale-98 motion-reduce:transition-none'

/** Joins class names, skipping empty ones. */
export function cx(...classes: (string | false | undefined)[]): string {
  return classes.filter(Boolean).join(' ')
}
