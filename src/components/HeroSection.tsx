import { useEffect } from 'react'
import Magnet from './Magnet'

export default function HeroSection() {

  useEffect(() => {
    setTimeout(() => {
      document.querySelectorAll('.hero-reveal').forEach(el => el.classList.add('visible'))
    }, 100)
  
    // Live Lagos time
    const timeEl = document.getElementById('liveTime')
    const pillEl = timeEl ? timeEl.closest('.status-pill') : null
    if (timeEl && pillEl) {
      const updateTime = () => {
        try {
          const now = new Date()
          const fmt = new Intl.DateTimeFormat('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true,
            timeZone: 'Africa/Lagos',
          })
          const timeStr = fmt.format(now).toLowerCase().replace(' ', '')
          timeEl.textContent = timeStr + ' in Lagos NG'
          pillEl.classList.add('has-time')
        } catch (e) { /* leave pill as-is */ }
      }
      updateTime()
      const now = new Date()
      const msToNextMinute = (60 - now.getSeconds()) * 1000 - now.getMilliseconds()
      setTimeout(() => {
        updateTime()
        setInterval(updateTime, 60000)
      }, msToNextMinute)
    }
  
    // Word cycling
    let cycleInterval: ReturnType<typeof setInterval> | null = null
    const cycleItems = document.querySelectorAll('.word-cycle .word-cycle-item')
    if (cycleItems.length > 1) {
      let activeIdx = 0
      const ROTATE_MS = 2400
      cycleInterval = setInterval(() => {
        const current = cycleItems[activeIdx]
        const nextIdx = (activeIdx + 1) % cycleItems.length
        const next = cycleItems[nextIdx]
        current.classList.remove('is-active')
        current.classList.add('is-leaving')
        next.classList.remove('is-leaving')
        next.classList.add('is-active')
        setTimeout(() => current.classList.remove('is-leaving'), 500)
        activeIdx = nextIdx
      }, ROTATE_MS)
    }

    // Hide side elements when scrolling
    const handleSideScroll = () => {
      const sideEls = document.querySelectorAll<HTMLElement>('.side-socials, .side-email')
      if (window.scrollY > 30) {
        sideEls.forEach(el => {
          el.style.opacity = '0'
          el.style.transform = 'translateY(20px)'
          el.style.pointerEvents = 'none'
        })
      } else {
        sideEls.forEach(el => {
          el.style.opacity = '1'
          el.style.transform = 'translateY(0)'
          el.style.pointerEvents = 'auto'
        })
      }
    }

    window.addEventListener('scroll', handleSideScroll, { passive: true })

    return () => {
      if (cycleInterval) clearInterval(cycleInterval)
      window.removeEventListener('scroll', handleSideScroll)
    }
  }, [])

  return (
    <section className="hero" id="hero">
      <div className="container hero-container">

        <div className="hero-left">

          <div className="status-pill hero-reveal" role="status" aria-label="Currently available for new projects">
            <span className="status-dot" aria-hidden="true"></span>
            <span className="status-text">Available for freelance</span>
            <span className="status-divider" aria-hidden="true">&middot;</span>
            <span className="status-time" id="liveTime" aria-label="Local time in Lagos"></span>
          </div>

          <p className="hero-intro hero-reveal">
            Web Developer building{' '}
            <span className="word-cycle" aria-live="polite">
              <span className="word-cycle-item is-active">interfaces</span>
              <span className="word-cycle-item">experiences</span>
              <span className="word-cycle-item">products</span>
              <span className="word-cycle-item">systems</span>
            </span>
          </p>

          <h1 className="hero-name">
            <span className="hero-reveal" style={{ display: 'block', color: 'var(--text-primary)' }}>Emmanuel</span>
            <span className="hero-reveal" style={{ display: 'block', color: 'var(--text-muted)' }}>Onyekachi</span>
          </h1>

          <p className="hero-description hero-reveal">
          I design and build modern, fully responsive, high-performance web experiences — 
          engineered with clean architecture, refined motion, and precise attention to detail. 
          </p>

          <div className="hero-buttons hero-reveal">
            <a href="#work" className="btn-primary">View Selected Work</a>
            <a href="#contact" className="btn-outline">Start a Project</a>
          </div>

        </div>

        <div className="hero-right">
          <Magnet padding={150} strength={3}>
            <div className="image-wrapper" id="heroImageWrapper">
              <img src={`${import.meta.env.BASE_URL}images/my-portfolio-picture.png`} alt="Emmanuel Onyekachi" />
            </div>
          </Magnet>
        </div>

      </div>
    </section>
  )
}