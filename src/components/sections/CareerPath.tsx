import { career as defaultCareer } from '../../content/career'
import type { CareerEntry } from '../../content/career'
import { formatIsoDate } from '../../content/period'
import type { Period } from '../../content/period'
import { Heading } from '../ui/Heading'
import { Text } from '../ui/Text'
import { WrappedSection } from './WrappedSection'

export interface CareerPathProps {
  entries?: readonly CareerEntry[]
}

/** A period as one or two `<time>` elements: "Jan 2025 – present", "2019 – 2023" or "2017". */
function PeriodText({ period: { start, end } }: { period: Period }) {
  const from = <time dateTime={start}>{formatIsoDate(start)}</time>
  if (end === start) return from
  return (
    <>
      {from} – {end === null ? 'present' : <time dateTime={end}>{formatIsoDate(end)}</time>}
    </>
  )
}

/** The career path as an ordered list, newest first, divided by rules. */
export function CareerPath({ entries = defaultCareer }: CareerPathProps) {
  return (
    <WrappedSection id="career" scene="ink" title="Career path">
      <Text className="text-scene-accent">Newest first.</Text>
      <ol className="grid">
        {entries.map(({ id, kind, role, organisation, period, highlights }) => (
          <li
            key={id}
            className="grid gap-2 border-t-(length:--border-rule) border-scene-fg py-6 md:grid-cols-3 md:gap-6"
          >
            <Text variant="eyebrow" className="text-scene-accent">
              <PeriodText period={period} />
              {kind === 'education' && <> · Education</>}
            </Text>
            <div className="grid gap-2 md:col-span-2">
              <Heading level={3}>{role}</Heading>
              <Text>{organisation}</Text>
              {highlights && (
                <ul className="grid list-disc gap-1 pl-5">
                  {highlights.map((highlight) => (
                    <li key={highlight}>
                      <Text variant="small" as="span">
                        {highlight}
                      </Text>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </li>
        ))}
      </ol>
    </WrappedSection>
  )
}
