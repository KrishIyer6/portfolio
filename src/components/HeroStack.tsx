import { useEffect, useRef, useState, type ReactNode } from 'react'
import { stackLayers } from '../data/content'
import { isFinePointer } from '../lib/env'
import { gsap, MOTION_OK, useGSAP } from '../lib/gsap'
import { useInView } from '../lib/hooks'

const label = { fill: 'currentColor', stroke: 'none', fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: 1.2 } as const
const soft = { stroke: 'none', fill: 'currentColor', fillOpacity: 0.1 } as const
const dot = { stroke: 'none', fill: 'currentColor' } as const

const nn = [3, 5, 5, 2].map((n, c) => Array.from({ length: n }, (_, k) => [70 + c * 100, 158 + (k - (n - 1) / 2) * 42] as const))

// What is drawn on each sheet, bottom of the stack first.
const drawings: ReactNode[] = [
  <>
    <rect x="16" y="40" width="236" height="214" rx="3" />
    <rect x="16" y="40" width="236" height="30" rx="3" {...soft} />
    {[70, 101, 132, 163, 194, 225].map((y) => (
      <path key={y} d={`M16 ${y}H252`} strokeOpacity=".35" />
    ))}
    <path d="M92 40V254M172 40V254" strokeOpacity=".35" />
    {[0, 1, 2, 3, 4, 5].flatMap((r) => [28, 104, 184].map((x, c) => <rect key={`${r}${c}`} x={x} y={82 + r * 31} width={[44, 52, 30, 48, 38, 56][(r + c * 2) % 6]} height="5" rx="2.5" {...dot} fillOpacity={c === 2 ? 1 : 0.45} />))}
    <path d="M284 44V250H426" />
    {[[300, 226], [312, 214], [322, 222], [334, 196], [346, 204], [352, 178], [366, 186], [374, 158], [386, 166], [392, 138], [404, 132], [412, 108], [418, 122]].map(([x, y]) => (
      <circle key={x} cx={x} cy={y} r="3" {...dot} fillOpacity=".55" />
    ))}
    <path d="M292 234 424 104" strokeWidth="2" />
  </>,
  <>
    {nn.slice(0, 3).flatMap((col, c) => col.flatMap(([x1, y1]) => nn[c + 1].map(([x2, y2]) => <path key={`${x1}${y1}${x2}${y2}`} d={`M${x1 + 9} ${y1}L${x2 - 9} ${y2}`} strokeWidth=".8" strokeOpacity=".4" />)))}
    {nn.flatMap((col, c) => col.map(([x, y]) => <circle key={`${x}${y}`} cx={x} cy={y} r="9" fill={c === 3 ? 'currentColor' : 'var(--sheet)'} />))}
    <text x="70" y="270" textAnchor="middle" {...label}>INPUT</text>
    <text x="370" y="270" textAnchor="middle" {...label}>OUTPUT</text>
  </>,
  <>
    {[
      [22, 122, 84, 46, 'CLIENT'],
      [176, 112, 88, 66, 'API'],
      [334, 44, 86, 44, 'DATABASE'],
      [334, 123, 86, 44, 'SERVING'],
      [334, 202, 86, 44, 'QUEUE'],
      [176, 216, 88, 40, 'AUTH'],
    ].map(([x, y, w, h, t]) => (
      <g key={t as string}>
        <rect x={x as number} y={y as number} width={w as number} height={h as number} rx="4" fill={t === 'API' ? 'currentColor' : 'var(--sheet)'} fillOpacity={t === 'API' ? 0.1 : 1} />
        <text x={(x as number) + (w as number) / 2} y={(y as number) + (h as number) / 2 + 3} textAnchor="middle" {...label}>
          {t}
        </text>
      </g>
    ))}
    <path d="M106 145H170M264 128H298V66H328M264 145H328M264 162H298V224H328M220 178V210" />
    <path d="m164 140 8 5-8 5zM322 61l8 5-8 5zM322 140l8 5-8 5zM322 219l8 5-8 5zM215 204l5 8 5-8z" {...dot} />
  </>,
  <>
    <rect x="16" y="38" width="408" height="238" rx="6" />
    <path d="M16 62H424M98 62V276" />
    {[30, 42, 54].map((x) => (
      <circle key={x} cx={x} cy="50" r="3" />
    ))}
    <rect x="300" y="45" width="110" height="10" rx="5" {...soft} />
    {[84, 104, 124, 144].map((y, i) => (
      <rect key={y} x="30" y={y} width={[50, 38, 46, 30][i]} height="6" rx="3" {...dot} fillOpacity={i === 0 ? 1 : 0.35} />
    ))}
    <rect x="112" y="76" width="184" height="112" rx="4" />
    <path d="M124 170 150 150 176 158 204 122 232 132 260 98 284 106V176H124Z" {...soft} />
    <path d="M124 170 150 150 176 158 204 122 232 132 260 98 284 106" strokeWidth="2" />
    <rect x="308" y="76" width="102" height="50" rx="4" />
    <rect x="308" y="138" width="102" height="50" rx="4" />
    <rect x="318" y="88" width="40" height="6" rx="3" {...dot} fillOpacity=".35" />
    <rect x="318" y="102" width="62" height="10" rx="3" {...dot} />
    <rect x="318" y="150" width="34" height="6" rx="3" {...dot} fillOpacity=".35" />
    <rect x="318" y="164" width="52" height="10" rx="3" {...dot} />
    {[112, 214, 316].map((x) => (
      <rect key={x} x={x} y="200" width="94" height="62" rx="4" />
    ))}
    <rect x="124" y="238" width="48" height="14" rx="7" {...dot} />
  </>,
]

