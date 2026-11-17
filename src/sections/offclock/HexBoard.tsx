import { useState } from 'react'

const COLS = 7
const ROWS = 4
const S = 16
const HEX_W = Math.sqrt(3) * S
const center = (c: number, r: number): [number, number] => [HEX_W * (c + 0.5 + (r % 2) * 0.5) + 2, S * (1 + r * 1.5) + 2]
const hexPath = (cx: number, cy: number, s = S - 1.2) =>
  'M' + Array.from({ length: 6 }, (_, i) => `${(cx + s * Math.cos((Math.PI / 180) * (60 * i - 30))).toFixed(1)} ${(cy + s * Math.sin((Math.PI / 180) * (60 * i - 30))).toFixed(1)}`).join('L') + 'Z'

const cube = (c: number, r: number) => {
  const x = c - (r - (r & 1)) / 2
  return { x, z: r, y: -x - r }
}
const distance = (a: [number, number], b: [number, number]) => {
  const p = cube(...a)
  const q = cube(...b)
  return Math.max(Math.abs(p.x - q.x), Math.abs(p.y - q.y), Math.abs(p.z - q.z))
}

type Unit = { at: [number, number]; reach: number; role: string; glyph: 'square' | 'tri' | 'diamond' | 'circle' }
const UNITS: Unit[] = [
  { at: [2, 0], reach: 1, role: 'Frontline', glyph: 'square' },
  { at: [4, 0], reach: 1, role: 'Frontline', glyph: 'square' },
  { at: [3, 1], reach: 2, role: 'Skirmisher', glyph: 'tri' },
  { at: [1, 2], reach: 3, role: 'Caster', glyph: 'diamond' },
  { at: [5, 3], reach: 4, role: 'Backline carry', glyph: 'circle' },
  { at: [0, 3], reach: 2, role: 'Support', glyph: 'tri' },
]
const GLYPH: Record<Unit['glyph'], string> = {
  square: 'M-5 -5h10v10h-10z',
  tri: 'M0 -6 6 5H-6z',
  diamond: 'M0 -7 6 0 0 7-6 0z',
  circle: 'M0 -6a6 6 0 1 0 .01 0z',
}

// A TFT-style board: pick a unit and see which hexes it can reach from where it stands.
export function HexBoard() {
  const [sel, setSel] = useState<number | null>(null)
  const unit = sel === null ? null : UNITS[sel]
  const cells = Array.from({ length: ROWS * COLS }, (_, i) => [i % COLS, Math.floor(i / COLS)] as [number, number])
  return (
    <div>
      <svg viewBox={`0 0 ${(HEX_W * (COLS + 0.5) + 4).toFixed(0)} ${S * (ROWS * 1.5 + 0.5) + 4}`} className="w-full" fill="none" role="group" aria-label="Hex board with six units">
        {cells.map(([c, r]) => {
          const [cx, cy] = center(c, r)
          const d = unit ? distance(unit.at, [c, r]) : 99
          const inReach = unit !== null && d > 0 && d <= unit.reach
          return (
            <path
              key={`${c}-${r}`}
              d={hexPath(cx, cy)}
              stroke={inReach ? 'var(--color-accent)' : 'var(--color-line-strong)'}
              fill={inReach ? 'rgb(36 71 249 / 0.14)' : 'transparent'}
              strokeWidth="0.8"
              style={{ transition: `fill 260ms ease ${inReach ? d * 55 : 0}ms, stroke 260ms ease ${inReach ? d * 55 : 0}ms` }}
            />
          )
        })}
        {UNITS.map((u, i) => {
          const [cx, cy] = center(...u.at)
          const on = sel === i
          return (
            <g
              key={i}
              role="button"
              tabIndex={0}
              aria-label={`${u.role}, reach ${u.reach}`}
              aria-pressed={on}
              className="outline-none [&:focus-visible>path:first-child]:stroke-accent"
              onPointerEnter={() => setSel(i)}
              onPointerLeave={() => setSel(null)}
              onFocus={() => setSel(i)}
              onBlur={() => setSel(null)}
              data-cursor="Reach"
            >
              <path d={hexPath(cx, cy)} fill={on ? 'var(--color-accent)' : 'var(--color-wash)'} stroke="var(--color-ink)" strokeWidth="1" style={{ transition: 'fill 200ms ease' }} />
              <path d={GLYPH[u.glyph]} transform={`translate(${cx} ${cy})`} fill={on ? 'var(--color-paper)' : 'var(--color-draw)'} style={{ transition: 'fill 200ms ease' }} />
            </g>
          )
        })}
      </svg>
      <p className="note mt-2 min-h-[1.5em]" aria-live="polite">
        {unit ? `${unit.role}, reach ${unit.reach}` : 'Six units, twenty-eight hexes'}
      </p>
    </div>
  )
}
