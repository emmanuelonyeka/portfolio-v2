import { useEffect, useRef } from 'react'

export default function ScrollProgress() {
  const barRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const bar = barRef.current
    if (!bar) return

    const onScroll = () => {
      const docH = document.documentElement.scrollHeight - window.innerHeight
      const progress = docH > 0 ? (window.scrollY / docH) * 100 : 0
      bar.style.width = `${progress}%`
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return <div ref={barRef} className="scroll-progress" aria-hidden="true" />
}