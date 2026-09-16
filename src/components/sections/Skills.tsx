import { skillGroups } from '../../data/skills'
import { Icon } from '../icons'
import FadeIn from '../ui/FadeIn'
import { Section } from '../ui/Section'
import { SectionHeading } from '../ui/SectionHeading'

export default function Skills() {
  return (
    <Section id="skills" variant="panel">
      <SectionHeading eyebrow="02. Skills" title="What I work with" />

      <div className="grid grid-cols-1 border-y border-edge min-[901px]:grid-cols-3">
        {skillGroups.map((group, i) => (
          <FadeIn key={group.tag} delay={i * 0.1} y={30}>
            <article
              className={`h-full py-8 min-[481px]:px-8 min-[901px]:py-9 ${
                i > 0 ? 'border-t border-edge min-[901px]:border-l min-[901px]:border-t-0' : ''
              }`}
            >
              <div className="mb-7 border-b border-edge pb-6">
                <span
                  className="mb-2.5 inline-block font-mono text-[0.75rem] font-medium uppercase tracking-[0.12em] text-accent"
                >
                  {group.tag}
                </span>
                <h3 className="text-xl font-semibold text-primary">{group.title}</h3>
              </div>

              {/* Each entry is a term and its description, so a definition list is the honest element. */}
              <dl className="flex flex-col gap-1">
                {group.items.map((item, index) => (
                  <div
                    key={item.name}
                    className={`group py-2.5 ${
                      index < group.items.length - 1 ? 'border-b border-edge-faint' : ''
                    }`}
                  >
                    <dt className="mb-0.5 flex items-center gap-2.5 text-[0.9rem] font-medium text-primary">
                      <span className="inline-flex h-6 w-6 shrink-0 items-center justify-center text-accent/75 transition-colors duration-300 hoverable:group-hover:text-accent">
                        <Icon name={item.icon} size={18} strokeWidth={1.7} />
                      </span>
                      {item.name}
                    </dt>
                    <dd className="m-0 ml-[2.125rem] text-xs leading-[1.55] text-muted">{item.note}</dd>
                  </div>
                ))}
              </dl>
            </article>
          </FadeIn>
        ))}
      </div>
    </Section>
  )
}
