import { useEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { Icon } from '../icons'

interface FormFieldProps {
  /** Must match the control's `id`. The error region becomes `${id}-error`. */
  id: string
  label: string
  required?: boolean
  error?: string
  /**
   * Bumped by the parent ONLY when this field fails a submit. It is the sole
   * shake trigger — `error` must stay out of the effect below, because its text
   * changes as the user types ("Email is required" -> "Please enter a valid
   * email address") and that would replay the animation on every keystroke.
   */
  shake: number
  children: ReactNode
}

export function FormField({ id, label, required, error, shake, children }: FormFieldProps) {
  const fieldRef = useRef<HTMLDivElement>(null)
  // The message is held after `error` clears so it can fade out instead of vanishing.
  const [held, setHeld] = useState(error)

  useEffect(() => {
    if (error) setHeld(error)
  }, [error])

  useEffect(() => {
    if (shake === 0) return
    const el = fieldRef.current
    if (!el) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    // A CSS class plays an animation once. A second failed submit on the same
    // field would then do nothing — which is exactly when the prompt matters.
    // The Web Animations API replays on demand, so this is driven by `attempt`.
    el.animate(
      [
        { transform: 'translateX(0)' },
        { transform: 'translateX(-7px)' },
        { transform: 'translateX(6px)' },
        { transform: 'translateX(-4px)' },
        { transform: 'translateX(3px)' },
        { transform: 'translateX(0)' },
      ],
      { duration: 420, easing: 'cubic-bezier(.36,.07,.19,.97)' },
    )
  }, [shake])

  return (
    <div ref={fieldRef} className="relative flex flex-col gap-2">
      <label htmlFor={id} className="text-[0.825rem] font-medium tracking-[0.02em] text-primary">
        {label} {required && <span className="text-accent">*</span>}
      </label>

      {children}

      <div
        id={`${id}-error`}
        role="alert"
        className={`flex items-center gap-1.5 overflow-hidden text-[0.75rem] text-danger transition-[max-height,opacity,margin-top] duration-300 ease-smooth ${
          error ? 'mt-1 max-h-12 opacity-100' : 'mt-0 max-h-0 opacity-0'
        }`}
      >
        <Icon name="alertCircle" size={12} strokeWidth={2.5} className="shrink-0" />
        {held}
      </div>
    </div>
  )
}
