/** @type {import('tailwindcss').Config} */
import plugin from 'tailwindcss/plugin'

/*
 * Colour names below map onto the CSS custom properties in src/index.css.
 * Tokens defined as channel triplets accept Tailwind's opacity modifier
 * (bg-surface/60, text-accent/25); tokens that already carry a fixed alpha
 * are exposed under their own name instead.
 *
 *   bg-main / bg-elevated / bg-surface / bg-surface-hover
 *   text-primary / text-secondary / text-muted
 *   text-accent / bg-accent / border-accent      (+ /8 /12 /25 /40 as needed)
 *   text-accent-contrast / text-warning
 *   border-edge / border-edge-faint / border-edge-strong
 *   text-status / bg-status-pill / border-status-edge
 *   bg-nav / bg-pill / border-pill-edge
 *   text-danger / border-danger / bg-danger/10   (form errors)
 *   text-success / border-success/30 / bg-success/10
 */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  // The Container component owns page gutters. Leaving Tailwind's own
  // `container` utility enabled means a stray class name silently gets
  // different padding rules.
  corePlugins: { container: false },
  theme: {
    extend: {
      colors: {
        main: 'rgb(var(--bg-main-rgb) / <alpha-value>)',
        elevated: 'rgb(var(--bg-elevated-rgb) / <alpha-value>)',
        surface: {
          DEFAULT: 'rgb(var(--surface-rgb) / <alpha-value>)',
          hover: 'rgb(var(--surface-hover-rgb) / <alpha-value>)',
        },
        accent: 'rgb(var(--accent-rgb) / <alpha-value>)',
        'accent-contrast': 'rgb(var(--accent-contrast-rgb) / <alpha-value>)',
        primary: 'rgb(var(--text-primary-rgb) / <alpha-value>)',
        secondary: 'rgb(var(--text-secondary-rgb) / <alpha-value>)',
        muted: 'rgb(var(--text-muted-rgb) / <alpha-value>)',
        edge: {
          DEFAULT: 'var(--border-subtle)',
          faint: 'var(--border-light)',
          strong: 'var(--border-strong)',
          control: 'var(--control-border)',
        },
        status: 'rgb(var(--status-green-rgb) / <alpha-value>)',
        /* Form feedback. `success` reuses the status-pill green (46 204 113). */
        danger: 'rgb(var(--danger-rgb) / <alpha-value>)',
        warning: 'rgb(var(--warning-rgb) / <alpha-value>)',
        success: 'rgb(var(--status-pill-rgb) / <alpha-value>)',
        'status-pill': 'var(--status-pill-bg)',
        'status-edge': 'var(--status-pill-border)',
        nav: 'var(--nav-bg)',
        pill: 'var(--pill-bg)',
        'pill-edge': 'var(--pill-border)',
      },

      fontFamily: {
        sans: ['Space Grotesk', 'sans-serif'],
        mono: ['JetBrains Mono', 'SF Mono', 'monospace'],
      },

      boxShadow: {
        card: 'var(--shadow-card)',
      },

      transitionTimingFunction: {
        smooth: 'var(--ease)',
        spring: 'var(--ease-spring)',
      },

      spacing: {
        nav: 'var(--navbar-height)',
      },

      screens: {
        xs: '480px',
      },

      /* The alpha steps this design actually uses, so bg-accent/12 and
         border-edge/6 resolve instead of silently generating nothing. */
      opacity: {
        2: '0.02',
        4: '0.04',
        6: '0.06',
        8: '0.08',
        12: '0.12',
        14: '0.14',
        15: '0.15',
        22: '0.22',
        35: '0.35',
        45: '0.45',
        85: '0.85',
      },

      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-15px)' },
        },
        'luxury-spin': {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        'modal-fade-in': {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        'modal-slide-in': {
          from: { opacity: '0', transform: 'translateY(24px) scale(0.97)' },
          to: { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
        'soft-pulse': {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '.45', transform: 'scale(0.8)' },
        },
        'slide-right': {
          '0%, 100%': { transform: 'translateX(0)' },
          '50%': { transform: 'translateX(10px)' },
        },
        'status-pulse': {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.5', transform: 'scale(0.72)' },
        },
        'hero-cursor-blink': {
          '0%, 49%': { opacity: '1' },
          '50%, 100%': { opacity: '0' },
        },
      },

      animation: {
        float: 'float 6s ease-in-out infinite',
        'luxury-spin': 'luxury-spin 0.65s cubic-bezier(0.4, 0, 0.2, 1) infinite',
        'modal-fade-in': 'modal-fade-in 0.3s ease',
        'modal-slide-in': 'modal-slide-in 0.35s cubic-bezier(.22, 1, .36, 1)',
        'soft-pulse': 'soft-pulse 2s ease-in-out infinite',
        'slide-right': 'slide-right 2.5s ease-in-out infinite',
        'status-pulse': 'status-pulse 2s ease-in-out infinite',
        'hero-cursor-blink': 'hero-cursor-blink 1000ms steps(1, end) 3 forwards',
      },
    },
  },
  plugins: [
    /* `hoverable:hover:` only applies on devices with a real pointer, so hover
       styles never stick after a tap on touch screens. */
    plugin(({ addVariant }) => {
      addVariant('hoverable', '@media (hover: hover) and (pointer: fine)')
      /* Matches the class the theme toggle puts on <html>. */
      addVariant('theme-light', 'html.theme-light &')
    }),
  ],
}
