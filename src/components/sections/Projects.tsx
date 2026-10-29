import { projects as defaultProjects } from '../../content/projects'
import type { Project } from '../../content/projects'
import { RouteLink } from '../layout/RouteLink'
import { Card } from '../ui/Card'
import { Heading } from '../ui/Heading'
import { Tag } from '../ui/Tag'
import { Text } from '../ui/Text'
import { WrappedSection } from './WrappedSection'

export interface ProjectsProps {
  projects?: readonly Project[]
}

/**
 * Project cards. The title is the card's only link, and it covers the whole card (a pseudo-element
 * stretched over it), so the card is one large target but one tab stop with a meaningful name.
 */
export function Projects({ projects = defaultProjects }: ProjectsProps) {
  return (
    <WrappedSection id="projects" scene="blush" title="Projects">
      <ul className="grid gap-6 md:grid-cols-2">
        {projects.map(({ slug, title, role, when, status, summary }) => (
          <li key={slug} className="grid">
            <Card as="article" aria-labelledby={`project-${slug}`} className="relative">
              <Text variant="eyebrow" className="text-scene-accent">
                {role} · {when}
              </Text>
              <Heading level={3} id={`project-${slug}`}>
                <RouteLink
                  to={`/projects/${slug}`}
                  className="after:absolute after:inset-0 after:rounded-card"
                >
                  {title}
                </RouteLink>
              </Heading>
              <Text>{summary}</Text>
              {status && (
                <p>
                  <Tag variant={status === 'Concept' ? 'outline' : 'solid'}>{status}</Tag>
                </p>
              )}
            </Card>
          </li>
        ))}
      </ul>
    </WrappedSection>
  )
}
