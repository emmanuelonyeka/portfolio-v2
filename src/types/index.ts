/** Every icon available from `components/icons`. Data files reference these by name. */
export type IconName =
  // navigation & controls
  | 'arrowRight'
  | 'chevronLeft'
  | 'chevronRight'
  | 'close'
  | 'check'
  | 'search'
  | 'download'
  | 'externalLink'
  | 'link'
  | 'alertCircle'
  // theme toggle
  | 'sun'
  | 'moon'
  // services
  | 'code'
  | 'layout'
  | 'layers'
  | 'clock'
  | 'component'
  | 'package'
  // skills
  | 'html5'
  | 'css3'
  | 'javascript'
  | 'react'
  | 'tailwind'
  | 'typescript'
  | 'framerMotion'
  | 'gsap'
  | 'git'
  | 'vite'
  | 'nextjs'
  | 'nodejs'
  | 'tanstack'
  | 'supabase'
  | 'accessibility'
  | 'performance'
  | 'designSystem'
  | 'codeReview'
  | 'responsive'
  | 'debug'
  // contact & brand marks
  | 'mail'
  | 'github'
  | 'linkedin'
  | 'x'
  | 'whatsapp'

/** An in-page anchor. `id` is the target section id, without the leading '#'. */
export interface NavLink {
  id: string
  label: string
}

export interface Project {
  /** Stable URL key used by shareable case-study links. */
  slug: string
  num: string
  cat: string
  name: string
  /** Short name that remains inside the folder tab on narrow screens. */
  tabLabel: string
  desc: string
  overview: string
  highlights: string[]
  /** What fought back, and what it cost. The section reviewers actually read. */
  hardPart: string
  /** When it was built, e.g. 'March 2026'. Recency matters to employers. */
  period: string
  tech: string[]
  /** Live deployment. */
  href: string
  /** Public repository. */
  code: string
  /** Real checkout URL. Omit until the template's store listing is live. */
  purchaseUrl?: string
  /** Looping preview video shown beside the card. */
  video: string
  desktopImages: string[]
  mobileImages: string[]
  /** Brand colour used on dark backgrounds. */
  tabColor: string
  /** Same brand hue, darkened only enough to remain legible in the light theme. */
  tabColorLight: string
  tabBg: string
  inProgress?: boolean
}

export interface SkillItem {
  name: string
  note: string
  icon: IconName
}

export interface SkillGroup {
  tag: string
  title: string
  items: SkillItem[]
}

export interface Service {
  icon: IconName
  name: string
  desc: string
}

export interface ProcessStep {
  num: string
  title: string
  desc: string
}

export interface Belief {
  num: string
  title: string
  desc: string
}

export interface Package {
  tier: string
  /** Starting price, shown large on the card. */
  price: string
  tag: string
  scopeBadge: string
  features: string[]
  cta: string
  /** Plain text. Encoded once by `whatsappLink()` — never pre-encode here. */
  whatsappMessage: string
  highlight: boolean
}

/** A plain-text link in the footer's Connect column. */
export interface FooterLink {
  label: string
  href: string
  /** Opens in a new tab with rel="noopener noreferrer". */
  external?: boolean
}

export interface ContactLink {
  label: string
  value: string
  href: string
  icon: IconName
}
