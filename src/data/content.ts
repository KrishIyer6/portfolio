// Every word on the site lives here. Empty strings marked TODO hide their button or block automatically.

export type Metric = { value: number; decimals?: number; prefix?: string; suffix?: string; label: string }

export type Role = {
  id: string
  title: string
  org: string
  place: string
  dates: string
  current: boolean
  summary: string
  bullets: string[]
  metrics: Metric[]
  skills: string[]
}

export type Project = {
  id: string
  title: string
  award: string
  dates: string
  tier: 'flagship' | 'featured' | 'compact'
  blurb: string
  bullets: string[]
  stack: string[]
  skills: string[]
  liveUrl: string
  repoUrl: string
  demoVideoUrl: string
  images: string[]
  frame: 'none' | 'browser'
}

export type Place = { name: string; lat: number; lon: number; dish: string }

export const identity = {
  name: 'Krish Iyer',
  role: 'CS + AI student, ML researcher, builder',
  taglineOptions: [
    'I build AI products, then test whether the models behind them hold up.',
    'CS and AI student at UNC Charlotte. I research LLM evaluation and build things people can use.',
    'Floor plans into buildings, small models into reliable judges. I like making AI do real work.',
  ],
  taglineIndex: 0,
  email: 'iyerk638@gmail.com',
  linkedin: 'https://www.linkedin.com/in/krishiyer6',
  linkedinLabel: 'linkedin.com/in/krishiyer6',
  github: 'https://github.com/krishiyer6',
  githubLabel: 'github.com/krishiyer6',
  resumeFile: 'Krish_Iyer_Resume.pdf', // TODO: the PDF in public/ has a phone number on it. Swap in a copy without one before publishing.
  siteUrl: 'https://krish-iyer-portfolio.vercel.app/',
  location: 'Charlotte, NC',
}

export const tagline = identity.taglineOptions[identity.taglineIndex]

export const nav = [
  { id: 'about', label: 'About' },
  { id: 'experience', label: 'Experience' },
  { id: 'projects', label: 'Projects' },
  { id: 'skills', label: 'Skills' },
  { id: 'education', label: 'Education' },
  { id: 'off-the-clock', label: 'Off the clock' },
  { id: 'contact', label: 'Contact' },
]

export const sheets = [
  { id: 'top', label: 'Cover' },
  ...nav,
]

export const story = [
  {
    title: 'Start with the data',
    body: 'At UNC Charlotte I built a pipeline that generated, structured, and evaluated 100+ AI-written programs. Its defect checks agreed with manual review 97% of the time.',
  },
  {
    title: 'Train the model',
    body: 'At Wells Fargo I fine-tune compact LLM judges on synthetic data to catch hallucinations in RAG systems. The Llama-3.2-3B judge reached 71.9% recall and 0.709 macro-F1.',
  },
  {
    title: 'Ship the product',
    body: 'At Premier, the hybrid model I designed reached 98% prediction accuracy and cut a team’s manual mapping work by 65%. Make-A-Dash is live with 8 third-party APIs behind it.',
  },
  {
    title: 'Then test it',
    body: 'I check what is inside before I trust it. ArchiTech has 186 automated tests. The judge models are compared on held-out splits with Holm-adjusted tests.',
  },
]

export const about = {
  heading: 'About',
  paragraphs: [
    'I’m a computer science and AI student at UNC Charlotte. Two bachelor’s degrees land in 2027 and a master’s in data science follows in 2028.',
    'Right now I work at Wells Fargo, researching how to train small LLM judges that catch hallucinations in RAG systems, and at Premier, where a hybrid model I designed cut a team’s manual mapping work by 65%.',
    'I’ve been a teaching assistant for data structures and algorithms since 2024, which keeps my fundamentals honest. I like hackathons too. Two of them produced ArchiTech and Ai-FixIT, and both placed.',
  ],
  facts: [
    { k: 'Based in', v: 'Charlotte, NC' },
    { k: 'Studying', v: 'CS, AI, data science' },
    { k: 'GPA', v: '4.0 / 4.0' },
    { k: 'Working on', v: 'LLM-as-judge evaluation' },
  ],
}

