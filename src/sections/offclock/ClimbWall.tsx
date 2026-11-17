import { useState } from 'react'

type RouteId = 'amber' | 'blue' | 'red'
const COLORS: Record<RouteId, string> = { amber: '#e89a0c', blue: 'var(--color-accent)', red: 'var(--color-redline)' }

const ROUTES: Record<RouteId, [number, number][]> = {
  amber: [[34, 210], [52, 176], [30, 142], [58, 108], [44, 72], [70, 40], [62, 14]],
  blue: [[104, 212], [92, 172], [118, 138], [98, 100], [126, 66], [108, 30], [120, 12]],
  red: [[170, 208], [152, 170], [176, 132], [150, 96], [172, 60], [158, 26], [166, 10]],
}
const JIBS: [number, number][] = [[76, 196], [140, 190], [18, 100], [84, 130], [136, 120], [184, 96], [20, 40], [90, 56], [142, 46], [186, 30]]
const SHAPES = ['M-7 -3Q-2 -8 5 -5T8 3Q2 8-5 5T-7 -3Z', 'M-6 -5Q4 -8 7 -1T2 7Q-6 8-8 2T-6 -5Z', 'M-8 0Q-5 -7 2 -6T8 1Q5 7-2 6T-8 0Z']

export function ClimbWall({ routes }: { routes: { id: string; label: string }[] }) {
  const [active, setActive] = useState<RouteId | null>(null)
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-end lg:flex-col lg:items-stretch">
      <svg viewBox="0 0 200 224" className="w-full max-w-[17rem] self-center" fill="none" role="img" aria-label="A climbing wall with three colored routes. Choosing a route lights its holds from the ground to the top.">
        <rect x="1" y="1" width="198" height="222" stroke="var(--color-line-strong)" />
        <path d="M67 1v222M133 1v222M1 75h198M1 149h198" stroke="var(--color-line)" strokeDasharray="2 4" />
        {JIBS.map(([x, y], i) => (
          <path key={i} d={SHAPES[i % 3]} transform={`translate(${x} ${y}) scale(0.55) rotate(${i * 47})`} fill="var(--color-edge)" />
        ))}
        {(Object.keys(ROUTES) as RouteId[]).map((id) => {
          const pts = ROUTES[id]
          const on = active === id
          return (
            <g key={id} onPointerEnter={() => setActive(id)} onPointerLeave={() => setActive(null)}>
              <path
                d={`M${pts.map((p) => p.join(' ')).join('L')}`}
                pathLength={1}
                stroke={COLORS[id]}
                strokeWidth="1.2"
                strokeDasharray="1"
                strokeDashoffset={on ? 0 : 1}
                style={{ transition: `stroke-dashoffset ${on ? 900 : 300}ms var(--ease-out)` }}
              />
              {pts.map(([x, y], i) => (
                <path
                  key={i}
                  d={SHAPES[i % 3]}
                  transform={`translate(${x} ${y}) rotate(${i * 61})`}
                  fill={COLORS[id]}
                  stroke="var(--color-paper)"
                  strokeWidth="1"
                  style={{ opacity: active && !on ? 0.25 : on ? 1 : 0.7, transition: `opacity 300ms ease ${on ? i * 70 : 0}ms` }}
                />
              ))}
            </g>
          )
        })}
      </svg>
      <div className="flex flex-wrap gap-2 lg:justify-center">
        {routes.map((r) => (
          <button
            key={r.id}
            type="button"
            className="btn !min-h-10 !px-3"
            aria-pressed={active === r.id}
            onPointerEnter={() => setActive(r.id as RouteId)}
            onPointerLeave={() => setActive(null)}
            onFocus={() => setActive(r.id as RouteId)}
            onBlur={() => setActive(null)}
            onClick={() => setActive(r.id as RouteId)}
          >
            <span aria-hidden="true" className="size-2.5 rounded-full" style={{ background: COLORS[r.id as RouteId] }} />
            {r.label}
          </button>
        ))}
      </div>
    </div>
  )
}
