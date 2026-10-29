import { Fragment } from 'react'
import { intro as defaultIntro } from '../../content/intro'
import type { Intro as IntroContent } from '../../content/intro'
import { site } from '../../content/site'
import { Text } from '../ui/Text'
import { TEXT_RECIPES, cx } from '../ui/styles'
import { WrappedSection } from './WrappedSection'

export interface IntroProps {
  name?: string
  intro?: IntroContent
}

/** The opening scene: the page's h1 (the owner's name), headline, tagline and profile. */
export function Intro({ name = site.name, intro = defaultIntro }: IntroProps) {
  return (
    <WrappedSection id="intro" scene="blush" level={1} title={name} className="md:py-32">
      <div className="grid gap-6">
        <p className={cx(TEXT_RECIPES.h1, 'text-scene-accent')}>
          {intro.headline.map((part, index) => (
            <Fragment key={part}>
              {index > 0 && <span aria-hidden="true"> | </span>}
              {/* The bar is hidden from screen readers; a comma gives them the same pause. */}
              {index > 0 && <span className="sr-only">, </span>}
              <span className="inline-block">{part}</span>
            </Fragment>
          ))}
        </p>
        <p className={cx(TEXT_RECIPES.h2, 'max-w-3xl')}>{intro.tagline}</p>
      </div>
      <div className="grid max-w-prose gap-4">
        {intro.profile.map((paragraph) => (
          <Text key={paragraph}>{paragraph}</Text>
        ))}
        <Text variant="eyebrow">Based in {intro.location}</Text>
      </div>
    </WrappedSection>
  )
}
