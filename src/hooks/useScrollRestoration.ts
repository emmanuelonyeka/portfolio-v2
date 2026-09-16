import { useEffect } from 'react'
import { onScrollFrame } from './useScrolledPast'
import { scrollPageTo } from '../lib/smoothScroll'

const KEY = 'emmanuel:scroll'
/** How often the position is written while scrolling. */
const SAVE_EVERY_MS = 250
/** Frames the position must hold before we accept that the document has settled. */
const STABLE_FRAMES = 8
/** Hard stop, so a page that never settles cannot trap the reader. */
const DEADLINE_MS = 2500
/** Frames to ignore input for, so the first assert always lands. */
const GRACE_FRAMES = 2

const read = () => {
  try {
    return sessionStorage.getItem(KEY)
  } catch {
    return null
  }
}

/** Reload and browser-history visits should restore; a genuinely new visit should not. */
function isHistoryNavigation() {
  const navigation = performance.getEntriesByType('navigation')[0] as
    | PerformanceNavigationTiming
    | undefined
  if (navigation) return navigation.type === 'reload' || navigation.type === 'back_forward'

  // Old WebKit fallback. 1 = reload, 2 = back/forward.
  const legacyType = (performance as Performance & { navigation?: { type: number } }).navigation?.type
  return legacyType === 1 || legacyType === 2
}

/**
 * Restores the reader's exact position across a reload.
 *
 * The browser's own restoration cannot work here. It fires while the document
 * is a fraction of its final height — React has not mounted, the portrait and
 * project videos have not loaded, and the sticky card stack has not laid out —
 * so the browser clamps the restore to whatever scrollHeight exists at that
 * instant and lands somewhere else entirely. That clamping is why the old
 * behaviour was inconsistent rather than simply wrong.
 *
 * So we take it over: save the position ourselves, then RE-ASSERT it every
 * frame until it holds, because the document keeps growing underneath us.
 */
export function useScrollRestoration() {
  useEffect(() => {
    let lastSave = 0
    const save = () => {
      const now = Date.now()
      if (now - lastSave < SAVE_EVERY_MS) return
      lastSave = now
      try {
        sessionStorage.setItem(KEY, String(Math.round(window.scrollY)))
      } catch {
        /* storage disabled — restoration is a nicety, not a requirement */
      }
    }

    const saveNow = () => {
      lastSave = 0
      save()
    }

    const saveWhenHidden = () => {
      if (document.visibilityState === 'hidden') saveNow()
    }

    // Reuses the one shared scroll listener rather than adding another.
    const unsubscribe = onScrollFrame(save)
    // pagehide is far more reliable than beforeunload on mobile Safari.
    window.addEventListener('pagehide', saveNow)
    document.addEventListener('visibilitychange', saveWhenHidden)

    const lift = () => document.documentElement.classList.remove('restoring')

    const raw = read()
    const target = raw ? Number.parseInt(raw, 10) : NaN
    const shouldRestore = isHistoryNavigation()

    // On a real reload, the saved position — including the very top at 0 —
    // outranks a stale hash such as #work. On a new visit, normal hash
    // navigation is left untouched.
    if (!shouldRestore || !Number.isFinite(target) || target < 0) {
      lift()
      return () => {
        unsubscribe()
        window.removeEventListener('pagehide', saveNow)
        document.removeEventListener('visibilitychange', saveWhenHidden)
      }
    }

    let frame = 0
    let held = 0
    let asserts = 0
    let finished = false
    const deadline = Date.now() + DEADLINE_MS

    function finish() {
      if (finished) return
      finished = true
      if (frame) cancelAnimationFrame(frame)
      frame = 0
      // Lifting here — not at the end of `step` — is what guarantees the page is
      // revealed on settle, on timeout, on user input AND on unmount.
      lift()
      for (const type of ['wheel', 'touchstart', 'keydown'] as const) {
        window.removeEventListener(type, onInput)
      }
    }

    function onInput() {
      // Ignore the first couple of frames, or a stray event aborts before the
      // initial assert has even been issued.
      if (asserts > GRACE_FRAMES) finish()
    }

    function step() {
      if (finished) return
      asserts += 1

      const max = document.documentElement.scrollHeight - window.innerHeight
      const reachable = Math.min(target, Math.max(0, max))

      if (Math.abs(window.scrollY - reachable) > 1) {
        scrollPageTo(reachable, true)
        // Only count as settled once we are AT the real target, not merely at
        // the furthest the document currently allows.
        held = reachable === target ? held : 0
      } else if (reachable === target) {
        held += 1
      } else {
        held = 0
      }

      if (held >= STABLE_FRAMES || Date.now() > deadline) {
        finish()
        return
      }
      frame = requestAnimationFrame(step)
    }

    for (const type of ['wheel', 'touchstart', 'keydown'] as const) {
      window.addEventListener(type, onInput, { passive: true })
    }
    frame = requestAnimationFrame(step)

    return () => {
      finish()
      unsubscribe()
      window.removeEventListener('pagehide', saveNow)
      document.removeEventListener('visibilitychange', saveWhenHidden)
    }
  }, [])
}
