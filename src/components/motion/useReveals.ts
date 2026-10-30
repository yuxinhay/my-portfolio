import { useLayoutEffect } from 'react'
import type { RefObject } from 'react'
import { startReveals } from './reveals'

/**
 * Starts the scroll reveals under `root` for each page (`key`, e.g. the pathname). A layout effect,
 * so targets are hidden before the first paint of a page and before a view transition captures it.
 */
export function useReveals(root: RefObject<Element | null>, key: string): void {
  // `key` is not read inside: it is the trigger to start over on a new page.
  // oxlint-disable-next-line react/exhaustive-deps
  useLayoutEffect(() => {
    if (!root.current) return
    return startReveals(root.current)
  }, [root, key])
}
