import { useState } from 'react'
import { emailConfig, isEmailConfigured } from '../../config/email'
import { contactLinks, contactCopy } from '../../data/contact'
import { whatsappLink, WHATSAPP_GENERAL } from '../../lib/whatsapp'
import { Icon } from '../icons'
import FadeIn from '../ui/FadeIn'
import { Section } from '../ui/Section'
import { FormField } from '../ui/FormField'

type Field = 'name' | 'email' | 'subject' | 'message'
type Errors = Partial<Record<Field, string>>

const EMPTY = { name: '', email: '', subject: '', message: '' }
const SEND_TIMEOUT_MS = 15_000
const loadEmailClient = () => import('@emailjs/browser')

/** Settles a promise either way — the UI must never be left mid-flight. */
function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return Promise.race([
    promise,
    new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error(`Request timed out after ${ms}ms`)), ms),
    ),
  ])
}
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/** Returns a message when the value is invalid, or undefined when it is fine. */
function validate(field: Field, value: string): string | undefined {
  const trimmed = value.trim()
  if (field === 'name' && !trimmed) return 'Name is required'
  if (field === 'email') {
    if (!trimmed) return 'Email is required'
    if (!EMAIL_PATTERN.test(trimmed)) return 'Please enter a valid email address'
  }
  if (field === 'message' && !trimmed) return 'Message is required'
  return undefined
}

const controlBase =
  'rounded-lg border bg-black/10 px-4 py-2.5 font-sans text-base text-primary outline-none ' +
  'transition-[border-color,background-color] duration-300 ' +
  'placeholder:text-sm placeholder:text-muted ' +
  'focus:bg-black/25 theme-light:bg-main/70 theme-light:focus:bg-main ' +
  'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent'

const controlClass = (invalid: boolean) =>
  `${controlBase} ${invalid ? 'border-danger' : 'border-edge-control focus:border-accent'}`

