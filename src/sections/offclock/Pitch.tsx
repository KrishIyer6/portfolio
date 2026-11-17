import { useRef } from 'react'
import { gsap, MOTION_OK, MOTION_REDUCED, ScrollTrigger, useGSAP } from '../../lib/gsap'

const PLAYERS: [number, number][] = [
  [18, 95],
  [62, 32],
  [56, 74],
  [56, 116],
  [62, 158],
  [120, 54],
  [106, 95],
  [120, 136],
  [192, 40],
  [208, 95],
  [192, 150],
]
const GOAL: [number, number] = [289, 95]
const SEQUENCE = [0, 2, 6, 5, 8, 6, 7, 10, 9]

// A passing move through a 4-3-3: out from the keeper, through midfield, finished by the striker.
export function Pitch() {
  const root = useRef<SVGSVGElement>(null)
  const stops: [number, number][] = [...SEQUENCE.map((i) => PLAYERS[i]), GOAL]

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(MOTION_REDUCED, () => {
        gsap.set('.pass', { opacity: 0.8 })
        gsap.set('.ball', { attr: { cx: PLAYERS[9][0], cy: PLAYERS[9][1] } })
      })
      mm.add(MOTION_OK, () => {
        const tl = gsap.timeline({ repeat: -1, repeatDelay: 1.1, paused: true, defaults: { ease: 'power2.inOut' } })
        tl.set('.pass', { drawSVG: '0%', opacity: 1 }).set('.ball', { attr: { cx: stops[0][0], cy: stops[0][1] } })
        stops.slice(1).forEach(([x, y], i) => {
          const [px, py] = stops[i]
          const d = Math.hypot(x - px, y - py) / 150
          const last = i === stops.length - 2
          tl.to('.ball', { attr: { cx: x, cy: y }, duration: 0.3 + d, ease: last ? 'power3.in' : 'power2.inOut' }, '>0.12')
          tl.to(`.pass-${i}`, { drawSVG: '100%', duration: 0.3 + d }, '<')
          if (!last) tl.fromTo(`.player-${SEQUENCE[i + 1]}`, { scale: 1 }, { scale: 1.7, duration: 0.16, yoyo: true, repeat: 1, transformOrigin: 'center', ease: 'power2.out' }, '>-0.08')
        })
        tl.fromTo('.net', { opacity: 0.25 }, { opacity: 1, duration: 0.12, yoyo: true, repeat: 3 }, '>-0.05')
        tl.to('.pass', { opacity: 0, duration: 0.6 }, '>0.5')
        const st = ScrollTrigger.create({ trigger: root.current, start: 'top 90%', end: 'bottom 10%', onToggle: (self) => (self.isActive ? tl.play() : tl.pause()) })
        return () => st.kill()
      })
    },
    { scope: root },
  )

  return (
    <svg ref={root} viewBox="0 0 300 190" className="w-full" fill="none" role="img" aria-label="A football pitch seen from above. Eleven players pass the ball forward until the striker scores.">
      <g stroke="var(--color-line-strong)" strokeWidth="0.8">
        <rect x="8" y="10" width="284" height="170" />
        <path d="M150 10v170M8 52h40v86H8M8 74h16v42H8M292 52h-40v86h40M292 74h-16v42h16" />
        <circle cx="150" cy="95" r="24" />
        <path className="net" d="M292 82h5v26h-5" stroke="var(--color-ink)" opacity="0.25" />
      </g>
      {stops.slice(1).map(([x, y], i) => (
        <path key={i} className={`pass pass-${i}`} d={`M${stops[i][0]} ${stops[i][1]}L${x} ${y}`} stroke="var(--color-ink)" strokeWidth="1" opacity="0" />
      ))}
      {PLAYERS.map(([x, y], i) => (
        <circle key={i} className={`player-${i}`} cx={x} cy={y} r="4.2" fill="var(--color-redline)" stroke="var(--color-ink)" strokeWidth="1" />
      ))}
      <circle className="ball" cx={PLAYERS[0][0]} cy={PLAYERS[0][1]} r="2.6" fill="var(--color-ink)" />
    </svg>
  )
}
