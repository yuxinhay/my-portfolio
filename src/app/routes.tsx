import type { RouteObject } from 'react-router'
import { DesignSystem } from '../pages/DesignSystem'
import { Home } from '../pages/Home'
import { HowIBuiltThis } from '../pages/HowIBuiltThis'
import { NotFound } from '../pages/NotFound'
import { ProjectDetail } from '../pages/ProjectDetail'
import { Layout } from './Layout'

/** Every route, shared by the browser router and the memory routers in tests and stories. */
export const routes: RouteObject[] = [
  {
    Component: Layout,
    children: [
      { index: true, Component: Home },
      { path: 'projects/:slug', Component: ProjectDetail },
      { path: 'design-system', Component: DesignSystem },
      { path: 'how-i-built-this', Component: HowIBuiltThis },
      { path: '*', Component: NotFound },
    ],
  },
]
