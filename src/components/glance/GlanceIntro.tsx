import { useRef, useState } from 'react'
import { useLocation } from 'react-router'
import { glance as defaultGlance } from '../../content/glance'
import type { Glance } from '../../content/glance'
import { Button } from '../ui/Button'
import { GlanceOverlay } from './GlanceOverlay'
import type { GlanceCloseReason } from './GlanceOverlay'
import { hasSeenGlance, rememberGlanceSeen } from './glanceStorage'

export interface GlanceIntroProps {
  glance?: Glance
}

type Shown = 'none' | 'first-visit' | 'replay'

/**
 * The "At a glance" intro for the home page, and the button that replays it. It opens by itself
 * only when the visit starts on the home page and the intro has not been closed in this tab
 * (remembered in sessionStorage, so once per browser session: a reload keeps it shut, a new tab
 * shows it again); arriving at home from another page does not open it. Only that first opening
 * celebrates with confetti; a replay does not. Closing it moves focus to
 * the page's h1, except a replay closed with Skip or Escape, which returns to the Replay button.
 */
export function GlanceIntro({ glance = defaultGlance }: GlanceIntroProps) {
  // The first location of a visit has the key "default"; later navigations get a new key.
  const { key } = useLocation()
  const [shown, setShown] = useState<Shown>(() =>
    key === 'default' && !hasSeenGlance() ? 'first-visit' : 'none',
  )
  const replayRef = useRef<HTMLButtonElement>(null)

  function handleClose(reason: GlanceCloseReason) {
    rememberGlanceSeen()
    const toReplay = shown === 'replay' && reason === 'skip'
    setShown('none')
    const heading = document.getElementById('main')?.querySelector<HTMLElement>('h1')
    ;(toReplay ? replayRef.current : heading)?.focus()
  }

  return (
    <>
      <Button
        ref={replayRef}
        variant="secondary"
        aria-haspopup="dialog"
        className="w-fit"
        onClick={() => setShown('replay')}
      >
        Replay intro
      </Button>
      {shown !== 'none' && (
        <GlanceOverlay glance={glance} celebrate={shown === 'first-visit'} onClose={handleClose} />
      )}
    </>
  )
}
