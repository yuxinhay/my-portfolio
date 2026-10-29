import { useState } from 'react'
import { RouterProvider, createMemoryRouter } from 'react-router'
import { routes } from '../app/routes'

/** The whole app (layout + routes) in memory, starting at `path`. Links navigate inside it. */
export function AppAt({ path }: { path: string }) {
  const [router] = useState(() => createMemoryRouter(routes, { initialEntries: [path] }))
  return <RouterProvider router={router} />
}
