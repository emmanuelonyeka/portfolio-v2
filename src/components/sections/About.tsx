import { useLayoutEffect, useRef, useState } from 'react'
import { site, asset } from '../../config/site'
import { aboutIntro, aboutStack, aboutStory } from '../../data/about'
import { onScrollFrame } from '../../hooks/useScrolledPast'
import { Icon } from '../icons'
import FadeIn from '../ui/FadeIn'
import { Section } from '../ui/Section'
import { SectionHeading } from '../ui/SectionHeading'
import { Modal } from '../ui/Modal'

const words = aboutIntro.split(' ')

// The copy now moves from a clearly grey, still-AA-readable state to the full
// primary white/ink. At 0.6 the light theme remains just above 4.5:1, while
// the 40-point opacity range makes the scroll reveal unmistakable.
const DIM = 0.6
const RANGE = 1 - DIM

/**
 * ABOUT REVEAL TUNING
 *
 * START_OFFSET: 0 starts when the paragraph's first line crosses the top of
 * #waFloat. Positive pixels start earlier; negative pixels start later.
 * END_OFFSET_PX: 0 finishes when the About section reaches the viewport top.
 * Positive pixels finish earlier; negative pixels finish later.
 * WORD_SPREAD distributes word starts across the journey. Lower is faster.
 * WORD_FADE_WINDOW controls each word's own fade. Lower is snappier.
 */
const ABOUT_REVEAL_START_OFFSET_PX = 0
const ABOUT_REVEAL_END_OFFSET_PX = 0
const ABOUT_WORD_SPREAD = 0.92
const ABOUT_WORD_FADE_WINDOW = 0.08

