import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import type { CSSProperties } from 'react'
import { site } from '../../config/site'
import { useReducedMotion } from '../../hooks/useReducedMotion'
import { useSaveData } from '../../hooks/useSaveData'
import { piecewise } from '../../hooks/useScrollProgress'
import type { Project } from '../../types'
import { Icon } from '../icons'

const loadCaseStudy = () => import('./CaseStudyModal')
const CaseStudyModal = lazy(() =>
  loadCaseStudy().then(({ CaseStudyModal: component }) => ({ default: component })),
)

interface ProjectCardProps {
  index: number
  total: number
  /** Subscribe to the Work section's 0..1 scroll progress. Returns an unsubscribe. */
  onProgress: (notify: (progress: number) => void) => () => void
  project: Project
}

const PEEK = 40
const TAB_HEIGHT = 36
const CASE_PARAM = 'case'
/**
 * The full overlap treatment needs room in both axes. Wider but short laptop
 * windows get the same honest document flow as tablets, so content is never
 * cropped merely to preserve an effect.
 */
const STACK_QUERY = '(min-width: 900px) and (min-height: 840px)'

function activeCaseStudy() {
  return new URLSearchParams(window.location.search).get(CASE_PARAM)
}

function caseStudyUrl(slug: string) {
  const url = new URL(window.location.href)
  url.searchParams.set(CASE_PARAM, slug)
  url.hash = 'work'
  return url
}

