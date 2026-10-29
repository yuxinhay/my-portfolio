import type { Decorator } from '@storybook/react-vite'
import { MemoryRouter } from 'react-router'

/** Decorator for components that use router hooks or links: renders the story at `path`. */
export function withMemoryRouter(path = '/'): Decorator {
  return function MemoryRouterDecorator(Story) {
    return (
      <MemoryRouter initialEntries={[path]}>
        <Story />
      </MemoryRouter>
    )
  }
}
