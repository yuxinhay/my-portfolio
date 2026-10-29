import type { CaseStudy } from '../../content/caseStudies'
import type { Project } from '../../content/projects'
import { Text } from '../ui/Text'
import { TEXT_RECIPES } from '../ui/styles'

export interface CaseStudyMetaProps {
  project: Project
  overview: CaseStudy['overview']
}

/** Role, timeframe and status as a description list; the status is always a text label. */
export function CaseStudyMeta({ project, overview }: CaseStudyMetaProps) {
  const items = [
    { term: 'Role', detail: overview.role },
    { term: 'When', detail: project.when },
    ...(project.status ? [{ term: 'Status', detail: project.status }] : []),
  ]
  return (
    <div className="grid gap-4">
      <dl className="grid gap-x-10 gap-y-4 sm:grid-cols-3">
        {items.map(({ term, detail }) => (
          <div key={term} className="grid content-start gap-1">
            <dt className={TEXT_RECIPES.eyebrow}>{term}</dt>
            <dd className={TEXT_RECIPES.h3}>{detail}</dd>
          </div>
        ))}
      </dl>
      {overview.team && <Text className="max-w-prose">{overview.team}</Text>}
    </div>
  )
}
