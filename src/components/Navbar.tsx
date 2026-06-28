import { useEffect } from 'react'

function smoothScrollTo(targetY: number, duration = 1000) {
  const startY = window.scrollY
  const difference = targetY - startY
  let startTime: number | null = null

  function easeOutQuad(t: number, b: number, c: number, d: number) {
    t /= d
    return -c * t * (t - 2) + b
  }

  function step(timestamp: number) {
    if (!startTime) startTime = timestamp
    const timeElapsed = timestamp - startTime
    const progress = Math.min(timeElapsed, duration)
    
    const run = easeOutQuad(progress, startY, difference, duration)
    window.scrollTo(0, run)

    if (timeElapsed < duration) {
      requestAnimationFrame(step)
    }
  }

  requestAnimationFrame(step)
}

export default function Navbar() {

  useEffect(() => {
    try {
      const saved = localStorage.getItem('theme')
      if (saved === 'light') document.documentElement.classList.add('theme-light')
    } catch (e) { /* ignore */ }

    const navbar = document.getElementById('navbar')
    
    // Monitors and outputs actual header heights on all screens
    const updateNavbarHeight = () => {
      if (navbar) {
        document.documentElement.style.setProperty('--navbar-height', `${navbar.offsetHeight}px`)
      }
    }
    updateNavbarHeight()

    const onScroll = () => {
      navbar?.classList.toggle('scrolled', window.scrollY > 60)
      updateNavbarHeight()
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', updateNavbarHeight, { passive: true })

    const themeToggle = document.getElementById('themeToggle')
    const updateToggleLabel = () => {
      if (!themeToggle) return
      const isLight = document.documentElement.classList.contains('theme-light')
      themeToggle.setAttribute('aria-label', isLight ? 'Switch to dark theme' : 'Switch to light theme')
    }
    updateToggleLabel()
    const onThemeToggle = () => {
      document.documentElement.classList.toggle('theme-light')
      try {
        const isLight = document.documentElement.classList.contains('theme-light')
        localStorage.setItem('theme', isLight ? 'light' : 'dark')
      } catch (e) { /* ignore */ }
      updateToggleLabel()
    }
    themeToggle?.addEventListener('click', onThemeToggle)

    const mq = window.matchMedia('(prefers-color-scheme: light)')
    const systemHandler = (e: MediaQueryListEvent) => {
      let saved = null
      try { saved = localStorage.getItem('theme') } catch (err) { /* ignore */ }
      if (saved) return
      document.documentElement.classList.toggle('theme-light', e.matches)
      updateToggleLabel()
    }
    mq.addEventListener('change', systemHandler)

    const toggle = document.getElementById('menuToggle')
    const menu = document.getElementById('mobileMenu')
    let menuOpen = false

    const openMenu = () => {
      menuOpen = true
      toggle?.classList.add('open')
      menu?.classList.add('open')
    }

    const closeMenu = () => {
      menuOpen = false
      toggle?.classList.remove('open')
      menu?.classList.remove('open')
    }

    const onToggleClick = (e: Event) => {
      e.preventDefault()
      e.stopPropagation()
      if (menuOpen) {
        closeMenu()
      } else {
        openMenu()
      }
    }

    toggle?.addEventListener('click', onToggleClick)
    toggle?.addEventListener('touchend', (e) => {
      e.preventDefault()
      if (menuOpen) { closeMenu() } else { openMenu() }
    })

    document.querySelectorAll('.mobile-link').forEach(link => {
      link.addEventListener('click', closeMenu)
    })

    const onDocClick = (e: Event) => {
      if (!menuOpen) return
      const target = e.target as Node
      if (!menu?.contains(target) && !toggle?.contains(target)) {
        closeMenu()
      }
    }
    setTimeout(() => document.addEventListener('click', onDocClick), 0)

    let isScrollingToAnchor = false
    let scrollTimeout: ReturnType<typeof setTimeout>

    const anchorLinks = document.querySelectorAll<HTMLAnchorElement>('a[href^="#"]')
    const onAnchorClick = (e: Event) => {
      const link = e.currentTarget as HTMLAnchorElement
      const href = link.getAttribute('href')
      if (!href || href === '#') return
      const target = document.querySelector(href)
      if (!target) return
      e.preventDefault()
      closeMenu()

      isScrollingToAnchor = true
      clearTimeout(scrollTimeout)

      const index = parseInt(link.getAttribute('data-index') || '0', 10)
      movePillTo(index)

      const navHeight = navbar?.offsetHeight ?? 80
      const top = target.getBoundingClientRect().top + window.scrollY - navHeight + 20
      
      smoothScrollTo(top, 1000)

      scrollTimeout = setTimeout(() => {
        isScrollingToAnchor = false
      }, 1100)
    }
    anchorLinks.forEach(link => link.addEventListener('click', onAnchorClick))

    const wrapper = document.getElementById('navPillWrapper')
    const indicator = document.getElementById('navPillIndicator')
    const baseLinks = document.querySelectorAll<HTMLElement>('.nav-links--base .nav-link')
    const activeLayer = document.getElementById('navLinksActive')
    if (!wrapper || !indicator || !activeLayer) return

    let activeIndex = 0
    let slideTimer: ReturnType<typeof setTimeout>

    function movePillTo(index: number, animate = true) {
      const link = baseLinks[index]
      if (!link) return
      const wRect = wrapper!.getBoundingClientRect()
      const lRect = link.getBoundingClientRect()
      const pillLeft = lRect.left - wRect.left - 5
      indicator!.style.transition = animate
        ? 'transform 0.42s cubic-bezier(.34,1.56,.64,1), width 0.42s cubic-bezier(.34,1.56,.64,1), background 0.2s ease'
        : 'none'
      indicator!.style.transform = `translateX(${pillLeft}px)`
      indicator!.style.width = `${lRect.width}px`
      activeLayer!.style.clipPath = `inset(0px calc(100% - ${pillLeft + lRect.width}px) 0px ${pillLeft}px round 999px)`
      activeIndex = index
    }

    function onPillStart() {
      indicator!.classList.add('sliding')
      clearTimeout(slideTimer)
      slideTimer = setTimeout(() => indicator!.classList.remove('sliding'), 500)
    }

    baseLinks.forEach((link, i) => {
      link.addEventListener('click', () => { onPillStart(); movePillTo(i) })
    })

    const sectionMap: Record<string, number> = {
      hero: 0, about: 0, work: 1, skills: 2, services: 3, beliefs: 3, pricing: 3, contact: 4
    }
    const sectionIds = ['hero', 'about', 'work', 'skills', 'services', 'beliefs', 'pricing', 'contact']
    
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          if (isScrollingToAnchor) return
          const idx = sectionMap[e.target.id]
          if (idx !== undefined && idx !== activeIndex) {
            onPillStart()
            movePillTo(idx)
          }
        }
      })
    }, { threshold: 0.15, rootMargin: '-88px 0px -40% 0px' })

    sectionIds.forEach(id => {
      const el = document.getElementById(id)
      if (el) obs.observe(el)
    })

    requestAnimationFrame(() => setTimeout(() => {
      updateNavbarHeight()
      movePillTo(0, false)
    }, 150))
    
    window.addEventListener('resize', () => {
      updateNavbarHeight()
      movePillTo(activeIndex, false)
    })

    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', updateNavbarHeight)
      themeToggle?.removeEventListener('click', onThemeToggle)
      mq.removeEventListener('change', systemHandler)
      toggle?.removeEventListener('click', onToggleClick)
      document.removeEventListener('click', onDocClick)
      anchorLinks.forEach(link => link.removeEventListener('click', onAnchorClick))
      obs.disconnect()
    }
  }, [])

  return (
    <header className="navbar" id="navbar">
      <div className="nav-container">

        <div className="logo">
          <a href="#">
            <span className="curly">{`{`}</span>
            <span className="e-logo">E</span>
            <span className="curly">{`}`}</span>
          </a>
        </div>

        <div className="nav-pill-wrapper" id="navPillWrapper">
          <div className="nav-pill-indicator" id="navPillIndicator"></div>
          <nav className="nav-links nav-links--base" id="navLinksBase">
            <a href="#about"    className="nav-link" data-index="0">About</a>
            <a href="#work"     className="nav-link" data-index="1">Work</a>
            <a href="#skills"   className="nav-link" data-index="2">Skills</a>
            <a href="#services" className="nav-link" data-index="3">Services</a>
            <a href="#contact"  className="nav-link" data-index="4">Contact</a>
          </nav>
          <nav className="nav-links nav-links--active" id="navLinksActive" aria-hidden="true">
            <a href="#about"    className="nav-link" tabIndex={-1}>About</a>
            <a href="#work"     className="nav-link" tabIndex={-1}>Work</a>
            <a href="#skills"   className="nav-link" tabIndex={-1}>Skills</a>
            <a href="#services" className="nav-link" tabIndex={-1}>Services</a>
            <a href="#contact"  className="nav-link" tabIndex={-1}>Contact</a>
          </nav>
        </div>

        <div className="nav-right">
          <button
            className="theme-toggle"
            id="themeToggle"
            type="button"
            aria-label="Switch to light theme"
          >
            <svg className="theme-icon theme-icon-sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16" aria-hidden="true">
              <circle cx="12" cy="12" r="4"/>
              <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/>
            </svg>
            <svg className="theme-icon theme-icon-moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16" aria-hidden="true">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
            </svg>
          </button>

          <a
            href="/Emmanuel-Onyekachi-Resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="resume-btn"
            aria-label="View resume PDF"
          >
            Resume
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="14" height="14" aria-hidden="true">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
              <polyline points="7 10 12 15 17 10"/>
              <line x1="12" y1="15" x2="12" y2="3"/>
            </svg>
          </a>

          <a href="#contact" className="cta-btn">Work With Me</a>

          <button
            className="menu-toggle"
            id="menuToggle"
            type="button"
            aria-label="Toggle menu"
            aria-expanded="false"
          >
            <span></span>
            <span></span>
          </button>
        </div>

      </div>

      <div className="mobile-menu" id="mobileMenu">
        <div className='mobile-wrapper'>
          <a href="#about"    className="mobile-link" data-index="0">About</a>
          <a href="#work"     className="mobile-link" data-index="1">Work</a>
          <a href="#skills"   className="mobile-link" data-index="2">Skills</a>
          <a href="#services" className="mobile-link" data-index="3">Services</a>
          <a href="#contact"  className="mobile-link" data-index="4">Contact</a>
          <a href="#contact" className="mobile-menu-cta">Work With Me</a>
        </div>
      </div>
    </header>
  )
}