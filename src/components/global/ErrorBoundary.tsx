import { Component } from 'react'
import type { ErrorInfo, ReactNode } from 'react'
import { site } from '../../config/site'

interface ErrorBoundaryProps {
  children: ReactNode
}

interface ErrorBoundaryState {
  failed: boolean
}

/** Last-resort UI for unexpected render failures; feature-level errors stay local. */
export default class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  state: ErrorBoundaryState = { failed: false }

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { failed: true }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('Portfolio render failed:', error, info.componentStack)
  }

  render() {
    if (!this.state.failed) return this.props.children

    return (
      <main className="relative z-10 grid min-h-screen place-items-center bg-main px-6 py-16 text-primary">
        <section
          role="alert"
          aria-labelledby="unexpected-error-title"
          className="w-full max-w-[640px] rounded-2xl border border-edge-strong bg-surface p-[clamp(1.5rem,6vw,3.5rem)] shadow-card"
        >
          <span className="font-mono text-[0.75rem] font-semibold uppercase tracking-[0.14em] text-accent">
            Something went wrong
          </span>
          <h1
            id="unexpected-error-title"
            className="mb-4 mt-3 text-[clamp(2rem,7vw,3.75rem)] font-bold leading-[1.05] tracking-[-0.04em]"
          >
            The portfolio could not finish loading.
          </h1>
          <p className="max-w-[520px] text-[clamp(0.95rem,2vw,1.05rem)] leading-[1.75] text-muted">
            Your connection may be fine. Reload once, or return to the homepage. If the problem
            continues, email {site.name} directly.
          </p>

          <div className="mt-8 flex flex-col gap-3 min-[421px]:flex-row">
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="press lit inline-flex min-h-11 items-center justify-center rounded-lg bg-accent px-6 py-3 text-sm font-semibold text-accent-contrast transition-[transform,background-color] duration-300 hoverable:hover:-translate-y-0.5 hoverable:hover:bg-accent/90"
            >
              Reload page
            </button>
            <a
              href="/"
              className="press inline-flex min-h-11 items-center justify-center rounded-lg border border-edge-strong px-6 py-3 text-sm font-semibold text-primary no-underline transition-[transform,border-color,color] duration-300 hoverable:hover:border-accent/35 hoverable:hover:text-accent"
            >
              Return home
            </a>
            <a
              href={`mailto:${site.email}`}
              className="press inline-flex min-h-11 items-center justify-center rounded-lg border border-edge-strong px-6 py-3 text-sm font-semibold text-primary no-underline transition-[transform,border-color,color] duration-300 hoverable:hover:border-accent/35 hoverable:hover:text-accent"
            >
              Email me
            </a>
          </div>
        </section>
      </main>
    )
  }
}
