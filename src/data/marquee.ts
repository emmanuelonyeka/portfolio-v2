import { asset } from '../config/site'

/**
 * Clip filenames inside /public/videos/marquee.
 *
 * This array is the ONLY thing to edit when clips are added or renamed —
 * the two rows below rebalance and re-pad themselves from it.
 */
interface MarqueeClip {
  src: string
  poster: string
}

const marqueeClipFiles = [
  { file: 'solara-showcase-01.mp4', poster: 'images/projects/solara/desktop/01-hero.webp' },
  { file: 'lumiere-showcase-01.mp4', poster: 'images/projects/lumiere/desktop/01-hero.webp' },
  { file: 'primenest-showcase-01.mp4', poster: 'images/projects/primenest/desktop/01-hero.webp' },
  { file: 'nairasave-showcase-01.mp4', poster: 'images/projects/nairasave/desktop/01-hero.webp' },
  { file: 'lumiere-showcase-02.mp4', poster: 'images/projects/lumiere/desktop/02-menu.webp' },
  { file: 'primenest-showcase-02.mp4', poster: 'images/projects/primenest/desktop/02-property-listings.webp' },
  { file: 'solara-showcase-02.mp4', poster: 'images/projects/solara/desktop/03-fleet.webp' },
  { file: 'lumiere-showcase-03.mp4', poster: 'images/projects/lumiere/desktop/03-dining-experiences.webp' },
  { file: 'solara-showcase-03.mp4', poster: 'images/projects/solara/desktop/04-destinations.webp' },
  { file: 'nairasave-showcase-02.mp4', poster: 'images/projects/nairasave/desktop/02-currency-calculator.webp' },
]

export const marqueeClips: MarqueeClip[] = marqueeClipFiles.map(({ file, poster }) => ({
  src: asset(`videos/marquee/${file}`),
  poster: asset(poster),
}))

const midpoint = Math.ceil(marqueeClips.length / 2)

export const marqueeRowTop = marqueeClips.slice(0, midpoint)

/** With a single clip there is no second half to take, so the row reuses the lot. */
export const marqueeRowBottom =
  marqueeClips.length > 1 ? marqueeClips.slice(midpoint) : marqueeClips
