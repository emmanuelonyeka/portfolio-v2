import { services } from '../../data/services'
import { Icon } from '../icons'
import FadeIn from '../ui/FadeIn'
import { Section } from '../ui/Section'
import { SectionHeading } from '../ui/SectionHeading'

const romanNumerals = ['I', 'II', 'III', 'IV', 'V', 'VI'] as const

export default function Services() {
  return (
    <Section id="services" variant="panel">
      <SectionHeading eyebrow="05. Services" title="What I offer" />

      <div className="grid items-start gap-12 min-[901px]:grid-cols-[minmax(220px,0.7fr)_minmax(0,1.55fr)] min-[901px]:gap-[clamp(3rem,7vw,8rem)]">
        <FadeIn y={18} as="aside" className="min-[901px]:sticky min-[901px]:top-[120px]">
          <span className="mb-5 block font-mono text-[0.72rem] uppercase tracking-[0.16em] text-accent">
            Capability map / I—VI
          </span>
          <p className="max-w-[430px] text-[clamp(1.15rem,2.1vw,1.65rem)] font-medium leading-[1.45] tracking-[-0.02em] text-primary">
            One connected frontend practice, from interface build to production handover.
          </p>
          <p className="mt-5 max-w-[390px] text-[0.9rem] leading-[1.75] text-muted">
            The visual layer, interaction logic, performance, and maintainability are treated as one delivery—not separate afterthoughts.
          </p>
        </FadeIn>

        <ol className="m-0 list-none border-y border-edge p-0">
          {services.map((service, i) => (
            <FadeIn key={service.name} delay={i * 0.055} y={14} as="li" className="border-b border-edge last:border-b-0">
              <article className="group grid grid-cols-[2.5rem_minmax(0,1fr)_2.75rem] items-start gap-x-4 py-[clamp(1.4rem,3vw,2rem)] min-[701px]:grid-cols-[2.75rem_minmax(150px,0.75fr)_minmax(220px,1.2fr)_2.75rem] min-[701px]:items-center min-[701px]:gap-x-6">
                <span className="pt-0.5 font-mono text-[0.72rem] font-semibold tracking-[0.12em] text-accent">
                  {romanNumerals[i]}
                </span>
                <h3 className="text-[clamp(1rem,1.7vw,1.25rem)] font-semibold leading-[1.3] tracking-[-0.02em] text-primary transition-colors duration-300 hoverable:group-hover:text-accent">
                  {service.name}
                </h3>
                <p className="col-start-2 mt-2 text-[0.88rem] leading-[1.7] text-muted min-[701px]:col-start-3 min-[701px]:mt-0">
                  {service.desc}
                </p>
                <span className="col-start-3 row-start-1 flex h-11 w-11 items-center justify-center rounded-full border border-edge-strong text-muted transition-[border-color,color,transform] duration-300 min-[701px]:col-start-4 hoverable:group-hover:rotate-[-6deg] hoverable:group-hover:border-accent/40 hoverable:group-hover:text-accent">
                  <Icon name={service.icon} size={18} strokeWidth={1.6} />
                </span>
              </article>
            </FadeIn>
          ))}
        </ol>
      </div>
    </Section>
  )
}
