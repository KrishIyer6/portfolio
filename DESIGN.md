# Design system: paper, ink, and one blue

The site is a drawing set for how Krish builds. It reads like a printed technical sheet: off-white paper, near-black ink, a faint grid, and a single cobalt accent that marks whatever is active or measured.

The subject is the developer, not any one project. ArchiTech keeps its own moment, the live viewer in Projects, and nothing outside that block refers to it.

## How it got here

| Round | What was built | What Krish said | What changed |
|---|---|---|---|
| 1 | Dark Prussian-blue "blueprint" theme. Hero was a WebGL wireframe building with a pinned scroll story. | The site reads as if it is built off ArchiTech. | Hero subject became the product stack: data, model, services, interface. |
| 2 | Same dark theme. WebGL stack with a four-screen pinned scroll story. | Likes the idea, not the 3D scrolling or the drawing quality. Does not like the color theme. Project images look like the website. | This version. |
| 3 | Light paper-and-ink theme. Stack redrawn as crisp CSS 3D sheets, hover-driven, nothing pinned. Project mockups in each project's own look. | | |

The theme and the hero behavior in round 3 were chosen by Krish from concrete options, with 21st.dev used for reference (the light half of its "Portfolio Pro Dark" theme set the paper and ink values; the cobalt accent replaced that theme's lime).

## Color

Tokens live in `src/styles/tokens.css`. Contrast is WCAG 2 against `paper`.

| Token | Hex | Role | Contrast on paper |
|---|---|---|---|
| `paper` | `#fbfcf8` | Page ground | |
| `panel` | `#ffffff` | Raised panels, cards, sheets | |
| `wash` | `#eef0e8` | Quiet fills | |
| `edge` | `#c3cad6` | Scrollbar, inert marks | |
| `ink` | `#0f172a` | Primary text and headings | 17.3 |
| `dim` | `#334155` | Secondary text | 10.1 |
| `faint` | `#586579` | Notes and labels | 5.7 |
| `accent` | `#2447f9` | Cobalt: actions, active states, measured results | 6.1 |
| `accent-deep` | `#1a34c2` | Pressed accent | |
| `draw` | `#1e293b` | Line drawings | |
| `redline` | `#d92d20` | Markup only: fire, the pitch, one climbing route | 4.7 |
| `line` / `line-strong` | ink at 14% / 34% | Hairlines | |

Rules:

- One accent. Cobalt means "act here", "this is selected", or "this was measured". It is never decoration.
- Drawings are ink. A drawing turns cobalt only when it is the active one.
- Neutrals carry a slight cool tint; there is no pure gray.
- Redline never appears in body text.
- Light only.
- Project images are exempt from the palette on purpose. See Images.

## Type

| Role | Face | Use |
|---|---|---|
| Display | Big Shoulders Display (variable, 800) | Headings, the name, large numerals. Always uppercase. |
| Text | Instrument Sans (variable) | Body copy and leads |
| Mono | IBM Plex Mono (400, 500) | Dimensions, dates, labels, button text |

All three are self-hosted through Fontsource.

| Token | Size |
|---|---|
| `--text-note` | 0.75rem |
| `--text-small` | 0.875rem |
| `--text-body` | 1rem to 1.125rem |
| `--text-lead` | 1.2rem to 1.6rem |
| `--text-h3` | 1.75rem to 3rem |
| `--text-h2` | 3rem to 7.5rem |
| `--text-hero` | 3.25rem to 19rem |

Display line-height is 0.8 to 0.95. Body is 1.6 with a 62ch measure. Mono notes are uppercase with 0.06em tracking.

## Layout

- 12-column grid, 96rem max width, gutter `clamp(1.25rem, 4vw, 4rem)`.
- Section rhythm: `clamp(6rem, 15vh, 11rem)` top and bottom.
- Every section opens the same way: a display heading, an optional lead on the right, and a hairline that draws in. What follows is different in each section.
- Content is left-aligned.
- Panels use the `.sheet` class: a white panel with a hairline border and two corner ticks.
- No labels above headings. The sheet number lives in one place, the title block in the nav.

## The hero stack

Four drafting sheets floating in an isometric stack, bottom to top: Data, Model, Services, Interface. Each sheet is a white HTML panel holding an SVG drawing with real mono labels, placed with CSS 3D transforms. There is no WebGL in the hero.

| Sheet | Drawing |
|---|---|
| Data | A table beside a scatter plot with a fitted line |
| Model | A small neural network, input to output |
| Services | Client, API, database, serving, queue and auth boxes joined by arrows |
| Interface | A browser window with a sidebar, a chart and cards |

Behavior:

- On load the sheets fade in from the bottom up while the stack opens.
- The whole stack tilts a few degrees with the pointer.
- Hovering a sheet, or hovering or focusing its entry in the legend, lifts that sheet, turns it cobalt and dims the rest. The legend is how keyboard users reach it.
- Left alone, the stack walks up through its own layers every 2.6 seconds.
- The page scrolls normally from the first pixel. Nothing is pinned or scrubbed.

All sizes inside the stack are in `em`, so one `font-size` on `.hero-stack` scales the whole object. Edit the drawings in `src/components/HeroStack.tsx`, the names and one-liners in `stackLayers` in `content.ts`, and the geometry in the "Hero stack" block of `global.css`.

The four story steps that used to be a pinned scroll scene are now an ordinary section, "How I build", directly under the hero.

## Motion

| Token | Value | Use |
|---|---|---|
| `build` | `cubic-bezier(0.16, 1, 0.3, 1)` | Reveals and entrances (GSAP default) |
| `--ease-out` | `cubic-bezier(0.23, 1, 0.32, 1)` | UI transitions |
| `--ease-in-out` | `cubic-bezier(0.77, 0, 0.175, 1)` | Things that travel on screen (project panel) |
| Press | 140ms | Button press |
| UI | 220ms | Hover, color |
| Reveal | 900 to 1500ms | Scroll reveals |

Rules:

- One authored sequence: the load. The stack assembles while the name fills from the ground up.
- No pinned or scroll-scrubbed scenes anywhere.
- Each section has its own reveal. The timeline draws a line, the chart grows bars, the cards unmask, the GPA measures itself.
- Transforms, opacity, and clip-path only.
- Hover motion is gated to fine pointers. Under `prefers-reduced-motion` the smooth scroll, parallax, preloader, custom cursor, stack tilt and stack cycling are all off.

## 3D elsewhere

The ArchiTech viewer is a white architectural model with ink edges and cobalt windows on a pale ground. The globe is ink coastlines on a paper sphere with cobalt pins. The contact section has a slow contour-line shader in slate, lifting to cobalt under the pointer.

## Pixel accent

One: the preloader leaves through a 4x4 Bayer ordered-dither dissolve.

## Images

Real screenshots are shown as they are. Web-app screenshots sit in a browser frame.

Projects with no screenshot get a drawn mockup, and each mockup uses that project's own look instead of the portfolio's palette, so the project grid shows five different products and not five copies of this site:

| Project | Mockup look |
|---|---|
| Make-A-Dash | Dark widget board with green, violet and blue widgets |
| Motion Mentor | Light sports-analysis screen with a green accent |
| FuturePop | White page with a cream-to-purple shaded world map |
| Premier League Match Predictor | Pitch-green match-day card |
| Sudoku CSP Solver | Warm paper puzzle with blue solved digits |

Mockups carry no label on the page, by Krish's choice. They are not captures of the real apps and their sample content is not real data. Their alt text says "Mockup of...", and they are kept out of the browser frame. Replace them with real screenshots when possible. See `ASSETS.md`.

The portrait is printed as a cobalt duotone and shows true color on hover.