export const experience: Role[] = [
  {
    id: 'wells-fargo',
    title: 'Model Risk Management Intern',
    org: 'Wells Fargo',
    place: 'Charlotte, NC',
    dates: 'Oct 2026 to present',
    current: true,
    summary:
      'Research on compact LLM judges that detect hallucinations and faithfulness errors in RAG systems, alongside validation of statistical and ML models.',
    bullets: [
      'Designed a controlled study comparing 3 synthetic data generation procedures for fine-tuning compact LLM-based judge models.',
      'Fine-tuned a Llama-3.2-3B judge on synthetic training data.',
      'Built a calibrated evaluation protocol with disjoint train, dev, calibration, and confirmation splits and Holm-adjusted hypothesis testing.',
      'Authored a technical proposal applying prompt engineering to LLM-as-judge evaluation.',
      'Validates statistical and ML models with Python, SAS, and SQL, and reviews methodologies and assumptions to support regulatory-ready model governance.',
    ],
    metrics: [
      { value: 71.9, decimals: 1, suffix: '%', label: 'recall, Llama-3.2-3B judge' },
      { value: 0.709, decimals: 3, label: 'macro-F1' },
    ],
    skills: ['Python', 'SAS', 'SQL', 'LLMs and NLP', 'LLM-as-judge evaluation', 'Synthetic data generation', 'Predictive and statistical modeling', 'PyTorch'],
  },
  {
    id: 'premier',
    title: 'Software Engineer Intern',
    org: 'Premier Inc.',
    place: 'Charlotte, NC',
    dates: 'May 2026 to present',
    current: true,
    summary: 'Designed Astro, a hybrid AI/ML algorithm that pairs an LLM-based agent with logistic regression scoring.',
    bullets: [
      'Built a Kotlin REST client that queries a Databricks Model Serving endpoint and returns SPL code predictions.',
      'Astro reached 98% prediction accuracy and cut the SPL team’s manual mapping workload by 65%.',
    ],
    metrics: [
      { value: 98, suffix: '%', label: 'prediction accuracy' },
      { value: 65, suffix: '%', label: 'less manual mapping work' },
    ],
    skills: ['Kotlin', 'Azure Databricks', 'LLMs and NLP', 'Predictive and statistical modeling'],
  },
  {
    id: 'ml-researcher',
    title: 'Machine Learning Researcher',
    org: 'UNC Charlotte',
    place: 'Charlotte, NC',
    dates: 'Jan 2025 to May 2025',
    current: false,
    summary: 'Built an end-to-end pipeline to generate, transform, evaluate, and store AI-generated programming outputs.',
    bullets: [
      'Automated prompt extraction, output structuring, and evaluation loading for downstream analysis.',
      'Reached 97% agreement with manual reviews in defect detection and accuracy tracking.',
    ],
    metrics: [
      { value: 97, suffix: '%', label: 'agreement with manual review' },
      { value: 100, suffix: '+', label: 'AI-generated outputs processed' },
    ],
    skills: ['Python', 'LLMs and NLP', 'Pandas'],
  },
  {
    id: 'ta',
    title: 'Teaching Assistant',
    org: 'UNC Charlotte',
    place: 'Charlotte, NC',
    dates: 'Aug 2024 to present',
    current: true,
    summary: 'Leads office hours and labs on algorithms and data structures.',
    bullets: [
      'Helps build structured test cases for exercises and assessments.',
      'Debugged and resolved 80+ Java and Python issues with students.',
    ],
    metrics: [
      { value: 500, suffix: '+', label: 'students taught' },
      { value: 80, suffix: '+', label: 'Java and Python issues resolved' },
    ],
    skills: ['Java', 'Python', 'Data Structures', 'Algorithms', 'Software Testing'],
  },
]

