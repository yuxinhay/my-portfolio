import {
  certifications as defaultCertifications,
  featuredStats as defaultFeatured,
  moreStats as defaultMore,
} from '../../content/achievements'
import type { Certification, Stat } from '../../content/achievements'
import { Heading } from '../ui/Heading'
import { Text } from '../ui/Text'
import { TEXT_RECIPES, cx } from '../ui/styles'
import { WrappedSection } from './WrappedSection'

export interface AchievementsProps {
  featured?: readonly Stat[]
  more?: readonly Stat[]
  certifications?: readonly Certification[]
}

/**
 * Wrapped numbers, then certifications. Each number and its label are one paragraph with a space
 * between them, so a screen reader reads "40+ AI use-case submissions assessed" as one phrase.
 */
export function Achievements({
  featured = defaultFeatured,
  more = defaultMore,
  certifications = defaultCertifications,
}: AchievementsProps) {
  return (
    <WrappedSection id="achievements" scene="cobalt" title="Achievements">
      <ul className="grid gap-10 sm:grid-cols-2">
        {featured.map(({ value, label }) => (
          <li key={label}>
            <p className="grid gap-2">
              <span className={cx(TEXT_RECIPES.stat, 'text-scene-accent')}>{value}</span>{' '}
              <span className={TEXT_RECIPES.h3}>{label}</span>
            </p>
          </li>
        ))}
      </ul>
      <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {more.map(({ value, label }) => (
          <li key={label} className="border-t-(length:--border-rule) border-scene-fg pt-4">
            <p className="grid gap-1">
              <span className={cx(TEXT_RECIPES.h1, 'text-scene-accent')}>{value}</span>{' '}
              <Text as="span">{label}</Text>
            </p>
          </li>
        ))}
      </ul>
      <div className="grid gap-4">
        <Heading level={3} id="certifications-title">
          Certifications and recognition
        </Heading>
        <ul aria-labelledby="certifications-title" className="grid gap-3 md:grid-cols-2">
          {certifications.map(({ name, issuer, year }) => (
            <li key={name}>
              <Text>
                <span className="font-bold">{name}</span>
                {issuer && <>, {issuer}</>} (<time dateTime={year}>{year}</time>)
              </Text>
            </li>
          ))}
        </ul>
      </div>
    </WrappedSection>
  )
}
