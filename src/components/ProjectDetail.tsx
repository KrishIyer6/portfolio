import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { explainer, projects, type Project } from '../data/content'
import { isIllustration } from '../data/images'
import { asset } from '../lib/env'
import { closeProject, useProjectState } from '../lib/projectStore'
import { lockScroll } from '../lib/scroll'
import { ArrowOut, Close, Play } from './Icons'
import { Lightbox } from './Lightbox'
import { BrowserFrame, ProjectVisual } from './ProjectVisual'
import { SmartImage, slotAvailable } from './SmartImage'

const EASE = [0.77, 0, 0.175, 1] as const

function Explainer() {
  const video = useRef<HTMLVideoElement>(null)
  const [playing, setPlaying] = useState(false)
  if (!explainer.ready) {
    if (!import.meta.env.DEV) return null
    return (
      <div className="hatch sheet grid aspect-video place-items-center p-6 text-center">
        <p className="note max-w-md text-accent">Placeholder (dev only). {explainer.pending}</p>
      </div>
    )
  }
  return (
    <figure>
      <div className="sheet relative aspect-video overflow-hidden bg-black">
        <video ref={video} className="size-full" preload="none" playsInline controls={playing} poster={asset(explainer.poster)} onPause={() => setPlaying(false)} onPlay={() => setPlaying(true)}>
          <source src={asset(explainer.webm)} type="video/webm" />
          <source src={asset(explainer.mp4)} type="video/mp4" />
          <track kind="captions" src={asset(explainer.captions)} srcLang="en" label="English" />
        </video>
        {!playing && (
          <button type="button" className="group absolute inset-0 grid place-items-center bg-paper/30" aria-label={`Play video: ${explainer.title}`} data-cursor="Play" onClick={() => video.current?.play()}>
            <span className={playButton}>
              <Play width={24} height={24} />
            </span>
          </button>
        )}
      </div>
      <figcaption className="note mt-3">
        {explainer.title}. {explainer.note}
      </figcaption>
    </figure>
  )
}

const playButton = 'grid size-20 place-items-center rounded-full bg-accent text-paper transition-transform duration-200 ease-[var(--ease-out)] group-hover:scale-110 group-active:scale-95'

