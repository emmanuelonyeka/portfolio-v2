import SideSocials from './components/global/SideSocials'
import SideEmail from './components/global/SideEmail'
import Navbar from './components/layout/Navbar'
import Hero from './components/sections/Hero'
import Marquee from './components/sections/Marquee'
import About from './components/sections/About'
import Skills from './components/sections/Skills'
import Services from './components/sections/Services'
import Beliefs from './components/sections/Beliefs'
import Packages from './components/sections/Packages'
import Contact from './components/sections/Contact'
import Footer from './components/layout/Footer'
import { Divider } from './components/ui/Divider'
import { useScrollRestoration } from './hooks/useScrollRestoration'
import { useSmoothScroll } from './hooks/useSmoothScroll'
import WhatsAppFloat from './components/global/WhatsAppFloat'
import ScrollProgress from './components/global/ScrollProgress'
import Projects from './components/sections/Projects'
import Process from './components/sections/Process'
import { site, asset } from './config/site'

export default function App() {
  useSmoothScroll()
  useScrollRestoration()

  return (
    <>
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>
      <div className="ambient-backdrop" aria-hidden="true" />
      <div className="grain-overlay" aria-hidden="true" />
      <ScrollProgress />
      <WhatsAppFloat />
      <Navbar />
      <SideSocials />
      <SideEmail />

      <main
        id="main-content"
        tabIndex={-1}
        className="focus:outline-none"
        style={{ background: 'transparent', overflowX: 'clip', position: 'relative', zIndex: 2 }}
      >
        <Hero />
        <Marquee />
        <About />
        <Skills />
        <Projects />
        <Beliefs />

        <Divider
          eyebrow="Two ways to work together"
          title="Choose the path that fits"
          sub="Reviewing me for a frontend role? Use the résumé or email links below. If you need a site built, continue for services, process, and pricing."
        >
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <a
              href={asset(site.resume)}
              target="_blank"
              rel="noopener noreferrer"
              className="press lit inline-flex min-h-11 items-center rounded-full bg-accent px-6 py-3 text-[0.85rem] font-semibold text-accent-contrast no-underline transition-[background-color,transform] duration-300 hoverable:hover:-translate-y-0.5 hoverable:hover:bg-accent/90"
            >
              View Résumé
            </a>
            <a
              href={`mailto:${site.email}`}
              className="press inline-flex min-h-11 items-center rounded-full border border-accent/40 px-6 py-3 text-[0.85rem] font-semibold text-accent no-underline transition-[background-color,border-color] duration-300 hoverable:hover:border-accent hoverable:hover:bg-accent/12"
            >
              Email Me
            </a>
          </div>
        </Divider>

        <Services />
        <Process />
        <Packages />
        <Contact />
        <Footer />
      </main>
    </>
  )
}
