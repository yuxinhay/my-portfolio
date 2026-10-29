// PROTOTYPE: the floating control panel and the effects that apply the chosen options. Options are
// applied as data attributes on <html>, so motion.css can key every option off them.
import { useEffect, useId, useLayoutEffect, useState } from 'react'
import { useLocation } from 'react-router'
import { FOCUS_RING, TEXT_RECIPES, cx } from '../../components/ui/styles'
import './motion.css'
import { startReveals } from './reveals'
import {
  AREAS,
  AREA_KEYS,
  setMotionSettings,
  syncUrl,
  useMotionSettings,
  useOsReducedMotion,
} from './settings'
import type { Area, MotionSettings } from './settings'

const OPEN_KEY = 'prototype-motion-open'

function useApplyMotion(replay: number) {
  const settings = useMotionSettings()
  const osReduced = useOsReducedMotion()
  const reduced = osReduced || settings.simulateReduced
  const location = useLocation()

  useLayoutEffect(() => {
    const root = document.documentElement
    for (const area of AREA_KEYS)
      root.dataset[`proto${area[0]?.toUpperCase()}${area.slice(1)}`] = String(settings[area])
    root.toggleAttribute('data-proto-reduced', reduced)
  }, [settings, reduced])

  // Navigations drop the query string; put the shared choices back.
  useEffect(syncUrl, [location])

  const { pathname } = location
  useLayoutEffect(() => {
    const main = document.getElementById('main')
    if (settings.reveal === 'none' || reduced || !main) return
    // Starts over for every page (`pathname`) and on "Replay" (`replay`).
    return startReveals(main, `${pathname}#${replay}`)
  }, [settings.reveal, reduced, pathname, replay])
}

function OptionGroup({ area, settings }: { area: Area; settings: MotionSettings }) {
  const { label, options } = AREAS[area]
  const name = useId()
  return (
    <fieldset className="grid gap-1">
      <legend className={cx(TEXT_RECIPES.small, 'mb-1 font-bold')}>{label}</legend>
      {Object.entries(options).map(([value, text]) => (
        <label key={value} className="flex cursor-pointer items-center gap-2 text-small">
          <input
            type="radio"
            name={name}
            value={value}
            checked={settings[area] === value}
            onChange={() => setMotionSettings({ [area]: value })}
            className={cx('accent-scene-accent', FOCUS_RING)}
          />
          {text}
        </label>
      ))}
    </fieldset>
  )
}

/** Prototype-only panel: switches motion options live. Mounted from Layout on this branch only. */
export function MotionPanel() {
  const settings = useMotionSettings()
  const osReduced = useOsReducedMotion()
  const [replay, setReplay] = useState(0)
  const [open, setOpen] = useState(() => localStorage.getItem(OPEN_KEY) !== 'false')
  const bodyId = useId()
  useApplyMotion(replay)

  const toggle = () => {
    localStorage.setItem(OPEN_KEY, String(!open))
    setOpen(!open)
  }
  const button = cx(
    'cursor-pointer rounded-pill border-(length:--border-rule) border-scene-fg px-3 py-1 text-small font-bold hover:text-scene-accent',
    FOCUS_RING,
  )

  return (
    <aside
      aria-label="Motion prototype controls"
      className="scene-ink fixed right-4 bottom-4 z-50 grid max-h-dvh max-w-xs gap-3 overflow-y-auto rounded-card p-4"
    >
      <div className="flex items-center justify-between gap-4">
        <p className={cx(TEXT_RECIPES.eyebrow, 'text-scene-accent')}>Prototype · Motion</p>
        <button
          type="button"
          aria-expanded={open}
          aria-controls={bodyId}
          onClick={toggle}
          className={button}
        >
          {open ? 'Hide' : 'Show'}
        </button>
      </div>
      <div id={bodyId} hidden={!open} className="grid gap-4">
        {AREA_KEYS.map((area) => (
          <OptionGroup key={area} area={area} settings={settings} />
        ))}
        <label className="flex cursor-pointer items-center gap-2 text-small font-bold">
          <input
            type="checkbox"
            checked={settings.simulateReduced}
            onChange={(event) => setMotionSettings({ simulateReduced: event.target.checked })}
            className={cx('accent-scene-accent', FOCUS_RING)}
          />
          Simulate reduced motion
        </label>
        {osReduced && (
          <p className="text-small">Your system asks for reduced motion, so it is on regardless.</p>
        )}
        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={() => setReplay((n) => n + 1)} className={button}>
            Replay reveals
          </button>
          <button
            type="button"
            onClick={() =>
              setMotionSettings({
                reveal: 'none',
                count: 'none',
                hover: 'none',
                page: 'none',
                simulateReduced: false,
              })
            }
            className={button}
          >
            Reset
          </button>
        </div>
        <p className="text-small">The URL carries these choices, so you can share it.</p>
      </div>
    </aside>
  )
}
