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

// Each card is a narrow portrait story card (about 9:16), the same width on every screen, so the
// type steps do not change at breakpoints. The root fills the card's height, so a closing line can
// sit at the bottom, as in Wrapped.
const CARD_ROOT = 'flex flex-1 flex-col gap-3 sm:gap-4'

// Stats cards: the numbers are the giant type, so the title takes a step down to make room.
function Title({ children, size = 'h2' }: { children: ReactNode; size?: 'h2' | 'display' }) {
  return <h2 className={cx(TEXT_RECIPES[size], 'text-balance')}>{children}</h2>
}

const CARD_NUMBER = cx(TEXT_RECIPES.display, 'text-scene-accent')

/**
 * The portrait sits upper right and the giant name overlaps its lower left corner. The name is set
 * on the scene colour, so it keeps its contrast where it crosses the photo.
 */
function HelloCard({ card }: { card: GlanceHelloCard }) {
  const { portrait } = card
  return (
    <div className={CARD_ROOT}>
      <Text variant="eyebrow" className="text-scene-accent">
        <Joined parts={card.eyebrow} />
      </Text>
      <div className="grid grid-cols-6">
        <img
          src={portrait.src}
          alt={portrait.alt}
          width={portrait.width}
          height={portrait.height}
          decoding="async"
          className="col-start-3 col-end-7 row-start-1 h-auto w-full rounded-card"
        />
        <h2
          className={cx(
            TEXT_RECIPES.display,
            'relative col-start-1 col-end-7 row-start-2 -mt-20 grid justify-items-start',
          )}
        >
          {card.name.split(' ').map((word) => (
            <span key={word} className="bg-scene pr-2">
              {word}{' '}
            </span>
          ))}
        </h2>
      </div>
      <p className={cx(TEXT_RECIPES.h3, 'mt-auto')}>{card.summary}</p>
    </div>
  )
}

function CareerCard({ card, active }: { card: GlanceCareerCard; active: boolean }) {
  return (
    <div className={CARD_ROOT}>
      <Text variant="eyebrow" className="text-scene-accent">
        {card.location}
      </Text>
      {/* One heading, read as "3+ years at CPF Board". */}
      <h2 className="grid justify-items-start gap-1">
        <StatValue
          value={card.stat.value}
          active={active}
          className={cx(TEXT_RECIPES.stat, 'text-scene-accent')}
        />{' '}
        <span className={cx(TEXT_RECIPES.h1, 'text-balance')}>{card.stat.label}</span>
      </h2>
      <p className={TEXT_RECIPES.h2}>
        {card.path[0]}
        <Arrow />
        {card.path[1]}
      </p>
      <ol className="mt-auto grid grid-cols-2 gap-4">
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
    <div className={CARD_ROOT}>
      {card.eyebrow && (
        <Text variant="eyebrow" className="text-scene-accent">
          {card.eyebrow}
        </Text>
      )}
      <Title>{card.title}</Title>
      <List className="grid gap-2 sm:gap-3">
        {card.items.map((item, index) => (
          <li
            key={'fact' in item ? item.fact : item.label}
            className="border-t-(length:--border-rule) border-scene-fg pt-2"
          >
            {'fact' in item ? (
              <p className={TEXT_RECIPES.h3}>{item.fact}</p>
            ) : (
              // One paragraph, so a screen reader reads "40+ AI use cases assessed".
              <p className="grid justify-items-start">
                <span className="flex items-baseline gap-2">
                  {card.ordered && index > 0 && (
                    <span aria-hidden="true" className={cx(TEXT_RECIPES.h2, 'text-scene-accent')}>
                      →
                    </span>
                  )}
                  <StatValue value={item.value} active={active} className={CARD_NUMBER} />
                </span>{' '}
                <span className={TEXT_RECIPES.h3}>{item.label}</span>
              </p>
            )}
          </li>
        ))}
      </List>
      {card.footnote && <p className={cx(TEXT_RECIPES.h3, 'mt-auto')}>{card.footnote}</p>}
    </div>
  )
}

function TopCard({ card }: { card: GlanceTopCard }) {
  return (
    <div className={CARD_ROOT}>
      <Title size="display">{card.title}</Title>
      <ol className="grid list-inside list-decimal gap-2 text-h2 leading-snug font-black tracking-heading marker:text-scene-accent">
        {card.items.map((name) => (
          <li key={name}>{name}</li>
        ))}
      </ol>
      <Text variant="small" className="mt-auto text-scene-accent">
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
