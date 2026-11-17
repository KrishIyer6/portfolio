# To fill in

Everything here is marked `TODO` in the code. The site works without any of it.

## Decide before you publish

- [ ] **Resume and phone number.** `public/Krish_Iyer_Resume.pdf` is in place and the Resume button links to it, but that PDF has your phone number on it. Your brief said no phone number on the public site. Either export a copy without it and replace the file, or decide you are fine with it.
- [ ] **Charleston.** You wrote "Charleston NC". It is pinned as Charleston, SC. Change it in `offClock.travel.places` in `src/data/content.ts` if you meant somewhere else.
- [ ] The live site is https://krish-iyer-portfolio.vercel.app and the canonical, Open Graph, and JSON-LD URLs point there. If you add a custom domain, update them in `index.html` and `identity.siteUrl`.
- [ ] Turn on two-factor authentication for your Vercel account. The CLI flagged that it is off: https://vercel.com/account/settings/authentication

## Files to add

- [ ] `public/og-image.png` is a simple drawn card (`node scripts/make-og.mjs` redraws it). Replace it with a real screenshot of the hero if you want a richer link preview.
- [ ] Real screenshots for Make-A-Dash (`project-makeadash-1..3`), Motion Mentor (`project-motionmentor-1`), FuturePop (`project-futurepop-1`), Premier League Match Predictor (`project-plpredictor-1`), and Sudoku CSP Solver (`project-sudoku-1`). Until then each shows a drawn mockup in that project's own look, with no label on the page. They are not captures of the real apps, so swap in real ones when you can. Make-A-Dash is live, so that one is a quick screenshot. See `ASSETS.md`.
- [ ] Larger originals, if you have them. The ArchiTech, Ai-FixIT, and VeinViz screenshots are 806 px wide and the headshot is 400 px, so they look soft on large or high-density screens.
- [ ] Personal photos for Off the clock (matchday, travel, food, climbing, sports). That strip stays hidden until at least one exists. These are not generated, on purpose: they would be invented photos of your life.

## Links (`src/data/content.ts`)

- [ ] ArchiTech: `liveUrl`, `repoUrl` (the demo video is set to your YouTube link)
- [ ] Ai-FixIT: `liveUrl`, `repoUrl`, `demoVideoUrl`
- [ ] Make-A-Dash: `repoUrl`, `demoVideoUrl` (the live URL is set to makeadash.tech)
- [ ] VeinViz, Motion Mentor, FuturePop, Premier League Match Predictor, Sudoku CSP Solver: `liveUrl`, `repoUrl`, `demoVideoUrl`

A YouTube link in `demoVideoUrl` adds an embedded player to that project's case file automatically.

## Content

- [ ] **Hackathon captions.** `hackathonGallery` uses generic captions ("On stage with the team", "Mid-build, laptops out") because the events in the two photos are not named anywhere. Edit them if you want to name the hackathons.
- [ ] **Dishes.** The 29 globe places are in, with no dishes. Add `dish: '...'` to any place and it shows under the place name.
- [ ] **FuturePop wording.** The blurb says it predicts 2024 fertility rates for 150+ countries, as your resume does, framed as where each country's population is heading. If the project predicts population directly, change the blurb and bullet.
- [ ] Ai-FixIT and VeinViz have no dates. Add them to `dates` if you want them shown.
- [ ] `identity.taglineIndex`: three taglines are written. Index 0 is in use.
- [ ] `story`: the four "How I build" steps. Each is tied to a role or project; edit freely, but keep the numbers accurate.
- [ ] `stackLayers`: the four layer names and one-liners beside the hero stack.
- [ ] The mockups contain sample content (bar lengths, a "last five" form line, map shading). None of it is real data. If any of it bothers you, edit the drawing functions in `scripts/generate-illustrations.mjs`.
- [ ] Alt text in `src/data/images.ts`. It was written from looking at your images; correct anything that is wrong, and rewrite the five "Mockup of..." entries when real screenshots replace them.

## Explainer video

- [ ] The "How ArchiTech works" video is rendered and embedded in the ArchiTech case file, next to your YouTube demo, but it is silent. Record or synthesize the narration in `explainer/script/narration.md`, then follow "Adding the voiceover" in `explainer/README.md` and update `explainer.note` in `content.ts`. To drop it and keep only the YouTube demo, set `explainer.ready` to `false`.

## Not yet verified

- [ ] A Lighthouse run on the deployed build.
- [ ] A real phone. Only 375 px emulation was used.
- [ ] `prefers-reduced-motion` on a device with the setting turned on.
