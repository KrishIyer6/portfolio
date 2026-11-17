# How ArchiTech works: explainer video

A 76-second motion-graphics explainer, drawn entirely in code with Remotion. Black canvas, dot-field backdrop, six chapters with a progress bar, burned-in subtitles, and a matching `.vtt` caption file. It is a separate project and is not part of the site bundle.

## Status

- Rendered: the picture, the on-screen subtitles, the chapter bar, the captions file, and a poster frame.
- Not done: the voiceover. This machine has no Python, and the text-to-speech tooling needs it, so the cut is silent. The narration script below is written and timed, ready to record or synthesize.

## Commands

```bash
npm install
```

```bash
npm run studio
```

```bash
npm run build
```

`npm run build` writes `out/architech-explainer.mp4`, `.webm`, `.vtt`, and `-poster.jpg`. Copy those four files into `../public/video/`. The site shows the player when `explainer.ready` is `true` in `../src/data/content.ts`.

## Adding the voiceover

1. Record or synthesize the narration in `script/narration.md`. Each line has its start time.
2. Save it as `public/voiceover.mp3` in this folder.
3. In `src/Explainer.tsx`, import `Audio` and `staticFile` from `remotion` and add `<Audio src={staticFile('voiceover.mp3')} />` inside the top-level `AbsoluteFill`.
4. If your read runs faster or slower, adjust the `from` and `to` times in `src/script.ts`. The subtitles and the `.vtt` both come from that file.
5. `npm run build` again.

## Files

| File | Purpose |
|---|---|
| `src/script.ts` | Chapters, caption text, and timing. The single source for subtitles and captions. |
| `src/Explainer.tsx` | The six scenes and the overlay |
| `src/building.ts` | Copy of the site's procedural building and Dijkstra route, so the video draws the same geometry |
| `scripts/make-vtt.mjs` | Exports the caption file |
| `script/narration.md` | Narration script |
| `script/storyboard.md` | Shot list |

Every fact in the video comes from the ArchiTech project description. The JSON on screen shows key names only, because the real counts depend on the plan.
