import { useSyncExternalStore } from 'react'
import { REDUCED_MOTION, prefersReducedMotion } from './motion'

function subscribe(onChange: () => void): () => void {
  const query = window.matchMedia?.(REDUCED_MOTION)
  query?.addEventListener('change', onChange)
  return () => query?.removeEventListener('change', onChange)
}

/** Follows `prefers-reduced-motion: reduce`, including changes while the page is open. */
export function useReducedMotion(): boolean {
  return useSyncExternalStore(subscribe, prefersReducedMotion, () => false)
}
