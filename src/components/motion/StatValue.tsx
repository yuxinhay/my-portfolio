import { useEffect, useRef, useState } from 'react'
import { cx } from '../ui/styles'
import { countAt, formatStat, parseStat } from './countUp'
import type { ParsedStat } from './countUp'
import { COUNT_DURATION } from './motion'
import { useInViewOnce } from './useInView'
import { useReducedMotion } from './useReducedMotion'

export interface StatValueProps {
  /** The value as written in the content, e.g. `"$7,000+"`, `"10 weeks"` or `"1–2 weeks"`. */
  value: string
  /**
   * Starts the count from outside, e.g. when an overlay card becomes the current one: it counts
   * from 0 every time `active` turns true and rests at 0 otherwise. Without it, the number counts
   * once, when it is half on screen.
   */
  active?: boolean
  className?: string
}

/** Runs one count-up while `running` is true; shows 0 before and between runs. */
function useCount(target: number, running: boolean): number {
  const [count, setCount] = useState({ running, value: 0 })
  // A new run starts at 0, not at the previous run's last frame.
  if (count.running !== running) setCount({ running, value: 0 })
  useEffect(() => {
    if (!running) return
    let frame = 0
    const start = performance.now()
    const tick = (now: number) => {
      const elapsed = now - start
      setCount({ running: true, value: countAt(target, elapsed, COUNT_DURATION) })
      if (elapsed < COUNT_DURATION) frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [target, running])
  return count.value
}

function CountUp({
  value,
  stat,
  active,
  className,
}: {
  value: string
  stat: ParsedStat
  active: boolean | undefined
  className: string | undefined
}) {
  const ref = useRef<HTMLSpanElement>(null)
  const seen = useInViewOnce(ref, active === undefined)
  const count = useCount(stat.number, active ?? seen)
  // Screen readers get the final value only. The animated copy is hidden from them, and an
  // invisible copy of the final value holds the width, so nothing shifts while digits change.
  return (
    <span ref={ref} className={cx('inline-grid justify-items-start tabular-nums', className)}>
      <span className="sr-only">{value}</span>
      <span aria-hidden="true" className="invisible col-start-1 row-start-1">
        {value}
      </span>
      <span aria-hidden="true" className="col-start-1 row-start-1">
        {formatStat(stat, count)}
      </span>
    </span>
  )
}

/**
 * A stat value that counts up from 0, eased over `duration.count`, keeping its prefix and suffix
 * ("$", "+", " weeks"). Values that are not a single number ("1–2 weeks") are shown as they are,
 * and so is every value under reduced motion, or when nothing can tell it is on screen.
 */
export function StatValue({ value, active, className }: StatValueProps) {
  const reduced = useReducedMotion()
  const stat = parseStat(value)
  const canStart = active !== undefined || typeof IntersectionObserver !== 'undefined'
  if (!stat || reduced || !canStart) return <span className={className}>{value}</span>
  return <CountUp value={value} stat={stat} active={active} className={className} />
}
