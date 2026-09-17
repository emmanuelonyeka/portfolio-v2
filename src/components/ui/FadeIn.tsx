import { createElement } from 'react'
import type { CSSProperties, ReactNode } from 'react'
import { useInView } from '../../hooks/useInView'
import { useReducedMotion } from '../../hooks/useReducedMotion'

interface FadeInProps {
  children: ReactNode
  /** Seconds. */
  delay?: number
  duration?: number
  x?: number
  y?: number
  className?: string
  style?: CSSProperties
  as?: keyof JSX.IntrinsicElements
}

/**
 * Reveal on first scroll into view. Was Framer Motion's `whileInView`; this is
 * an IntersectionObserver and a CSS transition, which is all it ever needed.
 */
export default function FadeIn({
  children,
  delay = 0,
  duration = 0.7,
  x = 0,
  y = 30,
  className,
  style,
  as = 'div',
}: FadeInProps) {
  const [ref, inView] = useInView<HTMLElement>({ rootMargin: '50px', once: true })
  const reducedMotion = useReducedMotion()
  const visible = inView || reducedMotion

  // createElement keeps the dynamic tag out of JSX, where TypeScript cannot
  // narrow `keyof JSX.IntrinsicElements` to a single element's prop type.
  return createElement(
    as,
    {
      ref,
      className,
      style: {
        ...style,
        opacity: visible ? 1 : 0,
        transform: visible ? 'none' : `translate(${x}px, ${y}px)`,
        transitionProperty: 'opacity, transform',
        transitionDuration: reducedMotion ? '0s' : `${duration}s`,
        transitionDelay: reducedMotion ? '0s' : `${delay}s`,
        transitionTimingFunction: 'cubic-bezier(0.25, 0.1, 0.25, 1)',
        willChange: visible ? undefined : 'opacity, transform',
      } as CSSProperties,
    },
    children,
  )
}
