import { vi } from 'vitest'

interface Observed {
  observer: IntersectionObserver
  callback: IntersectionObserverCallback
}

/**
 * Installs a controllable IntersectionObserver (jsdom has none) for the current test. `enter` and
 * `leave` report an element as on or off screen to every observer watching it; `above` reports it
 * as off screen above the viewport. Restored with `vi.unstubAllGlobals()`.
 */
export function stubIntersectionObserver() {
  const watching = new Map<Element, Set<Observed>>()

  class StubObserver implements IntersectionObserver {
    readonly root = null
    readonly rootMargin = '0px'
    readonly scrollMargin = '0px'
    readonly thresholds = [0]
    private readonly callback: IntersectionObserverCallback
    constructor(callback: IntersectionObserverCallback) {
      this.callback = callback
    }
    observe(element: Element) {
      const set = watching.get(element) ?? new Set()
      set.add({ observer: this, callback: this.callback })
      watching.set(element, set)
    }
    unobserve(element: Element) {
      const set = watching.get(element)
      set?.forEach((entry) => entry.observer === this && set.delete(entry))
    }
    disconnect() {
      watching.forEach((_, element) => this.unobserve(element))
    }
    takeRecords(): IntersectionObserverEntry[] {
      return []
    }
  }

  function report(element: Element, isIntersecting: boolean, bottom: number) {
    for (const { observer, callback } of [...(watching.get(element) ?? [])]) {
      const entry = {
        target: element,
        isIntersecting,
        intersectionRatio: isIntersecting ? 1 : 0,
        boundingClientRect: { bottom } as DOMRectReadOnly,
      } as IntersectionObserverEntry
      callback([entry], observer)
    }
  }

  vi.stubGlobal('IntersectionObserver', StubObserver)
  return {
    enter: (element: Element) => report(element, true, 100),
    leave: (element: Element) => report(element, false, 2000),
    above: (element: Element) => report(element, false, -10),
    isObserved: (element: Element) => (watching.get(element)?.size ?? 0) > 0,
  }
}

/** Makes `prefers-reduced-motion: reduce` match (or not) for the current test. */
export function stubReducedMotion(reduce: boolean) {
  vi.stubGlobal('matchMedia', (query: string) => ({
    matches: reduce && query.includes('prefers-reduced-motion: reduce'),
    media: query,
    addEventListener: () => {},
    removeEventListener: () => {},
  }))
}
