import { screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { caseStudies } from '../content/caseStudies'
import { projects } from '../content/projects'
import { pageTitle } from '../content/site'
import { expectNoAxeViolations } from '../test/axe'
import { renderApp } from '../test/router'

describe('ProjectDetail', () => {
  it.each(projects.map((project) => [project.slug, project] as const))(
    '/projects/%s renders the full case study',
    async (slug, project) => {
      const study = caseStudies.find((s) => s.slug === slug)
      if (!study) throw new Error(`No case study for ${slug}`)
      const { container } = renderApp(`/projects/${slug}`)
      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(project.title)
      expect(document.title).toBe(pageTitle(project.title))
      for (const section of [study.problem, study.process, study.outcome]) {
        expect(screen.getByRole('region', { name: section.heading })).toBeInTheDocument()
      }
      for (const img of screen.queryAllByRole('img')) {
        expect(img.getAttribute('alt')?.trim()).not.toBe('')
      }
      for (const video of container.querySelectorAll('video')) {
        expect(video).not.toHaveAttribute('autoplay')
        expect(video).toHaveAttribute('aria-describedby')
      }
      expect(screen.getByRole('navigation', { name: 'Projects' })).toBeInTheDocument()
      await expectNoAxeViolations(container)
    },
  )

  it('labels the status in text', () => {
    renderApp('/projects/in-app-video-call')
    const overview = screen.getByRole('region', { name: /in-app video call/ })
    expect(within(overview).getByText('Status').nextElementSibling).toHaveTextContent('Concept')
    expect(within(overview).getByText('When').nextElementSibling).toHaveTextContent('2023')
  })

  it('moves to the next project and focuses its h1', async () => {
    const user = userEvent.setup()
    const [first, second] = projects
    if (!first || !second) throw new Error('Needs two projects')
    renderApp(`/projects/${first.slug}`)
    await user.click(screen.getByRole('link', { name: `Next project: ${second.title}` }))
    expect(screen.getByRole('heading', { level: 1, name: second.title })).toHaveFocus()
  })

  it('shows the not-found page for an unknown slug', () => {
    renderApp('/projects/no-such-project')
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Page not found')
  })
})
