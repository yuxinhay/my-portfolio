/** A stat value split around its number: `"$7,000+"` → `$`, 7000, `+`, with thousands separators. */
export interface ParsedStat {
  prefix: string
  number: number
  suffix: string
  grouped: boolean
}

/**
 * Splits a stat value into prefix, number and suffix, or returns `null` if it is not exactly one
 * number: ranges ("1–2 weeks"), several numbers ("2023–24") and words stay as they are.
 */
export function parseStat(value: string): ParsedStat | null {
  const match = /^(\D*?)(\d{1,3}(?:,\d{3})+|\d+)(\D*)$/.exec(value)
  if (!match) return null
  const [, prefix = '', digits = '', suffix = ''] = match
  return {
    prefix,
    number: Number(digits.replaceAll(',', '')),
    suffix,
    grouped: digits.includes(','),
  }
}

/** The stat with `number` in place of its own, keeping prefix, suffix and separators. */
export function formatStat({ prefix, suffix, grouped }: ParsedStat, number: number): string {
  return `${prefix}${grouped ? number.toLocaleString('en-US') : number}${suffix}`
}

/** Ease-out cubic, close to the `easing.out` curve: fast at first, settling on the value. */
export function easeOut(progress: number): number {
  return 1 - (1 - progress) ** 3
}

/** The number shown `elapsed` ms into a count-up of `duration` ms. */
export function countAt(target: number, elapsed: number, duration: number): number {
  const progress = duration <= 0 ? 1 : Math.min(1, Math.max(0, elapsed / duration))
  return Math.round(easeOut(progress) * target)
}
