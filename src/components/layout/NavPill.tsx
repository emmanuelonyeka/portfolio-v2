import type { NavLink } from '../../types'
import { useLiquidTabs } from '../../hooks/useLiquidTabs'
import { LiquidLens } from '../ui/LiquidLens'

interface NavPillProps {
  links: NavLink[]
  active: number | null
  onNavigate: (index: number, id: string) => void
}

const linkClass = 'press-text relative inline-flex items-center justify-center whitespace-nowrap rounded-full px-[18px] py-[7px] text-[0.82rem] tracking-[0.02em] no-underline'

export function NavPill({ links, active, onNavigate }: NavPillProps) {
  const { state, containerRef, itemRef, dragHandlers } = useLiquidTabs({
    count: links.length,
    active,
    onSelect: (index) => onNavigate(index, links[index].id),
  })

  return (
    <div
      ref={containerRef}
      className="relative hidden items-center rounded-full border border-pill-edge bg-pill p-[5px] backdrop-blur-[20px] lg:flex"
    >
      <LiquidLens state={state} draggable dragHandlers={dragHandlers}>
        {/* The row again, clipped inside the lens. This is what actually bends. */}
        <nav className="flex items-center gap-0.5">
          {links.map((link) => (
            <span
              key={link.id}
              className={`${linkClass} font-semibold text-primary`}
              style={{ width: 'max-content' }}
            >
              {link.label}
            </span>
          ))}
        </nav>
      </LiquidLens>

      <nav aria-label="Primary navigation" className="relative z-[2] flex list-none items-center gap-0.5">
        {links.map((link, i) => (
          <a
            key={link.id}
            ref={itemRef(i)}
            href={`#${link.id}`}
            onClick={(event) => {
              // The browser would otherwise ALSO jump to the anchor instantly —
              // landing it under the fixed header and writing a hash that then
              // overrides scroll restoration on the next reload.
              event.preventDefault()
              onNavigate(i, link.id)
            }}
            aria-current={active === i ? 'location' : undefined}
            className={`${linkClass} z-[1] transition-[color,font-weight] duration-200 ${
              active === i
                ? 'font-semibold text-primary'
                : 'font-medium text-muted hoverable:hover:text-primary'
            }`}
          >
            {link.label}
          </a>
        ))}
      </nav>
    </div>
  )
}
