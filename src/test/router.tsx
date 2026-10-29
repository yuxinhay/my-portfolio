import { render } from '@testing-library/react'
import type { ReactElement } from 'react'
import { MemoryRouter, RouterProvider, createMemoryRouter } from 'react-router'
import { routes } from '../app/routes'

/** Renders a component that needs router context, at `path`. */
export function renderWithRouter(ui: ReactElement, path = '/') {
  return render(<MemoryRouter initialEntries={[path]}>{ui}</MemoryRouter>)
}

/** Renders the whole app (layout + routes) in a memory router, starting at `path`. */
export function renderApp(path = '/') {
  const router = createMemoryRouter(routes, { initialEntries: [path] })
  return { router, ...render(<RouterProvider router={router} />) }
}
