import { useRef } from 'react'
import { SectionHead } from '../components/SectionHead'
import { SmartImage } from '../components/SmartImage'
import { about } from '../data/content'
import { gsap, MOTION_OK, useGSAP } from '../lib/gsap'

export function About() {
  const root = useRef<HTMLElement>(null)
  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(MOTION_OK, () => {
        gsap.fromTo('.portrait-clip', { clipPath: 'inset(100% 0% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.5, ease: 'power4.inOut', scrollTrigger: { trigger: '.portrait-clip', start: 'top 80%', once: true } })
        gsap.fromTo('.portrait-move', { yPercent: -7 }, { yPercent: 7, ease: 'none', scrollTrigger: { trigger: '.portrait-clip', start: 'top bottom', end: 'bottom top', scrub: true } })
        gsap.from('.about-p', { autoAlpha: 0, y: 22, duration: 1, stagger: 0.12, scrollTrigger: { trigger: '.about-copy', start: 'top 78%', once: true } })
        gsap.from('.about-fact', { autoAlpha: 0, duration: 0.8, stagger: 0.08, scrollTrigger: { trigger: '.about-facts', start: 'top 88%', once: true } })
      })
    },
    { scope: root },
  )
  return (
    <section ref={root} id="about" aria-labelledby="about-h" className="section">
      <div className="wrap">
        <SectionHead id="about-h" title={about.heading} />
        <div className="grid gap-x-12 gap-y-12 lg:grid-cols-12">
          <figure className="lg:col-span-4">
            <div className="portrait-clip sheet mx-auto max-w-[22rem] lg:mx-0" data-cursor="Color">
              <div className="cyanotype relative overflow-hidden">
                <div className="portrait-move scale-[1.16]">
                  <SmartImage slot="portrait" ratio="4 / 5" sizes="(min-width: 1024px) 28vw, 22rem" eager />
                </div>
              </div>
            </div>
            <figcaption className="note mx-auto mt-3 max-w-[22rem] lg:mx-0">Fig. 1. Printed as a cyanotype. Hover for color.</figcaption>
          </figure>
          <div className="about-copy lg:col-span-7 lg:col-start-6">
            {about.paragraphs.map((p, i) => (
              <p key={p} className={`about-p prose-measure ${i === 0 ? 'lead' : 'mt-6 text-dim'}`}>
                {p}
              </p>
            ))}
            <dl className="about-facts mt-12 grid grid-cols-2 border-t border-line">
              {about.facts.map((f) => (
                <div key={f.k} className="about-fact border-b border-line py-4 pr-4 odd:border-r odd:border-line even:pl-5">
                  <dt className="note">{f.k}</dt>
                  <dd className="mt-1 text-ink">{f.v}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>
    </section>
  )
}
