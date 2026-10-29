// PROTOTYPE: count-up and odometer numbers. Screen readers get the real value from a visually
// hidden copy; the animated copy is aria-hidden, and an invisible copy of the final value holds
// the width so nothing shifts while digits change.
import { useCallback, useEffect, useRef, useState } from 'react'
import type { CSSProperties, RefObject } from 'react'
import { useMotionSettings, useReducedMotion } from './settings'

/** Proposed token `duration.count`: long enough to read as counting, short of the 1s ceiling. */
const COUNT_DURATION = 1000

interface ParsedStat {
  prefix: string
  number: number
  suffix: string
  grouped: boolean
}

/** "$7,000+" → { prefix "$", 7000, suffix "+" }. Ranges like "1–2 weeks" are not animated. */
function parseStat(value: string): ParsedStat | null {
  const match = /^(\D*?)(\d[\d,]*)(\D*)$/.exec(value)
  if (!match) return null
  const [, prefix = '', digits = '', suffix = ''] = match
  return {
    prefix,
    number: Number(digits.replaceAll(',', '')),
    suffix,
    grouped: digits.includes(','),
  }
}

function format({ prefix, suffix, grouped }: ParsedStat, number: number): string {
  return `${prefix}${grouped ? number.toLocaleString('en-US') : number}${suffix}`
}

/** Calls `onEnter` once, when the element is at least half on screen. */
function useInView(ref: RefObject<Element | null>, onEnter: () => void) {
  useEffect(() => {
    const element = ref.current
    if (!element) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return
        observer.disconnect()
        onEnter()
      },
      { threshold: 0.5 },
    )
    observer.observe(element)
    return () => observer.disconnect()
  }, [ref, onEnter])
}

function CountUp({ stat }: { stat: ParsedStat }) {
  const ref = useRef<HTMLSpanElement>(null)
  const [count, setCount] = useState(0)
  const frame = useRef(0)
  const start = useCallback(() => {
    const begin = performance.now()
    const tick = (now: number) => {
      const progress = Math.min(1, (now - begin) / COUNT_DURATION)
      // Ease-out cubic, close to the `easing.out` token's curve.
      setCount(Math.round((1 - (1 - progress) ** 3) * stat.number))
      if (progress < 1) frame.current = requestAnimationFrame(tick)
    }
    frame.current = requestAnimationFrame(tick)
  }, [stat.number])
  useInView(ref, start)
  useEffect(() => () => cancelAnimationFrame(frame.current), [])
  return (
    <span ref={ref} className="proto-stat-live">
      {format(stat, count)}
    </span>
  )
}

function Odometer({ stat }: { stat: ParsedStat }) {
  const ref = useRef<HTMLSpanElement>(null)
  const [rolled, setRolled] = useState(false)
  const roll = useCallback(() => setRolled(true), [])
  useInView(ref, roll)
  const chars = [...format(stat, stat.number)]
  let digitIndex = 0
  return (
    <span
      ref={ref}
      className={rolled ? 'proto-stat-live proto-odo is-rolled' : 'proto-stat-live proto-odo'}
    >
      {chars.map((char, index) => {
        if (!/\d/.test(char)) {
          return (
            <span key={index} className="proto-odo-char">
              {char}
            </span>
          )
        }
        const style = { '--d': char, '--i': digitIndex++ } as CSSProperties
        return (
          <span key={index} className="proto-odo-col" style={style}>
            <span className="proto-odo-strip">
              {/* Two full turns of digits, so every column visibly spins before it lands. */}
              {[...'01234567890123456789'].map((digit, i) => (
                <span key={i}>{digit}</span>
              ))}
            </span>
          </span>
        )
      })}
    </span>
  )
}

/** A stat's value, animated per the prototype setting; the plain value otherwise. */
export function StatValue({ value }: { value: string }) {
  const { count } = useMotionSettings()
  const reduced = useReducedMotion()
  const stat = parseStat(value)
  if (count === 'none' || reduced || !stat || typeof IntersectionObserver === 'undefined') {
    return <>{value}</>
  }
  return (
    <>
      <span className="sr-only">{value}</span>
      <span aria-hidden="true" className="proto-stat">
        <span className="proto-stat-ghost">{value}</span>
        {count === 'count' ? (
          <CountUp key={value} stat={stat} />
        ) : (
          <Odometer key={value} stat={stat} />
        )}
      </span>
    </>
  )
}
