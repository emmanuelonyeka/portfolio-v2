import { useCallback, useEffect, useRef, useState } from 'react'
import { onScrollFrame } from './useScrolledPast'

/** Frames the scroll must be still before we trust it has landed. */
const SETTLE_FRAMES = 4
/** Ceiling on the settle watch, so a page that never rests cannot mute forever. */
const SETTLE_MAX_FRAMES = 240

/**
 * Which nav section currently sits under the header, or `null` when none does.
 *
 * `null` is the important part: between sections — and at the top of the page —
 * nothing is active, so the pill hides rather than clinging to the last thing
 * the reader passed.
 */
export function useActiveSection(ids: readonly string[]) {
  const [active, setActive] = useState<number | null>(null)
  // Muted while a click-scroll is in flight, or the spy fights it mid-journey.
  const muted = useRef(false)
  const watch = useRef(0)
  const line = useRef(102)

  useEffect(() => {
    const measure = () => {
      const nav =
        parseInt(
          getComputedStyle(document.documentElement).getPropertyValue('--navbar-height'),
          10,
        ) || 78
      line.current = nav + 24
    }

    const check = () => {
      if (muted.current) return

      const doc = document.documentElement
      // At the very bottom the last section can sit entirely above the line —
      // the footer occupies the space beneath it — so nothing would match and
      // the pill would vanish exactly when the reader has arrived. Fall back to
      // the last section that has started.
      const atBottom = window.innerHeight + window.scrollY >= doc.scrollHeight - 2

      let found: number | null = null
      for (let i = 0; i < ids.length; i += 1) {
        const el = document.getElementById(ids[i])
        if (!el) continue
        const rect = el.getBoundingClientRect()
        if (atBottom ? rect.top <= line.current : rect.top <= line.current && rect.bottom > line.current) {
          found = i
        }
      }
      // Same value is a no-op in React, so this does not re-render on scroll.
      setActive(found)
    }

    measure()
    check()
    window.addEventListener('resize', measure)

    // The header's padding shrinks once the page scrolls, so its height — and
    // therefore the detection line — changes at runtime. Measuring only on
    // window resize would leave the line stale for the whole session.
    const header = document.getElementById('navbar')
    const observer = header ? new ResizeObserver(measure) : null
    if (header && observer) observer.observe(header)

    const unsubscribe = onScrollFrame(check)
    return () => {
      window.removeEventListener('resize', measure)
      observer?.disconnect()
      unsubscribe()
      cancelAnimationFrame(watch.current)
    }
  }, [ids])

  /**
   * Light the target immediately, then stay muted until the scroll has actually
   * stopped. A fixed timeout cannot work: smooth-scroll duration scales with
   * distance, so any constant is too short for a long hop and too long for a
   * short one.
   */
  const activate = useCallback((index: number) => {
    setActive(index)
    muted.current = true

    cancelAnimationFrame(watch.current)
    let last = window.scrollY
    let still = 0
    let frames = 0

    const tick = () => {
      frames += 1
      if (Math.abs(window.scrollY - last) < 1) still += 1
      else {
        still = 0
        last = window.scrollY
      }
      if (still >= SETTLE_FRAMES || frames > SETTLE_MAX_FRAMES) {
        muted.current = false
        return
      }
      watch.current = requestAnimationFrame(tick)
    }
    watch.current = requestAnimationFrame(tick)
  }, [])

  return [active, activate] as const
}
