import { readFile, readdir, stat } from 'node:fs/promises'
import { join, relative } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = fileURLToPath(new URL('../', import.meta.url))
const failures = []
let checks = 0

function verify(condition, message) {
  checks += 1
  if (!condition) failures.push(message)
}

async function read(path) {
  return readFile(join(root, path), 'utf8')
}

async function walk(directory) {
  const entries = await readdir(directory, { withFileTypes: true })
  const nested = await Promise.all(
    entries.map((entry) => {
      const path = join(directory, entry.name)
      return entry.isDirectory() ? walk(path) : path
    }),
  )
  return nested.flat()
}

const [
  html,
  app,
  projects,
  site,
  socials,
  about,
  aboutComponent,
  hero,
  navbar,
  scrollNavigation,
  scrollRestoration,
  logo,
  skills,
  skillsComponent,
  caseStudy,
  projectCarousel,
  projectCard,
  marquee,
  lightbox,
  modal,
  smoothScroll,
  footer,
  contact,
  whatsapp,
  processData,
  processComponent,
  beliefsData,
  servicesData,
  servicesComponent,
  packagesData,
  packagesComponent,
  projectsComponent,
  liquidLens,
  errorBoundary,
  main,
  typeDefinitions,
  tailwind,
  packageJson,
  css,
  robots,
  sitemap,
  manifest,
  notFound,
  netlify,
] =
  await Promise.all([
    read('index.html'),
    read('src/App.tsx'),
    read('src/data/projects.ts'),
    read('src/config/site.ts'),
    read('src/data/socials.ts'),
    read('src/data/about.ts'),
    read('src/components/sections/About.tsx'),
    read('src/components/sections/Hero.tsx'),
    read('src/components/layout/Navbar.tsx'),
    read('src/lib/scrollToSection.ts'),
    read('src/hooks/useScrollRestoration.ts'),
    read('src/components/global/LogoMark.tsx'),
    read('src/data/skills.ts'),
    read('src/components/sections/Skills.tsx'),
    read('src/components/project/CaseStudyModal.tsx'),
    read('src/components/project/ProjectCarousel.tsx'),
    read('src/components/project/ProjectCard.tsx'),
    read('src/data/marquee.ts'),
    read('src/components/project/ImageLightbox.tsx'),
    read('src/components/ui/Modal.tsx'),
    read('src/hooks/useSmoothScroll.ts'),
    read('src/components/layout/Footer.tsx'),
    read('src/components/sections/Contact.tsx'),
    read('src/components/global/WhatsAppFloat.tsx'),
    read('src/data/process.ts'),
    read('src/components/sections/Process.tsx'),
    read('src/data/beliefs.ts'),
    read('src/data/services.ts'),
    read('src/components/sections/Services.tsx'),
    read('src/data/packages.ts'),
    read('src/components/sections/Packages.tsx'),
    read('src/components/sections/Projects.tsx'),
    read('src/components/ui/LiquidLens.tsx'),
    read('src/components/global/ErrorBoundary.tsx'),
    read('src/main.tsx'),
    read('src/types/index.ts'),
    read('tailwind.config.js'),
    read('package.json'),
    read('src/index.css'),
    read('public/robots.txt'),
    read('public/sitemap.xml'),
    read('public/site.webmanifest'),
    read('public/404.html'),
    read('netlify.toml'),
  ])

for (const id of ['hero', 'about', 'skills', 'work', 'beliefs', 'services', 'process', 'packages', 'contact']) {
  verify(app.includes(id === 'work' ? '<Projects />' : id === 'hero' ? '<Hero />' : `<${id[0].toUpperCase()}${id.slice(1)} />`), `App is missing the ${id} section`)
}

const slugs = [...projects.matchAll(/slug:\s*'([^']+)'/g)].map((match) => match[1])
verify(slugs.length === 4, 'Expected exactly four project slugs')
verify(new Set(slugs).size === slugs.length, 'Project slugs must be unique')
verify((projects.match(/tabColor:\s*'#[0-9a-f]{6}'/gi) ?? []).length === 4, 'Every project needs its own tab colour')
verify((projects.match(/tabColorLight:\s*'#[0-9a-f]{6}'/gi) ?? []).length === 4, 'Every project needs an accessible light-theme tab colour')

