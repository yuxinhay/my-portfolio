export interface Project {
  /** URL segment for `/projects/:slug`; unique (checked in content.test.ts). */
  slug: string
  title: string
  /** Yuxin's role on the project. */
  role: 'UX' | 'PM' | 'Programme Manager'
  /** When, as shown on the card. */
  when: string
  /** Shipped work and concepts are labelled in text, never by colour alone. */
  status?: 'Shipped' | 'Concept'
  summary: string
}

export const projects: readonly Project[] = [
  {
    slug: 'preferred-bank-account',
    title: 'Preferred Bank Account: anti-scam measures',
    role: 'UX',
    when: 'Aug 2023',
    status: 'Shipped',
    summary:
      "Lead designer for the Preferred Bank Account feature and secondary designer on related anti-scam features, protecting members' retirement savings from scams, especially members 55 and above.",
  },
  {
    slug: 'adaptive-tables',
    title: 'The table dilemma: adaptive tables on mobile',
    role: 'UX',
    when: '2024',
    status: 'Shipped',
    summary:
      'Usability testing showed users struggled to compare table data on mobile. An adaptive table sections the data into categories laid out vertically, removing horizontal scrolling.',
  },
  {
    slug: 'in-app-video-call',
    title: 'Bringing the service centre closer: in-app video call',
    role: 'UX',
    when: '2023',
    status: 'Concept',
    summary:
      'Interviews at a service centre showed members cared most about convenience. The result: a high-fidelity prototype for in-app video calls and online appointments.',
  },
  {
    slug: 'flowcentral',
    title: 'flowCentral: agentic AI workflow platform',
    role: 'PM',
    when: '2025–present',
    summary:
      'Main Product Manager of an internal agentic AI workflow platform built on open-source n8n, adding governance and security so staff can streamline their work.',
  },
  {
    slug: 'made-in-cpf',
    title: 'Made-in-CPF (MIC): intrapreneurship programme',
    role: 'Programme Manager',
    when: 'Seasons 4 & 5',
    summary:
      'A programme where any staff member can team up to solve real workplace challenges, with protected time and curated workshops. Redesigned from 7 months to 10 weeks.',
  },
]

/** The project with this slug, or `undefined` if there is none. */
export function findProject(slug: string): Project | undefined {
  return projects.find((project) => project.slug === slug)
}

/** The projects before and after this one in the list order, for previous/next links. */
export function adjacentProjects(slug: string): { previous?: Project; next?: Project } {
  const index = projects.findIndex((project) => project.slug === slug)
  if (index === -1) return {}
  const previous = projects[index - 1]
  const next = projects[index + 1]
  return { ...(previous && { previous }), ...(next && { next }) }
}
