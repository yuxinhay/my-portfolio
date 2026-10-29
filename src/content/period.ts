/** A year (`2019`) or a year and month (`2025-01`), as accepted by `<time datetime>`. */
export type IsoDate = `${number}` | `${number}-${number}`

/** A span of time. `end: null` means "to the present"; `end` equal to `start` is a single date. */
export interface Period {
  start: IsoDate
  end: IsoDate | null
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

/** Formats an ISO date for display: `2025-01` → "Jan 2025", `2019` → "2019". */
export function formatIsoDate(date: IsoDate): string {
  const [year, month] = date.split('-')
  const name = month === undefined ? undefined : MONTHS[Number(month) - 1]
  return name === undefined ? `${year}` : `${name} ${year}`
}
