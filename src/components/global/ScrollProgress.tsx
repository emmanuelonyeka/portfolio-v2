import { useEffect, useRef } from 'react'
import { onScrollFrame } from '../../hooks/useScrolledPast'

export default function ScrollProgress() {
  const barRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const bar = barRef.current
    if (!bar) return

    // scrollHeight forces a layout read, so it is cached and only re-measured
    // when the document actually changes size.
    let scrollable = 0
    const measure = () => {
      scrollable = document.documentElement.scrollHeight - window.innerHeight
    }

    const paint = () => {
      const progress = scrollable > 0 ? window.scrollY / scrollable : 0
      // scaleX stays on the compositor; animating `width` relayouts every frame.
      bar.style.transform = `scaleX(${Math.min(1, Math.max(0, progress))})`
    }

    measure()
    paint()
    const observer = new ResizeObserver(() => {
      measure()
      paint()
    })
    observer.observe(document.documentElement)

    const unsubscribe = onScrollFrame(paint)
    return () => {
      observer.disconnect()
      unsubscribe()
    }
  }, [])

  return (
    <div
      ref={barRef}
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-[99997] h-0.5 w-full origin-left scale-x-0 bg-[linear-gradient(90deg,var(--accent)_0%,rgb(var(--accent-rgb)/0.4)_100%)] shadow-[0_0_8px_rgb(var(--accent-rgb)/0.5)]"
    />
  )
}
