import type { CSSProperties, ReactNode } from 'react'
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from 'remotion'
import { CELL, COLS, D, H, ROOFS, ROWS, W, floorSegments, planRoute, roofSegments, walls } from './building'
import { FPS, HEIGHT, WIDTH, chapters } from './script'

const INK = '#000000'
const LINE = '#e9f2f7'
const DIM = '#7e9db5'
const WARM = '#fcba43'
const RED = '#fc5950'
const MONO = 'ui-monospace, "Cascadia Mono", Consolas, monospace'
const SANS = '"Segoe UI", system-ui, sans-serif'

const ease = Easing.bezier(0.16, 1, 0.3, 1)
const ramp = (t: number, a: number, b: number) => interpolate(t, [a, b], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: ease })
const lin = (t: number, a: number, b: number) => interpolate(t, [a, b], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })

function DotField() {
  const frame = useCurrentFrame()
  const dots: ReactNode[] = []
  for (let y = 0; y < 15; y++) {
    for (let x = 0; x < 27; x++) {
      const wave = Math.sin(x * 0.45 + y * 0.6 - frame * 0.035)
      dots.push(<circle key={`${x}-${y}`} cx={24 + x * 48} cy={24 + y * 48} r={1.1 + wave * 0.5} fill={LINE} opacity={0.1 + wave * 0.06} />)
    }
  }
  return <svg width={WIDTH} height={HEIGHT} style={{ position: 'absolute' }}>{dots}</svg>
}

const iso = (x: number, y: number, z: number): [number, number] => [(x - z) * 0.866, (x + z) * 0.5 - y * 1.05]
const segPath = (segs: number[], dy: number) => {
  let d = ''
  for (let i = 0; i < segs.length; i += 6) {
    const [x1, y1] = iso(segs[i], segs[i + 1] + dy, segs[i + 2])
    const [x2, y2] = iso(segs[i + 3], segs[i + 4] + dy, segs[i + 5])
    d += `M${x1.toFixed(2)} ${y1.toFixed(2)}L${x2.toFixed(2)} ${y2.toFixed(2)}`
  }
  return d
}

function Building({ floors, inset, height, cut = 0 }: { floors: number; inset: number; height: number; cut?: number }) {
  const full = Math.floor(floors)
  const part = floors - full
  const paths: ReactNode[] = []
  for (let f = 0; f < Math.min(5, Math.ceil(floors)); f++) {
    const o = f < full ? 1 : part
    paths.push(<path key={f} d={segPath(floorSegments(f), f * H)} opacity={o} transform={`translate(0 ${(1 - o) * -1.2})`} />)
  }
  const cutX = interpolate(cut, [0, 1], [6, 0.2])
  return (
    <svg viewBox="-6 -9 12 13" width={640} height={693} fill="none" stroke={LINE} strokeWidth={0.028} style={{ overflow: 'visible' }}>
      <defs>
        <clipPath id="cut">
          <rect x={-8} y={-12} width={8 + cutX} height={20} />
        </clipPath>
      </defs>
      <g clipPath="url(#cut)">
        {paths}
        <path d={segPath(roofSegments(inset, height), floors * H)} stroke={WARM} strokeWidth={0.034} />
      </g>
      {cut > 0.01 && cut < 0.99 && <path d={`M${cutX} -9V3.5`} stroke={WARM} strokeWidth={0.05} strokeDasharray="0.2 0.14" />}
    </svg>
  )
}

const px = (x: number) => (x + W / 2) * 80
const pz = (z: number) => (z + D / 2) * 80

