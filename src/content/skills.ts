/** One skill. Skills are listed without proficiency levels (the owner's choice). */
export interface Skill {
  name: string
  /** Optional qualifier shown after the name, e.g. what a tool is used for. */
  detail?: string
}

export interface SkillGroup {
  /** Stable id, used for the group heading's `id`. */
  id: string
  title: string
  skills: readonly Skill[]
}

export const skillGroups: readonly SkillGroup[] = [
  {
    id: 'product',
    title: 'Product and delivery',
    skills: [
      { name: 'Discovery' },
      { name: 'Use-case intake and prioritisation' },
      { name: 'Product strategy' },
      { name: 'Lifecycle management' },
      { name: 'POC/POV' },
      { name: 'Governance' },
      { name: 'Transition planning' },
      { name: 'Cross-functional delivery' },
    ],
  },
  {
    id: 'ux',
    title: 'UX/UI and design systems',
    skills: [
      { name: 'Figma', detail: 'advanced prototyping: conditional logic, variables' },
      { name: 'Storybook' },
      { name: 'Adobe XD' },
      { name: 'Sketch' },
      { name: 'High-fidelity prototyping' },
      { name: 'Interaction design' },
      { name: 'User flows' },
      { name: 'User research and usability testing' },
      { name: 'Visual hierarchy' },
      { name: 'Component states' },
      { name: 'Responsive UI' },
      { name: 'WCAG 2.1' },
      { name: 'Design QA' },
    ],
  },
  {
    id: 'engineering',
    title: 'Frontend and engineering',
    skills: [
      { name: 'HTML/CSS' },
      { name: 'JavaScript' },
      { name: 'TypeScript' },
      { name: 'React / React Native' },
      { name: 'Angular / Ionic' },
      { name: 'Node.js' },
      { name: 'Python' },
      { name: 'Java' },
      { name: 'Java EE' },
      { name: 'PostgreSQL' },
      { name: 'MongoDB' },
    ],
  },
  {
    id: 'stakeholders',
    title: 'Stakeholder leadership',
    skills: [
      { name: 'Senior-management communication' },
      { name: 'Workshop facilitation' },
      { name: 'Sponsor management' },
      { name: 'Cross-department alignment' },
      { name: 'Change communications' },
    ],
  },
  {
    id: 'tools',
    title: 'Tools and methods',
    skills: [
      { name: 'Azure DevOps' },
      { name: 'AI-assisted prototyping / vibe coding' },
      { name: 'Accessibility reviews' },
      { name: 'Documentation' },
      { name: 'Design grooming and reviews' },
    ],
  },
]

/** Headline skills, by name; each must appear in `skillGroups` (checked in content.test.ts). */
export const topSkills: readonly string[] = [
  'Product strategy',
  'Figma',
  'Storybook',
  'WCAG 2.1',
  'React / React Native',
]
