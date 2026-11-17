import { useRef } from 'react'
import { HeroStack } from '../components/HeroStack'
import { ArrowDown } from '../components/Icons'
import { Magnetic } from '../components/Magnetic'
import { copy, identity, tagline } from '../data/content'
import { gsap, MOTION_OK, MOTION_REDUCED, useGSAP } from '../lib/gsap'

export function Hero({ ready }: { ready: boolean }) {
  const root = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      if (!ready) return
      const mm = gsap.matchMedia()
      mm.add(MOTION_REDUCED, () => {
        gsap.set('.hero-fill', { clipPath: 'inset(0% 0% 0% 0%)' })
      })
      mm.add(MOTION_OK, () => {
        gsap
          .timeline()
          .to('.hero-wire', { opacity: 1, duration: 0.5, stagger: 0.05 }, 0.05)
          .to('.hero-fill', { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.15, stagger: 0.07, ease: 'power4.inOut' }, 0.35)
          .to('.hero-wire', { opacity: 0, duration: 0.3 }, 2.2)
          .from('.hero-line', { yPercent: 115, duration: 1.1, stagger: 0.1 }, 0.95)
          .from('.hero-fade', { autoAlpha: 0, y: 14, duration: 0.9, stagger: 0.09 }, 1.35)
      })
    },
    { scope: root, dependencies: [ready] },
  )

  return (
    <section ref={root} id="top" aria-label="Introduction" className="gridpaper relative h-svh min-h-[36rem] overflow-hidden">
      <HeroStack ready={ready} />
      <div className="wrap pointer-events-none absolute inset-0 flex flex-col justify-end pb-[clamp(1.5rem,4vh,3rem)]">
        <div className="pointer-events-auto mb-[clamp(1rem,3vh,2.5rem)] max-w-[30rem]">
          <p className="lead">
            {tagline.split(', ').map((part, i, all) => (
              <span key={part} className="block overflow-hidden">
                <span className="hero-line block">{part + (i < all.length - 1 ? ',' : '')}</span>
              </span>
            ))}
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Magnetic className="hero-fade">
              <a className="btn btn-solid" href="#projects">
                See the work
              </a>
            </Magnetic>
            <Magnetic className="hero-fade">
              <a className="btn" href="#contact">
                Get in touch
              </a>
            </Magnetic>
          </div>
          <p className="hero-fade note mt-5 hidden items-center gap-2 md:flex">
            {copy.stackHint} <ArrowDown className="-rotate-90" />
          </p>
        </div>
        <h1 className="display -ml-[0.04em] text-[length:var(--text-hero)] leading-[0.8] whitespace-nowrap" aria-label={identity.name}>
          {identity.name.split('').map((ch, i) =>
            ch === ' ' ? (
              <span key={i} className="inline-block w-[0.22em]" />
            ) : (
              <span key={i} aria-hidden="true" className="relative inline-block">
                <span className="hero-wire char-wire opacity-0">{ch}</span>
                <span className="hero-fill absolute inset-0" style={{ clipPath: 'inset(100% 0% 0% 0%)' }}>
                  {ch}
                </span>
              </span>
            ),
          )}
        </h1>
      </div>
    </section>
  )
}