function Plan({ draw, grid = 0, route = 0 }: { draw: number; grid?: number; route?: number }) {
  const r = planRoute(0)
  const pts = r.points.map(([x, z]) => `${px(x)} ${pz(z)}`).join('L')
  const dash = { pathLength: 1, strokeDasharray: 1 }
  return (
    <svg viewBox="-20 -20 520 360" width={640} height={443} fill="none" stroke={LINE} strokeWidth={2.4}>
      {grid > 0 && (
        <g stroke={DIM} strokeWidth={0.8} opacity={grid * 0.6}>
          {Array.from({ length: COLS + 1 }, (_, i) => <path key={`c${i}`} d={`M${i * CELL * 80} 0V${D * 80}`} />)}
          {Array.from({ length: ROWS + 1 }, (_, i) => <path key={`r${i}`} d={`M0 ${i * CELL * 80}H${W * 80}`} />)}
        </g>
      )}
      <rect width={W * 80} height={D * 80} {...dash} strokeDashoffset={1 - ramp(draw, 0, 0.45)} />
      {walls(0).map((w, i) => (
        <path key={i} d={`M${px(w.x1)} ${pz(w.z1)}L${px(w.x2)} ${pz(w.z2)}`} {...dash} strokeDashoffset={1 - ramp(draw, 0.3 + i * 0.06, 0.6 + i * 0.06)} />
      ))}
      <path d={`M${px(-0.5)} ${pz(2)}H${px(0)}`} stroke={INK} strokeWidth={5} opacity={ramp(draw, 0.8, 1)} />
      <path d={`M${px(-0.5)} ${pz(2)}a40 40 0 0 1 40 -40`} stroke={DIM} strokeDasharray="4 5" opacity={ramp(draw, 0.8, 1)} />
      {route > 0 && (
        <>
          <rect x={px(r.fire[0]) - 60} y={pz(r.fire[1]) - 60} width={120} height={120} fill={RED} opacity={0.28 * ramp(route, 0, 0.15)} stroke="none" />
          <circle cx={px(r.fire[0])} cy={pz(r.fire[1])} r={12} fill={RED} stroke="none" opacity={ramp(route, 0, 0.15)} />
          <path d={`M${pts}`} stroke={WARM} strokeWidth={5} strokeLinejoin="round" {...dash} strokeDashoffset={1 - lin(route, 0.25, 0.9)} />
          <circle cx={px(r.start[0])} cy={pz(r.start[1])} r={9} fill={LINE} stroke="none" opacity={ramp(route, 0.1, 0.25)} />
        </>
      )}
    </svg>
  )
}

