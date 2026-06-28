import { useEffect, useRef } from 'react'

const ALL_IMAGES = [
  'https://motionsites.ai/assets/hero-space-voyage-preview-eECLH3Yc.gif',
  'https://motionsites.ai/assets/hero-codenest-preview-Cgppc2qV.gif',
  'https://motionsites.ai/assets/hero-vex-ventures-preview-BczMFIiw.gif',
  'https://motionsites.ai/assets/hero-stellar-ai-v2-preview-DjvxjG3C.gif',
  'https://motionsites.ai/assets/hero-asme-preview-B_nGDnTP.gif',
  'https://motionsites.ai/assets/hero-transform-data-preview-Cx5OU29N.gif',
  'https://motionsites.ai/assets/hero-vitara-preview-Cjz2QYyU.gif',
  'https://motionsites.ai/assets/hero-terra-preview-BFjrCr7T.gif',
  'https://motionsites.ai/assets/hero-skyelite-preview-DHaZIgUv.gif',
  'https://motionsites.ai/assets/hero-aethera-preview-DknSlcTa.gif',
  'https://motionsites.ai/assets/hero-designpro-preview-D8c5_een.gif',
  'https://motionsites.ai/assets/hero-stellar-ai-preview-D3HL6bw1.gif',
  'https://motionsites.ai/assets/hero-xportfolio-preview-D4A8maiC.gif',
  'https://motionsites.ai/assets/hero-orbit-web3-preview-BXt4OttD.gif',
  'https://motionsites.ai/assets/hero-nexora-preview-cx5HmUgo.gif',
  'https://motionsites.ai/assets/hero-evr-ventures-preview-DZxeVFEX.gif',
  'https://motionsites.ai/assets/hero-planet-orbit-preview-DWAP8Z1P.gif',
  'https://motionsites.ai/assets/hero-new-era-preview-CocuDUm9.gif',
  'https://motionsites.ai/assets/hero-wealth-preview-B70idl_u.gif',
  'https://motionsites.ai/assets/hero-luminex-preview-CxOP7ce6.gif',
  'https://motionsites.ai/assets/hero-celestia-preview-0yO3jXO8.gif',
]

const ROW1 = [...ALL_IMAGES.slice(0, 11), ...ALL_IMAGES.slice(0, 11), ...ALL_IMAGES.slice(0, 11)]
const ROW2 = [...ALL_IMAGES.slice(11), ...ALL_IMAGES.slice(11), ...ALL_IMAGES.slice(11)]

export default function MarqueeSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const row1Ref = useRef<HTMLDivElement>(null)
  const row2Ref = useRef<HTMLDivElement>(null)
  const currentOffset = useRef(0)
  const targetOffset = useRef(0)
  const rafRef = useRef<number>(0)

  useEffect(() => {
    const section = sectionRef.current!
    const row1 = row1Ref.current!
    const row2 = row2Ref.current!
    if (!section || !row1 || !row2) return

    const LERP_FACTOR = 0.08 
    const SPEED = 0.3       

    // Cache the offset top bounds to avoid DOM layout recalculation inside scroll handler
    let sectionTop = 0
    function measure() {
      const rect = section.getBoundingClientRect()
      sectionTop = rect.top + window.scrollY
    }
    measure()

    function updateTarget() {
      targetOffset.current = (window.scrollY - sectionTop + window.innerHeight) * SPEED
    }

    function tick() {
      currentOffset.current += (targetOffset.current - currentOffset.current) * LERP_FACTOR

      const x = currentOffset.current - 200
      row1.style.transform = `translateX(${x}px)`
      row2.style.transform = `translateX(${-x}px)`

      rafRef.current = requestAnimationFrame(tick)
    }

    const onScroll = () => updateTarget()
    const onResize = () => {
      measure()
      updateTarget()
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onResize)
    updateTarget()
    // Only run RAF when section is visible — prevents iOS GPU thrash
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          rafRef.current = requestAnimationFrame(tick)
        } else {
          cancelAnimationFrame(rafRef.current)
        }
      },
      { threshold: 0 }
    )
    observer.observe(section)

    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onResize)
      cancelAnimationFrame(rafRef.current)
      observer.disconnect()
    }
  }, [])

  const imgStyle: React.CSSProperties = {
    width: 'clamp(180px, 28vw, 420px)',
    height: 'clamp(115px, 18vw, 270px)',
    borderRadius: 'clamp(8px, 1.2vw, 16px)',
    objectFit: 'cover',
    flexShrink: 0,
  }

  return (
    <section
      ref={sectionRef}
      style={{ background: 'transparent' }}
      className="pt-24 sm:pt-32 md:pt-40 pb-10 overflow-hidden"
    >
      <div
        ref={row1Ref}
        className="flex mb-3"
        style={{ gap: 'clamp(6px, 1vw, 12px)', willChange: 'transform', transform: 'translateZ(0)' }}
      >
        {ROW1.map((src, i) => (
          <img key={i} src={src} alt="" loading="lazy" style={imgStyle} />
        ))}
      </div>

      <div
        ref={row2Ref}
        className="flex"
        style={{ gap: 'clamp(6px, 1vw, 12px)', willChange: 'transform', transform: 'translateZ(0)' }}
      >
        {ROW2.map((src, i) => (
          <img key={i} src={src} alt="" loading="lazy" style={imgStyle} />
        ))}
      </div>
    </section>
  )
}