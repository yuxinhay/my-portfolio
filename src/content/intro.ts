export interface Intro {
  location: string
  /** The resume headline, one role per item; shown separated by a vertical bar. */
  headline: readonly string[]
  tagline: string
  profile: readonly string[]
}

export const intro: Intro = {
  location: 'Singapore',
  headline: ['UX Designer', 'Product Manager'],
  tagline: 'UX designer driven by curiosity, powered by code, and committed to accessible design.',
  profile: [
    'Product manager and UX practitioner with 3+ years at CPF Board (Central Provident Fund Board, Singapore), across design systems, accessible digital experiences, AI-enabled workflow products and internal innovation programmes.',
    'Moved from hands-on UX and design-system work into product management, keeping a strong interface and frontend lens.',
  ],
}
