import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { site, asset } from '../../config/site'
import { useReducedMotion } from '../../hooks/useReducedMotion'
import type { NavLink } from '../../types'
import { scrollToSection } from '../../lib/scrollToSection'
import { Icon } from '../icons'
import { socialLinks } from '../../data/socials'

interface MobileDrawerProps {
  open: boolean
  links: NavLink[]
  active: number | null
  onNavigate: (index: number, id: string) => void
  onClose: () => void
}

/** Row stagger and row duration. The panel itself is 380ms — kept as a literal
 * class because Tailwind cannot see an interpolated class name. */
const STEP_MS = 55
const ROW_MS = 400
/** The panel starts growing before the rows begin, so the box leads the content. */
const OPEN_LEAD_MS = 250
/**
 * How far above its resting place each row starts. The panel clips overflow, so
 * a larger offset means the row slides in from under the header rather than
 * fading in place. Written out in full because Tailwind cannot see an
 * interpolated class name — change the whole string, not a number.
 */
const ROW_FROM = '-translate-y-5'

export function MobileDrawer({ open, links, active, onNavigate, onClose }: MobileDrawerProps) {
  const drawerRef = useRef<HTMLElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const [panelOpen, setPanelOpen] = useState(false)
  const [rowsIn, setRowsIn] = useState(false)
  const [height, setHeight] = useState(0)
  const reducedMotion = useReducedMotion()

  // Sequence: open = panel grows, THEN rows arrive.
  //           close = rows leave, THEN the panel collapses.
  useEffect(() => {
    if (reducedMotion) {
      setPanelOpen(open)
      setRowsIn(open)
      return
    }
    if (open) {
      setPanelOpen(true)
      const id = setTimeout(() => setRowsIn(true), OPEN_LEAD_MS)
      return () => clearTimeout(id)
    }
    setRowsIn(false)
    const exit = links.length * STEP_MS + ROW_MS * 0.5
    const id = setTimeout(() => setPanelOpen(false), exit)
    return () => clearTimeout(id)
  }, [open, links.length, reducedMotion])

  useLayoutEffect(() => {
    const drawer = drawerRef.current
    if (!drawer) return
    if (open) drawer.removeAttribute('inert')
    else drawer.setAttribute('inert', '')
    return () => drawer.removeAttribute('inert')
  }, [open])

  // Animate to the real content height rather than a guessed max-height, so the
  // easing curve is the one that actually plays.
  useEffect(() => {
    const el = panelRef.current
    if (!el) return
    setHeight(panelOpen ? el.scrollHeight : 0)
  }, [panelOpen, rowsIn, links.length])

  useEffect(() => {
    if (!open) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return
      onClose()
      requestAnimationFrame(() => document.getElementById('menuToggle')?.focus())
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [open, onClose])

  const row = (index: number) => ({
    // Same order out as in, just tighter — matching the panel's exit budget.
    transitionDelay: `${index * STEP_MS}ms`,
    transitionDuration: `${ROW_MS}ms`,
  })

  return (
    <nav
      ref={drawerRef}
      id="mobileMenu"
      aria-label="Mobile navigation"
      // `visibility` is what actually removes the closed rows from the tab order;
      // max-height alone left six invisible links focusable.
      className={`absolute left-0 top-full z-[999] w-full overflow-hidden rounded-b-2xl border-t border-edge bg-elevated backdrop-blur-[24px] transition-[height,box-shadow,visibility] duration-[380ms] ease-smooth lg:hidden ${
        panelOpen
          ? 'visible shadow-[0_18px_28px_-18px_rgba(0,0,0,0.75)]'
          : 'invisible pointer-events-none'
      }`}
      style={{ height }}
      aria-hidden={!open}
    >
      <div ref={panelRef} className="px-5 pb-5 pt-2">
        <ul className="m-0 flex list-none flex-col p-0">
          {links.map((link, i) => (
            <li key={link.id} className="relative">
              <a
                href={`#${link.id}`}
                onClick={(event) => {
                  event.preventDefault()
                  onNavigate(i, link.id)
                  onClose()
                  requestAnimationFrame(() => document.getElementById('menuToggle')?.focus())
                }}
                aria-current={active === i ? 'location' : undefined}
                style={row(i)}
                className={`press-text group flex items-center gap-4 py-4 no-underline transition-[opacity,transform] ease-smooth ${
                  rowsIn ? 'translate-y-0 opacity-100' : `${ROW_FROM} opacity-0`
                }`}
              >
                <span
                  className={`font-mono text-[0.75rem] font-semibold tracking-[0.12em] ${
                    active === i ? 'text-accent' : 'text-muted'
                  }`}
                >
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span
                  className={`flex-1 text-[0.9rem] font-medium tracking-[-0.01em] ${
                    active === i ? 'text-accent' : 'text-primary'
                  }`}
                >
                  {link.label}
                </span>
                <Icon
                  name="arrowRight"
                  size={16}
                  className="-translate-x-1 text-muted opacity-0 transition-[opacity,transform] duration-300 group-hover:translate-x-0 group-hover:opacity-100"
                />
              </a>

              {/* The rule draws itself in from the left, on the row's own beat. */}
              <span
                aria-hidden="true"
                style={row(i)}
                className={`absolute bottom-0 left-0 block h-px w-full origin-left bg-edge transition-transform ease-smooth ${
                  rowsIn ? 'scale-x-100' : 'scale-x-0'
                }`}
              />
            </li>
          ))}
        </ul>

        <div
          style={row(links.length)}
          className={`mt-6 flex flex-col items-start gap-3 transition-[opacity,transform] ease-smooth min-[521px]:flex-row min-[521px]:items-center min-[521px]:justify-between ${
            rowsIn ? 'translate-y-0 opacity-100' : `${ROW_FROM} opacity-0`
          }`}
        >
          <span className="inline-flex items-center gap-2 text-[0.75rem] font-medium text-status">
            <span
              aria-hidden="true"
              className="h-1.5 w-1.5 animate-status-pulse rounded-full bg-[#2ecc71] motion-reduce:animate-none"
            />
            {site.availability.label}
          </span>

          <div className="grid grid-cols-4 gap-1.5">
            {socialLinks.map(({ label, href, icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="press-text inline-flex h-11 w-11 items-center justify-center rounded-full text-muted transition-colors duration-200 hoverable:hover:text-accent"
              >
                <Icon name={icon} size={17} />
              </a>
            ))}
          </div>
        </div>

        <a
          href={asset(site.resume)}
          target="_blank"
          rel="noopener noreferrer"
          style={row(links.length + 1)}
          className={`press mt-5 flex min-h-11 items-center justify-center gap-2 rounded-full border border-edge-strong px-6 py-2.5 text-[0.85rem] font-semibold text-primary no-underline transition-[opacity,transform,border-color,color] ease-smooth hoverable:hover:border-accent/25 hoverable:hover:text-accent ${
            rowsIn ? 'translate-y-0 opacity-100' : `${ROW_FROM} opacity-0`
          }`}
        >
          Resume
          <Icon name="download" size={15} />
        </a>

        <a
          href="#contact"
          onClick={(event) => {
            event.preventDefault()
            onClose()
            scrollToSection('contact')
            requestAnimationFrame(() => document.getElementById('menuToggle')?.focus())
          }}
          style={row(links.length + 2)}
          className={`press lit mt-5 flex min-h-11 items-center justify-center gap-2 rounded-full bg-accent px-6 py-2.5 text-[0.85rem] font-semibold text-accent-contrast no-underline transition-[opacity,transform] ease-smooth ${
            rowsIn ? 'translate-y-0 opacity-100' : `${ROW_FROM} opacity-0`
          }`}
        >
          Contact Me
          <Icon name="arrowRight" size={15} />
        </a>
      </div>
    </nav>
  )
}
