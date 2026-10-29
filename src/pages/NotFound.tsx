import { Page } from '../components/layout/Page'
import { RouteLink } from '../components/layout/RouteLink'
import { Text } from '../components/ui/Text'

/** Any URL without a route, including deep links GitHub Pages serves through 404.html. */
export function NotFound() {
  return (
    <Page title="Page not found">
      <Text className="max-w-prose">
        There is no page at this address. It may have moved, or the link may be mistyped.
      </Text>
      <Text>
        <RouteLink to="/">Go to the home page</RouteLink>
      </Text>
    </Page>
  )
}
