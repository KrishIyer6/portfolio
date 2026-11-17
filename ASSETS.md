# Image and media slots

## How it works

1. Export an image and name it after its slot, for example `project-makeadash-2.jpg` (JPEG, PNG, WebP, or AVIF).
2. Put it in `image-source/`.
3. Run `npm run images`.

The script writes AVIF, WebP, and JPEG files at several widths into `public/images/` and records them in `src/data/images.generated.json`. The site only requests files listed there, so a missing image never produces a broken icon or a 404.

Alt text, intrinsic size, and the placeholder color for each slot are in `src/data/images.ts`. Update the alt text and the size when you add or replace an image.

## What a slot shows when it has no real image

| Situation | What appears |
|---|---|
| Make-A-Dash, Motion Mentor, FuturePop, Premier League Match Predictor, Sudoku CSP Solver | A drawn mockup in that project's own look |
| A project with no image at all (none right now) | A line schematic drawn in the page |
| An empty slot on a project that has other images | Nothing. Empty slots are left out of the case-file gallery. |
| Hackathon gallery, Off the clock photos | The gallery is hidden until at least one image exists |

## Generated mockups

`npm run illustrations` draws five covers with `scripts/generate-illustrations.mjs` and saves them as PNGs in `image-source/`. Run `npm run images` afterwards.

- Each is drawn in its own project's style, on purpose, so the project grid does not look like five copies of the portfolio: Make-A-Dash is a dark widget board, Motion Mentor a light sports-analysis screen, FuturePop a shaded world map, the Match Predictor a match-day card, Sudoku a paper puzzle.
- They are mockups, not captures of the real apps, and the page does not label them. Their alt text says "Mockup of...". They are kept out of the browser frame that real web-app screenshots get.
- Sample content in them (bar lengths, map shading, a form line) is not real data.
- The script keeps a list of the files it drew in `image-source/.illustrations.json` and only ever overwrites those.
- To replace one with a real screenshot, drop the real file into `image-source/` with the same slot name, in any format, then run `npm run illustrations` and `npm run images`. The drawing is removed and web-app screenshots go into a browser frame.
- To change a drawing, edit its function in the script (`makeADash`, `motionMentor`, `futurePop`, `plPredictor`, `sudoku`).

## Looping video in place of a screenshot

Add the image as the poster, then set `video: { mp4: 'images/<file>.mp4', webm: 'images/<file>.webm' }` on the slot in `src/data/images.ts`. The video plays muted and inline. Under reduced motion only the poster shows.

## Slots

| Slot | Shown in | Ratio | Export at | Status |
|---|---|---|---|---|
| `portrait` | About | 4:5 | 1600 x 2000 | Supplied, 400 x 400 |
| `project-architech-1` | ArchiTech case file: start screen | 16:9 | 2400 x 1350 | Supplied, 806 px wide |
| `project-architech-2` | ArchiTech case file: 3D model. Also the demo video poster and a hackathon polaroid | 16:9 | 2400 x 1350 | Supplied, 806 px wide |
| `project-architech-3` | ArchiTech case file: roof off | 16:9 | 2400 x 1350 | Supplied, 806 px wide |
| `project-architech-4` | ArchiTech case file: escape route | 16:9 | 2400 x 1350 | Supplied, 3000 px wide |
| `project-aifixit-1..3` | Ai-FixIT card and case file, in a browser frame | about 2:1 | 2400 px wide | Supplied, 806 px wide |
| `project-makeadash-1` | Make-A-Dash card and case file | 16:10 | 2400 x 1500 | Mockup |
| `project-makeadash-2..3` | Make-A-Dash case file | 16:10 | 2400 x 1500 | Empty |
| `project-veinviz-1` | VeinViz card and case file. Also a hackathon polaroid | 16:9 | 1920 x 1080 | Supplied, 806 px wide |
| `project-motionmentor-1` | Motion Mentor card and case file | 16:10 | 2400 x 1500 | Mockup |
| `project-futurepop-1` | FuturePop card and case file | 16:10 | 2400 x 1500 | Mockup |
| `project-plpredictor-1` | Premier League Match Predictor card and case file | 16:10 | 2400 x 1500 | Mockup |
| `project-sudoku-1` | Sudoku CSP Solver card and case file | 16:10 | 2400 x 1500 | Mockup |
| `hackathon-1` | Polaroid gallery under Projects | any, cropped square | 1600 px wide | Supplied |
| `hackathon-2` | Polaroid gallery under Projects | any, cropped square | 1600 px wide | Supplied |
| `hackathon-3..4` | Not used by the gallery right now | | | Empty |
| `ta-1` | Reserved, not placed yet | 3:2 | 1600 x 1067 | Empty |
| `matchday-1..2` | Off the clock photo strip | 4:3 | 1600 x 1200 | Empty |
| `travel-1..8` | Off the clock photo strip | 4:3 | 1600 x 1200 | Empty |
| `food-1..6` | Off the clock photo strip | 4:3 or 1:1 | 1200 x 1200 | Empty |
| `climbing-1..2` | Off the clock photo strip | 4:3 | 1600 x 1200 | Empty |
| `sports-1..2` | Off the clock photo strip | 4:3 | 1600 x 1200 | Empty |

The first image available for a project becomes its card cover. Cards crop covers to 16:10 (featured) or 16:9 (compact); the case file and the lightbox show the whole image.

## The hackathon gallery

Which images appear, in what order, and their captions are set in `hackathonGallery` in `src/data/content.ts`. It currently uses `hackathon-2`, `project-architech-2`, `hackathon-1`, and `project-veinviz-1`. To add more, put a photo in `hackathon-3` or `hackathon-4` and add an entry.

## Video

| File | Where | Notes |
|---|---|---|
| ArchiTech demo | YouTube, set in `demoVideoUrl` | Embedded in the case file. Loads from YouTube only when someone presses play. |
| `public/video/architech-explainer.*` | Rendered from `explainer/` | Silent, with burned-in subtitles and a `.vtt` file. See `explainer/README.md`. |

## Other files in `public/`

- `Krish_Iyer_Resume.pdf`: in place. It has a phone number on it; see `TODO.md`.
- `og-image.png` (1200 x 630, used for link previews): a drawn card made by `scripts/make-og.mjs`. Replace it with a hero screenshot if you prefer.

No club crests, brand logos, or player images.
