import { useEffect, useRef } from 'react'

export default function WhatsAppFloat() {
  const btnRef = useRef<HTMLAnchorElement>(null)

  useEffect(() => {
    const btn = btnRef.current
    if (!btn) return

    // Hides WhatsApp float strictly within the boundaries of `#contact`
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          btn.classList.add('wa-float--footer-hidden')
        } else {
          btn.classList.remove('wa-float--footer-hidden')
        }
      },
      { threshold: 0.01 }
    )

    const contact = document.getElementById('contact')
    if (contact) obs.observe(contact)

    const onScroll = () => {
      if (window.scrollY > 700) {
        btn.classList.add('wa-float--visible')
      } else {
        btn.classList.remove('wa-float--visible')
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      obs.disconnect()
    }
  }, [])

  return (
    <a
      ref={btnRef}
      id='waFloat'
      href="https://wa.me/2348147931141?text=Hi%20Emmanuel%2C%20I%20found%20your%20portfolio%20and%20would%20love%20to%20discuss%20a%20project."
      target="_blank"
      rel="noopener noreferrer"
      className="wa-float"
      aria-label="Chat on WhatsApp"
    >
      <svg viewBox="0 0 24 24" fill="currentColor" width="35" height="35" aria-hidden="true">
        <path d="M12 2a10 10 0 0 0-8.66 15l-1.34 4.9 5.02-1.32A10 10 0 1 0 12 2zm0 18a8 8 0 0 1-4.07-1.1l-.29-.17-2.98.78.8-2.9-.19-.3A8 8 0 1 1 12 20zm4.48-5.69c-.25-.12-1.47-.73-1.7-.82-.23-.08-.4-.12-.57.12-.17.25-.65.82-.8.99-.14.17-.29.19-.54.06-.25-.12-1.06-.39-2.01-1.24-.74-.66-1.24-1.48-1.39-1.73-.14-.25-.02-.38.1-.5.1-.1.25-.27.37-.4.12-.14.17-.25.25-.42.08-.17.04-.31-.02-.44-.06-.12-.57-1.37-.78-1.88-.2-.48-.41-.41-.57-.42h-.48c-.17 0-.44.06-.67.31-.23.25-.88.86-.88 2.1 0 1.24.9 2.43 1.03 2.6.12.17 1.77 2.7 4.29 3.78.6.26 1.07.42 1.43.54.6.19 1.15.16 1.58.1.48-.07 1.47-.6 1.68-1.18.21-.58.21-1.07.14-1.18-.06-.1-.23-.17-.48-.29z"/>
      </svg>
    </a>
  )
}