import { useState, useEffect } from 'react'
import FadeIn from './FadeIn'
import emailjs from '@emailjs/browser'

const LINKS = [
  {
    label: 'Email',
    value: 'emmanuel.onyekachi.dev@gmail.com',
    href: 'mailto:emmanuel.onyekachi.dev@gmail.com',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18" aria-hidden="true">
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
        <polyline points="22,6 12,13 2,6"/>
      </svg>
    ),
  },
  {
    label: 'GitHub',
    value: 'emmanuelonyeka',
    href: 'https://github.com/emmanuelonyeka',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18" aria-hidden="true">
        <path d="M12 .5C5.65.5.5 5.65.5 12a11.5 11.5 0 008 10.94c.58.1.79-.25.79-.56v-2.17c-3.26.71-3.95-1.57-3.95-1.57-.53-1.34-1.29-1.7-1.29-1.7-1.06-.72.08-.7.08-.7 1.17.08 1.79 1.2 1.79 1.2 1.04 1.77 2.74 1.26 3.4.97.1-.75.41-1.26.74-1.55-2.6-.3-5.34-1.3-5.34-5.8 0-1.28.46-2.32 1.2-3.14-.12-.3-.52-1.5.12-3.12 0 0 .98-.31 3.2 1.2a11.1 11.1 0 015.82 0c2.22-1.5 3.2-1.2 3.2-1.2.64 1.62.24 2.82.12 3.12.74.82 1.2 1.86 1.2 3.14 0 4.52-2.75 5.5-5.37 5.8.42.36.8 1.08.8 2.17v3.22c0 .31.2.67.8.56A11.5 11.5 0 0023.5 12C23.5 5.65 18.35.5 12 .5z"/>
      </svg>
    ),
  },
  {
    label: 'LinkedIn',
    value: 'emmanuelymb',
    href: 'https://www.linkedin.com/in/emmanuelymb/',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18" aria-hidden="true">
        <path d="M4.98 3.5C4.98 5 3.87 6.1 2.5 6.1S0 5 0 3.5 1.1.9 2.5.9 4.98 2 4.98 3.5zM.4 8.1h4.2V24H.4zM8.4 8.1h4v2.2h.06c.56-1 1.94-2.2 4-2.2 4.28 0 5.07 2.82 5.07 6.5V24h-4.2v-7.7c0-1.84-.03-4.2-2.56-4.2-2.56 0-2.95 2-2.95 4.07V24H8.4z"/>
      </svg>
    ),
  },
  {
    label: 'Twitter / X',
    value: '@emmmybills',
    href: 'https://x.com/emmmybills?s=21',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18" aria-hidden="true">
        <path d="M18.9 1H22l-7.6 8.7L23 23h-6.9l-5.4-7.1L4.7 23H1.6l8.1-9.3L1 1h7l5 6.6L18.9 1z"/>
      </svg>
    ),
  },
]

