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

/** Colour transition for hover states; the base styles cut it under prefers-reduced-motion. */
export const COLOR_TRANSITION =
  'transition-colors duration-(--duration-fast) ease-out motion-reduce:transition-none'

/** Joins class names, skipping empty ones. */
export function cx(...classes: (string | false | undefined)[]): string {
  return classes.filter(Boolean).join(' ')
}
