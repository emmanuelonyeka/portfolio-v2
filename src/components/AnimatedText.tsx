import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'

interface AnimatedTextProps {
  text: string
  className?: string
  style?: React.CSSProperties
}

export default function AnimatedText({ text, className, style }: AnimatedTextProps) {
  const ref = useRef<HTMLParagraphElement>(null)

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 0.8', 'end 0.2'],
  })

  const chars = text.split('')

  return (
    <p ref={ref} className={className} style={{ position: 'relative', ...style }}>
      {chars.map((char, i) => {
        const start = i / chars.length
        const end = (i + 1) / chars.length

        return (
          <CharWrapper
            key={i}
            char={char}
            start={start}
            end={end}
            progress={scrollYProgress}
          />
        )
      })}
    </p>
  )
}

function CharWrapper({
  char,
  start,
  end,
  progress,
}: {
  char: string
  start: number
  end: number
  progress: ReturnType<typeof useScroll>['scrollYProgress']
}) {
  const opacity = useTransform(progress, [start, end], [0.2, 1])

  return (
    <span style={{ display: 'inline-block', position: 'relative' }}>
      {/* invisible placeholder to preserve layout */}
      <span style={{ visibility: 'hidden' }}>{char === ' ' ? '\u00A0' : char}</span>
      <motion.span
        style={{
          opacity,
          position: 'absolute',
          left: 0,
          top: 0,
        }}
      >
        {char === ' ' ? '\u00A0' : char}
      </motion.span>
    </span>
  )
}
