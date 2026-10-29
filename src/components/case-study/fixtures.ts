// Real case-study content for stories and tests, so they show what the site ships.
import { findCaseStudy } from '../../content/caseStudies'
import type { CaseStudy, ImageMedia, Media, VideoMedia } from '../../content/caseStudies'
import { findProject } from '../../content/projects'
import type { Project } from '../../content/projects'

export function studyFor(slug: string): { project: Project; study: CaseStudy } {
  const project = findProject(slug)
  const study = findCaseStudy(slug)
  if (!project || !study) throw new Error(`No case study for "${slug}"`)
  return { project, study }
}

function allMedia({ problem, process, solution }: CaseStudy): Media[] {
  return [problem, process, ...process.steps, solution].flatMap((part) => part?.media ?? [])
}

const media = ['preferred-bank-account', 'adaptive-tables', 'in-app-video-call'].flatMap((slug) =>
  allMedia(studyFor(slug).study),
)

/** The first image matching a predicate. */
export function imageWhere(predicate: (image: ImageMedia) => boolean): ImageMedia {
  const image = media.find((m): m is ImageMedia => m.kind === 'image' && predicate(m))
  if (!image) throw new Error('No matching image')
  return image
}

/** The first video. */
export function firstVideo(): VideoMedia {
  const video = media.find((m): m is VideoMedia => m.kind === 'video')
  if (!video) throw new Error('No video')
  return video
}
