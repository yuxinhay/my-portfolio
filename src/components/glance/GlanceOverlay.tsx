import { useEffect, useEffectEvent, useLayoutEffect, useRef, useState } from 'react'
import type { CSSProperties, KeyboardEvent, PointerEvent } from 'react'
import { glance as defaultGlance } from '../../content/glance'
import type { Glance } from '../../content/glance'
import { CELEBRATE_DELAY, CONFETTI_DURATION, prefersReducedMotion } from '../motion/motion'
import { Button } from '../ui/Button'
import { FOCUS_RING, cx } from '../ui/styles'
import { GlanceCard } from './GlanceCard'
import { focusQuietly, hasKeyboardFocus, showKeyboardFocus } from './quietFocus'

export type GlanceCloseReason = 'skip' | 'explore'

export interface GlanceOverlayProps {
  glance?: Glance
  /** The card to open on. */
  initialIndex?: number
  /**
   * The automatic first-visit opening: the card pops a beat later (`duration.celebrate`) with one
   * burst of confetti. Ignored under reduced motion. Replays leave it off.
   */
  celebrate?: boolean
  /** Called once the dialog has closed: `explore` from the last card's button, `skip` otherwise. */
  onClose: (reason: GlanceCloseReason) => void
}

// Confetti colours: the palette's pink, cobalt, blush and white (colour tokens, read at runtime).
const CONFETTI_COLORS = [
  '--color-pink-300',
  '--color-pink-600',
  '--color-cobalt-500',
  '--color-blush',
  '--color-white',
]

/**
 * One burst of confetti from behind the current card, on a canvas that exists only while it
 * plays. The drawing code is loaded on demand.
 */
