import { useEffect, useRef } from 'react'
import { useScrollProgress } from '../../hooks/useScrollProgress'
import { projects } from '../../data/projects'
import { scrollToSection } from '../../lib/scrollToSection'
import ProjectCard from '../project/ProjectCard'
import { Container } from '../ui/Container'
import { SectionHeading } from '../ui/SectionHeading'

export default function Projects() {
  const containerRef = useRef<HTMLDivElement>(null)

  const subscribeToProgress = useScrollProgress(containerRef)

  useEffect(() => {
    const url = new URL(window.location.href)
    const slug = url.searchParams.get('case')
    if (!slug) return

    if (!projects.some((project) => project.slug === slug)) {
      url.searchParams.delete('case')
      history.replaceState({}, '', url)
      return
    }

    // A direct case-study link should return to the Work section when its
    // dialog closes. Two frames allow the one-page layout to finish mounting.
    let innerFrame = 0
    const frame = requestAnimationFrame(() => {
      innerFrame = requestAnimationFrame(() => {
        scrollToSection('work', true)
      })
    })
    return () => {
      cancelAnimationFrame(frame)
      if (innerFrame) cancelAnimationFrame(innerFrame)
    }
  }, [])

  return (
    // Not the shared <Section>: the sticky stack needs its own container with no
    // bottom padding, and the heading sits in a narrower gutter than the cards.
    <section id="work" className="max-w-[100vw] pb-0 pt-20 min-[901px]:pt-[120px]">
      <Container>
        <SectionHeading eyebrow="03. Work" title="Selected Work" />
      </Container>

      <div ref={containerRef} className="relative mb-8">
        {projects.map((project, i) => (
          <ProjectCard
            key={project.num}
            index={i}
            total={projects.length}
            onProgress={subscribeToProgress}
            project={project}
          />
        ))}

        {/* Tail room so the last card can finish scaling before the page ends. */}
        <div className="project-stack-tail pointer-events-none" />
      </div>

      <Container className="project-summary">
        <p className="mb-[50px] text-center text-[0.85rem] text-muted">
          Open a Case Study for the decisions, constraints, and lessons behind each build.
        </p>
      </Container>
    </section>
  )
}
