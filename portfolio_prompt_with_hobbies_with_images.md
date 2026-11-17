# ROLE

You are a senior creative front-end engineer and designer with award-level taste (think Awwwards / FWA winners). You write production-quality code and you care about typography, motion, and polish more than most developers do.

# GOAL

Build a complete, beautiful, memorable personal portfolio website for **Krish Iyer**, a Computer Science + AI student and ML/software engineer. The site replaces an outdated static page. It must feel like a piece of craft by someone who obviously knows 3D, animation, and design, while still being fast, accessible, and easy for a recruiter to scan in under 60 seconds.

Do not build a generic template. Pick one strong visual concept, commit to it, and carry it through every section.

# WHO THE VISITORS ARE

Recruiters, hiring managers, hackathon judges, professors, and other engineers. They want to quickly see: what Krish builds, how well he builds it, and how to contact him. The wow factor should support that goal, not block it.

# CONTENT (SOURCE OF TRUTH)

Use only the facts below. Do not invent metrics, employers, awards, dates, quotes, or links. If something is missing, leave a clearly marked `TODO` placeholder in a single `content` data file so I can fill it in. Keep all copy in one typed data file (for example `src/data/content.ts`) so I can edit text without touching components.

## Identity

- Name: Krish Iyer
- Tagline direction: CS + AI student, ML researcher, and builder of AI-powered products (write 2-3 tagline options in the data file and use the best one)
- Email: iyerk638@gmail.com
- LinkedIn: linkedin.com/in/krishiyer6
- GitHub: github.com/krishiyer6
- Do NOT put a phone number on the public site.

## Education

- University of North Carolina at Charlotte
- M.S. in Data Science and Business Analytics, expected May 2028
- B.S. in Computer Science and B.S. in Artificial Intelligence, minor in Computer Engineering, expected May 2027
- GPA 4.0 / 4.0
- Relevant coursework: Database Design, Data Structures and Algorithms, AI / Machine Learning, Data Mining
- Clubs and honors: CCI Chancellor's List, Association for Computing Machinery, 49th Security Division

## Experience (newest first)

**Model Risk Management Intern, Wells Fargo, Charlotte NC (Oct 2026 - Present)**
- Designed a controlled research study comparing 3 synthetic data generation procedures for fine-tuning compact LLM-based judge models that detect hallucinations and faithfulness errors in RAG systems.
- Fine-tuned a Llama-3.2-3B judge model on synthetic training data, reaching 71.9% recall and 0.709 macro-F1.
- Built a calibrated evaluation protocol with disjoint train/dev/calibration/confirmation splits and Holm-adjusted hypothesis testing.
- Authored a technical proposal applying prompt engineering to LLM-as-judge evaluation.
- Validates statistical and ML models with Python, SAS, and SQL to assess performance and model risk; analyzes methodologies and assumptions to support regulatory-ready model governance.

**Software Engineer Intern, Premier Inc., Charlotte NC (May 2026 - Present)**
- Designed Astro, a hybrid AI/ML algorithm combining an LLM-based agent with logistic regression scoring.
- Built a Kotlin REST client that queries a Databricks Model Serving endpoint and returns SPL code predictions.
- Reached 98% prediction accuracy and cut the SPL team's manual mapping workload by 65%.

**Machine Learning Researcher, UNC Charlotte (Jan 2025 - May 2025)**
- Built an end-to-end pipeline to generate, transform, evaluate, and store 100+ AI-generated programming outputs.
- Automated prompt extraction, output structuring, and evaluation loading for downstream analysis.
- Reached 97% agreement with manual reviews in defect detection and accuracy tracking.

**Teaching Assistant, UNC Charlotte (Aug 2024 - Present)**
- Leads office hours and labs for 500+ students on algorithms and data structures.
- Helps build structured test cases for exercises and assessments.
- Debugged and resolved 80+ Java and Python issues.

## Projects

Feature the first three prominently with their own detail view. Show the rest as a compact grid.

