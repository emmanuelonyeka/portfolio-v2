import { useCallback, useEffect, useRef } from 'react'
import { onScrollFrame } from './useScrolledPast'

type Subscriber = (progress: number) => void

/**
 * How far the page has scrolled through an element, 0 at its top reaching the
 * top of the viewport and 1 at its bottom reaching the bottom.
 *
 * Subscribers are called directly rather than through state — this is the point
 * of the hook. A scroll-linked transform must not re-render React 60 times a
 * second; the callback writes to the DOM itself.
 */
export function useScrollProgress(ref: React.RefObject<HTMLElement>) {
  const subscribers = useRef(new Set<Subscriber>())
  const bounds = useRef({ top: 0, scrollable: 0 })
  const stopScroll = useRef<(() => void) | null>(null)

  const emit = useCallback(() => {
    const { top, scrollable } = bounds.current
    const raw = scrollable > 0 ? (window.scrollY - top) / scrollable : 0
    const progress = Math.min(1, Math.max(0, raw))
    for (const notify of subscribers.current) notify(progress)
  }, [])

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const measure = () => {
      const rect = el.getBoundingClientRect()
      bounds.current = {
        top: rect.top + window.scrollY,
        scrollable: rect.height - window.innerHeight,
      }
    }

    const remeasure = () => {
      measure()
      emit()
    }

    remeasure()

    const observer = new ResizeObserver(remeasure)
    observer.observe(el)
    window.addEventListener('resize', remeasure)

    return () => {
      observer.disconnect()
      window.removeEventListener('resize', remeasure)
      stopScroll.current?.()
      stopScroll.current = null
    }
  }, [emit, ref])

  return useCallback(
    (notify: Subscriber) => {
      subscribers.current.add(notify)
      if (subscribers.current.size === 1) stopScroll.current = onScrollFrame(emit)
      emit()

      return () => {
        subscribers.current.delete(notify)
        if (subscribers.current.size > 0) return
        stopScroll.current?.()
        stopScroll.current = null
      }
    },
    [emit],
  )
}

/** Maps a 0..1 input through matching stop/value arrays, exactly as useTransform did. */
export function piecewise(t: number, stops: number[], values: number[]): number {
  if (t <= stops[0]) return values[0]
  const last = stops.length - 1
  if (t >= stops[last]) return values[last]
  for (let i = 0; i < last; i += 1) {
    if (t < stops[i] || t > stops[i + 1]) continue
    const span = stops[i + 1] - stops[i]
    const ratio = span === 0 ? 0 : (t - stops[i]) / span
    return values[i] + (values[i + 1] - values[i]) * ratio
  }
  return values[last]
}
