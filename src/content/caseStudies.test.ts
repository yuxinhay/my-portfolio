import { describe, expect, it } from 'vitest'
import { caseStudies, findCaseStudy } from './caseStudies'
import type { CaseStudy, Media } from './caseStudies'
import { adjacentProjects, projects } from './projects'

function allMedia(study: CaseStudy): Media[] {
  const { problem, process, solution, outcome, lessons } = study
  return [problem, process, ...process.steps, solution, outcome, lessons].flatMap(
    (part) => part?.media ?? [],
  )
}

const media = caseStudies.flatMap(allMedia)

// The shipped files, as data URLs, keyed by the path Vite gives the imported `src` in tests.
const files = import.meta.glob<string>('../assets/case-studies/**/*.webp', {
  query: '?inline',
  import: 'default',
  eager: true,
})

function bytesOf(path: string): Uint8Array {
  const key = Object.keys(files).find((file) => path.endsWith(file.replace('..', '')))
  const dataUrl = key ? files[key] : undefined
  if (!dataUrl) throw new Error(`No file for ${path}`)
  return Uint8Array.from(atob(dataUrl.split(',')[1] ?? ''), (c) => c.charCodeAt(0))
}

/** Pixel size from a WebP header (VP8X, lossy VP8 or lossless VP8L). */
function webpSize(bytes: Uint8Array): { width: number; height: number } {
  const chunk = String.fromCharCode(...bytes.slice(12, 16))
  const at = (i: number) => bytes[i] ?? 0
  if (chunk === 'VP8X') {
    return {
      width: 1 + (at(24) | (at(25) << 8) | (at(26) << 16)),
      height: 1 + (at(27) | (at(28) << 8) | (at(29) << 16)),
    }
  }
  if (chunk === 'VP8 ') {
    return { width: (at(26) | (at(27) << 8)) & 0x3fff, height: (at(28) | (at(29) << 8)) & 0x3fff }
  }
  if (chunk === 'VP8L') {
    const bits = at(21) | (at(22) << 8) | (at(23) << 16) | (at(24) << 24)
    return { width: 1 + (bits & 0x3fff), height: 1 + ((bits >> 14) & 0x3fff) }
  }
  throw new Error(`Not a WebP file (chunk "${chunk}")`)
}

describe('case studies', () => {
  it('has exactly one case study per project, in the same order', () => {
    expect(caseStudies.map((study) => study.slug)).toEqual(projects.map((p) => p.slug))
    for (const { slug } of projects) expect(findCaseStudy(slug)?.slug).toBe(slug)
    expect(findCaseStudy('no-such-project')).toBeUndefined()
  })

  it('gives every image alt text and every video a text description', () => {
    expect(media.length).toBeGreaterThan(0)
    for (const item of media) {
      expect(item.caption.trim()).not.toBe('')
      if (item.kind === 'image') expect(item.alt.trim().length).toBeGreaterThan(10)
      else expect(item.description.trim().length).toBeGreaterThan(40)
    }
  })

  it('ships images and posters as WebP and videos as MP4', () => {
    for (const item of media) {
      if (item.kind === 'image') expect(item.src).toMatch(/\.webp$/)
      else {
        expect(item.src).toMatch(/\.mp4$/)
        expect(item.poster).toMatch(/\.webp$/)
      }
    }
  })

  it('declares the real pixel size of every image and video poster', () => {
    for (const item of media) {
      const file = item.kind === 'image' ? item.src : item.poster
      expect({ file, ...webpSize(bytesOf(file)) }).toEqual({
        file,
        width: item.width,
        height: item.height,
      })
    }
  })

  it('never repeats a media file within one group (a screenshot may appear in two steps)', () => {
    for (const study of caseStudies) {
      const { problem, process, solution, outcome, lessons } = study
      for (const part of [problem, process, ...process.steps, solution, outcome, lessons]) {
        const sources = (part?.media ?? []).map((item) => item.src)
        expect(new Set(sources).size).toBe(sources.length)
      }
    }
  })

  it('labels every video as a prototype', () => {
    for (const item of media) if (item.kind === 'video') expect(item.label).toBe('Prototype video')
  })

  it('links each project to its neighbours in list order, without wrapping', () => {
    const first = projects[0]
    const second = projects[1]
    const last = projects.at(-1)
    expect(adjacentProjects(first?.slug ?? '')).toEqual({ next: second })
    expect(adjacentProjects(second?.slug ?? '')).toEqual({ previous: first, next: projects[2] })
    expect(adjacentProjects(last?.slug ?? '')).toEqual({ previous: projects.at(-2) })
    expect(adjacentProjects('no-such-project')).toEqual({})
  })
})
