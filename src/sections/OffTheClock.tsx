import { lazy, Suspense, useMemo, useRef, useState, type ReactNode } from 'react'
import { Lightbox } from '../components/Lightbox'
import { SectionHead } from '../components/SectionHead'
import { SmartImage, anyAvailable, slotAvailable } from '../components/SmartImage'
import { offClock } from '../data/content'
import { hasWebGL } from '../lib/env'
import { useInView } from '../lib/hooks'
import { openProject } from '../lib/projectStore'
import { ClimbWall } from './offclock/ClimbWall'
import { HexBoard } from './offclock/HexBoard'
import { Pitch } from './offclock/Pitch'
import { Shuttle } from './offclock/Shuttle'

const Globe = lazy(() => import('../three/Globe'))

function Panel({ title, body, className = '', children, action }: { title: string; body: string; className?: string; children: ReactNode; action?: ReactNode }) {
  return (
    <article className={`sheet flex flex-col p-[clamp(1rem,2vw,1.75rem)] ${className}`}>
      <h3 className="display text-[clamp(1.6rem,2.4vw,2.25rem)]">{title}</h3>
      <p className="mt-2 max-w-[44ch] text-[length:var(--text-small)] text-dim">{body}</p>
      {action && <div className="mt-3">{action}</div>}
      <div className="mt-5 flex flex-1 flex-col justify-end">{children}</div>
    </article>
  )
}

const ProjectLink = ({ id, label }: { id: string; label: string }) => (
  <button type="button" className="link link-on text-[length:var(--text-small)] text-accent" onClick={(e) => openProject(id, e.currentTarget)}>
    {label}
  </button>
)

function GlobePanel() {
  const host = useRef<HTMLDivElement>(null)
  const near = useInView(host, '300px', true)
  const active = useInView(host, '0px')
  const webgl = useMemo(hasWebGL, [])
  const [sel, setSel] = useState<number | null>(null)
  const { places } = offClock.travel
  const place = sel === null ? null : places[sel]
  return (
    <div className="flex h-full flex-col">
      <div ref={host} className="relative mx-auto my-auto aspect-square w-full max-w-[25rem]" data-cursor={webgl ? 'Spin' : undefined} onPointerLeave={() => setSel(null)}>
        {webgl && near && (
          <Suspense fallback={null}>
            <Globe places={places} selected={sel} onSelect={setSel} active={active} />
          </Suspense>
        )}
      </div>
      <p className="mt-2 min-h-[3.2em] text-[length:var(--text-small)]" aria-live="polite">
        {place ? (
          <>
            <span className="text-ink">{place.name}</span>
            {place.dish && <span className="block text-accent">{place.dish}</span>}
          </>
        ) : (
          <span className="text-faint">{offClock.travel.hint}</span>
        )}
      </p>
      <ul className="mt-2 flex max-h-40 flex-wrap gap-1.5 overflow-y-auto pr-1" data-lenis-prevent>
        {places.map((p, i) => (
          <li key={p.name}>
            <button type="button" className={`chip transition-colors duration-200 hover:border-ink hover:text-ink ${sel === i ? '!border-accent !text-accent' : ''}`} aria-pressed={sel === i} onClick={() => setSel(sel === i ? null : i)}>
              {p.name.split(',')[0]}
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}

function Photos() {
  const [open, setOpen] = useState<number | null>(null)
  if (!anyAvailable(offClock.photos)) return null
  const real = offClock.photos.filter(slotAvailable)
  return (
    <div className="mt-6">
      <ul className="flex snap-x gap-4 overflow-x-auto pb-4" data-lenis-prevent-wheel>
        {real.map((slot, i) => (
          <li key={slot} className="w-64 shrink-0 snap-start">
            <button type="button" className="group block w-full" data-cursor="View" onClick={() => setOpen(i)}>
              <SmartImage slot={slot} ratio="4 / 3" sizes="16rem" className="sheet" imgClassName="transition-transform duration-700 ease-[var(--ease-out)] group-hover:scale-105" />
            </button>
          </li>
        ))}
      </ul>
      <Lightbox slots={real} index={open} onIndex={setOpen} />
    </div>
  )
}

export function OffTheClock() {
  const { arsenal, travel, court, climbing, games } = offClock
  return (
    <section id="off-the-clock" aria-labelledby="off-h" className="section">
      <div className="wrap">
        <SectionHead id="off-h" title={offClock.heading}>
          {offClock.intro}
        </SectionHead>
        <div className="grid gap-5 lg:grid-cols-12">
          <Panel title={arsenal.title} body={arsenal.body} className="lg:col-span-7" action={<ProjectLink id={arsenal.projectId} label={arsenal.linkLabel} />}>
            <Pitch />
          </Panel>
          <Panel title={travel.title} body={travel.body} className="lg:col-span-5 lg:row-span-2">
            <GlobePanel />
          </Panel>
          <Panel title={court.title} body={court.body} className="lg:col-span-4" action={<ProjectLink id={court.projectId} label={court.linkLabel} />}>
            <Shuttle label={court.action} />
          </Panel>
          <Panel title={climbing.title} body={climbing.body} className="lg:col-span-3">
            <ClimbWall routes={climbing.routes} />
          </Panel>
          <Panel title={games.title} body={games.body} className="lg:col-span-12 lg:grid lg:grid-cols-12 lg:gap-x-10 [&>div:last-child]:lg:col-span-7 [&>div:last-child]:lg:col-start-6 [&>div:last-child]:lg:row-span-3 [&>div:last-child]:lg:row-start-1 [&>div:last-child]:lg:mt-0 [&>h3]:lg:col-span-5 [&>p]:lg:col-span-5">
            <HexBoard />
          </Panel>
        </div>
        <Photos />
      </div>
    </section>
  )
}
