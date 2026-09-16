import { beliefs, beliefsQuote } from '../../data/beliefs'
import FadeIn from '../ui/FadeIn'
import { Section } from '../ui/Section'
import { SectionHeading } from '../ui/SectionHeading'

export default function Beliefs() {
  return (
    <Section id="beliefs">
      <SectionHeading eyebrow="04. Beliefs" title="How I think" />

      <div className="grid items-start gap-14 min-[825px]:grid-cols-[minmax(240px,0.85fr)_minmax(0,1.35fr)] min-[825px]:gap-[clamp(3rem,7vw,8rem)]">
        <FadeIn
          delay={0.1}
          y={20}
          className="relative max-w-[520px] min-[825px]:sticky min-[825px]:top-[120px] min-[825px]:max-w-none"
        >
          <figure className="m-0 border-l border-accent/60 pl-[clamp(1.4rem,3vw,2.25rem)]">
            <figcaption className="mb-6 flex items-center gap-3 font-mono text-[0.72rem] font-semibold uppercase tracking-[0.14em] text-accent">
              <span aria-hidden="true" className="h-2 w-2 rounded-[2px] border border-accent bg-accent/15" />
              Working principle
            </figcaption>
            <blockquote className="m-0 text-[clamp(1.15rem,2vw,1.55rem)] font-medium leading-[1.55] tracking-[-0.025em] text-primary">
              {beliefsQuote}
            </blockquote>
            <div className="mt-8 flex items-center gap-3 text-[0.75rem] uppercase tracking-[0.12em] text-muted">
              <span className="font-mono text-accent">I—IV</span>
              <span aria-hidden="true" className="h-px w-10 bg-edge-strong" />
              <span>Operating principles</span>
            </div>
          </figure>
        </FadeIn>

        <ol className="m-0 list-none border-y border-edge p-0">
          {beliefs.map((belief, i) => (
            <FadeIn key={belief.num} delay={0.05 * i} y={16} as="li" className="border-b border-edge last:border-b-0">
              <article className="group relative grid grid-cols-[2.75rem_1fr] gap-4 overflow-hidden py-[clamp(1.35rem,2.8vw,2rem)] min-[601px]:grid-cols-[3.25rem_1fr] min-[601px]:gap-6">
                <span className="pt-0.5 font-mono text-[0.75rem] font-bold tracking-[0.1em] text-accent">
                  {belief.num}
                </span>
                <div className="flex-1">
                  <h3 className="mb-2 text-[clamp(1rem,1.6vw,1.2rem)] font-bold leading-[1.2] tracking-[-0.02em] text-primary">
                    {belief.title}
                  </h3>
                  <p className="text-[0.9rem] leading-[1.75] text-muted">{belief.desc}</p>
                </div>
                <span aria-hidden="true" className="absolute bottom-0 left-0 h-px w-12 origin-left bg-accent transition-transform duration-300 hoverable:group-hover:scale-x-[2.5]" />
              </article>
            </FadeIn>
          ))}
        </ol>
      </div>
    </Section>
  )
}
