import { describe, expect, it } from 'vitest'
import { countAt, easeOut, formatStat, parseStat } from './countUp'

describe('count-up formatting', () => {
  it('splits prefix, number and suffix, keeping thousands separators', () => {
    expect(parseStat('$7,000+')).toEqual({ prefix: '$', number: 7000, suffix: '+', grouped: true })
    expect(parseStat('40+')).toEqual({ prefix: '', number: 40, suffix: '+', grouped: false })
    expect(parseStat('10 weeks')).toEqual({
      prefix: '',
      number: 10,
      suffix: ' weeks',
      grouped: false,
    })
    expect(parseStat('24')).toEqual({ prefix: '', number: 24, suffix: '', grouped: false })
  })

  it('leaves values that are not exactly one number untouched', () => {
    expect(parseStat('1–2 weeks')).toBeNull()
    expect(parseStat('2023–24')).toBeNull()
    expect(parseStat('Shipped')).toBeNull()
    expect(parseStat('1,00')).toBeNull()
  })

  it('formats intermediate numbers like the final value', () => {
    const money = parseStat('$7,000+')
    if (!money) throw new Error('not parsed')
    expect(formatStat(money, 0)).toBe('$0+')
    expect(formatStat(money, 1234)).toBe('$1,234+')
    expect(formatStat(money, 7000)).toBe('$7,000+')
    const weeks = parseStat('10 weeks')
    if (!weeks) throw new Error('not parsed')
    expect(formatStat(weeks, 3)).toBe('3 weeks')
  })

  it('eases out from 0 to the target and stops there', () => {
    expect(easeOut(0)).toBe(0)
    expect(easeOut(1)).toBe(1)
    expect(easeOut(0.5)).toBeGreaterThan(0.5)
    expect(countAt(40, 0, 1000)).toBe(0)
    expect(countAt(40, 500, 1000)).toBe(35)
    expect(countAt(40, 1000, 1000)).toBe(40)
    expect(countAt(40, 5000, 1000)).toBe(40)
    expect(countAt(40, 0, 0)).toBe(40)
  })
})
