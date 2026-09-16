import type { ReactNode, SVGProps } from 'react'
import type { IconName } from '../../types'

interface Shape {
  /** Defaults to '0 0 24 24'. */
  viewBox?: string
  /** Solid marks paint with fill; everything else renders as a stroked outline. */
  filled?: boolean
  children: ReactNode
}

/**
 * Every icon on the site, in one place. Adding one here makes it available
 * everywhere and type-safe, because `IconName` is what data files reference.
 */
const SHAPES: Record<IconName, Shape> = {
  // ---- navigation & controls -------------------------------------------
  arrowRight: {
    children: <path d="M5 12h14M12 5l7 7-7 7" />,
  },
  chevronLeft: {
    children: <polyline points="15 18 9 12 15 6" />,
  },
  chevronRight: {
    children: <polyline points="9 18 15 12 9 6" />,
  },
  close: {
    children: (
      <>
        <line x1="18" y1="6" x2="6" y2="18" />
        <line x1="6" y1="6" x2="18" y2="18" />
      </>
    ),
  },
  check: {
    children: <polyline points="20 6 9 17 4 12" />,
  },
  search: {
    children: (
      <>
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
      </>
    ),
  },
  download: {
    children: (
      <>
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
        <polyline points="7 10 12 15 17 10" />
        <line x1="12" y1="15" x2="12" y2="3" />
      </>
    ),
  },
  externalLink: {
    children: (
      <>
        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
        <polyline points="15 3 21 3 21 9" />
        <line x1="10" y1="14" x2="21" y2="3" />
      </>
    ),
  },
  link: {
    children: (
      <>
        <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
        <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
      </>
    ),
  },
  alertCircle: {
    children: (
      <>
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="8" x2="12" y2="12" />
        <line x1="12" y1="16" x2="12.01" y2="16" />
      </>
    ),
  },

  // ---- theme toggle ----------------------------------------------------
  sun: {
    children: (
      <>
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
      </>
    ),
  },
  moon: {
    children: <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />,
  },

  // ---- services --------------------------------------------------------
  code: {
    children: (
      <>
        <polyline points="16 18 22 12 16 6" />
        <polyline points="8 6 2 12 8 18" />
      </>
    ),
  },
  layout: {
    children: (
      <>
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <path d="M3 9h18M9 21V9" />
      </>
    ),
  },
  layers: {
    children: (
      <>
        <path d="M12 2L2 7l10 5 10-5-10-5z" />
        <path d="M2 17l10 5 10-5" />
        <path d="M2 12l10 5 10-5" />
      </>
    ),
  },
  clock: {
    children: (
      <>
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </>
    ),
  },
  component: {
    children: (
      <path d="M18 3a3 3 0 0 0-3 3v12a3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3H6a3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3V6a3 3 0 0 0-3-3 3 3 0 0 0-3 3 3 3 0 0 0 3 3h12a3 3 0 0 0 3-3 3 3 0 0 0-3-3z" />
    ),
  },
  package: {
    children: (
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
    ),
  },

  // ---- skills ----------------------------------------------------------
  html5: {
    children: (
      <>
        <path d="M5 3h14l-1.3 15-5.7 3-5.7-3L5 3z" />
        <path d="M8.2 7h7.9l-.25 3H8.5l.35 4.2 3.15.85 3.1-.85.2-2.1" />
      </>
    ),
  },
  css3: {
    children: (
      <>
        <path d="M5 3h14l-1.3 15-5.7 3-5.7-3L5 3z" />
        <path d="M8 7h8l-5.8 3.2h5.5l-.55 4-3.15.85-3.1-.85" />
      </>
    ),
  },
  javascript: {
    children: (
      <>
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <path d="M10.5 9v6.2c0 1.25-.7 1.8-1.75 1.8-.8 0-1.35-.35-1.75-.9M17.5 10.1c-.45-.75-1.1-1.1-2-1.1-1.15 0-2 .65-2 1.55 0 2.45 4.5 1.25 4.5 4.15 0 1.35-1.05 2.3-2.65 2.3-1.15 0-2.05-.45-2.65-1.35" />
      </>
    ),
  },
  react: {
    children: (
      <>
        <circle cx="12" cy="12" r="1.7" />
        <ellipse cx="12" cy="12" rx="9.5" ry="3.7" />
        <ellipse cx="12" cy="12" rx="9.5" ry="3.7" transform="rotate(60 12 12)" />
        <ellipse cx="12" cy="12" rx="9.5" ry="3.7" transform="rotate(120 12 12)" />
      </>
    ),
  },
  tailwind: {
    children: (
      <>
        <path d="M3 9.5c2.2-3.3 4.7-4.1 7.5-2.5 1.55.9 2.15 2.45 3.7 2.75 1.65.3 3.25-.55 4.8-2.55" />
        <path d="M5 15.5c2.2-3.3 4.7-4.1 7.5-2.5 1.55.9 2.15 2.45 3.7 2.75 1.65.3 3.25-.55 4.8-2.55" />
      </>
    ),
  },
  typescript: {
    children: (
      <>
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <path d="M6.5 9h6M9.5 9v8M17.8 10.2c-.45-.8-1.1-1.2-2-1.2-1.15 0-2 .65-2 1.55 0 2.45 4.4 1.25 4.4 4.15 0 1.35-1.05 2.3-2.65 2.3-1.1 0-2-.45-2.6-1.3" />
      </>
    ),
  },
  framerMotion: {
    children: (
      <>
        <path d="M6 3h12l-6 6H6V3zM6 9h6l6 6H6V9zM6 15h6v6l-6-6z" />
      </>
    ),
  },
  gsap: {
    children: (
      <>
        <path d="M4 7h13M4 12h10M4 17h7" />
        <path d="M17 10l3 2-3 2" />
      </>
    ),
  },
  git: {
    children: (
      <>
        <path d="M12 2l10 10-10 10L2 12 12 2z" />
        <circle cx="9" cy="8.5" r="1.3" />
        <circle cx="15.5" cy="15" r="1.3" />
        <path d="M10 9.5l4.5 4.5M9 9.8v5.7" />
      </>
    ),
  },
  vite: {
    children: (
      <>
        <path d="M4 4l8 17 8-17-8 3-8-3z" />
        <path d="M13.5 2L9 12h4l-2 8 5-11h-4l1.5-7z" />
      </>
    ),
  },
  nextjs: {
    children: (
      <>
        <circle cx="12" cy="12" r="9.5" />
        <path d="M8 16V8l8 9M15.5 8v5" />
      </>
    ),
  },
  nodejs: {
    children: (
      <>
        <path d="M12 2.5l8 4.7v9.6l-8 4.7-8-4.7V7.2l8-4.7z" />
        <path d="M8.5 15.5v-7l7 7v-7" />
      </>
    ),
  },
  tanstack: {
    children: (
      <>
        <path d="M5 6h14l-3 4H8L5 6zM8 10h8l3 4H5l3-4zM5 14h14l-4 4H9l-4-4z" />
      </>
    ),
  },
  supabase: {
    children: (
      <>
        <path d="M13 2L5 13h7l-1 9 8-12h-7l1-8z" />
      </>
    ),
  },
  accessibility: {
    children: (
      <>
        <circle cx="12" cy="4" r="2" />
        <path d="M5 8h14M12 8v13M8 21l4-7 4 7M7 8l2 6M17 8l-2 6" />
      </>
    ),
  },
  performance: {
    children: (
      <>
        <path d="M4.2 18a9 9 0 1 1 15.6 0" />
        <path d="M12 12l5-3M7 18h10" />
        <circle cx="12" cy="12" r="1" />
      </>
    ),
  },
  designSystem: {
    children: (
      <>
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
      </>
    ),
  },
  codeReview: {
    children: (
      <>
        <circle cx="6" cy="5" r="2" />
        <circle cx="6" cy="19" r="2" />
        <path d="M6 7v10M8 7c6 0 8 2 8 6" />
        <path d="M13.5 17l2 2 4-5" />
      </>
    ),
  },
  responsive: {
    children: (
      <>
        <rect x="2.5" y="4" width="14" height="11" rx="1.5" />
        <path d="M7 20h5M9.5 15v5" />
        <rect x="16" y="9" width="5.5" height="11" rx="1.2" />
      </>
    ),
  },
  debug: {
    children: (
      <>
        <path d="M8 8h8v7a4 4 0 0 1-8 0V8zM9 5l3 3 3-3M5 10h3M16 10h3M5 15h3M16 15h3M7 20l2-2M17 20l-2-2" />
      </>
    ),
  },

  // ---- contact & brand marks ------------------------------------------
  mail: {
    children: (
      <>
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
        <polyline points="22,6 12,13 2,6" />
      </>
    ),
  },
  github: {
    filled: true,
    children: (
      <path d="M12 .5C5.65.5.5 5.65.5 12a11.5 11.5 0 008 10.94c.58.1.79-.25.79-.56v-2.17c-3.26.71-3.95-1.57-3.95-1.57-.53-1.34-1.29-1.7-1.29-1.7-1.06-.72.08-.7.08-.7 1.17.08 1.79 1.2 1.79 1.2 1.04 1.77 2.74 1.26 3.4.97.1-.75.41-1.26.74-1.55-2.6-.3-5.34-1.3-5.34-5.8 0-1.28.46-2.32 1.2-3.14-.12-.3-.52-1.5.12-3.12 0 0 .98-.31 3.2 1.2a11.1 11.1 0 015.82 0c2.22-1.5 3.2-1.2 3.2-1.2.64 1.62.24 2.82.12 3.12.74.82 1.2 1.86 1.2 3.14 0 4.52-2.75 5.5-5.37 5.8.42.36.8 1.08.8 2.17v3.22c0 .31.2.67.8.56A11.5 11.5 0 0023.5 12C23.5 5.65 18.35.5 12 .5z" />
    ),
  },
  linkedin: {
    filled: true,
    children: (
      <path d="M4.98 3.5C4.98 5 3.87 6.1 2.5 6.1S0 5 0 3.5 1.1.9 2.5.9 4.98 2 4.98 3.5zM.4 8.1h4.2V24H.4zM8.4 8.1h4v2.2h.06c.56-1 1.94-2.2 4-2.2 4.28 0 5.07 2.82 5.07 6.5V24h-4.2v-7.7c0-1.84-.03-4.2-2.56-4.2-2.56 0-2.95 2-2.95 4.07V24H8.4z" />
    ),
  },
  x: {
    filled: true,
    children: <path d="M18.9 1H22l-7.6 8.7L23 23h-6.9l-5.4-7.1L4.7 23H1.6l8.1-9.3L1 1h7l5 6.6L18.9 1z" />,
  },
  whatsapp: {
    filled: true,
    children: (
      <path d="M12 2a10 10 0 0 0-8.66 15l-1.34 4.9 5.02-1.32A10 10 0 1 0 12 2zm0 18a8 8 0 0 1-4.07-1.1l-.29-.17-2.98.78.8-2.9-.19-.3A8 8 0 1 1 12 20zm4.48-5.69c-.25-.12-1.47-.73-1.7-.82-.23-.08-.4-.12-.57.12-.17.25-.65.82-.8.99-.14.17-.29.19-.54.06-.25-.12-1.06-.39-2.01-1.24-.74-.66-1.24-1.48-1.39-1.73-.14-.25-.02-.38.1-.5.1-.1.25-.27.37-.4.12-.14.17-.25.25-.42.08-.17.04-.31-.02-.44-.06-.12-.57-1.37-.78-1.88-.2-.48-.41-.41-.57-.42h-.48c-.17 0-.44.06-.67.31-.23.25-.88.86-.88 2.1 0 1.24.9 2.43 1.03 2.6.12.17 1.77 2.7 4.29 3.78.6.26 1.07.42 1.43.54.6.19 1.15.16 1.58.1.48-.07 1.47-.6 1.68-1.18.21-.58.21-1.07.14-1.18-.06-.1-.23-.17-.48-.29z" />
    ),
  },
}

export interface IconProps extends Omit<SVGProps<SVGSVGElement>, 'children'> {
  name: IconName
  /** Rendered width and height in px. */
  size?: number
  /**
   * Accessible name. Omit for decorative icons — they are then hidden from
   * assistive technology, which is correct when adjacent text already says it.
   */
  label?: string
}

export function Icon({ name, size = 24, strokeWidth = 2, label, ...rest }: IconProps) {
  const shape = SHAPES[name]
  const stroked = !shape.filled

  return (
    <svg
      width={size}
      height={size}
      viewBox={shape.viewBox ?? '0 0 24 24'}
      fill={stroked ? 'none' : 'currentColor'}
      stroke={stroked ? 'currentColor' : undefined}
      strokeWidth={stroked ? strokeWidth : undefined}
      strokeLinecap={stroked ? 'round' : undefined}
      strokeLinejoin={stroked ? 'round' : undefined}
      role={label ? 'img' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      focusable="false"
      {...rest}
    >
      {shape.children}
    </svg>
  )
}
