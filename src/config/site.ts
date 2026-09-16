/**
 * Single source of truth for every piece of identity, contact and link data
 * used anywhere on the site. Nothing here should ever be re-typed in a component.
 */

export const site = {
    name: 'Emmanuel Onyekachi',
    role: 'Frontend Developer',
    location: {
      city: 'Ibadan',
      country: 'Nigeria',
      timeZone: 'Africa/Lagos',
    },
  
    /** Deployed origin, no trailing slash. Used for canonical + Open Graph URLs. */
    url: 'https://emmanuelonyekachi.netlify.app',
  
    email: 'emmanuel.onyekachi.dev@gmail.com',
  
    /** Digits only, country code included — wa.me requires this format. */
    whatsapp: '2348147931141',
  
    /** Filename inside /public. Resolved against BASE_URL at the call site. */
    resume: 'Emmanuel-Onyekachi-Resume.pdf',
  
    socials: {
      github: 'https://github.com/emmanuelonyeka',
      linkedin: 'https://www.linkedin.com/in/emmanuelymb/',
      x: 'https://x.com/emmmybills',
    },
  
    availability: {
      roles: true,
      freelance: true,
      label: 'Open to roles & projects',
    },
  } as const
  
  /** Resolves a file in /public against the deployment base path. */
  export const asset = (path: string) => `${import.meta.env.BASE_URL}${path}`
  
