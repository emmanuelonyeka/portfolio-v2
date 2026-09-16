import { useEffect, useMemo, useRef, useState } from 'react'
import { marqueeRowTop, marqueeRowBottom } from '../../data/marquee'
import { useReducedMotion } from '../../hooks/useReducedMotion'
import { useSaveData } from '../../hooks/useSaveData'
import { onScrollFrame } from '../../hooks/useScrolledPast'

/** How fast the rows chase the scroll position, and how quickly they catch up. */
const SPEED = 0.3
const LERP = 0.08
/** Below this the rows have effectively arrived, so the loop can stop. */
const SETTLED_PX = 0.1
const ROW_TRAVEL_BUFFER = 900

const clipClass =
  'aspect-[16/10] h-auto w-[clamp(180px,28vw,420px)] shrink-0 ' +
  'rounded-[clamp(8px,1.2vw,16px)] bg-surface object-contain [content-visibility:auto]'

const rowClass = 'flex gap-[clamp(6px,1vw,12px)]'

function rowTarget() {
  const width = window.innerWidth
  const clipWidth = Math.min(420, Math.max(180, width * 0.28))
  return Math.max(4, Math.ceil((width + ROW_TRAVEL_BUFFER) / clipWidth))
}

type MarqueeClip = (typeof marqueeRowTop)[number]
type RenderClip = MarqueeClip & { key: string; animated: boolean }

function repeatToFill(clips: MarqueeClip[], target: number): RenderClip[] {
  if (clips.length === 0) return []
  const copies = Math.max(1, Math.ceil(target / clips.length))
  return Array.from({ length: copies }, (_, copy) =>
    clips.map((clip, index) => ({
      ...clip,
      key: `${clip.src}-${copy}-${index}`,
      // Repeated footage used only to fill the rail is a still image. This
      // avoids running several decoders for the same looping source.
      animated: copy === 0,
    })),
  ).flat()
}

