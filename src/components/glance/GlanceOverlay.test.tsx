import { act, fireEvent, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { glance } from '../../content/glance'
import { expectNoAxeViolations } from '../../test/axe'
import { stubReducedMotion } from '../../test/motion'
import { describeStoriesAxe } from '../../test/stories'
import { GlanceOverlay, SWIPE_DISTANCE } from './GlanceOverlay'
import * as stories from './GlanceOverlay.stories'

const COUNT = glance.cards.length

afterEach(() => {
  vi.unstubAllGlobals()
  vi.useRealTimers()
})

function renderOverlay(initialIndex = 0) {
  const onClose = vi.fn()
  const view = render(<GlanceOverlay onClose={onClose} initialIndex={initialIndex} />)
  return { onClose, ...view }
}

const dialog = () => screen.getByRole('dialog', { name: 'Yuxin Hay at a glance' })

/** The card a visitor can perceive: every other one is hidden from assistive technology. */
function currentCard() {
  const visible = screen.getAllByRole('group').filter((group) => !group.hasAttribute('inert'))
  expect(visible).toHaveLength(1)
  return visible[0] as HTMLElement
}

const dot = (n: number) => screen.getByRole('button', { name: `Go to card ${n} of ${COUNT}` })

describe('GlanceOverlay', () => {
  it('opens as a named modal dialog on card 1, with focus on Next', () => {
    renderOverlay()
    expect(dialog()).toHaveAttribute('open')
    expect(currentCard()).toHaveAttribute('aria-roledescription', 'slide')
    expect(currentCard()).toHaveAccessibleName(`Card 1 of ${COUNT}`)
    expect(screen.getByRole('button', { name: 'Next' })).toHaveFocus()
    expect(screen.queryByRole('button', { name: 'Back' })).toBeNull()
  })

  it('focuses Next without a ring until the visitor uses the keyboard', () => {
    renderOverlay()
    const next = screen.getByRole('button', { name: 'Next' })
    expect(next).toHaveAttribute('data-quiet-focus')
    fireEvent.keyDown(dialog(), { key: 'Shift' })
    expect(next).toHaveAttribute('data-quiet-focus')
    fireEvent.keyDown(dialog(), { key: 'Enter' })
    expect(next).not.toHaveAttribute('data-quiet-focus')
    expect(next).toHaveFocus()
  })

  it("keeps Back's place on card 1, hidden from everyone, so the row stays symmetric", () => {
    const { container } = renderOverlay()
    const back = container.querySelector('.glance-controls button')
    expect(back).toHaveTextContent('Back')
    expect(back).toHaveClass('invisible')
    expect(back).toBeDisabled()
    expect(back).toHaveAttribute('aria-hidden', 'true')
  })

  it('puts Skip first, then the card, then Back, the dots and Next', async () => {
    const user = userEvent.setup()
    renderOverlay(1)
    const order = () =>
      (document.activeElement as HTMLElement).getAttribute('aria-label') ??
      (document.activeElement as HTMLElement).textContent
    screen.getByRole('button', { name: 'Skip' }).focus()
    const reached = [order()]
    for (let i = 0; i < 4; i++) {
      await user.tab()
      reached.push(order())
    }
    expect(reached).toEqual([
      'Skip',
      `Card 2 of ${COUNT}`,
      'Back',
      `Go to card 1 of ${COUNT}`,
      `Go to card 2 of ${COUNT}`,
    ])
  })

  it('celebrates a first visit with confetti, a canvas hidden from assistive technology', () => {
    const onClose = vi.fn()
    const { container } = render(<GlanceOverlay onClose={onClose} celebrate />)
    expect(dialog()).toHaveAttribute('data-celebrate')
    const canvas = container.querySelector('canvas')
    expect(canvas).toHaveAttribute('aria-hidden', 'true')
    expect(canvas).toHaveClass('pointer-events-none')
  })

  it('has no confetti without `celebrate` (a replay) or under reduced motion', () => {
    const onClose = vi.fn()
    const replay = render(<GlanceOverlay onClose={onClose} />)
    expect(replay.container.querySelector('canvas')).toBeNull()
    expect(dialog()).not.toHaveAttribute('data-celebrate')
    replay.unmount()

    stubReducedMotion(true)
    const reduced = render(<GlanceOverlay onClose={onClose} celebrate />)
    expect(reduced.container.querySelector('canvas')).toBeNull()
  })

  it('hides every card but the current one', () => {
    const { container } = renderOverlay()
    const hidden = container.querySelectorAll('[role="group"][inert]')
    expect(hidden).toHaveLength(COUNT - 1)
    for (const card of hidden) expect(card).toHaveAttribute('aria-hidden', 'true')
    expect(currentCard()).toHaveAttribute('tabindex', '0')
  })

  it('shows the previous and next cards beside the current one, hidden and not focusable', async () => {
    const user = userEvent.setup()
    const { container } = renderOverlay()
    const positions = () =>
      [...container.querySelectorAll<HTMLElement>('[role="group"]')].map(
        (card) => card.dataset['position'],
      )
    // The first card has no previous one.
    expect(positions()).toEqual(['current', 'near', 'far', 'far', 'far', 'far'])
    await user.click(screen.getByRole('button', { name: 'Next' }))
    expect(positions()).toEqual(['near', 'current', 'near', 'far', 'far', 'far'])
    for (const card of container.querySelectorAll('[data-position="near"]')) {
      expect(card).toHaveAttribute('inert')
      expect(card).toHaveAttribute('aria-hidden', 'true')
      expect(card).not.toHaveAttribute('tabindex')
    }
    await user.click(dot(COUNT))
    // The last card has no next one.
    expect(positions()).toEqual(['far', 'far', 'far', 'far', 'near', 'current'])
  })

  it('plays its entrance until the first move', async () => {
    const user = userEvent.setup()
    renderOverlay()
    expect(dialog()).toHaveAttribute('data-opening')
    await user.keyboard('{ArrowRight}')
    expect(dialog()).not.toHaveAttribute('data-opening')
  })

  it('moves with Next and Back, and announces the new card', async () => {
    const user = userEvent.setup()
    renderOverlay()
    const live = dialog().querySelector('[aria-live="polite"]')
    expect(live).toHaveTextContent(/^$/)
    await user.click(screen.getByRole('button', { name: 'Next' }))
    expect(currentCard()).toHaveAccessibleName(`Card 2 of ${COUNT}`)
    expect(live).toHaveTextContent(`Card 2 of ${COUNT}`)
    await user.click(screen.getByRole('button', { name: 'Back' }))
    expect(currentCard()).toHaveAccessibleName(`Card 1 of ${COUNT}`)
    // Back is hidden on the first card, so focus moved to Next rather than being lost.
    expect(screen.queryByRole('button', { name: 'Back' })).toBeNull()
    expect(screen.getByRole('button', { name: 'Next' })).toHaveFocus()
  })

  it('moves with the Left and Right arrow keys and stops at either end', async () => {
    const user = userEvent.setup()
    renderOverlay()
    await user.keyboard('{ArrowLeft}')
    expect(currentCard()).toHaveAccessibleName(`Card 1 of ${COUNT}`)
    await user.keyboard('{ArrowRight}{ArrowRight}')
    expect(currentCard()).toHaveAccessibleName(`Card 3 of ${COUNT}`)
    await user.keyboard('{ArrowLeft}')
    expect(currentCard()).toHaveAccessibleName(`Card 2 of ${COUNT}`)
    for (let i = 0; i < COUNT + 2; i++) await user.keyboard('{ArrowRight}')
    expect(currentCard()).toHaveAccessibleName(`Card ${COUNT} of ${COUNT}`)
  })

  it('jumps with the dots, marking the current one', async () => {
    const user = userEvent.setup()
    renderOverlay()
    expect(dot(1)).toHaveAttribute('aria-current', 'true')
    await user.click(dot(4))
    expect(currentCard()).toHaveAccessibleName(`Card 4 of ${COUNT}`)
    expect(dot(4)).toHaveAttribute('aria-current', 'true')
    expect(dot(1)).not.toHaveAttribute('aria-current')
  })

  it('changes card on a horizontal swipe, not on a vertical one', () => {
    renderOverlay()
    const area = currentCard().parentElement
    if (!area) throw new Error('No swipe area')
    const swipe = (dx: number, dy: number) => {
      fireEvent.pointerDown(area, { pointerType: 'touch', clientX: 200, clientY: 200 })
      fireEvent.pointerUp(area, { pointerType: 'touch', clientX: 200 + dx, clientY: 200 + dy })
    }
    swipe(-(SWIPE_DISTANCE + 10), 5)
    expect(currentCard()).toHaveAccessibleName(`Card 2 of ${COUNT}`)
    swipe(SWIPE_DISTANCE + 10, 0)
    expect(currentCard()).toHaveAccessibleName(`Card 1 of ${COUNT}`)
    swipe(-(SWIPE_DISTANCE + 10), 200)
    expect(currentCard()).toHaveAccessibleName(`Card 1 of ${COUNT}`)
  })

  it('turns Next into "Explore my work" on the last card, which closes it', async () => {
    const user = userEvent.setup()
    const { onClose } = renderOverlay(COUNT - 1)
    expect(screen.queryByRole('button', { name: 'Next' })).toBeNull()
    await user.click(screen.getByRole('button', { name: 'Explore my work' }))
    expect(onClose).toHaveBeenCalledExactlyOnceWith('explore')
    expect(screen.queryByRole('dialog')).toBeNull()
  })

  it('closes with Skip or Escape', async () => {
    const user = userEvent.setup()
    const skipped = renderOverlay(2)
    await user.click(screen.getByRole('button', { name: 'Skip' }))
    expect(skipped.onClose).toHaveBeenCalledExactlyOnceWith('skip')
    skipped.unmount()

    const escaped = renderOverlay()
    await user.keyboard('{Escape}')
    expect(escaped.onClose).toHaveBeenCalledExactlyOnceWith('skip')
  })

  it('never advances by itself', () => {
    vi.useFakeTimers()
    renderOverlay()
    act(() => vi.advanceTimersByTime(5 * 60 * 1000))
    expect(currentCard()).toHaveAccessibleName(`Card 1 of ${COUNT}`)
  })

  it.each(glance.cards.map((card, index) => [index + 1, card.scene, index] as const))(
    'card %i (%s) has no axe violations',
    async (_, scene, index) => {
      const { container } = renderOverlay(index)
      expect(currentCard()).toHaveClass(`scene-${scene}`)
      await expectNoAxeViolations(container)
    },
  )

  it('has no axe violations under reduced motion, with final numbers', async () => {
    stubReducedMotion(true)
    const { container } = renderOverlay(2)
    // No animated copies: each number is plain text with its final value.
    expect(currentCard().querySelector('.sr-only, .invisible')).toBeNull()
    expect(within(currentCard()).getByText('40+')).toBeInTheDocument()
    await expectNoAxeViolations(container)
  })
})

describeStoriesAxe(stories)
