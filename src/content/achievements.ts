import type { IsoDate } from './period'

/**
 * A Wrapped number. `value` and `label` render as one sentence ("40+ AI use-case submissions
 * assessed"), so screen readers read them together.
 */
export interface Stat {
  value: string
  label: string
}

export interface Certification {
  name: string
  /** Issuer, if it is not part of the name. */
  issuer?: string
  year: IsoDate
}

/** The giant numbers. Keep values short: they render at the `stat` size, even at 320px. */
export const featuredStats: readonly Stat[] = [
  { value: '3+', label: 'years at CPF Board' },
  { value: '10+', label: 'AI use cases completed and handed over' },
  { value: '24', label: 'use cases across 14 departments' },
  { value: '38', label: 'officers in 7 cross-functional teams' },
]

export const moreStats: readonly Stat[] = [
  { value: '10 weeks', label: 'Made-in-CPF, redesigned from 7 months' },
  { value: '22+', label: 'challenge submissions, narrowed to 7 challenges' },
  { value: '1–2 weeks', label: 'to vibe-code the openMIC portal' },
  { value: '40+', label: 'AI use-case submissions assessed' },
  { value: '3', label: 'roadshows' },
  { value: '3', label: 'senior-management presentations' },
  { value: '2', label: 'hands-on flowCentral workshops, each oversubscribed (90 seats)' },
  { value: '$7,000+', label: 'saved on an accessibility audit at Cialfo' },
  { value: '3', label: 'UX case studies: 2 shipped, 1 concept' },
]

/** Certifications and recognition, newest first. */
export const certifications: readonly Certification[] = [
  { name: 'Certified Scrum Product Owner', year: '2025' },
  { name: 'CPFB Excellence Award', year: '2024' },
  { name: 'Certified ScrumMaster', issuer: 'NUS-ISS', year: '2024' },
  { name: 'Design Facilitation 1 & 2', issuer: 'Studio DOJO', year: '2024' },
  { name: 'Digital Service Management Programme', issuer: 'NUS-ISS', year: '2023' },
  { name: 'Google UX Design Professional Certificate', issuer: 'Coursera', year: '2022' },
  { name: 'NUS ICT Solutioning Knowledge Area: Certificate of Distinction', year: '2021' },
  {
    name: 'Huawei Future Interaction Design Award: 1st (Group), 3rd (Individual)',
    year: '2021',
  },
]