function Confetti({ onDone }: { onDone: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const done = useEffectEvent(onDone)

  useEffect(() => {
    let stop: (() => void) | undefined
    let cancelled = false
    const timer = window.setTimeout(() => {
      void import('./confetti').then(({ burstConfetti }) => {
        const canvas = canvasRef.current
        const card = canvas
          ?.closest('dialog')
          ?.querySelector<HTMLElement>('[data-position="current"]')
        if (cancelled || !canvas || !card) return
        // The card is mid-pop (scaled about its centre), so take its centre from the screen and
        // its size from the layout.
        const box = card.getBoundingClientRect()
        const { offsetWidth: width, offsetHeight: height } = card
        const root = getComputedStyle(document.documentElement)
        stop = burstConfetti(canvas, {
          from: {
            x: box.left + box.width / 2 - width / 2,
            y: box.top + box.height / 2 - height / 2,
            width,
            height,
          },
          duration: CONFETTI_DURATION,
          colors: CONFETTI_COLORS.map((name) => root.getPropertyValue(name).trim()),
          onDone: done,
        })
      })
    }, CELEBRATE_DELAY)
    return () => {
      cancelled = true
      window.clearTimeout(timer)
      stop?.()
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      data-confetti=""
      className="pointer-events-none fixed inset-0 size-full"
    />
  )
}

/** A horizontal swipe longer than this (CSS pixels) changes the card. */
export const SWIPE_DISTANCE = 48

/** Where a card sits relative to the current one: beside it (`near`) or out of sight (`far`). */
function position(offset: number): 'current' | 'near' | 'far' {
  if (offset === 0) return 'current'
  return Math.abs(offset) === 1 ? 'near' : 'far'
}

/**
 * The "At a glance" intro: a modal `<dialog>` (focus stays inside, Escape closes it, the page
 * behind is inert, dimmed and blurred) holding narrow, portrait Wrapped-style story cards in a
 * carousel. The previous and next cards show beside the current one, smaller and faded, hidden
 * from assistive technology. On opening the current card pops out; cards slide, scale and fade
 * between positions; under reduced motion all of it is instant (CSS). Nothing advances by itself:
 * Next and Back, the dots, the Left and Right arrow keys and a swipe change the card. Each card is
 * a group announced as "Card 2 of 6"; a polite live region repeats that when the card changes. Skip
 * floats above the card's top right; Back, the dots and Next sit in one row below it, straight on
 * the dimmed page. On a first visit (`celebrate`) the card pops a beat later, with confetti. It
 * mounts open and calls `onClose` after it closes.
 */
export function GlanceOverlay({
  glance = defaultGlance,
  initialIndex = 0,
  celebrate = false,
  onClose,
}: GlanceOverlayProps) {
  const { cards, label } = glance
  const count = cards.length
  const [index, setIndex] = useState(() => Math.min(Math.max(initialIndex, 0), count - 1))
  const [moved, setMoved] = useState(false)
  // Until the first move the dialog plays its entrance (CSS, only when motion is allowed).
  const [opening, setOpening] = useState(true)
  // Decided once, on opening: the confetti and its pause never start halfway through.
  const [confetti, setConfetti] = useState(() => celebrate && !prefersReducedMotion())
  const dialogRef = useRef<HTMLDialogElement>(null)
  const nextRef = useRef<HTMLButtonElement>(null)
  const backRef = useRef<HTMLButtonElement>(null)
  const closeReason = useRef<GlanceCloseReason>('skip')
  const swipeStart = useRef<{ x: number; y: number } | null>(null)
  const notifyClosed = useEffectEvent(() => onClose(closeReason.current))
  const last = index === count - 1

  useLayoutEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    // Read before showModal(), which moves focus to Skip: a keyboard user gets the ring at once.
    const keyboard = hasKeyboardFocus()
    if (!dialog.open) dialog.showModal()
    // Start on the main action rather than the first control (Skip), with no ring until the
    // visitor uses the keyboard.
    focusQuietly(nextRef.current, keyboard)
    const handleClose = () => {
      // A close queued by an earlier mount (React StrictMode) arrives after the dialog reopened.
      if (dialog.open) return
      notifyClosed()
    }
    dialog.addEventListener('close', handleClose)
    return () => {
      dialog.removeEventListener('close', handleClose)
      if (dialog.open) dialog.close()
    }
  }, [])

  function close(reason: GlanceCloseReason) {
    closeReason.current = reason
    dialogRef.current?.close()
  }

  function go(to: number) {
    const target = Math.min(Math.max(to, 0), count - 1)
    if (target === index) return
    // Back disappears on the first card; keep focus on a control that stays.
    if (target === 0 && document.activeElement === backRef.current) focusQuietly(nextRef.current)
    setIndex(target)
    setMoved(true)
    setOpening(false)
  }

  function handleKeyDown(event: KeyboardEvent<HTMLDialogElement>) {
    showKeyboardFocus(event.key)
    if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
      event.preventDefault()
      go(index + (event.key === 'ArrowRight' ? 1 : -1))
    } else if (event.key === 'Escape') {
      // Handled here rather than by the native cancel, so every browser closes it the same way.
      event.preventDefault()
      close('skip')
    }
  }

  function handlePointerDown(event: PointerEvent<HTMLDivElement>) {
    swipeStart.current =
      event.pointerType === 'mouse' ? null : { x: event.clientX, y: event.clientY }
  }

  function handlePointerUp(event: PointerEvent<HTMLDivElement>) {
    const start = swipeStart.current
    swipeStart.current = null
    if (!start) return
    const dx = event.clientX - start.x
    const dy = event.clientY - start.y
    if (Math.abs(dx) < SWIPE_DISTANCE || Math.abs(dx) < Math.abs(dy)) return
    go(index + (dx < 0 ? 1 : -1))
  }

  return (
    <dialog
      ref={dialogRef}
      aria-label={label}
      onKeyDown={handleKeyDown}
      data-opening={opening || undefined}
      data-celebrate={celebrate || undefined}
      className="glance-dialog m-0 h-dvh max-h-none w-full max-w-none overflow-hidden border-0 bg-transparent p-0"
    >
      {confetti && <Confetti onDone={() => setConfetti(false)} />}
      {/* The controls sit on the dimmed page, so they take the ink scene's light-on-dark roles
          (index.css drops its background). */}
      <div className="glance-frame scene-ink flex h-full flex-col justify-center gap-2 py-2 sm:gap-3 sm:py-6">
        <div className="glance-bar flex justify-end">
          <Button variant="ghost" onClick={() => close('skip')}>
            Skip
          </Button>
        </div>
        <div
          className="glance-stage touch-pan-y"
          onPointerDown={handlePointerDown}
          onPointerUp={handlePointerUp}
          onPointerCancel={() => (swipeStart.current = null)}
        >
          {cards.map((card, cardIndex) => {
            const offset = cardIndex - index
            const active = offset === 0
            return (
              // A slide is a group, as in the WAI-ARIA carousel pattern; no native element fits.
              <div
                key={card.id}
                // oxlint-disable-next-line jsx-a11y/prefer-tag-over-role
                role="group"
                aria-roledescription="slide"
                aria-label={`Card ${cardIndex + 1} of ${count}`}
                // Only the current card is perceivable and operable; its neighbours are scenery.
                inert={!active}
                aria-hidden={active ? undefined : true}
                data-position={position(offset)}
                style={{ '--glance-offset': Math.min(Math.max(offset, -2), 2) } as CSSProperties}
                // The card scrolls when its content is taller than the screen (320px, 200% zoom),
                // so it must be reachable by keyboard.
                // oxlint-disable-next-line jsx-a11y/no-noninteractive-tabindex
                tabIndex={active ? 0 : undefined}
                className={cx(
                  `scene-${card.scene}`,
                  'glance-card flex flex-col overflow-y-auto rounded-card bg-scene',
                  // Card 1's portrait bleeds to the card's edge, so that card sets its own spacing.
                  card.kind !== 'hello' && 'p-4 sm:p-6',
                  FOCUS_RING,
                )}
              >
                <GlanceCard card={card} active={active} />
              </div>
            )
          })}
        </div>

        {/* Back, the dots and Next in one symmetric row. On card 1 Back keeps its place but is
            hidden from everyone, so the dots stay centred. */}
        <div className="glance-controls flex items-stretch justify-between gap-1 sm:gap-2">
          <Button
            ref={backRef}
            variant="secondary"
            disabled={index === 0}
            aria-hidden={index === 0 || undefined}
            onClick={() => go(index - 1)}
            className={cx('glance-control', index === 0 && 'invisible')}
          >
            Back
          </Button>
          <ul className="flex items-center">
            {cards.map((card, cardIndex) => (
              <li key={card.id}>
                <button
                  type="button"
                  aria-label={`Go to card ${cardIndex + 1} of ${count}`}
                  aria-current={cardIndex === index ? 'true' : undefined}
                  onClick={() => go(cardIndex)}
                  className={cx(
                    'grid w-6 cursor-pointer place-items-center rounded-pill py-2',
                    FOCUS_RING,
                  )}
                >
                  {/* The current card's dot is wider and filled, so it does not rely on colour. */}
                  <span
                    aria-hidden="true"
                    className={cx(
                      'block h-2.5 rounded-pill border-(length:--border-rule) border-scene-fg',
                      cardIndex === index ? 'w-5 bg-scene-fg' : 'w-2.5',
                    )}
                  />
                </button>
              </li>
            ))}
          </ul>
          <Button
            ref={nextRef}
            onClick={() => (last ? close('explore') : go(index + 1))}
            className="glance-control"
          >
            {last ? 'Explore my work' : 'Next'}
          </Button>
        </div>

        <p aria-live="polite" className="sr-only">
          {moved ? `Card ${index + 1} of ${count}` : ''}
        </p>
      </div>
    </dialog>
  )
}
