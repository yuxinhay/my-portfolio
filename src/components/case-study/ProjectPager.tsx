import { adjacentProjects } from '../../content/projects'
import { RouteLink } from '../layout/RouteLink'
import { Text } from '../ui/Text'
import { VisuallyHidden } from '../ui/VisuallyHidden'
import { LINK_LIFT, TEXT_RECIPES, cx } from '../ui/styles'

export interface ProjectPagerProps {
  /** The current project. */
  slug: string
}

/**
 * Previous and next project in the home page order, and a link back to the projects section
 * (`/#projects`, which moves focus to that section). The first and last projects have only one
 * neighbour; the list does not wrap around.
 */
export function ProjectPager({ slug }: ProjectPagerProps) {
  const { previous, next } = adjacentProjects(slug)
  const neighbours = [
    ...(previous ? [{ label: 'Previous project', project: previous }] : []),
    ...(next ? [{ label: 'Next project', project: next }] : []),
  ]
  return (
    <nav aria-label="Projects" className="mx-auto grid max-w-5xl gap-10 px-6 py-16">
      <ul className="grid gap-8 sm:grid-cols-2">
        {neighbours.map(({ label, project }) => (
          <li
            key={label}
            className={cx(
              'grid content-start gap-2 border-t-(length:--border-rule) border-scene-fg pt-4',
              // "Next" stays on the right even when there is no previous project.
              label === 'Next project' && 'sm:col-start-2',
            )}
          >
            <Text variant="eyebrow" aria-hidden="true">
              {label}
            </Text>
            <RouteLink to={`/projects/${project.slug}`} className={cx(TEXT_RECIPES.h3, LINK_LIFT)}>
              <VisuallyHidden>{label}:</VisuallyHidden> {project.title}
            </RouteLink>
          </li>
        ))}
      </ul>
      <Text>
        <RouteLink to="/#projects" className={LINK_LIFT}>
          Back to all projects
        </RouteLink>
      </Text>
    </nav>
  )
}
