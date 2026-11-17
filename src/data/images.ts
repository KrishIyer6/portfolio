import generated from './images.generated.json'

export type ImageSlot = {
  alt: string
  width: number
  height: number
  color: string
  caption?: string
  video?: { mp4?: string; webm?: string }
}

type Generated = Record<string, { widths: number[]; formats: string[]; illustration?: boolean }>

export const generatedImages = generated as Generated

// True while a slot is filled by a drawing from scripts/generate-illustrations.mjs instead of a real image.
export const isIllustration = (slot: string) => generatedImages[slot]?.illustration === true

const shot = (alt: string, caption?: string, width = 1600, height = 1000): ImageSlot => ({ alt, width, height, color: '#0d2748', caption })
const drawn = (alt: string): ImageSlot => ({ alt, width: 1600, height: 1000, color: '#e8eaf0' })
const photo = (alt: string, width: number, height: number, caption?: string): ImageSlot => ({ alt, width, height, color: '#10294a', caption })

// Drop originals named <slot>.jpg / .png into image-source/ and run `npm run images`. See ASSETS.md.
export const images: Record<string, ImageSlot> = {
  portrait: { alt: 'Portrait of Krish Iyer, smiling, in a white shirt and dark tie', width: 800, height: 1000, color: '#9fa9b3' },

  'project-architech-1': shot('ArchiTech start screen: a floor plan being built into a model', 'Upload', 806, 451),
  'project-architech-2': shot('ArchiTech 3D model of a house generated from a floor plan, with roof and lawn', '3D model', 806, 448),
  'project-architech-3': shot('ArchiTech model with the roof removed, showing rooms and furniture from above', 'Roof off', 806, 445),
  'project-architech-4': shot('ArchiTech escape route planner: a route drawn across the floor plan from a room to an exit, around a fire', 'Escape route', 3000, 1670),

  'project-aifixit-1': shot('Ai-FixIT landing screen with login and signup buttons', 'Landing', 806, 382),
  'project-aifixit-2': shot('Ai-FixIT diagnose screen with an image upload box and a description field', 'Diagnose', 806, 381),
  'project-aifixit-3': shot('Ai-FixIT repair screen with a live webcam feed next to the Felix chat log', 'Repair with Felix', 806, 385),

  'project-makeadash-1': drawn('Mockup of the Make-A-Dash widget board: a dark dashboard with music, calendar, weather, to-do and clock widgets, one being dragged into place, and eight connected APIs'),
  'project-makeadash-2': shot('Make-A-Dash Spotify widget with playback controls', 'Spotify widget'),
  'project-makeadash-3': shot('Make-A-Dash widget being dragged to a new position', 'Drag and drop'),

  'project-veinviz-1': shot('VeinViz seen through a headset: an infrared vein camera view, a recommended vein, and spoken guidance as text', undefined, 806, 453),
  'project-motionmentor-1': drawn('Mockup of Motion Mentor: a badminton player mid-smash with a tracked skeleton over a professional reference pose, beside form-match and joint-deviation panels'),
  'project-futurepop-1': drawn('Mockup of FuturePop: a world map shaded by predicted fertility rate, with a list of countries beside it'),

  'project-plpredictor-1': drawn('Mockup of the Premier League Match Predictor: a home versus away card with a three-way outcome bar, and the features the model leans on'),
  'project-sudoku-1': drawn('Mockup of the Sudoku CSP Solver: a solved grid with one cell and its row, column and box highlighted, beside the constraints and a backtracking tree'),

  'hackathon-1': photo('Teammates gathered around a laptop with a mentor during a hackathon', 1280, 853),
  'hackathon-2': photo('Four teammates on stage holding their awards at a hackathon', 1280, 853),
  'hackathon-3': photo('Team photo at HackUNCP', 1200, 1200, 'HackUNCP'),
  'hackathon-4': photo('Ai-FixIT award moment at HackUNCP', 1200, 1200, 'HackUNCP'),

  'ta-1': photo('Krish teaching during a lab session', 1600, 1067),

  'matchday-1': photo('Watching a football match', 1600, 1067, 'Matchday'),
  'matchday-2': photo('Watching a football match', 1600, 1067, 'Matchday'),
  'travel-1': photo('Travel photo', 1600, 1067, 'Travel'),
  'travel-2': photo('Travel photo', 1600, 1067, 'Travel'),
  'travel-3': photo('Travel photo', 1600, 1067, 'Travel'),
  'travel-4': photo('Travel photo', 1600, 1067, 'Travel'),
  'travel-5': photo('Travel photo', 1600, 1067, 'Travel'),
  'travel-6': photo('Travel photo', 1600, 1067, 'Travel'),
  'travel-7': photo('Travel photo', 1600, 1067, 'Travel'),
  'travel-8': photo('Travel photo', 1600, 1067, 'Travel'),
  'food-1': photo('A favorite dish', 1200, 1200, 'Food'),
  'food-2': photo('A favorite dish', 1200, 1200, 'Food'),
  'food-3': photo('A favorite dish', 1200, 1200, 'Food'),
  'food-4': photo('A favorite dish', 1200, 1200, 'Food'),
  'food-5': photo('A favorite dish', 1200, 1200, 'Food'),
  'food-6': photo('A favorite dish', 1200, 1200, 'Food'),
  'climbing-1': photo('At the climbing gym', 1200, 1500, 'Climbing'),
  'climbing-2': photo('At the climbing gym', 1200, 1500, 'Climbing'),
  'sports-1': photo('Playing volleyball or badminton', 1600, 1067, 'On court'),
  'sports-2': photo('Playing volleyball or badminton', 1600, 1067, 'On court'),
}
