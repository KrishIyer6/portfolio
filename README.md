# Krish Iyer: portfolio

A static, single-page portfolio in a light paper-and-ink theme with one cobalt accent. The hero is the product stack Krish works across, drawn as four drafting sheets (data, model, services, interface). It assembles on load, tilts with the pointer, and lights a layer when you hover it. The page scrolls normally from the first pixel; nothing is pinned.

## Run it

```bash
npm install
npm run dev
```

## Build it

```bash
npm run build
npm run preview
```

`npm run build` type-checks, then writes a fully static site to `dist/`. Vite is configured with `base: './'`, so every asset path is relative and the same build works at a domain root or inside any subfolder.

## Edit it

| What | Where |
|---|---|
| All copy, links, projects, skills, places | `src/data/content.ts` |
| Image slots, alt text | `src/data/images.ts` |
| Colors, type scale, easing | `src/styles/tokens.css` |
| Design rules | `DESIGN.md` |
| What to export and at what size | `ASSETS.md` |
| What is still missing | `TODO.md` |
| The hero stack: what is drawn on each sheet | `src/components/HeroStack.tsx` |
| The hero stack: layer names and one-liners | `stackLayers` in `src/data/content.ts` |
| The "How I build" steps | `story` in `src/data/content.ts` |

A project's Live, Source, and Demo buttons appear only when the matching URL in `content.ts` is filled in. If the demo URL is a YouTube link, the case file also embeds the video. Nothing is requested from YouTube until the visitor presses play.

## Add images

Put originals in `image-source/`, named after their slot, then:

```bash
npm run images
```

Five projects have no screenshots yet, so their covers are mockups drawn by a script, each in that project's own look. To redraw them:

```bash
npm run illustrations
```

```bash
npm run images
```

The script only ever overwrites files it drew itself (it keeps a list in `image-source/.illustrations.json`). Drop in a real screenshot with the same slot name, in any format, and the script leaves that slot alone from then on. See `ASSETS.md`.

## Deploy

### Vercel (live now)

The site is live at https://krish-iyer-portfolio.vercel.app, in the Vercel project `krish-iyer-portfolio`. Vercel builds it from source with `npm run build`. To publish a change:

```bash
npx vercel deploy --prod
```

`.vercelignore` keeps the explainer project, image originals, and private files off the upload. There is no Git connection yet, so deploys only happen when you run that command. To deploy on every push instead, put the repository on GitHub and connect it in the Vercel project settings.

### University web host (subfolder)

To also publish at `https://webpages.charlotte.edu/kiyer6/`:

1. `npm run build`
2. Upload the contents of `dist/` (not the folder itself) into your web directory, so that `index.html` sits at the top of `kiyer6/`.
3. Open the URL. Nothing else needs configuring: navigation uses in-page anchors, so there is no server routing to set up.

The canonical and social-preview URLs in `index.html` point at the Vercel address. That is fine for a mirror. If the university address becomes the main one, change them there.

### GitHub Pages

1. Push the repository to GitHub.
2. Build and publish `dist/`. The simplest route is a `gh-pages` branch:

```bash
npm run build
```

```bash
npx gh-pages -d dist
```

3. In the repository settings, set Pages to serve from the `gh-pages` branch.

Because the build uses relative paths, it works at `https://<user>.github.io/<repo>/` with no extra configuration.

### Vercel or Netlify

Framework preset: Vite. Build command `npm run build`, output directory `dist`.

## Project layout

```
src/
  data/         content.ts (copy), images.ts (image manifest)
  styles/       tokens.css (design tokens), global.css
  lib/          GSAP setup, smooth scroll, environment checks, small stores
  components/   nav, cursor, preloader, image system, charts, project detail
  sections/     one file per page section, plus offclock/ for the hobby pieces
  three/        procedural building and ArchiTech viewer, globe, contour shader (the hero is CSS 3D, not WebGL)
scripts/        optimize-images.mjs, generate-illustrations.mjs
image-source/   your original images
explainer/      "How ArchiTech works" video project (separate from the site bundle)
```

## How the 3D is kept cheap

- The hero uses no WebGL. It is four HTML sheets with SVG drawings in CSS 3D, so it is sharp at any size and costs almost nothing.
- All Three.js code is in lazy chunks. The viewer, the globe, and the contact shader load only when they come near the viewport.
- Every canvas stops rendering when it is off screen. The viewer renders on demand, only when something changes.
- Device pixel ratio is capped. Phones and low-power devices skip post-processing and use a lower ratio.
- Geometry and materials are disposed on unmount.
- No WebGL: the viewer falls back to an SVG drawing generated from the same building data. The hero is unaffected.
- `prefers-reduced-motion`: no pin, parallax, smooth scroll, preloader, or custom cursor. The hero stack appears already open and does not cycle or tilt.

## Trade-offs

- Light theme only.
- The five project mockups are drawn, not captured. Replace them with real screenshots when you can; see `ASSETS.md`.
- Initial JavaScript is about 238 kB gzipped (React, GSAP, Motion, D3). Three.js adds about 243 kB in a separate chunk. The whole `dist/` folder is about 9 MB, most of it images and the explainer video.
- The ArchiTech demo plays from YouTube, so that one video depends on a third party. Everything else is self-hosted.
- The orbit viewer does not zoom on wheel or pinch, so it never traps page scroll.
