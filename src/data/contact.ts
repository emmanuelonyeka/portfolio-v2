import { site } from '../config/site'
import { whatsappLink, WHATSAPP_GENERAL } from '../lib/whatsapp'
import type { ContactLink, FooterLink } from '../types'

/** Every href here is derived from `config/site` — no URL is retyped. */
export const contactLinks: ContactLink[] = [
  {
    label: 'Email',
    value: site.email,
    href: `mailto:${site.email}`,
    icon: 'mail',
  },
  {
    label: 'GitHub',
    value: 'emmanuelonyeka',
    href: site.socials.github,
    icon: 'github',
  },
  {
    label: 'LinkedIn',
    value: 'emmanuelymb',
    href: site.socials.linkedin,
    icon: 'linkedin',
  },
  {
    label: 'X / Twitter',
    value: '@emmmybills',
    href: site.socials.x,
    icon: 'x',
  },
]

/** The footer's Connect column — plain text links, no icons. */
export const footerConnectLinks: FooterLink[] = [
  { label: 'GitHub', href: site.socials.github, external: true },
  { label: 'LinkedIn', href: site.socials.linkedin, external: true },
  { label: 'X / Twitter', href: site.socials.x, external: true },
  { label: 'WhatsApp', href: whatsappLink(WHATSAPP_GENERAL), external: true },
  { label: 'Email', href: `mailto:${site.email}` },
]

/** Headline and intro copy for the contact section. */
export const contactCopy = {
  eyebrow: '08. Contact',
  headline: "Let's build something",
  headlineAccent: 'worth shipping.',
  sub: "Hiring, or need a site built? Tell me about the role or project and I'll get back to you promptly. WhatsApp is fastest.",
  whatsappCta: 'Message me on WhatsApp',
}
