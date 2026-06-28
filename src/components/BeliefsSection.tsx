import FadeIn from './FadeIn'

const BELIEFS = [
  {
    num: '01',
    title: 'Consistency over talent',
    desc: 'Talent gets you noticed. Consistency gets the work done. I show up, meet deadlines, and deliver — every time.',
  },
  {
    num: '02',
    title: 'Think before you type',
    desc: 'The best code is code you don\'t have to rewrite. I plan structure, naming, and architecture before a single line is written.',
  },
  {
    num: '03',
    title: 'Craft is in the details',
    desc: 'The spacing, the transition timing, the hover state nobody asked for — those details are what separate good from great.',
  },
  {
    num: '04',
    title: 'Honest scope, honest price',
    desc: 'No inflated quotes, no hidden scope creep. You know exactly what you\'re getting and what it costs before we start.',
  },
]

// SVG accent mark — reused per item, color inherits from parent
function StarMark() {
  return (
    <svg
      className="belief-star"
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M7 0L8.4 5.6L14 7L8.4 8.4L7 14L5.6 8.4L0 7L5.6 5.6L7 0Z"
        fill="currentColor"
      />
    </svg>
  )
}

export default function BeliefsSection() {
  return (
    <section className="section beliefs-section" id="beliefs">
      <div className="container">

        {/* Section heading — same alignment as every other section */}
        <FadeIn delay={0} y={30} as="div" className="section-label-wrap">
          <span className="section-eyebrow">05. Beliefs</span>
          <h2 className="section-title">How I think</h2>
        </FadeIn>

        {/* Pull quote + belief list in a horizontal split */}
        <div className="beliefs-layout">

          {/* Left: large decorative pull quote */}
          <FadeIn delay={0.1} y={20} className="beliefs-quote-panel">
            <div className="beliefs-quote-mark" aria-hidden="true">&ldquo;</div>
            <blockquote className="beliefs-quote-text">
              Good work isn't an accident — it's built on principles applied consistently, every single day.
            </blockquote>
            <div className="beliefs-quote-rule" />
            <p className="beliefs-quote-byline">
              <StarMark />
              Emmanuel Onyekachi
            </p>
          </FadeIn>

          {/* Right: belief items as horizontal rows with accent line */}
          <div className="beliefs-items">
            {BELIEFS.map((b, i) => (
              <FadeIn key={b.num} delay={0.05 * i} y={16}>
                <div className="belief-row">
                  <div className="belief-row-left">
                    <span className="belief-row-num">{b.num}</span>
                    <StarMark />
                  </div>
                  <div className="belief-row-body">
                    <h3 className="belief-row-title">{b.title}</h3>
                    <p className="belief-row-desc">{b.desc}</p>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>

        </div>

      </div>
    </section>
  )
}