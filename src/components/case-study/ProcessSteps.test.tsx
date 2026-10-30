import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { expectNoAxeViolations } from '../../test/axe'
import { describeStoriesAxe } from '../../test/stories'
import { studyFor } from './fixtures'
import { ProcessSteps } from './ProcessSteps'
import * as stories from './ProcessSteps.stories'

describe('ProcessSteps', () => {
  it('renders numbered steps as an ordered list with an h3 per step, in order', () => {
    const { steps } = studyFor('preferred-bank-account').study.process
    const { container } = render(<ProcessSteps steps={steps} />)
    expect(container.firstElementChild?.tagName).toBe('OL')
    expect(screen.getAllByRole('heading', { level: 3 }).map((h) => h.textContent)).toEqual(
      steps.map((step) => step.title),
    )
    expect(screen.getByText('Step 1')).toBeInTheDocument()
  })

  it('renders unnumbered areas as an unordered list without step numbers', () => {
    const { steps } = studyFor('flowcentral').study.process
    const { container } = render(<ProcessSteps steps={steps} numbered={false} />)
    expect(container.firstElementChild?.tagName).toBe('UL')
    expect(screen.getAllByRole('heading', { level: 3 }).map((h) => h.textContent)).toEqual(
      steps.map((step) => step.title),
    )
    expect(screen.queryByText(/^Step \d/)).not.toBeInTheDocument()
  })

  it('numbers the UX case studies and not the PM ones', () => {
    const numbered = [
      'preferred-bank-account',
      'adaptive-tables',
      'in-app-video-call',
      'flowcentral',
      'made-in-cpf',
    ].map((slug) => studyFor(slug).study.process.numbered)
    expect(numbered).toEqual([true, true, true, false, false])
  })

  it('renders each step’s media', () => {
    const { steps } = studyFor('adaptive-tables').study.process
    render(<ProcessSteps steps={steps} />)
    const images = steps.flatMap((step) => step.media ?? []).filter((m) => m.kind === 'image')
    expect(screen.getAllByRole('img')).toHaveLength(images.length)
  })

  it('places text that explains the media right after the media', () => {
    const { steps } = studyFor('adaptive-tables').study.process
    render(<ProcessSteps steps={steps} />)
    const comparison = screen.getByText('Layout A (chosen)')
    const layouts = screen.getByRole('img', { name: /^Layout A and Layout B side by side/ })
    expect(layouts.compareDocumentPosition(comparison)).toBe(Node.DOCUMENT_POSITION_FOLLOWING)
  })

  it('has no axe violations, numbered or not', async () => {
    const { container } = render(
      <>
        <ProcessSteps steps={studyFor('preferred-bank-account').study.process.steps} />
        <ProcessSteps steps={studyFor('flowcentral').study.process.steps} numbered={false} />
      </>,
    )
    await expectNoAxeViolations(container)
  })
})

describeStoriesAxe(stories)
