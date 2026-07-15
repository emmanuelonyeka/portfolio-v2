import FadeIn from './FadeIn'

const PLANS = [
  {
    tier: 'Essential',
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
    waMsg: 'Hi Emmanuel, I\'m interested in the Essential package. Can we discuss my project and budget?',
    highlight: false,
  },
  {
    tier: 'Professional',
    tag: 'Most popular choice',
    scopeBadge: 'Most popular choice',
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
    waMsg: 'Hi Emmanuel, I\'m interested in the Professional package. Can we discuss my project and budget?',
    highlight: true,
  },
  {
    tier: 'Premium',
    tag: 'For ambitious products',
    scopeBadge: 'For brands that mean it',
    features: [
      'Custom React application',
      'Complex animations & interactions',
      'API & third-party integrations',
      'Performance optimization',
      'Full testing & QA',
      'Unlimited revisions',
      'Priority delivery',
    ],
    cta: 'Let\'s Talk',
    waMsg: 'Hi Emmanuel, I\'m interested in the Premium package. Can we discuss my project?',
    highlight: false,
  },
]

export default function packagesSection() {
  return (
    <section 
    className="section packages-section" 
    id="packages"
    style={{
      background: 'var(--border-light)',
      backdropFilter: 'blur(12px)',
      WebkitBackdropFilter: 'blur(12px)',
      borderTop: '1px solid var(--border-subtle)',
      borderBottom: '1px solid var(--border-subtle)',
    }}
    >
      <div className="container">

        <FadeIn delay={0} y={30} as="div" className="section-label-wrap">
          <span className="section-eyebrow">07. Packages</span>
          <h2 className="section-title">Choose your package</h2>
        </FadeIn>

        <div className="packages-grid">
          {PLANS.map((plan, i) => (
            <FadeIn key={plan.tier} delay={i * 0.1} y={30}>
              <div className={`packages-card${plan.highlight ? ' packages-card--highlight' : ''}`}>

                {plan.highlight && (
                  <span className="packages-popular-badge">Most Popular</span>
                )}

                <div className="packages-header">
                  <h3 className="packages-tier">{plan.tier}</h3>
                  <p className="packages-tag">{plan.tag}</p>
                  <div className="packages-scope-badge">{plan.scopeBadge}</div>
                </div>

                <ul className="packages-features">
                  {plan.features.map(f => (
                    <li key={f} className="packages-feature">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <polyline points="20 6 9 17 4 12"/>
                      </svg>
                      {f}
                    </li>
                  ))}
                </ul>

                <a
                  href={`https://wa.me/2348147931141?text=${encodeURIComponent(plan.waMsg)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`packages-cta${plan.highlight ? ' packages-cta--highlight' : ''}`}
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

        <FadeIn delay={0.4} y={20} as="p" className="packages-note">
          All prices are starting rates. Final quote depends on project scope.
          Not sure which plan fits? <a href="https://wa.me/2348147931141?text=Hi%20Emmanuel%2C%20I%20need%20help%20choosing%20a%20plan." target="_blank" rel="noopener noreferrer">Let's talk first.</a>
        </FadeIn>

      </div>
    </section>
  )
}