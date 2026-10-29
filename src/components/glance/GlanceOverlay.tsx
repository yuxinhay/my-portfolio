import { useEffectEvent, useLayoutEffect, useRef, useState } from 'react'
import type { CSSProperties, KeyboardEvent, PointerEvent } from 'react'
import { glance as defaultGlance } from '../../content/glance'
import type { Glance } from '../../content/glance'
import { Button } from '../ui/Button'
import { FOCUS_RING, cx } from '../ui/styles'
import { GlanceCard } from './GlanceCard'

export type GlanceCloseReason = 'skip' | 'explore'

export interface GlanceOverlayProps {
  glance?: Glance
  /** The card to open on. */
  initialIndex?: number
  /** Called once the dialog has closed: `explore` from the last card's button, `skip` otherwise. */
  onClose: (reason: GlanceCloseReason) => void
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
 * a group announced as "Card 2 of 6"; a polite live region repeats that when the card changes. It
 * mounts open and calls `onClose` after it closes.
 */
export function GlanceOverlay({
  glance = defaultGlance,
  initialIndex = 0,
  onClose,
}: GlanceOverlayProps) {
  const { cards, label } = glance
  const count = cards.length
  const [index, setIndex] = useState(() => Math.min(Math.max(initialIndex, 0), count - 1))
  const [moved, setMoved] = useState(false)
  // Until the first move the dialog plays its entrance (CSS, only when motion is allowed).
  const [opening, setOpening] = useState(true)
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
    if (!dialog.open) dialog.showModal()
    // Start on the main action rather than the first control (Skip).
    nextRef.current?.focus()
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
    if (target === 0 && document.activeElement === backRef.current) nextRef.current?.focus()
    setIndex(target)
    setMoved(true)
    setOpening(false)
  }

  function handleKeyDown(event: KeyboardEvent<HTMLDialogElement>) {
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
      className="glance-dialog m-0 h-dvh max-h-none w-full max-w-none overflow-hidden border-0 bg-transparent p-0"
    >
      <div className="glance-frame flex h-full flex-col justify-center gap-2 py-2 sm:gap-4 sm:py-6">
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
                  'glance-card flex flex-col overflow-y-auto rounded-card bg-scene p-4 sm:p-6',
                  FOCUS_RING,
                )}
              >
                <GlanceCard card={card} active={active} />
              </div>
            )
          })}
        </div>

        {/* Skip, the dots, then Back and Next: one row on wide screens, two on a phone. */}
        <div className="glance-controls scene-ink mx-auto flex flex-wrap items-center justify-between gap-x-3 gap-y-2 rounded-card p-3">
          <Button variant="secondary" onClick={() => close('skip')}>
            Skip
          </Button>
          <ul className="flex">
            {cards.map((card, cardIndex) => (
              <li key={card.id}>
                <button
                  type="button"
                  aria-label={`Go to card ${cardIndex + 1} of ${count}`}
                  aria-current={cardIndex === index ? 'true' : undefined}
                  onClick={() => go(cardIndex)}
                  className={cx(
                    'grid cursor-pointer place-items-center rounded-pill p-1.5',
                    FOCUS_RING,
                  )}
                >
                  {/* The current card's dot is wider and filled, so it does not rely on colour. */}
                  <span
                    aria-hidden="true"
                    className={cx(
                      'block h-3 rounded-pill border-(length:--border-rule) border-scene-fg',
                      cardIndex === index ? 'w-8 bg-scene-fg' : 'w-3',
                    )}
                  />
                </button>
              </li>
            ))}
          </ul>
          <div className="ml-auto flex flex-wrap justify-end gap-3">
            {index > 0 && (
              <Button ref={backRef} variant="secondary" onClick={() => go(index - 1)}>
                Back
              </Button>
            )}
            <Button ref={nextRef} onClick={() => (last ? close('explore') : go(index + 1))}>
              {last ? 'Explore my work' : 'Next'}
            </Button>
          </div>
        </div>

        <p aria-live="polite" className="sr-only">
          {moved ? `Card ${index + 1} of ${count}` : ''}
        </p>
      </div>
    </dialog>
  )
}