for (const profile of ['github.com/emmanuelonyeka', 'linkedin.com/in/emmanuelymb', 'x.com/emmmybills']) {
  verify(site.includes(profile), `Missing social profile: ${profile}`)
}
for (const label of ['LinkedIn', 'GitHub', 'WhatsApp', 'X / Twitter']) {
  verify(socials.includes(`label: '${label}'`), `Desktop/mobile social set is missing ${label}`)
}

verify(about.includes('TryRating'), 'About copy must retain the verified TryRating work')
verify(about.includes('completing the programme in 2024'), 'Education copy must retain the 2024 completion wording')
verify(aboutComponent.includes('const DIM = 0.6'), 'About reveal needs a clearly differentiated dim state')
verify(aboutComponent.includes('text-primary'), 'About reveal must finish at the strongest theme text colour')
verify(aboutComponent.includes("getElementById('waFloat')"), 'About reveal must use the WhatsApp control as its start line')
verify(aboutComponent.includes('ABOUT_REVEAL_START_OFFSET_PX'), 'About reveal tuning controls are missing')
verify(aboutComponent.includes('ABOUT_REVEAL_END_OFFSET_PX = 0'), 'About reveal must finish at the viewport top')
verify(aboutComponent.includes("closest('section')"), 'About reveal end must be measured from the owning section')

verify(hero.includes('EYEBROW_SEEN_KEY'), 'The first-visit hero eyebrow guard is missing')
verify(hero.includes("navigation.type === 'navigate'"), 'Hero typing must run only on a fresh navigation')
verify(hero.includes('animate-hero-cursor-blink'), 'The three-blink hero cursor is missing')
verify(hero.includes('TYPE_INTERVAL_MS = 95'), 'Hero typing must use the approved readable speed')
verify(tailwind.includes('hero-cursor-blink 1000ms'), 'Each hero cursor blink must last one second')
verify(tailwind.includes('3 forwards'), 'The hero cursor must finish in its invisible blink phase')
verify(hero.includes("scrollToSection('work')"), 'The primary hero CTA must use measured section navigation')
verify(hero.includes('function RollingLocalTime'), 'Automatic local-time digit transitions are missing')
verify(hero.includes('time-character-exit'), 'The outgoing local-time digit must move down')
verify(hero.includes('text-[clamp(0.72rem'), 'The availability pill must keep its fluid 350px-safe font size')
verify(hero.includes('[text-wrap:nowrap]'), 'The availability pill must remain on one line')
verify(!hero.includes('max-w-full flex-wrap items-center'), 'The availability pill must not wrap its contents')

verify(scrollRestoration.includes("navigation.type === 'reload'"), 'Reload detection is missing from scroll restoration')
verify(scrollRestoration.includes('target < 0'), 'Scroll position 0 must remain a valid restoration target')
verify(!scrollRestoration.includes('target <= 0'), 'Scroll restoration must not discard the top position')
verify(scrollRestoration.includes('scrollPageTo(reachable, true)'), 'Reload restoration must stay in sync with smooth scrolling')
verify(html.includes("navigation.type === 'reload'"), 'The first-paint reload guard is missing')
verify(navbar.includes('navbar-resting-sizer'), 'The compact mobile header measurement is missing')
verify(navbar.includes('mobileCompact={scrolled}'), 'The logo must compact with the mobile sticky header')
verify(scrollNavigation.includes("--navbar-resting-height"), 'Section navigation must use the destination header height')

