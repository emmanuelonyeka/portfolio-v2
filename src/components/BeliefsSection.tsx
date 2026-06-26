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

export default function BeliefsSection() {
  return (
    <section className="section beliefs-section" id="beliefs">
      <div className="container beliefs-container">
        
        {/* Sticky editorial left column */}
        <FadeIn delay={0} y={30} className="beliefs-sticky-left">
          <span className="section-eyebrow">04. Beliefs</span>
          <h2 className="section-title">How I think</h2>
          <p className="beliefs-sticky-desc">
            Core principles that guide my engineering choices, communication, and visual craft.
          </p>
        </FadeIn>

        {/* Alternate structured right column */}
        <div className="beliefs-list-right">
          {BELIEFS.map((belief) => (
            <div key={belief.num} className="beliefs-list-item">
              <div className="beliefs-list-num">{belief.num}</div>
              <div className="beliefs-list-body">
                <h3 className="beliefs-list-title">{belief.title}</h3>
                <p className="beliefs-list-desc">{belief.desc}</p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}