export const results = {
  heading: 'Measured, not estimated',
  note: 'Four numbers from the roles above, each on its own 0 to 1 scale.',
  rows: [
    { label: 'Recall', context: 'Llama-3.2-3B judge, Wells Fargo', value: 0.719, display: '71.9%' },
    { label: 'Macro-F1', context: 'Same judge model', value: 0.709, display: '0.709' },
    { label: 'Prediction accuracy', context: 'Astro, Premier Inc.', value: 0.98, display: '98%' },
    { label: 'Agreement with manual review', context: 'Research pipeline, UNC Charlotte', value: 0.97, display: '97%' },
  ],
}

export const projects: Project[] = [
  {
    id: 'architech',
    title: 'ArchiTech',
    award: '2nd place overall, CrownHacks',
    dates: 'Nov 2026',
    tier: 'flagship',
    blurb: 'Upload a floor plan image and walk through the building it describes.',
    bullets: [
      'Full-stack app that turns floor plan images into walkable 3D buildings. The Claude API runs in an Express backend and extracts walls, doors, windows, stairs, and furniture as structured JSON.',
      'Renders multi-floor models up to 5 floors in React Three Fiber with floor slabs, stairwell openings, and procedurally generated flat, gable, and hip roofs.',
      'Section cuts using clipping planes, plus a first-person walkthrough at 1.65 m eye height with wall collision and stair-based floor changes.',
      'Fire escape route planner running Dijkstra’s algorithm on a floor grid. It routes around the fire to an outside door, or to a window if the stairs are cut off.',
      'Bill of materials with per-floor quantities and estimated costs, exportable as CSV, DXF, and JSON.',
      'Validates AI output before rendering. 186 automated tests cover geometry, routing, and file import.',
    ],
    stack: ['React', 'Three.js', 'React Three Fiber', 'Node.js', 'Express', 'Claude API', 'Tailwind'],
    skills: ['React', 'Three.js', 'React Three Fiber', 'Express', 'Claude API', 'Tailwind', 'JavaScript', 'Algorithms', 'Software Testing'],
    liveUrl: '', // TODO
    repoUrl: '', // TODO
    demoVideoUrl: 'https://www.youtube.com/watch?v=P5IVpBIaGGo',
    images: ['project-architech-1', 'project-architech-2', 'project-architech-3', 'project-architech-4'],
    frame: 'none',
  },
  {
    id: 'aifixit',
    title: 'Ai-FixIT',
    award: '1st place, Sustainability Track, HackUNCP',
    dates: '',
    tier: 'featured',
    blurb: 'An AI repair assistant that looks at your broken device, talks you through the fix, and knows when to send you to a recycler instead.',
    bullets: [
      'Full-stack AI repair assistant with secure login and session management.',
      'Diagnosis pipeline using Gemini Vision on uploaded device images plus context, returning a structured report with difficulty and risk levels.',
      '“Felix,” a live repair assistant that reads webcam frames and microphone audio, reasons with Gemini, and speaks step-by-step guidance through ElevenLabs.',
      'Recommendations tab uses Google Places to find nearby recyclers and repair contractors.',
      'Three-stage flow (diagnose, repair, recommend) built to steer users toward the most sustainable outcome, tied to the 62M tonne annual e-waste problem.',
    ],
    stack: ['Python', 'FastAPI', 'Next.js', 'TypeScript', 'Tailwind', 'Gemini API', 'ElevenLabs', 'MongoDB', 'OpenCV', 'Google Places API'],
    skills: ['Python', 'FastAPI', 'Tailwind', 'Gemini API', 'MongoDB', 'JavaScript', 'React', 'LLMs and NLP'],
    liveUrl: '', // TODO
    repoUrl: '', // TODO
    demoVideoUrl: '', // TODO
    images: ['project-aifixit-1', 'project-aifixit-2', 'project-aifixit-3'],
    frame: 'browser',
  },
  {
    id: 'makeadash',
    title: 'Make-A-Dash',
    award: 'Live at makeadash.tech',
    dates: 'Mar to Apr 2026',
    tier: 'featured',
    blurb: 'A widget board you build yourself. Drag widgets where you want them; Spotify, Google Calendar, and six other APIs keep them live.',
    bullets: [
      'Full-stack personalized dashboard with a drag-and-drop widget system (dnd-kit).',
      'OAuth 2.0 flows for Spotify and Google Calendar with server-side sessions, automatic token refresh, and scope-based access control.',
      'REST API integrating 8 third-party APIs with unified error handling and graceful degradation.',
      'Real-time Spotify widget with local seek-bar interpolation and rate-limit-aware polling.',
      'Dark-mode-first responsive UI with a custom CSS design system, fluid clamp() typography, and WCAG-compliant contrast.',
      'Dockerized and deployed with CloudFront CDN and HTTPS on a custom domain.',
    ],
    stack: ['Vite', 'React', 'Express', 'Supabase (PostgreSQL)', 'Docker', 'AWS (Elastic Beanstalk, CloudFront, ACM, S3)'],
    skills: ['Vite', 'React', 'Express', 'Supabase', 'PostgreSQL', 'Docker', 'AWS', 'JavaScript', 'CSS', 'HTML'],
    liveUrl: 'https://makeadash.tech',
    repoUrl: '', // TODO
    demoVideoUrl: '', // TODO
    images: ['project-makeadash-1', 'project-makeadash-2', 'project-makeadash-3'],
    frame: 'browser',
  },
  {
    id: 'veinviz',
    title: 'VeinViz',
    award: '',
    dates: '',
    tier: 'compact',
    blurb: 'Hands-free voice AI agent for vein-access procedures, using Gemini and a live near-infrared vein camera stream.',
    bullets: [
      'Integrates 3 networked services (camera stream, voice assistant, AR arm guide) into one real-time pipeline.',
      'Deployed as a hosted AR web experience for Meta Quest.',
    ],
    stack: ['Python', 'Gemini API', 'Computer vision', 'WebRTC', 'AR', 'Meta Quest'],
    skills: ['Python', 'Gemini API', 'WebRTC', 'LLMs and NLP'],
    liveUrl: '', // TODO
    repoUrl: '', // TODO
    demoVideoUrl: '', // TODO
    images: ['project-veinviz-1'],
    frame: 'none',
  },
  {
    id: 'motion-mentor',
    title: 'Motion Mentor',
    award: '',
    dates: 'Sep to Oct 2025',
    tier: 'compact',
    blurb: 'Badminton form tracking. It compares your video against 50+ professional executions and shows where your joints drift.',
    bullets: ['Uses Dynamic Time Warping to quantify joint-angle deviations between a player and the professional reference.'],
    stack: ['Python', 'OpenCV', 'React', 'Tailwind', 'FastAPI', 'Scikit-learn'],
    skills: ['Python', 'React', 'Tailwind', 'FastAPI', 'Scikit-learn'],
    liveUrl: '', // TODO
    repoUrl: '', // TODO
    demoVideoUrl: '', // TODO
    images: ['project-motionmentor-1'],
    frame: 'none',
  },
  {
    id: 'futurepop',
    title: 'FuturePop',
    award: '',
    dates: 'Jul to Aug 2025',
    tier: 'compact',
    blurb: 'Where is each country’s population heading? FuturePop predicts 2024 fertility rates for 150+ countries and maps them on an interactive D3 and TopoJSON world map.',
    bullets: ['Random Forest reached an 89.6% fit.'],
    stack: ['Python', 'Pandas', 'Scikit-learn', 'TensorFlow', 'SQL', 'Random Forest', 'D3.js'],
    skills: ['Python', 'Pandas', 'Scikit-learn', 'TensorFlow', 'SQL', 'D3.js', 'Predictive and statistical modeling'],
    liveUrl: '', // TODO
    repoUrl: '', // TODO
    demoVideoUrl: '', // TODO
    images: ['project-futurepop-1'],
    frame: 'none',
  },
  {
    id: 'pl-predictor',
    title: 'Premier League Match Predictor',
    award: '',
    dates: 'Dec 2025',
    tier: 'compact',
    blurb: 'ML models predicting match outcomes from 30k+ historical football matches.',
    bullets: ['Expanding-average features, plus exploratory analysis of home advantage and scoring trends.'],
    stack: ['Python', 'Pandas', 'Scikit-learn', 'Matplotlib', 'Seaborn'],
    skills: ['Python', 'Pandas', 'Scikit-learn', 'Matplotlib', 'Seaborn', 'Predictive and statistical modeling'],
    liveUrl: '', // TODO
    repoUrl: '', // TODO
    demoVideoUrl: '', // TODO
    images: ['project-plpredictor-1'],
    frame: 'none',
  },
  {
    id: 'sudoku',
    title: 'Sudoku CSP Solver',
    award: '',
    dates: 'Feb to Mar 2025',
    tier: 'compact',
    blurb: 'Constraint-satisfaction and backtracking solver with heuristics, handling easy through expert puzzles.',
    bullets: ['Automated validation checks every solution.'],
    stack: ['Python', 'NumPy'],
    skills: ['Python', 'NumPy', 'Algorithms'],
    liveUrl: '', // TODO
    repoUrl: '', // TODO
    demoVideoUrl: '', // TODO
    images: ['project-sudoku-1'],
    frame: 'none',
  },
]

