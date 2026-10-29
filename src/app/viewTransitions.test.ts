import { afterEach, describe, expect, it, vi } from 'vitest'
import { createMemoryRouter } from 'react-router'
import { stubReducedMotion } from '../test/motion'
import { canCrossfade, withViewTransitions } from './viewTransitions'

afterEach(() => {
  vi.unstubAllGlobals()
  // jsdom has no View Transitions API; tests that add it remove it again.
  Reflect.deleteProperty(document, 'startViewTransition')
})

function routerWithSpy() {
  const router = createMemoryRouter([{ path: '*', Component: () => null }])
  const navigate = vi.spyOn(router, 'navigate').mockResolvedValue(undefined)
  return { router: withViewTransitions(router), navigate }
}

function addViewTransitions() {
  Object.defineProperty(document, 'startViewTransition', { value: () => {}, configurable: true })
}

describe('page transitions', () => {
  it('crossfade only with the View Transitions API and without reduced motion', () => {
    expect(canCrossfade()).toBe(false)
    addViewTransitions()
    expect(canCrossfade()).toBe(true)
    stubReducedMotion(true)
    expect(canCrossfade()).toBe(false)
  })

  it('asks React Router for a view transition on every navigation when supported', async () => {
    addViewTransitions()
    const { router, navigate } = routerWithSpy()
    await router.navigate('/design-system', { replace: true })
    expect(navigate).toHaveBeenCalledWith('/design-system', {
      replace: true,
      viewTransition: true,
    })
  })

  it('navigates without one when unsupported or under reduced motion', async () => {
    const { router, navigate } = routerWithSpy()
    await router.navigate('/a')
    expect(navigate).toHaveBeenLastCalledWith('/a', { viewTransition: false })
    addViewTransitions()
    stubReducedMotion(true)
    await router.navigate('/b')
    expect(navigate).toHaveBeenLastCalledWith('/b', { viewTransition: false })
  })

  it('leaves history navigation (Back, Forward) to React Router', async () => {
    addViewTransitions()
    const { router, navigate } = routerWithSpy()
    await router.navigate(-1)
    expect(navigate).toHaveBeenLastCalledWith(-1)
  })
})
