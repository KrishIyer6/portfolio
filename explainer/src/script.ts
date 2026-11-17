// Single source for the video's chapters, on-screen captions, and the exported .vtt file.
// Every fact here comes from the ArchiTech project description. Times are in seconds.

export const FPS = 30
export const WIDTH = 1280
export const HEIGHT = 720

export type Line = { from: number; to: number; text: string }
export type Chapter = { id: string; title: string; start: number; end: number; lines: Line[] }

export const chapters: Chapter[] = [
  {
    id: 'upload',
    title: 'Upload',
    start: 0,
    end: 10,
    lines: [
      { from: 0.5, to: 4.6, text: 'ArchiTech starts with something flat: an image of a floor plan.' },
      { from: 5, to: 9.6, text: 'Upload it and the app takes it from there.' },
    ],
  },
  {
    id: 'extract',
    title: 'Extraction',
    start: 10,
    end: 24,
    lines: [
      { from: 10.5, to: 14.6, text: 'An Express backend sends the image to the Claude API.' },
      { from: 15, to: 20.1, text: 'Claude returns walls, doors, windows, stairs, and furniture as structured JSON.' },
      { from: 20.5, to: 23.6, text: 'That output is validated before anything is drawn.' },
    ],
  },
  {
    id: 'model',
    title: '3D model',
    start: 24,
    end: 37,
    lines: [
      { from: 24.5, to: 29.6, text: 'React Three Fiber builds the model, up to five floors high.' },
      { from: 30, to: 36.6, text: 'Each floor gets a slab and a stairwell opening, and the roof can be flat, gable, or hip.' },
    ],
  },
  {
    id: 'inside',
    title: 'Cut and walk',
    start: 37,
    end: 50,
    lines: [
      { from: 37.5, to: 42.1, text: 'A clipping plane cuts the model open so you can see inside.' },
      { from: 42.5, to: 49.6, text: 'Or walk through it in first person at an eye height of 1.65 meters, with wall collision and stairs between floors.' },
    ],
  },
  {
    id: 'fire',
    title: 'Fire route',
    start: 50,
    end: 63,
    lines: [
      { from: 50.5, to: 55.6, text: 'Mark where a fire is, and Dijkstra’s algorithm searches the floor grid.' },
      { from: 56, to: 62.6, text: 'It routes around the fire to an outside door, or to a window if the stairs are cut off.' },
    ],
  },
  {
    id: 'bom',
    title: 'Bill of materials',
    start: 63,
    end: 76,
    lines: [
      { from: 63.5, to: 68.1, text: 'Then comes a bill of materials, with quantities per floor and estimated costs.' },
      { from: 68.5, to: 71.6, text: 'It exports as CSV, DXF, or JSON.' },
      { from: 72, to: 75.6, text: '186 automated tests cover the geometry, the routing, and the file import.' },
    ],
  },
]

export const DURATION = chapters[chapters.length - 1].end
