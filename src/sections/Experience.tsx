import { useRef } from 'react'
import { CountUp } from '../components/CountUp'
import { ResultsChart } from '../components/ResultsChart'
import { SectionHead } from '../components/SectionHead'
import { copy, experience } from '../data/content'
import { gsap, MOTION_OK, SplitText, useGSAP } from '../lib/gsap'

export function Experience() {
  const root = useRef<HTMLElement>(null)
  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(MOTION_OK, () => {
        gsap.fromTo('.spine-fill', { scaleY: 0 }, { scaleY: 1, ease: 'none', scrollTrigger: { trigger: '.timeline', start: 'top 62%', end: 'bottom 62%', scrub: 0.6 } })
        gsap.utils.toArray<HTMLElement>('.role').forEach((role) => {
          const st = { trigger: role, start: 'top 76%', once: true }
          const q = gsap.utils.selector(role)
          gsap.from(q('.role-node'), { scale: 0, duration: 0.6, ease: 'back.out(2.2)', scrollTrigger: st })
          gsap.from(q('.role-tick'), { scaleX: 0, duration: 0.9, ease: 'power3.inOut', scrollTrigger: st })
          SplitText.create(q('.role-title'), {
            type: 'lines',
            mask: 'lines',
            autoSplit: true,
            onSplit: (self) => gsap.from(self.lines, { yPercent: 108, duration: 1, stagger: 0.08, scrollTrigger: st }),
          })
          gsap.from(q('.role-fade'), { autoAlpha: 0, y: 18, duration: 0.9, stagger: 0.06, delay: 0.15, scrollTrigger: st })
        })
      })
    },
    { scope: root },
  )

  return (
    <section ref={root} id="experience" aria-labelledby="experience-h" className="section">
      <div className="wrap">
        <SectionHead id="experience-h" title="Experience">
          {copy.experienceLead}
        </SectionHead>

        <ol className="timeline relative">
          <div aria-hidden="true" className="absolute top-2 bottom-0 left-[5px] w-px bg-line lg:left-[calc(25%+5px)]">
            <div className="spine-fill h-full w-full origin-top bg-accent" />
          </div>
          {experience.map((r) => (
            <li key={r.id} className="role relative grid gap-x-10 pb-[clamp(3.5rem,8vw,6.5rem)] pl-9 last:pb-0 lg:grid-cols-4 lg:pl-0">
              <span aria-hidden="true" className={`role-node absolute top-2 left-0 size-[11px] rotate-45 border border-accent lg:left-1/4 ${r.current ? 'bg-accent' : 'bg-paper'}`} />
              <div className="role-fade mb-4 lg:col-span-1 lg:mb-0 lg:pr-8 lg:text-right">
                <p className="note text-ink">{r.dates}</p>
                <p className="note mt-1">
                  {r.org}, {r.place}
                </p>
                {r.current && <p className="note mt-1 text-accent">Current</p>}
              </div>
              <div className="lg:col-span-3 lg:pl-14">
                <span aria-hidden="true" className="role-tick absolute top-[9px] left-[26px] hidden h-px w-8 origin-left bg-accent lg:left-[calc(25%+18px)] lg:block" />
                <h3 className="role-title display h3">{r.title}</h3>
                <p className="role-fade lead prose-measure mt-4 text-dim">{r.summary}</p>
                <dl className="role-fade mt-8 flex flex-wrap gap-x-14 gap-y-6">
                  {r.metrics.map((m) => (
                    <div key={m.label}>
                      <dd className="font-display text-[clamp(3.25rem,6.5vw,5.75rem)] leading-none font-extrabold text-accent">
                        <CountUp metric={m} />
                      </dd>
                      <dt className="note mt-2 max-w-[22ch]">{m.label}</dt>
                    </div>
                  ))}
                </dl>
                <ul className="role-fade prose-measure mt-8 space-y-3 text-dim">
                  {r.bullets.map((b) => (
                    <li key={b} className="relative pl-6 before:absolute before:top-[0.7em] before:left-0 before:h-px before:w-3 before:bg-line-strong">
                      {b}
                    </li>
                  ))}
                </ul>
              </div>
            </li>
          ))}
        </ol>

        <div className="mt-[clamp(4rem,9vw,7rem)] lg:ml-[25%] lg:pl-14">
          <ResultsChart />
        </div>
      </div>
    </section>
  )
}
