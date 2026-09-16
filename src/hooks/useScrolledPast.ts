import { useEffect, useState } from 'react'

/**
 * ONE window scroll listener for the whole app, rAF-coalesced.
 *
 * Every component that needs a scroll position subscribes here instead of
 * adding its own listener. The listener is attached on the first subscriber and
 * removed after the last one leaves.
 */
const subscribers = new Set<() => void>()
let frame = 0

function flush() {
  frame = 0
  for (const notify of subscribers) notify()
}

function onScroll() {
  if (frame === 0) frame = requestAnimationFrame(flush)
}

export function onScrollFrame(notify: () => void) {
  if (subscribers.size === 0) window.addEventListener('scroll', onScroll, { passive: true })
  subscribers.add(notify)

  return () => {
    subscribers.delete(notify)
    if (subscribers.size > 0) return
    window.removeEventListener('scroll', onScroll)
    if (frame) cancelAnimationFrame(frame)
    frame = 0
  }
}

/**
 * Subscribe to a rAF-coalesced scroll callback. Returns an unsubscribe function.
 * Use this when you need the scroll position itself rather than a threshold.
 */

/** True once the page is scrolled further than `threshold` pixels. */
export function useScrolledPast(threshold: number): boolean {
  const [past, setPast] = useState(() => window.scrollY > threshold)

  useEffect(() => {
    // setState with the same boolean is a no-op in React, so this never
    // re-renders on scroll unless the answer actually flips.
    const check = () => setPast(window.scrollY > threshold)
    check()
    return onScrollFrame(check)
  }, [threshold])

  return past
}
