import { act, render } from '@testing-library/react'
import { useRef } from 'react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { PLAY_THRESHOLD, usePlayInView } from './usePlayInView'

type Callback = (entries: Pick<IntersectionObserverEntry, 'isIntersecting'>[]) => void

let callback: Callback | undefined
let options: IntersectionObserverInit | undefined
let reducedMotion = false

function TestVideo() {
  const ref = useRef<HTMLVideoElement>(null)
  usePlayInView(ref)
  return <video ref={ref} muted data-testid="video" />
}

function setup() {
  const { getByTestId } = render(<TestVideo />)
  const video = getByTestId('video') as HTMLVideoElement
  const state = { paused: true }
  const play = vi.spyOn(video, 'play').mockImplementation(() => {
    state.paused = false
    video.dispatchEvent(new Event('play'))
    return Promise.resolve()
  })
  const pause = vi.spyOn(video, 'pause').mockImplementation(() => {
    state.paused = true
    video.dispatchEvent(new Event('pause'))
  })
  Object.defineProperty(video, 'paused', { get: () => state.paused })
  const scroll = (isIntersecting: boolean) => act(() => callback?.([{ isIntersecting }]))
  return { video, state, play, pause, scroll }
}

beforeEach(() => {
  callback = undefined
  reducedMotion = false
  vi.stubGlobal(
    'IntersectionObserver',
    class {
      constructor(cb: Callback, init?: IntersectionObserverInit) {
        callback = cb
        options = init
      }
      observe() {}
      disconnect() {}
    },
  )
  vi.stubGlobal('matchMedia', (query: string) => ({ matches: reducedMotion, media: query }))
})

afterEach(() => vi.unstubAllGlobals())

describe('usePlayInView', () => {
  it('plays muted when the video scrolls into view and pauses when it leaves', () => {
    const { video, play, pause, scroll } = setup()
    expect(options?.threshold).toBe(PLAY_THRESHOLD)
    expect(play).not.toHaveBeenCalled()
    scroll(true)
    expect(play).toHaveBeenCalledTimes(1)
    expect(video.muted).toBe(true)
    scroll(false)
    expect(pause).toHaveBeenCalledTimes(1)
    scroll(true)
    expect(play).toHaveBeenCalledTimes(2)
  })

  it('stays paused after the visitor pauses it', () => {
    const { video, state, play, scroll } = setup()
    scroll(true)
    // The visitor presses pause in the native controls (not via the hook).
    act(() => {
      state.paused = true
      video.dispatchEvent(new Event('pause'))
    })
    scroll(false)
    scroll(true)
    expect(play).toHaveBeenCalledTimes(1)
  })

  it('never starts under reduced motion', () => {
    reducedMotion = true
    const { play } = setup()
    expect(callback).toBeUndefined()
    expect(play).not.toHaveBeenCalled()
  })
})
