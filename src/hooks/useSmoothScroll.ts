import { useEffect } from 'react'
import type Lenis from 'lenis'
import { registerSmoothScroll } from '../lib/smoothScroll'
import { useReducedMotion } from './useReducedMotion'

const easeOutExpo = (t: number) => Math.min(1, 1.001 - 2 ** (-10 * t))

/**
 * Solara's gentle wheel damping without its GSAP/pinned-page machinery.
 * Touch remains native, reduced-motion creates no engine, and autoRaf means
 * there is one self-owned animation frame instead of an app-wide render loop.
 */
export function useSmoothScroll() {
  const reducedMotion = useReducedMotion()

  useEffect(() => {
    if (reducedMotion) return

    let cancelled = false
    let lenis: Lenis | null = null
    let unregister: (() => void) | null = null

    // Keep the scroll engine out of the initial JavaScript chunk. Native
    // scrolling works while this small enhancement loads after first paint.
    void import('lenis').then(({ default: LenisController }) => {
      if (cancelled) return
      lenis = new LenisController({
        autoRaf: true,
        duration: 1.15,
        easing: easeOutExpo,
        smoothWheel: true,
        syncTouch: false,
        overscroll: true,
        anchors: false,
      })
      unregister = registerSmoothScroll(lenis)
    })

    return () => {
      cancelled = true
      unregister?.()
      lenis?.destroy()
    }
  }, [reducedMotion])
}