export default function ContactSection() {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' })
  const [errors, setErrors] = useState<{ name?: string; email?: string; message?: string }>({})
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle')

  const validateField = (name: string, value: string) => {
    let err = ''
    if (name === 'name' && !value.trim()) {
      err = 'Name is required'
    } else if (name === 'email') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!value.trim()) {
        err = 'Email is required'
      } else if (!emailRegex.test(value)) {
        err = 'Please enter a valid email address'
      }
    } else if (name === 'message' && !value.trim()) {
      err = 'Message is required'
    }
    setErrors(prev => ({ ...prev, [name]: err || undefined }))
    return !err
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    validateField(name, value)
  }

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    validateField(name, value)
  }

  // 5-second automatic error-clearing loops
  useEffect(() => {
    if (status === 'error') {
      const timer = setTimeout(() => setStatus('idle'), 5000)
      return () => clearTimeout(timer)
    }
  }, [status])

  useEffect(() => {
    if (Object.keys(errors).length > 0) {
      const timer = setTimeout(() => setErrors({}), 5000)
      return () => clearTimeout(timer)
    }
  }, [errors])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const v1 = validateField('name', formData.name)
    const v2 = validateField('email', formData.email)
    const v3 = validateField('message', formData.message)

    if (!v1 || !v2 || !v3) return
    
    setStatus('sending')
    try {
      await emailjs.send(
        'portfolio_service',
        'template_1f62wqd',
        {
          from_name: formData.name,
          reply_to: formData.email,
          subject: formData.subject || 'Portfolio Inquiry',
          message: formData.message,
        },
        'ljk0GkX08nRFkTloe'
      )
      setStatus('success')
      setFormData({ name: '', email: '', subject: '', message: '' })
      setErrors({})
    } catch (err) {
      setStatus('error')
    }
  }

  return (
    <section className="section contact-section" id="contact">
      <div className="container">

        <FadeIn delay={0} y={30} as="div" className="contact-headline-wrap">
          <span className="section-eyebrow">08. Contact</span>
          <h2 className="contact-headline">
            <span className='contact-title'>Let's build something</span><br />
            <span className="contact-headline-accent">worth shipping.</span>
          </h2>
          <p className="contact-sub">
            Have a project in mind? I'm currently available for freelance work.
            Reach out and let's talk about what you need.
          </p>
        </FadeIn>

        {/* Dynamic WhatsApp green CTA button */}
        <FadeIn delay={0.15} y={20}>
          <a
            href="https://wa.me/2348147931141?text=Hi%20Emmanuel%2C%20I%20found%20your%20portfolio%20and%20would%20love%20to%20discuss%20a%20project."
            target="_blank"
            rel="noopener noreferrer"
            className="contact-wa-cta"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20" aria-hidden="true">
              <path d="M12 2a10 10 0 0 0-8.66 15l-1.34 4.9 5.02-1.32A10 10 0 1 0 12 2zm0 18a8 8 0 0 1-4.07-1.1l-.29-.17-2.98.78.8-2.9-.19-.3A8 8 0 1 1 12 20zm4.48-5.69c-.25-.12-1.47-.73-1.7-.82-.23-.08-.4-.12-.57.12-.17.25-.65.82-.8.99-.14.17-.29.19-.54.06-.25-.12-1.06-.39-2.01-1.24-.74-.66-1.24-1.48-1.39-1.73-.14-.25-.02-.38.1-.5.1-.1.25-.27.37-.4.12-.14.17-.25.25-.42.08-.17.04-.31-.02-.44-.06-.12-.57-1.37-.78-1.88-.2-.48-.41-.41-.57-.42h-.48c-.17 0-.44.06-.67.31-.23.25-.88.86-.88 2.1 0 1.24.9 2.43 1.03 2.6.12.17 1.77 2.7 4.29 3.78.6.26 1.07.42 1.43.54.6.19 1.15.16 1.58.1.48-.07 1.47-.6 1.68-1.18.21-.58.21-1.07.14-1.18-.06-.1-.23-.17-.48-.29z"/>
            </svg>
            Message me on WhatsApp
          </a>
        </FadeIn>

        {/* Contact links pills grid */}
        <FadeIn delay={0.25} y={20}>
          <div className="contact-links" style={{ marginBottom: '40px' }}>
            {LINKS.map((link, i) => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="contact-link-pill"
                style={{ transitionDelay: `${i * 0.05}s` }}
              >
                <span className="contact-link-icon">{link.icon}</span>
                <span className="contact-link-body">
                  <span className="contact-link-label">{link.label}</span>
                  <span className="contact-link-value">{link.value}</span>
                </span>
                <svg className="contact-link-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="14" height="14" aria-hidden="true">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </a>
            ))}
          </div>
        </FadeIn>

        {/* Static HTML container to completely isolate typing changes from reveal triggers */}
        <div className="contact-form-container">
          <form className="luxury-contact-form" onSubmit={handleSubmit} noValidate>
            <div className="form-group-row">
              <div className="form-input-field">
                <label htmlFor="name">Your Name <span>*</span></label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="e.g. Emma Onyeka"
                  className={errors.name ? 'input-error' : ''}
                  required
                />
                {errors.name && (
                  <div className="luxury-error-tooltip">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="12" height="12">
                      <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                    </svg>
                    {errors.name}
                  </div>
                )}
              </div>
              <div className="form-input-field">
                <label htmlFor="email">Your Email <span>*</span></label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="e.g. emma@example.com"
                  className={errors.email ? 'input-error' : ''}
                  required
                />
                {errors.email && (
                  <div className="luxury-error-tooltip">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="12" height="12">
                      <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                    </svg>
                    {errors.email}
                  </div>
                )}
              </div>
            </div>

            <div className="form-input-field">
              <label htmlFor="subject">Subject</label>
              <input
                type="text"
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                placeholder="How can I help you?"
              />
            </div>

            <div className="form-input-field">
              <label htmlFor="message">Message <span>*</span></label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Tell me about your project..."
                rows={5}
                className={errors.message ? 'input-error' : ''}
                required
              />
              {errors.message && (
                <div className="luxury-error-tooltip">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="12" height="12">
                    <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                  </svg>
                  {errors.message}
                </div>
              )}
            </div>

            <button
              type="submit"
              className="luxury-submit-btn"
              disabled={status === 'sending'}
            >
              {status === 'sending' ? (
                <>
                  <div className="luxury-spinner" aria-hidden="true" />
                  Sending Message...
                </>
              ) : (
                'Send Message'
              )}
            </button>

            {status === 'success' && (
              <p className="form-feedback-msg success">
                Thank you! Your message has been sent. I will respond to you very soon.
              </p>
            )}
            {status === 'error' && (
              <p className="form-feedback-msg error">
                Something went wrong. Please try again or email me directly.
              </p>
            )}
          </form>
        </div>

      </div>
    </section>
  )
}