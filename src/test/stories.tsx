import { composeStories } from '@storybook/react-vite'
import { render } from '@testing-library/react'
import type { ComponentType } from 'react'
import { describe, it } from 'vitest'
import { expectNoAxeViolations } from './axe'

type StoriesModule = Parameters<typeof composeStories>[0]

function isStory(entry: [string, unknown]): entry is [string, ComponentType] {
  return typeof entry[1] === 'function'
}

/** Renders every story in a stories module and asserts axe finds no violations in it. */
export function describeStoriesAxe(stories: StoriesModule): void {
  const composed = Object.entries(composeStories(stories)).filter(isStory)
  describe(`${stories.default.title ?? 'stories'} (axe)`, () => {
    it.each(composed)('%s has no violations', async (_, Story) => {
      const { container } = render(<Story />)
      await expectNoAxeViolations(container)
    })
  })
}
