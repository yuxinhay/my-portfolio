/** Keys that do not count as using the keyboard: modifiers alone, and Tab, which moves focus. */
const QUIET_KEYS = new Set(['Shift', 'Control', 'Alt', 'Meta', 'Tab'])

/** Whether the focused element shows a focus ring, that is the visitor reached it by keyboard. */
export function hasKeyboardFocus(): boolean {
  const focused = document.activeElement
  return focused instanceof HTMLElement && focused.matches(':focus-visible')
}

/**
 * Focuses a control from script with a focus ring only for a keyboard user (`keyboard`: by
 * default, whether the element that has focus now shows a ring, as after a keyboard Replay).
 * Otherwise (the automatic opening, a mouse or touch Replay) it asks for no ring
 * (`focusVisible: false`); browsers that ignore that option would draw it anyway, so the control
 * is also marked `data-quiet-focus`, which hides the ring and the focus lift in CSS until the
 * visitor uses the keyboard (`showKeyboardFocus`).
 */
export function focusQuietly(element: HTMLElement | null, keyboard = hasKeyboardFocus()) {
  if (!element) return
  if (keyboard) {
    delete element.dataset['quietFocus']
  } else {
    element.dataset['quietFocus'] = ''
    // The mark goes with the focus: coming back by keyboard shows the ring.
    element.addEventListener('blur', () => delete element.dataset['quietFocus'], { once: true })
  }
  element.focus({ focusVisible: keyboard })
}

/**
 * The visitor pressed a key: the focused control shows its ring from now on (WCAG 2.4.7). Some
 * browsers (Chromium) keep a control focused without a ring that way after a key press, so it is
 * focused again, asking for the ring.
 */
export function showKeyboardFocus(key: string) {
  const element = document.activeElement
  if (!(element instanceof HTMLElement) || QUIET_KEYS.has(key)) return
  delete element.dataset['quietFocus']
  if (element.matches(':focus-visible')) return
  element.blur()
  element.focus({ focusVisible: true })
}
