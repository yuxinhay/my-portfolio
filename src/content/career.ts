import type { Period } from './period'

export interface CareerEntry {
  /** Stable id, used as the React key and for the role heading's `id`. */
  id: string
  kind: 'work' | 'education'
  /** Job title, or the qualification for education. */
  role: string
  /** Employer, or the school for education. */
  organisation: string
  period: Period
  /** Optional one-line highlights. */
  highlights?: readonly string[]
}

/** Career path, newest first (checked in content.test.ts). */
export const career: readonly CareerEntry[] = [
  {
    id: 'cpf-pm',
    kind: 'work',
    role: 'Product Manager',
    organisation: 'CPF Board',
    period: { start: '2025-01', end: null },
    highlights: [
      'Main Product Manager of flowCentral, an internal agentic AI workflow platform: 24 use cases across 14 departments, 10+ completed and handed over.',
      'Programme Manager for Made-in-CPF Season 5, an intrapreneurship programme, redesigned from 7 months to 10 weeks based on Season 4 feedback.',
    ],
  },
  {
    id: 'cpf-ux',
    kind: 'work',
    role: 'UX Designer',
    organisation: 'CPF Board',
    period: { start: '2023-01', end: '2024-12' },
    highlights: [
      "Managed and evolved CPF Board's Design Language System in Figma and Storybook: reusable components and usage guidance.",
      'Led UX for anti-scam measures protecting elderly members, which received local media recognition.',
      'Applied WCAG 2.1 and inclusive design, and ran Figma training for Product Owners and developers.',
    ],
  },
  {
    id: 'cialfo',
    kind: 'work',
    role: 'Product Intern',
    organisation: 'Cialfo',
    period: { start: '2021-12', end: '2022-06' },
    highlights: [
      'Drove web-accessibility work, including negotiating with an accessibility audit vendor, saving more than $7,000.',
      'Wrote company-wide accessibility documentation: VPAT, accessibility statement and a WCAG 2.1 AA target.',
    ],
  },
  {
    id: 'nus',
    kind: 'education',
    role: 'Bachelor of Computing in Information Systems (with Distinction)',
    organisation: 'National University of Singapore',
    period: { start: '2019', end: '2023' },
  },
  {
    id: 'jpmorgan',
    kind: 'work',
    role: 'Credit Risk Apprentice',
    organisation: 'JPMorgan Chase',
    period: { start: '2018', end: '2019' },
  },
  {
    id: 'hsbc',
    kind: 'work',
    role: 'Wealth Management Intern',
    organisation: 'HSBC Singapore',
    period: { start: '2017', end: '2018' },
  },
  {
    id: 'frank',
    kind: 'work',
    role: 'Solution Developer',
    organisation: 'FRANK by OCBC',
    period: { start: '2017', end: '2017' },
  },
  {
    id: 'sp',
    kind: 'education',
    role: 'Diploma in Banking and Finance',
    organisation: 'Singapore Polytechnic',
    period: { start: '2015', end: '2018' },
  },
]
