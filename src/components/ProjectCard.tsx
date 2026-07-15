import { useState, useEffect } from 'react'
import { motion, useTransform, MotionValue } from 'framer-motion'

interface ProjectCardProps {
  index: number
  total: number
  num: string
  cat: string
  name: string
  desc: string
  overview?: string
  highlights?: string[]   
  tech: string[]
  col2: string
  desktopImages?: string[]
  mobileImages?: string[]
  href?: string
  code?: string
  tabColor: string
  tabBg: string
  scrollYProgress: MotionValue<number>
  inProgress?: boolean
}

const PEEK = 40
const NAV_H = 78
const TAB_HEIGHT = 36
const TAB_STEP = 20

export default function ProjectCard({
  index,
  total,
  num,
  cat,
  name,
  desc,
  overview,
  highlights = [],  
  tech,
  col2,
  desktopImages = [],
  mobileImages = [],
  href = '#',
  code = '#',
  tabColor,
  tabBg,
  scrollYProgress,
  inProgress = false,
}: ProjectCardProps) {
  const [modalOpen, setModalOpen] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)
  const [singleLightboxImage, setSingleLightboxImage] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<'desktop' | 'mobile'>('desktop')
  const [isMobileScreen, setIsMobileScreen] = useState(false)

  useEffect(() => {
    const handleResize = () => {
      setIsMobileScreen(window.innerWidth < 768)
    }
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Infinite Carousel index configuration
  const activeImages = viewMode === 'desktop' ? desktopImages : (mobileImages.length > 0 ? mobileImages : desktopImages)
  const N = activeImages.length
  const clonedImages = [...activeImages, ...activeImages, ...activeImages]

  const [carouselIndex, setCarouselIndex] = useState(N)
  const [isTransitioning, setIsTransitioning] = useState(true)
  const [canClick, setCanClick] = useState(true)

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (!isTransitioning || !canClick) return
    setCanClick(false)
    setCarouselIndex(prev => prev - 1)
  }

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (!isTransitioning || !canClick) return
    setCanClick(false)
    setCarouselIndex(prev => prev + 1)
  }

  const handleTransitionEnd = () => {
    if (carouselIndex >= 2 * N) {
      setIsTransitioning(false)
      setCarouselIndex(carouselIndex - N)
    } else if (carouselIndex < N) {
      setIsTransitioning(false)
      setCarouselIndex(carouselIndex + N)
    }
    setCanClick(true)
  }

  useEffect(() => {
    if (!isTransitioning) {
      const timeout = setTimeout(() => {
        setIsTransitioning(true)
      }, 20)
      return () => clearTimeout(timeout)
    }
  }, [isTransitioning])

  useEffect(() => {
    setCarouselIndex(N)
  }, [viewMode, N])

  const intervals: number[] = []
  const scales: number[] = []
  const scaleReduction = 0.06

  for (let i = 0; i <= total; i++) {
    intervals.push(i / total)
    const stepsPast = i - (index + 1)
    if (stepsPast <= 0) {
      scales.push(1)
    } else {
      scales.push(Math.max(0.7, 1 - stepsPast * scaleReduction))
    }
  }

  const scale = useTransform(scrollYProgress, intervals, scales)

  const stickyTop = NAV_H + 24 + index * PEEK
  
  // Outer wrappers MUST utilize standard staggered heights to align bottom elements and scroll away together
  const cardHeight = `calc(100vh - ${stickyTop}px)`
  const marginBottom = '12vh'

  const R = 14
  const tabClipPath = `polygon(
    0% 0%,
    58% 0%,
    calc(58% + 24px) ${TAB_STEP}px,
    calc(100% - ${R}px) ${TAB_STEP}px,
    calc(100% - 6px) ${TAB_STEP + 2.5}px,
    calc(100% - 2px) ${TAB_STEP + 6}px,
    100% ${TAB_STEP + R}px,
    100% 100%,
    0% 100%
  )`

  const resolvedScale = isMobileScreen ? 1 : scale

  useEffect(() => {
    const waFloat = document.getElementById('waFloat')
    if (modalOpen || lightboxIndex !== null || singleLightboxImage !== null) {
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
  }, [modalOpen, lightboxIndex, singleLightboxImage])

  // Close modal when any nav anchor link is clicked
    useEffect(() => {
      if (!modalOpen && lightboxIndex === null && singleLightboxImage === null) return

      const handleNavClick = (e: MouseEvent) => {
        const target = e.target as HTMLElement
        // Close modal for anchor nav links — but NOT theme toggle or hamburger
        const isAnchorLink = target.closest('a[href^="#"]')
        const isThemeToggle = target.closest('#themeToggle')
        const isMenuToggle = target.closest('#menuToggle')
        
        if (isAnchorLink && !isThemeToggle && !isMenuToggle) {
          setModalOpen(false)
          setLightboxIndex(null)
          setSingleLightboxImage(null)
        }
      }

      document.addEventListener('click', handleNavClick)
      return () => document.removeEventListener('click', handleNavClick)
    }, [modalOpen, lightboxIndex, singleLightboxImage])

  // Keyboard navigation for open carousel lightbox modal
  useEffect(() => {
    if (lightboxIndex === null) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        setLightboxIndex((prev) => (prev !== null ? (prev - 1 + N) % N : 0))
      } else if (e.key === 'ArrowRight') {
        setLightboxIndex((prev) => (prev !== null ? (prev + 1) % N : 0))
      } else if (e.key === 'Escape') {
        setLightboxIndex(null)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [lightboxIndex, N])

  // Keyboard listener to close the single image lightbox modal
  useEffect(() => {
    if (singleLightboxImage === null) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSingleLightboxImage(null)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [singleLightboxImage])

  return (
    <>
      <div
        style={{
          position: isMobileScreen ? 'relative' : 'sticky',
          top: isMobileScreen ? 'unset' : stickyTop,
          height: isMobileScreen ? 'auto' : cardHeight,
          paddingLeft: 'clamp(1rem, 3vw, 2.5rem)',
          paddingRight: 'clamp(1rem, 3vw, 2.5rem)',
          paddingBottom: isMobileScreen ? 0 : `${PEEK}px`,
          paddingTop: isMobileScreen ? `${TAB_HEIGHT + TAB_STEP + 8}px` : 0,
          zIndex: index + 1,
          marginBottom: isMobileScreen
            ? (index === total - 1 ? '0' : '28px')
            : marginBottom,
        }}
      >
        <motion.div
          style={{
            scale: resolvedScale,
            transformOrigin: 'top center',
            willChange: 'transform',
            height: '100%',
            position: 'relative',
          }}
        >
          {/* Fold Tab */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: TAB_HEIGHT + TAB_STEP,
              zIndex: 1,
              pointerEvents: 'none',
              filter: 'drop-shadow(0px -5px 6px rgba(0, 0, 0, 0.28))',
            }}
          >
            <div
              style={{
                width: '100%',
                height: '100%',
                background: tabBg,
                clipPath: tabClipPath,
                borderRadius: `clamp(12px, 1.5vw, 16px) clamp(12px, 1.5vw, 16px) 0 0`,
              }}
            />
          </div>

          {/* Tab Label */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              height: TAB_HEIGHT,
              paddingLeft: 'clamp(1rem, 2vw, 1.5rem)',
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              zIndex: 2,
            }}
          >
            <span style={{
              fontSize: '0.7rem',
              fontWeight: 700,
              color: tabColor,
              fontFamily: "'JetBrains Mono', 'SF Mono', monospace",
              letterSpacing: '0.08em',
            }}>
              {num}
            </span>
            <span style={{ width: 1, height: 10, background: tabColor, opacity: 0.4 }} />
            <span style={{
              fontSize: '0.68rem',
              fontWeight: 600,
              color: tabColor,
              opacity: 0.85,
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
            }}>
              {name}
            </span>
          </div>

          {/* Inner card contents are aligned using uniform heights based on the shortest Card (Card 4) */}
          <div
            className="p-card"
            style={{
              position: isMobileScreen ? 'relative' : 'absolute',
              top: isMobileScreen ? '40px' : TAB_HEIGHT,
              left: isMobileScreen ? 'unset' : 0,
              right: isMobileScreen ? 'unset' : 0,
              height: isMobileScreen
                ? 'auto'
                : `calc(100vh - ${NAV_H + 24 + 3 * PEEK + TAB_HEIGHT + 24}px)`,
              boxShadow: '0px -10px 30px rgba(0, 0, 0, 0.15), 0 20px 60px rgba(0, 0, 0, 0.25)',
            }}
          >
            <div className="p-card-left">
              <div className="p-card-top">
                <span className="p-card-num">{num}</span>
                <div className='card-category'>
                  <span className="p-card-cat">{cat}</span>
                  {inProgress && (
                    <span className="p-card-cat in-progress">
                      <span className="progress-dot" />
                      In Progress
                    </span>
                  )}
                </div>
              </div>
              <h3 className="p-card-name">{name}</h3>
              <p className="p-card-desc">{desc}</p>
              <div className="p-card-tech">
                {tech.map(t => (
                  <span key={t} className="p-card-tag">{t}</span>
                ))}
              </div>
              
              <div className="p-card-actions">
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-card-btn"
                >
                  View Project
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="13" height="13">
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                    <polyline points="15 3 21 3 21 9"/>
                    <line x1="10" y1="14" x2="21" y2="3"/>
                  </svg>
                </a>
                <button
                  className="p-card-details-btn"
                  onClick={() => setModalOpen(true)}
                >
                  Case Study
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="13" height="13" style={{ marginLeft: '4px' }}>
                    <circle cx="11" cy="11" r="8"/>
                    <line x1="21" y1="21" x2="16.65" y2="16.65"/>
                  </svg>
                </button>
              </div>
            </div>

            <div 
              className="p-card-right" 
              onClick={() => setSingleLightboxImage(col2)} 
              style={{ cursor: 'pointer' }}
            >
              {col2.endsWith('.mp4') || col2.endsWith('.webm') ? (
                <video
                  src={col2}
                  autoPlay
                  loop
                  muted
                  playsInline
                  preload="metadata"
                  className="p-card-img w-full h-full object-cover object-top"
                  aria-label={`${name} preview video`}
                />
              ) : (
                <img
                  src={col2}
                  alt={`${name} screenshot`}
                  loading="lazy"
                  className="p-card-img"
                />
              )}
            </div>
          </div>

        </motion.div>
      </div>

      {/* Case Study details Modal (Overlay click dismiss disabled) */}
      {modalOpen && (
        <div
          className="proj-modal-overlay"
          role="dialog"
          aria-modal="true"
        >
          <div className="proj-modal" onClick={e => e.stopPropagation()}>
            <div className="proj-modal-sticky-header">
              <div>
                <span style={{ color: tabColor, fontSize: '0.7rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em' }}>{cat}</span>
                <h2 className="proj-modal-title">{name}</h2>
              </div>
              <button
                className="about-modal-close"
                onClick={() => setModalOpen(false)}
                aria-label="Close"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="20" height="20">
                  <line x1="18" y1="6" x2="6" y2="18"/>
                  <line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>

            <div className="proj-modal-body">
              {/* Sliding viewmode toggle */}
              <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
                <div className="view-toggle-pill" style={{ position: 'relative' }}>
                  <div
                    className="view-toggle-indicator"
                    style={{
                      position: 'absolute',
                      top: '4px',
                      bottom: '4px',
                      left: '4px',
                      width: 'calc(50% - 4px)',
                      background: 'var(--accent-dim)',
                      border: '1px solid var(--accent-border)',
                      borderRadius: '12px',
                      transition: 'transform 0.35s cubic-bezier(0.25, 1, 0.5, 1)',
                      transform: viewMode === 'desktop' ? 'translateX(0)' : 'translateX(100%)',
                      pointerEvents: 'none',
                      zIndex: 1,
                    }}
                  />
                  <button
                    className={`view-toggle-btn ${viewMode === 'desktop' ? 'active' : ''}`}
                    onClick={() => setViewMode('desktop')}
                    style={{ position: 'relative', zIndex: 2 }}
                  >
                    Desktop View
                  </button>
                  <button
                    className={`view-toggle-btn ${viewMode === 'mobile' ? 'active' : ''}`}
                    onClick={() => setViewMode('mobile')}
                    style={{ position: 'relative', zIndex: 2 }}
                  >
                    Mobile View
                  </button>
                </div>
              </div>

              {/* Infinite Image Carousel */}
              <div className="carousel-wrapper">
                <div className="carousel-track-container">
                  <div
                    className="carousel-track"
                    onTransitionEnd={handleTransitionEnd}
                    style={{
                      transform: `translateX(calc(-${carouselIndex} * var(--slide-width) + (50% - var(--slide-width) / 2)))`,
                      transition: isTransitioning ? 'transform 0.5s cubic-bezier(0.25, 1, 0.5, 1)' : 'none',
                    }}
                  >
                    {clonedImages.map((img, i) => {
                      const isActive = (carouselIndex % N) === (i % N)
                      return (
                        <div
                          key={i}
                          className={`carousel-slide ${isActive ? 'active' : ''}`}
                          onClick={() => setLightboxIndex(i % N)}
                          style={{
                            '--carousel-aspect': viewMode === 'desktop' ? '16 / 10' : '9 / 19.5'
                          } as React.CSSProperties}
                        >
                          <img
                            src={img}
                            alt={`${name} slide ${i}`}
                            className="carousel-img"
                            loading="lazy"
                          />
                        </div>
                      )
                    })}
                  </div>

                  <button
                    className="carousel-btn carousel-btn--prev"
                    onClick={handlePrev}
                    aria-label="Previous slide"
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="16" height="16">
                      <polyline points="15 18 9 12 15 6" />
                    </svg>
                  </button>

                  <button
                    className="carousel-btn carousel-btn--next"
                    onClick={handleNext}
                    aria-label="Next slide"
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="16" height="16">
                      <polyline points="9 18 15 12 9 6" />
                    </svg>
                  </button>
                </div>
              </div>

              <div className="proj-modal-section">
                <h3 className="proj-modal-section-title">Overview</h3>
                <div className="proj-modal-divider" style={{ margin: '6px 0 14px' }} />
                <p className="proj-modal-desc">{overview || desc}</p>
              </div>

              <div className="proj-modal-section" style={{ marginTop: '12px' }}>
                <h3 className="proj-modal-section-title">Highlights</h3>
                <div className="proj-modal-divider" style={{ margin: '6px 0 14px' }} />
                <ul className="proj-modal-highlights">
                {highlights.map((h: string, i: number) => (
                    <li key={i} className="proj-modal-highlight-item">
                      <span className="proj-modal-highlight-dot" aria-hidden="true" />
                      {h}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="proj-modal-section" style={{ marginTop: '12px' }}>
                <h3 className="proj-modal-section-title">Tech Stack</h3>
                <div className="proj-modal-divider" style={{ margin: '6px 0 14px' }} />
                <div className="p-card-tech">
                  {tech.map(t => (
                    <span key={t} className="p-card-tag">{t}</span>
                  ))}
                </div>
              </div>
            </div>

            <div className="proj-modal-footer">
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="p-card-btn"
              >
                View Live Project
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="13" height="13">
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                  <polyline points="15 3 21 3 21 9"/>
                  <line x1="10" y1="14" x2="21" y2="3"/>
                </svg>
              </a>
              <a
                href={code}
                target="_blank"
                rel="noopener noreferrer"
                className="p-card-details-btn"
                style={{ borderRadius: '8px'}}
              >
                Source Code
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="13" height="13">
                  <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Single Image Lightbox view overlay (from the static project card) */}
      {singleLightboxImage !== null && (
        <div
          className="lightbox-overlay"
          onClick={() => setSingleLightboxImage(null)}
          role="dialog"
          aria-modal="true"
        >
          <button
            className="lightbox-close"
            onClick={() => setSingleLightboxImage(null)}
            aria-label="Close image lightbox"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="22" height="22">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
          {singleLightboxImage.endsWith('.mp4') || singleLightboxImage.endsWith('.webm') ? (
            <video
              src={singleLightboxImage}
              autoPlay
              loop
              muted
              playsInline
              preload="metadata"
              className="lightbox-img"
              onClick={e => e.stopPropagation()}
            />
          ) : (
            <img
              src={singleLightboxImage}
              alt={`${name} screenshot`}
              className="lightbox-img"
              onClick={e => e.stopPropagation()}
            />
          )}
        </div>
      )}

      {/* Carousel Navigation Lightbox view overlay (from the case study modal) */}
      {lightboxIndex !== null && (
        <div
          className="lightbox-overlay"
          onClick={() => setLightboxIndex(null)}
          role="dialog"
          aria-modal="true"
        >
          <button
            className="lightbox-close"
            onClick={() => setLightboxIndex(null)}
            aria-label="Close image lightbox"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="22" height="22">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>

          {/* Previous Button */}
          <button
            className="carousel-btn carousel-btn--prev"
            style={{ left: '20px', width: '44px', height: '44px' }}
            onClick={(e) => {
              e.stopPropagation()
              setLightboxIndex((prev) => (prev !== null ? (prev - 1 + N) % N : 0))
            }}
            aria-label="Previous image"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="20" height="20">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>

          {/* Image Display */}
          <img
            src={activeImages[lightboxIndex]}
            alt={`${name} screenshot`}
            loading="lazy"
            className="lightbox-img"
            onClick={e => e.stopPropagation()}
          />

          {/* Next Button */}
          <button
            className="carousel-btn carousel-btn--next"
            style={{ right: '20px', width: '44px', height: '44px' }}
            onClick={(e) => {
              e.stopPropagation()
              setLightboxIndex((prev) => (prev !== null ? (prev + 1) % N : 0))
            }}
            aria-label="Next image"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="20" height="20">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        </div>
      )}
    </>
  )
}