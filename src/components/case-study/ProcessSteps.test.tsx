import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { expectNoAxeViolations } from '../../test/axe'
import { describeStoriesAxe } from '../../test/stories'
import { studyFor } from './fixtures'
import { ProcessSteps } from './ProcessSteps'
import * as stories from './ProcessSteps.stories'

describe('ProcessSteps', () => {
  it('renders an ordered list with an h3 per step, in order', () => {
    const { steps } = studyFor('flowcentral').study.process
    render(<ProcessSteps steps={steps} />)
    expect(screen.getAllByRole('heading', { level: 3 }).map((h) => h.textContent)).toEqual(
      steps.map((step) => step.title),
    )
    expect(screen.getByText('Step 1')).toBeInTheDocument()
  })

  it('renders each step’s media', () => {
    const { steps } = studyFor('adaptive-tables').study.process
    render(<ProcessSteps steps={steps} />)
    const images = steps.flatMap((step) => step.media ?? []).filter((m) => m.kind === 'image')
    expect(screen.getAllByRole('img')).toHaveLength(images.length)
  })

  it('has no axe violations', async () => {
    const { container } = render(
      <ProcessSteps steps={studyFor('preferred-bank-account').study.process.steps} />,
    )
    await expectNoAxeViolations(container)
  })
})

describeStoriesAxe(stories)