verify(logo.includes('<svg'), 'The logo must use platform-independent vector geometry')
verify(!logo.includes('font-['), 'The logo must not depend on OS font glyphs')
verify((skills.match(/icon:\s*'/g) ?? []).length === 25, 'Every listed skill needs its own lightweight icon')
verify(skillsComponent.includes('<Icon name={item.icon}'), 'Skill icons are not rendered beside their labels')
verify(skills.includes("tag: 'Frontend → Full Stack'"), 'The frontend-to-full-stack roadmap label is missing')
for (const plannedSkill of ['Frontend Testing', 'PostgreSQL', 'Prisma', 'API & Authentication']) {
  verify(skills.includes(`name: '${plannedSkill}'`), `Full-stack roadmap is missing ${plannedSkill}`)
}

verify(caseStudy.includes('case-study-footer'), 'The project footer needs its height-aware layout hook')
verify(caseStudy.includes('col-span-2 bg-accent'), 'The primary project-modal action must span the full footer')
verify(caseStudy.includes('grid-cols-2'), 'The secondary project-modal actions must share the second row')
verify(caseStudy.includes('hoverable:hover:border-accent/35'), 'Project-modal tags need the approved accent hover border')
verify(caseStudy.includes('purchaseUrl ?'), 'Project-modal purchase actions must be data-driven')
verify(caseStudy.includes('Buy Template'), 'The project-modal purchase CTA is missing')
verify(caseStudy.includes("mobile: '9 / 17'"), 'Mobile screenshots must use their supplied 9:17 display ratio')
verify(projectCard.includes('{code && ('), 'Project cards must expose source only when a public URL exists')
verify(caseStudy.includes('{code && ('), 'Case studies must expose source only when a public URL exists')
verify(caseStudy.includes("!purchaseUrl && !code ? 'col-span-2'"), 'Private project copy actions must use the full footer row')
verify(projectCard.includes('Template Available'), 'Purchasable templates need a restrained availability badge')
verify(projectCard.includes('min-h-10'), 'Project preview controls need the compact approved height')
verify(
  projectCard.includes("previewFit === 'contain' ? 'object-contain' : 'object-cover'"),
  'Project video fitting must follow media geometry instead of project-specific transform patches',
)
verify(
  !projectCard.includes('scale-[1.045]') && !projectCard.includes('scale-[1.025]'),
  'Project previews must not restore the old project-specific scale patches',
)
for (const cleanedMedia of [
  'videos/projects/solara-preview-clean.mp4',
  'videos/projects/primenest-preview-clean.mp4',
  'images/projects/solara/desktop/01-hero-clean.webp',
  'images/projects/primenest/desktop/01-hero-clean.webp',
]) {
  verify(projects.includes(cleanedMedia), `Project data is missing cleaned media: ${cleanedMedia}`)
}
verify(typeDefinitions.includes("previewFit?: 'cover' | 'contain'"), 'Project video fit needs an explicit typed option')
verify(
  projects.match(/previewFit: 'contain'/g)?.length === 2,
  'Lumiere and the square NairaSave recording must remain fully visible',
)
verify(typeDefinitions.includes('code?: string'), 'Project source URLs must be optional')
verify(typeDefinitions.includes('purchaseUrl?: string'), 'Project data needs an optional real checkout URL')
verify(projects.includes('https://emmanuelonyekachi.gumroad.com/l/eagwaj'), 'Lumière needs its verified purchase URL')
verify((projects.match(/\n\s+code:\s*'/g) ?? []).length === 1, 'Only one project repository should be public')
verify(projects.includes('https://github.com/emmanuelonyeka/nairasave/'), 'NairaSave public source is missing')
for (const privateSource of [
  'github.com/emmanuelonyeka/lumiere-restaurant',
  'github.com/emmanuelonyeka/real-estate',
  'github.com/emmanuelonyeka/solara-aviation',
]) {
  verify(!projects.includes(privateSource), `Private project source leaked into production data: ${privateSource}`)
}
verify(css.includes('(orientation: landscape) and (max-height: 720px)'), 'Phone-landscape project footer fallback is missing')
verify(css.includes('.case-study-footer'), 'The short-height project footer override is missing')

verify(projectCarousel.includes('slide.offsetLeft'), 'Carousel centring must use measured slide geometry')
verify(projectCarousel.includes('translate3d(${offset}px'), 'Carousel movement must use a valid pixel transform')
verify(!projectCarousel.includes('calc(-${index}'), 'Unsupported CSS multiplication has returned to the carousel')
verify(!projectCarousel.includes("'press absolute top-1/2"), 'Carousel arrows must not inherit the conflicting press transform')
verify(projectCarousel.includes("'clamp(16rem, 72%, 32rem)'"), 'Desktop case-study images need their mobile minimum width')
verify(projectCarousel.includes('object-contain'), 'Case-study screenshots must never be cropped')
verify(lightbox.includes('max-w-[min(95vw,900px)]'), 'Small-screen lightbox media must use the approved width')

verify(!modal.includes('min-[601px]:items-start'), 'Dialogs must remain viewport-centred above 600px')
verify(css.includes('width: min(95vw, 640px)'), 'Small dialogs need the 95vw width cap')
verify(css.includes('height: min(88dvh, 820px)'), 'Standard dialogs need the increased dynamic height')
verify(css.includes('@media (max-width: 380px)'), 'Ultra-narrow dialogs need a capped height')
verify(main.includes("inputModality = 'pointer'"), 'Pointer/keyboard modality tracking is missing')
verify(css.includes("data-input-modality='keyboard'"), 'Keyboard-only focus-ring styling is missing')
verify(whatsapp.includes('theme-light:text-white'), 'Light-theme WhatsApp icon must be white')
verify(whatsapp.includes('bg-[#25D366]'), 'Floating WhatsApp control must use the recognisable brand green')
verify(!whatsapp.includes('#128C7E'), 'The dull light-theme WhatsApp override has returned')
verify(packageJson.includes('"lenis": "^1.3.26"'), 'The lightweight smooth-scroll dependency is missing')
verify(smoothScroll.includes('duration: 1.15'), 'The agreed Solara-style scroll duration is missing')
verify(smoothScroll.includes("void import('lenis')"), 'Lenis must stay outside the initial JavaScript chunk')
verify(contact.includes('min-[769px]:grid-cols-2'), 'Contact links must stay one-column through 768px')
verify(footer.includes('min-[601px]:flex-row'), 'Footer legal text must stay stacked through 600px')
verify(['I', 'II', 'III', 'IV'].every((num) => processData.includes(`num: '${num}'`)), 'Process steps must use Roman numerals')
verify(processComponent.includes('border-y py'), 'Process steps must own equal top and bottom borders')
verify(processComponent.includes("? 'border-b-accent'"), 'The centred process step must own its accent bottom border')
verify(!processComponent.includes('hoverable:hover:border-t'), 'Process hover must never recolour a boundary line')
verify(processComponent.includes("ACTIVE_SCALE = 'scale-[1.01]'"), 'Process active scale must remain restrained')
verify(processComponent.includes("RESTING_SCALE = 'scale-100'"), 'Inactive Process steps must not shrink')
verify(['I', 'II', 'III', 'IV'].every((num) => beliefsData.includes(`num: '${num}'`)), 'Belief steps must use Roman numerals')
verify(beliefsData.includes('Reliable behavior, accessibility, and clean handover earn trust.'), 'Approved working-principle quote is missing')
verify(servicesComponent.includes("['I', 'II', 'III', 'IV', 'V', 'VI']"), 'Service capabilities must use Roman numerals')
for (const service of [
  'React & TypeScript Frontends',
  'Figma to Responsive Code',
  'Landing Pages & Business Sites',
  'Performance & Accessibility',
]) {
  verify(servicesData.includes(service), `Service offering is missing ${service}`)
}
verify(packagesComponent.includes('min-[901px]:items-stretch'), 'Package rows must equalise card height')
verify(packagesComponent.includes('min-[901px]:h-full'), 'Package cards must fill their shared row')
verify(packagesData.includes('International projects are quoted in USD or GBP.'), 'International quote guidance is missing')
verify(projectsComponent.includes('className="project-summary"'), 'Stacked-project closing note needs its tuning hook')
verify(css.includes('.project-summary'), 'Stacked-project closing-note offset is missing')
verify(liquidLens.includes('--liquid-lens-bg'), 'Case-study selector needs a local light-theme lens colour')
verify(css.includes('html.theme-light .case-study-view-toggle'), 'Light-theme project view selector treatment is missing')

const marqueeFiles = [...marquee.matchAll(/file:\s*'([^']+)'/g)].map((match) => match[1])
verify(marqueeFiles.length === 10, 'The showcase must include all ten supplied marquee clips')
const midpoint = Math.ceil(marqueeFiles.length / 2)
for (const row of [marqueeFiles.slice(0, midpoint), marqueeFiles.slice(midpoint)]) {
  const projectsInRow = row.map((file) => file.split('-')[0])
  verify(
    projectsInRow.every((project, index) => project !== projectsInRow[(index + 1) % projectsInRow.length]),
    'A marquee row places the same project beside itself',
  )
}

for (const marker of [
  '<html lang="en">',
  '<title>',
  'name="description"',
  'rel="canonical"',
  'name="robots"',
  'property="og:title"',
  'name="twitter:card"',
  'name="twitter:creator"',
  'application/ld+json',
  'rel="manifest"',
]) {
  verify(html.includes(marker), `SEO marker is missing: ${marker}`)
}
verify(!html.toLowerCase().includes('public source code'), 'SEO copy must not claim every repository is public')
verify(!hero.includes('their source code'), 'Hero copy must not claim every repository is public')
verify(!projectsComponent.includes('Every project ships with its source'), 'Project note must reflect the source-privacy policy')
verify(html.includes('"dateModified": "2026-09-16"'), 'Structured-data modification date is stale')
verify(html.includes('"hasPart": ['), 'ProfilePage structured data must describe the selected work')

const structuredData = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)?.[1]
try {
  const schema = JSON.parse(structuredData ?? '')
  verify(Array.isArray(schema['@graph']), 'Structured data must use an @graph')
  verify(schema['@graph']?.some((entry) => entry['@type'] === 'ProfilePage'), 'Structured data is missing ProfilePage')
  verify(schema['@graph']?.some((entry) => entry['@type'] === 'Person'), 'Structured data is missing Person')
} catch {
  failures.push('JSON-LD structured data is not valid JSON')
}

verify(robots.includes('Sitemap: https://emmanuelonyekachi.netlify.app/sitemap.xml'), 'robots.txt is missing the canonical sitemap')
verify(sitemap.includes('<loc>https://emmanuelonyekachi.netlify.app/</loc>'), 'sitemap.xml is missing the canonical URL')
verify(sitemap.includes('<lastmod>2026-09-16</lastmod>'), 'sitemap modification date is stale')
verify(!sitemap.includes('<priority>'), 'Ignored sitemap priority metadata should stay removed')
verify(JSON.parse(manifest).name.includes('Emmanuel Onyekachi'), 'Web manifest identity is incorrect')
verify(main.includes('<ErrorBoundary>'), 'The app root is missing its unexpected-error boundary')
verify(errorBoundary.includes('componentDidCatch'), 'The error boundary must report render failures')
verify(errorBoundary.includes('Reload page'), 'The error boundary is missing a recovery action')
verify(notFound.includes('name="robots" content="noindex, nofollow"'), 'The 404 page must stay out of search results')
verify(notFound.includes('Return home'), 'The 404 page is missing its primary recovery action')
verify(!netlify.includes('[[redirects]]'), 'A catch-all redirect would turn genuine 404s into soft 404s')

const sourceFiles = await walk(join(root, 'src'))
const sourceText = (
  await Promise.all(
    sourceFiles
      .filter((path) => /\.(ts|tsx|css)$/.test(path))
      .map((path) => readFile(path)),
  )
).join('\n')
const excludedName = ['reve', 'choice'].join('')
verify(!`${sourceText}\n${html}`.toLowerCase().includes(excludedName), 'Excluded résumé-only content has reappeared')
verify(!sourceText.includes('hoverable:hover:shadow'), 'Hover shadows have been reintroduced')
verify(!sourceText.includes('ParticleCanvas'), 'The continuously running particle canvas has been reintroduced')
verify(css.includes('(min-width: 900px) and (min-height: 840px)'), 'Project stacking must be guarded by width and height')
verify(css.includes('@media (max-width: 600px)'), 'Full-width mobile project actions need the 600px breakpoint')
verify(css.includes('margin-bottom: clamp(2.75rem, 7vw, 5.5rem)'), 'Normal-flow project cards need the increased fluid gap')

const imagePaths = [...projects.matchAll(/asset\('(images\/[^']+)'\)/g)].map((match) => match[1])
verify(imagePaths.length === 38, 'Every supplied desktop and mobile project screenshot must be referenced')
for (const image of new Set(imagePaths)) {
  try {
    verify((await stat(join(root, 'public', image))).isFile(), `Project image is missing: ${image}`)
  } catch {
    verify(false, `Project image is missing: ${image}`)
  }
}

const projectVideoPaths = [...projects.matchAll(/asset\('(videos\/projects\/[^']+)'\)/g)].map(
  (match) => match[1],
)
const marqueeVideoPaths = marqueeFiles.map((file) => `videos/marquee/${file}`)
verify(projectVideoPaths.length === 4, 'Every project needs one renamed preview video')
for (const video of [...projectVideoPaths, ...marqueeVideoPaths]) {
  try {
    verify((await stat(join(root, 'public', video))).isFile(), `Project video is missing: ${video}`)
  } catch {
    verify(false, `Project video is missing: ${video}`)
  }
}

if (failures.length > 0) {
  console.error(`Project verification failed (${failures.length}/${checks} checks):`)
  for (const failure of failures) console.error(`- ${failure}`)
  process.exitCode = 1
} else {
  console.log(`Project verification passed: ${checks} checks.`)
}