// Nothing is requested from YouTube until the visitor presses play.
function YouTubeDemo({ project }: { project: Project }) {
  const id = /(?:v=|youtu\.be\/|embed\/)([\w-]{11})/.exec(project.demoVideoUrl)?.[1]
  const [on, setOn] = useState(false)
  if (!id) return null
  const available = project.images.filter(slotAvailable)
  const poster = available[1] ?? available[0]
  return (
    <figure>
      <div className="sheet relative aspect-video overflow-hidden bg-black">
        {on ? (
          <iframe
            className="absolute inset-0 size-full"
            src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`}
            title={`${project.title} demo video`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          />
        ) : (
          <>
            {poster && <SmartImage slot={poster} ratio="16 / 9" sizes="(min-width: 1024px) 45vw, 100vw" />}
            <button type="button" className="group absolute inset-0 grid place-items-center bg-paper/40" aria-label={`Play the ${project.title} demo video`} data-cursor="Play" onClick={() => setOn(true)}>
              <span className={playButton}>
                <Play width={24} height={24} />
              </span>
            </button>
          </>
        )}
      </div>
      <figcaption className="note mt-3">{project.title} demo. Plays from YouTube once you press play.</figcaption>
    </figure>
  )
}

function Body({ project }: { project: Project }) {
  const [lightbox, setLightbox] = useState<number | null>(null)
  const shots = project.images.filter(slotAvailable)
  const hasDemo = /youtu/.test(project.demoVideoUrl)
  const links = [
    { href: project.liveUrl, label: 'Visit live site' },
    { href: project.repoUrl, label: 'View source' },
    { href: project.demoVideoUrl, label: 'Watch demo' },
  ].filter((l) => l.href)

  return (
    <motion.div className="wrap pt-28 pb-24" initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.7, delay: 0.3, ease: [0.23, 1, 0.32, 1] }}>
      <h2 id="project-title" className="display text-[clamp(3.5rem,11vw,10rem)]">
        {project.title}
      </h2>
      <p className="note mt-4 text-accent">{[project.award, project.dates].filter(Boolean).join(', ')}</p>
      <div className="rule mt-5 mb-8" />
      <div className="grid gap-x-12 gap-y-10 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <p className="lead prose-measure">{project.blurb}</p>
          <ul className="prose-measure mt-8 space-y-4 text-dim">
            {project.bullets.map((b) => (
              <li key={b} className="relative pl-6 before:absolute before:top-[0.7em] before:left-0 before:h-px before:w-3 before:bg-accent">
                {b}
              </li>
            ))}
          </ul>
        </div>
        <aside className="lg:col-span-4 lg:col-start-9">
          <h3 className="note mb-3">Built with</h3>
          <ul className="flex flex-wrap gap-2">
            {project.stack.map((s) => (
              <li key={s} className="chip">
                {s}
              </li>
            ))}
          </ul>
          {links.length > 0 && (
            <div className="mt-8 flex flex-wrap gap-3">
              {links.map((l, i) => (
                <a key={l.label} className={`btn ${i === 0 ? 'btn-solid' : ''}`} href={l.href} target="_blank" rel="noreferrer">
                  {l.label} <ArrowOut />
                </a>
              ))}
            </div>
          )}
        </aside>
      </div>

      {(hasDemo || project.id === 'architech') && (
        <div className="mt-16 grid gap-x-8 gap-y-12 lg:grid-cols-2">
          {hasDemo && (
            <div>
              <h3 className="display mb-4 text-3xl">{explainer.demoHeading}</h3>
              <YouTubeDemo project={project} />
            </div>
          )}
          {project.id === 'architech' && (explainer.ready || import.meta.env.DEV) && (
            <div>
              <h3 className="display mb-4 text-3xl">{explainer.explainerHeading}</h3>
              <Explainer />
            </div>
          )}
        </div>
      )}

      <div className="mt-16">
        {shots.length === 0 ? (
          <div className="max-w-4xl">
            <ProjectVisual project={project} sizes="(min-width: 1024px) 60vw, 100vw" />
          </div>
        ) : (
          <ul className="grid gap-6 sm:grid-cols-2">
            {shots.map((slot) => {
              const img = <SmartImage slot={slot} imgClassName="transition-transform duration-700 ease-[var(--ease-out)] group-hover:scale-[1.04]" />
              return (
                <li key={slot}>
                  <button type="button" className="group block w-full text-left" data-cursor="View" onClick={() => setLightbox(shots.indexOf(slot))}>
                    {project.frame === 'browser' && !isIllustration(slot) ? <BrowserFrame url={project.liveUrl.replace('https://', '') || project.title}>{img}</BrowserFrame> : <div className="sheet">{img}</div>}
                  </button>
                </li>
              )
            })}
          </ul>
        )}
      </div>
      <Lightbox slots={shots} index={lightbox} onIndex={setLightbox} />
    </motion.div>
  )
}

export function ProjectDetail() {
  const { id, origin } = useProjectState()
  const project = projects.find((p) => p.id === id)
  const panel = useRef<HTMLDivElement>(null)
  const open = !!project

  useEffect(() => {
    if (!open) return
    const prevFocus = document.activeElement as HTMLElement | null
    lockScroll(true)
    panel.current?.focus()
    const key = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeProject()
      if (e.key !== 'Tab' || document.querySelector('[aria-label="Image viewer"]')) return
      const f = Array.from(panel.current?.querySelectorAll<HTMLElement>('a[href], button, video[controls]') ?? [])
      if (!f.length) return
      const first = f[0]
      const last = f[f.length - 1]
      const inside = panel.current?.contains(document.activeElement) && document.activeElement !== panel.current
      if (e.shiftKey && (!inside || document.activeElement === first)) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && (!inside || document.activeElement === last)) {
        e.preventDefault()
        first.focus()
      }
    }
    window.addEventListener('keydown', key)
    return () => {
      lockScroll(false)
      window.removeEventListener('keydown', key)
      prevFocus?.focus()
    }
  }, [open])

  const vw = window.innerWidth
  const vh = window.innerHeight
  const from = origin ? `inset(${origin.y}px ${vw - origin.x - origin.w}px ${vh - origin.y - origin.h}px ${origin.x}px)` : `inset(${vh}px 0px 0px 0px)`

  return (
    <AnimatePresence>
      {project && (
        <motion.div
          ref={panel}
          key={project.id}
          role="dialog"
          aria-modal="true"
          aria-labelledby="project-title"
          tabIndex={-1}
          data-lenis-prevent
          className="fixed inset-0 z-[80] overflow-y-auto bg-panel outline-none"
          initial={{ clipPath: from }}
          animate={{ clipPath: 'inset(0px 0px 0px 0px)' }}
          exit={{ clipPath: from }}
          transition={{ duration: 0.75, ease: EASE }}
        >
          <div className="gridpaper pointer-events-none absolute inset-0 opacity-60" aria-hidden="true" />
          <div className="sticky top-0 z-10 flex justify-end p-[var(--gutter)] pb-0">
            <button type="button" className="btn bg-panel" onClick={closeProject}>
              <Close /> Close
            </button>
          </div>
          <div className="relative -mt-12">
            <Body project={project} />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
