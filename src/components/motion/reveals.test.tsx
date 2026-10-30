import { fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { stubIntersectionObserver, stubReducedMotion } from '../../test/motion'
import { renderApp } from '../../test/router'
import { MAX_STAGGER, REVEAL_GROUP, startReveals } from './reveals'

afterEach(() => {
  vi.unstubAllGlobals()
  delete document.documentElement.dataset['motion']
})

function Groups() {
  return (
    <div data-testid="root">
      <div {...{ [REVEAL_GROUP]: '' }}>
        <h2>Title</h2>
        <p>Paragraph</p>
        <ul>
          {Array.from({ length: 9 }, (_, i) => (
            <li key={i}>Item {i}</li>
          ))}
        </ul>
        <button type="button">Focusable</button>
      </div>
      <p>Outside any group</p>
    </div>
  )
}

const marked = () => [...document.querySelectorAll('[data-reveal]')]

describe('startReveals', () => {
  it('hides nothing without an IntersectionObserver', () => {
    render(<Groups />)
    startReveals(screen.getByTestId('root'))
    expect(marked()).toEqual([])
    expect(document.documentElement).not.toHaveAttribute('data-motion')
  })

  it('hides nothing under reduced motion', () => {
    stubIntersectionObserver()
    stubReducedMotion(true)
    render(<Groups />)
    startReveals(screen.getByTestId('root'))
    expect(marked()).toEqual([])
    expect(document.documentElement).not.toHaveAttribute('data-motion')
  })

  it("marks the document and each group's children, list by item, with a capped stagger", () => {
    stubIntersectionObserver()
    render(<Groups />)
    startReveals(screen.getByTestId('root'))
    expect(document.documentElement).toHaveAttribute('data-motion')
    expect(marked().map((element) => element.textContent)).toEqual([
      'Title',
      'Paragraph',
      ...Array.from({ length: 9 }, (_, i) => `Item ${i}`),
      'Focusable',
    ])
    expect(screen.getByText('Outside any group')).not.toHaveAttribute('data-reveal')
    const step = (text: string) =>
      (screen.getByText(text) as HTMLElement).style.getPropertyValue('--reveal-step')
    expect(step('Paragraph')).toBe('1')
    expect(step('Item 8')).toBe(String(MAX_STAGGER))
  })

  it('reveals a target once it scrolls in, or if it is already above the viewport', () => {
    const io = stubIntersectionObserver()
    render(<Groups />)
    startReveals(screen.getByTestId('root'))
    const title = screen.getByText('Title')
    const paragraph = screen.getByText('Paragraph')
    io.leave(title)
    expect(title).not.toHaveAttribute('data-revealed')
    io.enter(title)
    expect(title).toHaveAttribute('data-revealed')
    expect(io.isObserved(title)).toBe(false)
    io.above(paragraph)
    expect(paragraph).toHaveAttribute('data-revealed')
  })

  it('reveals content that receives focus before it scrolls in', () => {
    stubIntersectionObserver()
    render(<Groups />)
    startReveals(screen.getByTestId('root'))
    const button = screen.getByRole('button')
    fireEvent.focusIn(button)
    expect(button).toHaveAttribute('data-revealed')
  })

  it('shows everything again on cleanup', () => {
    stubIntersectionObserver()
    render(<Groups />)
    const stop = startReveals(screen.getByTestId('root'))
    stop()
    expect(marked()).toEqual([])
  })
})

describe('reveals in the layout', () => {
  it('fades up every home section but the intro, which holds the h1', () => {
    stubIntersectionObserver()
    const { container } = renderApp('/')
    const intro = container.querySelector('#intro')
    const skills = container.querySelector('#skills')
    expect(intro?.querySelector('[data-reveal]')).toBeNull()
    expect(skills?.querySelector('h2')).toHaveAttribute('data-reveal')
  })
})