**1. ArchiTech - 2nd Place Overall, CrownHacks (Nov 2026)** (flagship project)
Stack: React, Three.js, React Three Fiber, Node.js, Express, Claude API, Tailwind
- Full-stack app that turns floor plan images into walkable 3D buildings. The Claude API runs in an Express backend and extracts walls, doors, windows, stairs, and furniture as structured JSON.
- Renders multi-floor models up to 5 floors in React Three Fiber with floor slabs, stairwell openings, and procedurally generated flat, gable, and hip roofs.
- Section cuts using clipping planes, plus a first-person walkthrough at 1.65 m eye height with wall collision and stair-based floor changes.
- Fire escape route planner running Dijkstra's algorithm on a floor grid, routing around the fire to an outside door, or to a window if the stairs are cut off.
- Bill of materials with per-floor quantities and estimated costs, exportable as CSV, DXF, and JSON.
- Validates AI output before rendering; 186 automated tests cover geometry, routing, and file import.

**2. Ai-FixIT - 1st Place, Sustainability Track, HackUNCP**
Stack: Python, FastAPI, Next.js, TypeScript, Tailwind, Gemini API, ElevenLabs, MongoDB, OpenCV, Google Places API
- Full-stack AI repair assistant with secure login and session management.
- Diagnosis pipeline using Gemini Vision on uploaded device images plus context, returning a structured report with difficulty and risk levels.
- "Felix," a live repair assistant that reads webcam frames and microphone audio, reasons with Gemini, and speaks step-by-step guidance through ElevenLabs.
- Recommendations tab uses Google Places to find nearby recyclers and repair contractors.
- Three-stage flow (diagnose, repair, recommend) built to steer users toward the most sustainable outcome, tied to the 62M tonne annual e-waste problem.

**3. Make-A-Dash (live at makeadash.tech, Mar - Apr 2026)**
Stack: Vite, React, Express, Supabase (PostgreSQL), Docker, AWS (Elastic Beanstalk, CloudFront, ACM, S3)
- Full-stack personalized dashboard with a drag-and-drop widget system (dnd-kit).
- OAuth 2.0 flows for Spotify and Google Calendar with server-side sessions, automatic token refresh, and scope-based access control.
- REST API integrating 8 third-party APIs with unified error handling and graceful degradation.
- Real-time Spotify widget with local seek-bar interpolation and rate-limit-aware polling.
- Dark-mode-first responsive UI with a custom CSS design system, fluid clamp() typography, and WCAG-compliant contrast.
- Dockerized and deployed with CloudFront CDN and HTTPS on a custom domain.

**More projects (compact cards)**
- **VeinViz** (Python, Gemini API, computer vision, WebRTC, AR, Meta Quest): hands-free voice AI agent for vein-access procedures using Gemini and a live near-infrared vein camera stream. Integrates 3 networked services (camera stream, voice assistant, AR arm guide) into one real-time pipeline, deployed as a hosted AR web experience for Meta Quest.
- **Motion Mentor** (Python, OpenCV, React, Tailwind, FastAPI, Scikit-learn, Sep - Oct 2025): AI badminton form analyzer that compares user videos against 50+ professional executions, using Dynamic Time Warping to quantify joint-angle deviations.
- **FuturePop** (Python, Pandas, Scikit-learn, TensorFlow, SQL, Random Forest, D3.js, Jul - Aug 2025): predicts 2024 fertility rates for 150+ countries, 89.6% fit with Random Forest, with an interactive D3 and TopoJSON world map.
- **Premier League Match Predictor** (Python, Pandas, Scikit-learn, Matplotlib, Seaborn, Dec 2025): ML models predicting match outcomes from 30k+ historical football matches, with expanding-average features and EDA on home advantage and scoring trends.
- **Sudoku CSP Solver** (Python, NumPy, Feb - Mar 2025): constraint-satisfaction and backtracking solver with heuristics, handling easy through expert puzzles, with automated validation.

For every project, add `liveUrl`, `repoUrl`, and `demoVideoUrl` fields as `TODO` placeholders and hide the buttons automatically when a value is empty.

## Skills (group them visually)

- Languages: Python, SQL, Java, JavaScript, Kotlin, HTML, CSS, C/C++, R, SAS
- Front end and 3D: React, Vite, Three.js, React Three Fiber, Tailwind, D3.js
- Back end and data: FastAPI, Express, PostgreSQL, MySQL, MongoDB, Supabase, Docker, Linux
- ML and data science: PyTorch, TensorFlow, Scikit-learn, PySpark, NumPy, Pandas, Matplotlib, Seaborn, LLMs and NLP, LLM-as-judge evaluation, synthetic data generation, predictive and statistical modeling
- Cloud and tools: AWS, Azure Databricks, Git/GitHub, Power BI, Tableau, Gemini API, Claude API, WebRTC
- CS concepts: Data Structures, Algorithms, Operating Systems, Software Testing, Version Control

