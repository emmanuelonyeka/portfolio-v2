import type { ReactNode } from 'react'
import { Container } from './Container'
import FadeIn from './FadeIn'

interface DividerProps {
  eyebrow: string
  title: string
  sub: string
  children?: ReactNode
}

/**
 * The gear change between the two halves of the page. Everything above it is
 * aimed at someone assessing the work; everything below is aimed at someone
 * commissioning it. Naming the shift is what lets each reader skip the half
 * that isn't theirs instead of wading through it.
 */
export function Divider({ eyebrow, title, sub, children }: DividerProps) {
  return (
    <div className="border-y border-edge bg-edge-faint py-[clamp(3rem,7vw,5.5rem)]">
      <Container>
        <FadeIn y={24}>
          <div className="mx-auto flex max-w-[680px] flex-col items-center text-center">
            <span className="mb-4 inline-flex items-center gap-2.5 rounded-full border border-accent/25 bg-accent/8 px-3.5 py-1.5 font-mono text-[0.75rem] uppercase tracking-[0.14em] text-accent">
              <span aria-hidden="true" className="h-1 w-1 rounded-full bg-accent" />
              {eyebrow}
            </span>
            <h2 className="text-[clamp(1.6rem,3.5vw,2.4rem)] font-semibold leading-[1.2] tracking-[-0.02em] text-primary">
              {title}
            </h2>
            <p className="mt-4 max-w-[520px] text-[clamp(0.9rem,1.5vw,1rem)] leading-[1.75] text-muted">
              {sub}
            </p>
            {children}
          </div>
        </FadeIn>
      </Container>
    </div>
  )
}
