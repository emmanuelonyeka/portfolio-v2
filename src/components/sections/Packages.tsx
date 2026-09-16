import { packages, packagesNote, packagesHelp } from '../../data/packages'
import { whatsappLink } from '../../lib/whatsapp'
import { Icon } from '../icons'
import FadeIn from '../ui/FadeIn'
import { Section } from '../ui/Section'
import { SectionHeading } from '../ui/SectionHeading'

export default function Packages() {
  return (
    <Section id="packages" variant="panel">
      <SectionHeading eyebrow="07. Packages" title="Choose your package" />

      <div className="mx-auto grid max-w-[400px] grid-cols-1 items-start gap-5 min-[901px]:max-w-none min-[901px]:grid-cols-3">
        {packages.map((plan, i) => (
          <FadeIn key={plan.tier} delay={i * 0.1} y={30}>
            <div
              className={[
                'relative flex flex-col gap-8 rounded-2xl border px-8 py-9',
                'transition-[border-color,transform] duration-300 hoverable:hover:-translate-y-1',
                plan.highlight
                  ? 'border-accent/25 bg-accent/4 hoverable:hover:border-accent/50'
                  : 'border-edge bg-edge-faint hoverable:hover:border-edge-strong',
              ].join(' ')}
            >
              {plan.highlight && (
                <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-accent px-3.5 py-1 text-[0.75rem] font-semibold uppercase tracking-[0.08em] text-accent-contrast">
                  Most Popular
                </span>
              )}

              <div className="flex flex-col gap-2">
                <h3 className="text-[1.1rem] font-bold tracking-[-0.01em] text-primary">
                  {plan.tier}
                </h3>
                <p className="text-[0.78rem] text-muted">{plan.tag}</p>
                <p className="mt-1 text-[1.5rem] font-bold tracking-[-0.02em] text-primary">
                  {plan.price}
                </p>
                <div className="mb-5 rounded-full border border-accent/25 bg-accent/8 px-3.5 py-1.5 text-[0.78rem] font-semibold uppercase tracking-[0.08em] text-accent">
                  {plan.scopeBadge}
                </div>
              </div>

              <ul className="flex flex-1 list-none flex-col gap-3 p-0">
                {plan.features.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-start gap-2.5 text-sm leading-[1.5] text-secondary"
                  >
                    <Icon
                      name="check"
                      size={14}
                      strokeWidth={2.5}
                      className="mt-0.5 shrink-0 text-accent"
                    />
                    {feature}
                  </li>
                ))}
              </ul>

              <a
                href={whatsappLink(plan.whatsappMessage)}
                target="_blank"
                rel="noopener noreferrer"
                className={[
                  'inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border px-6 py-2.5',
                  'text-sm font-semibold no-underline',
                  'transition-[border-color,color,background-color,transform] duration-300',
                  'hoverable:hover:translate-x-1',
                  plan.highlight
                    ? 'border-accent bg-accent text-accent-contrast hoverable:hover:border-transparent hoverable:hover:bg-accent/90'
                    : 'border-edge-strong text-primary hoverable:hover:border-accent/25 hoverable:hover:text-accent',
                ].join(' ')}
              >
                {plan.cta}
                <Icon name="arrowRight" size={14} />
              </a>
            </div>
          </FadeIn>
        ))}
      </div>

      <FadeIn delay={0.4} y={20} as="p" className="mt-10 text-center text-[0.85rem] leading-[1.6] text-muted">
        {packagesNote} {packagesHelp.prompt}{' '}
        <a
          href={whatsappLink(packagesHelp.whatsappMessage)}
          target="_blank"
          rel="noopener noreferrer"
          className="whitespace-nowrap border-b border-accent/25 text-accent no-underline transition-colors duration-200 hoverable:hover:border-accent"
        >
          {packagesHelp.linkLabel}
        </a>
      </FadeIn>
    </Section>
  )
}
