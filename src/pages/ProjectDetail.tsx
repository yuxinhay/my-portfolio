import { useParams } from 'react-router'
import { Page } from '../components/layout/Page'
import { RouteLink } from '../components/layout/RouteLink'
import { Text } from '../components/ui/Text'
import { findProject } from '../content/projects'
import { NotFound } from './NotFound'

/** PLACEHOLDER: a project's title and summary; full case studies arrive in plan step 8. */
export function ProjectDetail() {
  const { slug = '' } = useParams()
  const project = findProject(slug)
  if (!project) return <NotFound />
  return (
    <Page title={project.title}>
      <Text variant="eyebrow">
        {project.role} · {project.when}
        {project.status && <> · {project.status}</>}
      </Text>
      <Text className="max-w-prose">{project.summary}</Text>
      <Text className="max-w-prose font-bold">Full case study coming soon.</Text>
      <Text>
        <RouteLink to="/#projects">Back to all projects</RouteLink>
      </Text>
    </Page>
  )
}
