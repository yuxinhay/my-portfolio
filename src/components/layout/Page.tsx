import type { ReactNode } from 'react'
import { Heading } from '../ui/Heading'
import { useDocumentTitle } from './useDocumentTitle'

export interface PageProps {
  /** The page's h1, and the first part of the document title. */
  title: string
  children?: ReactNode
}

/**
 * A routed page: sets the document title and renders the page's only h1. The h1 takes programmatic
 * focus (`tabIndex={-1}`) so the layout can move focus to it after navigation; it is not a control,
 * so it shows no focus ring.
 */
export function Page({ title, children }: PageProps) {
  useDocumentTitle(title)

  return (
    <div className="mx-auto grid max-w-5xl gap-6 px-6 py-12">
      <Heading level={1} size="display" tabIndex={-1} className="focus:outline-hidden">
        {title}
      </Heading>
      {children}
    </div>
  )
}
