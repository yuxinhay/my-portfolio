// First-visit confetti for the At a glance intro (ADR 0008). Loaded on demand, so it costs nothing
// on a repeat visit, a replay or under reduced motion. No dependency: one canvas, one burst.

export interface ConfettiOptions {
  /** The card the pieces burst from behind, in CSS pixels relative to the canvas. */
  from: { x: number; y: number; width: number; height: number }
  /** Total length in ms; pieces fade out over the last part of it. */
  duration: number
  /** Piece colours, as CSS colour strings (read from the colour tokens by the caller). */
  colors: readonly string[]
  /** Number of pieces. */
  count?: number
  /** Called once, after the last frame, when the canvas is blank. */
  onDone?: () => void
}

interface Piece {
  x: number
  y: number
  vx: number
  vy: number
  width: number
  height: number
  angle: number
  spin: number
  /** Flips per second (kept below 1.5, so a piece never flickers 3 or more times a second). */
  flip: number
  phase: number
  color: string
}

const random = (min: number, max: number) => min + Math.random() * (max - min)

function createPieces({ from, colors, count = 56 }: ConfettiOptions): Piece[] {
  const reach = from.width / 2
  return Array.from({ length: count }, (_, index) => {
    // All round the card, loosely, from inside its edge, with a lean upwards so the pieces arc
    // out and fall.
    const angle = (index / count) * Math.PI * 2 + random(-0.5, 0.5)
    const speed = reach * random(1, 3.4)
    const start = random(0.5, 0.95)
    return {
      x: from.x + from.width / 2 + Math.cos(angle) * reach * start,
      y: from.y + from.height / 2 + Math.sin(angle) * (from.height / 2) * start,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - reach * 1.2,
      width: random(6, 10),
      height: random(10, 16),
      angle: random(0, Math.PI * 2),
      spin: random(-4, 4),
      flip: random(0.5, 1.4),
      phase: random(0, Math.PI * 2),
      color: colors[index % colors.length] ?? 'currentColor',
    }
  })
}

/**
 * Bursts confetti from `origin` on `canvas` once: the pieces fly out, slow down, fall and fade out
 * over `duration`. Returns a function that stops it early. The canvas is sized to its CSS box.
 */
export function burstConfetti(canvas: HTMLCanvasElement, options: ConfettiOptions): () => void {
  const maybeContext = canvas.getContext('2d')
  if (!maybeContext) {
    options.onDone?.()
    return () => {}
  }
  const context: CanvasRenderingContext2D = maybeContext
  const ratio = window.devicePixelRatio || 1
  const { clientWidth: width, clientHeight: height } = canvas
  canvas.width = Math.round(width * ratio)
  canvas.height = Math.round(height * ratio)
  context.scale(ratio, ratio)

  const pieces = createPieces(options)
  const gravity = options.from.width * 1.6
  let start: number | undefined
  let previous = 0
  let frame = 0

  function draw(now: number) {
    start ??= now
    const elapsed = now - start
    const step = Math.min((now - (previous || now)) / 1000, 0.05)
    previous = now
    const progress = elapsed / options.duration
    context.clearRect(0, 0, width, height)
    if (progress >= 1) {
      options.onDone?.()
      return
    }
    // Full strength for the first 55%, then a linear fade to nothing.
    context.globalAlpha = Math.min(1, (1 - progress) / 0.45)
    const drag = Math.pow(0.25, step)
    for (const piece of pieces) {
      piece.vx *= drag
      piece.vy = piece.vy * drag + gravity * step
      piece.x += piece.vx * step
      piece.y += piece.vy * step
      piece.angle += piece.spin * step
      const turn = Math.cos(piece.phase + (elapsed / 1000) * piece.flip * Math.PI * 2)
      context.save()
      context.translate(piece.x, piece.y)
      context.rotate(piece.angle)
      context.scale(1, Math.max(Math.abs(turn), 0.2))
      context.fillStyle = piece.color
      context.fillRect(-piece.width / 2, -piece.height / 2, piece.width, piece.height)
      context.restore()
    }
    frame = requestAnimationFrame(draw)
  }

  frame = requestAnimationFrame(draw)
  return () => cancelAnimationFrame(frame)
}
