import { useEffect, useState } from 'react'
import { site, asset } from '../../config/site'
import { heroCopy } from '../../data/hero'
import { useInView } from '../../hooks/useInView'
import { useReducedMotion } from '../../hooks/useReducedMotion'
import { scrollToSection } from '../../lib/scrollToSection'
import Magnet from '../ui/Magnet'
import { Container } from '../ui/Container'

/**
 * Reveal delays, in order. The old CSS used `:nth-child`, which silently gave
 * the two name lines 0.15s and 0.25s — the same slots as the pill and the intro
 * — because they are children of the `<h1>`, not of the column. This is the
 * ladder that was clearly intended.
 */
const REVEAL = [0.15, 0.25, 0.35, 0.45, 0.55, 0.65]

const EYEBROW_SEEN_KEY = 'emmanuel:hero-eyebrow-seen'
const TYPE_DELAY_MS = 240
const TYPE_INTERVAL_MS = 95

type EyebrowPhase = 'static' | 'waiting' | 'typing' | 'blinking' | 'fading'

/** A new tab gets the intro once; reload and Back/Forward visits stay still. */
function isFreshNavigation() {
  const navigation = performance.getEntriesByType('navigation')[0] as
    | PerformanceNavigationTiming
    | undefined
  if (navigation) return navigation.type === 'navigate'

  // Old WebKit fallback. 0 = a fresh navigation, 1 = reload, 2 = history.
  const legacyType = (performance as Performance & { navigation?: { type: number } }).navigation?.type
  return legacyType === undefined || legacyType === 0
}

function canRunEyebrowIntro() {
  if (!isFreshNavigation()) return false
  try {
    return sessionStorage.getItem(EYEBROW_SEEN_KEY) !== '1'
  } catch {
    return true
  }
}

function useTypedEyebrow(text: string, reducedMotion: boolean) {
  const [animateOnce] = useState(() => !reducedMotion && canRunEyebrowIntro())
  const [length, setLength] = useState(() => (animateOnce ? 0 : text.length))
  const [phase, setPhase] = useState<EyebrowPhase>(() => (animateOnce ? 'waiting' : 'static'))

  useEffect(() => {
    if (!animateOnce || reducedMotion) {
      setLength(text.length)
      setPhase('static')
      return
    }

    // Mark it before the first character so a reload during the intro cannot
    // immediately replay the same attention-grabbing motion.
    try {
      sessionStorage.setItem(EYEBROW_SEEN_KEY, '1')
    } catch {
      /* Storage can be disabled; navigation-type detection still protects reloads. */
    }

    let interval = 0
    const start = window.setTimeout(() => {
      setPhase('typing')
      let next = 0
      interval = window.setInterval(() => {
        next += 1
        setLength(Math.min(next, text.length))
        if (next < text.length) return
        window.clearInterval(interval)
        interval = 0
        setPhase('blinking')
      }, TYPE_INTERVAL_MS)
    }, TYPE_DELAY_MS)

    return () => {
      window.clearTimeout(start)
      if (interval) window.clearInterval(interval)
    }
  }, [animateOnce, reducedMotion, text])

  return {
    visibleText: text.slice(0, length),
    phase,
    finishBlinking: () => setPhase('fading'),
  }
}

function useLocalTime() {
  const [time, setTime] = useState('')

  useEffect(() => {
    let format: Intl.DateTimeFormat
    try {
      format = new Intl.DateTimeFormat('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
        timeZone: site.location.timeZone,
      })
    } catch {
      return // no named-timezone support: the pill just omits the time
    }

    const tick = () => setTime(format.format(new Date()).toLowerCase().replace(' ', ''))
    tick()

    // Align the first update to the top of the next minute, then run on the
    // minute. Both timers are cleared — the old version cleared neither.
    let interval: ReturnType<typeof setInterval>
    const now = new Date()
    const timeout = setTimeout(
      () => {
        tick()
        interval = setInterval(tick, 60_000)
      },
      (60 - now.getSeconds()) * 1000 - now.getMilliseconds(),
    )

    return () => {
      clearTimeout(timeout)
      clearInterval(interval)
    }
  }, [])

  return time
}

/** Only changed characters move: the old glyph drops while its replacement
 * rises from below. The reserved glyph keeps every digit column stable. */
