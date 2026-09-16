import FadeIn from '../ui/FadeIn'

interface SectionHeadingProps {
  /** Numbered label, e.g. "06. Beliefs". */
  eyebrow: string
  title: string
  /** Fades in on first scroll into view. Off for sections that manage their own motion. */
  animate?: boolean
}

export function SectionHeading({ eyebrow, title, animate = true }: SectionHeadingProps) {
  const content = (
    <>
      <span className="mb-3 inline-block font-mono text-[0.8rem] uppercase tracking-[0.12em] text-accent">
        {eyebrow}
      </span>
      <h2 className="gradient-text bg-[image:var(--linear-gradient)] bg-clip-text text-[clamp(1.8rem,4vw,2.8rem)] font-semibold leading-[1.15] tracking-[-0.02em] text-transparent [-webkit-text-fill-color:transparent]">
        {title}
      </h2>
    </>
  )

  const spacing = 'mb-[clamp(2.5rem,5vw,4rem)]'

  return animate ? (
    <FadeIn delay={0} y={30} as="div" className={spacing}>
      {content}
    </FadeIn>
  ) : (
    <div className={spacing}>{content}</div>
  )
}
