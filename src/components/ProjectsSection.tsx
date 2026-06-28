const base = import.meta.env.BASE_URL
import { useRef } from 'react'
import { useScroll } from 'framer-motion'
import FadeIn from './FadeIn'
import ProjectCard from './ProjectCard'

const PROJECTS = [
  {
    num: '01',
    cat: 'Client Project',
    name: 'Lumière Fine Dining',
    desc: 'A multi-page luxury restaurant website with reservation, modify and cancel booking flows — all powered by EmailJS.',
    overview: `Lumière Fine Dining is a complete multi-page web presence for a high-end restaurant brand. The project required building an end-to-end reservation experience: a booking form with date/time/party-size selection, a confirmation page with a beautifully designed EmailJS email receipt, and full modify and cancel flows — all without a backend.\n\nThe design system is built around a refined black-and-gold palette with custom typography, smooth page transitions, and a mobile-first layout that maintains its luxury feel across all screen sizes.`,
    highlights: [
      'End-to-end reservation system with confirmation emails',
      'Modify & cancel booking flows with EmailJS integration',
      'Multi-page architecture with consistent design tokens',
      'Black/gold luxury design system, fully responsive',
    ],
    tech: ['HTML', 'CSS', 'JavaScript', 'EmailJS'],
    href: 'https://emmanuelonyeka.github.io/lumiere-restaurant/',
    code: 'https://github.com/emmanuelonyeka/lumiere-restaurant', 
    col2: `${base}images/lumiere.png`,
    desktopImages: [
      `${base}images/lumiere.png`,
      `${base}images/primenest.png`,
      `${base}images/nairasave.png`,
      `${base}images/solara.png`,
      `${base}images/lumiere.png`
    ],
    mobileImages: [
      `${base}images/lumiere.png`,
      `${base}images/primenest.png`,
      `${base}images/nairasave.png`,
      `${base}images/solara.png`,
      `${base}images/lumiere.png`
    ],
    tabColor: '#c9a84c',
    tabBg: 'var(--surface-hover)',
  },
  {
    num: '02',
    cat: 'Client Project',
    name: 'PrimeNest Realty',
    inProgress: true, 
    desc: 'A luxury real estate platform with dynamic listings, mortgage calculator, and parallax scroll effects.',
    overview: `PrimeNest Realty is a high-fidelity, multi-page real estate website built for luxury property marketing. The project focused on creating a browsing experience that feels premium — with parallax hero sections, dynamically filtered property listings, and a mortgage calculator that gives prospective buyers instant payment estimates.\n\nEvery page was carefully crafted to load fast and work flawlessly on all devices, from large property showcase displays to mobile browsers used on-the-go.`,
    highlights: [
      'Dynamic property listings with filter and sort logic',
      'Embedded mortgage calculator with real-time estimates',
      'Parallax hero and scroll reveal animations via ScrollReveal',
      'Fully responsive multi-page layout',
    ],
    tech: ['HTML', 'CSS', 'JavaScript', 'ScrollReveal'],
    href: 'https://emmanuelonyeka.github.io/real-estate/',
    code: 'https://github.com/emmanuelonyeka/real-estate', 
    col2: `${base}images/primenest.png`,
    desktopImages: [
      `${base}images/primenest.png`,
      `${base}images/lumiere.png`,
      `${base}images/nairasave.png`,
      `${base}images/solara.png`,
      `${base}images/primenest.png`
    ],
    mobileImages: [
      `${base}images/primenest.png`,
      `${base}images/lumiere.png`,
      `${base}images/nairasave.png`,
      `${base}images/solara.png`,
      `${base}images/primenest.png`
    ],
    tabColor: '#4f8ef7',
    tabBg: 'var(--surface-hover)',
  },
  {
    num: '03',
    cat: 'Team Project',
    name: 'NairaSave',
    desc: 'A fintech landing page built for the NTTS frontend challenge, featuring a live USD/NGN calculator and savings dashboard.',
    overview: `NairaSave was built as part of the Nigerian Tech Talent Spotlight (NTTS) frontend challenge. Working as the lead developer in a team, I architected the full React + Vite + Tailwind stack, and built two data-driven UI features entirely from scratch without chart libraries: a live USD-to-NGN currency calculator pulling exchange rates, and a custom savings projection bar chart.\n\nThe project was deployed via Netlify with a full Git collaboration workflow managed across the team.`,
    highlights: [
      'Live USD/NGN exchange rate calculator',
      'Custom bar chart savings projection (no external chart library)',
      'Team project with Git collaboration & PR workflow',
      'Deployed on Netlify with CI pipeline',
    ],
    tech: ['React', 'Vite', 'Tailwind', 'Framer Motion'],
    href: '#',
    code: 'https://github.com/emmanuelonyeka/nairasave', 
    col2: `${base}images/nairasave.png`,
    desktopImages: [
      `${base}images/nairasave.png`,
      `${base}images/primenest.png`,
      `${base}images/lumiere.png`,
      `${base}images/solara.png`,
      `${base}images/nairasave.png`
    ],
    mobileImages: [
      `${base}images/nairasave.png`,
      `${base}images/primenest.png`,
      `${base}images/lumiere.png`,
      `${base}images/solara.png`,
      `${base}images/nairasave.png`
    ],
    tabColor: '#4ade80',
    tabBg: 'var(--surface-hover)',
  },
  {
    num: '04',
    cat: 'Personal Project',
    name: 'Solara Jets',
    inProgress: true, 
    desc: 'A premium private aviation booking platform with GSAP timeline animations and ScrollTrigger pinned sections.',
    overview: `Solara Jets is a personal project built to push the boundaries of scroll-driven storytelling on the web. The site features GSAP ScrollTrigger pinned sections where each panel locks into view as the user scrolls, creating a cinematic reveal effect that mirrors how luxury aviation brands present themselves.\n\nThe dark design system uses deep charcoal backgrounds with champagne gold accents, and every interaction — from hover states to page transitions — is animated with precise timing to reinforce the high-net-worth target audience.`,
    highlights: [
      'GSAP ScrollTrigger pinned-section scroll cinematics',
      'Lenis smooth scroll for premium scroll feel',
      'Luxury dark design system with gold accent palette',
      'React + TypeScript architecture with full type safety',
    ],
    tech: ['React', 'TypeScript', 'Tailwind', 'GSAP'],
    href: '#',
    code: 'https://github.com/emmanuelonyeka/solara-jets', 
    col2: `${base}images/solara.png`,
    desktopImages: [
      `${base}images/solara.png`,
      `${base}images/primenest.png`,
      `${base}images/lumiere.png`,
      `${base}images/nairasave.png`,
      `${base}images/solara.png`
    ],
    mobileImages: [
      `${base}images/solara.png`,
      `${base}images/primenest.png`,
      `${base}images/lumiere.png`,
      `${base}images/nairasave.png`,
      `${base}images/solara.png`
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
            overview={project.overview}
            highlights={project.highlights}
            inProgress={project.inProgress ?? false}
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