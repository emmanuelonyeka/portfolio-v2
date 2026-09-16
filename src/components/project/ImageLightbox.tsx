import { useEffect, useRef } from 'react'
import { useReducedMotion } from '../../hooks/useReducedMotion'
import { Icon } from '../icons'
import { Modal } from '../ui/Modal'

interface ImageLightboxProps {
  open: boolean
  onClose: () => void
  /** Every item the lightbox can page through. One item hides the arrows. */
  items: string[]
  index: number
  onIndexChange?: (next: number) => void
  /** Project name, used to build the accessible label and alt text. */
  label: string
}

const isClip = (src: string) => src.endsWith('.mp4') || src.endsWith('.webm')

export function ImageLightbox({
  open,
  onClose,
  items,
  index,
  onIndexChange,
  label,
}: ImageLightboxProps) {
  const count = items.length
  const pageable = count > 1 && Boolean(onIndexChange)
  const reducedMotion = useReducedMotion()
  const videoRef = useRef<HTMLVideoElement>(null)
  const src = items[index] ?? ''
  const clip = isClip(src)

  useEffect(() => {
    if (!open || !pageable) return
    // Escape is handled by Modal; only the arrows are this component's business.
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'ArrowLeft') onIndexChange!((index - 1 + count) % count)
      else if (event.key === 'ArrowRight') onIndexChange!((index + 1) % count)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [open, pageable, index, count, onIndexChange])

  useEffect(() => {
    const video = videoRef.current
    if (!open || !clip || !video) return
    if (reducedMotion) video.pause()
    else void video.play().catch(() => {})
  }, [open, clip, src, reducedMotion])

  useEffect(() => {
    if (!open || count < 2) return
    const neighbours = [items[(index - 1 + count) % count], items[(index + 1) % count]]
    for (const neighbour of new Set(neighbours)) {
      if (isClip(neighbour)) continue
      const image = new Image()
      image.decoding = 'async'
      image.src = neighbour
    }
  }, [open, count, index, items])

  if (!open) return null

  const itemName = clip ? 'video' : 'image'
  const caption = pageable
    ? `${label} — ${itemName} ${index + 1} of ${count}`
    : `${label} ${itemName}`

  const arrow =
    'absolute top-1/2 z-[1] flex h-11 w-11 -translate-y-1/2 items-center justify-center text-primary'
  const arrowFace =
    'inline-flex h-[clamp(2rem,8vw,2.6rem)] w-[clamp(2rem,8vw,2.6rem)] items-center justify-center ' +
    'rounded-full border border-edge-strong bg-surface transition-[background-color,color,border-color] duration-200 ' +
    'hoverable:hover:border-accent hoverable:hover:bg-accent hoverable:hover:text-accent-contrast'
  const media =
    'max-h-[82vh] max-w-[min(95vw,900px)] rounded-lg object-contain ' +
    'shadow-[0_24px_48px_rgba(0,0,0,0.6)] animate-modal-slide-in supports-[height:100dvh]:max-h-[82dvh]'

  return (
    <Modal
      open={open}
      onClose={onClose}
      labelledBy="lightbox-caption"
      overlayClassName="z-[99999] items-center bg-[rgb(10_12_20/0.88)] p-[clamp(0.5rem,2vw,1rem)] backdrop-blur-[20px] animate-modal-fade-in theme-light:bg-[rgb(240_237_230/0.88)]"
      panelClassName="w-full items-center justify-center !border-0 !bg-transparent !animate-none"
    >
      <p id="lightbox-caption" className="sr-only">
        {caption}
      </p>

      <button
        type="button"
        onClick={onClose}
        aria-label={`Close ${label} lightbox`}
        className="press fixed right-[clamp(0.75rem,3vw,1.5rem)] top-[clamp(0.75rem,3vw,1.5rem)] z-[100000] flex h-11 w-11 items-center justify-center text-white"
      >
        <span className="inline-flex h-[clamp(2.125rem,8vw,2.75rem)] w-[clamp(2.125rem,8vw,2.75rem)] items-center justify-center rounded-full border border-white/20 bg-black/60 transition-[background-color,transform] duration-200 hoverable:hover:scale-105 hoverable:hover:bg-accent hoverable:hover:text-accent-contrast">
          <Icon
            name="close"
            size={22}
            strokeWidth={2.5}
            className="h-[clamp(1rem,4vw,1.375rem)] w-[clamp(1rem,4vw,1.375rem)]"
          />
        </span>
      </button>

      {pageable && (
        <button
          type="button"
          onClick={() => onIndexChange!((index - 1 + count) % count)}
          aria-label="Previous image"
          className={`${arrow} left-[clamp(0.25rem,2vw,1.25rem)]`}
        >
          <span className={arrowFace}>
            <Icon
              name="chevronLeft"
              size={18}
              strokeWidth={2.5}
              className="h-[clamp(0.95rem,4vw,1.125rem)] w-[clamp(0.95rem,4vw,1.125rem)]"
            />
          </span>
        </button>
      )}

      {clip ? (
        <video
          ref={videoRef}
          src={src}
          loop
          muted
          playsInline
          preload="metadata"
          controls
          aria-label={caption}
          className={media}
        />
      ) : (
        <img
          src={src}
          alt={caption}
          /* The lightbox image IS the content — lazy-loading it would show an
             empty frame at the exact moment it is opened. */
          decoding="async"
          loading="eager"
          fetchPriority="high"
          className={media}
        />
      )}

      {pageable && (
        <button
          type="button"
          onClick={() => onIndexChange!((index + 1) % count)}
          aria-label="Next image"
          className={`${arrow} right-[clamp(0.25rem,2vw,1.25rem)]`}
        >
          <span className={arrowFace}>
            <Icon
              name="chevronRight"
              size={18}
              strokeWidth={2.5}
              className="h-[clamp(0.95rem,4vw,1.125rem)] w-[clamp(0.95rem,4vw,1.125rem)]"
            />
          </span>
        </button>
      )}
    </Modal>
  )
}
