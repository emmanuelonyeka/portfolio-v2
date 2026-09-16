import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import type { CSSProperties } from 'react'
import { useReducedMotion } from '../../hooks/useReducedMotion'
import { Icon } from '../icons'

interface ProjectCarouselProps {
  images: string[]
  /** 'desktop' | 'mobile' — drives the slide aspect ratio. */
  aspect: string
  label: string
  onOpen: (index: number) => void
}

const arrowButton =
  'absolute top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center ' +
  'text-primary disabled:hidden'

const arrowFace =
  'inline-flex h-[clamp(2rem,8vw,2.6rem)] w-[clamp(2rem,8vw,2.6rem)] items-center justify-center ' +
  'rounded-full border border-edge-strong bg-surface-hover shadow-[0_4px_12px_rgba(0,0,0,0.3)] ' +
  'transition-[background-color,color,border-color] duration-200 ' +
  'hoverable:hover:border-accent hoverable:hover:bg-accent hoverable:hover:text-accent-contrast'

export function ProjectCarousel({ images, aspect, label, onOpen }: ProjectCarouselProps) {
  const count = images.length
  const reducedMotion = useReducedMotion()
  const viewportRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  // Three copies let the track reset invisibly at either end.
  const slides = useMemo(() => [...images, ...images, ...images], [images])

  const [index, setIndex] = useState(count)
  const [offset, setOffset] = useState(0)
  const [ready, setReady] = useState(false)
  const [animating, setAnimating] = useState(true)
  const indexRef = useRef(index)
  indexRef.current = index

  const measure = useCallback(() => {
    const viewport = viewportRef.current
    const track = trackRef.current
    const slide = track?.children.item(indexRef.current) as HTMLElement | null
    if (!viewport || !track || !slide) return

    // Pixel geometry is intentional. The previous CSS used multiplication
    // inside calc(), which invalidated the transform in shipping browsers and
    // left the controls waiting forever for a transitionend that could not fire.
    const nextOffset = viewport.clientWidth / 2 - (slide.offsetLeft + slide.offsetWidth / 2)
    setOffset((current) => (Math.abs(current - nextOffset) > 0.5 ? nextOffset : current))
    setReady(true)
  }, [])

  useLayoutEffect(() => {
    measure()
  }, [measure, slides, aspect, index])

  useEffect(() => {
    const viewport = viewportRef.current
    if (!viewport) return

    let resumeTimer = 0
    const observer = new ResizeObserver(() => {
      setAnimating(false)
      measure()
      window.clearTimeout(resumeTimer)
      resumeTimer = window.setTimeout(() => setAnimating(true), 30)
    })
    observer.observe(viewport)

    return () => {
      window.clearTimeout(resumeTimer)
      observer.disconnect()
    }
  }, [measure])

  useLayoutEffect(() => {
    setAnimating(false)
    setIndex(count)
  }, [count, aspect])

  useEffect(() => {
    if (animating) return
    // One frame with transitions off makes an infinite-loop reset invisible.
    const timer = window.setTimeout(() => setAnimating(true), 30)
    return () => window.clearTimeout(timer)
  }, [animating])

  useEffect(() => {
    if (!reducedMotion || count === 0) return
    const logical = ((index % count) + count) % count
    setAnimating(false)
    setIndex(count + logical)
    // Reduced-motion steps already stay inside the middle copy.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reducedMotion, count])

  function step(delta: number) {
    if (count < 2 || !ready || !animating) return

    const logical = ((index - count + delta) % count + count) % count
    if (reducedMotion) {
      setIndex(count + logical)
      return
    }

    const next = index + delta
    if (next < 0 || next >= slides.length) {
      // Only possible after unusually rapid repeated input. Re-centre without
      // animating instead of ever pointing at a slide that does not exist.
      setAnimating(false)
      setIndex(count + logical)
      return
    }
    setIndex(next)
  }

  function handleTransitionEnd(event: React.TransitionEvent) {
    // transitionend bubbles from the image transforms; only the track's own
    // movement should control the infinite-loop reset.
    if (event.target !== event.currentTarget || event.propertyName !== 'transform') return

    if (index >= 2 * count || index < count) {
      const logical = ((index % count) + count) % count
      setAnimating(false)
      setIndex(count + logical)
    }
  }

  const logicalIndex = count > 0 ? ((index % count) + count) % count : 0
  const portrait = aspect === '9 / 17'
  const carouselStyle = {
    '--slide-width': portrait ? 'clamp(11rem, 44%, 14rem)' : 'clamp(16rem, 72%, 32rem)',
  } as CSSProperties

  useEffect(() => {
    if (count < 2) return
    const neighbours = [
      images[(logicalIndex - 1 + count) % count],
      images[(logicalIndex + 1) % count],
    ]
    for (const src of new Set(neighbours)) {
      const image = new Image()
      image.decoding = 'async'
      image.src = src
    }
  }, [count, images, logicalIndex])

  if (count === 0) return null

  return (
    <div
      className="relative w-full py-2.5"
      style={carouselStyle}
      role="region"
      aria-roledescription="carousel"
      aria-label={`${label} project screenshots`}
    >
      <p className="sr-only" aria-live="polite" aria-atomic="true">
        Showing image {logicalIndex + 1} of {count}
      </p>
      <div ref={viewportRef} className="relative w-full overflow-hidden">
        <div
          ref={trackRef}
          className="flex w-full flex-nowrap"
          onTransitionEnd={handleTransitionEnd}
          style={{
            transform: `translate3d(${offset}px, 0, 0)`,
            transition:
              ready && animating && !reducedMotion
                ? 'transform 0.5s cubic-bezier(0.25, 1, 0.5, 1)'
                : 'none',
            visibility: ready ? 'visible' : 'hidden',
            willChange: ready && animating && !reducedMotion ? 'transform' : undefined,
          }}
        >
          {slides.map((src, slideIndex) => {
            const active = index % count === slideIndex % count
            const current = slideIndex === index
            return (
              <button
                key={slideIndex}
                type="button"
                onClick={() => onOpen(slideIndex % count)}
                aria-label={`Open ${label} image ${(slideIndex % count) + 1} of ${count}`}
                aria-hidden={!current}
                tabIndex={current ? 0 : -1}
                className="box-border shrink-0 px-1.5"
                style={{ flex: '0 0 var(--slide-width)', width: 'var(--slide-width)' }}
              >
                <img
                  src={src}
                  alt=""
                  width={portrait ? 900 : 1600}
                  height={portrait ? 1700 : 1000}
                  loading={current ? 'eager' : 'lazy'}
                  decoding="async"
                  fetchPriority={current ? 'high' : 'low'}
                  style={{ aspectRatio: aspect }}
                  className={`w-full origin-center rounded-[10px] border border-edge bg-surface-hover object-contain transition-[transform,opacity,aspect-ratio] duration-300 motion-reduce:transition-none ${
                    active ? 'scale-[1.03] opacity-100' : 'scale-[0.85] opacity-[0.55]'
                  }`}
                />
              </button>
            )
          })}
        </div>

        <button
          type="button"
          onClick={() => step(-1)}
          aria-label="Previous slide"
          disabled={count < 2}
          className={`${arrowButton} left-[clamp(0.25rem,2vw,0.75rem)]`}
        >
          <span className={arrowFace}>
            <Icon
              name="chevronLeft"
              size={16}
              strokeWidth={2.5}
              className="h-[clamp(0.9rem,4vw,1.1rem)] w-[clamp(0.9rem,4vw,1.1rem)]"
            />
          </span>
        </button>
        <button
          type="button"
          onClick={() => step(1)}
          aria-label="Next slide"
          disabled={count < 2}
          className={`${arrowButton} right-[clamp(0.25rem,2vw,0.75rem)]`}
        >
          <span className={arrowFace}>
            <Icon
              name="chevronRight"
              size={16}
              strokeWidth={2.5}
              className="h-[clamp(0.9rem,4vw,1.1rem)] w-[clamp(0.9rem,4vw,1.1rem)]"
            />
          </span>
        </button>
      </div>
    </div>
  )
}
