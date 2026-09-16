# Final media manifest

This is the accepted mapping for `portfolio-final-media.zip`. Paths are relative to `public/`.

## Screenshot output rules

- Desktop captures keep their native 16:10 composition and are exported at up to 1600×1000.
- Mobile captures keep their native composition, are exported at up to 900×1700, and display inside a 9:17 `object-contain` frame.
- No screenshot is cropped or enlarged.
- Every final screenshot is stripped WebP at quality 76 and is below 100 KiB.

## Lumière

| Supplied order | Final path |
| --- | --- |
| Desktop 01 | `images/projects/lumiere/desktop/01-hero.webp` |
| Desktop 02 | `images/projects/lumiere/desktop/02-menu.webp` |
| Desktop 03 | `images/projects/lumiere/desktop/03-dining-experiences.webp` |
| Desktop 04 | `images/projects/lumiere/desktop/04-reservation-confirmation.webp` |
| Desktop 05 | `images/projects/lumiere/desktop/05-modify-reservation.webp` |
| Mobile 01 | `images/projects/lumiere/mobile/01-hero.webp` |
| Mobile 02 | `images/projects/lumiere/mobile/02-menu.webp` |
| Mobile 03 | `images/projects/lumiere/mobile/03-dining-experiences.webp` |
| Mobile 04 | `images/projects/lumiere/mobile/04-reservation-calendar.webp` |
| Mobile 05 | `images/projects/lumiere/mobile/05-cancellation-confirmation.webp` |

## PrimeNest

| Supplied order | Final path |
| --- | --- |
| Desktop 01 | `images/projects/primenest/desktop/01-hero.webp` |
| Desktop 02 | `images/projects/primenest/desktop/02-property-listings.webp` |
| Desktop 03 | `images/projects/primenest/desktop/03-founder.webp` |
| Desktop 04 | `images/projects/primenest/desktop/04-agents.webp` |
| Desktop 05 | `images/projects/primenest/desktop/05-contact.webp` |
| Mobile 01 | `images/projects/primenest/mobile/01-hero.webp` |
| Mobile 02 | `images/projects/primenest/mobile/02-property-listings.webp` |
| Mobile 03 | `images/projects/primenest/mobile/03-property-detail.webp` |
| Mobile 04 | `images/projects/primenest/mobile/04-navigation-menu.webp` |
| Mobile 05 | `images/projects/primenest/mobile/05-article.webp` |

## NairaSave

| Supplied order | Final path |
| --- | --- |
| Desktop 01 | `images/projects/nairasave/desktop/01-hero.webp` |
| Desktop 02 | `images/projects/nairasave/desktop/02-currency-calculator.webp` |
| Desktop 03 | `images/projects/nairasave/desktop/03-waitlist-success.webp` |
| Desktop 04 | `images/projects/nairasave/desktop/04-savings-dashboard.webp` |
| Mobile 01 | `images/projects/nairasave/mobile/01-hero.webp` |
| Mobile 02 | `images/projects/nairasave/mobile/02-currency-calculator.webp` |
| Mobile 03 | `images/projects/nairasave/mobile/03-waitlist.webp` |
| Mobile 04 | `images/projects/nairasave/mobile/04-savings-dashboard.webp` |

## Solara

| Supplied order | Final path |
| --- | --- |
| Desktop 01 | `images/projects/solara/desktop/01-hero.webp` |
| Desktop 02 | `images/projects/solara/desktop/02-quote-request.webp` |
| Desktop 03 | `images/projects/solara/desktop/03-fleet.webp` |
| Desktop 04 | `images/projects/solara/desktop/04-destinations.webp` |
| Desktop 05 | `images/projects/solara/desktop/05-team.webp` |
| Mobile 01 | `images/projects/solara/mobile/01-hero.webp` |
| Mobile 02 | `images/projects/solara/mobile/02-contact.webp` |
| Mobile 03 | `images/projects/solara/mobile/03-charter-pricing.webp` |
| Mobile 04 | `images/projects/solara/mobile/04-quote-calendar.webp` |
| Mobile 05 | `images/projects/solara/mobile/05-navigation-menu.webp` |

## Project preview videos

| Project | Final path | Display treatment |
| --- | --- | --- |
| Lumière | `videos/projects/lumiere-preview.mp4` | Native 1080×676, contained |
| PrimeNest | `videos/projects/primenest-preview.mp4` | Native 1280×800, contained |
| NairaSave | `videos/projects/nairasave-preview.mp4` | Native 1080×1080, contained; timing normalized to 30 fps |
| Solara | `videos/projects/solara-preview.mp4` | Native 1280×800; contained with a 1.2% desktop-only edge crop |

Every preview is H.264/yuv420p, muted in the interface, fast-start enabled, fully decoded during verification, and below the 6 MiB project-video budget.

## Marquee order

Each supplied clip stays at 960×600 (16:10), uses H.264/yuv420p with fast-start metadata, and is below 2 MiB. The two rows are deliberately interleaved so the same project never touches itself horizontally, vertically, or across a repeated-row boundary.

| Position | Top row | Bottom row |
| --- | --- | --- |
| 1 | `solara-showcase-01.mp4` | `primenest-showcase-02.mp4` |
| 2 | `lumiere-showcase-01.mp4` | `solara-showcase-02.mp4` |
| 3 | `primenest-showcase-01.mp4` | `lumiere-showcase-03.mp4` |
| 4 | `nairasave-showcase-01.mp4` | `solara-showcase-03.mp4` |
| 5 | `lumiere-showcase-02.mp4` | `nairasave-showcase-02.mp4` |
