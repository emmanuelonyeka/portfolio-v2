import React, { useCallback, useEffect, useRef } from 'react'
import { useReducedMotion } from '../../hooks/useReducedMotion'

interface MagnetProps {
  children: React.ReactNode
  padding?: number
  strength?: number
  activeTransition?: string
  inactiveTransition?: string
  className?: string
  style?: React.CSSProperties
}

export default function Magnet({
  children,
  padding = 150,
  strength = 3,
  activeTransition = 'transform 0.3s ease-out',
  inactiveTransition = 'transform 0.6s ease-in-out',
  className,
  style,
}: MagnetProps) {
  const ref = useRef<HTMLDivElement>(null)
  const reducedMotion = useReducedMotion()

  useEffect(() => {
    if (!reducedMotion || !ref.current) return
    ref.current.style.transition = 'none'
    ref.current.style.transform = 'translate3d(0, 0, 0)'
  }, [reducedMotion])

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const el = ref.current
      if (!el || reducedMotion) return
      const rect = el.getBoundingClientRect()
      const cx = rect.left + rect.width / 2
      const cy = rect.top + rect.height / 2
      const dx = e.clientX - cx
      const dy = e.clientY - cy
      const dist = Math.sqrt(dx * dx + dy * dy)
      const threshold = rect.width / 2 + padding
      if (dist < threshold) {
        el.style.transition = activeTransition
        el.style.transform = `translate3d(${dx / strength}px, ${dy / strength}px, 0)`
      }
    },
    [padding, strength, activeTransition, reducedMotion],
  )

  const handleMouseLeave = useCallback(() => {
      const el = ref.current
      if (!el) return
      el.style.transition = reducedMotion ? 'none' : inactiveTransition
      el.style.transform = 'translate3d(0, 0, 0)'
  }, [inactiveTransition, reducedMotion])

  return (
    <div
      ref={ref}
      className={className}
      style={{ willChange: reducedMotion ? undefined : 'transform', ...style }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {children}
    </div>
  )
}
