import { site } from '../../config/site'
import { useScrolledPast } from '../../hooks/useScrolledPast'

export default function SideEmail() {
  const hidden = useScrolledPast(30)

  return (
    <div
      aria-hidden={hidden}
      className={`fixed bottom-0 right-10 z-10 hidden w-[60px] flex-col items-center transition-[opacity,transform,color] duration-[600ms] min-[1025px]:flex ${
        hidden ? 'pointer-events-none translate-y-5 opacity-0' : 'translate-y-0 opacity-100'
      }`}
    >
      <a
        href={`mailto:${site.email}`}
        tabIndex={hidden ? -1 : 0}
        className="mb-5 text-[0.8rem] tracking-[2px] text-muted no-underline [writing-mode:vertical-rl] transition-[transform,color] duration-300 hoverable:hover:-translate-y-1 hoverable:hover:text-accent"
      >
        {site.email}
      </a>
      <span aria-hidden="true" className="mt-5 h-[100px] w-px bg-muted opacity-40" />
    </div>
  )
}
