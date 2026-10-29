import { act, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { expectNoAxeViolations } from '../../test/axe'
import { stubIntersectionObserver, stubReducedMotion } from '../../test/motion'
import { describeStoriesAxe } from '../../test/stories'
import { COUNT_DURATION } from './motion'
import { StatValue } from './StatValue'
import * as stories from './StatValue.stories'

afterEach(() => {
  vi.unstubAllGlobals()
  vi.useRealTimers()
})

/** The text a sighted visitor sees: the animated copy (the invisible width holder is skipped). */
function animated(container: HTMLElement) {
  return container.querySelector('[aria-hidden="true"]:not(.invisible)')?.textContent
}

function useFakeFrames() {
  vi.useFakeTimers({ toFake: ['requestAnimationFrame', 'cancelAnimationFrame', 'performance'] })
}

describe('StatValue', () => {
  it('shows the final value when nothing can tell it is on screen', () => {
    const { container } = render(<StatValue value="40+" />)
    expect(container).toHaveTextContent(/^40\+$/)
    expect(container.querySelector('[aria-hidden]')).toBeNull()
  })

  it('never animates a value that is not one number', () => {
    stubIntersectionObserver()
    const { container } = render(<StatValue value="1–2 weeks" />)
    expect(container).toHaveTextContent(/^1–2 weeks$/)
    expect(container.querySelector('[aria-hidden]')).toBeNull()
  })

  it('counts up from 0 once half on screen, keeping prefix and suffix', () => {
    useFakeFrames()
    const io = stubIntersectionObserver()
    const { container } = render(<StatValue value="$7,000+" />)
    expect(animated(container)).toBe('$0+')
    const wrapper = container.firstElementChild
    if (!wrapper) throw new Error('not rendered')
    act(() => io.enter(wrapper))
    act(() => vi.advanceTimersByTime(COUNT_DURATION / 2))
    expect(animated(container)).toMatch(/^\$[1-6],\d{3}\+$/)
    act(() => vi.advanceTimersByTime(COUNT_DURATION))
    expect(animated(container)).toBe('$7,000+')
  })

  it('gives screen readers only the final value', () => {
    stubIntersectionObserver()
    const { container } = render(<StatValue value="40+" />)
    // The only text outside aria-hidden is the visually hidden final value.
    expect(screen.getByText('40+', { selector: '.sr-only' })).toBeInTheDocument()
    for (const copy of container.querySelectorAll('.sr-only ~ span')) {
      expect(copy).toHaveAttribute('aria-hidden', 'true')
    }
  })

  it('shows the final value at once under reduced motion', () => {
    stubIntersectionObserver()
    stubReducedMotion(true)
    const { container } = render(<StatValue value="24" />)
    expect(container).toHaveTextContent(/^24$/)
    expect(container.querySelector('[aria-hidden]')).toBeNull()
  })

  it('counts each time `active` turns true and rests at 0 otherwise', () => {
    useFakeFrames()
    const { container, rerender } = render(<StatValue value="38" active={false} />)
    expect(animated(container)).toBe('0')
    rerender(<StatValue value="38" active />)
    act(() => vi.advanceTimersByTime(COUNT_DURATION + 50))
    expect(animated(container)).toBe('38')
    rerender(<StatValue value="38" active={false} />)
    expect(animated(container)).toBe('0')
    rerender(<StatValue value="38" active />)
    expect(animated(container)).toBe('0')
  })

  it('has no axe violations while counting', async () => {
    stubIntersectionObserver()
    const { container } = render(
      <p>
        <StatValue value="40+" /> AI use cases assessed
      </p>,
    )
    await expectNoAxeViolations(container)
  })
})

describeStoriesAxe(stories)
