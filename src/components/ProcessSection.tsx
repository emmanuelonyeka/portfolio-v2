import { useEffect, useState, useRef } from 'react'

const STEPS = [
  {
    num: '01',
    title: 'Discovery',
    desc: 'We start with a conversation. I learn about your business, goals, target audience, and what success looks like for you. No assumptions — just clarity before a single line of code is written.',
  },
  {
    num: '02',
    title: 'Design Direction',
    desc: 'I establish the visual language — typography, color, spacing, and layout. You see the direction before build begins so we are aligned on the feel and function of what we are creating.',
  },
  {
    num: '03',
    title: 'Build',
    desc: 'Clean, structured code. Every component is built with performance, responsiveness, and maintainability in mind. I keep you updated at key milestones so there are no surprises.',
  },
  {
    num: '04',
    title: 'Launch & Handover',
    desc: 'We test across devices and browsers, then deploy. You receive clean, documented code and a smooth handover. I remain available for questions and iterations after launch.',
  },
]

export default function ProcessSection() {
  const [activeSteps, setActiveSteps] = useState<Record<string, boolean>>({})
  const stepsRef = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    const handleScroll = () => {
      const viewportCenter = window.innerHeight / 2
      const rangeOffset = window.innerHeight * 0.3 // 30vh up and down boundaries
      const rangeMin = viewportCenter - rangeOffset
      const rangeMax = viewportCenter + rangeOffset

      const newActive: Record<string, boolean> = {}

      stepsRef.current.forEach((el, index) => {
        if (!el) return
        const rect = el.getBoundingClientRect()
        const elementCenter = rect.top + rect.height / 2
        
        // Element's center must sit inside the active viewport 30vh window (20vh - 80vh)
        if (elementCenter >= rangeMin && elementCenter <= rangeMax) {
          newActive[STEPS[index].num] = true
        }
      })

      setActiveSteps(newActive)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <section 
      className="section process-section" 
      id="process"
      style={{
        background: 'var(--border-light)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        borderTop: '1px solid var(--border-subtle)',
        borderBottom: '1px solid var(--border-subtle)',
      }}
      >
      <div className="container">

        {/* Static non-animating header avoids flickering triggers entirely on scroll */}
        <div className="section-label-wrap">
          <span className="section-eyebrow">03. Process</span>
          <h2 className="section-title">How I work</h2>
        </div>

        <div className="process-list">
          {STEPS.map((step, i) => (
            <div 
              key={step.num}
              ref={el => { stepsRef.current[i] = el }}
              className={`process-item ${activeSteps[step.num] ? 'active-scroll' : ''}`}
            >
              <span className="process-num">{step.num}</span>
              <div className="process-body">
                <h3 className="process-title">{step.title}</h3>
                <p className="process-desc">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}