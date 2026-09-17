import { socialLinks } from '../../data/socials'
import { useScrolledPast } from '../../hooks/useScrolledPast'
import { Icon } from '../icons'

export default function SideSocials() {
  // Owned here rather than by the hero, which used to reach across and write
  // inline styles onto this element from its own scroll handler.
  const hidden = useScrolledPast(30)

  return (
    <div
      aria-hidden={hidden}
      className={`fixed bottom-0 left-10 z-10 hidden w-[60px] flex-col items-center transition-[opacity,transform,color] duration-[600ms] min-[1025px]:flex ${
        hidden ? 'pointer-events-none translate-y-5 opacity-0' : 'translate-y-0 opacity-100'
      }`}
    >
      <ul className="m-0 flex list-none flex-col gap-2 p-0">
        {socialLinks.map(({ href, icon, label }) => (
          <li key={label}>
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
              tabIndex={hidden ? -1 : 0}
              className="flex h-11 w-11 items-center justify-center rounded-full text-muted transition-[transform,color,background-color] duration-300 hoverable:hover:-translate-y-0.5 hoverable:hover:bg-accent/8 hoverable:hover:text-accent"
            >
              <Icon name={icon} size={20} />
            </a>
          </li>
        ))}
      </ul>
      <span aria-hidden="true" className="mt-5 h-20 w-px bg-muted opacity-40" />
    </div>
  )
}