export const explainer = {
  // Set ready to false to hide the player. Files live in public/video/ and are rendered from explainer/.
  ready: true,
  // TODO: the cut is silent. Once a voiceover is added (see explainer/README.md), change this note.
  note: 'A 76-second walkthrough. Silent cut with subtitles; voiceover to come.',
  title: 'How ArchiTech works',
  demoHeading: 'Watch the demo',
  explainerHeading: 'How it works, in 76 seconds',
  mp4: 'video/architech-explainer.mp4',
  webm: 'video/architech-explainer.webm',
  poster: 'video/architech-explainer-poster.jpg',
  captions: 'video/architech-explainer.vtt',
  pending: 'The explainer video has not been rendered yet. See explainer/README.md.',
}

// TODO: edit these captions if you want to name the events.
export const hackathonGallery = [
  { slot: 'hackathon-2', caption: 'On stage with the team' },
  { slot: 'project-architech-2', caption: 'ArchiTech, CrownHacks' },
  { slot: 'hackathon-1', caption: 'Mid-build, laptops out' },
  { slot: 'project-veinviz-1', caption: 'VeinViz' },
]

export const skillGroups = [
  { id: 'languages', label: 'Languages', items: ['Python', 'SQL', 'Java', 'JavaScript', 'Kotlin', 'HTML', 'CSS', 'C/C++', 'R', 'SAS'] },
  { id: 'frontend', label: 'Front end and 3D', items: ['React', 'Vite', 'Three.js', 'React Three Fiber', 'Tailwind', 'D3.js'] },
  { id: 'backend', label: 'Back end and data', items: ['FastAPI', 'Express', 'PostgreSQL', 'MySQL', 'MongoDB', 'Supabase', 'Docker', 'Linux'] },
  {
    id: 'ml',
    label: 'ML and data science',
    items: ['PyTorch', 'TensorFlow', 'Scikit-learn', 'PySpark', 'NumPy', 'Pandas', 'Matplotlib', 'Seaborn', 'LLMs and NLP', 'LLM-as-judge evaluation', 'Synthetic data generation', 'Predictive and statistical modeling'],
  },
  { id: 'cloud', label: 'Cloud and tools', items: ['AWS', 'Azure Databricks', 'Git/GitHub', 'Power BI', 'Tableau', 'Gemini API', 'Claude API', 'WebRTC'] },
  { id: 'concepts', label: 'CS concepts', items: ['Data Structures', 'Algorithms', 'Operating Systems', 'Software Testing', 'Version Control'] },
]