# PERSONAL SECTION: "OFF THE CLOCK" (INCLUDE)

Add a distinct, playful section after Education and before Contact. It should show personality without hurting the professional impression: keep it compact (one screen or one pinned scroll scene), visually distinct but still inside the same design system, and clearly secondary to the work. Write the copy in first person, warm and short, no cringe.

Facts to use:
- **Arsenal:** supporter since age 12. Watches soccer constantly.
- **Sports:** plays volleyball and badminton on and off. Intermediate level.
- **Rock climbing:** goes from time to time.
- **Travel and food:** loves traveling to as many places as possible and eating as much great food as possible.
- **Games:** plays FIFA and Rematch; also loves strategy games, especially TFT (Teamfight Tactics).

Creative direction (pick the best execution, but make each hobby a tiny interactive moment instead of a bullet list):
- **Arsenal / soccer:** a small stylized pitch where a passing-network animation plays out (nodes passing the ball, red-and-white palette). Subtle tie-in: Krish built a Premier League match predictor on 30k+ matches, so link that project from here. Do NOT use the Arsenal crest, club logos, or player images (trademark and licensing). Use the color palette and abstract football motifs only.
- **Travel and food:** an interactive 3D globe (R3F or a lightweight globe library) with glowing pins for places visited. Put the list of places in the data file as `TODO` placeholders, with a few clearly marked example entries I can replace. Hovering a pin shows the place and an optional favorite dish.
- **Badminton / volleyball:** a small motion piece (for example a shuttlecock trajectory or a ball arc drawn with GSAP or a physics-lite sim). Subtle tie-in to Motion Mentor, the badminton form analyzer.
- **Climbing:** a stylized climbing-wall panel with colored holds and a route that lights up on hover or scroll.
- **Games:** a tiny TFT-style hex board where hovering "units" highlights them, or a simple controller/pixel motif for FIFA and Rematch. Keep it tasteful and fast.

Do not expose anything private (no home address, no exact current location, no phone number).

# SKILLS TO USE

If you have access to agent skills, load and follow each skill below at the stage named for it. If a skill is not available to you, do not stop: apply the same practice using your own knowledge. Do not mention skill names in the site copy.

**Overrides (important):** some skills below are written for one-off outputs and have their own workflow rules. For this project, follow these overrides:
- `huashu-design` normally asks the user to pick from three draft directions before building. Do not wait for me. Write three short direction sketches (concept, palette, type, one-line scroll storyboard) yourself, choose the strongest one, state why in two lines, and continue.
- `webgl-experience` and `web-prototype` produce a single `index.html`. Use them only to prototype and test ideas (the hero shader, the layout rhythm). The final site is the Vite + React + TypeScript project described below, not a single HTML file.
- Ignore any instruction in a skill that conflicts with the static-hosting, performance, or accessibility requirements in this brief.

## Stage 1: Direction and design system
- `huashu-design`: direction exploration as described in the override above.
- `frontend-design` and `canvas-design`: aesthetic direction, typography, and composition. Commit to a bold, specific look.
- `impeccable`: design from first principles and avoid the AI-generated look (generic purple gradients, identical rounded cards in a row, emoji icons, everything centered, filler copy). Create a short `DESIGN.md` recording the tokens, type scale, spacing, and motion rules, and keep the build consistent with it.
- `color-expert`: build the palette in OKLCH, generate the scales, and verify WCAG AA contrast for every text and background pair. One main accent, one secondary accent, neutrals with a slight tint.

## Stage 2: 3D and WebGL
- `3d-web-experience`: scene architecture, camera work, loading, and performance for the hero scene and the interactive ArchiTech viewer.
- `webgl-experience`: shader and generative-visual techniques for the hero background and any particle or noise effects. Port the result into React Three Fiber components.

