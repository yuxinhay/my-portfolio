import { useParams } from 'react-router'
import { Page } from '../components/layout/Page'
import { RouteLink } from '../components/layout/RouteLink'
import { Text } from '../components/ui/Text'

/** PLACEHOLDER: project case studies arrive in plan step 8; unknown slugs will show NotFound. */
export function ProjectDetail() {
  const { slug = '' } = useParams()
  return (
    <Page title={`Project: ${slug}`}>
      <Text className="max-w-prose">
        Placeholder: the case study for this project arrives in plan step 8.
      </Text>
      <Text>
        <RouteLink to="/">Back to all work</RouteLink>
      </Text>
    </Page>
  )
}
