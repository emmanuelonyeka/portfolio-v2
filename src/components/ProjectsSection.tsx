import { useRef } from 'react'
import { useScroll } from 'framer-motion'
import FadeIn from './FadeIn'
import ProjectCard from './ProjectCard'

const PROJECTS = [
  {
    num: '01',
    cat: 'Client Project',
    name: 'PrimeNest Realty',
    desc: 'A luxury real estate platform with dynamic property listings, mortgage calculator, parallax effects, and a fully responsive multi-page layout built for high-end property marketing.',
    tech: ['HTML', 'CSS', 'JavaScript', 'ScrollReveal'],
    href: 'https://emmanuelonyeka.github.io/real-estate/',
    code: 'https://github.com/emmanuelonyeka/real-estate', 
    col2: '/images/primenest.png',
    desktopImages: [
      '/images/primenest.png',
      '/images/lumiere.png',
      '/images/nairasave.png',
      '/images/solara.png',
      '/images/primenest.png'
    ],
    mobileImages: [
      '/images/primenest.png',
      '/images/lumiere.png',
      '/images/nairasave.png',
      '/images/solara.png',
      '/images/primenest.png'
    ],
    tabColor: '#4f8ef7',
    tabBg: 'var(--surface-hover)',
  },
  {
    num: '02',
    cat: 'Client Project',
    name: 'Lumière Fine Dining',
    desc: 'A multi-page luxury restaurant website with a complete reservation system, email confirmation flows, modify and cancel booking support — all powered by EmailJS and a refined black/gold design system.',
    tech: ['HTML', 'CSS', 'JavaScript', 'EmailJS'],
    href: 'https://emmanuelonyeka.github.io/lumiere-restaurant/',
    code: 'https://github.com/emmanuelonyeka/lumiere-restaurant', 
    col2: '/images/lumiere.png',
    desktopImages: [
      '/images/lumiere.png',
      '/images/primenest.png',
      '/images/nairasave.png',
      '/images/solara.png',
      '/images/lumiere.png'
    ],
    mobileImages: [
      '/images/lumiere.png',
      '/images/primenest.png',
      '/images/nairasave.png',
      '/images/solara.png',
      '/images/lumiere.png'
    ],
    tabColor: '#c9a84c',
    tabBg: 'var(--surface-hover)',
  },
  {
    num: '03',
    cat: 'Team Project',
    name: 'NairaSave',
    desc: 'A fintech landing page built for the Nigerian Tech Talent Spotlight challenge — featuring a live USD/NGN exchange calculator, savings projection dashboard, and full Git/GitHub/Netlify workflow.',
    tech: ['React', 'Vite', 'Tailwind', 'Framer Motion'],
    href: '#',
    code: 'https://github.com/emmanuelonyeka/nairasave', 
    col2: '/images/nairasave.png',
    desktopImages: [
      '/images/nairasave.png',
      '/images/primenest.png',
      '/images/lumiere.png',
      '/images/solara.png',
      '/images/nairasave.png'
    ],
    mobileImages: [
      '/images/nairasave.png',
      '/images/primenest.png',
      '/images/lumiere.png',
      '/images/solara.png',
      '/images/nairasave.png'
    ],
    tabColor: '#4ade80',
    tabBg: 'var(--surface-hover)',
  },
  {
    num: '04',
    cat: 'Personal Project',
    name: 'Solara Jets',
    desc: 'A premium luxury aviation booking platform with complex ScrollTrigger pinned-section scroll behavior, GSAP timeline animations, and a refined dark design system built for high-net-worth clientele.',
    tech: ['React', 'TypeScript', 'Tailwind', 'GSAP'],
    href: '#',
    code: 'https://github.com/emmanuelonyeka/solara-jets', 
    col2: '/images/solara.png',
    desktopImages: [
      '/images/solara.png',
      '/images/primenest.png',
      '/images/lumiere.png',
      '/images/nairasave.png',
      '/images/solara.png'
    ],
    mobileImages: [
      '/images/solara.png',
      '/images/primenest.png',
      '/images/lumiere.png',
      '/images/nairasave.png',
      '/images/solara.png'
    ],
    tabColor: '#d97706',
    tabBg: 'var(--surface-hover)',
  },
]

export default function ProjectsSection() {
  const containerRef = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  })

  return (
    <section
      id="work"
      className="section"
      style={{ background: 'transparent', paddingBottom: 0 }}
    >
      <div className="container">
        <FadeIn delay={0} y={30} as="div" className="section-label-wrap">
          <span className="section-eyebrow">02. Work</span>
          <h2 className="section-title">Selected Work</h2>
        </FadeIn>
      </div>

      <div
        ref={containerRef}
        style={{
          position: 'relative',
          marginBottom: '2rem',
        }}
      >
        {PROJECTS.map((project, i) => (
          <ProjectCard
            key={project.num}
            index={i}
            total={PROJECTS.length}
            scrollYProgress={scrollYProgress}
            num={project.num}
            cat={project.cat}
            name={project.name}
            desc={project.desc}
            tech={project.tech}
            href={project.href}
            code={project.code}
            col2={project.col2}
            desktopImages={project.desktopImages}
            mobileImages={project.mobileImages}
            tabColor={project.tabColor}
            tabBg={project.tabBg}
          />
        ))}

        <div style={{ height: '60vh', pointerEvents: 'none' }} />
      </div>

      {/* Editorial layout source code note */}
      <div className="container">
        <p className="project-source-note">
          <span>*</span> Source code for each project is available inside its Case Study.
        </p>
      </div>
    </section>
  )
}