export default function Contact() {
  const [formData, setFormData] = useState(EMPTY)
  const [errors, setErrors] = useState<Errors>({})
  // One counter per field, bumped only when that field fails a submit.
  const [shakes, setShakes] = useState<Partial<Record<Field, number>>>({})
  const [status, setStatus] = useState<
    'idle' | 'sending' | 'success' | 'error' | 'unconfigured'
  >('idle')
  const [botField, setBotField] = useState('')

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const name = e.target.name as Field
    const { value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    // Only re-check a field that is ALREADY showing an error, so nobody gets
    // nagged mid-word on their first attempt. Once flagged, it clears live.
    setErrors((prev) => {
      if (!prev[name]) return prev
      const message = validate(name, value)
      if (message) return prev[name] === message ? prev : { ...prev, [name]: message }
      const next = { ...prev }
      delete next[name]
      return next
    })
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    const next: Errors = {}
    for (const field of ['name', 'email', 'message'] as const) {
      const message = validate(field, formData[field])
      if (message) next[field] = message
    }
    // Only real messages go in — a key set to `undefined` still counts as a key,
    // which is what made the old "are there errors?" check always true.
    setErrors(next)
    setShakes((prev) => {
      const bumped = { ...prev }
      for (const field of Object.keys(next) as Field[]) bumped[field] = (prev[field] ?? 0) + 1
      return bumped
    })
    if (Object.keys(next).length > 0) {
      const firstInvalid = (['name', 'email', 'message'] as const).find((field) => next[field])
      requestAnimationFrame(() => {
        if (firstInvalid) document.getElementById(firstInvalid)?.focus()
      })
      return
    }

    // Honeypot: a real person never sees this field, so anything in it is a bot.
    if (botField) {
      setStatus('success')
      setFormData(EMPTY)
      return
    }

    if (!isEmailConfigured()) {
      // Distinct from a send failure, so a missing .env never looks like a
      // network problem. In production this branch should never run.
      setStatus('unconfigured')
      return
    }

    setStatus('sending')
    try {
      // @emailjs/browser calls fetch() with no timeout, so a request that never
      // resolves would leave this stuck on 'sending' and the button disabled.
      const { default: emailjs } = await loadEmailClient()
      await withTimeout(
        emailjs.send(
          emailConfig.serviceId,
          emailConfig.templateId,
          {
            from_name: formData.name,
            reply_to: formData.email,
            subject: formData.subject || 'Portfolio Inquiry',
            message: formData.message,
          },
          emailConfig.publicKey,
        ),
        SEND_TIMEOUT_MS,
      )
      setStatus('success')
      setFormData(EMPTY)
      setErrors({})
    } catch (error) {
      console.error('EmailJS send failed:', error)
      setStatus('error')
    }
  }

  return (
    <Section id="contact">
      <FadeIn delay={0} y={30} as="div" className="mb-[clamp(3rem,6vw,5rem)]">
        <span className="inline-block font-mono text-[0.8rem] uppercase tracking-[0.12em] text-accent">
          {contactCopy.eyebrow}
        </span>
        <h2 className="mb-6 mt-4 text-[clamp(2.2rem,6vw,5rem)] font-bold leading-[1.1] tracking-[-0.03em]">
          <span className="gradient-text bg-[image:var(--linear-gradient)] bg-clip-text text-transparent [-webkit-text-fill-color:transparent]">
            {contactCopy.headline}
          </span>
          <br />
          <span className="text-accent">{contactCopy.headlineAccent}</span>
        </h2>
        <p className="max-w-[480px] text-[clamp(0.95rem,1.6vw,1.1rem)] leading-[1.7] text-muted">
          {contactCopy.sub}
        </p>
      </FadeIn>

      <FadeIn delay={0.15} y={20}>
        <a
          href={whatsappLink(WHATSAPP_GENERAL)}
          target="_blank"
          rel="noopener noreferrer"
          className="press mb-[clamp(2.5rem,5vw,4rem)] inline-flex w-full items-center justify-center gap-3 rounded-lg bg-[#25D366] px-8 py-4 text-base font-semibold text-[#07351c] no-underline shadow-[0_8px_32px_rgba(37,211,102,0.25)] transition-[transform,background-color] duration-300 hoverable:hover:-translate-y-0.5 hoverable:hover:bg-[#20bd5a] min-[701px]:w-auto min-[701px]:justify-start"
        >
          <Icon name="whatsapp" size={20} />
          {contactCopy.whatsappCta}
        </a>
      </FadeIn>

      <FadeIn delay={0.25} y={20}>
        <ul className="mb-10 grid list-none grid-cols-1 gap-3 p-0 min-[769px]:grid-cols-2">
          {contactLinks.map((link) => (
            <li key={link.label}>
              <a
                href={link.href}
                {...(link.href.startsWith('http') && {
                  target: '_blank',
                  rel: 'noopener noreferrer',
                })}
                className="press group flex items-center gap-4 rounded-[10px] border border-edge bg-edge-faint p-5 no-underline transition-[border-color,background-color,transform] duration-300 hoverable:hover:translate-x-1 hoverable:hover:border-accent/25 hoverable:hover:bg-accent/8 max-[440px]:gap-2.5 max-[440px]:p-3.5"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-surface text-accent transition-colors duration-300 hoverable:group-hover:bg-accent/12">
                  <Icon name={link.icon} size={20} />
                </span>
                <span className="flex flex-1 flex-col gap-0.5">
                  <span className="text-[0.75rem] font-medium uppercase tracking-[0.1em] text-muted">
                    {link.label}
                  </span>
                  <span className="text-[0.9rem] font-medium text-primary max-[440px]:break-all max-[440px]:text-[0.8rem]">
                    {link.value}
                  </span>
                </span>
                <Icon
                  name="arrowRight"
                  size={14}
                  className="shrink-0 -translate-x-1 text-muted opacity-0 transition-[opacity,transform] duration-300 hoverable:group-hover:translate-x-0 hoverable:group-hover:opacity-100"
                />
              </a>
            </li>
          ))}
        </ul>
      </FadeIn>

      <div className="mt-[30px] max-w-[820px] rounded-2xl border border-edge bg-surface p-[clamp(1.5rem,4vw,2.5rem)] shadow-card max-[340px]:px-3 max-[340px]:py-4">
        <form
          onSubmit={handleSubmit}
          onFocusCapture={() => {
            if (isEmailConfigured()) void loadEmailClient()
          }}
          noValidate
          className="flex flex-col gap-5"
        >
          <div className="grid grid-cols-1 gap-4 min-[601px]:grid-cols-2">
            <FormField id="name" label="Your Name" required error={errors.name} shake={shakes.name ?? 0}>
              <input
                type="text"
                id="name"
                name="name"
                autoComplete="name"
                required
                value={formData.name}
                onChange={handleChange}
                placeholder="John Doe"
                aria-invalid={Boolean(errors.name)}
                aria-describedby="name-error"
                className={controlClass(Boolean(errors.name))}
              />
            </FormField>

            <FormField id="email" label="Your Email" required error={errors.email} shake={shakes.email ?? 0}>
              <input
                type="email"
                id="email"
                name="email"
                autoComplete="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="john@example.com"
                aria-invalid={Boolean(errors.email)}
                aria-describedby="email-error"
                className={controlClass(Boolean(errors.email))}
              />
            </FormField>
          </div>

          <FormField id="subject" label="Subject" error={undefined} shake={0}>
            <input
              type="text"
              id="subject"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              placeholder="How can I help you?"
              className={controlClass(false)}
            />
          </FormField>

          <FormField id="message" label="Message" required error={errors.message} shake={shakes.message ?? 0}>
            <textarea
              id="message"
              name="message"
              required
              rows={5}
              value={formData.message}
              onChange={handleChange}
              placeholder="Tell me about your project..."
              aria-invalid={Boolean(errors.message)}
              aria-describedby="message-error"
              className={controlClass(Boolean(errors.message))}
            />
          </FormField>

          {/* Honeypot — off-screen and out of the tab order, so only bots fill it. */}
          <input
            type="text"
            name="company"
            tabIndex={-1}
            autoComplete="off"
            aria-hidden="true"
            value={botField}
            onChange={(e) => setBotField(e.target.value)}
            className="absolute left-[-9999px] h-0 w-0 opacity-0"
          />

          <button
            type="submit"
            disabled={status === 'sending'}
            className="press lit inline-flex items-center justify-center gap-3 rounded-lg bg-accent px-7 py-3.5 text-[0.9rem] font-semibold text-accent-contrast transition-[transform,background-color] duration-300 disabled:cursor-not-allowed disabled:opacity-70 hoverable:hover:enabled:-translate-y-px hoverable:hover:enabled:bg-accent/90"
          >
            {status === 'sending' ? (
              <>
                <span
                  aria-hidden="true"
                  className="h-[18px] w-[18px] animate-luxury-spin rounded-full border-2 border-transparent border-l-accent-contrast/35 border-t-accent-contrast motion-reduce:animate-none"
                />
                Sending Message...
              </>
            ) : (
              'Send Message'
            )}
          </button>

          {/* Present in the DOM before it has content, so the change is announced. */}
          <div role="status" aria-live="polite">
            {status === 'success' && (
              <p className="rounded-md border border-success/30 bg-success/10 px-3.5 py-2.5 text-[0.85rem] leading-[1.5] text-success">
                Thank you! Your message has been sent. I will respond to you very soon.
              </p>
            )}
            {status === 'error' && (
              <p className="rounded-md border border-danger/30 bg-danger/10 px-3.5 py-2.5 text-[0.85rem] leading-[1.5] text-danger">
                Something went wrong. Please try again or email me directly.
              </p>
            )}
            {status === 'unconfigured' && (
              <p className="rounded-md border border-danger/30 bg-danger/10 px-3.5 py-2.5 text-[0.85rem] leading-[1.5] text-danger">
                The contact form is temporarily unavailable. Please email me directly in the
                meantime.
              </p>
            )}
          </div>
        </form>
      </div>
    </Section>
  )
}
