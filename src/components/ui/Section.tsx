import type { ReactNode } from 'react'
import { Container } from './Container'

/**
 * `panel` is the tinted, hairline-bounded band shared by Skills,
 * Services and Packages. It was five identical inline style objects.
 */
const VARIANTS = {
  plain: '',
  panel: 'border-y border-edge bg-edge-faint',
} as const

interface SectionProps {
  id: string
  children: ReactNode
  variant?: keyof typeof VARIANTS
  className?: string
  containerClassName?: string
}

/** The shared section rhythm: 80px of vertical padding, opening to 120px above 900px. */
export function Section({
  id,
  children,
  variant = 'plain',
  className = '',
  containerClassName = '',
}: SectionProps) {
  return (
    <section
      id={id}
      className={`max-w-[100vw] py-20 min-[901px]:py-[120px] ${VARIANTS[variant]} ${className}`.trim()}
    >
      <Container className={containerClassName}>{children}</Container>
    </section>
  )
}
