import { useEffect, useRef, useState } from 'react'
import FadeIn from './FadeIn'

const STACK = ['HTML', 'CSS', 'JavaScript', 'React', 'Tailwind', 'GSAP', 'Framer Motion', 'Git', 'Vite', 'Next.js']

const ABOUT_WORDS = [
  "I'm", "a", "self-taught", "frontend", "web", "developer", "based", "in", "Lagos,",
  "Nigeria", "—", "building", "fast,", "refined,", "and", "performant", "web", "experiences",
  "engineered", "with", "precision.", "My", "background", "in", "engineering", "shapes", "my",
  "systems-thinking", "approach,", "now", "applied", "to", "clean", "architecture,", "intuitive",
  "motion,", "and", "UI", "craft.", "I", "focus", "on", "turning", "complex", "designs", "into",
  "responsive,", "highly", "interactive,", "production-ready", "applications."
]

const ABOUT_FULL = `I'm Emmanuel Onyekachi, a frontend developer based in Lagos, Nigeria.

My journey into web development started from curiosity back in 2023, and over time it became something I genuinely enjoy doing. My background in Materials and Metallurgical Engineering taught me to think in systems, work with precision, and care deeply about how things are made. That same mindset now shapes every website I build.

Today, I specialise in building modern, fully responsive, high-performance web experiences that help businesses convert visitors into customers, improve user experience, and turn designs into production-ready applications. I work primarily with HTML, CSS, JavaScript, React, Tailwind CSS, TypeScript, and modern frontend tools.

What I enjoy most is building interfaces that are simple, intuitive, and enjoyable to use. I pay a lot of attention to how users interact with a website because I believe good design isn't just about how something looks - it's about how it feels to use. My goal is always to make the experience as smooth and stress-free as possible for the people on the other side of the screen.

I'm currently open to frontend opportunities and freelance projects, and I'm always excited to work on products that value thoughtful design and great user experience.`

export default function AboutSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const wordRefs = useRef<(HTMLSpanElement | null)[]>([])
  const [modalOpen, setModalOpen] = useState(false)

  // Scroll on reveal highlight tracking effect
  useEffect(() => {
    const onScroll = () => {
      const section = sectionRef.current
      if (!section) return

      const sectionTop = section.getBoundingClientRect().top
      const start = window.innerHeight * 0.65
      const end = window.innerHeight * 0.001

      const progress = 1 - Math.max(0, Math.min(1, (sectionTop - end) / (start - end)))

      wordRefs.current.forEach((word, i) => {
        if (!word) return
        const wordThreshold = (i / wordRefs.current.length) * 0.85
        const wordProgress = Math.max(0, Math.min(1, (progress - wordThreshold) / (1 / (wordRefs.current.length * 0.6))))
        word.style.opacity = String(0.15 + wordProgress * 0.85)
      })
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setModalOpen(false) }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  useEffect(() => {
    const waFloat = document.getElementById('waFloat')
    if (modalOpen) {
      document.body.classList.add('modal-open')
      waFloat?.classList.add('wa-float--hidden')
    } else {
      document.body.classList.remove('modal-open')
      waFloat?.classList.remove('wa-float--hidden')
    }
    return () => {
      document.body.classList.remove('modal-open')
      waFloat?.classList.remove('wa-float--hidden')
    }
  }, [modalOpen])

  return (
    <>
      <section ref={sectionRef} id="about" className="section about-section">
        <div className="container">

          <FadeIn delay={0} y={30} as="div" className="section-label-wrap">
            <span className="section-eyebrow">01. About</span>
            <h2 className="section-title">Who I am</h2>
          </FadeIn>

          <div className="about-body">
            <p className="about-text">
              {ABOUT_WORDS.map((word, i) => (
                <span
                  key={i}
                  ref={el => { wordRefs.current[i] = el }}
                  style={{
                    opacity: 0.15,
                    color: 'var(--text-muted)',
                    transition: 'opacity 0.2s ease, color 0.2s ease',
                    display: 'inline',
                  }}
                >
                  {word}{' '}
                </span>
              ))}
            </p>

            <FadeIn delay={0.2} y={20}>
              <div className="stack-badges">
                {STACK.map(tech => (
                  <span key={tech} className="badge">{tech}</span>
                ))}
              </div>
            </FadeIn>

            <FadeIn delay={0.3} y={20}>
              <button
                className="about-more-btn"
                onClick={() => setModalOpen(true)}
                aria-label="Read more about Emmanuel"
              >
                <span className="about-more-btn-text">Read more about me</span>
                <span className="about-more-btn-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="14" height="14">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </span>
              </button>
            </FadeIn>

          </div>
        </div>
      </section>

      {modalOpen && (
        <div
          className="about-modal-overlay"
          onClick={() => setModalOpen(false)}
          role="dialog"
          aria-modal="true"
        >
          <div className="about-modal" onClick={e => e.stopPropagation()}>
            <div className="about-modal-sticky-header">
              <span className="section-eyebrow">About Emmanuel</span>
              <h2 className="about-modal-title">The full story</h2>
              <button className="about-modal-close" onClick={() => setModalOpen(false)} aria-label="Close">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="20" height="20">
                  <line x1="18" y1="6" x2="6" y2="18"/>
                  <line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>

            <div className="about-modal-body">
              {ABOUT_FULL.trim().split('\n\n').map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>

            <div className="about-modal-footer">
              <a
                href="https://wa.me/2348147931141?text=Hi%20Emmanuel%2C%20I%20found%20your%20portfolio%20and%20would%20love%20to%20discuss%20a%20project."
                target="_blank"
                rel="noopener noreferrer"
                className="p-card-btn"
              >
                Let's work together
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="13" height="13">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  )
}