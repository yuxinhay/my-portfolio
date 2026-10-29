import { act, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { site } from '../../content/site'
import { renderApp } from '../../test/router'
import { describeStoriesAxe } from '../../test/stories'
import { GLANCE_SEEN_KEY } from './glanceStorage'
import * as stories from './GlanceIntro.stories'

// The shared setup marks the intro as seen; these tests start as first-time visitors.
beforeEach(() => localStorage.removeItem(GLANCE_SEEN_KEY))
afterEach(() => vi.restoreAllMocks())

const intro = () => screen.queryByRole('dialog', { name: 'Yuxin Hay at a glance' })
const h1 = () => screen.getByRole('heading', { level: 1, name: site.name })

describe('GlanceIntro', () => {
  it('opens on a first visit to the home page, and stays closed once closed', async () => {
    const user = userEvent.setup()
    const first = renderApp('/')
    expect(intro()).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Skip' }))
    expect(intro()).toBeNull()
    expect(localStorage.getItem(GLANCE_SEEN_KEY)).not.toBeNull()
    expect(h1()).toHaveFocus()
    first.unmount()

    renderApp('/')
    expect(intro()).toBeNull()
  })

  it('moves focus to the h1 after "Explore my work"', async () => {
    const user = userEvent.setup()
    renderApp('/')
    for (let i = 0; i < 5; i++) await user.click(screen.getByRole('button', { name: 'Next' }))
    await user.click(screen.getByRole('button', { name: 'Explore my work' }))
    expect(intro()).toBeNull()
    expect(h1()).toHaveFocus()
  })

  it('does not open when the visit starts on another page', async () => {
    const { router } = renderApp('/design-system')
    expect(intro()).toBeNull()
    await act(() => router.navigate('/'))
    expect(h1()).toHaveFocus()
    expect(intro()).toBeNull()
  })

  it('replays from the home page and returns focus to the Replay button', async () => {
    localStorage.setItem(GLANCE_SEEN_KEY, '1')
    const user = userEvent.setup()
    renderApp('/')
    expect(intro()).toBeNull()
    const replay = screen.getByRole('button', { name: 'Replay intro' })
    await user.click(replay)
    expect(intro()).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Next' })).toHaveFocus()
    await user.keyboard('{Escape}')
    expect(intro()).toBeNull()
    expect(replay).toHaveFocus()

    await user.click(replay)
    await user.click(screen.getByRole('button', { name: 'Go to card 6 of 6' }))
    await user.click(screen.getByRole('button', { name: 'Explore my work' }))
    expect(h1()).toHaveFocus()
  })

  it('stays closed when storage cannot be read', () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('blocked')
    })
    renderApp('/')
    expect(intro()).toBeNull()
  })
})

describeStoriesAxe(stories)