function RollingLocalTime({ value }: { value: string }) {
  const [transition, setTransition] = useState(() => ({
    from: value,
    to: value,
    revision: 0,
  }))

  useEffect(() => {
    setTransition((current) =>
      value && value !== current.to
        ? { from: current.to, to: value, revision: current.revision + 1 }
        : current,
    )
  }, [value])

  const length = Math.max(transition.from.length, transition.to.length)
  const from = transition.from.padStart(length, '\u00a0')
  const to = transition.to.padStart(length, '\u00a0')

  return (
    <span className="inline-flex [font-variant-numeric:tabular-nums]" aria-label={value}>
      {Array.from(to).map((character, index) => {
        const previousCharacter = from[index]
        const changed = transition.revision > 0 && previousCharacter !== character

        return (
          <span
            key={`${transition.revision}-${index}`}
            aria-hidden="true"
            className="relative inline-grid h-[1.2em] overflow-hidden leading-[1.2]"
          >
            <span className="invisible col-start-1 row-start-1">{character}</span>
            {changed ? (
              <>
                <span className="time-character-exit absolute inset-0">
                  {previousCharacter}
                </span>
                <span className="time-character-enter absolute inset-0">{character}</span>
              </>
            ) : (
              <span className="absolute inset-0">{character}</span>
            )}
          </span>
        )
      })}
    </span>
  )
}

