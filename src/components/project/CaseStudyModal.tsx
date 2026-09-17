import { useEffect, useState } from 'react'
import type { CSSProperties } from 'react'
import type { Project } from '../../types'
import { Icon } from '../icons'
import { Modal } from '../ui/Modal'
import { LiquidLens } from '../ui/LiquidLens'
import { useLiquidTabs } from '../../hooks/useLiquidTabs'
import { ProjectCarousel } from './ProjectCarousel'
import { ImageLightbox } from './ImageLightbox'

interface CaseStudyModalProps {
  open: boolean
  onClose: () => void
  project: Project
  shareUrl: string
}

const ASPECT = { desktop: '16 / 10', mobile: '9 / 17' } as const

const footerBtn =
  'press inline-flex min-h-11 w-full items-center justify-center gap-[clamp(0.3rem,1vw,0.5rem)] ' +
  'whitespace-nowrap rounded-lg px-[clamp(0.65rem,2vw,1.5rem)] py-[clamp(0.65rem,1.5vw,0.75rem)] ' +
  'text-[clamp(0.72rem,1.8vw,0.85rem)] font-semibold no-underline ' +
  'transition-[transform,border-color,color,background-color] duration-300'

export function CaseStudyModal({ open, onClose, project, shareUrl }: CaseStudyModalProps) {
  const {
    cat,
    name,
    desc,
    overview,
    hardPart,
    period,
    highlights = [],
    tech,
    href,
    code,
    purchaseUrl,
  } = project
  const [viewMode, setViewMode] = useState<'desktop' | 'mobile'>('desktop')
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)
  const [copyState, setCopyState] = useState<'idle' | 'copied' | 'error'>('idle')
  const accentStyle = {
    '--project-accent': project.tabColor,
    '--project-accent-light': project.tabColorLight,
  } as CSSProperties

  useEffect(() => {
    if (copyState === 'idle') return
    const timer = window.setTimeout(() => setCopyState('idle'), 2400)
    return () => window.clearTimeout(timer)
  }, [copyState])

  async function copyCaseStudyLink() {
    try {
      let copied = false
      if (navigator.clipboard?.writeText) {
        try {
          await navigator.clipboard.writeText(shareUrl)
          copied = true
        } catch {
          // Non-secure preview origins can expose the API and still reject it;
          // the synchronous fallback below keeps local reviews useful.
        }
      }
      if (!copied) {
        const field = document.createElement('textarea')
        field.value = shareUrl
        field.setAttribute('readonly', '')
        field.style.position = 'fixed'
        field.style.opacity = '0'
        document.body.appendChild(field)
        field.select()
        copied = document.execCommand('copy')
        field.remove()
        if (!copied) throw new Error('Clipboard unavailable')
      }
      setCopyState('copied')
    } catch {
      setCopyState('error')
    }
  }

  const images =
    viewMode === 'desktop'
      ? project.desktopImages
      : project.mobileImages.length > 0
        ? project.mobileImages
        : project.desktopImages

  const modes = ['desktop', 'mobile'] as const
  const { state, containerRef, itemRef, dragHandlers } = useLiquidTabs({
    count: modes.length,
    active: modes.indexOf(viewMode),
    onSelect: (index) => setViewMode(modes[index]),
  })

  const modeLabel = (mode: 'desktop' | 'mobile') =>
    mode === 'desktop' ? 'Desktop View' : 'Mobile View'
  const toggleBtn =
    'relative min-h-11 rounded-xl border-0 bg-transparent px-4 py-1.5 text-[0.8rem] font-medium'

  const section = (title: string, body: React.ReactNode) => (
    <section>
      <h3 className="text-[0.95rem] font-semibold tracking-[-0.01em] text-primary">{title}</h3>
      <div className="my-[6px] mb-3.5 h-px w-full bg-edge-strong opacity-30" />
      {body}
    </section>
  )

  return (
    <>
      <Modal
        open={open}
        onClose={onClose}
        labelledBy="case-study-title"
        suspended={lightboxIndex !== null}
        panelClassName="standard-modal-panel case-study-panel"
      >
        <div style={accentStyle} className="case-study-header sticky top-0 z-10 flex flex-none items-start justify-between gap-4 rounded-t-2xl border-b border-edge bg-surface p-[clamp(1rem,3vw,2rem)]">
          <div>
            <span className="flex flex-wrap items-center gap-2 text-[0.75rem] font-semibold uppercase tracking-[0.1em]">
              <span className="project-accent-text">{cat}</span>
              <span aria-hidden="true" className="text-muted opacity-50">
                ·
              </span>
              <span className="font-medium normal-case tracking-normal text-muted">{period}</span>
            </span>
            <h2
              id="case-study-title"
              className="text-[clamp(1.3rem,3vw,1.8rem)] font-semibold tracking-[-0.01em] text-primary"
            >
              {name}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label={`Close ${name} case study`}
            className="press inline-flex h-11 w-11 shrink-0 items-center justify-center text-muted transition-transform duration-300"
          >
            <span className="inline-flex h-[clamp(2.125rem,8vw,2.75rem)] w-[clamp(2.125rem,8vw,2.75rem)] items-center justify-center rounded-lg border border-edge bg-edge-faint transition-colors duration-300 hoverable:hover:border-accent hoverable:hover:text-primary">
              <Icon
                name="close"
                size={20}
                className="h-[clamp(1rem,4vw,1.25rem)] w-[clamp(1rem,4vw,1.25rem)]"
              />
            </span>
          </button>
        </div>

        <div
          data-lenis-prevent
          className="case-study-body flex min-h-0 flex-1 flex-col gap-6 overflow-y-auto overscroll-contain p-[clamp(1rem,3vw,2rem)] [-webkit-overflow-scrolling:touch]"
        >
          <div className="flex w-full justify-center">
            <div
              ref={containerRef}
              className="case-study-view-toggle relative mx-auto inline-flex w-fit items-center gap-1 rounded-2xl border border-pill-edge bg-pill p-1 transition-[background-color,border-color] duration-300 theme-light:border-accent/20 theme-light:bg-accent/4"
            >
              {/* No refracted copy here — only two short labels, and bending
                  them made the accent text read as a rendering fault. */}
              <LiquidLens
                state={state}
                travelMs={380}
                ease="cubic-bezier(0.22, 1, 0.36, 1)"
                draggable
                dragHandlers={dragHandlers}
              />

              {modes.map((mode, i) => (
                <button
                  key={mode}
                  ref={itemRef(i)}
                  type="button"
                  onClick={() => setViewMode(mode)}
                  aria-pressed={viewMode === mode}
                  className={`${toggleBtn} z-[2] transition-colors duration-300 ${
                    viewMode === mode ? 'text-accent' : 'text-muted'
                  }`}
                >
                  {modeLabel(mode)}
                </button>
              ))}
            </div>
          </div>

          <ProjectCarousel
            images={images}
            aspect={ASPECT[viewMode]}
            label={name}
            onOpen={setLightboxIndex}
          />

          {section(
            'Overview',
            <div className="flex flex-col gap-4">
              {(overview || desc).split('\n\n').map((paragraph, i) => (
                <p key={i} className="text-[0.95rem] leading-[1.8] text-muted">
                  {paragraph}
                </p>
              ))}
            </div>,
          )}

          {section(
            'Highlights',
            <ul className="m-0 flex list-none flex-col gap-2.5 p-0">
              {highlights.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-2.5 text-[0.9rem] leading-[1.6] text-muted"
                >
                  <span
                    aria-hidden="true"
                    className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-accent"
                  />
                  {item}
                </li>
              ))}
            </ul>,
          )}

          {section(
            'The hard part',
            <div className="flex flex-col gap-4">
              {hardPart.split('\n\n').map((paragraph, i) => (
                <p key={i} className="text-[0.95rem] leading-[1.8] text-muted">
                  {paragraph}
                </p>
              ))}
            </div>,
          )}

          {section(
            'Tech Stack',
            <div className="flex flex-wrap gap-2">
              {tech.map((t) => (
                <span
                  key={t}
                  className="cursor-default rounded-full border border-edge px-3 py-1 text-[0.75rem] font-medium uppercase tracking-[0.08em] text-muted transition-[border-color,color] duration-300 hoverable:hover:border-accent/35 hoverable:hover:text-accent"
                >
                  {t}
                </span>
              ))}
            </div>,
          )}
        </div>

        <div className="case-study-footer sticky bottom-0 z-10 grid flex-none grid-cols-2 gap-[clamp(0.5rem,2vw,0.75rem)] rounded-b-2xl border-t border-edge bg-surface p-[clamp(0.75rem,2.5vw,1.25rem)]">
          {purchaseUrl ? (
            <>
              <a
                href={purchaseUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={`${footerBtn} col-span-2 bg-accent text-accent-contrast hoverable:hover:-translate-y-0.5 hoverable:hover:bg-accent/90`}
              >
                Buy Template
                <Icon name="externalLink" size={13} />
              </a>
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className={`${footerBtn} border border-edge-strong text-primary hoverable:hover:border-accent hoverable:hover:text-accent`}
              >
                View Live Project
                <Icon name="externalLink" size={13} />
              </a>
            </>
          ) : (
            <>
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className={`${footerBtn} col-span-2 bg-accent text-accent-contrast hoverable:hover:-translate-y-0.5 hoverable:hover:bg-accent/90`}
              >
                View Live Project
                <Icon name="externalLink" size={13} />
              </a>
              {code && (
                <a
                  href={code}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${footerBtn} border border-edge-strong text-primary hoverable:hover:border-accent hoverable:hover:text-accent`}
                >
                  Source Code
                  <Icon name="github" size={13} />
                </a>
              )}
            </>
          )}
          <button
            type="button"
            onClick={copyCaseStudyLink}
            className={`${footerBtn} ${!purchaseUrl && !code ? 'col-span-2' : ''} border border-edge-strong bg-transparent text-primary hoverable:hover:border-accent hoverable:hover:text-accent`}
            aria-live="polite"
          >
            {copyState === 'copied' ? 'Link copied' : copyState === 'error' ? 'Copy unavailable' : 'Copy link'}
            <Icon name={copyState === 'copied' ? 'check' : 'link'} size={13} />
          </button>
        </div>
      </Modal>

      <ImageLightbox
        open={lightboxIndex !== null}
        onClose={() => setLightboxIndex(null)}
        items={images}
        index={lightboxIndex ?? 0}
        onIndexChange={setLightboxIndex}
        label={name}
      />
    </>
  )
}
