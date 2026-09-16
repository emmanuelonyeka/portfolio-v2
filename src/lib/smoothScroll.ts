import type Lenis from 'lenis'

let activeLenis: Lenis | null = null

/** Registered by useSmoothScroll so navigation/restoration share one engine. */
export function registerSmoothScroll(instance: Lenis) {
  activeLenis = instance
  if (document.body.classList.contains('modal-open')) instance.stop()

  return () => {
    if (activeLenis === instance) activeLenis = null
  }
}

export function stopSmoothScroll() {
  activeLenis?.stop()
}

export function startSmoothScroll() {
  activeLenis?.start()
}

/**
 * One route for nav links, Back-to-top and reload restoration. `force` lets an
 * immediate restoration update Lenis even while a dialog has paused the page.
 */
export function scrollPageTo(top: number, immediate = false) {
  const max = Math.max(0, document.documentElement.scrollHeight - window.innerHeight)
  const target = Math.max(0, Math.min(top, max))

  if (activeLenis) {
    activeLenis.scrollTo(target, { immediate, force: true })
    return
  }

  window.scrollTo({ top: target, behavior: immediate ? 'auto' : 'smooth' })
}
