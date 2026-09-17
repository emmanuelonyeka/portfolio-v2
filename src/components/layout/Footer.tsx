import { site } from '../../config/site'
import { footerLinks } from '../../data/navigation'
import { footerConnectLinks } from '../../data/contact'
import { scrollToSection, scrollToTop } from '../../lib/scrollToSection'
import { Container } from '../ui/Container'
import { LogoMark } from '../global/LogoMark'

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="border-y border-edge bg-edge-faint pt-[clamp(3rem,6vw,5rem)]">
      <Container className="mb-[clamp(1.5rem,3vw,2.5rem)] grid grid-cols-1 gap-[clamp(2rem,5vw,80px)] pb-[clamp(2rem,4vw,3rem)] min-[501px]:grid-cols-2 min-[861px]:grid-cols-[1.6fr_1fr_1fr]">
        <div className="col-span-full flex flex-col gap-4 min-[861px]:col-auto">
          <a
            href="#hero"
            onClick={(event) => {
              event.preventDefault()
              scrollToTop()
            }}
            aria-label="Back to top"
            title="Back to top"
            className="flex min-h-11 w-fit items-center whitespace-nowrap no-underline"
          >
            <LogoMark compact />
          </a>

          <p className="max-w-[260px] text-sm leading-[1.65] text-muted">
            Building fast, refined web experiences
            <br />
            engineered with precision.
          </p>

          <div className="inline-flex items-center gap-2 text-[0.78rem] font-medium text-status">
            <span aria-hidden="true" className="h-[7px] w-[7px] shrink-0 animate-status-pulse rounded-full bg-status motion-reduce:animate-none" />
            {site.availability.label}
          </div>
        </div>

        <nav aria-labelledby="footer-sections" className="flex flex-col gap-4">
          <h2
            id="footer-sections"
            className="text-[0.75rem] font-semibold uppercase tracking-[0.1em] text-primary"
          >
            Sections
          </h2>
          <ul className="flex list-none flex-col gap-2.5 p-0">
            {footerLinks.map(({ id, label }) => (
              <li key={id}>
                <a
                  href={`#${id}`}
                  onClick={(event) => {
                    event.preventDefault()
                    scrollToSection(id)
                  }}
                  className="inline-block text-sm text-muted no-underline transition-[color,transform] duration-200 hoverable:hover:translate-x-1 hoverable:hover:text-accent"
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-labelledby="footer-connect" className="flex flex-col gap-4">
          <h2
            id="footer-connect"
            className="text-[0.75rem] font-semibold uppercase tracking-[0.1em] text-primary"
          >
            Connect
          </h2>
          <ul className="flex list-none flex-col gap-2.5 p-0">
            {footerConnectLinks.map(({ label, href, external }) => (
              <li key={label}>
                <a
                  href={href}
                  {...(external && { target: '_blank', rel: 'noopener noreferrer' })}
                  className="inline-block text-sm text-muted no-underline transition-[color,transform] duration-200 hoverable:hover:translate-x-1 hoverable:hover:text-accent"
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </Container>

      <Container className="flex flex-col items-center gap-4 border-t border-edge py-9 text-center min-[601px]:flex-row min-[601px]:justify-between min-[601px]:text-left">
        <p className="text-[0.78rem] text-muted">
          © {year} {site.name}. All rights reserved.
        </p>
        <p className="text-[0.78rem] text-muted">
          Designed &amp; built in {site.location.city}, {site.location.country}
        </p>
      </Container>
    </footer>
  )
}
