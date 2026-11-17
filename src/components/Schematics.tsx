import { useMemo, type ReactNode } from 'react'
import { H, ROOFS, floorSegments, roofSegments, type RoofKind } from '../three/building'

// Authored line drawings that stand in for screenshots until real ones are supplied.
// They are diagrams of what each project does, not imitations of its UI.

const iso = (x: number, y: number, z: number): [number, number] => [(x - z) * 0.866, (x + z) * 0.5 - y * 1.05]

export function StaticBuilding({ floors = 3, roof = 'hip', className = '' }: { floors?: number; roof?: RoofKind; className?: string }) {
  const d = useMemo(() => {
    let path = ''
    const add = (segs: number[], dy: number) => {
      for (let i = 0; i < segs.length; i += 6) {
        const [x1, y1] = iso(segs[i], segs[i + 1] + dy, segs[i + 2])
        const [x2, y2] = iso(segs[i + 3], segs[i + 4] + dy, segs[i + 5])
        path += `M${x1.toFixed(2)} ${y1.toFixed(2)}L${x2.toFixed(2)} ${y2.toFixed(2)}`
      }
    }
    for (let f = 0; f < floors; f++) add(floorSegments(f), f * H)
    add(roofSegments(ROOFS[roof].inset, ROOFS[roof].height), floors * H)
    return path
  }, [floors, roof])
  const top = floors * H * 1.05 + 2
  return (
    <svg className={className} viewBox={`-5.2 ${-top - 1.6} 10.4 ${top + 4.8}`} fill="none" stroke="currentColor" strokeWidth="1" aria-hidden="true">
      <path d={d} vectorEffect="non-scaling-stroke" />
    </svg>
  )
}

const Frame = ({ children }: { children: ReactNode }) => (
  <svg className="size-full text-draw" viewBox="0 0 160 100" fill="none" stroke="currentColor" strokeWidth="0.5" aria-hidden="true" preserveAspectRatio="xMidYMid meet">
    {children}
  </svg>
)
const label = { fill: 'currentColor', stroke: 'none', fontFamily: 'IBM Plex Mono, monospace', fontSize: 4.6, letterSpacing: 0.4 } as const
const warm = 'var(--color-accent)'

const drawings: Record<string, ReactNode> = {
  aifixit: (
    <Frame>
      {['DIAGNOSE', 'REPAIR', 'RECOMMEND'].map((t, i) => (
        <g key={t} transform={`translate(${14 + i * 48} 30)`}>
          <rect width="36" height="36" />
          <text x="18" y="48" textAnchor="middle" {...label}>
            {t}
          </text>
          {i < 2 && <path d="M38 18h8m-3-3 3 3-3 3" stroke={warm} />}
        </g>
      ))}
      <circle cx="32" cy="48" r="8" />
      <circle cx="32" cy="48" r="3" stroke={warm} />
      <path d="M72 56l14-14m-4-4a6 6 0 1 0 8 8" />
      <path d="M128 40a7 7 0 0 1 7 7c0 5-7 11-7 11s-7-6-7-11a7 7 0 0 1 7-7z" />
      <circle cx="128" cy="47" r="2" stroke={warm} />
    </Frame>
  ),
  makeadash: (
    <Frame>
      <rect x="12" y="12" width="58" height="34" />
      <path d="M18 36h46M18 36v-4m6 4v-9m6 9v-6m6 6V24m6 12v-8m6 8v-5m6 5V22m6 14v-7m4 7v-4" stroke={warm} />
      <rect x="76" y="12" width="34" height="34" />
      <path d="M76 22h34M84.500 22v24M93 22v24M101.500 22v24M76 30h34M76 38h34" strokeOpacity=".5" />
      <rect x="116" y="12" width="32" height="76" />
      <path d="M122 22h20M122 30h14M122 38h20M122 46h10M122 54h18" strokeOpacity=".6" />
      <rect x="12" y="52" width="40" height="36" />
      <circle cx="32" cy="70" r="10" />
      <path d="M32 70v-7m0 7 5 3" stroke={warm} />
      <rect x="58" y="52" width="52" height="36" strokeDasharray="3 3" />
      <path d="M80 70h8m-4-4v8" />
    </Frame>
  ),
  veinviz: (
    <Frame>
      <path d="M10 40c40-6 90-4 140 6M10 66c44 4 94 2 140-8" />
      <path d="M22 54c20-4 34 2 52-2s30-8 50-4 18 2 24 2M74 52c8 6 20 8 30 6M48 53c4-6 12-8 18-8" stroke={warm} />
      <rect x="86" y="38" width="26" height="26" strokeDasharray="2 3" />
      <path d="M99 34v8m0 18v8m-17-17h8m18 0h8" />
    </Frame>
  ),
  'motion-mentor': (
    <Frame>
      <path d="M12 60c12-30 24-34 36-16s22 30 36 6 24-30 36-12 16 14 28 4" />
      <path d="M12 72c14-18 26-24 40-12s20 26 34 10 26-28 38-14 14 12 24 6" stroke={warm} />
      <path d="M30 33v25M48 44v16M66 62v13M84 50v32M102 30v23M120 38v20M138 50v24" strokeDasharray="1.500 2.500" strokeOpacity=".6" />
      <path d="M12 88h136" strokeOpacity=".4" />
    </Frame>
  ),
  futurepop: (
    <Frame>
      <ellipse cx="62" cy="50" rx="46" ry="36" />
      <ellipse cx="62" cy="50" rx="22" ry="36" strokeOpacity=".5" />
      <path d="M16 50h92M24 30h76M24 70h76M62 14v72" strokeOpacity=".5" />
      <path d="M44 36l10-4 8 6-4 10-10 2zM70 44l12-2 6 8-8 10-10-4z" stroke={warm} />
      <path d="M124 86V58m8 28V40m8 46V52m8 34V30" />
    </Frame>
  ),
  'pl-predictor': (
    <Frame>
      <rect x="12" y="16" width="92" height="68" />
      <path d="M58 16v68M12 34h14v32H12M104 34H90v32h14" />
      <circle cx="58" cy="50" r="10" />
      <path d="M118 30h30M118 50h30M118 70h30" strokeOpacity=".4" />
      <path d="M118 30h22M118 50h8M118 70h14" stroke={warm} strokeWidth="2.5" />
      <text x="118" y="25" {...label}>H</text>
      <text x="118" y="45" {...label}>D</text>
      <text x="118" y="65" {...label}>A</text>
    </Frame>
  ),
  sudoku: (
    <Frame>
      <rect x="44" y="14" width="72" height="72" />
      <path d="M68 14v72M92 14v72M44 38h72M44 62h72" />
      <path d="M52 14v72M60 14v72M76 14v72M84 14v72M100 14v72M108 14v72M44 22h72M44 30h72M44 46h72M44 54h72M44 70h72M44 78h72" strokeOpacity=".3" />
      {[[48, 20, '5'], [72, 28, '3'], [96, 20, '7'], [56, 44, '6'], [80, 52, '9'], [104, 44, '1'], [48, 76, '8'], [88, 68, '2'], [112, 84, '4']].map(([x, y, n]) => (
        <text key={`${x}${y}`} x={x as number} y={y as number} textAnchor="middle" {...label} fill={n === '9' ? warm : 'currentColor'}>
          {n}
        </text>
      ))}
    </Frame>
  ),
}

export function Schematic({ id }: { id: string }) {
  if (id === 'architech') return <StaticBuilding className="h-[86%] text-draw" floors={3} />
  return <div className="absolute inset-[9%]">{drawings[id] ?? null}</div>
}
