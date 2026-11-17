import { useRef } from 'react'
import { SectionHead } from '../components/SectionHead'
import { education } from '../data/content'
import { gsap, MOTION_OK, useGSAP } from '../lib/gsap'

export function Education() {
  const root = useRef<HTMLElement>(null)
  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(MOTION_OK, () => {
        const st = { trigger: '.gpa', start: 'top 80%', once: true }
        gsap.from('.gpa-line', { scaleX: 0, duration: 1.6, ease: 'power3.inOut', scrollTrigger: st })
        gsap.from('.gpa-end', { scaleY: 0, duration: 0.5, stagger: 1.2, scrollTrigger: st })
        gsap.from('.gpa-num', { yPercent: 100, duration: 1.1, delay: 0.5, scrollTrigger: st })
        gsap.from('.deg', { autoAlpha: 0, y: 18, duration: 0.9, stagger: 0.1, scrollTrigger: { trigger: '.degs', start: 'top 80%', once: true } })
      })
    },
    { scope: root },
  )
  return (
    <section ref={root} id="education" aria-labelledby="education-h" className="section">
      <div className="wrap">
        <SectionHead id="education-h" title="Education" />
        <div className="grid gap-x-12 gap-y-14 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <h3 className="display h3 max-w-[16ch]">{education.school}</h3>
            <ul className="degs mt-8 border-t border-line">
              {education.degrees.map((d) => (
                <li key={d.name} className="deg flex flex-wrap items-baseline justify-between gap-x-8 gap-y-1 border-b border-line py-4">
                  <span className="lead">{d.name}</span>
                  <span className="note">{d.when}</span>
                </li>
              ))}
              <li className="deg border-b border-line py-4 text-dim">{education.minor}</li>
            </ul>
          </div>

          <div className="lg:col-span-4 lg:col-start-9">
            <div className="gpa" role="img" aria-label={`GPA ${education.gpa.value.toFixed(1)} out of ${education.gpa.of.toFixed(1)}`}>
              <p className="note mb-2" aria-hidden="true">
                GPA, measured end to end
              </p>
              <div className="overflow-hidden" aria-hidden="true">
                <p className="gpa-num font-display text-[clamp(5rem,11vw,9rem)] leading-[0.85] font-extrabold text-accent">
                  {education.gpa.value.toFixed(1)}
                  <span className="text-[0.4em] text-dim"> / {education.gpa.of.toFixed(1)}</span>
                </p>
              </div>
              <div className="relative mt-5 h-4" aria-hidden="true">
                <span className="gpa-end absolute top-0 left-0 h-4 w-px bg-ink" />
                <span className="gpa-end absolute top-0 right-0 h-4 w-px bg-ink" />
                <span className="gpa-line absolute top-1/2 right-0 left-0 h-px origin-left bg-ink" />
              </div>
              <div className="note mt-1 flex justify-between" aria-hidden="true">
                <span>0.0</span>
                <span>4.0</span>
              </div>
            </div>

            <h4 className="note mt-12 mb-3">Relevant coursework</h4>
            <ul className="flex flex-wrap gap-2">
              {education.coursework.map((c) => (
                <li key={c} className="chip">
                  {c}
                </li>
              ))}
            </ul>
            <h4 className="note mt-8 mb-3">Clubs and honors</h4>
            <ul className="space-y-2 text-ink">
              {education.honors.map((h) => (
                <li key={h} className="relative pl-6 before:absolute before:top-[0.7em] before:left-0 before:h-px before:w-3 before:bg-accent">
                  {h}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
