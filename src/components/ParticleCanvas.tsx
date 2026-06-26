import { useEffect, useRef } from 'react'

export default function ParticleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animId: number
    const isMobile = window.innerWidth < 768
    const NODE_COUNT = isMobile ? 15 : 55
    const MAX_DIST = isMobile ? 80 : 160
    const COLOR = '79,156,255'
    let nodes: { x: number; y: number; vx: number; vy: number; r: number }[] = []
    const mouse = { x: -9999, y: -9999 }

    function resize() {
      if (!canvas) return
      canvas.width  = window.innerWidth
      canvas.height = window.innerHeight
    }

    function createNodes() {
      nodes = Array.from({ length: NODE_COUNT }, () => ({
        x:  Math.random() * canvas!.width,
        y:  Math.random() * canvas!.height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        r:  Math.random() * 1.5 + 0.5,
      }))
    }

    function draw() {
      if (!ctx || !canvas) return
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      for (const n of nodes) {
        n.x += n.vx; n.y += n.vy
        if (n.x < 0 || n.x > canvas.width)  n.vx *= -1
        if (n.y < 0 || n.y > canvas.height) n.vy *= -1
        ctx.beginPath()
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${COLOR},0.35)`
        ctx.fill()
      }

      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x
          const dy = nodes[i].y - nodes[j].y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < MAX_DIST) {
            ctx.beginPath()
            ctx.moveTo(nodes[i].x, nodes[i].y)
            ctx.lineTo(nodes[j].x, nodes[j].y)
            ctx.strokeStyle = `rgba(${COLOR},${(1 - dist / MAX_DIST) * 0.1})`
            ctx.lineWidth = 0.8
            ctx.stroke()
          }
        }
        const mdx = nodes[i].x - mouse.x
        const mdy = nodes[i].y - mouse.y
        const md  = Math.sqrt(mdx * mdx + mdy * mdy)
        if (md < 120) {
          ctx.beginPath()
          ctx.moveTo(nodes[i].x, nodes[i].y)
          ctx.lineTo(mouse.x, mouse.y)
          ctx.strokeStyle = `rgba(${COLOR},${(1 - md / 120) * 0.25})`
          ctx.lineWidth = 0.6
          ctx.stroke()
        }
      }

      animId = requestAnimationFrame(draw)
    }

    const onMouseMove = (e: MouseEvent) => { mouse.x = e.clientX; mouse.y = e.clientY }
    const onResize = () => { resize(); createNodes() }

    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('resize', onResize)
    resize(); createNodes(); draw()

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('resize', onResize)
    }
  }, [])

  return <canvas ref={canvasRef} id="bg-canvas" />
}