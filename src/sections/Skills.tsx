import { useMemo, useState } from 'react'
import { Constellation, type Focus } from '../components/Constellation'
import { SectionHead } from '../components/SectionHead'
import { copy, experience, projects, skillGroups } from '../data/content'
import { isFinePointer } from '../lib/env'
import { openProject } from '../lib/projectStore'

const related = (skill: string) => ({
  projects: projects.filter((p) => p.skills.includes(skill)),
  roles: experience.filter((r) => r.skills.includes(skill)),
})

export function Skills() {
  const fine = useMemo(isFinePointer, [])
  const [view, setView] = useState<'map' | 'list'>(fine ? 'map' : 'list')
  const [focus, setFocus] = useState<Focus>(null)
  const [pinned, setPinned] = useState<string | null>(null)
  const skill = focus?.kind === 'skill' ? focus.id : pinned
  const info = useMemo(() => (skill ? related(skill) : null), [skill])
  const group = focus?.kind === 'group' ? skillGroups.find((g) => g.id === focus.id) : null

  return (
    <section id="skills" aria-labelledby="skills-h" className="section">
      <div className="wrap">
        <SectionHead id="skills-h" title="Skills">
          {copy.skillsLead}
        </SectionHead>

        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div className="flex" role="group" aria-label="Skills view">
            <button type="button" className="btn" aria-pressed={view === 'map'} onClick={() => setView('map')}>
              Constellation
            </button>
            <button type="button" className="btn -ml-px" aria-pressed={view === 'list'} onClick={() => setView('list')}>
              Plain list
            </button>
          </div>
          <div className="min-h-[3.5rem] max-w-xl text-[length:var(--text-small)] text-dim lg:text-right" aria-live="polite">
            {!skill && !group && <p>{fine && view === 'map' ? copy.skillsHint : copy.skillsHintList}</p>}
            {group && (
              <p>
                <strong className="text-ink">{group.label}:</strong> {group.items.length} skills.
              </p>
            )}
            {skill && info && !group && (
              <p>
                <strong className="text-accent">{skill}</strong>{' '}
                {info.projects.length + info.roles.length === 0 ? (
                  copy.skillsNone
                ) : (
                  <>
                    used in{' '}
                    {info.projects.map((p, i) => (
                      <span key={p.id}>
                        {i > 0 && ', '}
                        <button type="button" className="link link-on text-ink" onClick={(e) => openProject(p.id, e.currentTarget)}>
                          {p.title}
                        </button>
                      </span>
                    ))}
                    {info.projects.length > 0 && info.roles.length > 0 && ', and at '}
                    {info.projects.length === 0 && info.roles.length > 0 && 'at '}
                    {info.roles.map((r) => r.org).filter((o, i, all) => all.indexOf(o) === i).join(' and ')}
                    .
                  </>
                )}
              </p>
            )}
          </div>
        </div>

        {view === 'map' ? (
          <div className="sheet gridpaper overflow-hidden p-2">
            <Constellation onFocus={setFocus} />
          </div>
        ) : (
          <div className="grid gap-x-10 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {skillGroups.map((g) => (
              <div key={g.id}>
                <h3 className="display mb-4 border-b border-line pb-3 text-3xl">{g.label}</h3>
                <ul className="flex flex-wrap gap-2">
                  {g.items.map((item) => (
                    <li key={item}>
                      <button type="button" className={`chip transition-colors duration-200 hover:border-ink hover:text-ink ${pinned === item ? '!border-accent !text-accent' : ''}`} aria-pressed={pinned === item} onClick={() => setPinned(pinned === item ? null : item)}>
                        {item}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
