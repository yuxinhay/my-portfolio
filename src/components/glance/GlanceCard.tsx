import { Fragment } from 'react'
import type { ReactNode } from 'react'
import type {
  GlanceCard as GlanceCardContent,
  GlanceCareerCard,
  GlanceHelloCard,
  GlanceStatsCard,
  GlanceTopCard,
} from '../../content/glance'
import { StatValue } from '../motion/StatValue'
import { Text } from '../ui/Text'
import { TEXT_RECIPES, cx } from '../ui/styles'

export interface GlanceCardProps {
  card: GlanceCardContent
  /** The card on screen: its numbers count up each time it becomes active. */
  active: boolean
}

/** "→" for sighted readers, "to" for screen readers. */
function Arrow() {
  return (
    <>
      <span aria-hidden="true"> → </span>
      <span className="sr-only"> to </span>
    </>
  )
}

/** Parts joined by a decorative bar; screen readers hear a comma instead, as in the home intro. */
function Joined({ parts }: { parts: readonly string[] }) {
  return parts.map((part, index) => (
    <Fragment key={part}>
      {index > 0 && <span aria-hidden="true"> | </span>}
      {index > 0 && <span className="sr-only">, </span>}
      <span className="inline-block">{part}</span>
    </Fragment>
  ))
}

function Title({ children }: { children: ReactNode }) {
  return <h2 className={cx(TEXT_RECIPES.h1, 'text-balance')}>{children}</h2>
}

// Card numbers: the h1 step on small screens, so a card fits a phone, the display step from md up.
const CARD_NUMBER = 'text-h1 leading-tight font-black tracking-display md:text-display'

/**
 * The portrait sits upper right and the giant name overlaps it: from below on small screens, from
 * the left from md up. The name is set on the scene colour, so it keeps its contrast where it
 * crosses the photo.
 */
function HelloCard({ card }: { card: GlanceHelloCard }) {
  const { portrait } = card
  return (
    <div className="grid grid-cols-6 gap-x-4 gap-y-4 md:gap-y-6">
      <Text variant="eyebrow" className="col-start-1 col-end-7 text-scene-accent">
        <Joined parts={card.eyebrow} />
      </Text>
      <img
        src={portrait.src}
        alt={portrait.alt}
        width={portrait.width}
        height={portrait.height}
        decoding="async"
        className="col-start-4 col-end-7 row-start-2 h-auto w-full rounded-card md:row-end-4"
      />
      <h2
        className={cx(
          TEXT_RECIPES.stat,
          'relative col-start-1 col-end-7 row-start-3 -mt-16 grid justify-items-start md:col-end-5 md:row-start-2 md:mt-0 md:self-end',
        )}
      >
        {card.name.split(' ').map((word) => (
          <span key={word} className="bg-scene pr-2">
            {word}{' '}
          </span>
        ))}
      </h2>
      <p
        className={cx(
          TEXT_RECIPES.h3,
          'col-start-1 col-end-7 row-start-4 md:col-end-4 md:row-start-3',
        )}
      >
        {card.summary}
      </p>
    </div>
  )
}

function CareerCard({ card, active }: { card: GlanceCareerCard; active: boolean }) {
  return (
    <div className="grid content-start gap-4 md:gap-6">
      <Text variant="eyebrow" className="text-scene-accent">
        {card.location}
      </Text>
      {/* One heading, read as "3+ years at CPF Board". */}
      <h2 className="grid justify-items-start gap-2">
        <StatValue
          value={card.stat.value}
          active={active}
          className={cx(TEXT_RECIPES.stat, 'text-scene-accent')}
        />{' '}
        <span className={TEXT_RECIPES.h1}>{card.stat.label}</span>
      </h2>
      <p className={TEXT_RECIPES.h2}>
        {card.path[0]}
        <Arrow />
        {card.path[1]}
      </p>
      <ol className="grid grid-cols-2 gap-4">
        {card.timeline.map(({ role, years }) => (
          <li
            key={role}
            className="grid content-start gap-1 border-t-(length:--border-rule) border-scene-fg pt-3"
          >
            <Text variant="eyebrow" className="text-scene-accent">
              {years}
            </Text>
            <span className={TEXT_RECIPES.h3}>{role}</span>
          </li>
        ))}
      </ol>
    </div>
  )
}

function StatsCard({ card, active }: { card: GlanceStatsCard; active: boolean }) {
  const List = card.ordered ? 'ol' : 'ul'
  return (
    <div className="grid content-start gap-4 md:gap-6">
      {card.eyebrow && (
        <Text variant="eyebrow" className="text-scene-accent">
          {card.eyebrow}
        </Text>
      )}
      <Title>{card.title}</Title>
      <List className="grid gap-3 md:gap-4">
        {card.items.map((item, index) => (
          <li
            key={'fact' in item ? item.fact : item.label}
            className="border-t-(length:--border-rule) border-scene-fg pt-2 md:pt-3"
          >
            {'fact' in item ? (
              <p className={TEXT_RECIPES.h3}>{item.fact}</p>
            ) : (
              // One paragraph, so a screen reader reads "40+ AI use cases assessed".
              // From md up the number and its label share a row, the numbers lined up in a column.
              <p className="grid justify-items-start gap-1 md:flex md:items-baseline md:gap-6">
                <span className="flex shrink-0 items-baseline gap-2 md:w-1/2">
                  {card.ordered && index > 0 && (
                    <span aria-hidden="true" className={cx(TEXT_RECIPES.h2, 'text-scene-accent')}>
                      →
                    </span>
                  )}
                  <StatValue
                    value={item.value}
                    active={active}
                    className={cx(CARD_NUMBER, 'text-scene-accent')}
                  />
                </span>{' '}
                <span className={TEXT_RECIPES.h3}>{item.label}</span>
              </p>
            )}
          </li>
        ))}
      </List>
      {card.footnote && <p className={TEXT_RECIPES.h3}>{card.footnote}</p>}
    </div>
  )
}

function TopCard({ card }: { card: GlanceTopCard }) {
  return (
    <div className="grid content-start gap-4 md:gap-6">
      <Title>{card.title}</Title>
      <ol className="grid list-inside list-decimal gap-2 text-h2 leading-snug font-black tracking-heading marker:text-scene-accent md:text-h1">
        {card.items.map((name) => (
          <li key={name}>{name}</li>
        ))}
      </ol>
      <Text variant="small" className="text-scene-accent">
        {card.footnote}
      </Text>
    </div>
  )
}

/** The content of one At a glance card, in Wrapped type. The scene is set by the slide around it. */
export function GlanceCard({ card, active }: GlanceCardProps) {
  switch (card.kind) {
    case 'hello':
      return <HelloCard card={card} />
    case 'career':
      return <CareerCard card={card} active={active} />
    case 'stats':
      return <StatsCard card={card} active={active} />
    case 'top':
      return <TopCard card={card} />
  }
}
