import type { Package } from '../types'

export const packages: Package[] = [
  {
    tier: 'Essential',
    price: 'From ₦150,000',
    tag: 'For individuals & small businesses',
    scopeBadge: 'Great starting point',
    features: [
      'Single-page website',
      'Fully responsive design',
      'Up to 5 sections',
      'Contact form integration',
      'Basic scroll animations',
      '1 round of revisions',
      '7-day delivery',
    ],
    cta: 'Get a Quote',
    whatsappMessage:
      "Hi Emmanuel, I'm interested in the Essential package. Can we discuss my project and budget?",
    highlight: false,
  },
  {
    tier: 'Professional',
    price: 'From ₦350,000',
    tag: 'For growing businesses',
    scopeBadge: 'The complete build',
    features: [
      'Multi-page website (up to 5 pages)',
      'Fully responsive design',
      'Custom animations & interactions',
      'EmailJS or form integration',
      'SEO fundamentals',
      '2 rounds of revisions',
      '14-day delivery',
    ],
    cta: 'Get a Quote',
    whatsappMessage:
      "Hi Emmanuel, I'm interested in the Professional package. Can we discuss my project and budget?",
    highlight: true,
  },
  {
    tier: 'Premium',
    price: 'From ₦750,000',
    tag: 'For ambitious products',
    scopeBadge: 'For brands that mean it',
    features: [
      'Custom React application',
      'Complex animations & interactions',
      'API & third-party integrations',
      'Performance optimization',
      'Cross-device and browser QA',
      'Revision plan agreed during scoping',
      'Launch and handover support',
    ],
    cta: "Let's Talk",
    whatsappMessage:
      "Hi Emmanuel, I'm interested in the Premium package. Can we discuss my project?",
    highlight: false,
  },
]

/** Shown under the package grid. */
export const packagesNote =
  'These are starting prices, not final quotes. Every project is different — tell me what you need and I will scope it honestly. International projects are quoted in USD or GBP.'

/** The follow-up line and its WhatsApp link. */
export const packagesHelp = {
  prompt: 'Not sure which plan fits?',
  linkLabel: "Let's talk first.",
  whatsappMessage: 'Hi Emmanuel, I need help choosing a plan.',
}
