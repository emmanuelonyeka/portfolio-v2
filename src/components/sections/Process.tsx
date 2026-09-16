import { useEffect, useRef, useState } from 'react'
import { processSteps } from '../../data/process'
import { Section } from '../ui/Section'
import { SectionHeading } from '../ui/SectionHeading'

/* PROCESS MOTION TUNING: keep the centred step legible without shrinking its neighbours. */
const ACTIVE_SCALE = 'scale-[1.01]'
const RESTING_SCALE = 'scale-100'

export default function Process() {
  const [activeSteps, setActiveSteps] = useState<ReadonlySet<number>>(() => new Set())
  const stepRefs = useRef<(HTMLElement | null)[]>([])

  useEffect(() => {
    const steps = stepRefs.current.filter((el): el is HTMLElement => el !== null)
    if (steps.length === 0) return

    let observer: IntersectionObserver | null = null
    let lastMargin = ''

    /**
     * A step is active while the viewport's centre line — measured below the
     * header — sits inside it. Negative rootMargin collapses the observation
     * root to a 1px band at exactly that line, so the browser reports the
     * answer. The previous version recomputed it in a scroll handler and called
     * setState with a fresh object on every single scroll event, re-rendering
     * the whole section hundreds of times per pass.
     */
    function margin() {
      const navHeight =
        parseInt(
          getComputedStyle(document.documentElement).getPropertyValue('--navbar-height'),
          10,
        ) || 80
      const centre = Math.round(navHeight + (window.innerHeight - navHeight) / 2)
      const below = Math.max(0, window.innerHeight - centre - 1)
      return `${-centre}px 0px ${-below}px 0px`
    }

    function observe() {
      const rootMargin = margin()
      if (rootMargin === lastMargin) return
      lastMargin = rootMargin

      observer?.disconnect()
      observer = new IntersectionObserver(
        (entries) => {
          setActiveSteps((current) => {
            const next = new Set(current)
            for (const entry of entries) {
              const index = steps.indexOf(entry.target as HTMLElement)
              if (index === -1) continue
              if (entry.isIntersecting) next.add(index)
              else next.delete(index)
            }
            // Identical membership means an identical render — returning the
            // same reference lets React bail out instead of re-rendering.
            const unchanged =
              next.size === current.size && [...next].every((index) => current.has(index))
            return unchanged ? current : next
          })
        },
        { rootMargin, threshold: 0 },
      )
      steps.forEach((step) => observer!.observe(step))
    }

    observe()
    window.addEventListener('resize', observe)
    return () => {
      window.removeEventListener('resize', observe)
      observer?.disconnect()
    }
  }, [])

  return (
    <Section id="process">
      <SectionHeading eyebrow="06. Process" title="How I work" animate={false} />

      <ol className="flex list-none flex-col p-0">
        {processSteps.map((step, i) => {
          const isActive = activeSteps.has(i)
          const followsActive = activeSteps.has(i - 1)
          // Both accent lines belong to the centred step itself. The following
          // step makes its touching top border transparent, so it cannot shorten,
          // recolour or visually double the active step's bottom boundary.
          const topBorder = isActive
            ? 'border-t-accent'
            : followsActive
              ? 'border-t-transparent'
              : 'border-t-edge'
          const isLast = i === processSteps.length - 1
          const bottomBorder = isActive
            ? 'border-b-accent'
            : isLast
              ? 'border-b-edge'
              : 'border-b-transparent'

          return (
            <li
              key={step.num}
              ref={(el) => {
                stepRefs.current[i] = el
              }}
              className={[
                'group flex flex-col items-start gap-3 border-y py-[clamp(28px,4vw,48px)]',
                'transition-[border-color,transform] duration-[400ms] motion-reduce:transform-none',
                'min-[701px]:flex-row min-[701px]:gap-[clamp(20px,4vw,60px)]',
                topBorder,
                bottomBorder,
                isActive ? ACTIVE_SCALE : RESTING_SCALE,
              ]
                .filter(Boolean)
                .join(' ')}
            >
              <span
                className={[
                  'shrink-0 text-[2rem] font-bold leading-none',
                  'transition-colors duration-300',
                  'min-[701px]:text-[clamp(2.5rem,6vw,5rem)]',
                  isActive
                    ? 'text-accent'
                    : 'text-muted hoverable:group-hover:text-secondary',
                ].join(' ')}
              >
                {step.num}
              </span>

              <div className="pt-[clamp(4px,1vw,12px)]">
                <h3 className="mb-3 text-[clamp(1.1rem,2vw,1.6rem)] font-semibold tracking-[-0.01em] text-primary">
                  {step.title}
                </h3>
                <p className="max-w-[600px] text-[clamp(0.88rem,1.4vw,1rem)] leading-[1.75] text-muted">
                  {step.desc}
                </p>
              </div>
            </li>
          )
        })}
      </ol>
    </Section>
  )
}