export default function ProjectCard({ index, total, onProgress, project }: ProjectCardProps) {
  const scaleRef = useRef<HTMLDivElement>(null)
  const mediaRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const {
    num,
    cat,
    name,
    tabLabel,
    slug,
    desc,
    tech,
    href,
    code,
    purchaseUrl,
    video,
    tabColor,
    tabColorLight,
    tabBg,
    inProgress = false,
  } = project
  const reducedMotion = useReducedMotion()
  const saveData = useSaveData()
  const isVideoPreview = video.endsWith('.mp4') || video.endsWith('.webm')
  const [modalOpen, setModalOpen] = useState(() => activeCaseStudy() === slug)
  const [previewReady, setPreviewReady] = useState(false)
  const [previewFailed, setPreviewFailed] = useState(false)
  const [previewPaused, setPreviewPaused] = useState(false)
  const [previewOptIn, setPreviewOptIn] = useState(false)
  const [isPreviewPlaying, setIsPreviewPlaying] = useState(false)
  const [isStacked, setIsStacked] = useState(() => window.matchMedia(STACK_QUERY).matches)

  useEffect(() => {
    const query = window.matchMedia(STACK_QUERY)
    const onChange = (event: MediaQueryListEvent) => setIsStacked(event.matches)
    query.addEventListener('change', onChange)
    return () => query.removeEventListener('change', onChange)
  }, [])

  // Keep the modal in sync with browser Back/Forward and open a shared URL on
  // first render without adding a router to a one-page site.
  useEffect(() => {
    const syncFromUrl = () => setModalOpen(activeCaseStudy() === slug)
    window.addEventListener('popstate', syncFromUrl)
    syncFromUrl()
    return () => window.removeEventListener('popstate', syncFromUrl)
  }, [slug])

  useEffect(() => {
    if (!modalOpen) return
    const previous = document.title
    document.title = `${name} Case Study | ${site.name}`
    return () => {
      document.title = previous
    }
  }, [modalOpen, name])

  useEffect(() => {
    const previewHost = mediaRef.current
    if (!previewHost || previewReady || !isVideoPreview) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        setPreviewReady(true)
        observer.disconnect()
      },
      { rootMargin: '320px 0px' },
    )
    observer.observe(previewHost)
    return () => observer.disconnect()
  }, [isVideoPreview, previewReady])

  useEffect(() => {
    const preview = videoRef.current
    if (!preview || !previewReady || previewFailed) return

    let onScreen = false
    const sync = () => {
      const mayPlay =
        onScreen &&
        !document.hidden &&
        !previewPaused &&
        (!(reducedMotion || saveData) || previewOptIn)

      if (mayPlay) void preview.play().catch(() => {})
      else preview.pause()
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        onScreen = entry.isIntersecting
        sync()
      },
      { threshold: 0.2 },
    )

    preview.muted = true
    observer.observe(preview)
    document.addEventListener('visibilitychange', sync)

    return () => {
      observer.disconnect()
      document.removeEventListener('visibilitychange', sync)
    }
  }, [previewFailed, previewOptIn, previewPaused, previewReady, reducedMotion, saveData])

  function togglePreview() {
    const preview = videoRef.current
    if (!preview) return

    if (preview.paused) {
      setPreviewPaused(false)
      setPreviewOptIn(true)
      void preview.play().catch(() => {})
    } else {
      setPreviewPaused(true)
      preview.pause()
    }
  }

  const intervals: number[] = []
  const scales: number[] = []
  const scaleReduction = 0.06

  for (let i = 0; i <= total; i += 1) {
    intervals.push(i / total)
    const stepsPast = i - (index + 1)
    scales.push(stepsPast <= 0 ? 1 : Math.max(0.7, 1 - stepsPast * scaleReduction))
  }

  // Scroll-linked scale writes directly to one DOM node; React does not
  // re-render on every frame. It is fully absent in the normal-flow layout.
  useEffect(() => {
    if (!isStacked || reducedMotion) {
      if (scaleRef.current) scaleRef.current.style.transform = ''
      return
    }
    return onProgress((progress) => {
      const el = scaleRef.current
      if (el) el.style.transform = `scale(${piecewise(progress, intervals, scales)})`
    })
    // The arrays are deterministic products of index/total and must not create
    // a new subscription merely because they are new references.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onProgress, isStacked, reducedMotion, index, total])

  const stickyOffset = `calc(var(--navbar-height) + ${24 + index * PEEK}px)`
  const shellHeight = `calc(100vh - ${stickyOffset})`
  const innerHeight = `calc(100vh - var(--navbar-height) - ${
    24 + (total - 1) * PEEK + TAB_HEIGHT + 24
  }px)`
  const projectStyle = {
    '--project-sticky-top': stickyOffset,
    '--project-shell-height': shellHeight,
    '--project-inner-height': innerHeight,
    '--project-accent': tabColor,
    '--project-accent-light': tabColorLight,
    '--project-tab-bg': tabBg,
    zIndex: index + 1,
  } as CSSProperties

  function removeCaseFromUrl() {
    const url = new URL(window.location.href)
    url.searchParams.delete(CASE_PARAM)
    history.replaceState({}, '', url)
  }

  function openCaseStudy() {
    const current = activeCaseStudy()
    if (current !== slug) {
      const previousState = history.state && typeof history.state === 'object' ? history.state : {}
      history.pushState(
        { ...previousState, portfolioCaseStudy: slug },
        '',
        caseStudyUrl(slug),
      )
    }
    setModalOpen(true)
  }

  function closeCaseStudy() {
    if (history.state?.portfolioCaseStudy === slug) {
      history.back()
      return
    }
    removeCaseFromUrl()
    setModalOpen(false)
  }

  // Navigating elsewhere in the page should never leave a stale ?case URL.
  useEffect(() => {
    if (!modalOpen) return
    const onDocumentClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      if (!target.closest('a[href^="#"]')) return
      if (target.closest('#themeToggle') || target.closest('#menuToggle')) return
      removeCaseFromUrl()
      setModalOpen(false)
    }

    document.addEventListener('click', onDocumentClick)
    return () => document.removeEventListener('click', onDocumentClick)
  }, [modalOpen])

  return (
    <>
      <article
        className={`project-shell ${index === total - 1 ? 'project-shell--last' : ''}`}
        style={projectStyle}
        aria-labelledby={`project-${slug}-title`}
      >
        <div
          ref={scaleRef}
          className="project-scale"
          style={{ willChange: isStacked && !reducedMotion ? 'transform' : undefined }}
        >
          <div className="project-tab" aria-hidden="true">
            <div className="project-tab-shape" />
          </div>

          <div className="project-tab-label" aria-hidden="true">
            <span className="project-accent-text font-mono text-[0.72rem] font-bold tracking-[0.08em]">
              {num}
            </span>
            <span className="h-2.5 w-px bg-[var(--project-accent)] opacity-70 theme-light:bg-[var(--project-accent-light)]" />
            <span className="project-accent-text truncate text-[0.72rem] font-semibold uppercase tracking-[0.05em]">
              {tabLabel}
            </span>
          </div>

          <div className="project-card-body grid grid-cols-1 gap-[clamp(1.5rem,3vw,3rem)] rounded-[0_clamp(12px,1.5vw,16px)_clamp(12px,1.5vw,16px)_clamp(12px,1.5vw,16px)] border border-edge bg-surface p-[clamp(1.25rem,2.5vw,2.5rem)] transition-[background-color,border-color] duration-300 min-[769px]:grid-cols-[1fr_1.3fr]">
            <div className="flex min-w-0 flex-col justify-center gap-3 min-[769px]:gap-[clamp(1rem,2vw,1.5rem)]">
              <div className="flex items-start gap-4">
                <span className="font-mono text-[clamp(0.9rem,1.2vw,1.1rem)] font-bold tracking-[0.05em] text-accent">
                  {num}
                </span>
                <div className="flex flex-col gap-2 min-[411px]:flex-row min-[411px]:flex-wrap min-[411px]:gap-1.5">
                  <span className="w-fit rounded-full border border-edge px-3 py-1 text-[0.72rem] font-medium uppercase tracking-[0.11em] text-muted">
                    {cat}
                  </span>
                  {inProgress && (
                    <span className="inline-flex w-fit items-center gap-2 rounded-full border border-warning/35 bg-warning/8 px-3 py-1 text-[0.72rem] font-medium uppercase tracking-[0.11em] text-warning">
                      <span aria-hidden="true" className="h-2 w-2 animate-soft-pulse rounded-full bg-warning motion-reduce:animate-none" />
                      In Progress
                    </span>
                  )}
                  {purchaseUrl && (
                    <span className="inline-flex w-fit items-center rounded-full border border-accent/30 bg-accent/8 px-3 py-1 text-[0.72rem] font-medium uppercase tracking-[0.11em] text-accent">
                      Template Available
                    </span>
                  )}
                </div>
              </div>

              <h3 id={`project-${slug}-title`} className="text-[clamp(1.45rem,5vw,2rem)] font-bold leading-[1.1] tracking-[-0.03em] text-primary min-[769px]:text-[clamp(1.6rem,3.5vw,2.8rem)]">
                {name}
              </h3>
              <p className="max-w-[46rem] text-[0.88rem] leading-[1.72] text-muted min-[769px]:max-w-[440px] min-[769px]:text-[clamp(0.85rem,1.3vw,1rem)]">
                {desc}
              </p>

              <ul className="m-0 flex list-none flex-wrap gap-2 p-0" aria-label={`${name} technology stack`}>
                {tech.map((technology) => (
                  <li key={technology} className="rounded-full border border-edge px-3 py-1 text-[0.72rem] font-medium uppercase tracking-[0.08em] text-muted transition-[border-color,color] duration-200 hoverable:hover:border-accent/25 hoverable:hover:text-accent">
                    {technology}
                  </li>
                ))}
              </ul>

              <div className="project-actions mt-1 flex flex-wrap items-center gap-2.5 min-[769px]:gap-3">
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="project-action press inline-flex min-w-[130px] flex-auto items-center justify-center gap-2 rounded-lg bg-accent px-6 py-3 text-center text-[0.85rem] font-semibold text-accent-contrast no-underline transition-[background-color,transform] duration-300 hoverable:hover:-translate-y-0.5 hoverable:hover:bg-accent/90 min-[769px]:w-fit min-[769px]:flex-none"
                >
                  View Project
                  <Icon name="externalLink" size={13} />
                </a>
                <button
                  type="button"
                  className="project-action press inline-flex min-w-[130px] flex-auto items-center justify-center gap-2 rounded-lg border border-edge-strong bg-transparent px-5 py-[11px] text-center text-[0.85rem] font-semibold text-muted transition-[transform,border-color,color,background-color] duration-300 hoverable:hover:border-accent/25 hoverable:hover:bg-accent/8 hoverable:hover:text-accent min-[769px]:flex-none"
                  onPointerEnter={() => void loadCaseStudy()}
                  onFocus={() => void loadCaseStudy()}
                  onClick={openCaseStudy}
                >
                  Case Study
                  <Icon name="search" size={13} />
                </button>
                {code && (
                  <a
                    href={code}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Source code for ${name} on GitHub`}
                    className="project-action press inline-flex min-w-[130px] flex-auto items-center justify-center gap-2 rounded-lg border border-edge-strong bg-transparent px-5 py-[11px] text-[0.85rem] font-semibold text-muted transition-[transform,border-color,color,background-color] duration-300 hoverable:hover:border-accent/25 hoverable:hover:bg-accent/8 hoverable:hover:text-accent min-[769px]:flex-none"
                  >
                    <Icon name="github" size={15} />
                    Source Code
                  </a>
                )}
              </div>
            </div>

            <div
              ref={mediaRef}
              className="relative order-first flex w-full items-center self-center justify-self-center overflow-hidden rounded-[clamp(10px,1.5vw,16px)] border border-edge bg-surface-hover aspect-[16/10] min-[769px]:order-none"
            >
              <img
                src={project.desktopImages[0]}
                alt=""
                width={1600}
                height={1000}
                loading="lazy"
                decoding="async"
                fetchPriority="low"
                className="absolute inset-0 block h-full w-full object-cover object-top"
              />

              {isVideoPreview && previewReady && !previewFailed && (
                <>
                  <video
                    id={`project-preview-${slug}`}
                    ref={videoRef}
                    src={video}
                    poster={project.desktopImages[0]}
                    loop
                    muted
                    playsInline
                    preload="none"
                    aria-hidden="true"
                    onError={() => setPreviewFailed(true)}
                    onPlay={() => setIsPreviewPlaying(true)}
                    onPause={() => setIsPreviewPlaying(false)}
                    className={`relative z-[1] block h-full w-full object-contain transition-transform duration-[600ms] motion-reduce:transition-none ${
                      slug === 'solara-jets'
                        ? 'min-[769px]:scale-[1.012] min-[769px]:hoverable:hover:scale-[1.02]'
                        : 'hoverable:hover:scale-[1.02]'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={togglePreview}
                    aria-controls={`project-preview-${slug}`}
                    aria-pressed={isPreviewPlaying}
                    aria-label={`${isPreviewPlaying ? 'Pause' : 'Play'} ${name} preview`}
                    className="press absolute bottom-3 right-3 z-[2] inline-flex min-h-10 items-center justify-center rounded-full border border-white/25 bg-black/75 px-3.5 text-xs font-semibold text-white transition-[transform,background-color,border-color] duration-300 hoverable:hover:bg-black/90"
                  >
                    {isPreviewPlaying ? 'Pause preview' : 'Play preview'}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </article>

      {modalOpen && (
        <Suspense
          fallback={
            <span className="sr-only" role="status">
              Loading {name} case study…
            </span>
          }
        >
          <CaseStudyModal
            open
            onClose={closeCaseStudy}
            project={project}
            shareUrl={caseStudyUrl(slug).toString()}
          />
        </Suspense>
      )}
    </>
  )
}