export const education = {
  school: 'University of North Carolina at Charlotte',
  degrees: [
    { name: 'M.S. in Data Science and Business Analytics', when: 'Expected May 2028' },
    { name: 'B.S. in Computer Science', when: 'Expected May 2027' },
    { name: 'B.S. in Artificial Intelligence', when: 'Expected May 2027' },
  ],
  minor: 'Minor in Computer Engineering',
  gpa: { value: 4.0, of: 4.0 },
  coursework: ['Database Design', 'Data Structures and Algorithms', 'AI / Machine Learning', 'Data Mining'],
  honors: ['CCI Chancellor’s List', 'Association for Computing Machinery', '49th Security Division'],
}

export const offClock = {
  heading: 'Off the clock',
  intro: 'What I do when nothing is due. Everything here is meant to be poked at.',
  arsenal: {
    title: 'Arsenal, since I was 12',
    body: 'I watch football constantly. At one point I trained models on 30k+ historical matches to see if I could predict it.',
    linkLabel: 'See the match predictor',
    projectId: 'pl-predictor',
  },
  travel: {
    title: 'Go far, eat well',
    body: 'I try to get to as many places as I can, mostly so I can eat there. Twenty-nine so far.',
    hint: 'Hover a pin, or pick a place from the list.',
    // TODO: add a favorite dish to any place, for example dish: 'Vada pav'. Empty dishes are simply not shown.
    // TODO: you wrote "Charleston NC"; this is pinned as Charleston, SC. Change it if you meant somewhere else.
    places: [
      { name: 'Charlotte, NC', lat: 35.23, lon: -80.84, dish: '' },
      { name: 'Raleigh, NC', lat: 35.78, lon: -78.64, dish: '' },
      { name: 'Durham, NC', lat: 35.99, lon: -78.9, dish: '' },
      { name: 'Asheville, NC', lat: 35.6, lon: -82.55, dish: '' },
      { name: 'Black Mountain, NC', lat: 35.62, lon: -82.32, dish: '' },
      { name: 'Sugar Mountain, NC', lat: 36.13, lon: -81.86, dish: '' },
      { name: 'Wilmington, NC', lat: 34.23, lon: -77.94, dish: '' },
      { name: 'Charleston, SC', lat: 32.78, lon: -79.93, dish: '' },
      { name: 'Shenandoah National Park, VA', lat: 38.53, lon: -78.35, dish: '' },
      { name: 'Atlanta, GA', lat: 33.75, lon: -84.39, dish: '' },
      { name: 'Duluth, GA', lat: 34, lon: -84.14, dish: '' },
      { name: 'Pigeon Forge, TN', lat: 35.79, lon: -83.55, dish: '' },
      { name: 'Gatlinburg, TN', lat: 35.71, lon: -83.51, dish: '' },
      { name: 'Miami, FL', lat: 25.76, lon: -80.19, dish: '' },
      { name: 'New Haven, CT', lat: 41.31, lon: -72.93, dish: '' },
      { name: 'Denver, CO', lat: 39.74, lon: -104.99, dish: '' },
      { name: 'The Bahamas', lat: 25.05, lon: -77.35, dish: '' },
      { name: 'London, UK', lat: 51.51, lon: -0.13, dish: '' },
      { name: 'Paris, France', lat: 48.86, lon: 2.35, dish: '' },
      { name: 'Munich, Germany', lat: 48.14, lon: 11.58, dish: '' },
      { name: 'Istanbul, Turkey', lat: 41.01, lon: 28.98, dish: '' },
      { name: 'Dubai, UAE', lat: 25.2, lon: 55.27, dish: '' },
      { name: 'Mumbai, India', lat: 19.08, lon: 72.88, dish: '' },
      { name: 'Pune, India', lat: 18.52, lon: 73.86, dish: '' },
      { name: 'Goa, India', lat: 15.3, lon: 74.12, dish: '' },
      { name: 'Hyderabad, India', lat: 17.39, lon: 78.49, dish: '' },
      { name: 'Delhi, India', lat: 28.61, lon: 77.21, dish: '' },
      { name: 'Agra, India', lat: 27.18, lon: 78.01, dish: '' },
      { name: 'Mount Abu, Rajasthan, India', lat: 24.59, lon: 72.71, dish: '' },
    ] as Place[],
  },
  court: {
    title: 'Badminton and volleyball',
    body: 'I play both on and off, at a solid intermediate level. Badminton also turned into a project.',
    linkLabel: 'See Motion Mentor',
    projectId: 'motion-mentor',
    action: 'Serve',
  },
  climbing: {
    title: 'Climbing, from time to time',
    body: 'Pick a route and trace it.',
    routes: [
      { id: 'amber', label: 'Amber route' },
      { id: 'blue', label: 'Blue route' },
      { id: 'red', label: 'Red route' },
    ],
  },
  games: {
    title: 'FIFA, Rematch, and a lot of TFT',
    body: 'FIFA and Rematch when I want to switch off. Teamfight Tactics when I would rather think about positioning. Hover a unit to see its reach.',
  },
  photos: ['matchday-1', 'matchday-2', 'travel-1', 'travel-2', 'travel-3', 'travel-4', 'travel-5', 'travel-6', 'travel-7', 'travel-8', 'food-1', 'food-2', 'food-3', 'food-4', 'food-5', 'food-6', 'climbing-1', 'climbing-2', 'sports-1', 'sports-2'],
}

