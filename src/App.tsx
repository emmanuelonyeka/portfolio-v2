import SideSocials from './components/SideSocials'
import SideEmail from './components/SideEmail'
import ParticleCanvas from './components/ParticleCanvas'
import Navbar from './components/Navbar'
import HeroSection from './components/HeroSection'
import MarqueeSection from './components/MarqueeSection'
import AboutSection from './components/AboutSection'
import SkillsSection from './components/SkillsSection'
import ServicesSection from './components/ServicesSection'
import BeliefsSection from './components/BeliefsSection'
import PricingSection from './components/PricingSection'
import ContactSection from './components/ContactSection'
import CustomCursor from './components/CustomCursor'
import Footer from './components/Footer'
import WhatsAppFloat from './components/WhatsAppFloat'
import ScrollProgress from './components/ScrollProgress'
import ProjectsSection from './components/ProjectsSection'
import ProcesssSection from './components/ProcessSection'

export default function App() {
  return (
    <>
      <ParticleCanvas />
      <svg className="grain-overlay" xmlns="http://www.w3.org/2000/svg">
        <filter id="grainFilter">
          <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="2" stitchTiles="stitch"/>
        </filter>
        <rect width="100%" height="100%" filter="url(#grainFilter)"/>
      </svg>
      <CustomCursor />
      <ScrollProgress />
      <WhatsAppFloat />
      <SideSocials />
      <SideEmail />
      <Navbar />

      <main style={{ background: 'transparent', overflowX: 'clip', position: 'relative', zIndex: 2 }}>
        <HeroSection />
        <MarqueeSection />
        <AboutSection />
        <SkillsSection />
        <ProjectsSection />
        <ServicesSection />
        <BeliefsSection />
        <PricingSection />
        <ProcesssSection />
        <ContactSection />
        <Footer />
      </main>
    </>
  )
}