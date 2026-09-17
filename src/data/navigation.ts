import type { NavLink } from '../types'

/**
 * Header navigation. Array order IS the nav-pill index — there is no separate
 * `data-index` attribute to fall out of sync with.
 */
export const navLinks: NavLink[] = [
  { id: 'about', label: 'About' },
  { id: 'skills', label: 'Skills' },
  { id: 'work', label: 'Work' },
  { id: 'services', label: 'Services' },
  { id: 'contact', label: 'Contact' },
]

/**
 * Footer navigation. Shares the same `id` values as `navLinks`, which is what
 * stops a footer link pointing at a section that doesn't exist.
 */
export const footerLinks: NavLink[] = [
  { id: 'about', label: 'About' },
  { id: 'skills', label: 'Skills' },
  { id: 'work', label: 'Selected Work' },
  { id: 'services', label: 'Services' },
  { id: 'process', label: 'Process' },
  { id: 'beliefs', label: 'Beliefs' },
  { id: 'packages', label: 'Packages' },
  { id: 'contact', label: 'Contact' },
]

/** Every section id in document order — the scroll spy reads this, not a hardcoded map. */
export const sectionIds = [
  'hero',
  'about',
  'skills',
  'work',
  'services',
  'process',
  'beliefs',
  'packages',
  'contact',
] as const
