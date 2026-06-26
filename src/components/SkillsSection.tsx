import FadeIn from './FadeIn'

const SKILLS = [
  {
    tag: 'Production Stack',
    tagColor: '#4f9cff',
    title: 'What I build with',
    items: [
      { name: 'HTML5', note: 'Semantic, accessible markup' },
      { name: 'CSS3 / Sass', note: 'Custom properties, animations' },
      { name: 'JavaScript (ES6+)', note: 'Vanilla & modern patterns' },
      { name: 'React', note: 'Hooks, context, composition' },
      { name: 'Tailwind CSS', note: 'Utility-first styling' },
      { name: 'Framer Motion', note: 'Scroll & gesture animation' },
      { name: 'GSAP', note: 'Timeline & ScrollTrigger' },
      { name: 'Git & GitHub', note: 'Version control & collaboration' },
      { name: 'Vite', note: 'Build tooling' },
      { name: 'EmailJS', note: 'Client-side email integration' },
    ],
  },
  {
    tag: 'Next Stack',
    tagColor: '#f4c04e',
    title: 'Currently learning',
    items: [
      { name: 'TypeScript', note: 'Type-safe JavaScript' },
      { name: 'Next.js', note: 'SSR, SSG, App Router' },
      { name: 'Node.js', note: 'Server-side JavaScript' },
      { name: 'REST APIs', note: 'Fetching & integrating data' },
      { name: 'Supabase', note: 'Backend as a service' },
    ],
  },
  {
    tag: 'Full Stack',
    tagColor: '#b07cff',
    title: 'Working toward',
    items: [
      { name: 'PostgreSQL', note: 'Relational database' },
      { name: 'Express.js', note: 'Node web framework' },
      { name: 'Docker', note: 'Containerisation' },
      { name: 'CI/CD', note: 'Automated deployment pipelines' },
    ],
  },
]

export default function SkillsSection() {
  return (
    <section className="section skills-section reveal-section" 
    id="skills"
    style={{
        background: 'transparent'
      }}
    >
      <div className="container">

        <FadeIn delay={0} y={30} as="div" className="section-label-wrap">
          <span className="section-eyebrow">02. Skills</span>
          <h2 className="section-title">What I work with</h2>
        </FadeIn>

        <div className="skills-grid">
          {SKILLS.map((col, i) => (
            <FadeIn key={col.tag} delay={i * 0.1} y={30}>
              <div className="skill-column">
                <div className="skill-column-header">
                  <span
                    className="skill-tag-label"
                    style={{ color: col.tagColor }}
                  >
                    {col.tag}
                  </span>
                  <h3>{col.title}</h3>
                </div>
                <ul className="skill-list">
                  {col.items.map(item => (
                    <li key={item.name} className="skill-item">
                      <span className="skill-name">{item.name}</span>
                      <span className="skill-note">{item.note}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </FadeIn>
          ))}
        </div>

      </div>
    </section>
  )
}