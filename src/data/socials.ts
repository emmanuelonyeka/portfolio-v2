import { site } from '../config/site'
import { whatsappLink, WHATSAPP_GENERAL } from '../lib/whatsapp'
import type { IconName } from '../types'

export interface SocialLink {
  label: string
  href: string
  icon: IconName
}

/** Shared order for the desktop rail and mobile navigation. */
export const socialLinks: SocialLink[] = [
  { label: 'LinkedIn', href: site.socials.linkedin, icon: 'linkedin' },
  { label: 'GitHub', href: site.socials.github, icon: 'github' },
  { label: 'WhatsApp', href: whatsappLink(WHATSAPP_GENERAL), icon: 'whatsapp' },
  { label: 'X / Twitter', href: site.socials.x, icon: 'x' },
]