export const contact = {
  heading: 'Let’s draft something',
  body: 'Internships, research, hackathon teams, or a question about anything on this page. Email is the fastest way to reach me.',
  copyLabel: 'Copy email',
  copiedLabel: 'Copied to clipboard',
  mailLabel: 'Write an email',
}

export const footer = {
  line: 'Designed and built by Krish Iyer with React, Three.js, GSAP, and D3.',
  top: 'Back to top',
}

export const stackLayers = [
  { id: 'data', name: 'Data', line: 'Pipelines, SQL, evaluation sets' },
  { id: 'model', name: 'Model', line: 'Fine-tuning, LLM judges, classic ML' },
  { id: 'services', name: 'Services', line: 'APIs, auth, databases, cloud' },
  { id: 'interface', name: 'Interface', line: 'React, 3D, data visualization' },
]

export const copy = {
  stackHint: 'Every layer, hover one',
  processTitle: 'How I build',
  processLead: 'The same four steps on every project. Each one here is tied to work I have done.',
  experienceLead: 'Two internships running in parallel, a semester of research, and a teaching job that started before any of them.',
  projectsLead: 'Eight builds. The first one you can try right here.',
  viewerNote: 'Live model, not a recording',
  viewerIdle: 'Drag to orbit. Change the roof, add floors, or cut the model open.',
  caseFile: 'Open the full case file',
  moreBuilds: 'More builds',
  hackathons: 'From the hackathons',
  skillsLead: 'Grouped by where they sit in the stack. Point at one to see which projects and roles used it.',
  skillsHint: 'Hover a skill to trace it back to the work. Hover a group name to light up the whole cluster.',
  skillsHintList: 'Select a skill to see which projects and roles used it.',
  skillsNone: 'is in my toolkit, though nothing on this page uses it yet.',
}

export const flagshipSchedule = [
  { k: 'Input', v: 'A floor plan image' },
  { k: 'Extraction', v: 'Claude API to structured JSON' },
  { k: 'Floors', v: 'Up to 5, with stairwell openings' },
  { k: 'Roofs', v: 'Flat, gable, hip' },
  { k: 'Walkthrough', v: 'First person, 1.65 m eye height' },
  { k: 'Routing', v: 'Dijkstra on a floor grid' },
  { k: 'Exports', v: 'CSV, DXF, JSON' },
  { k: 'Tests', v: '186 automated' },
]
