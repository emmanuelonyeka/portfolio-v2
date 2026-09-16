import { useEffect, useState } from 'react'
import { whatsappLink, WHATSAPP_GENERAL } from '../../lib/whatsapp'
import { useScrolledPast } from '../../hooks/useScrolledPast'
import { useDialogOpen } from '../ui/Modal'
import { Icon } from '../icons'

export default function WhatsAppFloat() {
  const scrolledIn = useScrolledPast(700)
  const dialogOpen = useDialogOpen()
  const [overContact, setOverContact] = useState(false)

  useEffect(() => {
    const contact = document.getElementById('contact')
    if (!contact) return
    // Stand down inside #contact — the section already offers WhatsApp.
    const observer = new IntersectionObserver(([entry]) => setOverContact(entry.isIntersecting), {
      threshold: 0.01,
    })
    observer.observe(contact)
    return () => observer.disconnect()
  }, [])

  const shown = scrolledIn && !overContact && !dialogOpen

  return (
    <a
      id="waFloat"
      href={whatsappLink(WHATSAPP_GENERAL)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      aria-hidden={!shown}
      tabIndex={shown ? 0 : -1}
      className={`fixed bottom-5 right-5 z-[9000] flex h-11 w-11 items-center justify-center rounded-[15px] bg-[#25D366] text-[#07351c] no-underline shadow-[0_4px_16px_rgba(37,211,102,0.3)] transition-[opacity,transform,background-color] duration-[400ms] motion-reduce:transition-none theme-light:bg-[#128C7E] theme-light:text-white min-[701px]:bottom-8 min-[701px]:right-8 min-[701px]:h-12 min-[701px]:w-12 ${
        shown
          ? 'pointer-events-auto translate-y-0 scale-100 opacity-100 hoverable:hover:-translate-y-[3px] hoverable:hover:scale-105 hoverable:hover:bg-[#20bd5a]'
          : 'pointer-events-none translate-y-4 scale-90 opacity-0'
      }`}
    >
      <Icon name="whatsapp" size={28} />
    </a>
  )
}
