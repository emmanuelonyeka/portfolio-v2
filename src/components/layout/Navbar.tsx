import { useEffect, useState } from 'react'
import { site, asset } from '../../config/site'
import { navLinks } from '../../data/navigation'
import { useActiveSection } from '../../hooks/useActiveSection'
import { useScrolledPast } from '../../hooks/useScrolledPast'
import { useTheme } from '../../hooks/useTheme'
import { scrollToSection, scrollToTop } from '../../lib/scrollToSection'
import { Icon } from '../icons'
import { LogoMark } from '../global/LogoMark'
import { NavPill } from './NavPill'
import { MobileDrawer } from './MobileDrawer'

const SECTION_IDS = navLinks.map((link) => link.id)

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [active, activate] = useActiveSection(SECTION_IDS)
  const scrolled = useScrolledPast(40)
  const { theme, toggle } = useTheme()

  // Publish the real header height so modals and the scroll spy can offset by it
  // instead of the three hardcoded pixel values that used to drift from it.
  useEffect(() => {
    const el = document.getElementById('navbar')
    const restingSizer = document.getElementById('navbar-resting-sizer')
    if (!el || !restingSizer) return
    const publish = () => {
      document.documentElement.style.setProperty('--navbar-height', `${el.offsetHeight}px`)
      document.documentElement.style.setProperty(
        '--navbar-resting-height',
        `${restingSizer.offsetHeight}px`,
      )
    }
    publish()
    const observer = new ResizeObserver(publish)
    observer.observe(el)
    observer.observe(restingSizer)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    document.body.classList.toggle('nav-open', menuOpen)
    return () => document.body.classList.remove('nav-open')
  }, [menuOpen])

  function navigate(index: number, id: string) {
    activate(index)
    scrollToSection(id)
  }

  return (
    <header
      id="navbar"
      className={`fixed inset-x-0 top-0 z-[10000] transition-[background-color,border-color,backdrop-filter] duration-[600ms] ease-smooth motion-reduce:transition-none ${
        scrolled ? 'border-b border-edge bg-nav backdrop-blur-[20px]' : 'border-b border-transparent'
      }`}
    >
      {/* A real DOM measurement of the compact header. In-page navigation can
          target the final resting height even when a click starts at the taller
          top-of-page state, so the previous section never peeks above Work. */}
      <span
        id="navbar-resting-sizer"
        aria-hidden="true"
        className="pointer-events-none invisible absolute left-0 top-0 flex w-px py-[clamp(0.5rem,0.4676rem+0.1477vw,0.625rem)] max-[768px]:py-1.5"
      >
        <span className="h-10 w-px min-[769px]:h-11" />
      </span>

      <div
        className={`mx-auto flex max-w-[1600px] items-center justify-between gap-4 transition-[padding] duration-[600ms] ease-smooth motion-reduce:transition-none ${
          scrolled
            ? 'px-[clamp(1.125rem,1.0278rem+0.4444vw,1.5rem)] py-[clamp(0.5rem,0.4676rem+0.1477vw,0.625rem)] max-[768px]:py-1.5'
            : 'px-[clamp(1.5rem,0.8519rem+2.963vw,4rem)] py-4'
        }`}
      >
        <a
          href="#hero"
          onClick={(event) => {
            event.preventDefault()
            scrollToTop()
          }}
          aria-label={`${site.name} — back to top`}
          className={`flex items-center whitespace-nowrap no-underline transition-[height,min-height] duration-[600ms] ease-smooth motion-reduce:transition-none ${
            scrolled
              ? 'compact-header-hit h-10 min-h-10 min-[769px]:h-11 min-[769px]:min-h-11'
              : 'h-11 min-h-11'
          }`}
        >
          <LogoMark mobileCompact={scrolled} />
        </a>

        <NavPill links={navLinks} active={active} onNavigate={navigate} />

        <div className="flex items-center gap-4">
          <button
            type="button"
            id="themeToggle"
            onClick={toggle}
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
            className={`press inline-flex items-center justify-center rounded-full border border-edge bg-edge-faint text-muted transition-[height,width,transform,border-color,color] duration-[600ms] ease-smooth motion-reduce:transition-none hoverable:hover:border-accent/25 hoverable:hover:text-primary ${
              scrolled
                ? 'compact-header-hit h-10 w-10 min-[769px]:h-11 min-[769px]:w-11'
                : 'h-11 w-11'
            }`}
          >
            <Icon name={theme === 'dark' ? 'sun' : 'moon'} size={16} />
          </button>

          <a
            href={asset(site.resume)}
            target="_blank"
            rel="noopener noreferrer"
            className="press hidden min-h-11 items-center gap-2 rounded-full border border-edge-strong px-4 py-2 text-[0.8rem] font-medium text-muted no-underline transition-[transform,border-color,color] duration-300 hoverable:hover:border-accent/25 hoverable:hover:text-accent min-[641px]:inline-flex"
          >
            Resume
            <Icon name="download" size={14} />
          </a>

          <a
            href="#contact"
            onClick={(event) => {
              event.preventDefault()
              navigate(navLinks.length - 1, 'contact')
            }}
            className="press lit hidden min-h-11 items-center rounded-full bg-accent px-5 py-2.5 text-[0.8rem] font-semibold text-accent-contrast no-underline transition-[background-color,transform] duration-300 hoverable:hover:-translate-y-0.5 hoverable:hover:bg-accent/90 lg:inline-flex"
          >
            Contact Me
          </a>

          <button
            type="button"
            id="menuToggle"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            aria-controls="mobileMenu"
            className={`press inline-flex items-center gap-2.5 rounded-full border border-pill-edge bg-pill pl-4 pr-3.5 backdrop-blur-[20px] transition-[height,padding,border-color,transform] duration-[600ms] ease-smooth motion-reduce:transition-none hoverable:hover:border-accent/25 lg:hidden ${
              scrolled
                ? 'compact-header-hit h-10 py-1.5 min-[769px]:h-11 min-[769px]:py-2'
                : 'h-11 py-2'
            }`}
          >
            <span className="text-[0.8rem] font-medium tracking-[0.02em] text-muted">Menu</span>
            <span aria-hidden="true" className="relative grid h-3.5 w-4 place-items-center">
              <span
                className={`col-start-1 row-start-1 block h-[1.5px] w-4 rounded-sm bg-muted transition-transform duration-[350ms] ease-smooth motion-reduce:transition-none ${
                  menuOpen ? 'rotate-45' : '-translate-y-[3px]'
                }`}
              />
              <span
                className={`col-start-1 row-start-1 block h-[1.5px] w-4 rounded-sm bg-muted transition-transform duration-[350ms] ease-smooth motion-reduce:transition-none ${
                  menuOpen ? '-rotate-45' : 'translate-y-[3px]'
                }`}
              />
            </span>
          </button>
        </div>
      </div>

      <MobileDrawer
        open={menuOpen}
        links={navLinks}
        active={active}
        onNavigate={navigate}
        onClose={() => setMenuOpen(false)}
      />
    </header>
  )
}
