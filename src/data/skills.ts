import type { SkillGroup } from '../types'

export const skillGroups: SkillGroup[] = [
  {
    tag: 'Production Stack',
    title: 'What I build with',
    items: [
      { name: 'HTML5', note: 'Semantic, accessible markup', icon: 'html5' },
      { name: 'CSS3', note: 'Custom properties, responsive layouts, animation', icon: 'css3' },
      { name: 'JavaScript (ES6+)', note: 'Vanilla & modern patterns', icon: 'javascript' },
      { name: 'React', note: 'Hooks, context, composition', icon: 'react' },
      { name: 'Tailwind CSS', note: 'Utility-first styling', icon: 'tailwind' },
      { name: 'TypeScript', note: 'Type-safe JavaScript', icon: 'typescript' },
      { name: 'Framer Motion', note: 'Scroll & gesture animation', icon: 'framerMotion' },
      { name: 'GSAP', note: 'Timeline & ScrollTrigger', icon: 'gsap' },
      { name: 'Git & GitHub', note: 'Version control & collaboration', icon: 'git' },
      { name: 'Vite', note: 'Build tooling', icon: 'vite' },
      { name: 'EmailJS', note: 'Client-side email integration', icon: 'mail' },
    ],
  },
  {
    tag: 'Frontend → Full Stack',
    title: 'What I am adding next',
    items: [
      { name: 'Next.js', note: 'App Router, rendering and full-stack React', icon: 'nextjs' },
      { name: 'TanStack Query', note: 'Data fetching, caching, server state', icon: 'tanstack' },
      { name: 'Frontend Testing', note: 'Vitest, React Testing Library and Playwright', icon: 'testing' },
      { name: 'Node.js', note: 'Server-side JavaScript and API foundations', icon: 'nodejs' },
      { name: 'PostgreSQL', note: 'Relational data modelling and queries', icon: 'postgresql' },
      { name: 'Prisma', note: 'Type-safe database access and migrations', icon: 'prisma' },
      { name: 'API & Authentication', note: 'Secure application data and user sessions', icon: 'api' },
      { name: 'Supabase', note: 'Auth, Postgres and storage as a backend bridge', icon: 'supabase' },
    ],
  },
  {
    tag: 'How I Work',
    title: 'Beyond the stack',
    items: [
      { name: 'Accessibility', note: 'Keyboard paths, focus and reduced motion', icon: 'accessibility' },
      { name: 'Performance', note: 'Asset weight, loading behavior and layout stability', icon: 'performance' },
      { name: 'Design Systems', note: 'Tokens, primitives, one source of truth', icon: 'designSystem' },
      { name: 'Code Review', note: 'Branches, PRs, review before merge', icon: 'codeReview' },
      { name: 'Responsive Craft', note: 'Fluid type and spacing down to 340px', icon: 'responsive' },
      { name: 'Debugging', note: 'Root causes, not symptom patches', icon: 'debug' },
    ],
  },
]
