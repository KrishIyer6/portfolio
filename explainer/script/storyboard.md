# Storyboard: How ArchiTech works

1280 x 720, 30 fps, 2280 frames. One example runs through the whole film: the same six-by-four floor plan, which is also the ground floor of the building on the site.

Constant overlay: title at top left, subtitle line above the chapter bar, six-segment progress bar at the bottom with the current chapter lit. Amber marks the one thing to look at in each shot.

| # | Chapter | Time | Picture | Motion | Focus |
|---|---|---|---|---|---|
| 1 | Upload | 0:00 to 0:10 | A floor plan inside a dashed drop zone | Outer walls draw, then inner walls one by one, then the door swing. The sheet lifts as the file name appears. | The plan |
| 2 | Extraction | 0:10 to 0:24 | Plan at left, "Express to Claude API" in the middle, JSON at right | Five keys type in one after another: walls, doors, windows, stairs, furniture. "validated" lands last. | The JSON |
| 3 | 3D model | 0:24 to 0:37 | Isometric wireframe building with a floor counter | Floors stack from one to five. The roof morphs flat, then gable, then hip. | The roof, in amber |
| 4 | Cut and walk | 0:37 to 0:50 | The five-floor building | A dashed amber plane sweeps across and clips the front away. "1.65 m eye height" fades in. | The cut plane |
| 5 | Fire route | 0:50 to 1:03 | Top-down plan with a grid | Grid fades in. A red cell marks the fire. The route draws from the start dot, around the fire, and out the front door. | The route |
| 6 | Bill of materials | 1:03 to 1:16 | Two schedule rows, three export chips, one large number | Rows appear, then CSV, DXF, JSON, then 186. | 186 |

Transitions: each chapter fades out over the last third of a second and the next fades in. The plan carries from chapter 1 into chapter 2, and the building carries from chapter 3 into chapter 4.

The route in chapter 5 is not drawn by hand. It is the output of the same Dijkstra search the site's viewer runs.