const big: CSSProperties = { fontFamily: SANS, fontWeight: 800, fontSize: 96, color: WARM, lineHeight: 1 }
const label: CSSProperties = { fontFamily: MONO, fontSize: 24, color: DIM, letterSpacing: 1.5, textTransform: 'uppercase' }
const Row = ({ children, gap = 70 }: { children: ReactNode; gap?: number }) => (
  <div style={{ position: 'absolute', inset: '70px 60px 150px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap }}>{children}</div>
)

const KEYS = ['walls', 'doors', 'windows', 'stairs', 'furniture']

function Scene({ id, t }: { id: string; t: number }) {
  if (id === 'upload') {
    const lift = ramp(t, 5.2, 7)
    return (
      <Row>
        <div style={{ border: `2px dashed ${DIM}`, padding: 28, transform: `translateY(${-lift * 26}px)`, opacity: 1 - ramp(t, 9.2, 10) }}>
          <Plan draw={lin(t, 0.4, 4)} />
        </div>
        <div style={{ ...label, opacity: ramp(t, 5.2, 6.2) }}>floorplan.png<br /><span style={{ color: WARM }}>uploading</span></div>
      </Row>
    )
  }
  if (id === 'extract') {
    return (
      <Row gap={50}>
        <div style={{ transform: 'scale(0.62)', margin: '-80px -110px' }}><Plan draw={1} /></div>
        <div style={{ ...label, color: WARM, opacity: ramp(t, 0.6, 1.6) }}>Express<br />to Claude API</div>
        <pre style={{ fontFamily: MONO, fontSize: 30, lineHeight: 1.5, color: LINE, margin: 0 }}>
          {'{\n'}
          {KEYS.map((k, i) => (
            <span key={k} style={{ opacity: ramp(t, 5.2 + i * 0.75, 5.7 + i * 0.75) }}>{`  "${k}": [ … ],\n`}</span>
          ))}
          {'}'}
          <span style={{ color: WARM, opacity: ramp(t, 10.6, 11.4) }}>{'   validated'}</span>
        </pre>
      </Row>
    )
  }
  if (id === 'model') {
    const floors = 1 + 4 * lin(t, 0.8, 5)
    const k = t < 8.2 ? 0 : t < 10.2 ? ramp(t, 8.2, 9.2) : 1 + ramp(t, 10.2, 11.2)
    const names = ['flat', 'gable', 'hip'] as const
    const a = ROOFS[names[Math.min(2, Math.floor(k))]]
    const b = ROOFS[names[Math.min(2, Math.ceil(k))]]
    const f = k - Math.floor(k)
    return (
      <Row>
        <div style={{ transform: 'scale(0.78)', margin: '-60px 0' }}>
          <Building floors={floors} inset={a.inset + (b.inset - a.inset) * f} height={a.height + (b.height - a.height) * f} />
        </div>
        <div>
          <div style={big}>{Math.floor(floors)}</div>
          <div style={label}>floors</div>
          <div style={{ ...label, marginTop: 36, color: WARM, opacity: ramp(t, 6.2, 7) }}>{names[Math.min(2, Math.round(k))]} roof</div>
        </div>
      </Row>
    )
  }
  if (id === 'inside') {
    return (
      <Row>
        <div style={{ transform: 'scale(0.78)', margin: '-60px 0' }}>
          <Building floors={5} inset={ROOFS.hip.inset} height={ROOFS.hip.height} cut={ramp(t, 0.8, 4.4)} />
        </div>
        <div style={{ opacity: ramp(t, 5.6, 6.6) }}>
          <div style={big}>1.65 m</div>
          <div style={label}>eye height</div>
          <div style={{ ...label, marginTop: 28 }}>wall collision<br />stairs between floors</div>
        </div>
      </Row>
    )
  }
  if (id === 'fire') {
    return (
      <Row>
        <Plan draw={1} grid={ramp(t, 0.6, 2)} route={lin(t, 2.6, 9.5)} />
        <div>
          <div style={{ ...label, color: WARM }}>Dijkstra</div>
          <div style={{ ...label, marginTop: 14 }}>around the fire<br />to an outside door</div>
          <div style={{ ...label, marginTop: 14, opacity: ramp(t, 9, 10) }}>or a window if the<br />stairs are cut off</div>
        </div>
      </Row>
    )
  }
  return (
    <Row gap={90}>
      <div>
        {['Per-floor quantities', 'Estimated costs'].map((s, i) => (
          <div key={s} style={{ ...label, color: LINE, padding: '18px 0', borderBottom: `1px solid ${DIM}`, width: 430, opacity: ramp(t, 0.8 + i * 0.9, 1.6 + i * 0.9) }}>{s}</div>
        ))}
        <div style={{ display: 'flex', gap: 16, marginTop: 34 }}>
          {['CSV', 'DXF', 'JSON'].map((s, i) => (
            <div key={s} style={{ ...label, color: WARM, border: `2px solid ${WARM}`, padding: '12px 22px', opacity: ramp(t, 5.6 + i * 0.4, 6.2 + i * 0.4) }}>{s}</div>
          ))}
        </div>
      </div>
      <div style={{ opacity: ramp(t, 9, 10) }}>
        <div style={{ ...big, fontSize: 150 }}>186</div>
        <div style={label}>automated tests</div>
      </div>
    </Row>
  )
}

export function Explainer() {
  const frame = useCurrentFrame()
  const sec = frame / FPS
  const ci = Math.max(0, chapters.findIndex((c) => sec >= c.start && sec < c.end))
  const chapter = chapters[ci]
  const line = chapter.lines.find((l) => sec >= l.from && sec < l.to)
  const fade = Math.min(lin(sec, chapter.start, chapter.start + 0.4), 1 - lin(sec, chapter.end - 0.35, chapter.end))

  return (
    <AbsoluteFill style={{ background: INK }}>
      <DotField />
      <div style={{ position: 'absolute', top: 26, left: 40, ...label, fontSize: 20 }}>How ArchiTech works</div>
      <div style={{ opacity: fade }}>
        <Scene id={chapter.id} t={sec - chapter.start} />
      </div>
      <div style={{ position: 'absolute', left: 90, right: 90, bottom: 62, textAlign: 'center', fontFamily: SANS, fontSize: 31, fontWeight: 600, color: '#fff', lineHeight: 1.3, textShadow: '0 0 6px #000, 0 0 2px #000' }}>
        {line?.text}
      </div>
      <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, display: 'flex', gap: 4 }}>
        {chapters.map((c, i) => (
          <div key={c.id} style={{ flex: c.end - c.start }}>
            <div style={{ ...label, fontSize: 14, padding: '0 0 6px 8px', color: i === ci ? LINE : DIM, opacity: i === ci ? 1 : 0.6 }}>{c.title}</div>
            <div style={{ height: 6, background: '#1b2a3f' }}>
              <div style={{ height: '100%', width: `${lin(sec, c.start, c.end) * 100}%`, background: WARM }} />
            </div>
          </div>
        ))}
      </div>
    </AbsoluteFill>
  )
}
