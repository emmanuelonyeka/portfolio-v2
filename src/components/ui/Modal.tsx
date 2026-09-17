import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import type { ReactNode } from 'react'
import { startSmoothScroll, stopSmoothScroll } from '../../lib/smoothScroll'

const FOCUSABLE =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), audio[controls], video[controls], [contenteditable="true"], [tabindex]:not([tabindex="-1"])'

/**
 * How many modals are currently open. The page lock is shared, so it is
 * reference counted — otherwise closing one modal would unlock the page while
 * another is still open.
 */
let openCount = 0
const listeners = new Set<(open: boolean) => void>()

function announce() {
  for (const notify of listeners) notify(openCount > 0)
}

function lockPage() {
  openCount += 1
  announce()
  if (openCount > 1) return
  document.body.classList.add('modal-open')
  stopSmoothScroll()
  const app = document.getElementById('root')
  app?.setAttribute('inert', '')
}

function unlockPage() {
  openCount = Math.max(0, openCount - 1)
  announce()
  if (openCount > 0) return
  document.body.classList.remove('modal-open')
  startSmoothScroll()
  const app = document.getElementById('root')
  app?.removeAttribute('inert')
}

/**
 * True while any dialog is open. Floating page controls subscribe so they do
 * not sit above an active overlay.
 */
export function useDialogOpen(): boolean {
  const [open, setOpen] = useState(openCount > 0)
  useEffect(() => {
    listeners.add(setOpen)
    setOpen(openCount > 0)
    return () => {
      listeners.delete(setOpen)
    }
  }, [])
  return open
}

/** Position and scroll behaviour — never overridden. */
const OVERLAY_GEOMETRY =
  'modal-overlay fixed inset-0 flex items-center justify-center overflow-y-auto'

/** Look and stacking — replaced wholesale by `overlayClassName` when given. */
const OVERLAY_APPEARANCE =
  'z-[99998] bg-black/70 p-[clamp(0.5rem,3vw,2rem)] backdrop-blur-[8px] ' +
  'animate-modal-fade-in [scrollbar-color:var(--accent-border)_transparent] [scrollbar-width:thin]'

interface ModalProps {
  open: boolean
  onClose: () => void
  /** id of the element naming this dialog — required, or screen readers announce nothing. */
  labelledBy: string
  children: ReactNode
  /** Styling for the dialog panel. The overlay is owned here. */
  panelClassName?: string
  /** Some dialogs are deliberately dismiss-on-button-only. */
  closeOnOverlayClick?: boolean
  /** Replaces the overlay's appearance classes. Geometry is always kept. */
  overlayClassName?: string
  /** Temporarily removes a parent dialog from focus and the accessibility tree. */
  suspended?: boolean
}

export function Modal({
  open,
  onClose,
  labelledBy,
  children,
  panelClassName = '',
  closeOnOverlayClick = true,
  overlayClassName,
  suspended = false,
}: ModalProps) {
  const panelRef = useRef<HTMLDivElement>(null)
  const onCloseRef = useRef(onClose)

  useEffect(() => {
    onCloseRef.current = onClose
  }, [onClose])

  useLayoutEffect(() => {
    const panel = panelRef.current
    if (!panel) return
    if (suspended) panel.setAttribute('inert', '')
    else panel.removeAttribute('inert')
    return () => panel.removeAttribute('inert')
  }, [open, suspended])

  useEffect(() => {
    if (!open) return
    const previouslyFocused = document.activeElement as HTMLElement | null

    lockPage()

    return () => {
      unlockPage()
      if (previouslyFocused?.isConnected) previouslyFocused.focus()
    }
  }, [open])

  useEffect(() => {
    if (!open || suspended) return

    const panel = panelRef.current

    // Move focus into the dialog, or assistive tech stays outside it entirely.
    if (panel && !panel.contains(document.activeElement)) {
      const first = panel.querySelector<HTMLElement>(FOCUSABLE)
      ;(first ?? panel).focus()
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        onCloseRef.current()
        return
      }
      if (event.key !== 'Tab' || !panel) return

      const focusable = Array.from(panel.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
        (el) => el.offsetParent !== null,
      )
      if (focusable.length === 0) {
        event.preventDefault()
        return
      }

      const firstEl = focusable[0]
      const lastEl = focusable[focusable.length - 1]
      const active = document.activeElement

      // Tab must cycle inside the dialog, not walk out into the page behind it.
      if (event.shiftKey && (active === firstEl || !panel.contains(active))) {
        event.preventDefault()
        lastEl.focus()
      } else if (!event.shiftKey && active === lastEl) {
        event.preventDefault()
        firstEl.focus()
      }
    }

    document.addEventListener('keydown', onKeyDown)

    return () => {
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [open, suspended])

  if (!open) return null

  return createPortal(
    <div
      data-lenis-prevent
      className={`${OVERLAY_GEOMETRY} motion-reduce:animate-none ${overlayClassName ?? OVERLAY_APPEARANCE}`}
      onClick={
        !suspended && closeOnOverlayClick
          ? (e) => e.target === e.currentTarget && onCloseRef.current()
          : undefined
      }
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal={suspended ? undefined : true}
        aria-labelledby={labelledBy}
        tabIndex={-1}
        className={`relative flex flex-col border border-edge-strong bg-surface outline-none animate-modal-slide-in motion-reduce:animate-none ${panelClassName}`.trim()}
      >
        {children}
      </div>
    </div>,
    document.body,
  )
}
