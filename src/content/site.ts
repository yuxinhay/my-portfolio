/** An internal page in the primary navigation. `to` is relative to the router basename. */
export interface NavItem {
  label: string
  to: string
}

/** A contact link in the footer. `href: null` means the owner has not provided it yet. */
export interface ContactLink {
  label: string
  href: string | null
}

export interface Site {
  /** Owner's name: the header home link and the suffix of every page title. */
  name: string
  nav: readonly NavItem[]
  contact: readonly ContactLink[]
}

export const site: Site = {
  name: 'Yuxin HAY',
  nav: [
    { label: 'Work', to: '/' },
    { label: 'Design system', to: '/design-system' },
    { label: 'How I built this', to: '/how-i-built-this' },
  ],
  // Links without an href are not rendered (an `href="#"` link would lead nowhere), so the footer
  // reads "Contact links coming soon" until at least one is filled in.
  contact: [
    { label: 'Email', href: 'mailto:hay_yuxin@hotmail.com' },
    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/yuxin-hay' },
    { label: 'Telegram', href: 'https://t.me/Yuuxin' },
    { label: 'GitHub', href: 'https://github.com/yuxinhay' },
  ],
}

/** The document title for a page: "<Page> · <site name>". */
export function pageTitle(page: string): string {
  return `${page} · ${site.name}`
}
