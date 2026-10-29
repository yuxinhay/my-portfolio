import { useEffect } from 'react'
import { pageTitle } from '../../content/site'

/** Sets `document.title` to "<page> · <site name>". */
export function useDocumentTitle(page: string): void {
  useEffect(() => {
    document.title = pageTitle(page)
  }, [page])
}
