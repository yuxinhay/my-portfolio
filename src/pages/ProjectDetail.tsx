import { useParams } from 'react-router'
import { CaseStudy } from '../components/case-study/CaseStudy'
import { useDocumentTitle } from '../components/layout/useDocumentTitle'
import { findCaseStudy } from '../content/caseStudies'
import type { CaseStudy as CaseStudyContent } from '../content/caseStudies'
import { findProject } from '../content/projects'
import type { Project } from '../content/projects'
import { NotFound } from './NotFound'

function ProjectCaseStudy({ project, study }: { project: Project; study: CaseStudyContent }) {
  useDocumentTitle(project.title)
  return <CaseStudy project={project} study={study} />
}

/** `/projects/:slug`: the project's full case study, or the not-found page for an unknown slug. */
export function ProjectDetail() {
  const { slug = '' } = useParams()
  const project = findProject(slug)
  const study = findCaseStudy(slug)
  if (!project || !study) return <NotFound />
  return <ProjectCaseStudy project={project} study={study} />
}
