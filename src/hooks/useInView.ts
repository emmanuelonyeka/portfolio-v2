import { useEffect, useRef, useState } from 'react'
import { useReducedMotion } from './useReducedMotion'

interface Options {
  /** Grows the trigger box, so the element starts moving slightly before it enters. */
  rootMargin?: string
  /** Stop observing after the first entry — the default for reveal animations. */
  once?: boolean
}

/** Has this element entered the viewport yet? */
export function useInView<T extends Element>({ rootMargin = '50px', once = true }: Options = {}) {
  const ref = useRef<T>(null)
  const [inView, setInView] = useState(false)
  const reducedMotion = useReducedMotion()

  useEffect(() => {
    const el = ref.current
    if (!el) return

    // Reduced motion should not mean "invisible" — show it immediately.
    if (reducedMotion) {
      setInView(true)
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true)
          if (once) observer.disconnect()
        } else if (!once) {
          setInView(false)
        }
      },
      { rootMargin },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [rootMargin, once, reducedMotion])

  return [ref, inView] as const
}
