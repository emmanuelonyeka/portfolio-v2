import { scrollPageTo } from './smoothScroll'

/**
 * Scrolls an in-page section under the fixed header.
 *
 * Every in-page anchor must call this AND prevent its own default, because the
 * browser's native jump lands the element at viewport top — behind the header —
 * and writes a hash that then outranks scroll restoration on the next reload.
 * The `href` stays on the element for semantics: right-click-copy, middle-click
 * and keyboard activation all still behave.
 */
export function scrollToSection(id: string, immediate = false) {
  const target = document.getElementById(id)
  if (!target) return
  const currentNav = document.getElementById('navbar')?.offsetHeight ?? 78
  const compactNav = Number.parseFloat(
    getComputedStyle(document.documentElement).getPropertyValue('--navbar-resting-height'),
  )
  const destinationNav = Number.isFinite(compactNav) ? compactNav : currentNav
  const top = target.getBoundingClientRect().top + window.scrollY - destinationNav
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  scrollPageTo(top, immediate || reduced)
}

export function scrollToTop() {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  scrollPageTo(0, reduced)
}
