import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterEach } from 'vitest'

// Globals are off, so Testing Library cannot register its own cleanup.
afterEach(cleanup)

// jsdom has no layout or scrolling; React Router's <ScrollRestoration> calls scrollTo on navigation.
window.scrollTo = () => {}
