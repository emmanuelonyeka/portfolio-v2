import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'

interface Options {
  count: number
  /** Currently selected item, or null for "nothing selected yet". */
  active: number | null
  onSelect: (index: number) => void
}

/** Elongation cap while travelling, and how long the stretch is held. */
const MAX_STRETCH = 0.3
const STRETCH_MS = 210
/** Movement past this counts as a drag rather than a tap. */
const DRAG_THRESHOLD = 4

export interface LiquidState {
  x: number
  y: number
  width: number
  height: number
  stretch: number
  /** True while the lens is in flight or under the finger — the refracting look. */
  liquid: boolean
  dragging: boolean
}

/**
 * The travelling-lens indicator shared by the nav pill and the case-study view
 * toggle: measures its targets, springs between them, and can be dragged.
 */
export function useLiquidTabs({ count, active, onSelect }: Options) {
  const itemRefs = useRef<(HTMLElement | null)[]>([])
  // Held in STATE, not a ref: the case-study toggle mounts inside a modal that
  // renders nothing while closed, so the node appears long after this hook does.
  // A ref object would never re-run the effects below; a state change does.
  const [container, setContainer] = useState<HTMLElement | null>(null)
  const [state, setState] = useState<LiquidState>({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
    stretch: 1,
    liquid: false,
    dragging: false,
  })
  const restX = useRef(0)
  const dragFrom = useRef({ pointerX: 0, lensX: 0, moved: false })

  const measure = useCallback(
    (index: number) => {
      const el = itemRefs.current[index]
      if (!el || !container) return null
      // Rect-relative, not offsetLeft: offsetLeft is measured from the border box
      // while the lens sat at `left: inset`, which put it a border-width too far
      // right. This makes the lens exactly the item's box, every time.
      const c = container.getBoundingClientRect()
      const i = el.getBoundingClientRect()
      return { x: i.left - c.left, y: i.top - c.top, width: i.width, height: i.height }
    },
    [container],
  )

  // Settle onto the active item whenever it changes and we are not being dragged.
  useLayoutEffect(() => {
    if (active === null || state.dragging) return
    const box = measure(active)
    if (!box) return

    const distance = Math.abs(box.x - restX.current)
    restX.current = box.x

    if (distance < 1 || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setState((s) => ({ ...s, ...box, stretch: 1, liquid: false }))
      return
    }

    setState((s) => ({ ...s, ...box, stretch: 1 + Math.min(MAX_STRETCH, distance / 520), liquid: true }))
    const id = setTimeout(() => setState((s) => ({ ...s, stretch: 1, liquid: false })), STRETCH_MS)
    return () => clearTimeout(id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, count, measure])

  useEffect(() => {
    if (active === null) restX.current = 0
  }, [active])

  // Re-measure whenever the container gains or changes size. Without this the
  // toggle never measured at all: the hook mounts with the modal CLOSED, refs
  // are null, and `active` never changes afterwards so the layout effect never
  // re-runs — which is why neither view read as active on open.
  useEffect(() => {
    if (!container) return
    const remeasure = () => {
      if (active === null) return
      const box = measure(active)
      if (box) setState((s) => ({ ...s, ...box }))
    }
    const observer = new ResizeObserver(remeasure)
    observer.observe(container)
    return () => observer.disconnect()
  }, [container, active, measure])

  /** Which item's centre is nearest a given x inside the container. */
  const nearest = useCallback(
    (x: number) => {
      let best = 0
      let bestDistance = Infinity
      for (let i = 0; i < count; i += 1) {
        const box = measure(i)
        if (!box) continue
        const distance = Math.abs(x - (box.x + box.width / 2))
        if (distance < bestDistance) {
          bestDistance = distance
          best = i
        }
      }
      return best
    },
    [count, measure],
  )

  const onPointerDown = useCallback(
    (event: React.PointerEvent) => {
      if (active === null) return
      event.currentTarget.setPointerCapture(event.pointerId)
      dragFrom.current = { pointerX: event.clientX, lensX: state.x, moved: false }
    },
    [active, state.x],
  )

  const onPointerMove = useCallback(
    (event: React.PointerEvent) => {
      if (!event.currentTarget.hasPointerCapture(event.pointerId)) return
      if (!container) return

      const delta = event.clientX - dragFrom.current.pointerX
      if (!dragFrom.current.moved && Math.abs(delta) < DRAG_THRESHOLD) return
      dragFrom.current.moved = true

      // Clamp so the lens can never leave its own track.
      const max = container.clientWidth - state.width
      const x = Math.max(0, Math.min(max, dragFrom.current.lensX + delta))
      setState((s) => ({ ...s, x, liquid: true, dragging: true, stretch: 1 }))
    },
    [container, state.width],
  )

  const endDrag = useCallback(
    (event: React.PointerEvent) => {
      if (event.currentTarget.hasPointerCapture(event.pointerId)) {
        event.currentTarget.releasePointerCapture(event.pointerId)
      }
      dragFrom.current.moved = false
      setState((s) => ({ ...s, dragging: false }))

      // Land on whichever item the lens was released over.
      const index = nearest(state.x + state.width / 2)
      restX.current = -1 // force the settle effect to treat this as a real hop
      onSelect(index)
    },
    [nearest, onSelect, state.x, state.width],
  )

  const itemRef = useCallback(
    (index: number) => (el: HTMLElement | null) => {
      itemRefs.current[index] = el
    },
    [],
  )

  return {
    state,
    /** Attach to the track element. Must be this, not a ref you own. */
    containerRef: setContainer,
    itemRef,
    dragHandlers: {
      onPointerDown,
      onPointerMove,
      onPointerUp: endDrag,
      onPointerCancel: endDrag,
    },
  }
}