export default function Hero() {
  const reducedMotion = useReducedMotion()
  const [revealed, setRevealed] = useState(reducedMotion)
  const localTime = useLocalTime()
  const eyebrow = useTypedEyebrow(heroCopy.eyebrow, reducedMotion)
  const [portraitRef, portraitInView] = useInView<HTMLDivElement>({
    rootMargin: '200px 0px',
    once: false,
  })

  useEffect(() => {
    if (reducedMotion) {
      setRevealed(true)
      return
    }
    // Two frames: the first paints the hidden state, the second flips the flag
    // so the transition actually runs. One frame can be batched into the same
    // paint and the elements would simply appear.
    let second = 0
    const first = requestAnimationFrame(() => {
      second = requestAnimationFrame(() => setRevealed(true))
    })
    return () => {
      cancelAnimationFrame(first)
      cancelAnimationFrame(second)
    }
  }, [reducedMotion])

  const reveal = `transition-[opacity,transform] duration-[800ms] ease-smooth motion-reduce:transition-none ${
    revealed ? 'translate-y-0 opacity-100' : 'translate-y-5 opacity-0'
  }`

  const revealStyle = (step: number) => ({
    transitionDelay: reducedMotion ? '0s' : `${REVEAL[step]}s`,
  })

  return (
    <section
      id="hero"
      className="mt-[72px] px-8 pt-20 flex min-h-screen items-center justify-center p-6 min-[601px]:p-12 min-[1025px]:p-[90px]"
    >
      <Container className="grid grid-cols-1 items-center gap-2.5 !p-0 text-center min-[1025px]:grid-cols-[1.1fr_.9fr] min-[1025px]:gap-[60px] min-[1025px]:text-left">
        <div className="flex w-full flex-col justify-center">
          <div
            className={`${reveal} mb-[clamp(1.25rem,0.9904rem+1.1869vw,1.75rem)] flex w-fit items-center gap-[clamp(0.375rem,0.2452rem+0.5935vw,0.625rem)] self-center rounded-[100px] border border-status-edge bg-status-pill px-[clamp(0.75rem,0.6202rem+0.5935vw,1rem)] py-[clamp(0.375rem,0.3101rem+0.2967vw,0.5rem)] text-[clamp(0.72rem,0.6655rem+0.2493vw,0.825rem)] tracking-[0.02em] text-status transition-[background-color,color,border-color] duration-[320ms] ease-smooth [text-wrap:nowrap] min-[1025px]:self-start`}
            style={revealStyle(0)}
            role="status"
            aria-label="Currently open to roles and projects"
          >
            <span
              aria-hidden="true"
              className="h-2 w-2 animate-status-pulse rounded-full bg-[#2ecc71] motion-reduce:animate-none"
            />
            <span>{site.availability.label}</span>
            {localTime && (
              <>
                <span aria-hidden="true">&middot;</span>
                <span className="inline-flex items-center gap-[0.28em]">
                  <RollingLocalTime value={localTime} />
                  <span>in {site.location.city} NG</span>
                </span>
              </>
            )}
          </div>

          <p
            className={`${reveal} mb-5 text-[0.8rem] uppercase tracking-[3px] text-accent max-[370px]:mb-3.5 max-[370px]:text-[0.75rem] max-[370px]:tracking-[2px]`}
            style={revealStyle(1)}
          >
            <span className="sr-only">{heroCopy.eyebrow}</span>
            <span aria-hidden="true" className="relative inline-grid text-left">
              {/* This invisible copy reserves the final width, so typing never
                  shifts the name or portrait while characters are appearing. */}
              <span className="invisible col-start-1 row-start-1">{heroCopy.eyebrow}</span>
              <span className="absolute inset-y-0 left-0 whitespace-nowrap">
                {eyebrow.visibleText}
                {eyebrow.phase !== 'static' && (
                  <span
                    onAnimationEnd={
                      eyebrow.phase === 'blinking' ? eyebrow.finishBlinking : undefined
                    }
                    className={`ml-[2px] inline-block h-[1em] w-[2px] translate-y-[0.12em] bg-accent align-baseline ${
                      eyebrow.phase === 'blinking'
                        ? 'animate-hero-cursor-blink'
                        : eyebrow.phase === 'fading'
                          ? 'opacity-0 transition-opacity duration-[250ms]'
                          : 'opacity-100'
                    }`}
                  />
                )}
              </span>
            </span>
          </p>

          <h1 className="mb-7 text-[clamp(3rem,5vw,4rem)] font-bold leading-[1.05] tracking-[-0.03em] max-[370px]:mb-4 max-[370px]:text-[2.2rem]">
            <span className={`${reveal} block text-primary`} style={revealStyle(2)}>
              {site.name.split(' ')[0]}
            </span>
            <span className={`${reveal} block text-muted`} style={revealStyle(3)}>
              {site.name.split(' ').slice(1).join(' ')}
            </span>
          </h1>

          <p
            className={`${reveal} mx-auto mb-9 max-w-[420px] text-base leading-[1.7] text-muted max-[370px]:mb-6 max-[370px]:text-[0.85rem] max-[370px]:leading-[1.6] min-[1025px]:mx-0 min-[1025px]:mb-10`}
            style={revealStyle(4)}
          >
            {heroCopy.description}
          </p>

          <div
            className={`${reveal} flex flex-wrap justify-center gap-4 min-[1025px]:justify-start`}
            style={revealStyle(5)}
          >
            <a
              href={heroCopy.primaryCta.href}
              onClick={(event) => {
                event.preventDefault()
                scrollToSection('work')
              }}
              className="press lit inline-flex min-h-11 items-center rounded-full bg-accent px-7 py-3 text-[0.85rem] font-semibold text-accent-contrast no-underline transition-[background-color,transform] duration-300 hoverable:hover:-translate-y-0.5 hoverable:hover:bg-accent/90"
            >
              {heroCopy.primaryCta.label}
            </a>
            <a
              href={asset(site.resume)}
              target="_blank"
              rel="noopener noreferrer"
              className="press inline-flex min-h-11 items-center rounded-full border border-accent/40 px-7 py-3 text-[0.85rem] font-semibold text-accent no-underline transition-[transform,background-color,border-color] duration-300 hoverable:hover:border-accent hoverable:hover:bg-accent/12"
            >
              {heroCopy.secondaryCta.label}
            </a>
          </div>
        </div>

        <div className="flex w-full items-center justify-center min-[1025px]:justify-end">
          <Magnet padding={150} strength={3}>
            <div
              ref={portraitRef}
              className="relative mt-10 h-[clamp(280px,88vw,400px)] w-[clamp(220px,70vw,320px)] animate-float overflow-hidden rounded-xl bg-surface shadow-[0_40px_80px_rgba(0,0,0,0.5)] motion-reduce:animate-none min-[1001px]:h-[clamp(330px,40vw,470px)] min-[1001px]:w-[clamp(260px,32vw,380px)] min-[1025px]:mt-0"
              style={{
                animationPlayState: portraitInView && !reducedMotion ? 'running' : 'paused',
                willChange: portraitInView && !reducedMotion ? 'transform' : undefined,
              }}
            >
              <img
                src={asset(heroCopy.portrait.file)}
                srcSet={`${asset('images/my-portfolio-picture-320.webp')} 320w, ${asset('images/my-portfolio-picture-480.webp')} 480w, ${asset(heroCopy.portrait.file)} 600w`}
                sizes="(min-width: 1025px) min(32vw, 380px), min(70vw, 320px)"
                alt={site.name}
                width={heroCopy.portrait.width}
                height={heroCopy.portrait.height}
                loading="eager"
                fetchPriority="high"
                decoding="async"
                className="pointer-events-none h-full w-full object-cover"
              />
            </div>
          </Magnet>
        </div>
      </Container>
    </section>
  )
}