## Stage 3: Motion
- `gsap-core`, `gsap-timeline`, `gsap-scrolltrigger`, `gsap-react`, `gsap-plugins`, `gsap-utils`, `gsap-performance`: all GSAP work. Use `useGSAP` and `gsap.context()` cleanup in React, `gsap.matchMedia()` for responsive and `prefers-reduced-motion` behavior, ScrollTrigger for pinned and scrubbed sections, and plugins such as SplitText, Flip, and CustomEase where they help (check each plugin's availability and registration before relying on it). Prefer transforms and opacity, avoid layout thrashing, and call `ScrollTrigger.refresh()` after fonts and images load.
- `animate`: purposeful interface animation: easing choices, springs, interruption handling, exits, and reduced motion for component-level transitions, hovers, and the project detail expand and collapse.
- `oil-motion`: only for scroll-, pointer-, or touch-driven playback of a pre-rendered video or frame sequence. If you use it, use it for at most one moment where real-time 3D is not enough (for example a cinematic camera pull-through of a building during the scroll story), with a lightweight compressed sequence and a poster fallback. Everything that real-time 3D, CSS, SVG, or GSAP can do should stay in code.
- `pixelfx`: one or two pixel or dither accents as a deliberate detail (a pixel-dissolve section transition, a dithered preloader gradient, or a pixelated-to-sharp reveal on project covers). Keep it subtle so it supports the blueprint-to-build concept and does not become a retro pastiche.

## Stage 4: Data visualization
- `d3-visualization`: the interactive skills constellation, plus a small animated chart for the research results (71.9% recall, 0.709 macro-F1, 98% accuracy, 97% agreement). Keep the style consistent with the rest of the design system.

## Stage 4b: Explainer video
- `anything2explainer`: produce one short narrated motion-graphics explainer, "How ArchiTech works" (about 60 to 90 seconds, English, black canvas with a star-field or dot-field backdrop, voiceover, subtitles, chapter progress bar, drawn in code with Remotion). Chapters: floor plan upload, AI extraction to structured JSON, 3D model with roofs and floors, section cuts and first-person walkthrough, Dijkstra fire-escape routing, bill of materials export. Use only the facts in the ArchiTech content above. Put the Remotion source in a separate `explainer/` folder (not part of the site bundle), render it, compress it to MP4 and WebM under about 8 MB, and embed it in the ArchiTech detail view with a poster frame, captions (`.vtt`), `preload="none"`, no autoplay with sound, and a play button that matches the design system. If you cannot render video in your environment, still deliver the Remotion project, the script and storyboard, and a clearly marked placeholder in the page. This video is the only pre-rendered media file allowed even in a no-images build.

## Stage 5: Copy
- `humanizer`: after writing the About text, taglines, and project blurbs, rewrite anything that sounds AI-written (stock phrases, forced triads, inflated claims, "not X but Y" contrasts, em-dash overuse). The voice should be plain, specific, and confident, like a sharp student engineer talking, without changing any fact.

## Stage 6: Review passes (do these at the end, in order)
1. `critique`: run the 5-dimension design review (philosophy, visual hierarchy, detail, functionality, innovation) on the finished site and list the weakest areas with scores.
2. `impeccable` `/critique`, then `/polish`: fix spacing, alignment, type scale, easing, contrast, and hover and focus states.
3. `impeccable` `/bolder`: where the design plays it too safe, push one or two moments further (scale, contrast, motion) without hurting readability or performance.
If the slash commands are not available, perform the same passes manually and report what you changed and the before and after scores.

# DESIGN DIRECTION

Choose one cohesive concept and commit. Suggested concept (you may improve it, but keep the idea): **"From blueprint to build."** Krish's flagship project turns flat floor plans into 3D buildings, so the site itself does the same thing. The page starts as thin blueprint-style line work and, as the visitor scrolls, lines extrude, light up, and become a 3D world. Data, graphs, and neural-network motifs can appear as secondary accents.

Visual rules:
- Dark-first theme with one confident accent color and one secondary accent. Define everything as CSS variables / design tokens. Offer a light theme toggle only if it can be done without visual compromise.
- Typography is a major part of the design. Pair a distinctive display face with a clean text face and a mono face for technical labels (for example a variable display font plus Inter or Geist plus JetBrains Mono, all self-hosted or from a reliable CDN). Use fluid `clamp()` sizing and a strict type scale.
- Generous whitespace, strong grid, large confident headings, small precise mono captions. Subtle grain or noise texture is welcome. No clutter, no default Bootstrap look, no purple-on-white gradient cliche.
- Every section must have a distinct moment of delight, but the overall rhythm must stay consistent.

# TECH STACK

- Vite + React + TypeScript
- Three.js via React Three Fiber and @react-three/drei (use postprocessing sparingly: bloom, subtle depth of field, or vignette)
- GSAP with ScrollTrigger for scroll-driven storytelling, and Framer Motion (or Motion) for component-level transitions
- Lenis for smooth scrolling (tied to GSAP's ticker so they do not fight)
- Tailwind CSS plus CSS variables for tokens
- Custom GLSL shaders for at least one signature effect (for example a displacement hero background, a noise gradient, or a hover distortion)
- D3 for one data-driven visual (for example a skills constellation or a small animated chart)
- No heavy UI kit. Hand-build components.

**Hosting constraint:** the final site will be uploaded as static files to a university web host (`webpages.charlotte.edu/kiyer6/`, a subfolder) and may also be mirrored on GitHub Pages or Vercel. So: output a fully static build, set Vite `base: './'` so it works from any subfolder, use hash-based or single-page navigation (no server routing), and do not rely on any server code, environment secrets, or server-side rendering.

# REQUIRED 3D AND ANIMATION MOMENTS

1. **Hero:** a full-viewport interactive 3D scene that reacts to the mouse (parallax, camera drift, or object tilt). Tie it to the blueprint-to-build concept: for example a procedurally generated multi-floor wireframe building (flat, gable, or hip roof) that assembles itself on load, with glowing edges and a soft bloom. Large animated name with a staggered per-character or per-line reveal.
2. **Scroll storytelling:** as the user scrolls, the 3D scene transforms with the page (camera moves along a path, wireframe becomes solid, floors stack up, a section-cut plane slices through the model). Use one pinned, scrubbed ScrollTrigger timeline for this. Keep the content readable at every scroll position.
3. **Experience timeline:** an animated vertical timeline where each role reveals with a line-draw and text mask animation. Metrics (98%, 65%, 97%, 500+, 71.9% recall, 0.709 macro-F1) count up when they enter the viewport.
4. **Projects:** ArchiTech gets the hero treatment. Build a mini interactive 3D viewer of a procedural building the visitor can orbit, with a toggle for section cut and roof type, so they feel what the project does. Other projects appear as cards with 3D tilt on hover, a cursor-following light, and an expand-to-detail transition (shared-element or clip-path reveal).
5. **Skills:** an interactive visualization, not a plain list. For example a 3D or D3 force-directed constellation grouped by category, where hovering a node highlights related projects. Provide a plain accessible list view as well.
6. **Micro-interactions:** custom cursor (hidden on touch devices), magnetic buttons, link underline animations, section-number counters, scroll progress indicator, smooth page-load sequence with a short tasteful preloader (under 2 seconds, skippable).
7. **Contact:** a closing section with a large call to action, copy-email-to-clipboard with a small success animation, and social links. Subtle 3D or shader flourish in the background.

# SECTIONS (in order)

1. Hero
2. About (short, written in a confident, human voice; 3-4 sentences; no buzzword soup)
3. Experience
4. Featured projects (ArchiTech, Ai-FixIT, Make-A-Dash) plus the compact project grid
5. Skills
6. Education and honors
7. Off the clock (personal section, described above)
8. Contact and footer

Add a slim sticky navigation with section links, active-section highlighting, and a downloadable resume button pointing to `/Krish_Iyer_Resume.pdf` (I will drop the file in `public/`).

# ENGINEERING AND QUALITY BAR

- **Performance:** target Lighthouse 90+ on Performance, Accessibility, Best Practices, and SEO on desktop. Lazy-load the 3D canvas below the fold, use `frameloop="demand"` where possible, cap device pixel ratio at 2, dispose geometries and materials on unmount, instance repeated meshes, and pause rendering when the tab or section is not visible. Keep the initial JS bundle lean with code splitting.
- **Mobile:** fully responsive from 360px up. On phones and low-power devices, automatically fall back to a lighter scene (fewer objects, no postprocessing, lower pixel ratio). Test the touch interactions.
- **Accessibility:** respect `prefers-reduced-motion` by replacing scroll-scrubbed and parallax motion with simple fades. Keyboard navigable, visible focus states, semantic landmarks, alt text on every image, WCAG AA contrast, and a no-WebGL fallback (static illustration plus normal content). Canvas elements need `aria-hidden` or labels as appropriate.
- **SEO and sharing:** title, meta description, Open Graph and Twitter tags, favicon, and JSON-LD `Person` structured data.
- **Code quality:** strict TypeScript, small focused components, no giant files, a `README.md` with setup, build, and static deployment steps (including the subfolder deploy for the university host). Do not add code comments unless something is genuinely non-obvious.
- **Content separation:** all copy lives in the data file; all design tokens live in one place.

# IMAGES AND MEDIA (INCLUDE REAL IMAGES)

The site should use photography and screenshots where they add credibility or warmth. Do not use stock photos or AI-generated people. I will supply the real files, so build an asset system that works before and after I add them.

1. Create a `public/images/` folder and an `src/data/images.ts` manifest that maps each slot to a file path, an `alt` text, a width and height (to avoid layout shift), and a dominant-color placeholder.
2. Every image slot must render a good-looking fallback when the file is missing (a gradient, blueprint pattern, or shader-based placeholder with a small "add image" label visible only in development). The site must never show a broken image icon.
3. Use modern formats (WebP or AVIF with a JPEG fallback), `loading="lazy"`, `decoding="async"`, responsive `srcset`, and blur-up or dominant-color loading.
4. Slots to implement:
   - `portrait`: a professional headshot used in About (portrait ratio 4:5). **I have already added my headshot to this project folder.** Find it (look for a file named like headshot, portrait, profile, or me in the folder or its images subfolder), copy it into `public/images/`, and wire it to this slot. Do not generate or substitute a placeholder for it. Treat it with a subtle duotone or grain effect and a scroll parallax, not a plain rectangle.
   - `project-architech-1..4`: screenshots or short screen recordings of ArchiTech (floor plan upload, 3D model, section cut, fire route).
   - `project-aifixit-1..3`, `project-makeadash-1..3`: UI screenshots shown inside device frames or browser mockups built with CSS.
   - `project-veinviz-1`, `project-motionmentor-1`, `project-futurepop-1`: one image each for the compact cards.
   - `hackathon-1..4`: team and award photos from CrownHacks and HackUNCP, shown in a small tilted-polaroid or film-strip gallery.
   - `ta-1` (optional): a candid teaching or lab photo.
   - Personal photos for the Off the clock section: `matchday-1..2` (my own photos from watching soccer), `travel-1..8` (landscape, one per featured place), `food-1..6` (square), `climbing-1..2`, `sports-1..2` (volleyball or badminton).
5. Support short looping videos (MP4/WebM, muted, autoplay, playsInline) for project demos in place of screenshots, with a poster image and `prefers-reduced-motion` handled by showing the poster only.
6. Image treatments to use: hover zoom with a clip-path reveal, scroll-linked parallax, a custom cursor label ("View"), and a lightbox with keyboard support and focus trapping.
7. Include a short `ASSETS.md` listing every image slot, recommended dimensions, and aspect ratio so I know exactly what to export.
8. Do not use logos or crests of any club or brand without permission.


# DELIVERABLES

1. The complete project: every file, with full contents, in a sensible folder structure. No placeholders like "rest of code here" and no truncated files.
2. `package.json` with exact dependencies and scripts (`dev`, `build`, `preview`).
3. `README.md` with run, build, and static-deploy instructions (including deploying to a subfolder on a university web host and to GitHub Pages).
4. A short list of the `TODO` items I need to fill in (links, places, assets).

# HOW TO WORK

- Before writing code, spend a short paragraph stating the visual concept, color palette (hex values), font pairing, and the scroll storyboard (what happens in each section). Then build.
- Build in order: design tokens and layout, content data, hero scene, scroll storytelling, sections, polish, accessibility and performance pass.
- After building, do a self-review against the quality bar above and fix anything that fails. Call out any trade-offs you made.
- If anything in this brief conflicts or is ambiguous, make the best decision, state it in one line, and keep going instead of asking me questions.

Aim for a site someone would screenshot and share. I have added my master resume to this folder as well. If you think anything else in it should be showcased, use it, but keep to the facts in this brief and the resume and do not invent anything.
