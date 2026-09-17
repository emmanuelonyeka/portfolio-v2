# Emmanuel Onyekachi — Portfolio

A responsive, single-page frontend portfolio built with React, TypeScript, Tailwind CSS, and Vite. It presents selected work for hiring teams and a separate service path for prospective clients without turning the site into two competing experiences.

## Local setup

Use Node 20, then install the project dependencies and start Vite:

```bash
npm install
npm run dev
```

The hand-off includes the final optimized project screenshots and videos. `node_modules`, `dist`, `.git`, and `.env` are intentionally excluded; install dependencies locally and preserve the existing private `.env` in the GitHub-linked folder.

## Make the contact form work

Merging code does **not** bring `.env` with it because `.env` is correctly ignored by Git and excluded from ZIPs. Copy your existing `.env` manually into the project root (beside `package.json`), or create it from `.env.example`:

```bash
cp .env.example .env
```

Fill all three values and restart `npm run dev` whenever they change:

```dotenv
VITE_EMAILJS_SERVICE_ID=your_service_id
VITE_EMAILJS_TEMPLATE_ID=your_template_id
VITE_EMAILJS_PUBLIC_KEY=your_public_key
```

The EmailJS template must accept `from_name`, `reply_to`, `subject`, and `message`; set its Reply-To field to `{{reply_to}}`. In EmailJS Account → Security, allow `http://localhost:5173` while testing and `https://emmanuelonyekachi.netlify.app` in production. In Netlify, add the same three variables under Site configuration → Environment variables, then trigger a fresh deploy. The values are public client identifiers, but allowed-origin restrictions protect the quota.

## Release checks

```bash
npm run check
```

The release gate performs the strict TypeScript build, source/SEO checks, public-asset validation, a production build, and compressed bundle-budget checks. GitHub Actions runs the same command for pushes and pull requests.

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the local Vite server |
| `npm run clean` | Remove the generated `dist/` directory safely |
| `npm run typecheck` | Run strict TypeScript checks |
| `npm run verify` | Check content, social, SEO, project, and regression invariants |
| `npm run audit:assets` | Validate public file formats and media budgets |
| `npm run build` | Produce `dist/` and enforce bundle budgets |
| `npm run preview` | Preview the production build |

## Where content lives

- `src/config/site.ts` — identity, location, contact details, social profiles, availability, and the résumé filename.
- `src/data/` — projects, About copy, services, skills, beliefs, process, packages, navigation, contact content, and marquee media.
- `src/components/` — section, layout, project, and shared UI components.
- `public/images/projects/<project>/desktop|mobile/` — the 38 numbered, descriptively named case-study screenshots.
- `public/videos/projects/` — one optimized preview for each selected project.
- `public/videos/marquee/` — ten lightweight showcase clips in their intentional non-repeating row order.
- `public/images/` — the project library above plus portrait variants and social preview artwork.

Project case studies use lightweight shareable URLs such as `?case=solara-jets#work`; browser Back and Forward close or restore the correct dialog without adding a routing library.

### Control source and checkout links

`code` and `purchaseUrl` are independent optional fields in `src/data/projects.ts`:

- Keep `code` only when a repository is intentionally public. NairaSave is the current public example.
- Omit `code` for private or commercial work. A hidden button is not protection, so private repository URLs are not shipped in the production data.
- Add `purchaseUrl` only after the real Gumroad or marketplace listing is live. It adds the `Template Available` badge and makes `Buy Template` the primary case-study action.
- Until PrimeNest or Solara is listed, both fields remain absent: visitors can view the live project and copy its case-study link without seeing a placeholder purchase action.

## Final media library

All final media is included. Every project screenshot is a WebP below 100 KiB, project previews stay below 6 MiB, and marquee clips stay below 2 MiB. `src/data/projects.ts` owns screenshot order and project-preview paths; `src/data/marquee.ts` owns the ten-clip showcase order. Video elements use `preload="none"`, activate near the viewport, pause off-screen, preserve the supplied aspect ratio, respect reduced-motion/data preferences, and provide a manual play control when autoplay is unavailable.

## Performance and accessibility

- Responsive WebP images and an explicitly preloaded hero image protect the largest-contentful paint.
- Case-study and EmailJS code loads only when requested.
- Lenis loads after first paint as a progressive enhancement. It smooths wheel input with the same 1.15-second easing used by Solara, while touch remains native and reduced-motion disables it.
- The background atmosphere is static CSS rather than a continuously running canvas.
- The project stack activates only at `900px × 840px` or larger; shorter or narrower viewports use normal flow.
- Dialog focus trapping, keyboard navigation, keyboard-only focus rings, reduced motion, semantic landmarks, form errors, and 44px touch targets are built in. The scrolled mobile header keeps those targets while reducing its visible controls to an equal 40px height.
- A static branded `public/404.html` gives unknown Netlify paths a real 404 response; a root React error boundary provides reload, home, and email recovery for unexpected render failures.
- About and case-study dialogs stay centred at every width. On short-height and phone-landscape viewports, the project footer becomes normal scrolling content instead of consuming the visible modal height.
- Canonical metadata, Open Graph/Twitter cards, ProfilePage/Person structured data, `robots.txt`, and `sitemap.xml` are included.

## Intentional adjustment points

The named constants directly below `ABOUT REVEAL TUNING` in `src/components/sections/About.tsx` control the About paragraph animation:

- `ABOUT_REVEAL_START_OFFSET_PX`: `0` starts when the first line crosses the top of the floating WhatsApp control; positive starts earlier, negative later.
- `ABOUT_REVEAL_END_OFFSET_PX`: `0` finishes exactly when the About section reaches the viewport top; positive finishes earlier, negative later.
- `ABOUT_WORD_SPREAD`: lower compresses the whole word sequence.
- `ABOUT_WORD_FADE_WINDOW`: lower makes each individual word brighten faster.

The short-height project-footer condition lives beside `.case-study-footer` in `src/index.css`. Change its `max-height` values only if real-device screenshots show that the normal sticky footer still leaves too little reading room.

The Process scale values are labelled `PROCESS MOTION TUNING` in `src/components/sections/Process.tsx`. The stacked-project closing-note offset is labelled `VISUAL TUNING` beside `.project-summary` in `src/index.css`. Comments elsewhere explain non-obvious browser behavior or architecture rather than repeating self-explanatory code.

## Deployment

`netlify.toml` pins Node 20, publishes `dist`, and defines cache and security headers. Add the EmailJS environment values in the host dashboard before enabling the production form. After the first production deploy, submit `/sitemap.xml` in Google Search Console and Bing Webmaster Tools, test the homepage in Google's Rich Results Test, and verify the Open Graph image with a social-card debugger.
