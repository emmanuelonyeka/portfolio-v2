import type { ReactNode } from 'react'
import type { LiquidState } from '../../hooks/useLiquidTabs'
import { useReducedMotion } from '../../hooks/useReducedMotion'

interface LiquidLensProps {
  state: LiquidState
  /** Spring travel duration in ms. */
  travelMs?: number
  /** Easing. Nav keeps the spring; the view toggle uses a softer settle. */
  ease?: string
  /**
   * A duplicate of the row's content, positioned to line up with the real row.
   * Only its EDGES are shown — see EDGE_MASK.
   */
  children?: ReactNode
  dragHandlers?: Record<string, unknown>
  draggable?: boolean
}

/** How much the edge copy is stretched. Higher = more obvious lens bulge. */
const EDGE_STRETCH = 1.45

/**
 * The lens itself: clear through the middle, thick at the rim.
 *
 * A real lens shows its subject undistorted at the centre and bends it near the
 * edges. This mask hides the magnified copy across the middle and fades it in
 * towards all four edges, so the centre reads as plain glass and only the rim
 * looks stretched — which is the Liquid Glass read.
 */
const EDGE_MASK =
  'radial-gradient(ellipse 62% 66% at 50% 50%, rgba(0,0,0,0) 42%, rgba(0,0,0,0.55) 72%, #000 100%)'

export function LiquidLens({
  state,
  travelMs = 460,
  ease = 'var(--ease-spring)',
  children,
  dragHandlers,
  draggable = false,
}: LiquidLensProps) {
  const { x, y, width, height, stretch, liquid, dragging } = state
  const reducedMotion = useReducedMotion()
  const motion =
    dragging || reducedMotion
      ? 'none'
      : `transform ${travelMs}ms ${ease}, width ${travelMs}ms ${ease}, opacity 220ms ease`

  return (
    <span
      {...(draggable ? dragHandlers : {})}
      className="liquid-lens"
      style={{
        position: 'absolute',
        left: 0,
        top: 0,
        width,
        height,
        borderRadius: 999,
        transform: `translate(${x}px, ${y}px) scaleX(${stretch})`,
        transition: motion,
        opacity: width > 0 ? 1 : 0,
        overflow: 'hidden',
        zIndex: 1,
        touchAction: 'none',
        cursor: draggable ? (dragging ? 'grabbing' : 'grab') : undefined,
        pointerEvents: draggable ? 'auto' : 'none',
        willChange: 'transform, width',
        // Neutral by default. A local CSS variable lets a specific control use
        // a theme-aware treatment without changing the navigation lens.
        background: `var(--liquid-lens-bg, rgb(var(--contrast-rgb) / ${liquid ? 0.07 : 0.1}))`,
        // The CENTRE stays clear. No blur here at all — the rim layer below is
        // the only thing that distorts, which is what makes it read as a lens
        // rather than a frosted tile.
        boxShadow: liquid
          ? 'inset 0 1px 0 rgb(255 255 255 / 0.34), inset 0 -1px 0 rgb(0 0 0 / 0.16), 0 3px 16px rgb(0 0 0 / 0.22)'
          : 'inset 0 1px 0 rgb(255 255 255 / 0.2), inset 0 -1px 0 rgb(0 0 0 / 0.1), 0 2px 10px rgb(0 0 0 / 0.16)',
      }}
    >
      {/* The rim. A blurred band masked to the edges only, so the glass looks
          thick where a real lens is thick and invisible where it is thin. */}
      <span
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: 999,
          backdropFilter: liquid ? 'blur(6px) brightness(1.05)' : 'blur(3px)',
          WebkitBackdropFilter: liquid ? 'blur(6px) brightness(1.05)' : 'blur(3px)',
          maskImage: EDGE_MASK,
          WebkitMaskImage: EDGE_MASK,
          pointerEvents: 'none',
        }}
      />

      {/* The refracted copy, stretched and shown only at the rim. */}
      {children && liquid && (
        <span
          aria-hidden="true"
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            transform: `translateX(${-x}px) scale(${EDGE_STRETCH}, 1.12)`,
            transformOrigin: 'center',
            transition:
              dragging || reducedMotion ? 'none' : `transform ${travelMs}ms ${ease}`,
            maskImage: EDGE_MASK,
            WebkitMaskImage: EDGE_MASK,
            pointerEvents: 'none',
          }}
        >
          {children}
        </span>
      )}
    </span>
  )
}