export default function About() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const paragraphRef = useRef<HTMLParagraphElement>(null)
  const wordRefs = useRef<(HTMLSpanElement | null)[]>([])
  const [modalOpen, setModalOpen] = useState(false)

  useLayoutEffect(() => {
    const section = sectionRef.current
    const paragraph = paragraphRef.current
    if (!section || !paragraph) return

    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    const spans = () => wordRefs.current.filter((el): el is HTMLSpanElement => el !== null)

    // Words are rendered fully legible, so the text still reads if this never
    // runs. The scrub only ever dims them back down.
    function showAll() {
      for (const span of spans()) span.style.opacity = '1'
    }

    let listening = false
    let unsubscribeScroll: (() => void) | null = null
    const lastOpacity: number[] = []
    let triggerStart = window.innerHeight * 0.75

    function measure() {
      const whatsapp = document.getElementById('waFloat')
      if (whatsapp) {
        // offsetHeight + computed bottom ignores the entrance/hover transform,
        // so the trigger line never jumps as the floating control animates.
        const bottom = Number.parseFloat(window.getComputedStyle(whatsapp).bottom) || 0
        triggerStart =
          window.innerHeight - bottom - whatsapp.offsetHeight + ABOUT_REVEAL_START_OFFSET_PX
      } else {
        triggerStart = window.innerHeight * 0.75 + ABOUT_REVEAL_START_OFFSET_PX
      }
      if (!motionQuery.matches) paint()
    }

    function paint() {
      const rect = paragraph!.getBoundingClientRect()
      const ownerSection = paragraph!.closest('section')
      if (!ownerSection) return

      // When the section top reaches END_OFFSET_PX, paragraph.top equals this
      // line because the paragraph's fixed offset inside the section is added.
      const sectionRect = ownerSection.getBoundingClientRect()
      const paragraphOffsetWithinSection = rect.top - sectionRect.top
      const triggerEnd = paragraphOffsetWithinSection + ABOUT_REVEAL_END_OFFSET_PX
      const distance = Math.max(1, triggerStart - triggerEnd)
      const progress = Math.max(0, Math.min(1, (triggerStart - rect.top) / distance))

      const all = spans()
      const count = all.length

      all.forEach((span, i) => {
        const threshold = count > 1 ? (i / (count - 1)) * ABOUT_WORD_SPREAD : 0
        const reveal = Math.max(
          0,
          Math.min(1, (progress - threshold) / ABOUT_WORD_FADE_WINDOW),
        )
        const opacity = Math.round((DIM + reveal * RANGE) * 100) / 100
        // Skip the write when nothing changed — most frames move only a few words.
        if (lastOpacity[i] === opacity) return
        lastOpacity[i] = opacity
        span.style.opacity = String(opacity)
      })
    }

    function startListening() {
      if (listening) return
      listening = true
      unsubscribeScroll = onScrollFrame(paint)
      paint()
    }

    function stopListening() {
      if (!listening) return
      listening = false
      unsubscribeScroll?.()
      unsubscribeScroll = null
    }

    // The section is one screen tall in a ten-screen page — no reason to run
    // this while it is nowhere near the viewport.
    const observer = new IntersectionObserver(
      ([entry]) => (entry.isIntersecting ? startListening() : stopListening()),
      { rootMargin: '100px 0px' },
    )
    const resizeObserver = new ResizeObserver(measure)
    resizeObserver.observe(paragraph)

    function sync() {
      if (motionQuery.matches) {
        observer.disconnect()
        stopListening()
        lastOpacity.length = 0
        showAll()
      } else {
        observer.observe(section!)
      }
    }

    sync()
    measure()
    motionQuery.addEventListener('change', sync)
    window.addEventListener('resize', measure)

    return () => {
      motionQuery.removeEventListener('change', sync)
      window.removeEventListener('resize', measure)
      resizeObserver.disconnect()
      observer.disconnect()
      stopListening()
    }
  }, [])

  return (
    <>
      <Section id="about" className="scroll-mt-nav">
        <div ref={sectionRef}>
          <SectionHeading eyebrow="01. About" title="Who I am" />

          <div className="flex max-w-[760px] flex-col gap-12">
            <p
              ref={paragraphRef}
              className="text-[clamp(0.95rem,2.2vw,1.2rem)] font-normal leading-[1.55] text-primary"
            >
              {words.map((word, i) => (
                <span
                  key={i}
                  ref={(el) => {
                    wordRefs.current[i] = el
                  }}
                  className="inline transition-opacity duration-200"
                >
                  {word}{' '}
                </span>
              ))}
            </p>

            <FadeIn delay={0.2} y={20}>
              <ul className="flex list-none flex-wrap gap-2.5 p-0">
                {aboutStack.map((tech) => (
                  <li
                    key={tech}
                    className="inline-flex items-center rounded-full border border-edge bg-edge-faint px-4 py-1.5 text-[0.78rem] font-medium tracking-[0.05em] text-muted transition-[border-color,color] duration-300 hover:cursor-default hoverable:hover:border-accent/45 hoverable:hover:text-primary"
                  >
                    {tech}
                  </li>
                ))}
              </ul>
            </FadeIn>

            <FadeIn delay={0.3} y={20}>
              <button
                type="button"
                onClick={() => setModalOpen(true)}
                className="press-text group mt-2 inline-flex min-h-11 items-center p-0 text-base font-semibold text-muted transition-colors duration-300 hoverable:hover:text-primary"
              >
                <span className="relative pb-[3px] after:absolute after:bottom-0 after:left-0 after:h-[1.5px] after:w-full after:origin-left after:scale-x-0 after:bg-accent after:transition-transform after:duration-[350ms] after:ease-smooth hoverable:group-hover:after:scale-x-100">
                  Read more about me
                </span>
                <span className="ml-2.5 inline-flex animate-slide-right items-center text-accent transition-transform duration-500 ease-smooth hoverable:group-hover:translate-x-1.5 hoverable:group-hover:[animation-play-state:paused]">
                  <Icon name="arrowRight" size={14} />
                </span>
              </button>
            </FadeIn>
          </div>
        </div>
      </Section>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        labelledBy="about-modal-title"
        panelClassName="standard-modal-panel"
      >
        <div className="sticky top-0 z-[2] flex-none rounded-t-2xl border-b border-edge bg-surface px-[clamp(1rem,3vw,2.5rem)] pb-[clamp(0.85rem,2vw,1rem)] pt-[clamp(1rem,3vw,2.5rem)]">
          <span className="mb-3 inline-block font-mono text-[0.8rem] uppercase tracking-[0.12em] text-accent">
            About {site.name.split(' ')[0]}
          </span>
          <h2 id="about-modal-title" className="text-[clamp(1.3rem,3vw,1.8rem)] font-semibold tracking-[-0.01em] text-primary">
            The full story
          </h2>
          <button
            type="button"
            onClick={() => setModalOpen(false)}
            aria-label="Close about dialog"
            className="press absolute right-[clamp(0.65rem,2.5vw,1.5rem)] top-[clamp(0.65rem,2.5vw,1.5rem)] inline-flex h-11 w-11 items-center justify-center text-muted"
          >
            <span className="inline-flex h-[clamp(2.125rem,8vw,2.75rem)] w-[clamp(2.125rem,8vw,2.75rem)] items-center justify-center rounded-lg border border-edge bg-edge-faint transition-colors duration-200 hoverable:hover:border-accent hoverable:hover:text-primary">
              <Icon
                name="close"
                size={20}
                className="h-[clamp(1rem,4vw,1.25rem)] w-[clamp(1rem,4vw,1.25rem)]"
              />
            </span>
          </button>
        </div>

        <div
          data-lenis-prevent
          className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-[clamp(1rem,3vw,2.5rem)] py-[clamp(1rem,2.5vw,1.5rem)] [-webkit-overflow-scrolling:touch]"
        >
          {aboutStory.map((paragraph, i) => (
            <p key={i} className="mb-4 text-[0.95rem] leading-[1.8] text-secondary last:mb-0">
              {paragraph}
            </p>
          ))}
        </div>

        <div className="sticky bottom-0 z-[2] flex-none rounded-b-2xl border-t border-edge bg-surface px-[clamp(1rem,3vw,2.5rem)] pb-[clamp(1rem,3vw,2.5rem)] pt-[clamp(0.8rem,2vw,1.5rem)]">
          <a
            href={asset(site.resume)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-lg border border-edge-strong px-5 py-3 text-sm font-semibold text-primary no-underline transition-[border-color,color,transform] duration-300 hoverable:hover:translate-x-1 hoverable:hover:border-accent/25 hoverable:hover:text-accent"
          >
            View my résumé
            <Icon name="download" size={13} />
          </a>
        </div>
      </Modal>
    </>
  )
}
