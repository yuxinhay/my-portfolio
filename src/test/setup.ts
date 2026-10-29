import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterEach, beforeEach } from 'vitest'
import { GLANCE_SEEN_KEY } from '../components/glance/glanceStorage'

// Globals are off, so Testing Library cannot register its own cleanup.
afterEach(cleanup)

// jsdom has no layout or scrolling; React Router's <ScrollRestoration> calls scrollTo on navigation.
window.scrollTo = () => {}

// jsdom has no <dialog> methods. These follow the parts of the spec the app relies on: showModal and
// close toggle `open`, and close fires a `close` event. Focus containment and inertness are browser
// behaviour, covered by the e2e tests.
if (typeof HTMLDialogElement.prototype.showModal !== 'function') {
  HTMLDialogElement.prototype.showModal = function showModal(this: HTMLDialogElement) {
    this.open = true
  }
  HTMLDialogElement.prototype.close = function close(this: HTMLDialogElement) {
    if (!this.open) return
    this.open = false
    this.dispatchEvent(new Event('close'))
  }
}

// jsdom has no canvas (it logs "Not implemented" for each call). Without a 2D context the
// first-visit confetti draws nothing and removes itself, as it would in such a browser.
HTMLCanvasElement.prototype.getContext = () => null

// The At a glance intro opens on a first visit to the home page. Like the e2e tests, every test
// starts as a returning visitor, so the intro does not cover the page; its own tests clear this.
beforeEach(() => localStorage.setItem(GLANCE_SEEN_KEY, '1'))
afterEach(() => localStorage.clear())