export function HeroStack({ ready }: { ready: boolean }) {
  const root = useRef<HTMLDivElement>(null)
  const tilt = useRef<HTMLDivElement>(null)
  const spin = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState<number | null>(null)
  const [hovering, setHovering] = useState(false)
  const [settled, setSettled] = useState(false)
  const inView = useInView(root, '0px')

  useGSAP(
    () => {
      if (!ready) return
      const mm = gsap.matchMedia()
      mm.add('(prefers-reduced-motion: reduce)', () => setSettled(true))
      mm.add(MOTION_OK, () => {
        gsap
          .timeline({ onComplete: () => setSettled(true) })
          .fromTo(spin.current, { '--gap': '0em' }, { '--gap': '7.4em', duration: 1.7, ease: 'power3.inOut' }, 0.25)
          .fromTo('.hs-sheet', { opacity: 0 }, { opacity: 1, duration: 0.5, stagger: 0.14, ease: 'power2.out' }, 0.1)
          .fromTo('.hs-sheet svg > *', { opacity: 0 }, { opacity: 1, duration: 0.5, stagger: { amount: 1.3 }, ease: 'power1.out' }, 0.5)
          .fromTo('.hs-legend li', { autoAlpha: 0, x: 14 }, { autoAlpha: 1, x: 0, duration: 0.7, stagger: 0.08 }, 1.3)
        if (!isFinePointer()) return
        const rx = gsap.quickTo(tilt.current, 'rotationX', { duration: 0.9, ease: 'power3' })
        const rz = gsap.quickTo(spin.current, 'rotation', { duration: 0.9, ease: 'power3' })
        const move = (e: PointerEvent) => {
          rx(57 - (e.clientY / window.innerHeight - 0.5) * 7)
          rz(-40 + (e.clientX / window.innerWidth - 0.5) * 12)
        }
        window.addEventListener('pointermove', move, { passive: true })
        return () => window.removeEventListener('pointermove', move)
      })
    },
    { scope: root, dependencies: [ready] },
  )

  // When nobody is pointing at it, the stack walks up through its own layers.
  useEffect(() => {
    if (!settled || hovering || !inView || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const id = window.setInterval(() => setActive((a) => ((a ?? -1) + 1) % stackLayers.length), 2600)
    return () => window.clearInterval(id)
  }, [settled, hovering, inView])

  const point = (i: number | null) => {
    setHovering(i !== null)
    if (i !== null) setActive(i)
  }

  return (
    <div ref={root} className="hero-stack" data-settled={settled} onPointerLeave={() => point(null)}>
      <div className="hs-scene" aria-hidden="true">
        <div ref={tilt} className="hs-tilt">
          <div ref={spin} className="hs-spin">
            {stackLayers.map((l, i) => (
              <div key={l.id} className="hs-sheet" data-on={active === i} data-dim={active !== null && active !== i} style={{ '--i': i } as React.CSSProperties} onPointerEnter={() => point(i)}>
                <svg viewBox="0 0 440 290" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round">
                  <text x="16" y="24" {...label} fontSize="10">
                    {l.name.toUpperCase()}
                  </text>
                  <text x="424" y="24" textAnchor="end" {...label} fontSize="10">
                    0{i + 1}
                  </text>
                  {drawings[i]}
                </svg>
              </div>
            ))}
          </div>
        </div>
      </div>
      <ol className="hs-legend" reversed>
        {[...stackLayers].reverse().map((l, r) => {
          const i = stackLayers.length - 1 - r
          return (
            <li key={l.id}>
              <button type="button" data-on={active === i} aria-pressed={active === i} onPointerEnter={() => point(i)} onFocus={() => point(i)} onBlur={() => point(null)} onClick={() => point(i)}>
                <span className="hs-name">{l.name}</span>
                <span className="hs-line">{l.line}</span>
              </button>
            </li>
          )
        })}
      </ol>
    </div>
  )
}
