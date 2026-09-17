import { asset } from '../config/site'
import type { Project } from '../types'

/**
 * Screenshots are numbered in presentation order and grouped by project and
 * viewport. The first desktop image is also the card and video poster.
 * `code` is present only when a repository is intentionally public. Add
 * `purchaseUrl` only after a real Gumroad/store checkout exists; the card badge
 * and purchase action then appear automatically without placeholder links.
 */
const projectCatalog: Project[] = [
  {
    slug: 'lumiere-fine-dining',
    num: '04',
    cat: 'Independent Project',
    name: 'Lumière Fine Dining',
    tabLabel: 'Lumière',
    desc: 'A rule-driven frontend reservation prototype with manual-review paths, party-size rules, EmailJS notifications, and modify and cancel flows.',
    overview: `Lumière is a self-initiated restaurant website built to explore a rule-driven reservation experience in plain HTML, CSS and JavaScript. Because it has no shared database or server-side inventory, the booking flow is a frontend prototype rather than a production reservation platform.\n\nStandard tables receive immediate confirmation, while Private Dining enquiries and parties above six move to manual review. Those branches are controlled by explicit party-size, experience, time-slot and blackout-date rules instead of scattered conditionals.\n\nEmailJS sends a guest receipt and a staff notification. The same booking reference supports modify and cancel flows, so each action has to reconcile with the booking's latest state.\n\nAfter testing exposed a missing Private Dining minimum, I reviewed the complete flow instead of patching one branch. The resulting acceptance checks made the rules visible and easier to verify. The wider site also includes an eight-category menu, experience deep links, a filterable gallery and tab-routed legal pages.`,
    highlights: [
      'Self-initiated frontend prototype with explicit reservation states and configurable rules',
      'Private Dining and parties over six route to manual review rather than instant confirmation',
      'Separate EmailJS notifications for guests and staff',
      'Modify and cancel flows reconcile against the latest booking state',
      'Experiences deep-link into the form pre-selected via query parameters',
      'Seven pages, an eight-category filterable menu, filterable gallery and tab-routed legal pages',
      'Config-driven: opening hours, table sizes, blackout dates and EmailJS all live in one file',
    ],
    period: 'May 2026',
    hardPart: `The first deployed version handled the expected paths but missed an important rule: a Private Dining enquiry below the ten-person minimum could continue without a clear explanation.\n\nI reproduced the case, redrew every booking outcome, and compared the interface against the business rules. That review exposed six other unstated conditions, which I moved into explicit acceptance checks and configuration instead of adding isolated patches.\n\nThe process changed how I work: edge cases are now written and tested alongside the happy path before I call an interaction complete.`,
    tech: ['HTML', 'CSS', 'JavaScript', 'EmailJS'],
    href: 'https://lumiere-cuisine.netlify.app',
    purchaseUrl: 'https://emmanuelonyekachi.gumroad.com/l/eagwaj',
    video: asset('videos/projects/lumiere-preview.mp4'),
    desktopImages: [
      asset('images/projects/lumiere/desktop/01-hero.webp'),
      asset('images/projects/lumiere/desktop/02-menu.webp'),
      asset('images/projects/lumiere/desktop/03-dining-experiences.webp'),
      asset('images/projects/lumiere/desktop/04-reservation-confirmation.webp'),
      asset('images/projects/lumiere/desktop/05-modify-reservation.webp'),
    ],
    mobileImages: [
      asset('images/projects/lumiere/mobile/01-hero.webp'),
      asset('images/projects/lumiere/mobile/02-menu.webp'),
      asset('images/projects/lumiere/mobile/03-dining-experiences.webp'),
      asset('images/projects/lumiere/mobile/04-reservation-calendar.webp'),
      asset('images/projects/lumiere/mobile/05-cancellation-confirmation.webp'),
    ],
    tabColor: '#c9a84c',
    tabColorLight: '#7a5f14',
    tabBg: 'var(--surface-hover)',
  },
  {
    slug: 'primenest-realty',
    num: '02',
    cat: 'Commercial Template',
    name: 'PrimeNest Realty',
    tabLabel: 'PrimeNest',
    desc: 'A luxury real estate site rebuilt in React, TypeScript and Tailwind as a configurable template intended for sale and handover.',
    overview: `PrimeNest began as a static HTML, CSS and JavaScript project and was rebuilt as a React, TypeScript and Tailwind template intended for sale. Content is grouped in typed data files, while frequently changed business details and brand settings are centralised for easier handover.\n\nThe static version exposed repeated values and tightly coupled page content. The migration focused on turning those patterns into reusable components without losing the original visual direction. I moved section by section, checking the rebuilt output against the existing design rather than approximating it.\n\nThe template includes dynamic property listings with filtering and sorting, saved properties, comparison tools, article navigation, and an embedded mortgage calculator. The goal is a buyer-friendly starting point whose content can change without rewriting the interface.`,
    highlights: [
      'Rebuilt from static HTML/CSS/JS into React, TypeScript and Tailwind',
      'Built as a commercial template with content, business details and brand settings separated',
      'Repeated static patterns converted into reusable typed components',
      'Ported section by section against the original visual direction',
      'Multi-page architecture with shared configuration and structured datasets',
      'Dynamic listings with filter and sort, plus an embedded mortgage calculator',
    ],
    period: 'August 2026',
    hardPart: `The static build looked finished, but its content and presentation were tightly coupled. A demo phone number appeared across several files, so a routine content change created unnecessary search-and-replace work and a real risk of inconsistent values.\n\nA sellable template has to be maintainable by someone who did not build it. I identified the values a buyer would change most often, separated them into configuration and data files, and replaced repeated page structures with reusable components.\n\nThe difficult part was preserving behavior during the migration. Filters, sorting, saved properties, comparison state, article navigation, and responsive layouts all had to survive the move to React and TypeScript without changing the intended experience.`,
    tech: ['React', 'TypeScript', 'Tailwind', 'Vite'],
    href: 'https://primenest-realty-ng.netlify.app',
    video: asset('videos/projects/primenest-preview.mp4'),
    desktopImages: [
      asset('images/projects/primenest/desktop/01-hero.webp'),
      asset('images/projects/primenest/desktop/02-property-listings.webp'),
      asset('images/projects/primenest/desktop/03-founder.webp'),
      asset('images/projects/primenest/desktop/04-agents.webp'),
      asset('images/projects/primenest/desktop/05-contact.webp'),
    ],
    mobileImages: [
      asset('images/projects/primenest/mobile/01-hero.webp'),
      asset('images/projects/primenest/mobile/02-property-listings.webp'),
      asset('images/projects/primenest/mobile/03-property-detail.webp'),
      asset('images/projects/primenest/mobile/04-navigation-menu.webp'),
      asset('images/projects/primenest/mobile/05-article.webp'),
    ],
    tabColor: '#4f8ef7',
    tabColorLight: '#245cba',
    tabBg: 'var(--surface-hover)',
  },
  {
    slug: 'nairasave',
    num: '03',
    cat: 'Team Challenge',
    name: 'NairaSave',
    tabLabel: 'NairaSave',
    desc: 'An eight-person fintech entry for the NTTS frontend challenge, where I owned key interactive features and the final deployment.',
    overview: `NairaSave was an eight-person entry for the Nigerian Tech Talent Spotlight frontend challenge. I built the live USD-to-NGN converter, savings projection chart, header, footer, and early-signup flow — roughly a quarter of the implementation — and published the final deployment from my GitHub repository.\n\nThe converter and projection chart were built without adding specialist libraries for two focused interactions. Team changes moved through separate branches and pull-request review before merge.\n\nOur submission scored highly enough to advance to the next stage of the challenge.`,
    highlights: [
      'Owned roughly a quarter of the implementation and published the final deployment',
      'Live USD/NGN converter built from scratch',
      'Savings projection chart hand-drawn rather than pulling in a charting library',
      'Branch and PR workflow across the team, reviewed before merge',
      'Scored high enough to advance to the next stage of the challenge',
    ],
    period: 'June 2026',
    hardPart: `This was my first project inside a shared repository. The technical work had to fit a team process: contributors used separate branches, changes were reviewed before merge, and the deployed branch had to remain stable while several people worked at once.\n\nSome teammates focused on testing rather than owning sections. That separation caught a light-and-dark-theme bug the implementers had missed.\n\nThe lesson was practical: implementation and review are different jobs. Since then, I treat an independent testing pass as part of the work rather than relying only on the person who wrote the feature.`,
    tech: ['React', 'Vite', 'Tailwind', 'Framer Motion'],
    href: 'https://teamguru-frontend.netlify.app',
    code: 'https://github.com/emmanuelonyeka/nairasave/',
    video: asset('videos/projects/nairasave-preview.mp4'),
    desktopImages: [
      asset('images/projects/nairasave/desktop/01-hero.webp'),
      asset('images/projects/nairasave/desktop/02-currency-calculator.webp'),
      asset('images/projects/nairasave/desktop/03-waitlist-success.webp'),
      asset('images/projects/nairasave/desktop/04-savings-dashboard.webp'),
    ],
    mobileImages: [
      asset('images/projects/nairasave/mobile/01-hero.webp'),
      asset('images/projects/nairasave/mobile/02-currency-calculator.webp'),
      asset('images/projects/nairasave/mobile/03-waitlist.webp'),
      asset('images/projects/nairasave/mobile/04-savings-dashboard.webp'),
    ],
    tabColor: '#4ade80',
    tabColorLight: '#16753c',
    tabBg: 'var(--surface-hover)',
  },
  {
    slug: 'solara-jets',
    num: '01',
    cat: 'Independent Template',
    name: 'Solara Jets',
    tabLabel: 'Solara Jets',
    desc: 'A self-initiated private aviation template built with React and TypeScript, featuring GSAP pinned-scroll sections tested down to 350px.',
    overview: `Solara is a self-initiated frontend showcase and configurable template, not an operating aviation service. Its central interaction uses GSAP ScrollTrigger and Lenis to coordinate pinned homepage sections across desktop and mobile layouts.\n\nPin spacers change document height, transformed ancestors affect fixed positioning, and narrow screens leave little room for overlapping content. I tested the homepage down to 350px, the documented floor of the current responsive range, and used fluid \`clamp()\` sizing across key typography and spacing scales.\n\nContent is grouped in data files and brand settings are centralised so a future buyer can replace business information without rebuilding the visual system.`,
    highlights: [
      'GSAP ScrollTrigger pinned sections tested from wide desktop down to 350px',
      'Fluid clamp() sizing across key typography and spacing scales',
      'Lenis smooth scroll integrated with the pinned timeline',
      'Template-ready: content in data files, brand in one config, minimal setup to go live',
      'Route-based React architecture with content separated into 19 data files',
      'React and TypeScript throughout, fully typed',
    ],
    period: 'September 2026',
    hardPart: `The first pinned-scroll implementation was not stable across breakpoints. Trigger calculations changed as pin spacers altered document height, and a transformed ancestor interfered with fixed positioning. I isolated each condition, rebuilt the timeline around measured section geometry, and retested the transitions at the target widths.\n\nAt 350px, one heading still collided with its neighboring image. The fix was partly visual rather than purely technical: I adjusted the image treatment where the elements meet so the text remains readable without removing the intended composition.\n\nThat work gave the project a clear testing boundary and documented the interaction assumptions a future maintainer would need.`,
    tech: ['React', 'TypeScript', 'Tailwind', 'GSAP'],
    href: 'https://solara-aviation.netlify.app',
    video: asset('videos/projects/solara-preview.mp4'),
    desktopImages: [
      asset('images/projects/solara/desktop/01-hero.webp'),
      asset('images/projects/solara/desktop/02-quote-request.webp'),
      asset('images/projects/solara/desktop/03-fleet.webp'),
      asset('images/projects/solara/desktop/04-destinations.webp'),
      asset('images/projects/solara/desktop/05-team.webp'),
    ],
    mobileImages: [
      asset('images/projects/solara/mobile/01-hero.webp'),
      asset('images/projects/solara/mobile/02-contact.webp'),
      asset('images/projects/solara/mobile/03-charter-pricing.webp'),
      asset('images/projects/solara/mobile/04-quote-calendar.webp'),
      asset('images/projects/solara/mobile/05-navigation-menu.webp'),
    ],
    tabColor: '#d97706',
    tabColorLight: '#9a4f08',
    tabBg: 'var(--surface-hover)',
  },
]

/** Lead with the work that most directly supports a React and TypeScript role. */
const recruiterOrder = ['Solara Jets', 'PrimeNest Realty', 'NairaSave', 'Lumière Fine Dining']

export const projects: Project[] = recruiterOrder.map((name) => {
  const project = projectCatalog.find((entry) => entry.name === name)
  if (!project) throw new Error(`Project not found: ${name}`)
  return project
})
