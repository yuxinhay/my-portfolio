// PROTOTYPE (branch prototype/motion only, never merged): the motion options the owner switches
// between, stored in localStorage and the URL query string so a combination can be shared.
import { useSyncExternalStore } from 'react'

export const AREAS = {
  reveal: {
    label: 'Scroll reveals',
    options: {
      none: 'None (current)',
      fade: 'Fade-up',
      wipe: 'Wipe / clip reveal',
    },
  },
  count: {
    label: 'Count-up numbers',
    options: {
      none: 'None (current)',
      count: 'Count-up',
      roll: 'Odometer roll',
    },
  },
  hover: {
    label: 'Hover and press',
    options: {
      none: 'None (current)',
      lift: 'Lift',
      accent: 'Bold accent',
    },
  },
  page: {
    label: 'Page transitions',
    options: {
      none: 'None (current)',
      crossfade: 'Crossfade',
      wipe: 'Scene wipe',
    },
  },
} as const

export type Area = keyof typeof AREAS
export type OptionOf<A extends Area> = keyof (typeof AREAS)[A]['options']

export type MotionSettings = { [A in Area]: OptionOf<A> } & {
  /** Behave as if the OS asked for reduced motion. */
  simulateReduced: boolean
}

export const AREA_KEYS = Object.keys(AREAS) as Area[]

const DEFAULTS: MotionSettings = {
  reveal: 'none',
  count: 'none',
  hover: 'none',
  page: 'none',
  simulateReduced: false,
}

const STORAGE_KEY = 'prototype-motion'
const REDUCED_PARAM = 'reduced'
const REDUCED_MOTION = '(prefers-reduced-motion: reduce)'

function isOption<A extends Area>(area: A, value: unknown): value is OptionOf<A> {
  return typeof value === 'string' && value in AREAS[area].options
}

function load(): MotionSettings {
  const settings = { ...DEFAULTS }
  let stored: Partial<Record<string, unknown>> = {}
  try {
    stored = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '{}') as typeof stored
  } catch {
    // Ignore unreadable storage; the defaults apply.
  }
  const params = new URLSearchParams(window.location.search)
  for (const area of AREA_KEYS) {
    const value = params.get(area) ?? stored[area]
    if (isOption(area, value)) Object.assign(settings, { [area]: value })
  }
  const reduced = params.get(REDUCED_PARAM) ?? stored.simulateReduced
  settings.simulateReduced = reduced === true || reduced === '1'
  return settings
}

let current: MotionSettings = typeof window === 'undefined' ? DEFAULTS : load()
const listeners = new Set<() => void>()

export function getMotionSettings(): MotionSettings {
  return current
}

export function setMotionSettings(patch: Partial<MotionSettings>): void {
  current = { ...current, ...patch }
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(current))
  } catch {
    // Storage can be unavailable (private mode); the URL still carries the choice.
  }
  syncUrl()
  listeners.forEach((listener) => listener())
}

/** Writes the non-default choices into the query string, keeping React Router's history state. */
export function syncUrl(): void {
  const url = new URL(window.location.href)
  for (const area of AREA_KEYS) {
    if (current[area] === DEFAULTS[area]) url.searchParams.delete(area)
    else url.searchParams.set(area, String(current[area]))
  }
  if (current.simulateReduced) url.searchParams.set(REDUCED_PARAM, '1')
  else url.searchParams.delete(REDUCED_PARAM)
  if (url.href !== window.location.href) window.history.replaceState(window.history.state, '', url)
}

function subscribe(listener: () => void) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

export function useMotionSettings(): MotionSettings {
  return useSyncExternalStore(subscribe, getMotionSettings, () => DEFAULTS)
}

function osPrefersReduced(): boolean {
  return typeof window !== 'undefined' && (window.matchMedia?.(REDUCED_MOTION).matches ?? false)
}

/** True when the OS asks for reduced motion or the panel simulates it. */
export function isReducedMotion(): boolean {
  return current.simulateReduced || osPrefersReduced()
}

export function useOsReducedMotion(): boolean {
  return useSyncExternalStore(
    (onChange) => {
      const query = window.matchMedia?.(REDUCED_MOTION)
      query?.addEventListener('change', onChange)
      return () => query?.removeEventListener('change', onChange)
    },
    osPrefersReduced,
    () => false,
  )
}

export function useReducedMotion(): boolean {
  const { simulateReduced } = useMotionSettings()
  return useOsReducedMotion() || simulateReduced
}
