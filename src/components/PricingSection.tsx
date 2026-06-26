import FadeIn from './FadeIn'

const PLANS = [
  {
    tier: 'Essential',
    price: '$300',
    tag: 'For individuals & small businesses',
    features: [
      'Single-page website',
      'Fully responsive design',
      'Up to 5 sections',
      'Contact form integration',
      'Basic scroll animations',
      '1 round of revisions',
      '7-day delivery',
    ],
    cta: 'Start Essential',
    waMsg: 'Hi Emmanuel, I\'m interested in the Essential plan ($300). Can we talk?',
    highlight: false,
  },
  {
    tier: 'Professional',
    price: '$700',
    tag: 'Most popular',
    features: [
      'Multi-page website (up to 5 pages)',
      'Fully responsive design',
      'Custom animations & interactions',
      'EmailJS or form integration',
      'SEO fundamentals',
      'Performance optimization',
      '2 rounds of revisions',
      '14-day delivery',
    ],
    cta: 'Start Professional',
    waMsg: 'Hi Emmanuel, I\'m interested in the Professional plan ($700). Can we talk?',
    highlight: true,
  },
  {
    tier: 'Signature',
    price: '$1,500',
    tag: 'For brands that want the best',
    features: [
      'Everything in Professional',
      'React / Next.js build',
      'Advanced motion design',
      'CMS integration',
      'Full SEO setup',
      'Performance audit',
      '3 rounds of revisions',
      'Priority support for 30 days',
      '21-day delivery',
    ],
    cta: 'Start Signature',
    waMsg: 'Hi Emmanuel, I\'m interested in the Signature plan ($1,500). Can we talk?',
    highlight: false,
  },
]

export default function PricingSection() {
  return (
    <section className="section pricing-section" id="pricing">
      <div className="container">

        <FadeIn delay={0} y={30} as="div" className="section-label-wrap">
          <span className="section-eyebrow">05. Pricing</span>
          <h2 className="section-title">Transparent pricing</h2>
        </FadeIn>

        <div className="pricing-grid">
          {PLANS.map((plan, i) => (
            <FadeIn key={plan.tier} delay={i * 0.1} y={30}>
              <div className={`pricing-card${plan.highlight ? ' pricing-card--highlight' : ''}`}>

                {plan.highlight && (
                  <span className="pricing-popular-badge">Most Popular</span>
                )}

                <div className="pricing-header">
                  <h3 className="pricing-tier">{plan.tier}</h3>
                  <p className="pricing-tag">{plan.tag}</p>
                  <div className="pricing-price">
                    <span className="pricing-amount">{plan.price}</span>
                    <span className="pricing-per">/ project</span>
                  </div>
                </div>

                <ul className="pricing-features">
                  {plan.features.map(f => (
                    <li key={f} className="pricing-feature">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <polyline points="20 6 9 17 4 12"/>
                      </svg>
                      {f}
                    </li>
                  ))}
                </ul>

                <a
                  href={`https://wa.me/2348169269415?text=${encodeURIComponent(plan.waMsg)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`pricing-cta${plan.highlight ? ' pricing-cta--highlight' : ''}`}
                >
                  {plan.cta}
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </a>

              </div>
            </FadeIn>
          ))}
        </div>

        <FadeIn delay={0.4} y={20} as="p" className="pricing-note">
          All prices are starting rates. Final quote depends on project scope.
          Not sure which plan fits? <a href="https://wa.me/2348169269415?text=Hi%20Emmanuel%2C%20I%20need%20help%20choosing%20a%20plan." target="_blank" rel="noopener noreferrer">Let's talk first.</a>
        </FadeIn>

      </div>
    </section>
  )
}