export default function Marquee() {
  const sectionRef = useRef<HTMLElement>(null)
  const topRef = useRef<HTMLDivElement>(null)
  const bottomRef = useRef<HTMLDivElement>(null)
  const clipRefs = useRef<(HTMLVideoElement | null)[]>([])
  const reducedMotion = useReducedMotion()
  const saveData = useSaveData()
  const [clipsPaused, setClipsPaused] = useState(false)
  const [clipsOptIn, setClipsOptIn] = useState(false)
  const [target, setTarget] = useState(rowTarget)
  const topClips = useMemo(() => repeatToFill(marqueeRowTop, target), [target])
  const bottomClips = useMemo(() => repeatToFill(marqueeRowBottom, target), [target])

  useEffect(() => {
    let frame = 0
    const resize = () => {
      if (frame) return
      frame = requestAnimationFrame(() => {
        frame = 0
        const next = rowTarget()
        setTarget((current) => (current === next ? current : next))
      })
    }
    window.addEventListener('resize', resize)
    return () => {
      window.removeEventListener('resize', resize)
      if (frame) cancelAnimationFrame(frame)
    }
  }, [])

  useEffect(() => {
    const section = sectionRef.current
    const top = topRef.current
    const bottom = bottomRef.current
    if (!section || !top || !bottom) return

    let sectionTop = 0
    let current = 0
    let target = 0
    let frame = 0
    let running = false
    let onScreen = false

    const measure = () => {
      sectionTop = section.getBoundingClientRect().top + window.scrollY
    }

    function paint() {
      const delta = target - current
      current += delta * LERP
      const x = current - 200
      // translate3d, not translateX — it keeps the compositor promotion that
      // `will-change` asked for. translateX alone can drop the rows back to
      // main-thread painting.
      top!.style.transform = `translate3d(${x}px, 0, 0)`
      bottom!.style.transform = `translate3d(${-x}px, 0, 0)`

      if (Math.abs(delta) < SETTLED_PX) {
        // Arrived. Stop burning a frame every 16ms until the next scroll.
        running = false
        frame = 0
        return
      }
      frame = requestAnimationFrame(paint)
    }

    function start() {
      if (running || !onScreen || reducedMotion) return
      running = true
      frame = requestAnimationFrame(paint)
    }

    function stop() {
      if (frame) cancelAnimationFrame(frame)
      frame = 0
      running = false
    }

    function retarget() {
      target = (window.scrollY - sectionTop + window.innerHeight) * SPEED
      start()
    }

    measure()
    if (reducedMotion) {
      top.style.transform = 'none'
      bottom.style.transform = 'none'
    } else {
      retarget()
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        onScreen = entry.isIntersecting
        top.style.willChange = onScreen && !reducedMotion ? 'transform' : 'auto'
        bottom.style.willChange = onScreen && !reducedMotion ? 'transform' : 'auto'
        onScreen ? start() : stop()
      },
      { threshold: 0 },
    )
    observer.observe(section)

    const unsubscribe = onScrollFrame(retarget)
    const onResize = () => {
      measure()
      retarget()
    }
    window.addEventListener('resize', onResize)

    return () => {
      unsubscribe()
      window.removeEventListener('resize', onResize)
      observer.disconnect()
      stop()
    }
  }, [reducedMotion])

  useEffect(() => {
    const clips = clipRefs.current.filter((el): el is HTMLVideoElement => el !== null)
    if (clips.length === 0) return

    const visible = new Set<HTMLVideoElement>()

    function sync() {
      const preferencePaused = (reducedMotion || saveData) && !clipsOptIn
      const holdStill = clipsPaused || preferencePaused || document.hidden
      for (const clip of clips) {
        if (visible.has(clip) && !holdStill) {
          // Autoplay can still be refused; a paused first frame is acceptable.
          void clip.play().catch(() => {})
        } else {
          clip.pause()
        }
      }
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const clip = entry.target as HTMLVideoElement
          if (entry.isIntersecting) visible.add(clip)
          else visible.delete(clip)
        }
        sync()
      },
      { threshold: 0 },
    )

    for (const clip of clips) {
      // React does not reliably reflect `muted` as an attribute, and an unmuted
      // clip is refused autoplay outright — so set it on the element directly.
      clip.muted = true
      observer.observe(clip)
    }
    document.addEventListener('visibilitychange', sync)

    return () => {
      observer.disconnect()
      document.removeEventListener('visibilitychange', sync)
    }
  }, [reducedMotion, saveData, clipsPaused, clipsOptIn, target])

  const videoPaused = clipsPaused || ((reducedMotion || saveData) && !clipsOptIn)

  function toggleClips() {
    if ((reducedMotion || saveData) && !clipsOptIn) {
      setClipsOptIn(true)
      setClipsPaused(false)
      return
    }
    setClipsPaused((paused) => !paused)
  }

  const clip = (item: RenderClip, index: number) =>
    item.animated ? (
      <video
        key={item.key}
        ref={(el) => {
          clipRefs.current[index] = el
        }}
        src={item.src}
        poster={item.poster}
        loop
        muted
        playsInline
        preload="none"
        disablePictureInPicture
        className={clipClass}
      />
    ) : (
      <img
        key={item.key}
        src={item.poster}
        alt=""
        width={1600}
        height={1000}
        loading="lazy"
        decoding="async"
        className={clipClass}
      />
    )

  return (
    <section
      ref={sectionRef}
      aria-label="Project preview reel"
      className="relative overflow-hidden pb-10 pt-24 sm:pt-32 md:pt-40"
    >
      <button
        type="button"
        onClick={toggleClips}
        aria-pressed={videoPaused}
        className="press absolute right-5 top-10 z-[2] inline-flex min-h-10 items-center justify-center rounded-full border border-edge-strong bg-surface px-3.5 text-xs font-semibold text-primary transition-[border-color,color] duration-200 hoverable:hover:border-accent/30 hoverable:hover:text-accent min-[701px]:right-8"
      >
        {videoPaused ? 'Play showcase videos' : 'Pause showcase videos'}
      </button>

      {/* Decorative footage is hidden from assistive technology; the control
          above remains available to anyone who can see the motion. */}
      <div aria-hidden="true">
        <div ref={topRef} className={`${rowClass} mb-3`}>
          {topClips.map((item, i) => clip(item, i))}
        </div>
        <div ref={bottomRef} className={rowClass}>
          {bottomClips.map((item, i) => clip(item, topClips.length + i))}
        </div>
      </div>
    </section>
  )
}
