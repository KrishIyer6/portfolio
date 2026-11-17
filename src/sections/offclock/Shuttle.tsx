import { useRef } from 'react'
import { gsap, MOTION_OK, MOTION_REDUCED, useGSAP } from '../../lib/gsap'

const FLIGHT = 'M38 108C78 8 176 -6 226 52S258 104 264 128'

// A clear: the shuttle leaves the racket fast, stalls at the top, then drops almost straight down.
export function Shuttle({ label }: { label: string }) {
  const root = useRef<HTMLDivElement>(null)
  const serve = useRef<() => void>(() => {})

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(MOTION_REDUCED, () => {
        gsap.set('.trail', { drawSVG: '100%' })
        gsap.set('.shuttle', { motionPath: { path: FLIGHT, alignOrigin: [0.5, 0.5], autoRotate: true, start: 0.62, end: 0.62 } })
      })
      mm.add(MOTION_OK, () => {
        const tl = gsap.timeline({ paused: true })
        tl.set('.trail', { drawSVG: '0%', opacity: 1 })
          .fromTo('.racket', { rotation: -50 }, { rotation: 28, duration: 0.22, ease: 'power3.in', svgOrigin: '30 132' }, 0)
          .to('.racket', { rotation: -50, duration: 0.7, ease: 'power2.out', svgOrigin: '30 132' }, 0.22)
          .fromTo('.shuttle', { opacity: 1 }, { motionPath: { path: FLIGHT, alignOrigin: [0.5, 0.5], autoRotate: true }, duration: 1.7, ease: 'power3.out', immediateRender: true }, 0.2)
          .to('.trail', { drawSVG: '100%', duration: 1.7, ease: 'power3.out' }, 0.2)
          .to('.trail', { opacity: 0.25, duration: 0.6 }, 2.1)
        serve.current = () => tl.restart()
        gsap.delayedCall(0, () => tl.progress(0).pause())
        const st = gsap.to({}, { scrollTrigger: { trigger: root.current, start: 'top 75%', once: true, onEnter: () => tl.restart() } })
        return () => st.kill()
      })
    },
    { scope: root },
  )

  return (
    <div ref={root}>
      <svg viewBox="0 0 300 150" className="w-full" fill="none" role="img" aria-label="Side view of a badminton court. A shuttlecock arcs over the net and drops.">
        <path d="M8 134h284" stroke="var(--color-line-strong)" />
        <path d="M150 134V88" stroke="var(--color-ink)" strokeWidth="1.2" />
        <path d="M144 88h12M144 96h12M144 104h12" stroke="var(--color-line-strong)" strokeWidth="0.6" />
        <path className="trail" d={FLIGHT} stroke="var(--color-accent)" strokeWidth="1" strokeDasharray="1 0" />
        <g className="racket" stroke="var(--color-draw)" strokeWidth="1.2">
          <path d="M30 132V112" />
          <ellipse cx="30" cy="102" rx="6.5" ry="10" />
        </g>
        <g className="shuttle">
          <path d="M-7 -4.500 3 -1.600v3.200L-7 4.500z" fill="var(--color-ink)" opacity="0.9" />
          <circle cx="4.500" cy="0" r="2.400" fill="var(--color-accent)" />
        </g>
      </svg>
      <button type="button" className="btn mt-2 !min-h-10" onClick={() => serve.current()}>
        {label}
      </button>
    </div>
  )
}
