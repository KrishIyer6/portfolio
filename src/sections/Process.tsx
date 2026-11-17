import { useRef } from 'react'
import { SectionHead } from '../components/SectionHead'
import { copy, story } from '../data/content'
import { gsap, MOTION_OK, useGSAP } from '../lib/gsap'

// The four steps that used to be a pinned scroll scene, now ordinary content.
export function Process() {
  const root = useRef<HTMLElement>(null)
  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(MOTION_OK, () => {
        const st = { trigger: '.steps', start: 'top 82%', once: true }
        gsap.from('.step-rule', { scaleX: 0, duration: 1.1, stagger: 0.12, ease: 'power3.inOut', scrollTrigger: st })
        gsap.from('.step-body', { autoAlpha: 0, y: 20, duration: 0.9, stagger: 0.12, delay: 0.15, scrollTrigger: st })
      })
    },
    { scope: root },
  )
  return (
    <section ref={root} aria-labelledby="process-h" className="section">
      <div className="wrap">
        <SectionHead id="process-h" title={copy.processTitle}>
          {copy.processLead}
        </SectionHead>
        <ol className="steps grid gap-x-8 gap-y-12 md:grid-cols-2 xl:grid-cols-4">
          {story.map((s, i) => (
            <li key={s.title}>
              <div className="step-rule h-0.5 origin-left bg-accent" />
              <div className="step-body pt-5">
                <p className="note tabular text-accent">
                  Step {i + 1} of {story.length}
                </p>
                <h3 className="display mt-2 text-[clamp(1.9rem,2.6vw,2.6rem)]">{s.title}</h3>
                <p className="mt-4 text-dim">{s.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
