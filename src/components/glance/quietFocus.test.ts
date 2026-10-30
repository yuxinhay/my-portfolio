import { afterEach, describe, expect, it, vi } from 'vitest'
import { focusQuietly, showKeyboardFocus } from './quietFocus'

afterEach(() => {
  vi.restoreAllMocks()
  document.body.replaceChildren()
})

function buttons() {
  document.body.innerHTML = '<button id="from">Replay</button><button id="to">Next</button>'
  const from = document.getElementById('from') as HTMLButtonElement
  const to = document.getElementById('to') as HTMLButtonElement
  return { from, to }
}

/** Makes `:focus-visible` match exactly the given elements (jsdom has no input modality). */
function stubFocusVisible(...visible: Element[]) {
  const matches = Element.prototype.matches
  vi.spyOn(Element.prototype, 'matches').mockImplementation(function (this: Element, selector) {
    return selector === ':focus-visible' ? visible.includes(this) : matches.call(this, selector)
  })
}

describe('focusQuietly', () => {
  it('focuses without a ring, and marks the control, when focus does not come from the keyboard', () => {
    const { to } = buttons()
    const focus = vi.spyOn(to, 'focus')
    focusQuietly(to, false)
    expect(to).toHaveFocus()
    expect(focus).toHaveBeenCalledWith({ focusVisible: false })
    expect(to).toHaveAttribute('data-quiet-focus')
  })

  it('keeps the ring when focus comes from a control that shows one (a keyboard user)', () => {
    const { from, to } = buttons()
    from.focus()
    stubFocusVisible(from)
    const focus = vi.spyOn(to, 'focus')
    focusQuietly(to)
    expect(to).toHaveFocus()
    expect(focus).toHaveBeenCalledWith({ focusVisible: true })
    expect(to).not.toHaveAttribute('data-quiet-focus')
  })

  it('drops the mark when the control loses focus', () => {
    const { from, to } = buttons()
    focusQuietly(to, false)
    from.focus()
    expect(to).not.toHaveAttribute('data-quiet-focus')
  })

  it('does nothing without an element', () => {
    expect(() => focusQuietly(null)).not.toThrow()
  })
})

describe('showKeyboardFocus', () => {
  it('shows the ring on a quietly focused control at the first key press', () => {
    const { to } = buttons()
    focusQuietly(to, false)
    stubFocusVisible()
    const focus = vi.spyOn(to, 'focus')
    showKeyboardFocus('Enter')
    expect(to).toHaveFocus()
    expect(to).not.toHaveAttribute('data-quiet-focus')
    expect(focus).toHaveBeenCalledWith({ focusVisible: true })
  })

  it('leaves a control that already shows its ring alone', () => {
    const { to } = buttons()
    to.focus()
    stubFocusVisible(to)
    const focus = vi.spyOn(to, 'focus')
    showKeyboardFocus('ArrowRight')
    expect(focus).not.toHaveBeenCalled()
  })

  it.each(['Shift', 'Control', 'Alt', 'Meta', 'Tab'])('ignores %s', (key) => {
    const { to } = buttons()
    focusQuietly(to, false)
    stubFocusVisible()
    const focus = vi.spyOn(to, 'focus')
    showKeyboardFocus(key)
    expect(focus).not.toHaveBeenCalled()
    expect(to).toHaveAttribute('data-quiet-focus')
  })
})
