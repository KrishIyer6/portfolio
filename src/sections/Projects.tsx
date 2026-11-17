import { useRef, useState } from 'react'
import { Lightbox } from '../components/Lightbox'
import { ProjectVisual } from '../components/ProjectVisual'
import { SectionHead } from '../components/SectionHead'
import { SmartImage, slotAvailable } from '../components/SmartImage'
import { TiltCard } from '../components/TiltCard'
import { ViewerPanel } from '../components/ViewerPanel'
import { copy, flagshipSchedule, hackathonGallery, projects, type Project } from '../data/content'
import { gsap, MOTION_OK, useGSAP } from '../lib/gsap'
import { openProject } from '../lib/projectStore'

const flagship = projects.find((p) => p.tier === 'flagship')!
const featured = projects.filter((p) => p.tier === 'featured')
const compact = projects.filter((p) => p.tier === 'compact')

function Card({ project, big }: { project: Project; big: boolean }) {
  const ref = useRef<HTMLDivElement>(null)
  return (
    <TiltCard className="proj-card h-full" max={big ? 4 : 6}>
      <article ref={ref} className="group relative flex h-full flex-col border border-line bg-panel/60 transition-colors duration-300 hover:border-line-strong">
        <div className={big ? 'p-[clamp(1rem,2.5vw,2rem)] pb-0' : ''}>
          <ProjectVisual project={project} ratio={big ? '16 / 10' : '16 / 9'} sizes={big ? '(min-width: 1024px) 45vw, 100vw' : '(min-width: 1024px) 30vw, 100vw'} />
        </div>
        <div className={`flex flex-1 flex-col ${big ? 'p-[clamp(1rem,2.5vw,2rem)]' : 'p-5'}`}>
          <h3 className={`display ${big ? 'h3' : 'text-3xl'}`}>
            <button type="button" className="text-left uppercase after:absolute after:inset-0" data-cursor="Open" onClick={() => openProject(project.id, ref.current)}>
              {project.title}
            </button>
          </h3>
          {(project.award || project.dates) && <p className="note mt-2 text-accent">{[project.award, project.dates].filter(Boolean).join(', ')}</p>}
          <p className={`mt-3 text-dim ${big ? 'max-w-[46ch]' : 'text-[length:var(--text-small)]'}`}>{project.blurb}</p>
          <ul className="mt-auto flex flex-wrap gap-1.5 pt-5">
            {project.stack.slice(0, big ? 6 : 4).map((s) => (
              <li key={s} className="chip">
                {s}
              </li>
            ))}
          </ul>
        </div>
      </article>
    </TiltCard>
  )
}

function Polaroids() {
  const [open, setOpen] = useState<number | null>(null)
  const items = hackathonGallery.filter((g) => slotAvailable(g.slot))
  if (!items.length) return null
  const real = items.map((g) => g.slot)
  return (
    <div className="mt-[clamp(4rem,9vw,7rem)]">
      <h3 className="display h3 mb-8">{copy.hackathons}</h3>
      <ul className="flex flex-wrap gap-x-6 gap-y-10">
        {items.map(({ slot, caption }, i) => (
          <li key={slot} className="w-[min(100%,16rem)] transition-transform duration-500 ease-[var(--ease-out)] hover:!rotate-0" style={{ rotate: `${[-3, 2, -1.5, 3][i % 4]}deg` }}>
            <button type="button" className="group block w-full border border-line bg-white p-2.5 pb-9 text-left shadow-[0_18px_40px_-20px_rgb(15_23_42/0.35)]" data-cursor="View" onClick={() => setOpen(i)}>
              <SmartImage slot={slot} ratio="1 / 1" sizes="16rem" imgClassName="transition-transform duration-700 ease-[var(--ease-out)] group-hover:scale-105" />
              <span className="mt-2 block font-mono text-xs text-ink">{caption}</span>
            </button>
          </li>
        ))}
      </ul>
      <Lightbox slots={real} index={open} onIndex={setOpen} />
    </div>
  )
}

export function Projects() {
  const root = useRef<HTMLElement>(null)
  const flagRef = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(MOTION_OK, () => {
        gsap.from('.flag-title', { yPercent: 100, duration: 1.2, scrollTrigger: { trigger: '.flag-title', start: 'top 92%', once: true } })
        gsap.from('.sched-row', { autoAlpha: 0, x: -14, duration: 0.7, stagger: 0.05, scrollTrigger: { trigger: '.sched', start: 'top 82%', once: true } })
        gsap.utils.toArray<HTMLElement>('.card-row').forEach((row) => {
          gsap.from(row.querySelectorAll('.proj-card'), { clipPath: 'inset(0% 0% 100% 0%)', y: 30, duration: 1.1, ease: 'power3.inOut', stagger: 0.09, scrollTrigger: { trigger: row, start: 'top 84%', once: true } })
        })
      })
    },
    { scope: root },
  )

  return (
    <section ref={root} id="projects" aria-labelledby="projects-h" className="section">
      <div className="wrap">
        <SectionHead id="projects-h" title="Projects">
          {copy.projectsLead}
        </SectionHead>

        <article aria-labelledby="flag-h">
          <div className="mb-8 flex flex-wrap items-end justify-between gap-x-10 gap-y-4">
            <div className="overflow-hidden">
              <h3 id="flag-h" className="flag-title display text-[clamp(4.5rem,15vw,15rem)] leading-[0.8]">
                {flagship.title}
              </h3>
            </div>
            <p className="note border border-accent px-3 py-2 text-accent">
              {flagship.award}, {flagship.dates}
            </p>
          </div>
          <div className="grid gap-x-12 gap-y-10 lg:grid-cols-12">
            <div className="lg:col-span-8">
              <ViewerPanel />
            </div>
            <div ref={flagRef} className="lg:col-span-4">
              <p className="lead">{flagship.blurb}</p>
              <dl className="sched mt-8 border-t border-line">
                {flagshipSchedule.map((row) => (
                  <div key={row.k} className="sched-row grid grid-cols-[7.5rem_1fr] gap-3 border-b border-line py-2.5">
                    <dt className="note pt-0.5">{row.k}</dt>
                    <dd className="text-[length:var(--text-small)] text-ink">{row.v}</dd>
                  </div>
                ))}
              </dl>
              <button type="button" className="btn btn-solid mt-8" onClick={() => openProject(flagship.id, flagRef.current)}>
                {copy.caseFile}
              </button>
            </div>
          </div>
        </article>

        <div className="card-row mt-[clamp(4rem,9vw,7rem)] grid gap-6 md:grid-cols-2">
          {featured.map((p) => (
            <Card key={p.id} project={p} big />
          ))}
        </div>

        <h3 className="display h3 mt-[clamp(4rem,9vw,7rem)] mb-8">{copy.moreBuilds}</h3>
        <div className="card-row grid gap-6 md:grid-cols-6">
          {compact.map((p, i) => (
            <div key={p.id} className={i < 2 ? 'md:col-span-3' : 'md:col-span-2'}>
              <Card project={p} big={false} />
            </div>
          ))}
        </div>

        <Polaroids />
      </div>
    </section>
  )
}
