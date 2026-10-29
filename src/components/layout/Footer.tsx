import { site } from '../../content/site'
import type { ContactLink } from '../../content/site'
import { Heading } from '../ui/Heading'
import { Link } from '../ui/Link'
import { TEXT_RECIPES } from '../ui/styles'
import { Text } from '../ui/Text'

export interface FooterProps {
  contact?: readonly ContactLink[]
}

type ProvidedLink = ContactLink & { href: string }

function isProvided(link: ContactLink): link is ProvidedLink {
  return link.href !== null
}

/** Site footer in the ink scene: how the site is built, and contact links once provided. */
export function Footer({ contact = site.contact }: FooterProps) {
  const links = contact.filter(isProvided)
  return (
    <footer className="scene-ink">
      <div className="mx-auto grid max-w-5xl gap-8 px-6 py-12 md:grid-cols-2">
        <div className="grid content-start gap-2">
          <p className={TEXT_RECIPES.h3}>{site.name}</p>
          <Text variant="small">
            Built with React, TypeScript, Vite and a token-driven design system.{' '}
            <Link href={`${import.meta.env.BASE_URL}storybook/`}>Browse the Storybook</Link>
          </Text>
        </div>
        <section aria-labelledby="footer-contact" className="grid content-start gap-2">
          <Heading level={2} size="eyebrow" id="footer-contact">
            Contact
          </Heading>
          {links.length > 0 ? (
            <ul className="flex flex-wrap gap-x-6 gap-y-2">
              {links.map(({ label, href }) => (
                <li key={label}>
                  <Link href={href}>{label}</Link>
                </li>
              ))}
            </ul>
          ) : (
            <Text variant="small">Contact links coming soon.</Text>
          )}
        </section>
      </div>
    </footer>
  )
}
