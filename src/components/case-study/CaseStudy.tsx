import type { CaseStudy as CaseStudyContent } from '../../content/caseStudies'
import type { Project } from '../../content/projects'
import { StatValue } from '../motion/StatValue'
import { WrappedSection } from '../sections/WrappedSection'
import { Text } from '../ui/Text'
import { TEXT_RECIPES, cx } from '../ui/styles'
import { Blocks } from './Blocks'
import { CaseStudyMeta } from './CaseStudyMeta'
import { MediaGroup } from './MediaFigure'
import { ProcessSteps } from './ProcessSteps'
import { ProjectPager } from './ProjectPager'

export interface CaseStudyProps {
  project: Project
  study: CaseStudyContent
}

/**
 * A full case study as full-bleed scenes: the project title (the page's only h1) with its role,
 * timeframe and status, then an h2 section each for the problem, process, solution, outcome and
 * lessons, then previous/next project links. Light and dark scenes alternate whichever optional
 * sections a study has.
 */
export function CaseStudy({ project, study }: CaseStudyProps) {
  const { problem, process, solution, outcome, lessons } = study
  return (
    <>
      {/* Long words in titles ("intrapreneurship") hyphenate instead of overflowing at 320px. */}
      <WrappedSection
        id="overview"
        scene="pink"
        level={1}
        title={project.title}
        className="break-words hyphens-auto"
      >
        <Text variant="eyebrow">{project.role} case study</Text>
        <p className={cx(TEXT_RECIPES.h3, 'hyphens-none')}>{project.summary}</p>
        <CaseStudyMeta project={project} overview={study.overview} />
      </WrappedSection>

      <WrappedSection id="problem" scene="blush" title={problem.heading}>
        <Blocks blocks={problem.body} />
        <MediaGroup media={problem.media} layout={problem.mediaLayout} />
      </WrappedSection>

      <WrappedSection id="process" scene="ink" title={process.heading}>
        <Blocks blocks={process.body} />
        <MediaGroup media={process.media} layout={process.mediaLayout} />
        <ProcessSteps steps={process.steps} numbered={process.numbered} />
      </WrappedSection>

      {solution && (
        <WrappedSection id="solution" scene="blush" title={solution.heading}>
          <Blocks blocks={solution.body} />
          <MediaGroup media={solution.media} layout={solution.mediaLayout} />
        </WrappedSection>
      )}

      {outcome && (
        <WrappedSection id="outcome" scene="cobalt" title={outcome.heading}>
          <Blocks blocks={outcome.body} />
          {outcome.stats && (
            <ul className="grid gap-10 sm:grid-cols-2">
              {outcome.stats.map(({ value, label }) => (
                <li key={label}>
                  {/* One paragraph, so a screen reader reads "40+ use-case submissions assessed". */}
                  <p className="grid gap-2">
                    <StatValue
                      value={value}
                      className={cx(TEXT_RECIPES.display, 'text-scene-accent')}
                    />{' '}
                    <span className={TEXT_RECIPES.h3}>{label}</span>
                  </p>
                </li>
              ))}
            </ul>
          )}
          <MediaGroup media={outcome.media} layout={outcome.mediaLayout} />
        </WrappedSection>
      )}

      {lessons && (
        <WrappedSection id="lessons" scene="ink" title={lessons.heading}>
          <Blocks blocks={lessons.body} className="text-scene-accent" />
        </WrappedSection>
      )}

      <ProjectPager slug={project.slug} />
    </>
  )
}
